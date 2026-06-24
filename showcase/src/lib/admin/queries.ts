import { count, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  applications,
  auditLogs,
  banners,
  downloadEvents,
  downloadLinks,
  features,
  media,
  news,
  platformTypes,
  users,
} from "@/db/schema";

export async function getAdminDashboardStats() {
  const [
    [appCount],
    [newsCount],
    [featureCount],
    [platformCount],
    [downloadCount],
    [userCount],
    recentAudit,
    topApps,
  ] = await Promise.all([
    db.select({ count: count() }).from(applications),
    db.select({ count: count() }).from(news),
    db.select({ count: count() }).from(features),
    db.select({ count: count() }).from(platformTypes),
    db.select({ count: count() }).from(downloadEvents),
    db.select({ count: count() }).from(users),
    db
      .select({
        action: auditLogs.action,
        entity: auditLogs.entity,
        details: auditLogs.details,
        createdAt: auditLogs.createdAt,
      })
      .from(auditLogs)
      .orderBy(desc(auditLogs.createdAt))
      .limit(10),
    db
      .select({
        name: applications.name,
        slug: applications.slug,
        downloadCount: applications.downloadCount,
      })
      .from(applications)
      .orderBy(desc(applications.downloadCount))
      .limit(5),
  ]);

  return {
    apps: appCount?.count ?? 0,
    news: newsCount?.count ?? 0,
    features: featureCount?.count ?? 0,
    platforms: platformCount?.count ?? 0,
    downloads: downloadCount?.count ?? 0,
    users: userCount?.count ?? 0,
    recentAudit,
    topApps,
  };
}

export async function getAnalyticsData() {
  const [downloadsByType, downloadsByApp, auditByDay] = await Promise.all([
    db
      .select({
        type: downloadEvents.linkType,
        count: count(),
      })
      .from(downloadEvents)
      .groupBy(downloadEvents.linkType),
    db
      .select({
        name: applications.name,
        count: count(),
      })
      .from(downloadEvents)
      .innerJoin(applications, eq(downloadEvents.applicationId, applications.id))
      .groupBy(applications.name)
      .orderBy(desc(count()))
      .limit(10),
    db
      .select({
        day: sql<string>`date_trunc('day', ${auditLogs.createdAt})::date`,
        count: count(),
      })
      .from(auditLogs)
      .groupBy(sql`date_trunc('day', ${auditLogs.createdAt})`)
      .orderBy(desc(sql`date_trunc('day', ${auditLogs.createdAt})`))
      .limit(14),
  ]);

  return { downloadsByType, downloadsByApp, auditByDay };
}

export async function getAllMedia() {
  return db.select().from(media).orderBy(desc(media.createdAt));
}

export async function getAllUsers() {
  return db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(users.id);
}

export async function getAllBanners() {
  return db.select().from(banners).orderBy(banners.sortOrder);
}

export async function getAllApplicationsAdmin() {
  return db
    .select({
      id: applications.id,
      name: applications.name,
      slug: applications.slug,
      featured: applications.featured,
      published: applications.published,
      posterUrl: applications.posterUrl,
      posterFocus: applications.posterFocus,
      featuredPosterUrl: applications.featuredPosterUrl,
      featuredPosterFocus: applications.featuredPosterFocus,
      downloadCount: applications.downloadCount,
      platformTypeName: platformTypes.name,
    })
    .from(applications)
    .innerJoin(platformTypes, eq(applications.platformTypeId, platformTypes.id))
    .orderBy(applications.sortOrder);
}

export async function getApplicationById(id: number) {
  const [row] = await db
    .select()
    .from(applications)
    .where(eq(applications.id, id))
    .limit(1);

  if (!row) return null;

  const links = await db
    .select({
      type: downloadLinks.type,
      url: downloadLinks.url,
    })
    .from(downloadLinks)
    .where(eq(downloadLinks.applicationId, id));

  return { ...row, links };
}

export async function getAllPlatformsAdmin() {
  return db.select().from(platformTypes).orderBy(platformTypes.sortOrder);
}

export async function getAllFeaturesAdmin() {
  return db.select().from(features).orderBy(features.sortOrder);
}

export async function getAllNewsAdmin() {
  return db.select().from(news).orderBy(desc(news.publishedAt));
}

export async function getNewsById(id: number) {
  const [row] = await db
    .select()
    .from(news)
    .where(eq(news.id, id))
    .limit(1);
  return row ?? null;
}

export async function getPlatformById(id: number) {
  const [row] = await db
    .select()
    .from(platformTypes)
    .where(eq(platformTypes.id, id))
    .limit(1);
  return row ?? null;
}

export async function getFeatureById(id: number) {
  const [row] = await db
    .select()
    .from(features)
    .where(eq(features.id, id))
    .limit(1);
  return row ?? null;
}
