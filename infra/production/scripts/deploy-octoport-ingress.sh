#!/usr/bin/env bash
set -Eeuo pipefail

EXPECTED_IPV4="78.17.68.165"
ACME_ROOT="/var/www/octoport-acme"
NGINX_CONF_DIR="/etc/nginx/conf.d"
BOOTSTRAP_NAME="octoport-bootstrap.conf"
FINAL_NAME="octoport-predeploy.conf"
CERT_NAME="octoport.ru"
DOMAINS=(octoport.ru www.octoport.ru app.octoport.ru api.octoport.ru)
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
PRODUCTION_DIR="$(cd -- "${SCRIPT_DIR}/.." && pwd)"
SOURCE_BOOTSTRAP="${PRODUCTION_DIR}/nginx/${BOOTSTRAP_NAME}"
SOURCE_FINAL="${PRODUCTION_DIR}/nginx/${FINAL_NAME}"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
BACKUP_DIR="/var/backups/octoport-ingress/${STAMP}"
SUCCESS=0

log() {
  printf '[octoport-ingress] %s\n' "$*"
}

fail() {
  printf '[octoport-ingress] ERROR: %s\n' "$*" >&2
  exit 1
}

require_root() {
  [[ "${EUID}" -eq 0 ]] || fail "run as root"
}

require_command() {
  command -v "$1" >/dev/null 2>&1 || fail "missing required command: $1"
}

assert_source_files() {
  [[ -f "${SOURCE_BOOTSTRAP}" ]] || fail "missing ${SOURCE_BOOTSTRAP}"
  [[ -f "${SOURCE_FINAL}" ]] || fail "missing ${SOURCE_FINAL}"
  [[ -f "${SCRIPT_DIR}/verify-octoport-ingress.sh" ]] || fail "missing ingress verifier"
}

assert_server_ipv4() {
  local addresses
  addresses="$(ip -o -4 addr show scope global | awk '{print $4}' | cut -d/ -f1)"
  grep -Fxq "${EXPECTED_IPV4}" <<<"${addresses}" || {
    printf '%s\n' "${addresses}" >&2
    fail "expected public IPv4 ${EXPECTED_IPV4} is not configured on this host"
  }
}

assert_dns() {
  local domain resolved
  for domain in "${DOMAINS[@]}"; do
    resolved="$(getent ahostsv4 "${domain}" | awk '{print $1}' | sort -u)"
    grep -Fxq "${EXPECTED_IPV4}" <<<"${resolved}" || {
      printf '%s -> %s\n' "${domain}" "${resolved:-<no IPv4 answer>}" >&2
      fail "DNS for ${domain} does not resolve to ${EXPECTED_IPV4}"
    }
  done
}

backup_existing_octoport_configs() {
  install -d -m 0700 "${BACKUP_DIR}"
  shopt -s nullglob
  local file
  for file in "${NGINX_CONF_DIR}"/octoport*.conf; do
    cp -a "${file}" "${BACKUP_DIR}/"
  done
  shopt -u nullglob
}

capture_failure_diagnostics() {
  local diagnostics_dir="${BACKUP_DIR}/failure-diagnostics"
  local host

  install -d -m 0700 "${diagnostics_dir}" || true
  nginx -T >"${diagnostics_dir}/nginx-T.txt" 2>&1 || true
  ls -la "${NGINX_CONF_DIR}" >"${diagnostics_dir}/conf.d-listing.txt" 2>&1 || true
  systemctl status nginx --no-pager >"${diagnostics_dir}/nginx-status.txt" 2>&1 || true

  {
    for host in "${DOMAINS[@]}" docs.selleragents.ru; do
      printf '%s\n' "--- ${host} ---"
      openssl s_client -connect 127.0.0.1:443 -servername "${host}" </dev/null 2>/dev/null \
        | openssl x509 -noout -subject -issuer -fingerprint -sha256 -ext subjectAltName 2>/dev/null || true
    done
  } >"${diagnostics_dir}/served-certificates.txt" 2>&1

  log "failure diagnostics captured in ${diagnostics_dir}"
}

restore_previous_configs() {
  log "rolling back Octoport nginx config"
  rm -f "${NGINX_CONF_DIR}/${BOOTSTRAP_NAME}" "${NGINX_CONF_DIR}/${FINAL_NAME}"
  shopt -s nullglob
  local file
  for file in "${BACKUP_DIR}"/octoport*.conf; do
    cp -a "${file}" "${NGINX_CONF_DIR}/"
  done
  shopt -u nullglob
  if nginx -t; then
    systemctl reload nginx || true
  else
    log "WARNING: nginx config test failed during rollback; nginx was not reloaded"
  fi
}

on_exit() {
  local status=$?
  if [[ ${status} -ne 0 && ${SUCCESS} -ne 1 ]]; then
    capture_failure_diagnostics
    restore_previous_configs
  fi
  exit "${status}"
}

certbot_account_exists() {
  find /etc/letsencrypt/accounts -type f -name regr.json -print -quit 2>/dev/null | grep -q .
}

install_bootstrap() {
  install -d -m 0755 "${ACME_ROOT}/.well-known/acme-challenge"
  install -m 0644 "${SOURCE_BOOTSTRAP}" "${NGINX_CONF_DIR}/${BOOTSTRAP_NAME}"
  rm -f "${NGINX_CONF_DIR}/${FINAL_NAME}"
  nginx -t
  systemctl reload nginx
}

issue_certificate() {
  local args
  args=(
    certonly
    --webroot
    --webroot-path "${ACME_ROOT}"
    --cert-name "${CERT_NAME}"
    --non-interactive
    --agree-tos
    --keep-until-expiring
  )

  local domain
  for domain in "${DOMAINS[@]}"; do
    args+=(--domain "${domain}")
  done

  if [[ -n "${CERTBOT_EMAIL:-}" ]]; then
    args+=(--email "${CERTBOT_EMAIL}" --no-eff-email)
  elif ! certbot_account_exists; then
    fail "no existing Certbot account found; set CERTBOT_EMAIL before deployment"
  fi

  certbot "${args[@]}"

  [[ -s "/etc/letsencrypt/live/${CERT_NAME}/fullchain.pem" ]] || fail "certificate fullchain missing after Certbot"
  [[ -s "/etc/letsencrypt/live/${CERT_NAME}/privkey.pem" ]] || fail "certificate private key missing after Certbot"
}

install_final_config() {
  install -m 0644 "${SOURCE_FINAL}" "${NGINX_CONF_DIR}/${FINAL_NAME}"
  rm -f "${NGINX_CONF_DIR}/${BOOTSTRAP_NAME}"
  nginx -t
  systemctl reload nginx
}

main() {
  require_root
  for command_name in bash ip awk cut grep getent sort install cp rm nginx systemctl certbot find openssl curl ls; do
    require_command "${command_name}"
  done
  assert_source_files
  assert_server_ipv4
  assert_dns
  backup_existing_octoport_configs
  trap on_exit EXIT

  log "installing temporary ACME bootstrap vhost"
  install_bootstrap

  log "requesting/reusing certificate for ${DOMAINS[*]}"
  issue_certificate

  log "installing Octoport pre-deployment HTTPS vhosts"
  install_final_config

  log "running post-deploy verification"
  bash "${SCRIPT_DIR}/verify-octoport-ingress.sh"

  SUCCESS=1
  log "deployment completed; backup: ${BACKUP_DIR}"
}

main "$@"
