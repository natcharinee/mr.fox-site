#!/usr/bin/env bash
# Deploy Mr.FOX Showcase to Vercel staging/production.
# Prerequisites: Neon DATABASE_URL, AUTH_SECRET, VERCEL_TOKEN (and optional project IDs).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/showcase"

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "ERROR: DATABASE_URL is required (Neon connection string)."
  exit 1
fi

if [[ -z "${AUTH_SECRET:-}" ]]; then
  echo "ERROR: AUTH_SECRET is required (min 32 characters)."
  exit 1
fi

if [[ -z "${VERCEL_TOKEN:-}" ]]; then
  echo "ERROR: VERCEL_TOKEN is required. Create at https://vercel.com/account/tokens"
  exit 1
fi

echo "→ Pushing database schema..."
npm run db:push

echo "→ Seeding database..."
npm run db:seed

echo "→ Deploying to Vercel..."
DEPLOY_ARGS=(deploy --token "$VERCEL_TOKEN")
if [[ "${DEPLOY_PROD:-}" == "1" ]]; then
  DEPLOY_ARGS+=(--prod)
fi

if [[ -n "${VERCEL_ORG_ID:-}" && -n "${VERCEL_PROJECT_ID:-}" ]]; then
  DEPLOY_ARGS+=(--yes)
fi

npx vercel "${DEPLOY_ARGS[@]}"

echo ""
echo "Done. Next steps:"
echo "  1. Set DATABASE_URL, AUTH_SECRET, NEXT_PUBLIC_SITE_URL on Vercel"
echo "  2. Visit /api/health — should return {\"status\":\"ok\"}"
echo "  3. Visit /th and /admin/login"
echo "  4. Change default admin password after first login"
