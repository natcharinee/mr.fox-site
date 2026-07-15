import { ExternalLink } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { AppGalleryPlaceholders } from "@/components/apps/app-gallery-placeholders";
import { AppMonetizationTools } from "@/components/apps/app-monetization-tools";
import { DownloadButtons } from "@/components/apps/download-buttons";
import { AppMedia } from "@/components/apps/app-media";
import { PageHero } from "@/components/layout/page-hero";
import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading } from "@/components/layout/section-heading";
import { publicTheme } from "@/components/layout/public-theme";
import { CATEGORY_THEME } from "@/components/platforms/platform-category-theme";
import type { Locale } from "@/i18n/routing";
import { localizeApp, localizePlatform } from "@/lib/content-i18n";
import { getAppGallery, getAppLiveSite } from "@/lib/app-gallery";
import {
  getAppMonetization,
  type MonetizationToolId,
} from "@/lib/app-monetization";
import { buildMetadata } from "@/lib/metadata";
import { cn } from "@/lib/utils";
import {
  getApplicationBySlug,
  getDownloadLinks,
  getRelatedApplications,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  const app = await getApplicationBySlug(slug);
  if (!app) return {};
  const localized = localizeApp(locale, app);
  return buildMetadata({
    title: localized.name,
    description: localized.about || localized.description || "",
    path: `/apps/${slug}`,
    locale,
  });
}

export default async function AppDetailPage({ params }: Props) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  const t = await getTranslations("apps");
  const appRow = await getApplicationBySlug(slug);
  if (!appRow) notFound();
  const app = localizeApp(locale, appRow);

  const [links, relatedRows] = await Promise.all([
    getDownloadLinks(appRow.id),
    getRelatedApplications(slug),
  ]);
  const related = relatedRows.map((r) => localizeApp(locale, r));
  const platformTypeName = app.platformTypeSlug
    ? localizePlatform(locale, {
        slug: app.platformTypeSlug,
        name: app.platformTypeName ?? "",
      }).name
    : app.platformTypeName;
  const categoryTheme =
    CATEGORY_THEME[app.categorySlug ?? "creator"] ?? CATEGORY_THEME.creator;

  const gallery = getAppGallery(app.slug);
  const liveSiteUrl = getAppLiveSite(app.slug);
  const monetization = getAppMonetization(app.slug);
  const monetizationTools =
    monetization?.toolIds.map((id: MonetizationToolId) => ({
      id,
      name: t(`monetization.tools.${id}.name`),
      fan: t(`monetization.tools.${id}.fan`),
      earn: t(`monetization.tools.${id}.earn`),
      screenshot: monetization.screenshots?.[id] ?? null,
    })) ?? [];

  return (
    <PageShell>
      <PageHero
        title={app.name}
        description={app.description ?? undefined}
        backHref={`/apps#app-${app.slug}`}
        backLabel={t("backToApps")}
      >
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className={cn("vulpine-label border", categoryTheme.pill)}
          >
            {app.categoryName}
          </Badge>
          <Badge className={publicTheme.badgeOutline}>
            {platformTypeName}
          </Badge>
        </div>
      </PageHero>

      <div className={`${publicTheme.pageGrid} pb-0`}>
        {app.about ? (
          <div className="grid gap-6 md:grid-cols-[max-content_minmax(0,1fr)] md:items-stretch md:gap-8 lg:gap-10">
            <div className="relative mx-auto aspect-square w-full max-w-[15rem] md:mx-0 md:flex md:h-auto md:w-auto md:max-w-none md:self-stretch">
              {/* Square frame: side length follows about-card height */}
              <div
                aria-hidden
                className="pointer-events-none invisible hidden md:block md:h-full md:w-auto"
                style={{ aspectRatio: "1 / 1" }}
              />
              <AppMedia
                posterUrl={app.featuredPosterUrl ?? app.posterUrl}
                posterFocus={app.featuredPosterFocus ?? app.posterFocus}
                name={app.name}
                className="absolute inset-0 overflow-hidden rounded-2xl"
              />
            </div>
            <article
              className={cn(
                "relative flex min-h-[14rem] flex-col justify-center overflow-hidden rounded-2xl border border-white/10 md:min-h-[16rem]",
                "bg-gradient-to-br from-[var(--vulpine-primary-container)]/[0.08] via-[rgba(18,20,20,0.55)] to-black/70",
                "px-8 py-8 shadow-[0_4px_40px_rgba(0,0,0,0.25)] sm:px-10 sm:py-10 md:px-12 md:py-11",
              )}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full bg-[var(--vulpine-primary-container)]/15 blur-3xl"
              />
              <div className="relative max-w-2xl space-y-5">
                {app.style ? (
                  <p className="vulpine-label text-[var(--vulpine-primary-container)]">
                    {app.style}
                  </p>
                ) : null}
                <p className="text-base leading-[1.8] text-[var(--vulpine-on-surface)] sm:text-lg sm:leading-[1.85]">
                  {app.about}
                </p>
              </div>
            </article>
          </div>
        ) : (
          <AppMedia
            posterUrl={app.featuredPosterUrl ?? app.posterUrl}
            posterFocus={app.featuredPosterFocus ?? app.posterFocus}
            name={app.name}
            className="aspect-[21/9] overflow-hidden rounded-2xl"
          />
        )}
      </div>

      <div className={publicTheme.pageGrid}>
        <DownloadButtons
          appSlug={app.slug}
          appId={app.id}
          links={links}
          showDetailsLink={false}
          align="center"
        />

        {liveSiteUrl ? (
          <div className="mt-4 flex justify-center">
            <a
              href={liveSiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                publicTheme.submitButton,
                "inline-flex h-10 items-center gap-2 rounded-lg px-5",
              )}
            >
              {t("openOnFoxy")}
              <ExternalLink className="size-3.5 opacity-90" aria-hidden />
            </a>
          </div>
        ) : null}

        {monetizationTools.length > 0 ? (
          <AppMonetizationTools
            title={t("monetization.title", { app: app.name })}
            subtitle={t("monetization.subtitle")}
            fanLabel={t("monetization.fanLabel")}
            earnLabel={t("monetization.earnLabel")}
            placeholderLabel={t("mediaComingSoon")}
            tools={monetizationTools}
          />
        ) : null}

        <AppGalleryPlaceholders
          activitiesTitle={t("activities")}
          feedTitle={t("feed")}
          videosTitle={t("videos")}
          eventsTitle={t("events")}
          placeholderLabel={t("mediaComingSoon")}
          appName={app.name}
          media={gallery}
        />

        {related.length > 0 ? (
          <section className="mt-12">
            <SectionHeading title={t("related")} />
            <div className="flex flex-wrap gap-3">
              {related.map((r) => (
                <Link key={r.slug} href={`/apps/${r.slug}`}>
                  <Badge variant="outline" className={publicTheme.badgeOutline}>
                    {r.name}
                  </Badge>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <div className="mt-10">
          <Link
            href={`/apps#app-${app.slug}`}
            className={`text-sm ${publicTheme.link}`}
          >
            ← {t("backToApps")}
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
