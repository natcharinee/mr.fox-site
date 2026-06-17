#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/showcase"

PROJECT_ID="royal-violet-23505403"
AUTH_SECRET="${AUTH_SECRET:-i/1agpNA7ESoLmCBFlzwIekT82nANEUvdELXOUUavQ4=}"
URL_FILE="$(mktemp)"
DIRECT_URL_FILE="$(mktemp)"
trap 'rm -f "$URL_FILE" "$DIRECT_URL_FILE"' EXIT

node -e "
const { execSync } = require('child_process');

function getUri(args) {
  const raw = execSync(args, { stdio: ['ignore', 'pipe', 'pipe'] })
    .toString()
    .trim();
  const uri = raw.startsWith('postgresql://')
    ? raw
    : JSON.parse(raw).connection_uri || JSON.parse(raw).uri;
  return uri.replace(/&channel_binding=require/g, '');
}

const fs = require('fs');
fs.writeFileSync(
  '${URL_FILE}',
  getUri('npx neonctl connection-string --project-id ${PROJECT_ID} --pooled'),
);
fs.writeFileSync(
  '${DIRECT_URL_FILE}',
  getUri('npx neonctl connection-string --project-id ${PROJECT_ID}'),
);
"

echo "→ Setting Vercel environment variables..."
DB_URL="$(cat "$URL_FILE")"
DIRECT_URL="$(cat "$DIRECT_URL_FILE")"
SITE_URL="https://mrfox-showcase.vercel.app"
npx vercel env add DATABASE_URL production --value "$DB_URL" --yes --force
npx vercel env add DATABASE_URL_DIRECT production --value "$DIRECT_URL" --yes --force
npx vercel env add AUTH_SECRET production --value "$AUTH_SECRET" --yes --force
npx vercel env add NEXT_PUBLIC_SITE_URL production --value "$SITE_URL" --yes --force

echo "→ Deploying to Vercel (schema + seed run during build)..."
npx vercel deploy --prod --yes

echo "→ Done. Verify:"
echo "   https://mrfox-showcase.vercel.app/api/health"
echo "   https://mrfox-showcase.vercel.app/th"
echo "   https://mrfox-showcase.vercel.app/admin/login"
