import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHero } from "@/components/layout/page-hero";
import { PageShell } from "@/components/layout/page-shell";
import { themedCard } from "@/components/layout/public-theme";
import type { Locale } from "@/i18n/routing";
import { formatLocaleDate, localizeNews } from "@/lib/content-i18n";
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

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Link key={item.slug} href={`/news/${item.slug}`}>
              <Card className={themedCard("h-full")}>
                <CardHeader>
                  <CardTitle className="line-clamp-2 text-base text-[var(--fox-charcoal)]">
                    {item.title}
                  </CardTitle>
                  <CardDescription>
                    {item.publishedAt ? formatLocaleDate(locale, item.publishedAt) : ""}
                  </CardDescription>
                  <CardDescription className="line-clamp-2">{item.excerpt}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
