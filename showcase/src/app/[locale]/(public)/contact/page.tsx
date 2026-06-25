import { getTranslations } from "next-intl/server";
import { ContactPageContent } from "@/components/contact/contact-page-content";
import { PageHero } from "@/components/layout/page-hero";
import { PageShell } from "@/components/layout/page-shell";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return buildMetadata({
    title: t("title"),
    description: t("subtitle"),
    path: "/contact",
    locale: locale as Locale,
  });
}

export default async function ContactPage() {
  const t = await getTranslations("contact");

  return (
    <PageShell>
      <PageHero title={t("title")} description={t("subtitle")} />
      <ContactPageContent />
    </PageShell>
  );
}
