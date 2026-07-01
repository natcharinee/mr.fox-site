#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

for port in 3000 3003; do
  if pids=$(lsof -ti :"$port" 2>/dev/null); then
    echo "Stopping process on port $port..."
    kill $pids 2>/dev/null || true
    sleep 1
  fi
done

if [[ "${1:-}" == "prod" ]]; then
  if [[ ! -f .env.neon.local ]]; then
    echo "Missing .env.neon.local — copy from .env.neon.local.example and paste Neon URLs."
    exit 1
  fi
  echo "Starting dev with production Neon (.env.neon.local)..."
  set -a
  # shellcheck disable=SC1091
  source .env.neon.local
  set +a
else
  echo "Starting dev with local Docker Postgres (.env.local)..."
fi

exec npm run dev
