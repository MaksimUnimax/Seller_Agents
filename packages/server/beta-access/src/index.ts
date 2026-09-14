import { createHash } from "node:crypto";

export const BETA_MODES = ["CLOSED", "OPEN", "PAUSED"] as const;
export type BetaMode = (typeof BETA_MODES)[number];

export type BetaAdmissionState = {
  mode: BetaMode;
  capacity: number;
  admitted: number;
  remaining: number;
  revision: number;
  updatedAt: Date;
};

export type BetaDeviceAdmission = {
  kind: "BETA_UNLIMITED_FOR_COMMERCIAL_COUNT";
};
export type BetaAccessResolution = { kind: "BETA" } | { kind: "NONE" };

export type BetaAdminAction =
  | "OPEN"
  | "PAUSE"
  | "CLOSE"
  | "ADD_CAPACITY"
  | "SET_CAPACITY";

export type BetaAdmissionRepository = {
  resolve(accountId: string): Promise<BetaAccessResolution>;
  read(): Promise<BetaAdmissionState>;
  mutate(input: {
    actorPrincipalId: string;
    requestIdHash: string;
    payloadHash: string;
    correlationId: string;
    expectedRevision: number;
    action: BetaAdminAction;
    amount?: number;
    capacity?: number;
    reason: string;
  }): Promise<
    | { kind: "APPLIED"; state: BetaAdmissionState; replay: boolean }
    | { kind: "STALE" | "CONFLICT" | "FORBIDDEN" }
  >;
};

export type BetaAdminInput = {
  actorPrincipalId: string;
  requestId: string;
  correlationId: string;
  expectedRevision: number;
  action: BetaAdminAction;
  amount?: number;
  capacity?: number;
  reason: string;
};

export function safeBetaInteger(value: number): boolean {
  return Number.isSafeInteger(value) && value >= 0 && value <= 2_147_483_647;
}

function digest(label: string, value: string): string {
  return `v1:${createHash("sha256").update(`${label}:${value}`, "utf8").digest("base64url")}`;
}

export function betaRequestIdHash(value: string): string {
  return digest("beta-admin-request-id", value);
}

export function betaPayloadHash(
  input: Omit<BetaAdminInput, "actorPrincipalId" | "correlationId">,
): string {
  return digest(
    "beta-admin-payload",
    JSON.stringify({
      requestId: input.requestId,
      expectedRevision: input.expectedRevision,
      action: input.action,
      amount: input.amount ?? null,
      capacity: input.capacity ?? null,
      reason: input.reason,
    }),
  );
}

export class BetaAdmissionService {
  public constructor(private readonly repository: BetaAdmissionRepository) {}

  resolve(accountId: string): Promise<BetaAccessResolution> {
    return this.repository.resolve(accountId);
  }

  read(): Promise<BetaAdmissionState> {
    return this.repository.read();
  }

  mutate(input: BetaAdminInput) {
    if (!safeBetaInteger(input.expectedRevision) || input.expectedRevision < 1)
      return Promise.resolve({ kind: "CONFLICT" as const });
    if (
      input.action === "ADD_CAPACITY" &&
      (input.amount === undefined ||
        !safeBetaInteger(input.amount) ||
        input.amount < 1)
    )
      return Promise.resolve({ kind: "CONFLICT" as const });
    if (
      input.action === "SET_CAPACITY" &&
      (input.capacity === undefined || !safeBetaInteger(input.capacity))
    )
      return Promise.resolve({ kind: "CONFLICT" as const });
    return this.repository.mutate({
      ...input,
      requestIdHash: betaRequestIdHash(input.requestId),
      payloadHash: betaPayloadHash(input),
    });
  }
}
