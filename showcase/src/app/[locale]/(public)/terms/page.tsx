import { getTranslations } from "next-intl/server";
import { buildMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildMetadata({
    title: "Terms of Service",
    description: "ข้อกำหนดการใช้บริการ Mr.FOX",
    path: "/terms",
    locale: locale as "th" | "en" | "zh",
  });
}

export default async function TermsPage() {
  const t = await getTranslations("legal");

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 prose prose-neutral">
      <h1>{t("termsTitle")}</h1>
      <p>{t("termsIntro")}</p>
      <h2>{t("usage")}</h2>
      <p>{t("usageBody")}</p>
      <h2>{t("contact")}</h2>
      <p>{t("contactBody")}</p>
    </div>
  );
}
