import { Link } from "@/i18n/navigation";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/metadata";
import { getAllNews } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildMetadata({
    title: "News",
    description: "ข่าวสารและอัปเดตจาก Mr.FOX",
    path: "/news",
    locale: locale as Locale,
  });
}

export default async function NewsPage() {
  const items = await getAllNews();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">News</h1>
      <p className="mt-2 text-muted-foreground">ข่าวสารและอัปเดตล่าสุด</p>
      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Link key={item.slug} href={`/news/${item.slug}`}>
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-base line-clamp-2">
                  {item.title}
                </CardTitle>
                <CardDescription>
                  {item.publishedAt
                    ? new Date(item.publishedAt).toLocaleDateString("th-TH")
                    : ""}
                </CardDescription>
                <CardDescription className="line-clamp-2">
                  {item.excerpt}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
