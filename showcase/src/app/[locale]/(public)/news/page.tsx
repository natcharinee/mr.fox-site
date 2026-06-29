import { getTranslations } from "next-intl/server";
import { NewsListCard } from "@/components/news/news-list-card";
import { PageHero } from "@/components/layout/page-hero";
import { PageShell } from "@/components/layout/page-shell";
import { publicTheme } from "@/components/layout/public-theme";
import type { Locale } from "@/i18n/routing";
import { localizeNews } from "@/lib/content-i18n";
import { buildMetadata } from "@/lib/metadata";
import { getAllNews } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "news" });
  return buildMetadata({
    title: t("title"),
    description: t("subtitle"),
    path: "/news",
    locale: locale as Locale,
  });
}

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  const t = await getTranslations("news");
  const items = (await getAllNews()).map((item) => localizeNews(locale, item));

  return (
    <PageShell>
      <PageHero title={t("title")} description={t("subtitle")} />

      <div className={publicTheme.pageGrid}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <NewsListCard
              key={item.slug}
              slug={item.slug}
              title={item.title}
              excerpt={item.excerpt}
              thumbnailUrl={item.thumbnailUrl}
              publishedAt={item.publishedAt}
              locale={locale}
              readMoreLabel={t("readMore")}
            />
          ))}
        </div>
      </div>
    </PageShell>
  );
}
