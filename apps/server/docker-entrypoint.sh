#!/bin/sh
set -e
# Run seed (idempotent); ignore failure so already-seeded DB does not block startup
node dist/scripts/seed.js 2>/dev/null || true
exec node dist/server.js
