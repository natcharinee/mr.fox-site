import { and, isNotNull, notInArray, sql } from "drizzle-orm";
import { news } from "@/db/schema";
import { EXCLUDED_NEWS_SLUGS } from "@/lib/excluded-news-slugs";

export const newsPublicWhere = and(
  isNotNull(news.publishedAt),
  sql`(${news.publishedAt} AT TIME ZONE 'Asia/Bangkok')::date <= (now() AT TIME ZONE 'Asia/Bangkok')::date`,
  notInArray(news.slug, [...EXCLUDED_NEWS_SLUGS]),
);
