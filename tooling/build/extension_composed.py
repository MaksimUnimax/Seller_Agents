"""Compose the first common-core development carrier from reviewed inputs."""
from pathlib import Path
import argparse
import importlib.util
import re
import shutil
import sys
import zipfile

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location("extension_baseline", ROOT / "tooling/build/extension_baseline.py")
baseline = importlib.util.module_from_spec(spec)
spec.loader.exec_module(baseline)
RECIPE = ROOT / "apps/extension/composition.json"


def read_input(relative, inputs):
    path = ROOT / relative
    assert path.resolve().is_relative_to(ROOT) and not path.is_symlink(), relative
    data = path.read_bytes()
    inputs[relative] = {"sha256": baseline.sha256(data), "bytes": len(data)}
    return data


def compose(directory):
    directory = Path(directory)
    directory.mkdir(parents=True, exist_ok=False)
    baseline.verify_import()
    recipe = baseline.read_json(RECIPE)
    assert recipe["version"] == "0.2.0" and recipe["stage"] == "D2.1"
    inputs = {}
    read_input("apps/extension/composition.json", inputs)
    output = {}
    for row in baseline.runtime_rows("ozon"):
        relative = row["relative_runtime_path"]
        output[relative] = read_input(recipe["baseline"] + "/" + relative, inputs)
    for target, sources in recipe["bundles"].items():
        assert target in output
        output[target] = b"\n;\n".join(read_input(source, inputs) for source in sources)
    worker = output["service_worker.js"].decode("utf-8")
    for row in recipe["worker_function_replacements"]:
        pattern = r"(?ms)^(?:async )?function " + re.escape(row["function"]) + r"\(.*?^}"
        matches = list(re.finditer(pattern, worker))
        assert len(matches) == 1, row["function"]
        match = matches[0]
        assert baseline.sha256(match.group().encode()) == row["source_sha256"], row["function"]
        replacement = read_input(row["replacement"], inputs).decode().rstrip()
        worker = worker[:match.start()] + replacement + worker[match.end():]
    init = recipe["worker_initializer"]
    assert worker.count(init["old"]) == 1
    worker = worker.replace(init["old"], read_input(init["replacement"], inputs).decode().rstrip())
    output["service_worker.js"] = read_input(recipe["worker_prelude"], inputs) + b"\n;\n" + worker.encode()
    # This is a distinct development package. The frozen donor stays untouched.
    for relative, data in output.items():
        data = data.replace(b"0.1.22", recipe["version"].encode())
        target = directory / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(data)
    manifest_path = directory / "manifest.json"
    manifest = baseline.read_json(manifest_path)
    manifest["name"] = "Seller Agents Development (Ozon)"
    baseline.write_json(manifest_path, manifest)
    files = [{"path": p.relative_to(directory).as_posix(), "sha256": baseline.sha256(p.read_bytes()),
              "bytes": p.stat().st_size} for p in sorted(directory.rglob("*")) if p.is_file()]
    assert len(files) == 36
    return {"stage": recipe["stage"], "version": recipe["version"], "purpose": recipe["purpose"],
            "inputs": inputs, "files": files, "installed_acceptance": False}


def build(output):
    output = Path(output)
    output.mkdir(parents=True, exist_ok=False)
    runtime = output / "runtime"
    receipt = compose(runtime)
    second = output / "repeat-runtime"
    assert compose(second) == receipt
    name = "SELLER_AGENTS_D2_1_v0.2.0_DEVELOPMENT.zip"
    archive = output / name
    repeat = output / "repeat.zip"
    for source, target in [(runtime, archive), (second, repeat)]:
        with zipfile.ZipFile(target, "w", compression=zipfile.ZIP_STORED) as zip_file:
            for row in receipt["files"]:
                info = zipfile.ZipInfo(row["path"], date_time=(1980, 1, 1, 0, 0, 0))
                info.create_system = 3
                info.external_attr = 0o100644 << 16
                zip_file.writestr(info, (source / row["path"]).read_bytes())
    assert archive.read_bytes() == repeat.read_bytes()
    extracted = output / "extracted"
    with zipfile.ZipFile(archive) as zip_file:
        assert set(zip_file.namelist()) == {r["path"] for r in receipt["files"]}
        zip_file.extractall(extracted)
    for row in receipt["files"]:
        assert baseline.sha256((extracted / row["path"]).read_bytes()) == row["sha256"]
    receipt["package"] = {"name": name, "bytes": archive.stat().st_size,
                          "sha256": baseline.sha256(archive.read_bytes()),
                          "repeat_archive_match": True, "source_extracted_bytes_match": True}
    baseline.write_json(output / "composition-receipt.json", receipt)
    shutil.rmtree(second)
    repeat.unlink()
    return runtime, extracted, receipt


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    _, _, receipt = build(args.output.resolve())
    print(receipt["package"])
