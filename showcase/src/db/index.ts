import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePostgres } from "drizzle-orm/postgres-js";
import { neon } from "@neondatabase/serverless";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const useNeon =
  connectionString.includes("neon.tech") ||
  process.env.USE_NEON_HTTP === "true";

export const db = useNeon
  ? drizzleNeon(neon(connectionString), { schema })
  : drizzlePostgres(
      postgres(connectionString, { prepare: false, max: 1 }),
      { schema },
    );

export type Database = typeof db;
