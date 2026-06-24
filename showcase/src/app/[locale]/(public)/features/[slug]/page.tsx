import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageHero } from "@/components/layout/page-hero";
import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading } from "@/components/layout/section-heading";
import { publicTheme, themedCard } from "@/components/layout/public-theme";
import type { Locale } from "@/i18n/routing";
import { localizeFeature } from "@/lib/content-i18n";
import { buildMetadata } from "@/lib/metadata";
import { getAppsUsingFeature, getFeatureBySlug } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  const feature = await getFeatureBySlug(slug);
  if (!feature) return {};
  const localized = localizeFeature(locale, feature);
  return buildMetadata({
    title: localized.name,
    description: localized.description ?? "",
    path: `/features/${slug}`,
    locale,
  });
}

export default async function FeatureDetailPage({ params }: Props) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  const t = await getTranslations("features");
  const featureRow = await getFeatureBySlug(slug);
  if (!featureRow) notFound();
  const feature = localizeFeature(locale, featureRow);

  const usedBy = await getAppsUsingFeature(featureRow.id);

  return (
    <PageShell>
      <PageHero title={feature.name} description={feature.description ?? undefined}>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={publicTheme.heroBadge}>
            {t("groupLabel", { group: feature.group })}
          </Badge>
          {feature.revenueModel ? (
            <Badge className={publicTheme.badgeGold}>
              {t("revenueFeature")}
            </Badge>
          ) : null}
        </div>
      </PageHero>

      <div className={publicTheme.pageGrid}>
        {feature.workflow ? (
          <Card className={themedCard()}>
            <CardHeader>
              <CardTitle className={`text-base ${publicTheme.cardTitle}`}>{t("workflow")}</CardTitle>
              <CardDescription className={publicTheme.cardDescription}>
                {feature.workflow}
              </CardDescription>
            </CardHeader>
          </Card>
        ) : null}

        {feature.revenueModel ? (
          <Card className={themedCard(feature.workflow ? "mt-6" : undefined)}>
            <CardHeader>
              <CardTitle className={`text-base ${publicTheme.cardTitle}`}>
                {t("revenueModel")}
              </CardTitle>
              <CardDescription className={publicTheme.cardDescription}>
                {feature.revenueModel}
              </CardDescription>
            </CardHeader>
          </Card>
        ) : null}

        {usedBy.length > 0 ? (
          <section className="mt-10">
            <SectionHeading title={t("usedBy")} />
            <Card className={themedCard()}>
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-2">
                  {usedBy.map((app) => (
                    <Link key={app.slug} href={`/apps/${app.slug}`}>
                      <Badge variant="outline" className={publicTheme.badgeOutline}>
                        {app.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        ) : null}

        <div className="mt-10">
          <Link href="/features" className={`text-sm ${publicTheme.link}`}>
            ← {t("backToFeatures")}
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
