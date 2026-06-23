import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHero } from "@/components/layout/page-hero";
import { PageShell } from "@/components/layout/page-shell";
import { themedCard } from "@/components/layout/public-theme";
import type { Locale } from "@/i18n/routing";
import { localizePlatform } from "@/lib/content-i18n";
import { buildMetadata } from "@/lib/metadata";
import { getPlatformTypes } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "platforms" });
  return buildMetadata({
    title: t("title"),
    description: t("subtitle"),
    path: "/platforms",
    locale: locale as Locale,
  });
}

export default async function PlatformsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  const t = await getTranslations("platforms");
  const platformTypes = (await getPlatformTypes()).map((p) =>
    localizePlatform(locale, p),
  );

  return (
    <PageShell>
      <PageHero title={t("title")} description={t("subtitle")} />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {platformTypes.map((pt) => (
            <Link key={pt.slug} href={`/platforms/${pt.slug}`}>
              <Card className={themedCard("h-full")}>
                <CardHeader>
                  <Badge variant="outline" className="mb-2 w-fit border-[#e8d49a] bg-[#fff4cc]/50">
                    {pt.categoryName}
                  </Badge>
                  <CardTitle className="text-[var(--fox-charcoal)]">{pt.name}</CardTitle>
                  <CardDescription>{pt.concept}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
