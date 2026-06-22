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
    title: t("termsTitle"),
    description: t("termsIntro"),
    path: "/terms",
    locale: locale as "th" | "en" | "zh",
  });
}

export default async function TermsPage() {
  const t = await getTranslations("legal");

  return (
    <PageShell>
      <PageHero title={t("termsTitle")} description={t("termsIntro")} />
      <div className={`mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 ${publicTheme.prose}`}>
        <h2>{t("usage")}</h2>
        <p>{t("usageBody")}</p>
        <h2>{t("contact")}</h2>
        <p>{t("contactBody")}</p>
      </div>
    </PageShell>
  );
}
