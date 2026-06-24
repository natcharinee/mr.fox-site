import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DownloadButtons } from "@/components/apps/download-buttons";
import { AppMedia } from "@/components/apps/app-media";
import { PageHero } from "@/components/layout/page-hero";
import { PageShell } from "@/components/layout/page-shell";
import { publicTheme, themedCard } from "@/components/layout/public-theme";
import type { Locale } from "@/i18n/routing";
import { localizeApp, localizeCategory, localizePlatform } from "@/lib/content-i18n";
import { buildMetadata } from "@/lib/metadata";
import { getApplications, getCategories, getDownloadLinks, getPlatformTypes } from "@/lib/queries";

export const dynamic = "force-dynamic";

const filterClass = publicTheme.select;

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    q?: string;
    category?: string;
    platform?: string;
  }>;
};

export async function generateMetadata({ params }: Pick<PageProps, "params">) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "apps" });
  return buildMetadata({
    title: t("title"),
    description: t("subtitle"),
    path: "/apps",
    locale: locale as Locale,
  });
}

export default async function AppsPage({
  params,
  searchParams,
}: PageProps) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  const { q, category, platform } = await searchParams;
  const t = await getTranslations("apps");

  const [apps, categories, platformTypes] = await Promise.all([
    getApplications({
      search: q,
      categorySlug: category,
      platformTypeSlug: platform,
    }),
    getCategories(),
    getPlatformTypes(),
  ]);

  const localizedCategories = categories.map((c) => localizeCategory(locale, c));
  const localizedPlatformTypes = platformTypes.map((p) => localizePlatform(locale, p));
  const localizedApps = apps.map((a) => localizeApp(locale, a));

  const appsWithLinks = await Promise.all(
    localizedApps.map(async (app) => ({
      ...app,
      links: await getDownloadLinks(app.id),
    })),
  );

  return (
    <PageShell>
      <PageHero title={t("title")} description={t("subtitle")}>
        <form className="flex flex-wrap gap-3" action="/apps" method="get">
          <Input
            name="q"
            placeholder={t("searchPlaceholder")}
            defaultValue={q}
            className={`max-w-xs ${publicTheme.input}`}
          />
          <select name="category" defaultValue={category ?? ""} className={publicTheme.select}>
            <option value="">{t("allCategories")}</option>
            {localizedCategories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
          <select name="platform" defaultValue={platform ?? ""} className={filterClass}>
            <option value="">{t("allPlatforms")}</option>
            {localizedPlatformTypes.map((pt) => (
              <option key={pt.slug} value={pt.slug}>
                {pt.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className={publicTheme.submitButton}
          >
            {t("search")}
          </button>
        </form>
      </PageHero>

      <div className={publicTheme.pageGrid}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {appsWithLinks.map((app) => (
            <Card key={app.slug} className={themedCard("flex flex-col overflow-hidden")}>
              <AppMedia
                posterUrl={app.featuredPosterUrl ?? app.posterUrl}
                posterFocus={app.featuredPosterFocus ?? app.posterFocus}
                name={app.name}
                className="aspect-[4/3]"
              />
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className={`text-lg ${publicTheme.cardTitle}`}>
                    <Link
                      href={`/apps/${app.slug}`}
                      className={publicTheme.cardTitleLink}
                    >
                      {app.name}
                    </Link>
                  </CardTitle>
                </div>
                <CardDescription className={publicTheme.cardDescription}>
                  {app.platformTypeName} · {app.categoryName}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <p className={`mb-4 line-clamp-2 text-sm ${publicTheme.muted}`}>
                  {app.description}
                </p>
                <DownloadButtons
                  appSlug={app.slug}
                  appId={app.id}
                  links={app.links}
                />
              </CardContent>
            </Card>
          ))}
        </div>

        {appsWithLinks.length === 0 ? (
          <div className={`mt-10 ${publicTheme.emptyState}`}>
            <p>{t("noResults")}</p>
          </div>
        ) : null}
      </div>
    </PageShell>
  );
}
