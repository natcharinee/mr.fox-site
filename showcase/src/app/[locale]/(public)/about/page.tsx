import { getTranslations } from "next-intl/server";
import {
  AboutEventVideoSection,
} from "@/components/about/about-event-video-section";
import {
  AboutRoadmapSection,
  type RoadmapPhase,
} from "@/components/about/about-roadmap-section";
import {
  AboutPurposeSection,
  type AboutPurposeContent,
} from "@/components/about/about-purpose-section";
import { ContactPageContent } from "@/components/contact/contact-page-content";
import type { ContactGuideContent } from "@/components/contact/contact-guide-card";
import type { AboutEventVideoContent } from "@/lib/youtube";
import { PageHero } from "@/components/layout/page-hero";
import { PageShell } from "@/components/layout/page-shell";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return buildMetadata({
    title: t("title"),
    description: t("subtitle"),
    path: "/about",
    locale: locale as Locale,
  });
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  const tContact = await getTranslations({ locale, namespace: "contact" });
  const roadmap = t.raw("roadmapPhases") as RoadmapPhase[];
  const purpose = t.raw("purpose") as AboutPurposeContent;
  const eventVideo = t.raw("eventVideo") as AboutEventVideoContent;
  const guide = tContact.raw("guide") as ContactGuideContent;

  return (
    <PageShell>
      <PageHero title={t("title")} description={t("subtitle")} />

      <div className="mx-auto max-w-[1200px] px-4 py-12 md:px-16">
        <AboutPurposeSection content={purpose} />

        <AboutRoadmapSection
          title={t("roadmap")}
          phasesTitle={t("roadmapPhasesTitle")}
          phasesSubtitle={t("roadmapPhasesSubtitle")}
          visualTitle={t("roadmapVisualTitle")}
          visualCaption={t("roadmapVisualCaption")}
          statusLabels={{
            done: t("roadmapStatus.done"),
            active: t("roadmapStatus.active"),
            upcoming: t("roadmapStatus.upcoming"),
          }}
          phases={roadmap}
        />

        <AboutEventVideoSection
          content={eventVideo}
          placeholderLabel={t("eventVideoPlaceholder")}
        />

        <ContactPageContent guide={guide} embedded />
      </div>
    </PageShell>
  );
}
