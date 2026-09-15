"""Installed local API/portal/PostgreSQL acceptance for the extension client.

The database URL must point at a disposable loopback database. The API harness
generates its signing key at process start and exports only the public bundle;
the private key remains in that API process and is never copied to the package.
"""
from pathlib import Path
import argparse, json, os, re, subprocess, tempfile, time, urllib.request
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[3]
NODE = os.environ.get("SA_NODE_BIN", "node")
PNPM = os.environ.get("SA_PNPM_BIN", "pnpm")

def wait_for(url, timeout=60):
    deadline = time.monotonic() + timeout
    while time.monotonic() < deadline:
        try:
            with urllib.request.urlopen(url, timeout=2) as response:
                if response.status < 500:
                    return
        except Exception:
            pass
        time.sleep(.25)
    raise RuntimeError(f"timed out waiting for {url}")

def run(runtime, output):
    if os.environ.get("PRODUCT_CONTROL_PLANE_E2E") != "1":
        raise RuntimeError("PRODUCT_CONTROL_PLANE_E2E=1 is required")
    if not os.environ.get("DATABASE_URL"):
        raise RuntimeError("DATABASE_URL is required")
    output.mkdir(parents=True, exist_ok=False)
    api_port, portal_port = "43100", "43101"
    env = {**os.environ, "SA_I1_API_PORT": api_port}
    processes = []
    result = {"status": "RUNNING", "installed_acceptance": False, "otp": "development fixed OTP; not email evidence", "live_provider_calls": 0}
    with tempfile.TemporaryDirectory(prefix="seller-agents-i1-local-") as temp:
        temp_path = Path(temp)
        trust_path = temp_path / "public-trust-bundle.json"
        private_placeholder = temp_path / "unused-private-key.der"
        try:
            subprocess.run([PNPM, "db:migrate"], cwd=ROOT, env=env, check=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
            api_env = {**env, "SA_I1_PUBLIC_TRUST_BUNDLE_PATH": str(trust_path)}
            api = subprocess.Popen([PNPM, "--filter", "@product/api", "exec", "tsx", "../../tests/regression/extension-core/client-i1/api-harness.ts"], cwd=ROOT, env=api_env, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
            processes.append(api)
            wait_for(f"http://127.0.0.1:{api_port}/health/ready")
            if not trust_path.exists():
                raise RuntimeError("API did not export public trust bundle")
            config = subprocess.check_output([NODE, str(ROOT / "tests/regression/extension-core/client-i1/make-browser-config.mjs"), str(private_placeholder), str(trust_path)], cwd=ROOT, env=env, text=True)
            package_root = temp_path / "package"
            build_env = {**env, "SA_PACKAGED_CONFIG_JSON": config}
            subprocess.run(["python", "tooling/build/extension_composed.py", "--output", str(package_root)], cwd=ROOT, env=build_env, check=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
            portal_env = {**env, "CONTROL_PLANE_API_ORIGIN": f"http://127.0.0.1:{api_port}"}
            portal = subprocess.Popen([PNPM, "--filter", "@product/portal", "exec", "next", "dev", "--hostname", "127.0.0.1", "--port", portal_port], cwd=ROOT, env=portal_env, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
            processes.append(portal)
            wait_for(f"http://127.0.0.1:{portal_port}/login")
            fixture = (ROOT / "tests/regression/extension-core/fixtures/application-chat.html").read_text()
            with sync_playwright() as playwright, tempfile.TemporaryDirectory(prefix="seller-agents-i1-browser-") as profile:
                options = {"headless": True, "args": ["--no-sandbox", f"--disable-extensions-except={package_root / 'runtime'}", f"--load-extension={package_root / 'runtime'}"]}
                if os.environ.get("SA_TEST_CHROMIUM"):
                    options["executable_path"] = os.environ["SA_TEST_CHROMIUM"]
                else:
                    options["channel"] = "chromium"
                context = playwright.chromium.launch_persistent_context(profile, **options)
                try:
                    context.route("https://**/*", lambda route: route.fulfill(body=fixture, content_type="text/html") if route.request.url.startswith("https://chatgpt.com/c/") else route.abort())
                    worker = context.service_workers[0] if context.service_workers else context.wait_for_event("serviceworker")
                    chat = context.new_page()
                    chat.goto("https://chatgpt.com/c/11111111-1111-4111-8111-111111111111")
                    popup = context.new_page()
                    popup.on("dialog", lambda dialog: dialog.accept())
                    popup.goto(worker.url.rsplit("/", 1)[0] + "/popup.html")

                    def activate(email):
                        with context.expect_page() as page_info:
                            popup.click("#auth-start")
                        portal_page = page_info.value
                        portal_page.wait_for_load_state()
                        if "/login" in portal_page.url:
                            portal_page.locator('input[type="email"]').fill(email)
                            portal_page.get_by_role("button", name="Send code").click()
                            portal_page.locator('input[inputmode="numeric"]').fill("424242")
                            portal_page.get_by_role("button", name="Verify").click()
                            portal_page.wait_for_url("**/activate?authorizationId=*")
                        code = re.search(r"[A-Z0-9]{4}-[A-Z0-9]{4}", popup.locator("#auth-code").inner_text()).group(0)
                        portal_page.locator("select").select_option(index=1)
                        portal_page.get_by_label("User code").fill(code)
                        portal_page.get_by_role("button", name="Approve").click()
                        portal_page.get_by_role("status").wait_for()
                        portal_page.close()
                        popup.wait_for_function("document.querySelector('#account').innerText.includes('Аккаунт ·')")

                    activate("i1-client-one@example.test")
                    first_account = popup.locator("#account").inner_text()
                    popup.click("#wildberries")
                    popup.click("#add")
                    popup.fill("#token", "FIXTURE_BROWSER_PERSONAL_TOKEN")
                    popup.fill("#name", "Аккаунт A WB")
                    popup.click("#save")
                    popup.wait_for_function("document.querySelector('#stores').innerText.includes('Аккаунт A WB')")
                    # Portal logout only clears the portal cookie; extension D3 logout is not tested here.
                    portal_page = context.new_page()
                    portal_page.goto(f"http://127.0.0.1:{portal_port}/")
                    portal_page.evaluate("""async () => { const csrf = document.cookie.split(';').map(x => x.trim()).find(x => x.startsWith('pcp_csrf=')); await fetch('/api/control-plane/v1/auth/logout', {method:'POST', headers: csrf ? {'x-csrf-token': csrf.slice(9)} : {}}); }""")
                    portal_page.close()
                    popup.click("#auth-reset")
                    popup.wait_for_function("!document.querySelector('#auth-reset').hidden && document.querySelector('#auth-start').offsetParent !== null")
                    activate("i1-client-two@example.test")
                    assert popup.locator("#account").inner_text() != first_account
                    assert "Аккаунт A WB" not in popup.locator("#stores").inner_text()
                    result.update(status="PASS", installed_acceptance=True, browser=context.browser.version, checks=["real API device start", "portal OTP/approve", "device exchange", "browser V2 bootstrap", "account-scoped WB catalog", "account reset and second account isolation"])
                finally:
                    context.close()
        except Exception as error:
            result.update(status="FAIL", error=str(error))
            raise
        finally:
            for process in reversed(processes):
                if process.poll() is None:
                    process.terminate()
            for process in reversed(processes):
                try:
                    process.wait(timeout=10)
                except subprocess.TimeoutExpired:
                    process.kill()
            (output / "result.json").write_text(json.dumps(result, ensure_ascii=False, indent=2))
    print(json.dumps(result, ensure_ascii=False))

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--runtime", type=Path, required=False)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    run(args.runtime.resolve() if args.runtime else Path("."), args.output.resolve())
