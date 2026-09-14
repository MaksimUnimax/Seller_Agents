# D2.4 — каталог и единый прикладной маршрут

Поручение владельца «Делай» после D2.3 открывает настоящий каталог магазинов, общий popup и Work/delivery Ozon/WB. Исходная удалённая база: `de41f33646d5dd61bcae66624225e16538fd8f3a`, tree `8d41cd3c376885db6f2bccdfa51c529ad114ee2b`. Development-версия 0.2.3; не beta/release. Code `96af54f1d67c20f6eca2ade552fde20948f1e66d`: DEVELOPMENT_APPLICATION_VERIFIED, полный CI 34846554237 SUCCESS; source/ZIP/native fixture/readback PASS. Текущая [квитанция](../migration/evidence/extension-application-d2-4-2026-09-14/README.md).

## Реализация и зависимые подсистемы

| Подсистема | Что соединено / изменено | Доказательство и предел |
|---|---|---|
| Каталог | Локальный account/store scope, постоянные UUID, автоматические имена, переименование, удаление, отдельные Seller/Performance | Каталог сохраняет секреты только в privileged storage; реальные server account/ID и синхронизация относятся к I1 |
| Popup | Переключатель Ozon/WB, список, карточка, отдельные проверки реквизитов, текущая привязка и следующий выбор, подтверждение смены/удаления | Новый общий UI; старый WB popup не перенесён. Проверка ключей показывает доступ конкретного запроса; не обещает идентификацию кабинета/всех прав |
| Start | Зрелая Ozon pending/commit/ack/first-response correlation с закреплённым store context | Новый prompt для выбранного источника; неизвестный Send не повторяется. Повтор активного того же магазина идемпотентен |
| Привязка | Binding хранит account/store/marketplace/credential/policy и baseline до Start | Смена выбора popup сама не изменяет действующего исполнителя. Смена ключей/удаление закрывает связанные локальные сессии |
| Capture/no replay | Структурный Ozon capture, один клик на блок, исходный порядок HELP/API; baseline исключает старую историю | Request ID связан с Work, assistant message ID и текстом. Сохранённые маркеры запрещают повтор после перерисовки; предел 2000 требует нового Start, не стирает защиту молча |
| WB application | `executeManualCommand` выбирает адаптер по binding; те же manual records, общий guarded queue, реальный finalize и delivery | Внутренний D2.3 adapter теперь подключён к popup/content. Код портов WB единственный; старые WB Work/worker/delivery не используются |
| Ozon application | API/registry/planning и зрелые hooks сохранены; settings поступают из закреплённого магазина | Seller доступен без Performance; legacy global slot используется только совместимостью до первого открытия нового popup |
| Hide/Finish | Hide меняет видимость; разрешённый пакет/доставка продолжаются. Finish закрывает контекст, очередь, наблюдение и поздние callback | Авторежим недоступен через сообщения и launcher, отсутствует в UI. Обычный пакет не обращается к control server |
| Текстовая доставка | Общие claim/insert/watch; добавлен сохраняемый send commit до клика | Повторный Send запрещён при неизвестном результате. Доказательство реального ИИ требует отдельной установленной проверки |
| Файлы | WB binary сохраняется в том же native IDB, передаётся через общий chunk/File/attach/send порт; исходное безопасное имя сохраняется | Метаданные/полные байты не подменяют факт отправки. Ссылки Ozon дополнительно закреплены за account/store/credential; чужая локальная ссылка отклоняется |
| TTL | Срок пакета максимум час от admission (не позже часа от получения); все производные WB файлы/текст наследуют deadline; чтение просроченного закрыто | Wake/пятиминутная housekeeping-задача удаляет payload; сон браузера может задерживать физическую очистку. Повтор доставки не продлевает срок |
| Sender/storage | Секреты не выдаются content script; privileged UI messages требуют popup sender; `storage.local` доступен TRUSTED_CONTEXTS | Аккаунт разработки явно показан в popup; это не реализация обязательной авторизации беты |

Проверенные части требований SA-UX/SHOP/WORK/CMD/DATA/QUOTA и сценариев A01–A32 сопоставлены отдельно в [матрице приёмки](ACCEPTANCE_MATRIX.md). Полные installed статусы этим сопоставлением не назначаются.

## Сборка и проверки

```sh
python tooling/checks/extension_core.py --output build/application-check
python -m pip install -r tooling/checks/extension-test-requirements.txt
python -m playwright install --with-deps chromium
python tests/regression/extension-core/browser_application.py --runtime build/application-check/package/runtime --output build/application-browser
```

`application-patches.json` задаёт точные проверяемые участки адаптации зрелых файлов Ozon. Сборщик требует единственного совпадения каждой границы; frozen donor не редактируется. Новые runtime-файлы и каждый patch входят в composition receipt. Архив детерминирован, source/extracted bytes сравниваются.

Старые проверки сохранены. В временной копии full-worker fixture settings/bind/resume/manual-mode/diagnostics вызываются от popup sender: прежний тест ошибочно посылал административные действия от content tab. Поведенческие assertions не отключаются; оригинал и RED route неизменны. Регрессия IDB проверяет request-success → transaction abort/complete.

Новый browser fixture использует установленное в тестовый Chromium расширение, реальные DOM/File/IDB и worker/content. ИИ и fetch заменены синтетическими данными. Popup открыт extension-страницей; только active-tab query указывает на fixture AI tab. Это не проверка toolbar popup конкретного браузера и не live ИИ. Проверяются 320/380 px и увеличенный размер текста; screenshots сохраняются в CI artifact.

Локальный Chromium в рабочей среде останавливается до загрузки расширения: `process_singleton_posix.cc`, `socket(): Operation not permitted`. Снять это ограничение локально не пытались; browser gate исполняется штатным CI.

## Незавершённые продуктовые части

I1: настоящие account/device/auth/bootstrap, изоляция по подтверждённому Seller Agents account, signed offline allowance, серверные ID магазинов и account scope диалогов. Сейчас application account — явно обозначенный local development; каталог имеет account port, но это не авторизация.

D3: единый защищённый экспорт/импорт всех магазинов и совместимость старых backup, consent relay, logout leave/delete, редкая синхронизация. Карточка не обещает подтверждённый providerAccountId или обнаружение совпавших кабинетов. Импорт ошибочного owner backup не объявляется исправленным без исходного файла.

Legacy `WB_FILE_V1` пока явно отклоняется; настоящая доставка файлов из разрешённых WB API уже идёт общим прикладным путём. Схемы WB/доступность 188 записей не пересертифицировались живыми вызовами. Численные квоты WB не изобретались; наблюдённый Retry-After использует локальный limiter, продолжение хвоста разрешает пользователь. Публичное WB wait содержит только площадку, источник Retry-After и deadline, без численных Ozon intervals или credential scope. Подсказка в чате требует явного продолжения для обоих источников; раннее нажатие не обходит deadline.

Нужны отдельные installed/live проверки целевых ИИ/браузеров, account scope, длительного sleep/restart и операционных сценариев. Исторический WB INSTALLED FAIL и R1–R8 BLOCKED сохраняются. Сервер, control_plane_v1, исходные baselines, live provider calls и production не изменялись.
