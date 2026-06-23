import { and, isNotNull, sql } from "drizzle-orm";
import { news } from "@/db/schema";

export const newsPublicWhere = and(
  isNotNull(news.publishedAt),
  sql`(${news.publishedAt} AT TIME ZONE 'Asia/Bangkok')::date <= (now() AT TIME ZONE 'Asia/Bangkok')::date`,
);
