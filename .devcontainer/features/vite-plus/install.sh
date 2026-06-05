#!/usr/bin/env bash
set -euo pipefail

if [ "$(id -u)" -ne 0 ]; then
  echo "This script must be run as root."
  exit 1
fi

USERNAME="${_REMOTE_USER}"
USER_HOME="$(getent passwd "$USERNAME" | cut -d: -f6)"

INSTALLER=$(mktemp)
trap 'rm -f "$INSTALLER"' EXIT

if ! curl -fsSL https://vite.plus -o "$INSTALLER"; then
  echo "Failed to download Vite+ installer"
  exit 1
fi

chmod 644 "$INSTALLER"

if ! su - "$USERNAME" -c "bash '$INSTALLER'"; then
  echo "Failed to install Vite+ via the installer."
  exit 1
fi

if [ -x "${USER_HOME}/.vite-plus/bin/vp" ]; then
  ln -sfn "${USER_HOME}/.vite-plus/bin/vp" /usr/local/bin/vp
else
  echo "Did not create the symlink"
fi
