import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/layout/page-hero";
import { PageShell } from "@/components/layout/page-shell";
import { publicTheme } from "@/components/layout/public-theme";
import { buildMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  return buildMetadata({
    title: t("privacyTitle"),
    description: t("privacyIntro"),
    path: "/privacy",
    locale: locale as "th" | "en" | "zh",
  });
}

export default async function PrivacyPage() {
  const t = await getTranslations("legal");

  return (
    <PageShell>
      <PageHero title={t("privacyTitle")} description={t("privacyIntro")} />
      <div className={`mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 ${publicTheme.prose}`}>
        <h2>{t("dataCollection")}</h2>
        <p>{t("dataCollectionBody")}</p>
        <h2>{t("contact")}</h2>
        <p>{t("contactBody")}</p>
      </div>
    </PageShell>
  );
}
