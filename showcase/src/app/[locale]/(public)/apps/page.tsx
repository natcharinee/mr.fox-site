import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DownloadButtons } from "@/components/apps/download-buttons";
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
  const tc = await getTranslations("common");

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
            className="max-w-xs border-[#e8d49a] bg-white/90 text-[var(--fox-charcoal)] placeholder:text-muted-foreground focus-visible:border-[var(--fox-gold)] focus-visible:ring-[var(--fox-gold)]/20"
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

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {appsWithLinks.map((app) => (
            <Card key={app.slug} className={themedCard("flex flex-col")}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg text-[var(--fox-charcoal)]">
                    <Link
                      href={`/apps/${app.slug}`}
                      className="transition-colors hover:text-[var(--fox-gold-dark)]"
                    >
                      {app.name}
                    </Link>
                  </CardTitle>
                  {app.featured ? (
                    <Badge className="shrink-0 bg-[var(--fox-gold)] text-[var(--fox-charcoal)] hover:bg-[var(--fox-gold)]">
                      {tc("featured")}
                    </Badge>
                  ) : null}
                </div>
                <CardDescription>
                  {app.platformTypeName} · {app.categoryName}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
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
          <div className="mt-10 rounded-2xl border border-dashed border-[#e8d49a] bg-white/60 px-6 py-12 text-center">
            <p className="text-muted-foreground">{t("noResults")}</p>
          </div>
        ) : null}
      </div>
    </PageShell>
  );
}
