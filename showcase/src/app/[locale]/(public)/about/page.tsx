import { getTranslations } from "next-intl/server";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHero } from "@/components/layout/page-hero";
import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading } from "@/components/layout/section-heading";
import { themedCard } from "@/components/layout/public-theme";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string }> };

type RoadmapPhase = {
  phase: string;
  title: string;
  items: string[];
};

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

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          <Card className={themedCard()}>
            <CardHeader>
              <CardTitle className="text-[var(--fox-charcoal)]">{t("vision")}</CardTitle>
              <CardDescription className="text-base leading-relaxed text-foreground">
                {t("visionBody")}
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className={themedCard()}>
            <CardHeader>
              <CardTitle className="text-[var(--fox-charcoal)]">{t("mission")}</CardTitle>
              <CardDescription className="text-base leading-relaxed text-foreground">
                {t("missionBody")}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <section className="mt-12">
          <SectionHeading title={t("roadmap")} />
          <div className="grid gap-4 md:grid-cols-3">
            {roadmap.map((r) => (
              <Card key={r.phase} className={themedCard()}>
                <CardHeader>
                  <CardTitle className="text-base text-[var(--fox-charcoal)]">{r.phase}</CardTitle>
                  <CardDescription className="font-medium text-foreground">{r.title}</CardDescription>
                  <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                    {r.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
