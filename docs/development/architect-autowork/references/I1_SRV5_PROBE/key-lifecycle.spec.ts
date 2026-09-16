import { test, expect } from "@playwright/test";
test("worker keeps the public key ring supplied by the runner", async () => {
  const same = process.env.CONFIG_SIGNING_PUBLIC_KEY_RING_JSON === process.env.SRV5_REVIEW_PARENT_PUBLIC_RING;
  console.log("WORKER_PUBLIC_RING_EQUALS_RUNNER=" + same);
  expect(same).toBe(true);
});
