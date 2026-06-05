#!/usr/bin/env bash
set -euo pipefail

if [ "$(id -u)" -ne 0 ]; then
    echo "This script must be run as root."
    exit 1
fi

FEATURE_DIR="$(dirname "$0")"
USERNAME="${_REMOTE_USER}"
USER_HOME="$(getent passwd "$USERNAME" | cut -d: -f6)"
USER_GROUP="$(id -gn "$USERNAME" 2>/dev/null || echo "$USERNAME")"
STORE_DIR="/var/cache/pnpm"

# Write store-dir to ~/.npmrc at build time so pnpm uses it immediately
NPMRC="${USER_HOME}/.npmrc"
mkdir -p "${USER_HOME}"
touch "${NPMRC}"
{ grep -v '^store-dir=' "${NPMRC}" 2>/dev/null || true; } > "${NPMRC}.tmp"
mv "${NPMRC}.tmp" "${NPMRC}"
echo "store-dir=${STORE_DIR}" >> "${NPMRC}"
chown "${USERNAME}:${USER_GROUP}" "${NPMRC}"

# Create the store directory during image build — the named volume declared in
# devcontainer-feature.json shadows this at container start, but pnpm needs the
# path to exist during any build-time invocations.
mkdir -p "${STORE_DIR}"
chown "${USERNAME}:${USER_GROUP}" "${STORE_DIR}"

# Install the postCreate guard script that fixes store ownership at container start.
# Named volumes are created root-owned, so this runs before pnpm can write to the store.
cp "${FEATURE_DIR}/scripts/devcontainer-pnpm-store" /usr/local/bin/devcontainer-pnpm-store
chmod +x /usr/local/bin/devcontainer-pnpm-store
