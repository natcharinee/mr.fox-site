import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/layout/page-hero";
import { PageShell } from "@/components/layout/page-shell";
import { PlatformTypeBanner } from "@/components/platforms/platform-type-banner";
import { PlatformsOverview, type PlatformsOverviewContent } from "@/components/platforms/platforms-overview";
import { PlatformsCatalog } from "@/components/platforms/platforms-catalog";
import type { PlatformTypeDetailContent } from "@/components/platforms/platform-type-overview";
import type { Locale } from "@/i18n/routing";
import { localizeCategory, localizePlatform } from "@/lib/content-i18n";
import { MRFOX_APP_DOWNLOAD_URL } from "@/lib/app-download";
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
  const typeDetails = t.raw("typeDetails") as Record<string, PlatformTypeDetailContent>;

  return (
    <PageShell>
      <PageHero title={t("title")} description={t("subtitle")} />

      <div className="mx-auto max-w-[1200px] px-4 pt-8 md:px-16">
        <PlatformTypeBanner
          alt={t("typeDetailBannerAlt")}
          href={MRFOX_APP_DOWNLOAD_URL}
        />
      </div>

      <PlatformsOverview content={overview} />

      <PlatformsCatalog
        categories={localizedCategories}
        platformTypes={localizedPlatforms}
        typeDetails={typeDetails}
        viewDetailsLabel={t("catalog.viewDetails")}
        typeCountLabel={(count) => t("catalog.typeCount", { count })}
      />
    </PageShell>
  );
}
