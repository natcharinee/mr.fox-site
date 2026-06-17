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
  const feature = await getFeatureBySlug(slug);
  if (!feature) notFound();

  const usedBy = await getAppsUsingFeature(feature.id);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center gap-2 mb-4">
        <Badge variant="outline">Group {feature.group}</Badge>
        {feature.revenueModel && (
          <Badge variant="secondary">Revenue Feature</Badge>
        )}
      </div>
      <h1 className="text-3xl font-bold">{feature.name}</h1>
      <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
        {feature.description}
      </p>

      {feature.workflow && (
        <Card className="mt-10">
          <CardHeader>
            <CardTitle className="text-base">Workflow</CardTitle>
            <CardDescription className="text-foreground">
              {feature.workflow}
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {feature.revenueModel && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">Revenue Model</CardTitle>
            <CardDescription className="text-foreground">
              {feature.revenueModel}
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {usedBy.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-bold">Used By</h2>
          <Card className="mt-4">
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-2">
                {usedBy.map((app) => (
                  <Link key={app.slug} href={`/apps/${app.slug}`}>
                    <Badge variant="outline" className="hover:bg-accent">
                      {app.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      <div className="mt-10">
        <Link href="/features" className="text-sm text-primary hover:underline">
          ← กลับไป Feature Library
        </Link>
      </div>
    </div>
  );
}
