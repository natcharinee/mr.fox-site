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
import { DownloadButtons } from "@/components/apps/download-buttons";
import { AppMedia } from "@/components/apps/app-media";
import { PageHero } from "@/components/layout/page-hero";
import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading } from "@/components/layout/section-heading";
import { publicTheme, themedCard } from "@/components/layout/public-theme";
import type { Locale } from "@/i18n/routing";
import { localizeApp, localizePlatform } from "@/lib/content-i18n";
import { buildMetadata } from "@/lib/metadata";
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
    description: localized.description ?? "",
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
    getRelatedApplications(appRow.platformTypeId, slug),
  ]);
  const related = relatedRows.map((r) => localizeApp(locale, r));
  const platformTypeName = app.platformTypeSlug
    ? localizePlatform(locale, {
        slug: app.platformTypeSlug,
        name: app.platformTypeName ?? "",
      }).name
    : app.platformTypeName;

  return (
    <PageShell>
      <PageHero title={app.name} description={app.description ?? undefined}>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className={publicTheme.heroBadge}>
            {app.categoryName}
          </Badge>
          <Badge className="bg-white/10 text-[#fff4cc] hover:bg-white/10">
            {platformTypeName}
          </Badge>
        </div>
      </PageHero>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AppMedia
          posterUrl={app.posterUrl}
          posterFocus={app.posterFocus}
          name={app.name}
          className="aspect-[21/9] rounded-2xl"
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <DownloadButtons
          appSlug={app.slug}
          appId={app.id}
          links={links}
          showDetailsLink={false}
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <Card className={themedCard()}>
            <CardHeader>
              <CardTitle className="text-base text-[var(--fox-charcoal)]">
                {t("platformType")}
              </CardTitle>
              <CardDescription>
                <Link href={`/platforms/${app.platformTypeSlug}`} className={publicTheme.link}>
                  {platformTypeName}
                </Link>
              </CardDescription>
            </CardHeader>
          </Card>
          {app.targetAudience ? (
            <Card className={themedCard()}>
              <CardHeader>
                <CardTitle className="text-base text-[var(--fox-charcoal)]">
                  {t("targetAudience")}
                </CardTitle>
                <CardDescription>{app.targetAudience}</CardDescription>
              </CardHeader>
            </Card>
          ) : null}
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
