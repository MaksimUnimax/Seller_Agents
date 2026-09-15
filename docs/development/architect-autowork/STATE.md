# Seller Agents — единый cursor

Дата: 2026-09-15. Статус: I1_C1_R2_REWORK_REQUIRED / I1_C1_R3_PREPARED / BRIDGE_ACK_PENDING.

Владелец передал Stream A и Stream B основному архитектору и разрешил авторежим командой «поехали». R2 terminal report получен и независимо проверен: REWORK_REQUIRED. Исполнитель по отчёту остановился. Подготовлена одна задача R3; сохранение не доказывает захват Bridge или запуск CLI. Исторические принятые серверные факты и очередь сохранены.

## Роли

Astra / очень высокая глубина рассуждения — главный разработчик, senior engineer, единственный архитектор. Вся архитектура, исследования, поиск причин, планирование, проектирование, управление разработкой и независимая приёмка на ней. Один серверный Codex / Luna Max реализует заданный код и тесты и выполняет назначенные проверки. Исследования, поиск решения и архитектуру ему не делегировать. Новые пользовательские ограничения сильнее исторической формулировки AGENTS о самостоятельных технических решениях исполнителя.

## Текущая задача

- Завершённая задача: SA-I1-C1-R2-20260915-01; terminal report получен, REWORK_REQUIRED.
- Этап: I1-C1; не закрыт.
- Branch: feature/extension-i1-client-2026-09-15.
- Start/base R2: 9e80e8ad531f079b38bf03b9e29f171c87c477c0; base линии bc0cd0088ca50ba06021ea602a46bdd90de91378.
- Проверенный published head / R3 start: 0b2a1776ff484d2410b3a43d338ec5548e73f019; tree 3a83601109f7cb643e06d923b1da36691f9b0014.
- Main: 5d7c8853cc69dd95bc6e713cac3fb2aa0a63383c.
- Draft PR: https://github.com/MaksimUnimax/Seller_Agents/pull/7 — открыт, не слит.
- Review: references/I1_C1_R2_REVIEW.md; независимые probes/results и CI evidence рядом.
- Blockers: oversized200 сохраняет Work; signed initial UNCONFIGURED не аутентифицирует аккаунт; неполное fencing/критерийное покрытие; common-core legacy fixture; installed auth UI/redirect synchronization и отсутствие успешной local API/browser приёмки.
- G6 native fixture restart принят только как synthetic fixture correction; это не installed real-auth/live acceptance.
- Next: SA-I1-C1-R3-20260915-01, tasks/I1_C1_R3_2026-09-15.md.
- Статус R3: PREPARED / BRIDGE_ACK_PENDING; один prompt предназначен для финального ответа. Доставка/запуск не утверждаются. По отчёту R2 остановлен; прямого Bridge-инструмента и run/job ID нет.
- После публикации prompt ждать terminal report/уведомления. При обрыве сверить последний ответ/current job и не пересылать prepared prompt автоматически.

## Результат R1

references/I1_C1_R1_REVIEW.md — независимый verdict, причины и решения архитектора; рядом I1_C1_R1_reproduce.mjs, I1_C1_R1_reproduction-results.json и I1_C1_R1_CI.json.

Пять source-level наблюдений дефектов: второй login не запускает polling; 401 retry не вызывает refresh; signed MAINTENANCE сохраняет Work; invalid signature сохраняет Work; minimumExtensionVersion 0.99.0 пропускается клиентом 0.2.4. Шесть контрольных сценариев прежних исправлений прошли. Никакой installed/live приёмки этими VM probes не заявлено.

CI связан с feature head 9e80, но PR checkout имеет виртуальный merge SHA 1bfa2821016f8c3a3a585f72c0e60011db872ed1 поверх main 5d7c8853. I1 job 104350849918 SUCCESS; installed API/portal/PG job 104350849730 FAILURE: ошибочный repo/tests/tests путь к make-browser-config.mjs. Common source/package 104350903002 SUCCESS; native application 104350903139 FAILURE: ожидание аккаунта. Ozon/WB nodes и docs прошли; новый readback job 104350902975 (WB browsers) подтвердил completed / SUCCESS. Native application job остаётся FAILURE; весь CI не зелёный.

Reported ZIP SHA-256 2580015cdf174c909e6733197d3b609ba10c3fe35008090df13ebc17a838d00f совпадает с published receipt; собственный byte readback заявленного ZIP в R1 review не выполнен.

## Сохранённое ревью

Ветка review/extension-i1-c1-2026-09-15, commit b4045fa9353cd2fee7f49f0bd3fea280e808679a, каталог docs/migration/evidence/extension-i1-client-review-2026-09-15/. Восемь source-level воспроизведений, CI failures, исправления и передача Stream A. Они относятся к старому head 2a980; результат нового R1 на 9e80 хранится отдельно выше.

## Сервер A

Принята передача результатов S1.1 / I1-SRV.0–4 от предыдущего архитектора. Main 5d7c8853cc69dd95bc6e713cac3fb2aa0a63383c. Merge PR #6 и corrected candidate f2f7be25393f2d6b3794b8423d7a2701a7c37bdc имеют одинаковое дерево 4dfcf1c3d3537091d741a7784f99ebee995e76cc. Exact-head Server CI 34951442143 и Documentation CI 34951442176 SUCCESS подтверждены. Старое pending-review wording требует factual closeout, но не повторной разработки принятого.

Осталось: I1-SRV.5 reference-client acceptance. S1.2 real OTP/preprod и D3 не начаты. Сохраняется разграничение live/email/browser/fixture доказательств.

## Сервер B

Принята ответственность за остановленный Stream B; это не приёмка B5.

- Branch: feature/server-health-h3-p8-4.
- Head: a80cd3706a10d25079fedb9553fc7f5b2fc21683.
- P8.4/B1–B4 приняты предыдущим архитектором в этой ветке; наличие в main не утверждается.
- B4: 53419eb57cc222254e14b5dc273a37249487331c.
- B5: REWORK_REQUIRED / NOT ACCEPTED.
- Exact-head Server CI 34955906130: FAILURE; job 104337782297, pnpm test:integration.
- Точный failure самостоятельно прочитан через GitHub job-log tool: tests/integration/server/h3-health-persistence.integration.test.ts, beforeAll, строка 244; PostgreSQL 23505; constraint ai_adapters_machine_key_unique; machine_key=chatgpt уже существует.
- 1508 passed / 6 skipped; setup suite failed. Это наблюдение лога, не полный диагноз происхождения конфликтующей строки.
- Не снимать constraint, не пропускать тест, не придумывать fixture fix без чтения runtime/seed/migration самим архитектором.
- B6–B8 и последующие P8.5/P8.6/P8.7/P9 не начаты.

## Очередь в новом чате

1. Закрыть реальные C1-R1 blockers и принять только доказанный scope.
2. I1-SRV.5, затем C2 и совместная установленная I1-приёмка по контрактным зависимостям.
3. В ближайшей подходящей точке завершить B5 correction/acceptance, затем B6–B8. Если B5/Health — доказанный prerequisite C2, переставить раньше с записью причины.
4. Согласовать объединение принятых клиентской и серверной веток с новым main; не терять ни одну линию и не применять ours/theirs вслепую.
5. Далее актуальный продуктовый roadmap; не требовать весь P8–P10 раньше раннего I1 и не объявлять внешние этапы закрытыми без их приёмки.

Исторически R1 был проверен и выдан R2. Теперь terminal R2 проверен; подготовлен только R3, более поздних задач нет.

## Протокол Bridge и переноса

01_ASTRA_NEW_CHAT.md — стартовый текст для нового ChatGPT; 02_REPORT_PREFIX.md — постоянный префикс отчёта, N=1. Оба вставляются обычным текстом и не являются Codex task. Кодовые блоки в ответах Astra разрешены только для одного готового задания Codex; для всего остального запрещены.

Business Bridge ZIP 2.0.0.23 независимо сверён: cfd62cbcfb05abc2dc646b6caa893b20f5bcd1abd53be8e3e811c7aff3f1dd24. Полная документация прочитана, исторические противоречия сопоставлены с выбранными текущими source paths. Текущий ZIP имеет composer-empty send loop; это не one-click/real-user-turn модель из всех старых записей. Аудит и patch Business Bridge не входят в текущую задачу.

Промпт не включает авторежим сам. Новый диалог привязывается к фактическому профилю владельцем; после восстановления и проверки отсутствия незавершённого прежнего job запускается «▶ Авторежим». Никакой миграции старого active run по предположению.

## Подготовка R2 в новом диалоге — 2026-09-15

Актуальные remote refs повторно сверены: main 5d7c8853cc69dd95bc6e713cac3fb2aa0a63383c; client 9e80e8ad531f079b38bf03b9e29f171c87c477c0; Health a80cd3706a10d25079fedb9553fc7f5b2fc21683. Новых implementation commits не обнаружено. По сохранённому terminal report R1 завершён; прямого инструмента установленного Bridge в текущей среде не обнаружено, run/job IDs не предоставлены. Факт отсутствия всех процессов на сервере не утверждается.

Архитектор прочитал конкретные client/runtime/harness/packaging/contract consumers и R1 reproduction script, без повторного полного аудита и без запуска provider calls. Решения R2:
- generation/attempt/session-owned polling, activation и refresh flights;
- force refresh после 401 с защитой от повтора уже завершённой текущей ротации;
- restrictive in-memory authority invalidation до storage I/O, durable fallback removal и явная граница при полном отказе хранения;
- saEnabled обозначает готовность composed application, а не авторизацию: после потери аккаунта не переходить в standalone fallback; Work permission проверяется отдельно локальными guards;
- полноценные SemVer и Chromium version comparisons по контрактной грамматике;
- installed harness ROOT parents[4], реальный #confirm и корректное ожидание signed-out;
- native harness: закончить пустой restore, записать fixture authority, закрыть Chromium context, открыть тот же временный persistent profile с тем же runtime/trust и дождаться штатного restore нового worker. В реальном local API auth gate перезапуска между аккаунтами и storage injection нет.

Это source-based проектирование следующего исправления, не новые runtime PASS. Старые R1/Health verdict и очередь сохранены. Передача prompt в Bridge и начало CLI должны подтверждаться фактическим уведомлением.

## Приёмка R2 — 2026-09-15

REWORK_REQUIRED на 0b2a1776ff484d2410b3a43d338ec5548e73f019. Exact-head push CI: I1 34965374842 FAILURE (installed104368454586, code regex NoneType, PostgreSQL healthy); common-core104368455663 FAILURE в34965374971 (legacy settings denied); native104368455416 SUCCESS. PR docs34965379091 SUCCESS. WB browser jobs оставались IN_PROGRESS при readback; полного CI PASS нет. Оба source-дефекта подтверждены независимыми VM probes на совпадающих Git blobs. Package hash/size приведены как reported; собственного ZIP byte readback нет. Полное ревью, границы и решения — references/I1_C1_R2_REVIEW.md. Сохранены R1/серверные исторические записи. Последующие old R2 preparation notes выше — история, не текущая команда.
