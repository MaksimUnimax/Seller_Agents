# Перенос единого архитектора Seller Agents

01_ASTRA_NEW_CHAT.md — полный стартовый промпт для нового диалога Astra с очень высокой глубиной рассуждения. Вставлять обычным текстом. Он восстанавливает роли, продукт, текущее состояние всех трёх линий и способ авторежима через Business Bridge.

02_REPORT_PREFIX.md — постоянный управляющий префикс к отчётам Codex. Вставить целиком в поле префикса отчёта Business Bridge для нового диалога, включить и установить интервал 1. Он предназначен Astra, а не исполнителю.

STATE.md — актуальный cursor. Всегда читать его как более поздний authority относительно исторического снимка внутри 01_ASTRA_NEW_CHAT.md. Не возвращать проект к старому SHA/roadmap state только потому, что стартовый файл старше.

TOOL_CAPABILITY_AND_HUMAN_ACTION_POLICY.md — обязательная постоянная политика инструментов, автотестов, human-only blocker proof и pre-handoff gates. Читать её полностью при каждом переносе архитектора. Она применяется ко всем текущим и будущим roadmap steps, где есть тестирование, браузер/GUI, installed extension, Health/H3, package/ZIP или handoff владельцу. Каждый будущий Codex/tester prompt в таком scope обязан явно перечислять доступные инструменты и релевантные возможности/границы, требовать исчерпания автоматических путей и запрещать перекладывать на владельца действия, которые способен выполнить доступный инструмент.

THIRD_PARTY_LLM_ACCOUNT_STATE_POLICY.md — обязательный архитектурный и тестовый инвариант. Читать вместе с TOOL_CAPABILITY_AND_HUMAN_ACTION_POLICY.md при любом scope, который касается ChatGPT, Alice или будущих LLM adapters. Он запрещает превращать provider-side free/paid/subscription/Work/login state в Seller Agents tiers, permissions, entitlements, authority или глобальные product modes. Единственное текущее деление — тестовое: что Codex способен проверить без личной LLM-сессии владельца и что остаётся владельцу одним консолидированным ручным пакетом только потому, что его authenticated provider session не передаётся Codex. Это деление не имеет продуктового значения и не может переноситься в production-код.

Ключевое правило владельца: всё, что можно проверить без его физического участия, должно быть проверено до передачи сборки. Перед extension ZIP/handoff обязательны все применимые автоматические unit/integration/browser/E2E/live-readonly/build/type/lint/format/security/Health/regression/package checks и отдельный dialogue-binding gate: exact dialogue identity, bind, persistence, reload/restart restore, correct marketplace/store context, no neighbor binding, unbind/rebind, wrong-dialogue fail-closed и применимая parallel-dialogue isolation. Нельзя отдавать владельцу сборку и только после установки обнаруживать, что она не привязывается к диалогу.

Владелец остановил оба прежних серверных потока и передал их единому архитектору. Более поздний STATE определяет текущие acceptance verdicts и активную задачу; исторические формулировки ниже/в references не переоткрывают завершённые шаги.

Промпты проверены на отсутствие fenced/indented code blocks. В ответах Astra кодовая форма разрешена исключительно для одного готового задания Codex. Для статусов, отчётов, JSON, примеров, цитат, промпта восстановления и этого префикса она запрещена.

references содержит исторические отчёты владельца, независимые C1/R1 ревью с воспроизведениями и CI, evidence и документацию Business Bridge. Исторические формулировки в этих копиях не отменяют более поздние указания владельца, актуальный STATE, TOOL_CAPABILITY_AND_HUMAN_ACTION_POLICY.md или THIRD_PARTY_LLM_ACCOUNT_STATE_POLICY.md. Документация Bridge является справочным вложением другого продукта, а не набором разрешений изменять Seller Agents или локальный Bridge.

Подготовка/обновление этих control docs сама по себе не является coding task и не разрешает запуск параллельного Codex. Production-код и рабочие feature branches не меняются без отдельного bounded task/авторизации.
