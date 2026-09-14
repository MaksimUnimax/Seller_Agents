"""Reproduce the frozen extension baselines without source-repository access.

Only files named by the reviewed import manifest enter a baseline archive.
These archives are migration/regression inputs, not the combined beta product.
"""
from pathlib import Path
import argparse
import hashlib
import json
import shutil
import zipfile

ROOT = Path(__file__).resolve().parents[2]
EVIDENCE = ROOT / "docs/migration/evidence/extensions-2026-09-14"
IMPORT = ROOT / "docs/migration/evidence/extension-import-2026-09-14/IMPORT_MANIFEST.json"
OZON_REL = Path("tooling/llm-api-bridges/ozon-seller")
PREFIXES = {
    "ozon": "apps/extension/src/imported/ozon-v0.1.22/",
    "wildberries": "migration/reference/wildberries-v0.3.0/runtime/",
}


def read_json(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))


def write_json(path, value):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def sha256(data):
    return hashlib.sha256(data).hexdigest()


def runtime_rows(component):
    return [r for r in read_json(EVIDENCE / "RUNTIME_FILE_MAP.json")["files"]
            if r["component"] == component]


def check_runtime(component, directory):
    directory = Path(directory)
    rows = runtime_rows(component)
    actual = {p.relative_to(directory).as_posix() for p in directory.rglob("*") if p.is_file()}
    expected = {r["relative_runtime_path"] for r in rows}
    assert actual == expected, (component, "runtime inventory mismatch", actual ^ expected)
    assert not any(p.is_symlink() for p in directory.rglob("*")), "Symlink in runtime"
    for row in rows:
        data = (directory / row["relative_runtime_path"]).read_bytes()
        assert sha256(data) == row["source_sha256"], row["relative_runtime_path"]
    return len(rows)


def verify_import():
    manifest = read_json(IMPORT)
    mapped = read_json(EVIDENCE / "RUNTIME_FILE_MAP.json")["files"]
    inputs = read_json(EVIDENCE / "TEST_AND_AUTHORITY_INPUTS.json")["inputs"]
    planned = {r["planned_d1_path"]: r for r in mapped}
    planned.update({r["planned_target_path"]: r for r in inputs if r["planned_target_path"]})
    assert len(planned) == manifest["imported_file_count"] == 232
    assert {r["target_path"] for r in manifest["files"]} == set(planned)
    for row in manifest["files"]:
        path = ROOT / row["target_path"]
        assert not path.is_symlink(), row["target_path"]
        data = path.read_bytes()
        source = planned[row["target_path"]]
        blob = hashlib.sha1(b"blob " + str(len(data)).encode() + b"\0" + data).hexdigest()
        assert blob == row["source_git_blob_sha"] == source["source_git_blob_sha"], str(path)
        assert len(data) == row["bytes"] == source["source_bytes"], str(path)
        assert sha256(data) == row["sha256"], str(path)
    graphs = read_json(EVIDENCE / "RUNTIME_LOAD_GRAPH.json")["components"]
    for component, prefix in PREFIXES.items():
        directory = ROOT / prefix
        check_runtime(component, directory)
        manifest_json = read_json(directory / "manifest.json")
        assert manifest_json == graphs[component]["manifest"]
        # Source byte identity proves ordered imports are unchanged. Also resolve
        # every recorded resource edge against the transferred tree.
        for edge in graphs[component]["ordered_edges"]:
            assert (directory / edge["from"]).is_file() and (directory / edge["to"]).is_file()
    return {"status": "PASS", "imported_files": 232, "runtime_files": 76,
            "support_files": 156, "source_byte_changes": 0,
            "import_manifest_sha256": sha256(IMPORT.read_bytes())}


def prepare_ozon_layout(destination, runtime):
    """Restore only the declared old relative layout; do not copy all validation."""
    destination = Path(destination)
    ozon = destination / OZON_REL
    ozon.mkdir(parents=True, exist_ok=False)
    shutil.copytree(runtime, ozon / "dist-step7-candidate")
    prefix = "tests/regression/imported/ozon-v0.1.22/"
    for row in read_json(IMPORT)["files"]:
        if row["target_path"].startswith(prefix):
            target = ozon / row["target_path"][len(prefix):]
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(ROOT / row["target_path"], target)
    return ozon


def build_baseline(component, output):
    output = Path(output)
    output.mkdir(parents=True, exist_ok=False)
    source = ROOT / PREFIXES[component]
    count = check_runtime(component, source)
    rows = sorted(runtime_rows(component), key=lambda r: r["relative_runtime_path"])
    version = read_json(source / "manifest.json")["version"]
    name = f"SELLER_AGENTS_IMPORT_{component}_{version}_baseline.zip"

    def pack(path):
        with zipfile.ZipFile(path, "w", compression=zipfile.ZIP_STORED) as archive:
            for row in rows:
                entry = zipfile.ZipInfo(row["relative_runtime_path"], (1980, 1, 1, 0, 0, 0))
                entry.create_system = 3
                entry.external_attr = 0o100644 << 16
                archive.writestr(entry, (source / row["relative_runtime_path"]).read_bytes())

    archive = output / name
    repeat = output / (name + ".repeat")
    pack(archive)
    pack(repeat)
    assert archive.read_bytes() == repeat.read_bytes(), "Non-deterministic archive"
    repeat.unlink()
    extracted = output / "extracted"
    with zipfile.ZipFile(archive) as z:
        assert z.namelist() == [r["relative_runtime_path"] for r in rows]
        assert len(z.namelist()) == len(set(z.namelist()))
        z.extractall(extracted)
    check_runtime(component, extracted)
    receipt = {"component": component, "version": version, "files": count,
               "source_commit": rows[0]["source_commit"], "archive": name,
               "bytes": archive.stat().st_size, "sha256": sha256(archive.read_bytes()),
               "repeat_archive_match": True, "source_extracted_bytes_match": True,
               "format": "ZIP_STORED, sorted files only, UTC-independent 1980 timestamp, Unix 0644",
               "purpose": "MIGRATION_BASELINE_NOT_COMBINED_PRODUCT",
               "installed_acceptance": False}
    write_json(output / "BUILDINFO.json", receipt)
    return extracted, receipt


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("component", choices=PREFIXES)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    verify_import()
    _, receipt = build_baseline(args.component, args.output.resolve())
    print(json.dumps(receipt, ensure_ascii=False))
