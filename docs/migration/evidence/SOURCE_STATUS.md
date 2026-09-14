# Границы исходных доказательств D0

Дата: 2026-09-14. Метод: read-only GitHub inspection source branches/files/workflow run и последнее сообщение владельца.
Исходные live API, установленный браузер владельца, резервный файл ключей и реальный production сервер в D0 не проверялись.
Ссылки и exact snapshots: [SOURCES](../SOURCES.md).

## WB

Remote HEAD 006af2724aafdf6589c16881c1ed06eb01cca281.
Source report 0.3.0: 102 semantic capabilities, 32 donor files, 52 suites, 1075 PASS/0 FAIL на source и extracted ZIP; установленная приёмка в этом отчёте ещё pending.
Latest owner result: установленная проверка выполнена и провалена; popup migration completeness оспорена; import показал INVALID_CREDENTIAL_BACKUP.
Текущий статус: INSTALLED FAIL; migration REOPENED / COMPLETENESS NOT PROVEN; R1–R8 CLOSED.
Эти owner findings здесь записаны по сообщению владельца, не объявлены независимо воспроизведёнными этим этапом.

Исходный отчёт также описывает доказанный fixture дефект 0.2.4 user-turn extraction и ограничения native execution среды. Это отдельные факты; они не доказывают причину последнего 0.3.0 installed fail.

## Сервер

Remote HEAD b01b879ce61bad6b093688f982f1b82503885636.
P0–P7 приняты в source roadmap; P8.1–P8.3 приняты, P8.4 и последующие live behavioral этапы не завершены.
Server CI №103 success совпадает с exact HEAD; run URL в SOURCES.
P8.3 — controlled Chrome structural harness, не наблюдение живого клиентского AI.
P5 использует simulated billing; настоящий paid provider не принят. Реальное расширение в старом roadmap отложено на P11, production размещение — отдельный этап.
Следовательно, сервер пригоден как исходная база переноса; «готов к production с новым единым расширением» этим evidence не доказано.

## Ozon

Remote HEAD 35991e73fe861da5f7eb27c598d2c0397062a50b, текущая исполняемая линия 0.1.21 по сообщению владельца и source линии.
Владелец продолжает работу; используем свежий snapshot при D1.
В этом этапе нет новой installed/live сертификации и нет вывода о необходимости сливать исторические multi-AI forks.
Ошибки из прежних ревью не считаются автоматически текущими дефектами этого HEAD: нужна точечная перепроверка.

## Seller Agents D0

Исходно целевой репозиторий пуст, default main; код трёх компонентов отсутствует.
D0 содержит спецификацию/структуру/правила и инструмент проверки документации. Исторические PASS не перенесены в продуктовую матрицу как новые результаты.
