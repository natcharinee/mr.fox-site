import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DownloadButtons } from "@/components/apps/download-buttons";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/metadata";
import { getApplications, getCategories, getDownloadLinks, getPlatformTypes } from "@/lib/queries";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    q?: string;
    category?: string;
    platform?: string;
  }>;
};

export async function generateMetadata({ params }: Pick<PageProps, "params">) {
  const { locale } = await params;
  return buildMetadata({
    title: "Applications",
    description: "รายการแอปพลิเคชันใน Mr.FOX Ecosystem — ค้นหาและดาวน์โหลด",
    path: "/apps",
    locale: locale as Locale,
  });
}

export default async function AppsPage({
  searchParams,
}: Pick<PageProps, "searchParams">) {
  const { q, category, platform } = await searchParams;
  const [apps, categories, platformTypes] = await Promise.all([
    getApplications({
      search: q,
      categorySlug: category,
      platformTypeSlug: platform,
    }),
    getCategories(),
    getPlatformTypes(),
  ]);

  const appsWithLinks = await Promise.all(
    apps.map(async (app) => ({
      ...app,
      links: await getDownloadLinks(app.id),
    })),
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Applications</h1>
      <p className="mt-2 text-muted-foreground">
        ค้นหาและดาวน์โหลดแอปใน ecosystem
      </p>

      <form className="mt-8 flex flex-wrap gap-3" action="/apps" method="get">
        <Input
          name="q"
          placeholder="ค้นหาแอป..."
          defaultValue={q}
          className="max-w-xs"
        />
        <select
          name="category"
          defaultValue={category ?? ""}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="">ทุก Category</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          name="platform"
          defaultValue={platform ?? ""}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="">ทุก Platform Type</option>
          {platformTypes.map((pt) => (
            <option key={pt.slug} value={pt.slug}>
              {pt.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="h-9 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
        >
          ค้นหา
        </button>
      </form>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {appsWithLinks.map((app) => (
          <Card key={app.slug} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-lg">
                  <Link href={`/apps/${app.slug}`} className="hover:text-primary">
                    {app.name}
                  </Link>
                </CardTitle>
                {app.featured && <Badge>Featured</Badge>}
              </div>
              <CardDescription>
                {app.platformTypeName} · {app.categoryName}
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {app.description}
              </p>
              <DownloadButtons
                appSlug={app.slug}
                appId={app.id}
                links={app.links}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {appsWithLinks.length === 0 && (
        <p className="mt-10 text-center text-muted-foreground">
          ไม่พบแอปที่ตรงกับเงื่อนไข
        </p>
      )}
    </div>
  );
}
