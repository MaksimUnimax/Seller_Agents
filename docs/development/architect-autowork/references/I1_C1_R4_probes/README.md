# R4 targeted probes

Candidate60c3a34bdc1b6a5563fad59e8ac38c78b76e32d3. Run probe.mjs with Node24.

Reconstruct dependencies beside probe.mjs from this exact candidate:
- worker-harness.mjs <- tests/regression/extension-core/worker-harness.mjs (blob b84d9e0cba9d8b196deb569176d13324ea9742c1)
- runtime/client.js <- packages/control-client/src/client.js (blob a7c6afdbde242f08ae39c39059c094588e468968)
- runtime/crypto.js <- packages/control-client/src/crypto.js (blob c1fbb7671bb363e4ca6210e9243ac58b1a304561)
- runtime/config.js <- packages/control-client/src/config.js
- runtime/service_worker_entry.js contains only the importScripts call loading config.js, crypto.js and client.js in that order.

source-functions.json holds exact extracted saPopupState, tabIdentity and normalizeTabId functions. Browser tab transport, normalized positive identity and other downstream dependencies are controlled. The unsupported-tab probe error is fixture-generated IDENTITY_UNAVAILABLE, not a claimed captured installed error code. The proof is that identity failure prevents reading auth state; independent CI proves the empty popup symptom. The client probes use real matching client/verifier modules and Ed25519 fixture signing. No live, installed or PostgreSQL acceptance is claimed.
