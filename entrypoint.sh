#!/bin/bash
set -e

# Kill any stray chromium/chrome processes in container
pkill -9 chromium || true
pkill -9 chrome || true
killall -9 chromium 2>/dev/null || true
killall -9 chrome 2>/dev/null || true

# Force remove all lock files and profiles
rm -rf /root/.config/chromium 2>/dev/null || true
rm -rf /root/.wwebjs_auth 2>/dev/null || true
rm -rf /tmp/SingletonLock 2>/dev/null || true
rm -rf /tmp/.org.chromium* 2>/dev/null || true
rm -rf /tmp/.X* 2>/dev/null || true

# Wait for filesystem to settle
sleep 3

# Start the application
exec node src/server.js
