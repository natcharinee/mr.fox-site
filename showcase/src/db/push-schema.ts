import "dotenv/config";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { neon } from "@neondatabase/serverless";

const connectionString = (
  process.env.DATABASE_URL_DIRECT ?? process.env.DATABASE_URL
)?.replace(/&channel_binding=require/g, "");

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

async function main() {
  const sql = neon(connectionString);
  const existing = await sql.query(
    "SELECT to_regclass('public.platform_categories') AS table_name",
  );
  if (existing[0]?.table_name) {
    console.log("Schema already exists, skipping migration.");
    return;
  }

  const initSql = readFileSync(join(__dirname, "init.sql"), "utf8");
  const statements = initSql
    .split(/;\s*\n/)
    .map((statement) => statement.trim())
    .filter(Boolean);

  for (const statement of statements) {
    await sql.query(`${statement};`);
  }

  console.log(`Applied ${statements.length} schema statements.`);
}

main().catch((error) => {
  console.error("Schema migration failed:", error);
  process.exit(1);
});
