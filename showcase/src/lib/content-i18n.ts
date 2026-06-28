import en from "@/content/en.json";
import zh from "@/content/zh.json";
import type { Locale } from "@/i18n/routing";

export type ContentEntity =
  | "categories"
  | "platforms"
  | "features"
  | "apps"
  | "news";

type ContentPack = typeof en;

const PACKS: Record<Exclude<Locale, "th">, ContentPack> = {
  en,
  zh: zh as unknown as ContentPack,
};

export function contentText(
  locale: Locale,
  entity: ContentEntity,
  slug: string,
  field: string,
  fallback?: string | null,
): string {
  if (locale === "th") return fallback ?? "";

  const pack = PACKS[locale];
  const entityPack = pack[entity] as Record<string, Record<string, string>>;
  return entityPack?.[slug]?.[field] ?? fallback ?? "";
}

export function localizeCategory<
  T extends { slug: string; name: string; description?: string | null },
>(locale: Locale, row: T): T {
  if (locale === "th") return row;
  return {
    ...row,
    name: contentText(locale, "categories", row.slug, "name", row.name),
    description: contentText(
      locale,
      "categories",
      row.slug,
      "description",
      row.description,
    ),
  };
}

export function localizePlatform<
  T extends {
    slug: string;
    name: string;
    concept?: string | null;
    shortDescription?: string | null;
    creatorModel?: string | null;
    visitorModel?: string | null;
    categorySlug?: string;
    categoryName?: string;
  },
>(locale: Locale, row: T): T {
  if (locale === "th") return row;
  return {
    ...row,
    name: contentText(locale, "platforms", row.slug, "name", row.name),
    concept: contentText(locale, "platforms", row.slug, "concept", row.concept),
    shortDescription: contentText(
      locale,
      "platforms",
      row.slug,
      "shortDescription",
      row.shortDescription,
    ),
    creatorModel: contentText(
      locale,
      "platforms",
      row.slug,
      "creatorModel",
      row.creatorModel,
    ),
    visitorModel: contentText(
      locale,
      "platforms",
      row.slug,
      "visitorModel",
      row.visitorModel,
    ),
    categoryName: row.categorySlug
      ? contentText(
          locale,
          "categories",
          row.categorySlug,
          "name",
          row.categoryName,
        )
      : row.categoryName,
  };
}

export function localizeFeature<
  T extends {
    slug: string;
    name: string;
    description?: string | null;
    workflow?: string | null;
    revenueModel?: string | null;
  },
>(locale: Locale, row: T): T {
  if (locale === "th") return row;
  return {
    ...row,
    name: contentText(locale, "features", row.slug, "name", row.name),
    description: contentText(
      locale,
      "features",
      row.slug,
      "description",
      row.description,
    ),
    workflow: contentText(locale, "features", row.slug, "workflow", row.workflow),
    revenueModel: contentText(
      locale,
      "features",
      row.slug,
      "revenueModel",
      row.revenueModel,
    ),
  };
}

export function localizeApp<
  T extends {
    slug: string;
    name: string;
    description?: string | null;
    targetAudience?: string | null;
    platformTypeName?: string;
    platformTypeSlug?: string;
    categoryName?: string;
    categorySlug?: string;
  },
>(locale: Locale, row: T): T {
  if (locale === "th") return row;
  const localized = {
    ...row,
    description: contentText(locale, "apps", row.slug, "description", row.description),
    targetAudience: contentText(
      locale,
      "apps",
      row.slug,
      "targetAudience",
      row.targetAudience,
    ),
  };

  if (row.platformTypeSlug && row.platformTypeName) {
    localized.platformTypeName = contentText(
      locale,
      "platforms",
      row.platformTypeSlug,
      "name",
      row.platformTypeName,
    );
  }

  if (row.categorySlug && row.categoryName) {
    localized.categoryName = contentText(
      locale,
      "categories",
      row.categorySlug,
      "name",
      row.categoryName,
    );
  }

  return localized;
}

export function localizeNews<
  T extends {
    slug: string;
    title: string;
    excerpt?: string | null;
    content: string;
  },
>(locale: Locale, row: T): T {
  if (locale === "th") return row;
  return {
    ...row,
    title: contentText(locale, "news", row.slug, "title", row.title),
    excerpt: contentText(locale, "news", row.slug, "excerpt", row.excerpt),
    content: contentText(locale, "news", row.slug, "content", row.content),
  };
}

export function localizeFeatureMatrixRow<
  T extends {
    featureSlug: string;
    featureName: string;
  },
>(locale: Locale, row: T): T {
  if (locale === "th") return row;
  return {
    ...row,
    featureName: contentText(
      locale,
      "features",
      row.featureSlug,
      "name",
      row.featureName,
    ),
  };
}

export function formatLocaleDate(
  locale: Locale,
  value: Date | string,
  style: "short" | "long" = "short",
) {
  const date = new Date(value);
  const dateLocale =
    locale === "zh" ? "zh-CN" : locale === "en" ? "en-US" : "th-TH";

  if (style === "long") {
    return date.toLocaleDateString(dateLocale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return date.toLocaleDateString(dateLocale);
}
