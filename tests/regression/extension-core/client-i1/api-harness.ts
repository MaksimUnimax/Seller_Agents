import { createHash, generateKeyPairSync, randomBytes } from "node:crypto";
import { createApiApp } from "../../../../apps/api/src/app.js";
import { createAuthRepository, createDatabaseRuntime, createDeviceAuthorizationRepository, createDeviceManagementRepository, createExtensionAuthRepository } from "@product/db";
import { AuthService, deriveAuthKeys } from "@product/auth";
import { DeviceAuthorizationService, deriveDeviceAuthKeys } from "@product/device-auth";
import { DeviceManagementService, PreEntitlementDeviceLimitResolver } from "@product/device-management";
import { ExtensionAuthService, deriveExtensionAuthKeys } from "@product/extension-auth";
import { BootstrapService } from "@product/bootstrap";
import { signBootstrapSnapshotV2 } from "@product/remote-config";

const root = randomBytes(32);
const signing = generateKeyPairSync("ed25519");
const accessSigning = { privateKey: signing.privateKey, publicKey: signing.publicKey, keyId: "i1-client-local" };
const database = createDatabaseRuntime(process.env.DATABASE_URL!);
const auth = new AuthService(createAuthRepository(database), deriveAuthKeys(root), undefined, () => "424242");
const deviceAuth = new DeviceAuthorizationService(createDeviceAuthorizationRepository(database), deriveDeviceAuthKeys(root));
const deviceManagement = new DeviceManagementService(createDeviceManagementRepository(database), root, accessSigning, new PreEntitlementDeviceLimitResolver());
const extensionAuth = new ExtensionAuthService(createExtensionAuthRepository(database), deriveExtensionAuthKeys(root), undefined, accessSigning);
const bootstrap = new BootstrapService({ resolve: async () => ({ configVersion: 1, signingKeyId: "i1-client-local", sourceFingerprintSha256: createHash("sha256").update(signing.publicKey.export({ format: "der", type: "spki" })).digest("hex"), compatibility: { extension: { status: "SUPPORTED", minimumVersion: null }, browser: { status: "SUPPORTED" } }, features: {} }) }, { signV2: async (keyId, payload) => signBootstrapSnapshotV2(payload, keyId, signing.privateKey) });
const app = createApiApp({ config: { environment: "test", databaseUrl: process.env.DATABASE_URL!, logLevel: "warn", apiPort: 43100, workerReadyDelayMs: 0 }, isInfrastructureReady: async () => true, authService: auth, deviceAuthorizationService: deviceAuth, deviceManagementService: deviceManagement, extensionAuthService: extensionAuth, bootstrapService: bootstrap });
void (async () => {
  await app.listen({ host: "127.0.0.1", port: 43100 });
  process.once("SIGINT", async () => { await app.close(); await database.close(); });
  process.once("SIGTERM", async () => { await app.close(); await database.close(); });
})();
