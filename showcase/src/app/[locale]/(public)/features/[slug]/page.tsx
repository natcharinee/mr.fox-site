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
import { buildMetadata } from "@/lib/metadata";
import { getAppsUsingFeature, getFeatureBySlug } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const feature = await getFeatureBySlug(slug);
  if (!feature) return {};
  return buildMetadata({
    title: feature.name,
    description: feature.description ?? "",
    path: `/features/${slug}`,
  });
}

export default async function FeatureDetailPage({ params }: Props) {
  const { slug } = await params;
  const t = await getTranslations("features");
  const feature = await getFeatureBySlug(slug);
  if (!feature) notFound();

  const usedBy = await getAppsUsingFeature(feature.id);

  return (
    <PageShell>
      <PageHero title={feature.name} description={feature.description ?? undefined}>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={publicTheme.heroBadge}>
            Group {feature.group}
          </Badge>
          {feature.revenueModel ? (
            <Badge className="bg-white/10 text-[#fff4cc] hover:bg-white/10">
              {t("revenueFeature")}
            </Badge>
          ) : null}
        </div>
      </PageHero>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {feature.workflow ? (
          <Card className={themedCard()}>
            <CardHeader>
              <CardTitle className="text-base text-[var(--fox-charcoal)]">{t("workflow")}</CardTitle>
              <CardDescription className="text-foreground">{feature.workflow}</CardDescription>
            </CardHeader>
          </Card>
        ) : null}

        {feature.revenueModel ? (
          <Card className={themedCard(feature.workflow ? "mt-6" : undefined)}>
            <CardHeader>
              <CardTitle className="text-base text-[var(--fox-charcoal)]">{t("revenueModel")}</CardTitle>
              <CardDescription className="text-foreground">{feature.revenueModel}</CardDescription>
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
