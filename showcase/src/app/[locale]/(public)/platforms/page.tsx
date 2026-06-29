import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/layout/page-hero";
import { PageShell } from "@/components/layout/page-shell";
import { PlatformsOverview, type PlatformsOverviewContent } from "@/components/platforms/platforms-overview";
import { PlatformsCatalog } from "@/components/platforms/platforms-catalog";
import type { Locale } from "@/i18n/routing";
import { localizeCategory, localizePlatform } from "@/lib/content-i18n";
import { buildMetadata } from "@/lib/metadata";
import { getCategories, getPlatformTypes } from "@/lib/queries";

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

  const [categories, platformTypes] = await Promise.all([
    getCategories(),
    getPlatformTypes(),
  ]);

  const localizedCategories = categories.map((c) => localizeCategory(locale, c));
  const localizedPlatforms = platformTypes.map((p) => localizePlatform(locale, p));
  const overview = t.raw("overview") as PlatformsOverviewContent;

  return (
    <PageShell>
      <PageHero title={t("title")} description={t("subtitle")} />

      <PlatformsOverview content={overview} />

      <PlatformsCatalog
        categories={localizedCategories}
        platformTypes={localizedPlatforms}
        viewDetailsLabel={t("catalog.viewDetails")}
        typeCountLabel={(count) => t("catalog.typeCount", { count })}
      />
    </PageShell>
  );
}
