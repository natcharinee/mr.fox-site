import { getTranslations } from "next-intl/server";
import { buildMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildMetadata({
    title: "Privacy Policy",
    description: "นโยบายความเป็นส่วนตัว Mr.FOX",
    path: "/privacy",
    locale: locale as "th" | "en" | "zh",
  });
}

export default async function PrivacyPage() {
  const t = await getTranslations("legal");

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 prose prose-neutral">
      <h1>{t("privacyTitle")}</h1>
      <p>{t("privacyIntro")}</p>
      <h2>{t("dataCollection")}</h2>
      <p>{t("dataCollectionBody")}</p>
      <h2>{t("contact")}</h2>
      <p>{t("contactBody")}</p>
    </div>
  );
}
