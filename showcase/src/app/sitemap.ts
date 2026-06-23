import type { MetadataRoute } from "next";
import { db } from "@/db";
import {
  applications,
  features,
  news,
  platformTypes,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { routing } from "@/i18n/routing";
import { newsPublicWhere } from "@/lib/news-publish";
import { SITE_URL } from "@/lib/metadata";

export const dynamic = "force-dynamic";

const STATIC_PATHS = [
  "",
  "/platforms",
  "/apps",
  "/features",
  "/news",
  "/about",
  "/contact",
  "/search",
];

function localeUrls(path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"]) {
  return routing.locales.map((locale) => ({
    url: `${SITE_URL}/${locale}${path}`,
    changeFrequency,
    priority,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = STATIC_PATHS.flatMap((path) =>
    localeUrls(path, path === "" ? 1 : 0.8, path === "/news" ? "daily" : "weekly"),
  );

  try {
    const [pts, apps, feats, newsItems] = await Promise.all([
      db.select({ slug: platformTypes.slug }).from(platformTypes),
      db.select({ slug: applications.slug }).from(applications),
      db
        .select({ slug: features.slug })
        .from(features)
        .where(eq(features.group, "B")),
      db.select({ slug: news.slug }).from(news).where(newsPublicWhere),
    ]);

    return [
      ...staticPages,
      ...pts.flatMap((p) =>
        localeUrls(`/platforms/${p.slug}`, 0.8, "weekly"),
      ),
      ...apps.flatMap((a) =>
        localeUrls(`/apps/${a.slug}`, 0.8, "weekly"),
      ),
      ...feats.flatMap((f) =>
        localeUrls(`/features/${f.slug}`, 0.7, "monthly"),
      ),
      ...newsItems.flatMap((n) =>
        localeUrls(`/news/${n.slug}`, 0.6, "monthly"),
      ),
    ];
  } catch {
    return staticPages;
  }
}
