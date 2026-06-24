DO $$ BEGIN
  CREATE TYPE "feature_group" AS ENUM('A', 'B', 'C');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE TYPE "feature_status" AS ENUM('core', 'optional', 'custom', 'no');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE TYPE "download_type" AS ENUM('ios', 'android', 'apk', 'web');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE TYPE "user_role" AS ENUM('admin', 'editor');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "platform_categories" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "slug" text NOT NULL,
  "description" text,
  "sort_order" integer DEFAULT 0 NOT NULL,
  CONSTRAINT "platform_categories_slug_unique" UNIQUE("slug")
);

CREATE TABLE IF NOT EXISTS "platform_types" (
  "id" serial PRIMARY KEY NOT NULL,
  "category_id" integer NOT NULL,
  "name" text NOT NULL,
  "slug" text NOT NULL,
  "concept" text,
  "poster_url" text,
  "short_description" text,
  "creator_model" text,
  "visitor_model" text,
  "sort_order" integer DEFAULT 0 NOT NULL,
  CONSTRAINT "platform_types_slug_unique" UNIQUE("slug"),
  CONSTRAINT "platform_types_category_id_platform_categories_id_fk"
    FOREIGN KEY ("category_id") REFERENCES "platform_categories"("id")
);

CREATE TABLE IF NOT EXISTS "features" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "slug" text NOT NULL,
  "group" "feature_group" NOT NULL,
  "description" text,
  "workflow" text,
  "revenue_model" text,
  "icon" text,
  "sort_order" integer DEFAULT 0 NOT NULL,
  CONSTRAINT "features_slug_unique" UNIQUE("slug")
);

CREATE TABLE IF NOT EXISTS "applications" (
  "id" serial PRIMARY KEY NOT NULL,
  "platform_type_id" integer NOT NULL,
  "name" text NOT NULL,
  "slug" text NOT NULL,
  "logo_url" text,
  "poster_url" text,
  "description" text,
  "target_audience" text,
  "featured" boolean DEFAULT false NOT NULL,
  "published" boolean DEFAULT true NOT NULL,
  "download_count" integer DEFAULT 0 NOT NULL,
  "sort_order" integer DEFAULT 0 NOT NULL,
  CONSTRAINT "applications_slug_unique" UNIQUE("slug"),
  CONSTRAINT "applications_platform_type_id_platform_types_id_fk"
    FOREIGN KEY ("platform_type_id") REFERENCES "platform_types"("id")
);

CREATE TABLE IF NOT EXISTS "download_links" (
  "id" serial PRIMARY KEY NOT NULL,
  "application_id" integer NOT NULL,
  "type" "download_type" NOT NULL,
  "url" text NOT NULL,
  CONSTRAINT "download_links_application_id_applications_id_fk"
    FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE cascade
);
CREATE UNIQUE INDEX IF NOT EXISTS "download_links_app_type_unique"
  ON "download_links" ("application_id", "type");

CREATE TABLE IF NOT EXISTS "screenshots" (
  "id" serial PRIMARY KEY NOT NULL,
  "application_id" integer NOT NULL,
  "image_url" text NOT NULL,
  "sort_order" integer DEFAULT 0 NOT NULL,
  CONSTRAINT "screenshots_application_id_applications_id_fk"
    FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE cascade
);

CREATE TABLE IF NOT EXISTS "platform_type_features" (
  "id" serial PRIMARY KEY NOT NULL,
  "platform_type_id" integer NOT NULL,
  "feature_id" integer NOT NULL,
  "status" "feature_status" NOT NULL,
  CONSTRAINT "platform_type_features_platform_type_id_platform_types_id_fk"
    FOREIGN KEY ("platform_type_id") REFERENCES "platform_types"("id") ON DELETE cascade,
  CONSTRAINT "platform_type_features_feature_id_features_id_fk"
    FOREIGN KEY ("feature_id") REFERENCES "features"("id") ON DELETE cascade
);
CREATE UNIQUE INDEX IF NOT EXISTS "ptf_unique"
  ON "platform_type_features" ("platform_type_id", "feature_id");

CREATE TABLE IF NOT EXISTS "platform_type_permissions" (
  "id" serial PRIMARY KEY NOT NULL,
  "platform_type_id" integer NOT NULL,
  "key" text NOT NULL,
  "value" text NOT NULL,
  CONSTRAINT "platform_type_permissions_platform_type_id_platform_types_id_fk"
    FOREIGN KEY ("platform_type_id") REFERENCES "platform_types"("id") ON DELETE cascade
);
CREATE UNIQUE INDEX IF NOT EXISTS "ptp_unique"
  ON "platform_type_permissions" ("platform_type_id", "key");

CREATE TABLE IF NOT EXISTS "category_revenue" (
  "id" serial PRIMARY KEY NOT NULL,
  "category_id" integer NOT NULL,
  "revenue_feature" text NOT NULL,
  "value" text NOT NULL,
  CONSTRAINT "category_revenue_category_id_platform_categories_id_fk"
    FOREIGN KEY ("category_id") REFERENCES "platform_categories"("id") ON DELETE cascade
);
CREATE UNIQUE INDEX IF NOT EXISTS "cr_unique"
  ON "category_revenue" ("category_id", "revenue_feature");

CREATE TABLE IF NOT EXISTS "application_features" (
  "id" serial PRIMARY KEY NOT NULL,
  "application_id" integer NOT NULL,
  "feature_id" integer NOT NULL,
  "enabled" boolean DEFAULT true NOT NULL,
  CONSTRAINT "application_features_application_id_applications_id_fk"
    FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE cascade,
  CONSTRAINT "application_features_feature_id_features_id_fk"
    FOREIGN KEY ("feature_id") REFERENCES "features"("id") ON DELETE cascade
);
CREATE UNIQUE INDEX IF NOT EXISTS "af_unique"
  ON "application_features" ("application_id", "feature_id");

CREATE TABLE IF NOT EXISTS "news" (
  "id" serial PRIMARY KEY NOT NULL,
  "slug" text NOT NULL,
  "title" text NOT NULL,
  "thumbnail_url" text,
  "excerpt" text,
  "content" text NOT NULL,
  "source" text,
  "published_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "news_slug_unique" UNIQUE("slug")
);

CREATE TABLE IF NOT EXISTS "banners" (
  "id" serial PRIMARY KEY NOT NULL,
  "title" text NOT NULL,
  "subtitle" text,
  "image_url" text,
  "link_url" text,
  "active" boolean DEFAULT true NOT NULL,
  "sort_order" integer DEFAULT 0 NOT NULL
);

CREATE TABLE IF NOT EXISTS "download_events" (
  "id" serial PRIMARY KEY NOT NULL,
  "application_id" integer NOT NULL,
  "link_type" "download_type" NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "download_events_application_id_applications_id_fk"
    FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE cascade
);

CREATE TABLE IF NOT EXISTS "users" (
  "id" serial PRIMARY KEY NOT NULL,
  "email" text NOT NULL,
  "name" text NOT NULL,
  "role" "user_role" DEFAULT 'editor' NOT NULL,
  "password_hash" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "users_email_unique" UNIQUE("email")
);

CREATE TABLE IF NOT EXISTS "audit_logs" (
  "id" serial PRIMARY KEY NOT NULL,
  "user_id" integer,
  "action" text NOT NULL,
  "entity" text NOT NULL,
  "entity_id" integer,
  "details" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "audit_logs_user_id_users_id_fk"
    FOREIGN KEY ("user_id") REFERENCES "users"("id")
);

CREATE TABLE IF NOT EXISTS "media" (
  "id" serial PRIMARY KEY NOT NULL,
  "filename" text NOT NULL,
  "url" text NOT NULL,
  "mime_type" text NOT NULL,
  "size_bytes" integer NOT NULL,
  "storage_data" text,
  "uploaded_by" integer,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "media_uploaded_by_users_id_fk"
    FOREIGN KEY ("uploaded_by") REFERENCES "users"("id")
);
