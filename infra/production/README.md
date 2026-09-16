# infra/production

Production beta эксплуатация: TLS, email, secret injection, backups/restore, admission initially closed.

Текущая доменная authority: [Octoport ingress plan](../../docs/server/DOMAIN_INGRESS_PLAN_2026-09-16.md).

## DOMAIN-D2: Octoport ingress pre-deployment

D2 подготавливает только безопасный HTTPS ingress для доменов, DNS которых уже указывает на `78.17.68.165`:

- `octoport.ru`;
- `www.octoport.ru`;
- `app.octoport.ru`;
- `api.octoport.ru`.

`admin.octoport.ru` не является отдельным application origin. Будущая админка остаётся same-origin по адресу `https://app.octoport.ru/admin/`.

D2 намеренно **не** разворачивает portal/API/admin и не проксирует на несуществующие application-процессы. До реального deployment:

- `octoport.ru` отвечает явным `503`;
- `app.octoport.ru` отвечает явным `503`;
- `api.octoport.ru` отвечает явным JSON `503`;
- `www.octoport.ru` делает постоянный redirect на `https://octoport.ru`;
- HTTP на включённых Octoport-hostnames переводится на HTTPS после выпуска сертификата;
- `docs.selleragents.ru` не меняется.

Файлы:

- `nginx/octoport-bootstrap.conf` — временный HTTP vhost для ACME webroot challenge;
- `nginx/octoport-predeploy.conf` — финальный D2 HTTPS ingress до deployment приложений;
- `scripts/deploy-octoport-ingress.sh` — bounded deploy с DNS/IP preflight, backup, Certbot, `nginx -t`, reload и rollback при ошибке;
- `scripts/verify-octoport-ingress.sh` — проверка DNS, SAN сертификата, реально выдаваемого сертификата, redirect/status behavior, сохранности старого docs-host и `certbot.timer`.

Запуск выполняется только на целевом сервере из проверенного checkout этой ветки:

```bash
bash infra/production/scripts/deploy-octoport-ingress.sh
```

Если на сервере нет уже зарегистрированного Certbot account, перед запуском требуется передать email только через окружение:

```bash
CERTBOT_EMAIL='owner@example.com' bash infra/production/scripts/deploy-octoport-ingress.sh
```

Email в Git не сохраняется.

После deployment отдельная проверка:

```bash
bash infra/production/scripts/verify-octoport-ingress.sh
```

D2 не является production launch. Реальные upstream для portal/admin/API добавляются отдельным этапом после их production deployment и acceptance.

Границы репозитория: [архитектура](../../docs/architecture/OVERVIEW.md), [размещение](../../docs/architecture/REPOSITORY.md), [текущий статус](../../docs/STATUS.md).
