import { and, count, desc, eq, ilike, ne, or } from "drizzle-orm";
import { db } from "@/db";
import {
  applications,
  banners,
  categoryRevenue,
  downloadEvents,
  downloadLinks,
  features,
  news,
  platformCategories,
  platformTypeFeatures,
  platformTypePermissions,
  platformTypes,
} from "@/db/schema";
import { newsPublicWhere } from "@/lib/news-publish-sql";

export async function getActiveBanners() {
  return db
    .select()
    .from(banners)
    .where(eq(banners.active, true))
    .orderBy(banners.sortOrder);
}

export async function getSiteStats() {
  const [platformTypeCount] = await db.select({ count: count() }).from(platformTypes);
  const [appCount] = await db.select({ count: count() }).from(applications);
  const [featureCount] = await db
    .select({ count: count() })
    .from(features)
    .where(eq(features.group, "B"));
  const [downloadTotal] = await db
    .select({ count: count() })
    .from(downloadEvents);

  return {
    platformTypes: platformTypeCount?.count ?? 0,
    applications: appCount?.count ?? 0,
    features: featureCount?.count ?? 0,
    downloads: downloadTotal?.count ?? 0,
  };
}

export async function getCategories() {
  return db
    .select()
    .from(platformCategories)
    .orderBy(platformCategories.sortOrder);
}

export async function getPlatformTypes() {
  return db
    .select({
      id: platformTypes.id,
      name: platformTypes.name,
      slug: platformTypes.slug,
      concept: platformTypes.concept,
      shortDescription: platformTypes.shortDescription,
      categoryName: platformCategories.name,
      categorySlug: platformCategories.slug,
    })
    .from(platformTypes)
    .innerJoin(
      platformCategories,
      eq(platformTypes.categoryId, platformCategories.id),
    )
    .orderBy(platformTypes.sortOrder);
}

export async function getPlatformTypeBySlug(slug: string) {
  const [row] = await db
    .select({
      id: platformTypes.id,
      name: platformTypes.name,
      slug: platformTypes.slug,
      concept: platformTypes.concept,
      shortDescription: platformTypes.shortDescription,
      creatorModel: platformTypes.creatorModel,
      visitorModel: platformTypes.visitorModel,
      categoryName: platformCategories.name,
      categorySlug: platformCategories.slug,
      categoryId: platformCategories.id,
    })
    .from(platformTypes)
    .innerJoin(
      platformCategories,
      eq(platformTypes.categoryId, platformCategories.id),
    )
    .where(eq(platformTypes.slug, slug))
    .limit(1);

  return row ?? null;
}

export async function getPlatformFeatureMatrix(platformTypeId: number) {
  return db
    .select({
      featureName: features.name,
      featureSlug: features.slug,
      group: features.group,
      status: platformTypeFeatures.status,
    })
    .from(platformTypeFeatures)
    .innerJoin(features, eq(platformTypeFeatures.featureId, features.id))
    .where(eq(platformTypeFeatures.platformTypeId, platformTypeId))
    .orderBy(features.sortOrder);
}

export async function getPlatformPermissions(platformTypeId: number) {
  return db
    .select()
    .from(platformTypePermissions)
    .where(eq(platformTypePermissions.platformTypeId, platformTypeId));
}

export async function getCategoryRevenue(categoryId: number) {
  return db
    .select()
    .from(categoryRevenue)
    .where(eq(categoryRevenue.categoryId, categoryId));
}

export async function getAppsByPlatformType(platformTypeId: number) {
  return db
    .select()
    .from(applications)
    .where(eq(applications.platformTypeId, platformTypeId))
    .orderBy(applications.sortOrder);
}

export async function getApplications(filters?: {
  categorySlug?: string;
  platformTypeSlug?: string;
  search?: string;
}) {
  const conditions = [eq(applications.published, true)];
  if (filters?.categorySlug) {
    conditions.push(eq(platformCategories.slug, filters.categorySlug));
  }
  if (filters?.platformTypeSlug) {
    conditions.push(eq(platformTypes.slug, filters.platformTypeSlug));
  }
  if (filters?.search) {
    const searchClause = or(
      ilike(applications.name, `%${filters.search}%`),
      ilike(applications.description, `%${filters.search}%`),
    );
    if (searchClause) {
      conditions.push(searchClause);
    }
  }

  const whereClause = and(...conditions);

  return db
    .select({
      id: applications.id,
      name: applications.name,
      slug: applications.slug,
      logoUrl: applications.logoUrl,
      posterUrl: applications.posterUrl,
      posterFocus: applications.posterFocus,
      featuredPosterUrl: applications.featuredPosterUrl,
      featuredPosterFocus: applications.featuredPosterFocus,
      description: applications.description,
      featured: applications.featured,
      platformTypeName: platformTypes.name,
      platformTypeSlug: platformTypes.slug,
      categoryName: platformCategories.name,
      categorySlug: platformCategories.slug,
    })
    .from(applications)
    .innerJoin(platformTypes, eq(applications.platformTypeId, platformTypes.id))
    .innerJoin(
      platformCategories,
      eq(platformTypes.categoryId, platformCategories.id),
    )
    .where(whereClause)
    .orderBy(applications.sortOrder);
}

export async function getFeaturedApplications(limit?: number) {
  const query = db
    .select({
      id: applications.id,
      name: applications.name,
      slug: applications.slug,
      logoUrl: applications.logoUrl,
      posterUrl: applications.posterUrl,
      posterFocus: applications.posterFocus,
      featuredPosterUrl: applications.featuredPosterUrl,
      featuredPosterFocus: applications.featuredPosterFocus,
      description: applications.description,
      platformTypeName: platformTypes.name,
      platformTypeSlug: platformTypes.slug,
      categoryName: platformCategories.name,
    })
    .from(applications)
    .innerJoin(platformTypes, eq(applications.platformTypeId, platformTypes.id))
    .innerJoin(
      platformCategories,
      eq(platformTypes.categoryId, platformCategories.id),
    )
    .where(and(eq(applications.featured, true), eq(applications.published, true)))
    .orderBy(applications.sortOrder);

  if (limit != null) {
    return query.limit(limit);
  }

  return query;
}

export async function getApplicationBySlug(slug: string) {
  const [row] = await db
    .select({
      id: applications.id,
      name: applications.name,
      slug: applications.slug,
      logoUrl: applications.logoUrl,
      posterUrl: applications.posterUrl,
      posterFocus: applications.posterFocus,
      featuredPosterUrl: applications.featuredPosterUrl,
      featuredPosterFocus: applications.featuredPosterFocus,
      description: applications.description,
      targetAudience: applications.targetAudience,
      platformTypeId: applications.platformTypeId,
      platformTypeName: platformTypes.name,
      platformTypeSlug: platformTypes.slug,
      categoryName: platformCategories.name,
    })
    .from(applications)
    .innerJoin(platformTypes, eq(applications.platformTypeId, platformTypes.id))
    .innerJoin(
      platformCategories,
      eq(platformTypes.categoryId, platformCategories.id),
    )
    .where(and(eq(applications.slug, slug), eq(applications.published, true)))
    .limit(1);

  return row ?? null;
}

export async function getDownloadLinks(applicationId: number) {
  const rows = await db
    .select({
      id: downloadLinks.id,
      type: downloadLinks.type,
      url: downloadLinks.url,
    })
    .from(downloadLinks)
    .where(eq(downloadLinks.applicationId, applicationId))
    .orderBy(downloadLinks.id);

  const byType = new Map<string, (typeof rows)[number]>();
  for (const row of rows) {
    if (!byType.has(row.type)) {
      byType.set(row.type, row);
    }
  }

  return Array.from(byType.values());
}

export async function getRelatedApplications(
  platformTypeId: number,
  excludeSlug: string,
  limit = 3,
) {
  return db
    .select({
      name: applications.name,
      slug: applications.slug,
      platformTypeName: platformTypes.name,
    })
    .from(applications)
    .innerJoin(platformTypes, eq(applications.platformTypeId, platformTypes.id))
    .where(
      and(
        eq(applications.platformTypeId, platformTypeId),
        eq(applications.published, true),
        ne(applications.slug, excludeSlug),
      ),
    )
    .orderBy(applications.sortOrder)
    .limit(limit);
}

export async function getShowcaseFeatures() {
  return db
    .select()
    .from(features)
    .where(eq(features.group, "B"))
    .orderBy(features.sortOrder);
}

export async function getCoreFeatures(limit = 6) {
  return getShowcaseFeatures().then((rows) => rows.slice(0, limit));
}

export async function getFeatureBySlug(slug: string) {
  const [row] = await db
    .select()
    .from(features)
    .where(eq(features.slug, slug))
    .limit(1);
  return row ?? null;
}

export async function getAppsUsingFeature(featureId: number) {
  const typesWithFeature = await db
    .select({ platformTypeId: platformTypeFeatures.platformTypeId })
    .from(platformTypeFeatures)
    .where(
      and(
        eq(platformTypeFeatures.featureId, featureId),
        ne(platformTypeFeatures.status, "no"),
      ),
    );

  if (typesWithFeature.length === 0) return [];

  const typeIds = typesWithFeature.map((t) => t.platformTypeId);
  const allApps = await db
    .select({
      name: applications.name,
      slug: applications.slug,
      platformTypeId: applications.platformTypeId,
      published: applications.published,
    })
    .from(applications);

  return allApps.filter(
    (app) => typeIds.includes(app.platformTypeId) && app.published,
  );
}

export async function getLatestNews(limit = 3) {
  return db
    .select()
    .from(news)
    .where(newsPublicWhere)
    .orderBy(desc(news.publishedAt))
    .limit(limit);
}

export async function getAllNews() {
  return db
    .select()
    .from(news)
    .where(newsPublicWhere)
    .orderBy(desc(news.publishedAt));
}

export async function getNewsBySlug(slug: string) {
  const [row] = await db
    .select()
    .from(news)
    .where(and(eq(news.slug, slug), newsPublicWhere))
    .limit(1);
  return row ?? null;
}

export async function globalSearch(q: string) {
  const term = `%${q}%`;
  const [platformResults, appResults, featureResults, newsResults] =
    await Promise.all([
      db
        .select({ name: platformTypes.name, slug: platformTypes.slug })
        .from(platformTypes)
        .where(or(ilike(platformTypes.name, term), ilike(platformTypes.concept, term)))
        .limit(5),
      db
        .select({ name: applications.name, slug: applications.slug })
        .from(applications)
        .where(
          and(
            eq(applications.published, true),
            or(ilike(applications.name, term), ilike(applications.description, term)),
          ),
        )
        .limit(5),
      db
        .select({ name: features.name, slug: features.slug })
        .from(features)
        .where(or(ilike(features.name, term), ilike(features.description, term)))
        .limit(5),
      db
        .select({ name: news.title, slug: news.slug })
        .from(news)
        .where(and(or(ilike(news.title, term), ilike(news.excerpt, term)), newsPublicWhere))
        .limit(5),
    ]);

  return {
    platforms: platformResults.map((r) => ({ ...r, type: "platform" as const })),
    apps: appResults.map((r) => ({ ...r, type: "app" as const })),
    features: featureResults.map((r) => ({ ...r, type: "feature" as const })),
    news: newsResults.map((r) => ({ ...r, type: "news" as const })),
  };
}
