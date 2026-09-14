/* Multi-AI delivery bootstrap. Historical worker stays byte-unchanged; delivery policy wraps it additively. */
importScripts("shared/ai_delivery_capabilities.js");
importScripts("shared/mixed_batch_discovery.js");
importScripts("service_worker.js");
/* Install the audited Swagger read surface before later output/delivery wrappers observe registry, contract and provider globals. */
importScripts("shared/swagger_read_surface_patch.js");
/* Repair live v0.1.21 defects before downstream output/delivery wrappers capture contract/provider globals. */
importScripts("shared/live_runtime_v0122_patch.js");
/* Vendor Performance XLSX is consumed before the generic binary wrapper, using the same durable artifact schema. */
importScripts("shared/xlsx_direct_binary_delivery_patch.js");
/* LLM output contract is appended once per Bridge delivery and report/document continuations are explicit and fail-closed. */
importScripts("shared/llm_output_report_workflow_patch.js");
/* Performance report-start operations expose only an explicit next status command; no hidden polling/download occurs. */
importScripts("shared/performance_report_continuation_patch.js");
/* Successful direct binary provider responses are converted into durable opaque attachment refs without a second provider request. */
importScripts("shared/direct_binary_file_delivery_patch.js");
importScripts("shared/file_delivery_model_policy.js");
/* Attachment RPC uses a named runtime Port so the legacy catch-all onMessage listener cannot race responses. */
importScripts("shared/file_delivery_port_worker.js");
/* Storage changes wake only affected tabs; the Port remains the sole attachment RPC channel. */
importScripts("shared/file_delivery_wake_worker.js");