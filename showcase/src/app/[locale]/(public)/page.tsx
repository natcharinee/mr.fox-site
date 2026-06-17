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
    <div>
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-primary/5 to-background">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-4">
              {t("badge")}
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {t("title")}{" "}
              <span className="text-primary">{t("titleHighlight")}</span>{" "}
              {t("titleSuffix")}
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              {t("subtitle")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href="/platforms" size="lg">
                {t("explorePlatforms")}
                <ArrowRight className="ml-2 size-4" />
              </LinkButton>
              <LinkButton href="/apps" size="lg" variant="outline">
                <Download className="mr-2 size-4" />
                {t("downloadApps")}
              </LinkButton>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b bg-muted/20">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
          {[
            { label: t("stats.platformTypes"), value: stats.platformTypes, icon: Layers },
            { label: t("stats.applications"), value: stats.applications, icon: Zap },
            { label: t("stats.features"), value: stats.features, icon: Sparkles },
            { label: t("stats.downloads"), value: stats.downloads, icon: Download },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <item.icon className="mx-auto mb-2 size-5 text-primary" />
              <p className="text-3xl font-bold">{item.value}</p>
              <p className="text-sm text-muted-foreground">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold">{t("ecosystem")}</h2>
        <p className="mt-2 text-muted-foreground">{t("ecosystemDesc")}</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <Card key={cat.slug} className="transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">{cat.name}</CardTitle>
                <CardDescription>{cat.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t bg-muted/10">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">{t("platformTypes")}</h2>
              <p className="mt-2 text-muted-foreground">{t("platformTypesDesc")}</p>
            </div>
            <LinkButton href="/platforms" variant="ghost">
              {t("viewAll")} →
            </LinkButton>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {platformTypes.slice(0, 6).map((pt) => (
              <Link key={pt.slug} href={`/platforms/${pt.slug}`}>
                <Card className="h-full transition-shadow hover:shadow-md hover:border-primary/30">
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
        <h2 className="text-2xl font-bold">{t("featuredApps")}</h2>
        <p className="mt-2 text-muted-foreground">{t("featuredAppsDesc")}</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {appsWithLinks.map((app) => (
            <Card key={app.slug}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle>{app.name}</CardTitle>
                    <CardDescription>{app.platformTypeName}</CardDescription>
                  </div>
                  <Badge>{tc("featured")}</Badge>
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

      <section className="border-t bg-muted/10">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold">{t("coreFeatures")}</h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {coreFeatures.map((f) => (
              <Link key={f.slug} href={`/features/${f.slug}`}>
                <Card className="h-full transition-shadow hover:shadow-sm hover:border-primary/30">
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
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-bold">{t("latestNews")}</h2>
          <LinkButton href="/news" variant="ghost">
            {t("viewAll")} →
          </LinkButton>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {latestNews.map((item) => (
            <Link key={item.slug} href={`/news/${item.slug}`}>
              <Card className="h-full hover:shadow-md transition-shadow">
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
