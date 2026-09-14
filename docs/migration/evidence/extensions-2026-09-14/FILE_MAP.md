# Все production-файлы и их планируемое размещение

Статус: MAP COMPLETE / NOT IMPORTED. Exact commits, SHA-256, byte sizes и load consumers указаны в [RUNTIME_FILE_MAP.json](RUNTIME_FILE_MAP.json). D2 — предполагаемое место ответственности; разделение и поведенческая сверка ещё не выполнены.

## Ozon 0.1.22 — 36 файлов

Первый перенос D1: `apps/extension/src/imported/ozon-v0.1.22/` + относительный путь. В этом этапе каталог не материализован.

| Исходный относительный путь | Подсистема | Планируемое размещение D2 |
|---|---|---|
| `attachment_delivery_port_content.js` | DELIVERY | `packages/bridge-core/src/delivery`, `packages/browser-platform` |
| `attachment_delivery_wake_content.js` | DELIVERY | `packages/bridge-core/src/delivery`, `packages/browser-platform` |
| `content_script.js` | CONTENT | `apps/extension/src/content`, `packages/bridge-core/src/capture`, `packages/ai-adapters/chatgpt`, `packages/ai-adapters/alice` |
| `manifest.json` | MANIFEST | `apps/extension/manifests`, `packages/browser-platform/chromium`, `packages/browser-platform/firefox`, `packages/browser-platform/safari` |
| `popup.css` | UI | `apps/extension/src/popup` |
| `popup.html` | UI | `apps/extension/src/popup` |
| `popup.js` | UI | `apps/extension/src/popup` |
| `service_worker.js` | BACKGROUND | `apps/extension/src/background`, `packages/bridge-core/src/work`, `packages/bridge-core/src/execution`, `packages/bridge-core/src/delivery` |
| `service_worker_entry.js` | BACKGROUND | `apps/extension/src/background`, `packages/bridge-core/src/work`, `packages/bridge-core/src/execution`, `packages/bridge-core/src/delivery` |
| `shared/ai_adapters.js` | AI | `packages/bridge-core/src/ai`, `packages/ai-adapters/chatgpt`, `packages/ai-adapters/alice` |
| `shared/ai_delivery_capabilities.js` | AI | `packages/bridge-core/src/ai`, `packages/ai-adapters/chatgpt`, `packages/ai-adapters/alice` |
| `shared/bridge_autorun_model.js` | EXECUTION | `packages/bridge-core/src/execution` |
| `shared/composer_send.js` | AI | `packages/bridge-core/src/ai`, `packages/ai-adapters/chatgpt`, `packages/ai-adapters/alice` |
| `shared/conversation_identity.js` | IDENTITY | `packages/bridge-core/src/identity`, `packages/ai-adapters/chatgpt`, `packages/ai-adapters/alice` |
| `shared/direct_binary_file_delivery_patch.js` | DELIVERY | `packages/bridge-core/src/delivery`, `packages/browser-platform` |
| `shared/file_delivery_model_policy.js` | DELIVERY | `packages/bridge-core/src/delivery`, `packages/browser-platform` |
| `shared/file_delivery_port_worker.js` | DELIVERY | `packages/bridge-core/src/delivery`, `packages/browser-platform` |
| `shared/file_delivery_wake_worker.js` | DELIVERY | `packages/bridge-core/src/delivery`, `packages/browser-platform` |
| `shared/live_runtime_v0122_patch.js` | OZON | `packages/marketplaces/ozon` |
| `shared/llm_output_report_workflow_patch.js` | DELIVERY | `packages/bridge-core/src/delivery`, `packages/browser-platform` |
| `shared/manual_controls.js` | CAPTURE | `packages/bridge-core/src/capture` |
| `shared/mixed_batch_discovery.js` | EXECUTION | `packages/bridge-core/src/execution` |
| `shared/ozon_contract.js` | MIXED_CONTRACT | `packages/bridge-core/src/protocol`, `packages/marketplaces/ozon` |
| `shared/ozon_credentials.js` | OZON | `packages/marketplaces/ozon` |
| `shared/ozon_entitlements.js` | OZON | `packages/marketplaces/ozon` |
| `shared/ozon_guidance.js` | OZON | `packages/marketplaces/ozon` |
| `shared/ozon_operation_registry.js` | OZON | `packages/marketplaces/ozon` |
| `shared/ozon_provider.js` | OZON | `packages/marketplaces/ozon` |
| `shared/performance_report_continuation_patch.js` | OZON | `packages/marketplaces/ozon` |
| `shared/proven_writing_block_capture.js` | CAPTURE | `packages/bridge-core/src/capture` |
| `shared/provider_transport_core.js` | MIXED_TRANSPORT | `packages/bridge-core/src/transport`, `packages/bridge-core/src/documents`, `packages/marketplaces/ozon` |
| `shared/runtime_names.js` | NAMESPACE | `packages/bridge-core/src/protocol`, `packages/marketplaces/ozon` |
| `shared/swagger_read_surface_patch.js` | OZON | `packages/marketplaces/ozon` |
| `shared/web_file_attachment.js` | DELIVERY | `packages/bridge-core/src/delivery`, `packages/browser-platform` |
| `shared/work_session_model.js` | WORK | `packages/bridge-core/src/work` |
| `shared/xlsx_direct_binary_delivery_patch.js` | OZON | `packages/marketplaces/ozon` |

## WB 0.3.0 — 40 файлов, INSTALLED FAIL

Первый перенос D1: `migration/reference/wildberries-v0.3.0/runtime/` + относительный путь. В этом этапе каталог не материализован.

| Исходный относительный путь | Подсистема | Планируемое размещение D2 |
|---|---|---|
| `content_script.js` | CONTENT | `apps/extension/src/content`, `packages/bridge-core/src/capture`, `packages/ai-adapters/chatgpt`, `packages/ai-adapters/alice` |
| `manifest.json` | MANIFEST | `apps/extension/manifests`, `packages/browser-platform/chromium`, `packages/browser-platform/firefox`, `packages/browser-platform/safari` |
| `popup.css` | UI | `apps/extension/src/popup` |
| `popup.html` | UI | `apps/extension/src/popup` |
| `popup.js` | UI | `apps/extension/src/popup` |
| `service_worker.js` | BACKGROUND | `apps/extension/src/background`, `packages/bridge-core/src/work`, `packages/bridge-core/src/execution`, `packages/bridge-core/src/delivery` |
| `shared/ai_adapters.js` | AI | `packages/bridge-core/src/ai`, `packages/ai-adapters/chatgpt`, `packages/ai-adapters/alice` |
| `shared/ai_delivery_capabilities.js` | AI | `packages/bridge-core/src/ai`, `packages/ai-adapters/chatgpt`, `packages/ai-adapters/alice` |
| `shared/artifact_store.js` | STORAGE | `packages/bridge-core/src/storage`, `packages/browser-platform` |
| `shared/bridge_autorun_model.js` | EXECUTION | `packages/bridge-core/src/execution` |
| `shared/composer_send.js` | AI | `packages/bridge-core/src/ai`, `packages/ai-adapters/chatgpt`, `packages/ai-adapters/alice` |
| `shared/conversation_identity.js` | IDENTITY | `packages/bridge-core/src/identity`, `packages/ai-adapters/chatgpt`, `packages/ai-adapters/alice` |
| `shared/delivery_policy.js` | DELIVERY | `packages/bridge-core/src/delivery`, `packages/browser-platform` |
| `shared/delivery_transaction_worker.js` | DELIVERY | `packages/bridge-core/src/delivery`, `packages/browser-platform` |
| `shared/document_reader.js` | DOCUMENT | `packages/bridge-core/src/documents` |
| `shared/entitlement_policy.js` | POLICY | `packages/bridge-core/src/policy` |
| `shared/file_delivery.js` | DELIVERY | `packages/bridge-core/src/delivery`, `packages/browser-platform` |
| `shared/manual_controls.js` | CAPTURE | `packages/bridge-core/src/capture` |
| `shared/mixed_batch_discovery.js` | EXECUTION | `packages/bridge-core/src/execution` |
| `shared/parameter_guidance.js` | WB | `packages/marketplaces/wildberries` |
| `shared/proven_writing_block_capture.js` | CAPTURE | `packages/bridge-core/src/capture` |
| `shared/provider_transport_core.js` | POLICY | `packages/bridge-core/src/policy` |
| `shared/query_planner.js` | EXECUTION | `packages/bridge-core/src/execution` |
| `shared/response_verifier.js` | POLICY | `packages/bridge-core/src/policy` |
| `shared/runtime_names.js` | NAMESPACE | `packages/bridge-core/src/protocol`, `packages/marketplaces/wildberries` |
| `shared/runtime_policy.js` | POLICY | `packages/bridge-core/src/policy` |
| `shared/runtime_worker.js` | BACKGROUND | `apps/extension/src/background`, `packages/bridge-core/src/work`, `packages/bridge-core/src/execution`, `packages/bridge-core/src/delivery` |
| `shared/wb_batch_runtime.js` | EXECUTION | `packages/bridge-core/src/execution` |
| `shared/wb_command_protocol.js` | WB | `packages/marketplaces/wildberries` |
| `shared/wb_contract.js` | WB | `packages/marketplaces/wildberries` |
| `shared/wb_credentials.js` | WB | `packages/marketplaces/wildberries` |
| `shared/wb_guidance.js` | WB | `packages/marketplaces/wildberries` |
| `shared/wb_guidance_registry.js` | WB | `packages/marketplaces/wildberries` |
| `shared/wb_operations.js` | WB | `packages/marketplaces/wildberries` |
| `shared/wb_provider.js` | WB | `packages/marketplaces/wildberries` |
| `shared/web_file_attachment.js` | DELIVERY | `packages/bridge-core/src/delivery`, `packages/browser-platform` |
| `shared/work_recovery_worker.js` | WORK | `packages/bridge-core/src/work` |
| `shared/work_session_model.js` | WORK | `packages/bridge-core/src/work` |
| `shared/work_start_worker.js` | WORK | `packages/bridge-core/src/work` |
| `shared/xlsx_reader.js` | DOCUMENT | `packages/bridge-core/src/documents` |

WB shared-файлы имеют HOLD до behavioral differential. Единственное побайтовое совпадение с Ozon — `shared/manual_controls.js`; его окружение всё равно требует проверки. Registry/transport WB сохраняются как provider baseline без live-сертификации.
