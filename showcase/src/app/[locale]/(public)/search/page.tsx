import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHero } from "@/components/layout/page-hero";
import { PageShell } from "@/components/layout/page-shell";
import { publicTheme, themedCard } from "@/components/layout/public-theme";
import type { Locale } from "@/i18n/routing";
import {
  localizeApp,
  localizeFeature,
  localizeNews,
  localizePlatform,
} from "@/lib/content-i18n";
import { globalSearch } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ params, searchParams }: Props) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  const { q } = await searchParams;
  const t = await getTranslations("search");

  const resultsRaw = q && q.length >= 2 ? await globalSearch(q) : null;
  const results = resultsRaw
    ? {
        platforms: resultsRaw.platforms.map((item) => localizePlatform(locale, item)),
        apps: resultsRaw.apps.map((item) => localizeApp(locale, item)),
        features: resultsRaw.features.map((item) => localizeFeature(locale, item)),
        news: resultsRaw.news.map((item) =>
          localizeNews(locale, {
            slug: item.slug,
            title: item.name,
            excerpt: null,
            content: "",
          }),
        ),
      }
    : null;
  const hasResults =
    results &&
    (results.platforms.length > 0 ||
      results.apps.length > 0 ||
      results.features.length > 0 ||
      results.news.length > 0);

  return (
    <PageShell>
      <PageHero title={t("title")} description={t("subtitle")}>
        <form className="flex max-w-xl gap-3" action="/search" method="get">
          <Input
            name="q"
            placeholder={t("placeholder")}
            defaultValue={q}
            className={`flex-1 ${publicTheme.input} bg-white/95 placeholder:text-[#c9b98a]`}
          />
          <button type="submit" className={publicTheme.submitButton}>
            {t("submit")}
          </button>
        </form>
      </PageHero>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {q && q.length >= 2 && !hasResults ? (
          <div className="rounded-2xl border border-dashed border-[#e8d49a] bg-white/60 px-6 py-12 text-center">
            <p className="text-muted-foreground">{t("noResults")}</p>
          </div>
        ) : null}

        {hasResults && results ? (
          <div className="grid gap-8 md:grid-cols-2">
            {results.platforms.length > 0 ? (
              <section>
                <h2 className="mb-4 font-semibold text-[var(--fox-charcoal)]">{t("platforms")}</h2>
                <div className="space-y-2">
                  {results.platforms.map((item) => (
                    <Link key={item.slug} href={`/platforms/${item.slug}`}>
                      <Card className={themedCard()}>
                        <CardHeader className="py-3">
                          <CardTitle className="text-sm text-[var(--fox-charcoal)]">{item.name}</CardTitle>
                        </CardHeader>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}
            {results.apps.length > 0 ? (
              <section>
                <h2 className="mb-4 font-semibold text-[var(--fox-charcoal)]">{t("apps")}</h2>
                <div className="space-y-2">
                  {results.apps.map((item) => (
                    <Link key={item.slug} href={`/apps/${item.slug}`}>
                      <Card className={themedCard()}>
                        <CardHeader className="py-3">
                          <CardTitle className="text-sm text-[var(--fox-charcoal)]">{item.name}</CardTitle>
                        </CardHeader>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}
            {results.features.length > 0 ? (
              <section>
                <h2 className="mb-4 font-semibold text-[var(--fox-charcoal)]">{t("features")}</h2>
                <div className="space-y-2">
                  {results.features.map((item) => (
                    <Link key={item.slug} href={`/features/${item.slug}`}>
                      <Card className={themedCard()}>
                        <CardHeader className="py-3">
                          <CardTitle className="flex items-center gap-2 text-sm text-[var(--fox-charcoal)]">
                            {item.name}
                            <Badge className="bg-[#fff4cc] text-xs text-[var(--fox-gold-dark)]">
                              {t("featureBadge")}
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}
            {results.news.length > 0 ? (
              <section>
                <h2 className="mb-4 font-semibold text-[var(--fox-charcoal)]">{t("news")}</h2>
                <div className="space-y-2">
                  {results.news.map((item) => (
                    <Link key={item.slug} href={`/news/${item.slug}`}>
                      <Card className={themedCard()}>
                        <CardHeader className="py-3">
                          <CardTitle className="text-sm text-[var(--fox-charcoal)]">
                            {item.title}
                          </CardTitle>
                        </CardHeader>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        ) : null}
      </div>
    </PageShell>
  );
}
