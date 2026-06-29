"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import {
  applications,
  auditLogs,
  banners,
  downloadLinks,
  features,
  media,
  news,
  platformTypes,
  users,
} from "@/db/schema";
import { logAudit } from "@/lib/audit";
import { requireSession } from "@/lib/auth";
import { parseNewsPublishDate } from "@/lib/news-publish";
import { COMPANY_LOGO } from "@/lib/brand-assets";
import { GOOGLE_PLAY_URL, MRFOX_APP_DOWNLOAD_URL } from "@/lib/app-download";
import { hashPassword } from "@/lib/password";
import { syncInfoMrfoxNewsToDatabase } from "@/lib/sync-info-mrfox-news";

async function auth(role?: "admin") {
  return requireSession(role);
}

// ─── News ───────────────────────────────────────────────

const NEWS_LOCALES = ["th", "en", "zh"] as const;

function revalidateNewsPaths(slug?: string, previousSlug?: string) {
  revalidatePath("/news");
  revalidatePath("/admin/news");
  for (const locale of NEWS_LOCALES) {
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/news`);
  }
  if (slug) {
    revalidatePath(`/news/${slug}`);
    for (const locale of NEWS_LOCALES) {
      revalidatePath(`/${locale}/news/${slug}`);
    }
  }
  if (previousSlug && previousSlug !== slug) {
    revalidatePath(`/news/${previousSlug}`);
    for (const locale of NEWS_LOCALES) {
      revalidatePath(`/${locale}/news/${previousSlug}`);
    }
  }
}

const newsSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string().optional(),
  content: z.string().min(1),
  source: z.string().optional(),
  thumbnailUrl: z.string().optional(),
  publishedAt: z.string().optional(),
});

export async function createNews(formData: FormData) {
  const session = await auth();
  const data = newsSchema.parse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt") || undefined,
    content: formData.get("content"),
    source: formData.get("source") || undefined,
    thumbnailUrl: formData.get("thumbnailUrl") || undefined,
    publishedAt: formData.get("publishedAt") || undefined,
  });

  const [row] = await db
    .insert(news)
    .values({
      ...data,
      publishedAt: parseNewsPublishDate(data.publishedAt),
    })
    .returning();

  await logAudit(session, "create", "news", row.id, data.title);
  revalidateNewsPaths(data.slug);
}

export async function updateNews(id: number, formData: FormData) {
  const session = await auth();
  const data = newsSchema.parse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt") || undefined,
    content: formData.get("content"),
    source: formData.get("source") || undefined,
    thumbnailUrl: formData.get("thumbnailUrl") || undefined,
    publishedAt: formData.get("publishedAt") || undefined,
  });

  const [existing] = await db
    .select({ slug: news.slug })
    .from(news)
    .where(eq(news.id, id))
    .limit(1);

  await db
    .update(news)
    .set({
      ...data,
      publishedAt: parseNewsPublishDate(data.publishedAt),
    })
    .where(eq(news.id, id));

  await logAudit(session, "update", "news", id, data.title);
  revalidateNewsPaths(data.slug, existing?.slug);
  revalidatePath(`/admin/news/${id}`);
}

export async function deleteNews(id: number) {
  const session = await auth();
  const [existing] = await db
    .select({ slug: news.slug })
    .from(news)
    .where(eq(news.id, id))
    .limit(1);

  await db.delete(news).where(eq(news.id, id));
  await logAudit(session, "delete", "news", id);
  revalidateNewsPaths(existing?.slug);
}

export async function syncInfoMrfoxNews() {
  const session = await auth();
  const result = await syncInfoMrfoxNewsToDatabase();

  await logAudit(
    session,
    "update",
    "news",
    0,
    `Synced ${result.total} reviews from info.mrfox.com`,
  );

  revalidateNewsPaths();

  return result;
}

// ─── Applications ───────────────────────────────────────

function defaultApkUrl(slug: string) {
  return `https://download.mrfox.app/${slug}.apk`;
}

function buildApplicationDownloadLinks(
  applicationId: number,
  slug: string,
  urls: { iosUrl?: string; androidUrl?: string; apkUrl?: string },
) {
  const links = [];
  if (urls.iosUrl) {
    links.push({ applicationId, type: "ios" as const, url: MRFOX_APP_DOWNLOAD_URL });
  }
  if (urls.androidUrl) {
    links.push({ applicationId, type: "android" as const, url: GOOGLE_PLAY_URL });
  }
  const apkUrl =
    urls.apkUrl ||
    (urls.iosUrl || urls.androidUrl ? defaultApkUrl(slug) : undefined);
  if (apkUrl) {
    links.push({ applicationId, type: "apk" as const, url: apkUrl });
  }
  return links;
}

const appSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  platformTypeId: z.coerce.number(),
  description: z.string().optional(),
  targetAudience: z.string().optional(),
  featured: z.coerce.boolean().optional(),
  published: z.coerce.boolean().optional(),
  iosUrl: z.string().optional(),
  androidUrl: z.string().optional(),
  apkUrl: z.string().optional(),
  posterUrl: z.string().optional(),
  posterFocus: z.string().optional(),
  featuredPosterUrl: z.string().optional(),
  featuredPosterFocus: z.string().optional(),
  logoUrl: z.string().optional(),
});

export async function createApplication(formData: FormData) {
  const session = await auth();
  const data = appSchema.parse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    platformTypeId: formData.get("platformTypeId"),
    description: formData.get("description") || undefined,
    targetAudience: formData.get("targetAudience") || undefined,
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
    iosUrl: formData.get("iosUrl") || undefined,
    androidUrl: formData.get("androidUrl") || undefined,
    apkUrl: formData.get("apkUrl") || undefined,
    posterUrl: formData.get("posterUrl") || undefined,
    posterFocus: formData.get("posterFocus") || undefined,
    featuredPosterUrl: formData.get("featuredPosterUrl") || undefined,
    featuredPosterFocus: formData.get("featuredPosterFocus") || undefined,
    logoUrl: formData.get("logoUrl") || undefined,
  });

  const [row] = await db
    .insert(applications)
    .values({
      name: data.name,
      slug: data.slug,
      platformTypeId: data.platformTypeId,
      description: data.description,
      targetAudience: data.targetAudience,
      featured: data.featured ?? false,
      published: data.published ?? true,
      logoUrl: data.logoUrl || COMPANY_LOGO,
      posterUrl: data.posterUrl || undefined,
      posterFocus: data.posterFocus || undefined,
      featuredPosterUrl: data.featuredPosterUrl || undefined,
      featuredPosterFocus: data.featuredPosterFocus || undefined,
    })
    .returning();

  const links = buildApplicationDownloadLinks(row.id, data.slug, {
    iosUrl: data.iosUrl,
    androidUrl: data.androidUrl,
    apkUrl: data.apkUrl,
  });
  if (links.length) await db.insert(downloadLinks).values(links);

  await logAudit(session, "create", "application", row.id, data.name);
  revalidateApplicationPaths();
}

export async function updateApplication(id: number, formData: FormData) {
  const session = await auth();
  const data = appSchema.parse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    platformTypeId: formData.get("platformTypeId"),
    description: formData.get("description") || undefined,
    targetAudience: formData.get("targetAudience") || undefined,
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
    iosUrl: formData.get("iosUrl") || undefined,
    androidUrl: formData.get("androidUrl") || undefined,
    apkUrl: formData.get("apkUrl") || undefined,
    posterUrl: formData.get("posterUrl") || undefined,
    posterFocus: formData.get("posterFocus") || undefined,
    featuredPosterUrl: formData.get("featuredPosterUrl") || undefined,
    featuredPosterFocus: formData.get("featuredPosterFocus") || undefined,
    logoUrl: formData.get("logoUrl") || undefined,
  });

  const [existing] = await db
    .select({ slug: applications.slug })
    .from(applications)
    .where(eq(applications.id, id))
    .limit(1);

  if (!existing) {
    throw new Error("ไม่พบแอปนี้");
  }

  const published = data.published ?? true;

  await db
    .update(applications)
    .set({
      name: data.name,
      slug: data.slug,
      platformTypeId: data.platformTypeId,
      description: data.description,
      targetAudience: data.targetAudience,
      featured: published ? (data.featured ?? false) : false,
      published,
      logoUrl: data.logoUrl || COMPANY_LOGO,
      posterUrl: data.posterUrl || undefined,
      posterFocus: data.posterFocus || undefined,
      featuredPosterUrl: data.featuredPosterUrl || undefined,
      featuredPosterFocus: data.featuredPosterFocus || undefined,
    })
    .where(eq(applications.id, id));

  await db.delete(downloadLinks).where(eq(downloadLinks.applicationId, id));

  const links = buildApplicationDownloadLinks(id, data.slug, {
    iosUrl: data.iosUrl,
    androidUrl: data.androidUrl,
    apkUrl: data.apkUrl,
  });
  if (links.length) {
    await db.insert(downloadLinks).values(links);
  }

  await logAudit(session, "update", "application", id, data.name);
  revalidateApplicationPaths(data.slug, existing.slug);
  revalidatePath(`/admin/applications/${id}`);
}

export async function deleteApplication(id: number) {
  const session = await auth();
  await db.delete(applications).where(eq(applications.id, id));
  await logAudit(session, "delete", "application", id);
  revalidateApplicationPaths();
}

function revalidateApplicationPaths(slug?: string, previousSlug?: string) {
  revalidatePath("/apps");
  revalidatePath("/admin/applications");
  for (const locale of ["th", "en", "zh"]) {
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/apps`);
  }
  if (slug) {
    revalidatePath(`/apps/${slug}`);
    for (const locale of ["th", "en", "zh"]) {
      revalidatePath(`/${locale}/apps/${slug}`);
    }
  }
  if (previousSlug && previousSlug !== slug) {
    revalidatePath(`/apps/${previousSlug}`);
    for (const locale of ["th", "en", "zh"]) {
      revalidatePath(`/${locale}/apps/${previousSlug}`);
    }
  }
}

export async function setApplicationFeatured(id: number, featured: boolean) {
  const session = await auth();

  const [row] = await db
    .select({ name: applications.name })
    .from(applications)
    .where(eq(applications.id, id))
    .limit(1);

  if (!row) {
    throw new Error("ไม่พบแอปนี้");
  }

  await db.update(applications).set({ featured }).where(eq(applications.id, id));

  await logAudit(
    session,
    "update",
    "application",
    id,
    featured ? `${row.name} · featured:on` : `${row.name} · featured:off`,
  );

  revalidateApplicationPaths();
}

export async function setApplicationPublished(id: number, published: boolean) {
  const session = await auth();

  const [row] = await db
    .select({ name: applications.name })
    .from(applications)
    .where(eq(applications.id, id))
    .limit(1);

  if (!row) {
    throw new Error("ไม่พบแอปนี้");
  }

  await db
    .update(applications)
    .set({ published, ...(published ? {} : { featured: false }) })
    .where(eq(applications.id, id));

  await logAudit(
    session,
    "update",
    "application",
    id,
    published ? `${row.name} · published:on` : `${row.name} · published:off`,
  );

  revalidateApplicationPaths();
}

// ─── Banners ────────────────────────────────────────────

const bannerSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().optional(),
  imageUrl: z.string().optional(),
  linkUrl: z.string().optional(),
  active: z.coerce.boolean().optional(),
});

export async function createBanner(formData: FormData) {
  const session = await auth();
  const data = bannerSchema.parse({
    title: formData.get("title"),
    subtitle: formData.get("subtitle") || undefined,
    imageUrl: formData.get("imageUrl") || undefined,
    linkUrl: formData.get("linkUrl") || undefined,
    active: formData.get("active") === "on",
  });

  const [row] = await db.insert(banners).values({
    ...data,
    active: data.active ?? true,
  }).returning();

  await logAudit(session, "create", "banner", row.id, data.title);
  revalidatePath("/admin/banners");
}

export async function deleteBanner(id: number) {
  const session = await auth();
  await db.delete(banners).where(eq(banners.id, id));
  await logAudit(session, "delete", "banner", id);
  revalidatePath("/admin/banners");
}

// ─── Platforms ──────────────────────────────────────────

const platformSchema = z.object({
  name: z.string().min(1),
  concept: z.string().optional(),
  shortDescription: z.string().optional(),
  creatorModel: z.string().optional(),
  visitorModel: z.string().optional(),
});

export async function updatePlatform(id: number, formData: FormData) {
  const session = await auth();
  const data = platformSchema.parse({
    name: formData.get("name"),
    concept: formData.get("concept") || undefined,
    shortDescription: formData.get("shortDescription") || undefined,
    creatorModel: formData.get("creatorModel") || undefined,
    visitorModel: formData.get("visitorModel") || undefined,
  });

  await db.update(platformTypes).set(data).where(eq(platformTypes.id, id));
  await logAudit(session, "update", "platform_type", id, data.name);
  revalidatePath("/platforms");
  revalidatePath("/admin/platforms");
}

// ─── Features ───────────────────────────────────────────

const featureSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  workflow: z.string().optional(),
  revenueModel: z.string().optional(),
});

export async function updateFeature(id: number, formData: FormData) {
  const session = await auth();
  const data = featureSchema.parse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
    workflow: formData.get("workflow") || undefined,
    revenueModel: formData.get("revenueModel") || undefined,
  });

  await db.update(features).set(data).where(eq(features.id, id));
  await logAudit(session, "update", "feature", id, data.name);
  revalidatePath("/features");
  revalidatePath("/admin/features");
}

// ─── Users ──────────────────────────────────────────────

const userSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["admin", "editor"]),
});

export async function createUser(formData: FormData) {
  const session = await auth("admin");
  const data = userSchema.parse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });

  const passwordHash = await hashPassword(data.password);
  const [row] = await db
    .insert(users)
    .values({
      name: data.name,
      email: data.email,
      passwordHash,
      role: data.role,
    })
    .returning();

  await logAudit(session, "create", "user", row.id, data.email);
  revalidatePath("/admin/users");
}

export async function deleteUser(id: number) {
  const session = await auth("admin");
  if (session.userId === id) {
    throw new Error("Cannot delete yourself");
  }

  await db.update(auditLogs).set({ userId: null }).where(eq(auditLogs.userId, id));
  await db
    .update(media)
    .set({ uploadedBy: null })
    .where(eq(media.uploadedBy, id));

  await db.delete(users).where(eq(users.id, id));
  await logAudit(session, "delete", "user", id);
  revalidatePath("/admin/users");
}
