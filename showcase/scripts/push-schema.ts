import "dotenv/config";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { neon } from "@neondatabase/serverless";

function resolveConnectionString(): string {
  const raw = process.env.DATABASE_URL_DIRECT ?? process.env.DATABASE_URL;
  if (!raw) {
    throw new Error("DATABASE_URL is not set");
  }
  return raw.replace(/&channel_binding=require/g, "");
}

function splitSql(sql: string): string[] {
  const statements: string[] = [];
  let current = "";
  let inDollarQuote = false;

  for (const line of sql.split("\n")) {
    current += `${line}\n`;
    const dollars = (line.match(/\$\$/g) ?? []).length;
    if (dollars % 2 === 1) {
      inDollarQuote = !inDollarQuote;
    }
    if (!inDollarQuote && line.trim().endsWith(";")) {
      statements.push(current.trim());
      current = "";
    }
  }

  if (current.trim()) {
    statements.push(current.trim());
  }

  return statements.filter(Boolean);
}

async function applySchemaPatches(sql: ReturnType<typeof neon>) {
  await sql.query(
    `ALTER TABLE applications ADD COLUMN IF NOT EXISTS published boolean DEFAULT true NOT NULL`,
  );
}

async function main() {
  const sql = neon(resolveConnectionString());
  const existing = await sql.query(
    "SELECT to_regclass('public.platform_categories') AS table_name",
  );
  if (existing[0]?.table_name) {
    console.log("Schema already exists, skipping migration.");
    await applySchemaPatches(sql);
    return;
  }

  const initSql = readFileSync(
    join(__dirname, "../src/db/init.sql"),
    "utf8",
  );
  const statements = splitSql(initSql);

  for (const statement of statements) {
    await sql.query(statement);
  }

  console.log(`Applied ${statements.length} schema statements.`);
}

main().catch((error) => {
  console.error("Schema migration failed:", error);
  process.exit(1);
});
