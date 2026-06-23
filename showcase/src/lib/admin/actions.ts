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
import { hashPassword } from "@/lib/password";

async function auth(role?: "admin") {
  return requireSession(role);
}

// ─── News ───────────────────────────────────────────────

const newsSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string().optional(),
  content: z.string().min(1),
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
  revalidatePath("/news");
  revalidatePath(`/news/${data.slug}`);
  revalidatePath("/admin/news");
}

export async function updateNews(id: number, formData: FormData) {
  const session = await auth();
  const data = newsSchema.parse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt") || undefined,
    content: formData.get("content"),
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
  revalidatePath("/news");
  revalidatePath(`/news/${data.slug}`);
  if (existing && existing.slug !== data.slug) {
    revalidatePath(`/news/${existing.slug}`);
  }
  revalidatePath("/admin/news");
  revalidatePath(`/admin/news/${id}`);
}

export async function deleteNews(id: number) {
  const session = await auth();
  await db.delete(news).where(eq(news.id, id));
  await logAudit(session, "delete", "news", id);
  revalidatePath("/news");
  revalidatePath("/admin/news");
}

// ─── Applications ───────────────────────────────────────

const appSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  platformTypeId: z.coerce.number(),
  description: z.string().optional(),
  targetAudience: z.string().optional(),
  featured: z.coerce.boolean().optional(),
  iosUrl: z.string().optional(),
  androidUrl: z.string().optional(),
  posterUrl: z.string().optional(),
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
    iosUrl: formData.get("iosUrl") || undefined,
    androidUrl: formData.get("androidUrl") || undefined,
    posterUrl: formData.get("posterUrl") || undefined,
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
      logoUrl: data.logoUrl || "/brand/mrfox-icon.png",
      posterUrl: data.posterUrl || undefined,
    })
    .returning();

  const links = [];
  if (data.iosUrl) links.push({ applicationId: row.id, type: "ios" as const, url: data.iosUrl });
  if (data.androidUrl) links.push({ applicationId: row.id, type: "android" as const, url: data.androidUrl });
  if (links.length) await db.insert(downloadLinks).values(links);

  await logAudit(session, "create", "application", row.id, data.name);
  revalidatePath("/apps");
  revalidatePath("/admin/applications");
  for (const locale of ["th", "en", "zh"]) {
    revalidatePath(`/${locale}`);
  }
}

export async function deleteApplication(id: number) {
  const session = await auth();
  await db.delete(applications).where(eq(applications.id, id));
  await logAudit(session, "delete", "application", id);
  revalidatePath("/apps");
  revalidatePath("/admin/applications");
  for (const locale of ["th", "en", "zh"]) {
    revalidatePath(`/${locale}`);
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

  revalidatePath("/apps");
  revalidatePath("/admin/applications");
  for (const locale of ["th", "en", "zh"]) {
    revalidatePath(`/${locale}`);
  }
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
