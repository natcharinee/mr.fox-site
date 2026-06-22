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
import { DownloadButtons } from "@/components/apps/download-buttons";
import { FeatureMatrix } from "@/components/platforms/feature-matrix";
import { PageHero } from "@/components/layout/page-hero";
import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading } from "@/components/layout/section-heading";
import { publicTheme, themedCard } from "@/components/layout/public-theme";
import { buildMetadata } from "@/lib/metadata";
import {
  getAppsByPlatformType,
  getCategoryRevenue,
  getDownloadLinks,
  getPlatformFeatureMatrix,
  getPlatformPermissions,
  getPlatformTypeBySlug,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const platform = await getPlatformTypeBySlug(slug);
  if (!platform) return {};
  return buildMetadata({
    title: platform.name,
    description: platform.shortDescription ?? platform.concept ?? "",
    path: `/platforms/${slug}`,
  });
}

const PERM_LABELS: Record<string, string> = {
  creator_post: "Creator Post",
  visitor_post: "Visitor Post",
  creator_live: "Creator Live",
  visitor_comment: "Visitor Comment",
  visitor_vote: "Visitor Vote",
  visitor_gift: "Visitor Gift",
};

const REVENUE_LABELS: Record<string, string> = {
  vote: "Vote Revenue",
  gift: "Gift Revenue",
  chat: "Chat Revenue",
  voice: "Voice Revenue",
  video: "Video Revenue",
  subscription: "Subscription Revenue",
  live: "Live Revenue",
  ticket: "Ticket Revenue",
  marketplace: "Marketplace Revenue",
  membership: "Membership Revenue",
};

export default async function PlatformDetailPage({ params }: Props) {
  const { slug } = await params;
  const t = await getTranslations("platforms");
  const platform = await getPlatformTypeBySlug(slug);
  if (!platform) notFound();

  const [matrix, permissions, revenues, apps] = await Promise.all([
    getPlatformFeatureMatrix(platform.id),
    getPlatformPermissions(platform.id),
    getCategoryRevenue(platform.categoryId),
    getAppsByPlatformType(platform.id),
  ]);

  const appsWithLinks = await Promise.all(
    apps.map(async (app) => ({
      ...app,
      links: await getDownloadLinks(app.id),
    })),
  );

  return (
    <PageShell>
      <PageHero title={platform.name} description={platform.concept ?? undefined}>
        <Badge variant="outline" className={publicTheme.heroBadge}>
          {platform.categoryName}
        </Badge>
      </PageHero>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className={themedCard()}>
            <CardHeader>
              <CardTitle className="text-[var(--fox-charcoal)]">{t("creatorModel")}</CardTitle>
              <CardDescription className="text-foreground">{platform.creatorModel}</CardDescription>
            </CardHeader>
          </Card>
          <Card className={themedCard()}>
            <CardHeader>
              <CardTitle className="text-[var(--fox-charcoal)]">{t("visitorModel")}</CardTitle>
              <CardDescription className="text-foreground">{platform.visitorModel}</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="mt-10">
          <FeatureMatrix rows={matrix} />
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <Card className={themedCard()}>
            <CardHeader>
              <CardTitle className="text-[var(--fox-charcoal)]">{t("permissionMatrix")}</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2 text-sm">
                {permissions.map((p) => (
                  <div key={p.key} className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">{PERM_LABELS[p.key] ?? p.key}</dt>
                    <dd className="font-medium capitalize text-[var(--fox-charcoal)]">{p.value}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
          <Card className={themedCard()}>
            <CardHeader>
              <CardTitle className="text-[var(--fox-charcoal)]">{t("revenueModel")}</CardTitle>
              <CardDescription>
                {t("revenueCategoryNote")} — {platform.categoryName}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2 text-sm">
                {revenues.map((r) => (
                  <div key={r.revenueFeature} className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">
                      {REVENUE_LABELS[r.revenueFeature] ?? r.revenueFeature}
                    </dt>
                    <dd className="font-medium capitalize text-[var(--fox-charcoal)]">{r.value}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        </div>

        {appsWithLinks.length > 0 ? (
          <section className="mt-12">
            <SectionHeading title={t("exampleApps")} />
            <div className="grid gap-4 sm:grid-cols-2">
              {appsWithLinks.map((app) => (
                <Card key={app.slug} className={themedCard()}>
                  <CardHeader>
                    <CardTitle className="text-base text-[var(--fox-charcoal)]">{app.name}</CardTitle>
                    <CardDescription className="line-clamp-2">{app.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DownloadButtons appSlug={app.slug} appId={app.id} links={app.links} />
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ) : null}

        <div className="mt-10">
          <Link href="/platforms" className={`text-sm ${publicTheme.link}`}>
            ← {t("backToPlatforms")}
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
