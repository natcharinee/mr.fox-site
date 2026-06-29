import { getTranslations } from "next-intl/server";
import {
  CreatorGuide,
  type CreatorGuideContent,
} from "@/components/creator/creator-guide";
import { PageHero } from "@/components/layout/page-hero";
import { PageShell } from "@/components/layout/page-shell";
import type { Locale } from "@/i18n/routing";
import { localizePlatform } from "@/lib/content-i18n";
import { buildMetadata } from "@/lib/metadata";
import { getPlatformTypes } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "creator" });
  return buildMetadata({
    title: t("title"),
    description: t("subtitle"),
    path: "/creator",
    locale: locale as Locale,
  });
}

export default async function CreatorPage({ params }: Props) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  const t = await getTranslations("creator");
  const guide = t.raw("guide") as CreatorGuideContent;

  const platformTypes = (await getPlatformTypes()).map((p) =>
    localizePlatform(locale, p),
  );

  return (
    <PageShell>
      <PageHero title={t("title")} description={t("subtitle")} />

      <CreatorGuide content={guide} platformTypes={platformTypes} />
    </PageShell>
  );
}
