import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DownloadButtons } from "@/components/apps/download-buttons";
import { buildMetadata } from "@/lib/metadata";
import {
  getApplicationBySlug,
  getDownloadLinks,
  getRelatedApplications,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const app = await getApplicationBySlug(slug);
  if (!app) return {};
  return buildMetadata({
    title: app.name,
    description: app.description ?? "",
    path: `/apps/${slug}`,
  });
}

export default async function AppDetailPage({ params }: Props) {
  const { slug } = await params;
  const app = await getApplicationBySlug(slug);
  if (!app) notFound();

  const [links, related] = await Promise.all([
    getDownloadLinks(app.id),
    getRelatedApplications(app.platformTypeId, slug),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Badge variant="outline">{app.categoryName}</Badge>
        <Badge variant="secondary">{app.platformTypeName}</Badge>
      </div>
      <h1 className="text-3xl font-bold">{app.name}</h1>
      <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
        {app.description}
      </p>

      <div className="mt-8">
        <DownloadButtons appSlug={app.slug} appId={app.id} links={links} />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Platform Type</CardTitle>
            <CardDescription>
              <Link
                href={`/platforms/${app.platformTypeSlug}`}
                className="text-primary hover:underline"
              >
                {app.platformTypeName}
              </Link>
            </CardDescription>
          </CardHeader>
        </Card>
        {app.targetAudience && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Target Audience</CardTitle>
              <CardDescription>{app.targetAudience}</CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold">Related Applications</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {related.map((r) => (
              <Link key={r.slug} href={`/apps/${r.slug}`}>
                <Badge variant="outline" className="hover:bg-accent">
                  {r.name}
                </Badge>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="mt-10">
        <Link href="/apps" className="text-sm text-primary hover:underline">
          ← กลับไป Applications
        </Link>
      </div>
    </div>
  );
}
