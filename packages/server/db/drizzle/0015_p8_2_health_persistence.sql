CREATE TYPE "public"."health_suite_kind" AS ENUM ('BASELINE_CONTRACT_FIXTURE');
--> statement-breakpoint
CREATE TYPE "public"."health_incident_status" AS ENUM ('OPEN', 'INVESTIGATING', 'CANDIDATE_FIX', 'CANDIDATE_PASS', 'CANARY_ROLLOUT', 'ROLLOUT', 'RESOLVED', 'FALSE_POSITIVE', 'MAINTENANCE');
--> statement-breakpoint
CREATE TABLE "health_suite_revisions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "machine_key" varchar(64) NOT NULL,
  "revision" integer NOT NULL,
  "suite_kind" "health_suite_kind" NOT NULL,
  "definition" jsonb NOT NULL,
  "definition_sha256" varchar(64) NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "health_suite_revisions_machine_revision_unique" UNIQUE("machine_key", "revision"),
  CONSTRAINT "health_suite_revisions_revision_positive" CHECK ("revision" > 0),
  CONSTRAINT "health_suite_revisions_definition_object" CHECK (jsonb_typeof("definition") = 'object'),
  CONSTRAINT "health_suite_revisions_definition_checksum_format" CHECK ("definition_sha256" ~ '^[0-9a-f]{64}$')
);
--> statement-breakpoint
CREATE FUNCTION p8_2_health_suite_revision_guard() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'P8.2 health suite revisions are immutable' USING ERRCODE = '55000';
END;
$$;
--> statement-breakpoint
CREATE TRIGGER p8_2_health_suite_revision_guard
BEFORE UPDATE OR DELETE ON "health_suite_revisions"
FOR EACH ROW EXECUTE FUNCTION p8_2_health_suite_revision_guard();
--> statement-breakpoint
CREATE TABLE "health_runs" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "suite_revision_id" uuid NOT NULL,
  "adapter_id" uuid NOT NULL,
  "surface_id" uuid NOT NULL,
  "variant_id" uuid,
  "profile_id" uuid NOT NULL,
  "profile_revision_id" uuid NOT NULL,
  "profile_revision" integer NOT NULL,
  "browser_family" varchar(32) NOT NULL,
  "browser_version" varchar(64) NOT NULL,
  "extension_version" varchar(64) NOT NULL,
  "adapter_engine_version" varchar(64) NOT NULL,
  "health_level" varchar(2) NOT NULL,
  "health_state" varchar(16) NOT NULL,
  "classifier_version" varchar(64) NOT NULL,
  "scope" jsonb NOT NULL,
  "scope_sha256" varchar(64) NOT NULL,
  "operator_maintenance" boolean NOT NULL,
  "operator_maintenance_authority" varchar(128),
  "started_at" timestamp with time zone NOT NULL,
  "completed_at" timestamp with time zone NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "health_runs_suite_revision_fk" FOREIGN KEY ("suite_revision_id") REFERENCES "health_suite_revisions"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "health_runs_adapter_fk" FOREIGN KEY ("adapter_id") REFERENCES "ai_adapters"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "health_runs_surface_adapter_fk" FOREIGN KEY ("surface_id", "adapter_id") REFERENCES "ai_surfaces"("id", "adapter_id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "health_runs_variant_surface_fk" FOREIGN KEY ("variant_id", "surface_id") REFERENCES "ai_variants"("id", "surface_id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "health_runs_profile_fk" FOREIGN KEY ("profile_id") REFERENCES "adapter_profiles"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "health_runs_profile_revision_hierarchy_fk" FOREIGN KEY ("profile_revision_id", "profile_id", "adapter_id", "surface_id", "variant_id") REFERENCES "adapter_profile_revisions"("id", "profile_id", "adapter_id", "surface_id", "variant_id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "health_runs_profile_revision_positive" CHECK ("profile_revision" > 0),
  CONSTRAINT "health_runs_browser_family" CHECK ("browser_family" IN ('chrome', 'yandex_chromium')),
  CONSTRAINT "health_runs_health_level" CHECK ("health_level" IN ('H0', 'H1', 'H2', 'H3', 'H4', 'H5')),
  CONSTRAINT "health_runs_health_state" CHECK ("health_state" IN ('HEALTHY', 'DRIFT', 'DEGRADED', 'BROKEN', 'UNKNOWN', 'MAINTENANCE')),
  CONSTRAINT "health_runs_scope_object" CHECK (jsonb_typeof("scope") = 'object'),
  CONSTRAINT "health_runs_scope_checksum_format" CHECK ("scope_sha256" ~ '^[0-9a-f]{64}$'),
  CONSTRAINT "health_runs_completed_after_started" CHECK ("completed_at" >= "started_at"),
  CONSTRAINT "health_runs_maintenance_authority" CHECK (NOT "operator_maintenance" OR "operator_maintenance_authority" IS NOT NULL)
);
--> statement-breakpoint
CREATE FUNCTION p8_2_health_run_guard() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'P8.2 completed health runs are immutable' USING ERRCODE = '55000';
END;
$$;
--> statement-breakpoint
CREATE TRIGGER p8_2_health_run_guard
BEFORE UPDATE OR DELETE ON "health_runs"
FOR EACH ROW EXECUTE FUNCTION p8_2_health_run_guard();
--> statement-breakpoint
CREATE INDEX "health_runs_scope_index" ON "health_runs" ("scope_sha256", "created_at" DESC);
--> statement-breakpoint
CREATE TABLE "health_contour_results" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "run_id" uuid NOT NULL,
  "contour_key" varchar(64) NOT NULL,
  "result" jsonb NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "health_contour_results_run_fk" FOREIGN KEY ("run_id") REFERENCES "health_runs"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "health_contour_results_run_contour_unique" UNIQUE("run_id", "contour_key"),
  CONSTRAINT "health_contour_results_key" CHECK ("contour_key" IN ('C01_PAGE_IDENTITY', 'C02_CONVERSATION_ROOT', 'C03_COMPOSER_ROOT', 'C04_COMPOSER_INPUT', 'C05_SEND_CONTROL', 'C06_BUSY_STOP_STATE', 'C07_ASSISTANT_MESSAGE', 'C08_MESSAGE_COMPLETION', 'C09_COMMAND_CODE_BLOCK_SURFACE', 'C10_NATIVE_COPY_CONTROL', 'C11_CONVERSATION_IDENTITY', 'C12_DELIVERY_INSERTION_PATH', 'C13_BLOCKING_STATE')),
  CONSTRAINT "health_contour_results_object" CHECK (jsonb_typeof("result") = 'object')
);
--> statement-breakpoint
CREATE FUNCTION p8_2_health_contour_result_guard() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'P8.2 contour results are immutable' USING ERRCODE = '55000';
END;
$$;
--> statement-breakpoint
CREATE TRIGGER p8_2_health_contour_result_guard
BEFORE UPDATE OR DELETE ON "health_contour_results"
FOR EACH ROW EXECUTE FUNCTION p8_2_health_contour_result_guard();
--> statement-breakpoint
CREATE TABLE "health_evidence_references" (
  "evidence_id" uuid PRIMARY KEY,
  "run_id" uuid NOT NULL,
  "contour_key" varchar(64) NOT NULL,
  "rule_id" varchar(64) NOT NULL,
  "classification" varchar(32) NOT NULL,
  "sha256" varchar(64),
  "size_bytes" integer,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "health_evidence_references_contour_fk" FOREIGN KEY ("run_id", "contour_key") REFERENCES "health_contour_results"("run_id", "contour_key") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "health_evidence_references_rule" CHECK ("rule_id" IN ('NO_EVIDENCE', 'SAFE_ELEMENT_METADATA', 'BOUNDED_DOM_FRAGMENT', 'SAFE_SCREENSHOT_REFERENCE', 'STATE_TRANSITION_TRACE')),
  CONSTRAINT "health_evidence_references_classification" CHECK ("classification" IN ('METADATA', 'BOUNDED_FRAGMENT', 'SCREENSHOT')),
  CONSTRAINT "health_evidence_references_sha256" CHECK ("sha256" IS NULL OR "sha256" ~ '^[0-9a-f]{64}$'),
  CONSTRAINT "health_evidence_references_size" CHECK ("size_bytes" IS NULL OR "size_bytes" BETWEEN 0 AND 10000000)
);
--> statement-breakpoint
CREATE FUNCTION p8_2_health_evidence_insert_guard() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM "health_contour_results" result_row
    CROSS JOIN LATERAL jsonb_array_elements(result_row.result -> 'evidence') evidence
    WHERE result_row.run_id = NEW.run_id
      AND result_row.contour_key = NEW.contour_key
      AND (evidence ->> 'evidenceId')::uuid = NEW.evidence_id
      AND evidence ->> 'ruleId' = NEW.rule_id
      AND evidence ->> 'classification' = NEW.classification
      AND evidence ->> 'sha256' IS NOT DISTINCT FROM NEW.sha256
      AND (evidence ->> 'sizeBytes')::integer IS NOT DISTINCT FROM NEW.size_bytes
  ) THEN
    RAISE EXCEPTION 'P8.2 evidence must derive from the validated contour result' USING ERRCODE = '22023';
  END IF;
  RETURN NEW;
END;
$$;
--> statement-breakpoint
CREATE TRIGGER p8_2_health_evidence_insert_guard
BEFORE INSERT ON "health_evidence_references"
FOR EACH ROW EXECUTE FUNCTION p8_2_health_evidence_insert_guard();
--> statement-breakpoint
CREATE FUNCTION p8_2_health_evidence_mutation_guard() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'P8.2 evidence references are immutable' USING ERRCODE = '55000';
END;
$$;
--> statement-breakpoint
CREATE TRIGGER p8_2_health_evidence_mutation_guard
BEFORE UPDATE OR DELETE ON "health_evidence_references"
FOR EACH ROW EXECUTE FUNCTION p8_2_health_evidence_mutation_guard();
--> statement-breakpoint
CREATE TABLE "health_incidents" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "scope_sha256" varchar(64) NOT NULL,
  "status" "health_incident_status" NOT NULL,
  "first_seen_run_id" uuid NOT NULL,
  "latest_seen_run_id" uuid NOT NULL,
  "root_contour_key" varchar(64),
  "first_seen_at" timestamp with time zone NOT NULL,
  "last_seen_at" timestamp with time zone NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "health_incidents_first_run_fk" FOREIGN KEY ("first_seen_run_id") REFERENCES "health_runs"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "health_incidents_latest_run_fk" FOREIGN KEY ("latest_seen_run_id") REFERENCES "health_runs"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "health_incidents_scope_checksum_format" CHECK ("scope_sha256" ~ '^[0-9a-f]{64}$'),
  CONSTRAINT "health_incidents_root_contour_key" CHECK ("root_contour_key" IS NULL OR "root_contour_key" IN ('C01_PAGE_IDENTITY', 'C02_CONVERSATION_ROOT', 'C03_COMPOSER_ROOT', 'C04_COMPOSER_INPUT', 'C05_SEND_CONTROL', 'C06_BUSY_STOP_STATE', 'C07_ASSISTANT_MESSAGE', 'C08_MESSAGE_COMPLETION', 'C09_COMMAND_CODE_BLOCK_SURFACE', 'C10_NATIVE_COPY_CONTROL', 'C11_CONVERSATION_IDENTITY', 'C12_DELIVERY_INSERTION_PATH', 'C13_BLOCKING_STATE')),
  CONSTRAINT "health_incidents_last_seen_after_first" CHECK ("last_seen_at" >= "first_seen_at"),
  CONSTRAINT "health_incidents_updated_after_created" CHECK ("updated_at" >= "created_at")
);
