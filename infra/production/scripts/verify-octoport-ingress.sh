#!/usr/bin/env bash
set -Eeuo pipefail

EXPECTED_IPV4="78.17.68.165"
CERT_NAME="octoport.ru"
CERT_FILE="/etc/letsencrypt/live/${CERT_NAME}/fullchain.pem"
DOMAINS=(octoport.ru www.octoport.ru app.octoport.ru api.octoport.ru)
VERIFY_ATTEMPTS=20
VERIFY_DELAY_SECONDS=0.5

log() {
  printf '[octoport-verify] %s\n' "$*"
}

fail() {
  printf '[octoport-verify] ERROR: %s\n' "$*" >&2
  exit 1
}

served_certificate_fingerprint() {
  local host=$1
  openssl s_client -connect 127.0.0.1:443 -servername "${host}" </dev/null 2>/dev/null \
    | openssl x509 -noout -fingerprint -sha256 2>/dev/null \
    | cut -d= -f2
}

served_certificate_subject() {
  local host=$1
  openssl s_client -connect 127.0.0.1:443 -servername "${host}" </dev/null 2>/dev/null \
    | openssl x509 -noout -subject 2>/dev/null || true
}

wait_for_served_certificate() {
  local host=$1
  local expected_fp=$2
  local attempt served_fp

  for ((attempt = 1; attempt <= VERIFY_ATTEMPTS; attempt += 1)); do
    served_fp="$(served_certificate_fingerprint "${host}" || true)"
    if [[ -n "${served_fp}" && "${served_fp}" == "${expected_fp}" ]]; then
      if (( attempt > 1 )); then
        log "${host} began serving the Octoport certificate on attempt ${attempt}/${VERIFY_ATTEMPTS}"
      fi
      return 0
    fi
    sleep "${VERIFY_DELAY_SECONDS}"
  done

  printf '[octoport-verify] served certificate for %s after %s attempts: %s\n' \
    "${host}" "${VERIFY_ATTEMPTS}" "$(served_certificate_subject "${host}")" >&2
  fail "${host} is not serving the Octoport certificate"
}

expect_status() {
  local expected=$1
  local url=$2
  local host=$3
  local port=$4
  local attempt actual=""

  for ((attempt = 1; attempt <= VERIFY_ATTEMPTS; attempt += 1)); do
    actual="$(curl --silent --show-error --connect-timeout 2 --max-time 5 \
      --output /dev/null --write-out '%{http_code}' \
      --resolve "${host}:${port}:127.0.0.1" "${url}" 2>/dev/null || true)"
    if [[ "${actual}" == "${expected}" ]]; then
      return 0
    fi
    sleep "${VERIFY_DELAY_SECONDS}"
  done

  fail "${url} returned ${actual:-<curl failed>}, expected ${expected} after ${VERIFY_ATTEMPTS} attempts"
}

check_dns() {
  local domain resolved
  for domain in "${DOMAINS[@]}"; do
    resolved="$(getent ahostsv4 "${domain}" | awk '{print $1}' | sort -u)"
    grep -Fxq "${EXPECTED_IPV4}" <<<"${resolved}" || fail "${domain} does not resolve to ${EXPECTED_IPV4}"
  done
}

check_certificate_file() {
  [[ -s "${CERT_FILE}" ]] || fail "missing certificate ${CERT_FILE}"
  openssl x509 -in "${CERT_FILE}" -noout -checkend 604800 >/dev/null || fail "certificate expires within 7 days"

  local san domain
  san="$(openssl x509 -in "${CERT_FILE}" -noout -ext subjectAltName)"
  for domain in "${DOMAINS[@]}"; do
    grep -Fq "DNS:${domain}" <<<"${san}" || fail "certificate SAN does not contain ${domain}"
  done
}

check_served_certificates() {
  local expected_fp host
  expected_fp="$(openssl x509 -in "${CERT_FILE}" -noout -fingerprint -sha256 | cut -d= -f2)"
  for host in "${DOMAINS[@]}"; do
    wait_for_served_certificate "${host}" "${expected_fp}"
  done
}

check_http_behavior() {
  local host
  for host in "${DOMAINS[@]}"; do
    expect_status 308 "http://${host}/" "${host}" 80
  done

  expect_status 503 "https://octoport.ru/" octoport.ru 443
  expect_status 503 "https://app.octoport.ru/" app.octoport.ru 443
  expect_status 503 "https://api.octoport.ru/" api.octoport.ru 443
  expect_status 308 "https://www.octoport.ru/domain-d2-check" www.octoport.ru 443

  local location attempt
  location=""
  for ((attempt = 1; attempt <= VERIFY_ATTEMPTS; attempt += 1)); do
    location="$(curl --silent --show-error --head --connect-timeout 2 --max-time 5 \
      --resolve 'www.octoport.ru:443:127.0.0.1' \
      'https://www.octoport.ru/domain-d2-check?probe=1' 2>/dev/null \
      | awk 'BEGIN{IGNORECASE=1} /^location:/ {sub(/\r$/, ""); print $2; exit}' || true)"
    if [[ "${location}" == "https://octoport.ru/domain-d2-check?probe=1" ]]; then
      return 0
    fi
    sleep "${VERIFY_DELAY_SECONDS}"
  done
  fail "www redirect location is ${location:-<missing>}"
}

check_old_docs_service() {
  local status
  status="$(curl --silent --show-error --output /dev/null --write-out '%{http_code}' \
    --resolve 'docs.selleragents.ru:443:127.0.0.1' \
    'https://docs.selleragents.ru/')"
  [[ "${status}" =~ ^[1-4][0-9][0-9]$ ]] || fail "docs.selleragents.ru returned unhealthy status ${status}"
}

check_admin_not_enabled() {
  if nginx -T 2>&1 | grep -E 'server_name[^;]*admin\.octoport\.ru' >/dev/null; then
    fail "admin.octoport.ru is configured as an nginx application hostname; initial topology forbids this"
  fi
}

main() {
  command -v nginx >/dev/null || fail "nginx is missing"
  command -v curl >/dev/null || fail "curl is missing"
  command -v openssl >/dev/null || fail "openssl is missing"
  command -v getent >/dev/null || fail "getent is missing"
  command -v sleep >/dev/null || fail "sleep is missing"

  nginx -t
  check_dns
  check_certificate_file
  check_served_certificates
  check_http_behavior
  check_old_docs_service
  check_admin_not_enabled

  systemctl is-active --quiet certbot.timer || fail "certbot.timer is not active"

  log "PASS: DNS, TLS, redirects, explicit predeploy responses and old docs service"
}

main "$@"
