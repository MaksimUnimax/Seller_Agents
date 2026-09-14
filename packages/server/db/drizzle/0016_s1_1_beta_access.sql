ALTER TYPE "public"."admin_role" ADD VALUE 'ADMIN_BETA_OPERATOR';
--> statement-breakpoint
CREATE TYPE "public"."beta_mode" AS ENUM ('CLOSED', 'OPEN', 'PAUSED');
--> statement-breakpoint
CREATE TABLE "beta_admission_state" (
  "id" integer PRIMARY KEY NOT NULL,
  "mode" "beta_mode" NOT NULL DEFAULT 'CLOSED',
  "capacity" integer NOT NULL DEFAULT 0,
  "admitted" integer NOT NULL DEFAULT 0,
  "revision" integer NOT NULL DEFAULT 1,
  "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "beta_admission_state_singleton" CHECK ("id" = 1),
  CONSTRAINT "beta_admission_state_capacity_nonnegative" CHECK ("capacity" >= 0),
  CONSTRAINT "beta_admission_state_admitted_nonnegative" CHECK ("admitted" >= 0),
  CONSTRAINT "beta_admission_state_admitted_within_capacity" CHECK ("admitted" <= "capacity"),
  CONSTRAINT "beta_admission_state_revision_positive" CHECK ("revision" > 0)
);
--> statement-breakpoint
INSERT INTO "beta_admission_state" ("id") VALUES (1);
--> statement-breakpoint
CREATE TABLE "beta_admissions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "account_id" uuid NOT NULL,
  "user_id" uuid NOT NULL,
  "admitted_at" timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "beta_admissions_account_unique" UNIQUE ("account_id"),
  CONSTRAINT "beta_admissions_user_unique" UNIQUE ("user_id"),
  CONSTRAINT "beta_admissions_account_fk" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "beta_admissions_user_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE RESTRICT
);
--> statement-breakpoint
CREATE INDEX "beta_admissions_admitted_at_index" ON "beta_admissions" ("admitted_at");
--> statement-breakpoint
CREATE TABLE "otp_verify_replays" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "challenge_id" uuid NOT NULL,
  "idempotency_hash" varchar(128) NOT NULL,
  "user_id" uuid NOT NULL,
  "portal_session_id" uuid NOT NULL,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "expires_at" timestamp with time zone NOT NULL,
  CONSTRAINT "otp_verify_replays_challenge_unique" UNIQUE ("challenge_id"),
  CONSTRAINT "otp_verify_replays_challenge_idempotency_unique" UNIQUE ("challenge_id", "idempotency_hash"),
  CONSTRAINT "otp_verify_replays_challenge_fk" FOREIGN KEY ("challenge_id") REFERENCES "otp_challenges"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "otp_verify_replays_user_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "otp_verify_replays_portal_session_fk" FOREIGN KEY ("portal_session_id") REFERENCES "portal_sessions"("id") ON DELETE RESTRICT ON UPDATE RESTRICT
);
--> statement-breakpoint
CREATE INDEX "otp_verify_replays_expiry_index" ON "otp_verify_replays" ("expires_at");
--> statement-breakpoint
CREATE TABLE "beta_admission_mutations" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "request_id_hash" varchar(128) NOT NULL,
  "payload_hash" varchar(128) NOT NULL,
  "actor_principal_id" uuid NOT NULL,
  "action" varchar(32) NOT NULL,
  "old_mode" "beta_mode" NOT NULL,
  "old_capacity" integer NOT NULL,
  "old_admitted" integer NOT NULL,
  "old_revision" integer NOT NULL,
  "new_mode" "beta_mode" NOT NULL,
  "new_capacity" integer NOT NULL,
  "new_admitted" integer NOT NULL,
  "new_revision" integer NOT NULL,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "beta_admission_mutations_request_unique" UNIQUE ("request_id_hash"),
  CONSTRAINT "beta_admission_mutations_actor_fk" FOREIGN KEY ("actor_principal_id") REFERENCES "admin_principals"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "beta_admission_mutations_action" CHECK ("action" IN ('OPEN', 'PAUSE', 'CLOSE', 'ADD_CAPACITY', 'SET_CAPACITY')),
  CONSTRAINT "beta_admission_mutations_capacity_nonnegative" CHECK ("old_capacity" >= 0 AND "new_capacity" >= 0),
  CONSTRAINT "beta_admission_mutations_admitted_nonnegative" CHECK ("old_admitted" >= 0 AND "new_admitted" >= 0),
  CONSTRAINT "beta_admission_mutations_admitted_within_capacity" CHECK ("old_admitted" <= "old_capacity" AND "new_admitted" <= "new_capacity"),
  CONSTRAINT "beta_admission_mutations_revision_positive" CHECK ("old_revision" > 0 AND "new_revision" > 0)
);
--> statement-breakpoint
CREATE INDEX "beta_admission_mutations_created_at_index" ON "beta_admission_mutations" ("created_at");
