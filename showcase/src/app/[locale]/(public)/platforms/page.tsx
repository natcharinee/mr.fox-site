import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/metadata";
import { getPlatformTypes } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildMetadata({
    title: "Platform Types",
    description:
      "10 ประเภทแพลตฟอร์มใน Mr.FOX Ecosystem — Creator, Community, Company, Contest, Exhibition",
    path: "/platforms",
    locale: locale as Locale,
  });
}

export default async function PlatformsPage() {
  const platformTypes = await getPlatformTypes();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Platform Types</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        10 template มาตรฐาน — แต่ละประเภทกำหนด Feature set และ Permission ตาม Matrix
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {platformTypes.map((pt) => (
          <Link key={pt.slug} href={`/platforms/${pt.slug}`}>
            <Card className="h-full transition-shadow hover:shadow-md hover:border-primary/30">
              <CardHeader>
                <Badge variant="outline" className="w-fit mb-2">
                  {pt.categoryName}
                </Badge>
                <CardTitle>{pt.name}</CardTitle>
                <CardDescription>{pt.concept}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
