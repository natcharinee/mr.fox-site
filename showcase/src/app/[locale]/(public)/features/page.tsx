import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHero } from "@/components/layout/page-hero";
import { PageShell } from "@/components/layout/page-shell";
import { themedCard, publicTheme } from "@/components/layout/public-theme";
import type { Locale } from "@/i18n/routing";
import { localizeFeature } from "@/lib/content-i18n";
import { buildMetadata } from "@/lib/metadata";
import { getShowcaseFeatures } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "features" });
  return buildMetadata({
    title: t("title"),
    description: t("subtitle"),
    path: "/features",
    locale: locale as Locale,
  });
}

export default async function FeaturesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  const t = await getTranslations("features");
  const features = (await getShowcaseFeatures()).map((f) => localizeFeature(locale, f));

  return (
    <PageShell>
      <PageHero title={t("title")} description={t("subtitle")} />

      <div className={publicTheme.pageGrid}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Link key={f.slug} href={`/features/${f.slug}`}>
              <Card className={themedCard("h-full")}>
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className={`text-base ${publicTheme.cardTitle}`}>{f.name}</CardTitle>
                    {f.revenueModel ? (
                      <Badge className={publicTheme.badgeGold}>💰</Badge>
                    ) : null}
                  </div>
                  <CardDescription className={`line-clamp-3 text-base ${publicTheme.cardDescription}`}>
                    {f.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
