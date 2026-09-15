# I1-C1-R1 — независимое ревью

Дата: 2026-09-15. Verdict: REWORK_REQUIRED. Техническая приёмка C1 и слияние PR #7 не разрешены этим ревью.

Проверенный published head: 9e80e8ad531f079b38bf03b9e29f171c87c477c0.
Branch: feature/extension-i1-client-2026-09-15.
Base: bc0cd0088ca50ba06021ea602a46bdd90de91378.
Предыдущий отклонённый кандидат: 2a98057646af52eee0f654997b3f60f6322dfb04.
PR: https://github.com/MaksimUnimax/Seller_Agents/pull/7 — draft, open.

R1 опубликован двумя дополнительными коммитами: 7deed6a8a68d1689e978fb55bfbea6fec0db74e0 и 9e80e8ad531f079b38bf03b9e29f171c87c477c0. В просмотренном R1 diff серверные implementation-файлы, OpenAPI, миграции и Health/P8 не изменены.

## Блокирующие результаты

### G1 — P1: повторный вход больше не запускает polling

packages/control-client/src/client.js, ensurePolling, строки 82–86.

В pollingFlight сохраняется обёртка, возвращённая flight.finally, а cleanup сравнивает pollingFlight с исходным flight. Эти Promise различны; pollingFlight остаётся занят завершённым результатом навсегда в течение жизни worker. Следующий start создаёт активацию и открывает портал, но обмен deviceCode уже не запускается.

Независимое воспроизведение: успешный первый вход → localReset → второй start в том же worker. Два start HTTP, только один token exchange; вторая pending-активация не авторизуется. R1_SECOND_LOGIN_NEVER_POLLS.

Решение архитектора: хранить и сравнивать один и тот же Promise; связывать polling owner с generation/attempt; завершение старой операции не должно ни удерживать очередь новой попытки, ни очищать её owner. При cancel/reset новая попытка не должна ждать старый HTTP. Регрессии: два полных входа подряд; cancel pending → новый start; поздние ответы/cleanup старой попытки.

### G2 — P1: восстановление bootstrap после 401 не выполняет refresh

packages/control-client/src/client.js, refresh, строки 105–114; bootstrap, строки 140–143.

Обработчик первого 401 вызывает refresh без режима принудительной ротации. Если локальный accessTokenExpiresAt ещё в будущем, refresh возвращает те же credentials без HTTP. Bootstrap повторяет уже отвергнутый access token; второй 401 стирает authority и refresh credentials.

Независимое воспроизведение: API готов выдать рабочий новый access token на /v1/auth/refresh, но клиент туда не обращается. Два bootstrap с одинаковым bearer, ноль refresh, финальный logout. R1_401_RETRY_SKIPS_REFRESH. Очистка после действительно окончательного 401 теперь работает; recovery до неё остаётся ошибочным.

Решение архитектора: отделить обычную проверку freshness от принудительного refresh по 401; сохранить singleflight, durable idempotency и привязку к исходной generation/device/session. В пределах операции разрешить ровно одну ротацию и один повтор bootstrap с новым access token. Поздний результат старого контекста не меняет новый. Тесты должны доказать порядок HTTP и рабочее восстановление без предварительного localReset, затем отдельный окончательный 401.

### G3 — P1: известный отказ bootstrap сохраняет разрешение Work

packages/control-client/src/client.js, bootstrap и ensureForIdentity, строки 143–146.

После verifyV2 failure или подписанного MAINTENANCE выбрасывается ошибка до изменения authority. Предыдущее разрешение остаётся workAllowed=true. Следующий ensureForIdentity для того же ИИ возвращает старое разрешение из памяти без серверного запроса.

Независимо воспроизведены два варианта: корректно подписанный browser MAINTENANCE и неверная Ed25519 signature. Оба сохраняют Work. R1_SIGNED_MAINTENANCE_RETAINS_WORK и R1_INVALID_SIGNATURE_RETAINS_WORK. Это C1 online-authority defect, а не основание объявить весь C2/offline уже реализованным.

Решение архитектора: отдельный generation-fenced путь отказа текущей authority; закрывать Work/dispatch/delivery для известного отказа и уведомлять runtime об invalidation. Старый положительный cache нельзя выдавать как свежий допуск после такого ответа. Сохранять различие между известным отказом, ошибкой верификации и временной транспортной недоступностью; полный offline-policy выполнять по принятому I1-SRV.4 в C2. Не разрешать Work из-за ошибки сохранения отказа. Поздний отказ старой сессии не блокирует новую.

### G4 — P2: сравнение версий учитывает только major

packages/control-client/src/client.js, semver/versionAtLeast, строки 116–117.

Разделение по точке с limit=1 отбрасывает minor/patch до числового сравнения. Версии 0.2.4 и 0.99.0 становятся одинаковым массивом из одного нуля.

Независимо подписан валидный профиль с пересчитанным contentSha256 и minimumExtensionVersion=0.99.0. Клиент 0.2.4 продолжает разрешать Work. R1_PROFILE_MINIMUM_MINOR_VERSION_BYPASSED.

Решение архитектора: сравнивать все числовые компоненты extension/browser version по принятому контракту, с явно заданной обработкой prerelease/build, не менять контракт ради ошибочного parser. Проверить равенство, меньший minor/patch, переход major и browser minimum при одинаковом major. Требование полного signed Work C2 сохраняется отдельно.

### G5 — required gate: installed API/portal/PostgreSQL job падает до браузера

tests/regression/extension-core/client-i1/installed_local_integration.py, ROOT и строка 49.

ROOT использует parents[3], что для этого более глубокого каталога даёт repo/tests. Запрос к make-browser-config.mjs превращается в repo/tests/tests/regression/extension-core/client-i1/make-browser-config.mjs. GitHub job 104350849730 завершился MODULE_NOT_FOUND, а не инфраструктурным No space left on device. Установленная приёмка не состоялась.

Решение архитектора: установить корень именно этого script через parents[4] и проверить существование фиксированных входных путей до запуска сервисов. В дальнейшей части сценария после #auth-reset нажать реальную кнопку #confirm и дождаться сброса account; popup.js открывает собственное подтверждение, а текущий harness его пропускает. Это второе препятствие найдено чтением исходников, не выдаётся за уже наблюдавшийся CI trace. После G1 пройти два аккаунта в одном worker без подмены browser storage.

### G6 — required gate: native application fixture падает при ожидании аккаунта

tests/regression/extension-core/browser_application.py, seed_authority и строка 97; apps/extension/src/application/runtime.js, saReady; packages/control-client/src/client.js, init/restoreOnce.

Job 104350903139: Timed out waiting for browser state, ожидание «Аккаунт · 11111111». Source route завершился ошибкой; extracted route в этом job не доказан.

В исходниках видна гонка setup: приложение запускает одноразовый restore при старте worker; фикстура позже подписывает authority и пишет её напрямую в storage. Если restore уже закончил пустое чтение, запись не переинициализирует in-memory owner. Это объяснение по исходникам; полного самостоятельного native browser reproduction здесь не выполнено.

Решение архитектора: синхронизировать fixture setup с жизненным циклом worker. Допустимо после записи fixture authority гарантированно остановить и заново запустить worker с той же packaged trust identity, дождаться нового экземпляра и завершённого restore, затем начинать popup scenario. Не добавлять production backdoor reload authority и не откатывать единый init ради теста. Авторизационный installed gate должен получать authority реальным login flow. Перед выдачей следующего задания архитектор фиксирует конкретный механизм restart в используемом browser harness.

Уточнение: browser fixture не содержит accessBasis, но verifier этого клиентского head допускает его отсутствие. Отсутствие поля само по себе не установлено как причина данного падения. При подключении финального I1-SRV.4 required policy обновлять fixture по реальному контракту, не расширять допустимость production verifier.

## Что подтвердилось из F1–F8

| Finding | Независимый результат на 9e80 |
|---|---|
| F1 | Контроль cancelled start PASS: поздний ответ не вернул pending и не открыл портал. Полный lifecycle не принят из-за G1. |
| F2 | Финальный 401 очищает authority; recovery не закрыт из-за G2, известные bootstrap отказы — G3. |
| F3 | PASS для позднего AUTH_REFRESH_INVALID старой сессии после входа в новый аккаунт в ТОМ ЖЕ worker. |
| F4 | Добавлены AI binding/profile shape/fingerprint checks; полное закрытие не подтверждается из-за обхода minimum version G4. |
| F5 | PASS: два совместимых bootstrap не вызвали invalidation callback. Это локальный контроль client callback, не installed Work acceptance. |
| F6 | PASS для отклонения encoded payload больше 32768. Полная идентичность всех серверных схем этим не объявлена. |
| F7 | PASS: повторный worker с тем же backing сохраняет пригодную trust identity и authority. |
| F8 | PASS: подписанный payload с корректным идентификатором 1flag принимается. |

Независимый runner: I1_C1_R1_reproduce.mjs и I1_C1_R1_reproduction-results.json рядом. Пять наблюдений дефектов в четырёх классах и шесть успешных контрольных сценариев. Node VM исполняет опубликованные client/config/crypto без изменения; support makeWorker взят из того же head. HTTP контролируется тестом, ключи Ed25519 одноразовые. Это не live/installed/production acceptance. Assertions намеренно фиксируют плохое поведение кандидата; после исправлений их нужно превратить в acceptance assertions, а не сохранять ошибочное поведение ради зелёного runner.

Для повторения указать SA_REVIEW_REPOSITORY на checkout именно 9e80e8ad531f079b38bf03b9e29f171c87c477c0 и запустить node для I1_C1_R1_reproduce.mjs. SHA-256 трёх исходных client-модулей сохранены в JSON.

## CI и артефакты

GitHub connector архитектора имеет доступ, несмотря на 404 у исполнителя. Проверены реальные run/job logs.

| Проверка | Результат |
|---|---|
| I1 workflow 34959926666, client-i1 job 104350849918 | SUCCESS |
| I1 workflow 34959926666, installed job 104350849730 | FAILURE, G5 |
| Extension workflow 34959926657, common core job 104350903002 | SUCCESS |
| Extension workflow, native application job 104350903139 | FAILURE, G6 |
| Extension baseline Ozon и WB nodes | SUCCESS |
| Extension baseline WB browsers | IN_PROGRESS при последнем чтении; PASS не заявлен |
| Documentation workflow 34959926633 | SUCCESS |

Это pull_request CI, связанный с head 9e80. checkout в прочитанных logs — виртуальный merge 1bfa2821016f8c3a3a585f72c0e60011db872ed1, соединяющий 9e80 с main 5d7c8853cc69dd95bc6e713cac3fb2aa0a63383c. Его нельзя выдавать за отдельный checkout чистого feature head. Source probes выше выполнены именно на 9e80.

Исполнитель сообщил package SHA-256 2580015cdf174c909e6733197d3b609ba10c3fe35008090df13ebc17a838d00f; он совпадает с published package-receipt.json. Сам заявленный ZIP в этом ревью не скачан и его байты независимо не сверены. Native CI собирает пакет с собственным временным trust input; различие package SHA без сравнения входов не означает порчу артефакта.

CI links:
- https://github.com/MaksimUnimax/Seller_Agents/actions/runs/34959926666/job/104350849730
- https://github.com/MaksimUnimax/Seller_Agents/actions/runs/34959926657/job/104350903139
- https://github.com/MaksimUnimax/Seller_Agents/actions/runs/34959926666/job/104350849918

## Передача

R1 terminal report получен и обработан. Новое задание I1-C1-R2 ещё НЕ выдано. Владелец договорился перейти в новый чат перед запуском единственного Codex через Business Bridge. Здесь нет новых coding tasks, слияния PR или изменений implementation веток.

В новом чате восстановить STATE и это ревью, проверить актуальные heads/отсутствие незавершённого старого job; не повторять этот аудит целиком без новых изменений. После явного запуска авторежима архитектор конкретизирует оставшиеся детали fixture restart и выдаёт одно ограниченное исправление G1–G6. Дальнейшая очередь: C1 acceptance → I1-SRV.5 → C2/installed I1; переданный B5 остаётся REWORK_REQUIRED и берётся в ближайшей точке согласно зависимости. S1.2, D3, real email/preprod/production и release не закрыты.
