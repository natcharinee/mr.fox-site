import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { globalSearch } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const t = await getTranslations("search");

  const results = q && q.length >= 2 ? await globalSearch(q) : null;
  const hasResults =
    results &&
    (results.platforms.length > 0 ||
      results.apps.length > 0 ||
      results.features.length > 0 ||
      results.news.length > 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">{t("title")}</h1>
      <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>

      <form className="mt-8 flex gap-3 max-w-xl" action="/search" method="get">
        <Input
          name="q"
          placeholder={t("placeholder")}
          defaultValue={q}
          className="flex-1"
        />
        <button
          type="submit"
          className="h-9 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
        >
          {t("submit")}
        </button>
      </form>

      {q && q.length >= 2 && !hasResults && (
        <p className="mt-10 text-center text-muted-foreground">{t("noResults")}</p>
      )}

      {hasResults && results && (
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {results.platforms.length > 0 && (
            <section>
              <h2 className="font-semibold mb-4">{t("platforms")}</h2>
              <div className="space-y-2">
                {results.platforms.map((item) => (
                  <Link key={item.slug} href={`/platforms/${item.slug}`}>
                    <Card className="hover:border-primary/30 transition-colors">
                      <CardHeader className="py-3">
                        <CardTitle className="text-sm">{item.name}</CardTitle>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}
          {results.apps.length > 0 && (
            <section>
              <h2 className="font-semibold mb-4">{t("apps")}</h2>
              <div className="space-y-2">
                {results.apps.map((item) => (
                  <Link key={item.slug} href={`/apps/${item.slug}`}>
                    <Card className="hover:border-primary/30 transition-colors">
                      <CardHeader className="py-3">
                        <CardTitle className="text-sm">{item.name}</CardTitle>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}
          {results.features.length > 0 && (
            <section>
              <h2 className="font-semibold mb-4">{t("features")}</h2>
              <div className="space-y-2">
                {results.features.map((item) => (
                  <Link key={item.slug} href={`/features/${item.slug}`}>
                    <Card className="hover:border-primary/30 transition-colors">
                      <CardHeader className="py-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                          {item.name}
                          <Badge variant="secondary" className="text-xs">Feature</Badge>
                        </CardTitle>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}
          {results.news.length > 0 && (
            <section>
              <h2 className="font-semibold mb-4">{t("news")}</h2>
              <div className="space-y-2">
                {results.news.map((item) => (
                  <Link key={item.slug} href={`/news/${item.slug}`}>
                    <Card className="hover:border-primary/30 transition-colors">
                      <CardHeader className="py-3">
                        <CardTitle className="text-sm">{item.name}</CardTitle>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
