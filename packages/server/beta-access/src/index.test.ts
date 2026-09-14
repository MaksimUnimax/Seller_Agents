import { describe, expect, it } from "vitest";
import {
  BetaAdmissionService,
  betaPayloadHash,
  betaRequestIdHash,
} from "./index.js";

describe("S1.1 beta admission domain", () => {
  it("uses explicit modes and one-way request identities", () => {
    expect(betaRequestIdHash("request-123456789")).not.toContain(
      "request-123456789",
    );
    expect(
      betaPayloadHash({
        requestId: "request-123456789",
        expectedRevision: 1,
        action: "ADD_CAPACITY",
        amount: 100,
        reason: "launch",
      }),
    ).toBe(
      betaPayloadHash({
        requestId: "request-123456789",
        expectedRevision: 1,
        action: "ADD_CAPACITY",
        amount: 100,
        reason: "launch",
      }),
    );
  });

  it("rejects malformed capacity commands before repository mutation", async () => {
    let calls = 0;
    const service = new BetaAdmissionService({
      resolve: async () => ({ kind: "NONE" }),
      read: async () => ({
        mode: "CLOSED",
        capacity: 0,
        admitted: 0,
        remaining: 0,
        revision: 1,
        updatedAt: new Date(),
      }),
      mutate: async () => {
        calls += 1;
        return { kind: "CONFLICT" };
      },
    });
    await expect(
      service.mutate({
        actorPrincipalId: "actor",
        requestId: "request-123456789",
        correlationId: "corr",
        expectedRevision: 1,
        action: "ADD_CAPACITY",
        amount: 0,
        reason: "bad",
      }),
    ).resolves.toEqual({ kind: "CONFLICT" });
    expect(calls).toBe(0);
  });
});
