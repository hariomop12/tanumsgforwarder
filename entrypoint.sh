#!/bin/sh
set -e

# Kill any stray chromium/chrome processes
kill $(pidof chromium chrome chromium-browser 2>/dev/null) 2>/dev/null || true

# Remove stale Chromium lock files (keep WhatsApp session data)
find .wwebjs_auth -name "Singleton*" -exec rm -f {} + 2>/dev/null || true
find .wwebjs_auth -name "Lock" -exec rm -f {} + 2>/dev/null || true

# Wipe browser cache
rm -rf .wwebjs_cache 2>/dev/null || true
rm -rf /tmp/.org.chromium* 2>/dev/null || true

sleep 3

exec node src/server.js
