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
import { FeatureMatrix } from "@/components/platforms/feature-matrix";
import { DownloadButtons } from "@/components/apps/download-buttons";
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
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Badge variant="outline" className="mb-4">
        {platform.categoryName}
      </Badge>
      <h1 className="text-3xl font-bold">{platform.name}</h1>
      <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
        {platform.concept}
      </p>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Creator Model</CardTitle>
            <CardDescription>{platform.creatorModel}</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Visitor Model</CardTitle>
            <CardDescription>{platform.visitorModel}</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="mt-10">
        <FeatureMatrix rows={matrix} />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Permission Matrix</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2 text-sm">
              {permissions.map((p) => (
                <div key={p.key} className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">
                    {PERM_LABELS[p.key] ?? p.key}
                  </dt>
                  <dd className="font-medium capitalize">{p.value}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Revenue Model</CardTitle>
            <CardDescription>ระดับ Category — {platform.categoryName}</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2 text-sm">
              {revenues.map((r) => (
                <div key={r.revenueFeature} className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">
                    {REVENUE_LABELS[r.revenueFeature] ?? r.revenueFeature}
                  </dt>
                  <dd className="font-medium capitalize">{r.value}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
      </div>

      {appsWithLinks.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold">Example Applications</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {appsWithLinks.map((app) => (
              <Card key={app.slug}>
                <CardHeader>
                  <CardTitle className="text-base">{app.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {app.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DownloadButtons
                    appSlug={app.slug}
                    appId={app.id}
                    links={app.links}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      <div className="mt-10">
        <Link
          href="/platforms"
          className="text-sm text-primary hover:underline"
        >
          ← กลับไป Platform Types
        </Link>
      </div>
    </div>
  );
}
