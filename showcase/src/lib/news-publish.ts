import { and, isNotNull, lte, sql } from "drizzle-orm";
import { news } from "@/db/schema";

export type NewsPublishStatus = "draft" | "scheduled" | "published";

const BANGKOK_TZ = "Asia/Bangkok";

export function parseNewsPublishDate(value: string | undefined): Date | null {
  if (!value) return null;
  return new Date(`${value}T00:00:00+07:00`);
}

export function formatNewsPublishDateInput(value: Date | null): string {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-CA", { timeZone: BANGKOK_TZ }).format(
    new Date(value),
  );
}

export function getNewsPublishStatus(
  publishedAt: Date | null,
  now = new Date(),
): NewsPublishStatus {
  if (!publishedAt) return "draft";
  if (new Date(publishedAt).getTime() > now.getTime()) return "scheduled";
  return "published";
}

export function isNewsPublic(
  publishedAt: Date | null,
  now = new Date(),
): boolean {
  return getNewsPublishStatus(publishedAt, now) === "published";
}

export const newsPublicWhere = and(
  isNotNull(news.publishedAt),
  lte(news.publishedAt, sql`now()`),
);
