#!/usr/bin/env bash
set -Eeuo pipefail

SITE_ROOT="/var/www/octoport-site"
CURRENT_LINK="${SITE_ROOT}/current"
CERT_FILE="/etc/letsencrypt/live/octoport.ru/fullchain.pem"
DOMAINS=(octoport.ru www.octoport.ru app.octoport.ru api.octoport.ru)
EXPECTED_SITE_SHA="${EXPECTED_SITE_SHA:-}"
MAX_ATTEMPTS="${MAX_ATTEMPTS:-20}"
RETRY_DELAY="${RETRY_DELAY:-0.5}"

log() {
  printf '[octoport-site-verify] %s\n' "$*"
}

fail() {
  printf '[octoport-site-verify] ERROR: %s\n' "$*" >&2
  exit 1
}

require_command() {
  command -v "$1" >/dev/null 2>&1 || fail "missing required command: $1"
}

http_status() {
  local url=$1 host=$2 port=$3
  curl --silent --show-error --output /dev/null --write-out '%{http_code}' \
    --resolve "${host}:${port}:127.0.0.1" "${url}"
}

expect_status_with_retry() {
  local expected=$1 url=$2 host=$3 port=$4
  local attempt actual=""
  for ((attempt = 1; attempt <= MAX_ATTEMPTS; attempt++)); do
    actual="$(http_status "${url}" "${host}" "${port}" || true)"
    if [[ "${actual}" == "${expected}" ]]; then
      if (( attempt > 1 )); then
        log "${host} converged to HTTP ${expected} on attempt ${attempt}/${MAX_ATTEMPTS}"
      fi
      return 0
    fi
    sleep "${RETRY_DELAY}"
  done
  fail "${url} returned ${actual:-<no status>}, expected ${expected} after ${MAX_ATTEMPTS} attempts"
}

check_release() {
  [[ -L "${CURRENT_LINK}" ]] || fail "${CURRENT_LINK} is not a symlink"
  local target
  target="$(readlink -f "${CURRENT_LINK}")"
  [[ -d "${target}" ]] || fail "current release target does not exist: ${target}"

  local required
  for required in index.html styles.css robots.txt sitemap.xml; do
    [[ -f "${target}/${required}" ]] || fail "current release is missing ${required}"
  done

  if [[ -n "${EXPECTED_SITE_SHA}" ]]; then
    [[ "$(basename "${target}")" == "${EXPECTED_SITE_SHA}" ]] \
      || fail "current release is $(basename "${target}"), expected ${EXPECTED_SITE_SHA}"
  fi

  log "current release: ${target}"
}

check_certificate_file() {
  [[ -s "${CERT_FILE}" ]] || fail "missing certificate ${CERT_FILE}"
  openssl x509 -in "${CERT_FILE}" -noout -checkend 604800 >/dev/null \
    || fail "Octoport certificate expires within 7 days"

  local san domain
  san="$(openssl x509 -in "${CERT_FILE}" -noout -ext subjectAltName)"
  for domain in "${DOMAINS[@]}"; do
    grep -Fq "DNS:${domain}" <<<"${san}" || fail "certificate SAN does not contain ${domain}"
  done
}

check_served_certificates() {
  local expected_fp host attempt served_fp=""
  expected_fp="$(openssl x509 -in "${CERT_FILE}" -noout -fingerprint -sha256 | cut -d= -f2)"

  for host in "${DOMAINS[@]}"; do
    for ((attempt = 1; attempt <= MAX_ATTEMPTS; attempt++)); do
      served_fp="$(openssl s_client -connect 127.0.0.1:443 -servername "${host}" </dev/null 2>/dev/null \
        | openssl x509 -noout -fingerprint -sha256 2>/dev/null \
        | cut -d= -f2 || true)"
      if [[ "${served_fp}" == "${expected_fp}" ]]; then
        if (( attempt > 1 )); then
          log "${host} certificate converged on attempt ${attempt}/${MAX_ATTEMPTS}"
        fi
        break
      fi
      sleep "${RETRY_DELAY}"
    done
    [[ "${served_fp}" == "${expected_fp}" ]] || fail "${host} is not serving the Octoport certificate"
  done
}

check_site_content() {
  expect_status_with_retry 200 'https://octoport.ru/' octoport.ru 443
  expect_status_with_retry 200 'https://octoport.ru/styles.css' octoport.ru 443
  expect_status_with_retry 200 'https://octoport.ru/robots.txt' octoport.ru 443
  expect_status_with_retry 200 'https://octoport.ru/sitemap.xml' octoport.ru 443

  local homepage headers content_type csp
  homepage="$(curl --silent --show-error --resolve 'octoport.ru:443:127.0.0.1' 'https://octoport.ru/')"
  grep -Fq '<title>Octoport' <<<"${homepage}" || fail "homepage does not contain the Octoport title"
  grep -Fq 'Набор ещё не открыт' <<<"${homepage}" || fail "homepage beta-state copy is missing"

  headers="$(curl --silent --show-error --head --resolve 'octoport.ru:443:127.0.0.1' 'https://octoport.ru/')"
  csp="$(awk 'BEGIN{IGNORECASE=1} /^content-security-policy:/ {sub(/\r$/, ""); sub(/^[^:]+:[[:space:]]*/, ""); print; exit}' <<<"${headers}")"
  grep -Fq "default-src 'none'" <<<"${csp}" || fail "homepage CSP is missing the restrictive default-src"

  content_type="$(curl --silent --show-error --head --resolve 'octoport.ru:443:127.0.0.1' 'https://octoport.ru/styles.css' \
    | awk 'BEGIN{IGNORECASE=1} /^content-type:/ {sub(/\r$/, ""); print $2; exit}')"
  [[ "${content_type}" == text/css* ]] || fail "styles.css content-type is ${content_type:-<missing>}"
}

check_redirects_and_unavailable_apps() {
  local host location api_type api_body
  for host in "${DOMAINS[@]}"; do
    expect_status_with_retry 308 "http://${host}/" "${host}" 80
  done

  expect_status_with_retry 308 'https://www.octoport.ru/site-s1-check?probe=1' www.octoport.ru 443
  location="$(curl --silent --show-error --head \
    --resolve 'www.octoport.ru:443:127.0.0.1' \
    'https://www.octoport.ru/site-s1-check?probe=1' \
    | awk 'BEGIN{IGNORECASE=1} /^location:/ {sub(/\r$/, ""); print $2; exit}')"
  [[ "${location}" == 'https://octoport.ru/site-s1-check?probe=1' ]] \
    || fail "www redirect location is ${location:-<missing>}"

  expect_status_with_retry 503 'https://app.octoport.ru/' app.octoport.ru 443
  expect_status_with_retry 503 'https://api.octoport.ru/' api.octoport.ru 443

  api_type="$(curl --silent --show-error --head --resolve 'api.octoport.ru:443:127.0.0.1' 'https://api.octoport.ru/' \
    | awk 'BEGIN{IGNORECASE=1} /^content-type:/ {sub(/\r$/, ""); print $2; exit}')"
  [[ "${api_type}" == application/json* ]] || fail "API predeploy content-type is ${api_type:-<missing>}"
  api_body="$(curl --silent --show-error --resolve 'api.octoport.ru:443:127.0.0.1' 'https://api.octoport.ru/')"
  grep -Fq 'service_not_deployed' <<<"${api_body}" || fail "API predeploy body changed unexpectedly"
}

check_old_docs_service() {
  local status subject
  status="$(http_status 'https://docs.selleragents.ru/' docs.selleragents.ru 443 || true)"
  [[ "${status}" =~ ^[1-4][0-9][0-9]$ ]] || fail "docs.selleragents.ru returned unhealthy status ${status}"

  subject="$(openssl s_client -connect 127.0.0.1:443 -servername docs.selleragents.ru </dev/null 2>/dev/null \
    | openssl x509 -noout -subject 2>/dev/null || true)"
  grep -Fq 'docs.selleragents.ru' <<<"${subject}" || fail "docs.selleragents.ru certificate changed unexpectedly: ${subject:-<missing>}"
}

check_admin_not_enabled() {
  if nginx -T 2>&1 | grep -E 'server_name[^;]*admin\.octoport\.ru' >/dev/null; then
    fail "admin.octoport.ru is configured as an nginx application hostname"
  fi
}

main() {
  for command_name in awk basename curl grep nginx openssl readlink systemctl; do
    require_command "${command_name}"
  done

  nginx -t
  check_release
  check_certificate_file
  check_served_certificates
  check_site_content
  check_redirects_and_unavailable_apps
  check_old_docs_service
  check_admin_not_enabled
  systemctl is-active --quiet nginx || fail "nginx is not active"
  systemctl is-active --quiet certbot.timer || fail "certbot.timer is not active"

  log "PASS: live static site, TLS, redirects, unavailable app/API boundaries and old docs service"
}

main "$@"
