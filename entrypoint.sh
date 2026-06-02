#!/bin/bash
set -e

# Kill any stray chromium/chrome processes in container
pkill -9 chromium || true
pkill -9 chrome || true
killall -9 chromium 2>/dev/null || true
killall -9 chrome 2>/dev/null || true

# Remove stale Chromium lock files from wwebjs_auth (keep session data intact)
find .wwebjs_auth -type l -name "Singleton*" -delete 2>/dev/null || true
find .wwebjs_auth -type f -name "Singleton*" -delete 2>/dev/null || true
find .wwebjs_auth -name "Lock" -delete 2>/dev/null || true

# Wipe browser cache (re-creatable)
rm -rf .wwebjs_cache 2>/dev/null || true
rm -rf /tmp/.org.chromium* 2>/dev/null || true

# Wait for filesystem to settle
sleep 3

# Start the application
exec node src/server.js
