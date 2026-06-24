import { getTranslations } from "next-intl/server";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AboutRoadmapSection,
  type RoadmapPhase,
} from "@/components/about/about-roadmap-section";
import { PageHero } from "@/components/layout/page-hero";
import { PageShell } from "@/components/layout/page-shell";
import { themedCard } from "@/components/layout/public-theme";
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
  const roadmap = t.raw("roadmapPhases") as RoadmapPhase[];

  return (
    <PageShell>
      <PageHero title={t("title")} description={t("subtitle")} />

      <div className="mx-auto max-w-[1200px] px-4 py-12 md:px-16">
        <div className="grid gap-6 md:grid-cols-2">
          <Card className={themedCard()}>
            <CardHeader>
              <CardTitle className="font-display text-[var(--vulpine-on-surface)] uppercase">
                {t("vision")}
              </CardTitle>
              <CardDescription className="text-base leading-relaxed text-[var(--vulpine-on-surface-variant)]">
                {t("visionBody")}
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className={themedCard()}>
            <CardHeader>
              <CardTitle className="font-display text-[var(--vulpine-on-surface)] uppercase">
                {t("mission")}
              </CardTitle>
              <CardDescription className="text-base leading-relaxed text-[var(--vulpine-on-surface-variant)]">
                {t("missionBody")}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <AboutRoadmapSection
          title={t("roadmap")}
          visualTitle={t("roadmapVisualTitle")}
          visualCaption={t("roadmapVisualCaption")}
          phases={roadmap}
        />
      </div>
    </PageShell>
  );
}
