import { createPublicKey, randomUUID, type KeyObject } from "node:crypto";
import { expect, test } from "@playwright/test";
import { SignedBootstrapEnvelopeV2Schema } from "../../../packages/contracts/src/index.js";
import { verifyBootstrapEnvelopeV2 } from "../../../packages/server/remote-config/src/index.js";
import {
  activateExtensionClient,
  accountId,
  apiOrigin,
  credentials,
  reset,
  seedBootstrapConfig,
} from "./support/fixtures.js";

const v2Request = (deviceId: string) => ({
  contractVersion: "control_plane_v2" as const,
  extensionVersion: "1.2.3",
  browser: { family: "chrome" as const, version: "123" },
  deviceId,
  lastConfigVersion: null,
  detectedAi: { family: "chat" as const, surface: "page" as const },
});

function packagedK1TrustMap(): ReadonlyMap<string, KeyObject> {
  const ring = JSON.parse(
    process.env.CONFIG_SIGNING_PUBLIC_KEY_RING_JSON ?? "[]",
  ) as Array<{ keyId: string; publicKeySpkiDerB64: string }>;
  const entry = ring.find(({ keyId }) => keyId === "e2e-config-k1");
  if (!entry) throw new Error("e2e-config-k1 public key is absent");
  return new Map([
    [
      entry.keyId,
      createPublicKey({
        key: Buffer.from(entry.publicKeySpkiDerB64, "base64"),
        format: "der",
        type: "spki",
      }),
    ],
  ]);
}

async function postBootstrap(
  accessToken: string,
  body: unknown,
): Promise<{ status: number; body: unknown }> {
  const response = await fetch(`${apiOrigin}/v1/bootstrap`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });
  return { status: response.status, body: await response.json() };
}

function errorCode(body: unknown): string | undefined {
  if (typeof body !== "object" || body === null || !("error" in body))
    return undefined;
  const error = (body as { error?: unknown }).error;
  if (typeof error !== "object" || error === null || !("code" in error))
    return undefined;
  const code = (error as { code?: unknown }).code;
  return typeof code === "string" ? code : undefined;
}

test.beforeEach(async () => reset());

test("I1-SRV.5 reference activation, V2 bootstrap, rotation, continuity, and revoke", async ({
  page,
}) => {
  const extension = await activateExtensionClient(page);
  await seedBootstrapConfig({ contractVersion: "control_plane_v2" });
  const trustMap = packagedK1TrustMap();
  const expectedAccountId = await accountId();
  const initial = { ...(await credentials(extension)) };

  const firstResponse = await postBootstrap(
    initial.accessToken,
    v2Request(initial.deviceId),
  );
  expect(firstResponse.status).toBe(200);
  const firstEnvelope = SignedBootstrapEnvelopeV2Schema.parse(
    firstResponse.body,
  );
  const firstVerification = verifyBootstrapEnvelopeV2(firstEnvelope, trustMap);
  expect(firstVerification).toMatchObject({ ok: true });
  if (!firstVerification.ok)
    throw new Error("initial V2 bootstrap did not verify");
  expect(firstVerification.payload.account.id).toBe(expectedAccountId);
  expect(firstVerification.payload.account.status).toBe("ACTIVE");
  expect(firstVerification.payload.contractVersion).toBe("control_plane_v2");
  expect(firstVerification.payload.snapshotVersion).toBe(
    "bootstrap_snapshot_v2",
  );
  expect(firstEnvelope.envelopeVersion).toBe("bootstrap_envelope_v2");

  const decodedPayload = JSON.parse(
    Buffer.from(firstEnvelope.payload, "base64url").toString("utf8"),
  ) as { account: { id: string } };
  const tamperedEnvelope = {
    ...firstEnvelope,
    payload: Buffer.from(
      JSON.stringify({
        ...decodedPayload,
        account: { ...decodedPayload.account, id: randomUUID() },
      }),
    ).toString("base64url"),
  };
  expect(tamperedEnvelope.signature === firstEnvelope.signature).toBe(true);
  expect(verifyBootstrapEnvelopeV2(tamperedEnvelope, trustMap)).toMatchObject({
    ok: false,
    error: "INVALID_SIGNATURE",
  });
  expect(verifyBootstrapEnvelopeV2(firstEnvelope, new Map())).toEqual({
    ok: false,
    error: "UNKNOWN_SIGNING_KEY",
  });

  const injectedAccount = await postBootstrap(initial.accessToken, {
    ...v2Request(initial.deviceId),
    accountId: randomUUID(),
  });
  expect(injectedAccount.status).toBe(400);
  const mismatchedDevice = await postBootstrap(
    initial.accessToken,
    v2Request(randomUUID()),
  );
  expect(mismatchedDevice.status).toBe(403);
  expect(errorCode(injectedAccount.body)).toBe("INVALID_REQUEST");
  expect(errorCode(mismatchedDevice.body)).toBe("DEVICE_MISMATCH");

  const afterNegativeRequests = await credentials(extension);
  expect(afterNegativeRequests.deviceId).toBe(initial.deviceId);
  expect(afterNegativeRequests.sessionId).toBe(initial.sessionId);
  expect(afterNegativeRequests.accessToken === initial.accessToken).toBe(true);
  expect(afterNegativeRequests.refreshToken === initial.refreshToken).toBe(
    true,
  );

  expect(await extension.refresh("i1-srv5-reference-refresh-20260916-01")).toBe(
    true,
  );
  const rotated = { ...(await credentials(extension)) };
  expect(rotated.deviceId).toBe(initial.deviceId);
  expect(rotated.sessionId).toBe(initial.sessionId);
  expect(rotated.refreshToken === initial.refreshToken).toBe(false);

  const rotatedResponse = await postBootstrap(
    rotated.accessToken,
    v2Request(rotated.deviceId),
  );
  expect(rotatedResponse.status).toBe(200);
  const rotatedEnvelope = SignedBootstrapEnvelopeV2Schema.parse(
    rotatedResponse.body,
  );
  const rotatedVerification = verifyBootstrapEnvelopeV2(
    rotatedEnvelope,
    trustMap,
  );
  expect(rotatedVerification).toMatchObject({ ok: true });
  if (!rotatedVerification.ok)
    throw new Error("rotated V2 bootstrap did not verify");
  expect(rotatedVerification.payload.account.id).toBe(expectedAccountId);
  expect(rotatedVerification.payload.account.status).toBe("ACTIVE");
  expect(rotatedVerification.payload.contractVersion).toBe("control_plane_v2");
  expect(rotatedVerification.payload.snapshotVersion).toBe(
    "bootstrap_snapshot_v2",
  );
  expect(rotatedEnvelope.envelopeVersion).toBe("bootstrap_envelope_v2");

  await page.goto("/devices");
  const revokeButtons = page.getByRole("button", { name: "Revoke" });
  await expect(revokeButtons).toHaveCount(1);
  await revokeButtons.click();
  await expect(page.getByText(/E2E Chrome — REVOKED/)).toBeVisible();

  const revokedBootstrap = await postBootstrap(
    rotated.accessToken,
    v2Request(rotated.deviceId),
  );
  expect(revokedBootstrap.status).toBe(401);
  expect(errorCode(revokedBootstrap.body)).toBe("UNAUTHORIZED");
  expect(await extension.refresh("i1-srv5-reference-revoke-refresh-01")).toBe(
    false,
  );
  await expect(credentials(extension)).rejects.toThrow(
    "activation credentials are absent",
  );

  const repeatedRevokedBootstrap = await postBootstrap(
    rotated.accessToken,
    v2Request(rotated.deviceId),
  );
  expect(repeatedRevokedBootstrap.status).toBe(401);
  expect(errorCode(repeatedRevokedBootstrap.body)).toBe("UNAUTHORIZED");
});
