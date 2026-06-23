import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const featureGroupEnum = pgEnum("feature_group", ["A", "B", "C"]);
export const featureStatusEnum = pgEnum("feature_status", [
  "core",
  "optional",
  "custom",
  "no",
]);
export const downloadTypeEnum = pgEnum("download_type", [
  "ios",
  "android",
  "apk",
  "web",
]);
export const userRoleEnum = pgEnum("user_role", ["admin", "editor"]);

export const platformCategories = pgTable("platform_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const platformTypes = pgTable("platform_types", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id")
    .notNull()
    .references(() => platformCategories.id),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  concept: text("concept"),
  posterUrl: text("poster_url"),
  shortDescription: text("short_description"),
  creatorModel: text("creator_model"),
  visitorModel: text("visitor_model"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const features = pgTable("features", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  group: featureGroupEnum("group").notNull(),
  description: text("description"),
  workflow: text("workflow"),
  revenueModel: text("revenue_model"),
  icon: text("icon"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  platformTypeId: integer("platform_type_id")
    .notNull()
    .references(() => platformTypes.id),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  logoUrl: text("logo_url"),
  posterUrl: text("poster_url"),
  description: text("description"),
  targetAudience: text("target_audience"),
  featured: boolean("featured").notNull().default(false),
  downloadCount: integer("download_count").notNull().default(0),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const downloadLinks = pgTable(
  "download_links",
  {
    id: serial("id").primaryKey(),
    applicationId: integer("application_id")
      .notNull()
      .references(() => applications.id, { onDelete: "cascade" }),
    type: downloadTypeEnum("type").notNull(),
    url: text("url").notNull(),
  },
  (t) => [
    uniqueIndex("download_links_app_type_unique").on(t.applicationId, t.type),
  ],
);

export const screenshots = pgTable("screenshots", {
  id: serial("id").primaryKey(),
  applicationId: integer("application_id")
    .notNull()
    .references(() => applications.id, { onDelete: "cascade" }),
  imageUrl: text("image_url").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const platformTypeFeatures = pgTable(
  "platform_type_features",
  {
    id: serial("id").primaryKey(),
    platformTypeId: integer("platform_type_id")
      .notNull()
      .references(() => platformTypes.id, { onDelete: "cascade" }),
    featureId: integer("feature_id")
      .notNull()
      .references(() => features.id, { onDelete: "cascade" }),
    status: featureStatusEnum("status").notNull(),
  },
  (t) => [
    uniqueIndex("ptf_unique").on(t.platformTypeId, t.featureId),
  ],
);

export const platformTypePermissions = pgTable(
  "platform_type_permissions",
  {
    id: serial("id").primaryKey(),
    platformTypeId: integer("platform_type_id")
      .notNull()
      .references(() => platformTypes.id, { onDelete: "cascade" }),
    key: text("key").notNull(),
    value: text("value").notNull(),
  },
  (t) => [
    uniqueIndex("ptp_unique").on(t.platformTypeId, t.key),
  ],
);

export const categoryRevenue = pgTable(
  "category_revenue",
  {
    id: serial("id").primaryKey(),
    categoryId: integer("category_id")
      .notNull()
      .references(() => platformCategories.id, { onDelete: "cascade" }),
    revenueFeature: text("revenue_feature").notNull(),
    value: text("value").notNull(),
  },
  (t) => [
    uniqueIndex("cr_unique").on(t.categoryId, t.revenueFeature),
  ],
);

export const applicationFeatures = pgTable(
  "application_features",
  {
    id: serial("id").primaryKey(),
    applicationId: integer("application_id")
      .notNull()
      .references(() => applications.id, { onDelete: "cascade" }),
    featureId: integer("feature_id")
      .notNull()
      .references(() => features.id, { onDelete: "cascade" }),
    enabled: boolean("enabled").notNull().default(true),
  },
  (t) => [
    uniqueIndex("af_unique").on(t.applicationId, t.featureId),
  ],
);

export const news = pgTable("news", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const banners = pgTable("banners", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  imageUrl: text("image_url"),
  linkUrl: text("link_url"),
  active: boolean("active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const downloadEvents = pgTable("download_events", {
  id: serial("id").primaryKey(),
  applicationId: integer("application_id")
    .notNull()
    .references(() => applications.id, { onDelete: "cascade" }),
  linkType: downloadTypeEnum("link_type").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role: userRoleEnum("role").notNull().default("editor"),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  action: text("action").notNull(),
  entity: text("entity").notNull(),
  entityId: integer("entity_id"),
  details: text("details"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const media = pgTable("media", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  url: text("url").notNull(),
  mimeType: text("mime_type").notNull(),
  sizeBytes: integer("size_bytes").notNull(),
  uploadedBy: integer("uploaded_by").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
