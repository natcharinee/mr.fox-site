import { spawnSync } from "node:child_process";

function runStep(label: string, script: string, optional = false) {
  console.log(`\n▶ ${label}`);
  const result = spawnSync("tsx", [script], {
    stdio: "inherit",
    env: process.env,
  });

  if (result.status === 0) return;

  if (optional) {
    console.warn(`⚠ ${label} failed — continuing build.`);
    return;
  }

  console.error(`✗ ${label} failed — aborting build.`);
  process.exit(result.status ?? 1);
}

function preferDirectDatabaseUrl() {
  const direct = process.env.DATABASE_URL_DIRECT?.trim();
  if (!direct) return;

  console.log("Using DATABASE_URL_DIRECT for build-time database steps.");
  process.env.DATABASE_URL = direct;
}

const hasDatabaseUrl = Boolean(
  process.env.DATABASE_URL?.trim() || process.env.DATABASE_URL_DIRECT?.trim(),
);

if (!hasDatabaseUrl) {
  console.warn(
    "DATABASE_URL is not set — skipping schema migration, seed, and news import.",
  );
  console.warn("Set DATABASE_URL on Vercel to sync production data on deploy.");
} else {
  preferDirectDatabaseUrl();
  runStep("Schema migration", "scripts/push-schema.ts");
  runStep("Database seed", "scripts/seed.ts");
  runStep("News import", "scripts/import-info-mrfox-news.ts", true);
}
