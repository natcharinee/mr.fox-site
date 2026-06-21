import { getTranslations } from "next-intl/server";
import { ArrowRight, Download, Layers, Sparkles, Zap } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { LinkButton } from "@/components/ui/link-button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DownloadButtons } from "@/components/apps/download-buttons";
import { HomeHero } from "@/components/home/home-hero";
import {
  getCategories,
  getCoreFeatures,
  getDownloadLinks,
  getFeaturedApplications,
  getLatestNews,
  getPlatformTypes,
  getSiteStats,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const t = await getTranslations("home");
  const tc = await getTranslations("common");

  const [stats, categories, platformTypes, featuredApps, coreFeatures, latestNews] =
    await Promise.all([
      getSiteStats(),
      getCategories(),
      getPlatformTypes(),
      getFeaturedApplications(4),
      getCoreFeatures(6),
      getLatestNews(3),
    ]);

  const appsWithLinks = await Promise.all(
    featuredApps.map(async (app) => ({
      ...app,
      links: await getDownloadLinks(app.id),
    })),
  );

  return (
    <div className="bg-[var(--fox-cream)]">
      <HomeHero
        badge={t("badge")}
        title={t("title")}
        titleHighlight={t("titleHighlight")}
        titleSuffix={t("titleSuffix")}
        subtitle={t("subtitle")}
        explorePlatforms={t("explorePlatforms")}
        downloadApps={t("downloadApps")}
      />

      <section className="border-b border-[#f0e4c3] bg-white/70">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-10 sm:px-6 md:grid-cols-4 lg:gap-6 lg:px-8">
          {[
            { label: t("stats.platformTypes"), value: stats.platformTypes, icon: Layers },
            { label: t("stats.applications"), value: stats.applications, icon: Zap },
            { label: t("stats.features"), value: stats.features, icon: Sparkles },
            { label: t("stats.downloads"), value: stats.downloads, icon: Download },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-[#f0e4c3] bg-[var(--fox-cream)] px-4 py-6 text-center shadow-sm"
            >
              <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-[#fff4cc] text-[var(--fox-gold-dark)]">
                <item.icon className="size-5" />
              </div>
              <p className="text-3xl font-bold text-[var(--fox-charcoal)]">{item.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="h-9 w-1 rounded-full bg-[var(--fox-gold)]" />
          <div>
            <h2 className="text-2xl font-bold text-[var(--fox-charcoal)]">{t("ecosystem")}</h2>
            <p className="mt-1 text-muted-foreground">{t("ecosystemDesc")}</p>
          </div>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <Card
              key={cat.slug}
              className="border-[#f0e4c3] bg-white/80 transition-all hover:-translate-y-0.5 hover:border-[var(--fox-gold)]/40 hover:shadow-md"
            >
              <CardHeader>
                <CardTitle className="text-lg">{cat.name}</CardTitle>
                <CardDescription>{cat.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t border-[#f0e4c3] bg-white/60">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="h-9 w-1 rounded-full bg-[var(--fox-gold)]" />
              <div>
                <h2 className="text-2xl font-bold text-[var(--fox-charcoal)]">
                  {t("platformTypes")}
                </h2>
                <p className="mt-1 text-muted-foreground">{t("platformTypesDesc")}</p>
              </div>
            </div>
            <LinkButton href="/platforms" variant="ghost" className="text-[var(--fox-charcoal)]">
              {t("viewAll")} →
            </LinkButton>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {platformTypes.slice(0, 6).map((pt) => (
              <Link key={pt.slug} href={`/platforms/${pt.slug}`}>
                <Card className="h-full border-[#f0e4c3] bg-[var(--fox-cream)] transition-all hover:-translate-y-0.5 hover:border-[var(--fox-gold)]/40 hover:shadow-md">
                  <CardHeader>
                    <Badge variant="outline" className="w-fit mb-2">
                      {pt.categoryName}
                    </Badge>
                    <CardTitle className="text-base">{pt.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {pt.shortDescription ?? pt.concept}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="h-9 w-1 rounded-full bg-[var(--fox-gold)]" />
          <div>
            <h2 className="text-2xl font-bold text-[var(--fox-charcoal)]">{t("featuredApps")}</h2>
            <p className="mt-1 text-muted-foreground">{t("featuredAppsDesc")}</p>
          </div>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {appsWithLinks.map((app) => (
            <Card key={app.slug} className="border-[#f0e4c3] bg-white/85 shadow-sm">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle>{app.name}</CardTitle>
                    <CardDescription>{app.platformTypeName}</CardDescription>
                  </div>
                  <Badge className="bg-[var(--fox-gold)] text-[var(--fox-charcoal)] hover:bg-[var(--fox-gold)]">
                    {tc("featured")}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {app.description}
                </p>
                <DownloadButtons
                  appSlug={app.slug}
                  appId={app.id}
                  links={app.links}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t border-[#f0e4c3] bg-white/60">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="h-9 w-1 rounded-full bg-[var(--fox-gold)]" />
            <h2 className="text-2xl font-bold text-[var(--fox-charcoal)]">{t("coreFeatures")}</h2>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {coreFeatures.map((f) => (
              <Link key={f.slug} href={`/features/${f.slug}`}>
                <Card className="h-full border-[#f0e4c3] bg-[var(--fox-cream)] transition-all hover:-translate-y-0.5 hover:border-[var(--fox-gold)]/40 hover:shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{f.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {f.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="h-9 w-1 rounded-full bg-[var(--fox-gold)]" />
            <h2 className="text-2xl font-bold text-[var(--fox-charcoal)]">{t("latestNews")}</h2>
          </div>
          <LinkButton href="/news" variant="ghost" className="text-[var(--fox-charcoal)]">
            {t("viewAll")} →
          </LinkButton>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {latestNews.map((item) => (
            <Link key={item.slug} href={`/news/${item.slug}`}>
              <Card className="h-full border-[#f0e4c3] bg-white/85 transition-all hover:-translate-y-0.5 hover:border-[var(--fox-gold)]/40 hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-base line-clamp-2">
                    {item.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {item.excerpt}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
