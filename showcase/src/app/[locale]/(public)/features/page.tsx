import { Link } from "@/i18n/navigation";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/metadata";
import { getShowcaseFeatures } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildMetadata({
    title: "Feature Library",
    description:
      "ฟีเจอร์ Showcase ของ Mr.FOX Ecosystem — Vote, Gift, Live, Subscription และอื่นๆ",
    path: "/features",
    locale: locale as Locale,
  });
}

export default async function FeaturesPage() {
  const features = await getShowcaseFeatures();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Feature Library</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Group B — ฟีเจอร์ที่แสดงใน Showcase และมี Detail page (ตาม Website Spec §3)
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <Link key={f.slug} href={`/features/${f.slug}`}>
            <Card className="h-full transition-shadow hover:shadow-md hover:border-primary/30">
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-base">{f.name}</CardTitle>
                  {f.revenueModel && (
                    <Badge variant="secondary" className="shrink-0">
                      💰
                    </Badge>
                  )}
                </div>
                <CardDescription className="line-clamp-3">
                  {f.description}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
