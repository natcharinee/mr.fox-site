import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AppGalleryPlaceholders } from "@/components/apps/app-gallery-placeholders";
import { DownloadButtons } from "@/components/apps/download-buttons";
import { AppMedia } from "@/components/apps/app-media";
import { PageHero } from "@/components/layout/page-hero";
import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading } from "@/components/layout/section-heading";
import { publicTheme, themedCard } from "@/components/layout/public-theme";
import { CATEGORY_THEME } from "@/components/platforms/platform-category-theme";
import type { Locale } from "@/i18n/routing";
import { localizeApp, localizePlatform } from "@/lib/content-i18n";
import { getAppGallery } from "@/lib/app-gallery";
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

  return (
    <PageShell>
      <PageHero title={app.name} description={app.description ?? undefined}>
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
        <AppMedia
          posterUrl={app.featuredPosterUrl ?? app.posterUrl}
          posterFocus={app.featuredPosterFocus ?? app.posterFocus}
          name={app.name}
          className="aspect-[21/9] rounded-2xl"
        />
      </div>

      <div className={publicTheme.pageGrid}>
        <DownloadButtons
          appSlug={app.slug}
          appId={app.id}
          links={links}
          showDetailsLink={false}
          align="center"
        />

        {app.about ? (
          <section className="mt-12">
            <SectionHeading title={t("about")} />
            <article
              className={cn(
                "relative overflow-hidden rounded-2xl border border-white/10",
                "bg-gradient-to-br from-[var(--vulpine-primary-container)]/[0.08] via-[rgba(18,20,20,0.55)] to-black/70",
                "p-6 shadow-[0_4px_40px_rgba(0,0,0,0.25)] sm:p-8 md:p-10",
              )}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full bg-[var(--vulpine-primary-container)]/15 blur-3xl"
              />
              <div className="relative space-y-5">
                {app.style ? (
                  <p className="vulpine-label text-[var(--vulpine-primary-container)]">
                    {app.style}
                  </p>
                ) : null}
                <p className="max-w-3xl text-base leading-[1.75] text-[var(--vulpine-on-surface)] sm:text-lg sm:leading-[1.8]">
                  {app.about}
                </p>
              </div>
            </article>
          </section>
        ) : null}

        <AppGalleryPlaceholders
          activitiesTitle={t("activities")}
          videosTitle={t("videos")}
          eventsTitle={t("events")}
          placeholderLabel={t("mediaComingSoon")}
          appName={app.name}
          media={getAppGallery(app.slug)}
        />

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {app.highlights ? (
            <Card className={themedCard()}>
              <CardHeader>
                <CardTitle className={`text-base ${publicTheme.cardTitle}`}>
                  {t("highlights")}
                </CardTitle>
                <CardDescription className={publicTheme.cardDescription}>
                  {app.highlights}
                </CardDescription>
              </CardHeader>
            </Card>
          ) : null}
          {app.targetAudience ? (
            <Card className={themedCard()}>
              <CardHeader>
                <CardTitle className={`text-base ${publicTheme.cardTitle}`}>
                  {t("targetAudience")}
                </CardTitle>
                <CardDescription className={publicTheme.cardDescription}>
                  {app.targetAudience}
                </CardDescription>
              </CardHeader>
            </Card>
          ) : null}
          <Card className={themedCard()}>
            <CardHeader>
              <CardTitle className={`text-base ${publicTheme.cardTitle}`}>
                {t("platformType")}
              </CardTitle>
              <CardDescription className={publicTheme.cardDescription}>
                <Link
                  href={`/platforms/${app.platformTypeSlug}`}
                  className={publicTheme.link}
                >
                  {platformTypeName}
                </Link>
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

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
          <Link href="/apps" className={`text-sm ${publicTheme.link}`}>
            ← {t("backToApps")}
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
