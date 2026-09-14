# Браузеры и ОС

Пять desktop целей: Chrome, Opera, Яндекс Браузер, Firefox, Safari. macOS заложена сразу. Мобильные браузеры и iOS не становятся обязательством автоматически.
Ни один пакет Seller Agents ещё не реализован/установленно принят в D0.

| Браузер | Техническая линия | Проверяем отдельно |
|---|---|---|
| Chrome | Chromium WebExtension / MV3 | Service worker lifecycle, permissions, files, popup, installed package |
| Opera | Chromium adapter с отдельным target manifest | Наличие нужных APIs, размеры popup, установка/обновление, AI/file |
| Яндекс Браузер | Chromium adapter с отдельным target manifest | Ограничения версии, UI, установка/обновление, AI/file |
| Firefox | WebExtensions platform adapter | Различия background lifecycle, Promise/message APIs, manifest, permissions, подпись |
| Safari | Safari Web Extension adapter/package | Packaging/entitlements, background/storage/files, фактическая Safari/macOS приёмка |

ОС отдельная ось: Windows и macOS в исходной целевой матрице; Linux проверяется для доступных браузерных выпусков при подготовке соответствующего канала. Нельзя обещать существование версии браузера на ОС без проверки.
Публикуем поддержку только фактически принятой комбинации browser version/OS/AI surface/package hash.
Новые стабильные browser версии проверяются при каждом кандидате и по мониторингу; точные minimum versions устанавливаются по используемым APIs, а не по предположению «любой Chromium».

## Общий код и различия

Повторное использование WebExtensions уменьшает дублирование, но различия API/manifest требуют адаптации: [MDN cross-browser extension](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Build_a_cross_browser_extension).
Chromium worker может завершаться; значения только в памяти не являются durable state: [Chrome lifecycle](https://developer.chrome.com/docs/extensions/develop/concepts/service-workers/lifecycle).
Все target implementations сохраняют продуктовые инварианты Start/Finish/no-replay/TTL; платформенные обходы не меняют UX незаметно.

Apple описывает Safari Web Extensions и варианты упаковки через App Store Connect: [Apple](https://developer.apple.com/safari/extensions/).
Возможность подготовить пакет не подтверждает его работу на Mac. До доступа к реальному Safari/macOS installed gate остаётся NOT_TESTED; Playwright WebKit не приравниваем к Safari.
Включение Safari в архитектуру не подменяем ложной отметкой «поддерживается» на сайте. Отсутствие тестового устройства отражается в OPEN_ITEMS.

## Статусы

PLANNED → IMPLEMENTED → FIXTURE_TESTED → INSTALLED_ACCEPTED → PUBLISHED.
FAIL сохраняется с версией и средой; не переименовывается в PASS из-за другой успешной среды.
Для каждого браузера обязательны: установка/обновление; popup/переключатель; Start/Finish; multi-command; два магазина; файл/часовой expiry; перезапуск; account isolation; offline; диагностика.
Проверки общих pure modules выполняются один раз на исходную сборку, установленные browser differences — по каждому target. Комбинаторный рост ограничивается риск-матрицей, без пропуска неподтверждённой платформы.
