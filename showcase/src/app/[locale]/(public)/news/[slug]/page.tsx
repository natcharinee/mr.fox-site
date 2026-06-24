import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/page-hero";
import { NewsMedia } from "@/components/news/news-media";
import { PageShell } from "@/components/layout/page-shell";
import { publicTheme } from "@/components/layout/public-theme";
import type { Locale } from "@/i18n/routing";
import { formatLocaleDate, localizeNews } from "@/lib/content-i18n";
import { buildMetadata } from "@/lib/metadata";
import { getNewsBySlug } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  const item = await getNewsBySlug(slug);
  if (!item) return {};
  const localized = localizeNews(locale, item);
  return buildMetadata({
    title: localized.title,
    description: localized.excerpt ?? "",
    path: `/news/${slug}`,
    locale,
  });
}

export default async function NewsDetailPage({ params }: Props) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  const t = await getTranslations("news");
  const itemRow = await getNewsBySlug(slug);
  if (!itemRow) notFound();
  const item = localizeNews(locale, itemRow);

  const publishedLabel = item.publishedAt
    ? formatLocaleDate(locale, item.publishedAt, "long")
    : "";

  return (
    <PageShell>
      <PageHero title={item.title} description={publishedLabel} />

      <div className={publicTheme.contentNarrow}>
        <NewsMedia
          thumbnailUrl={item.thumbnailUrl}
          title={item.title}
          className="aspect-[21/9] rounded-2xl"
        />
      </div>

      <article className={publicTheme.contentNarrow}>
        {item.source ? (
          <p className={`mb-6 text-sm ${publicTheme.muted}`}>
            {t("source")}:{" "}
            {/^https?:\/\//i.test(item.source) ? (
              <a
                href={item.source}
                target="_blank"
                rel="noopener noreferrer"
                className={publicTheme.link}
              >
                {item.source}
              </a>
            ) : (
              <span className="text-[var(--vulpine-on-surface)]">{item.source}</span>
            )}
          </p>
        ) : null}
        <div className={publicTheme.prose}>
          <p className="text-lg leading-relaxed whitespace-pre-wrap">{item.content}</p>
        </div>
        <div className="mt-10">
          <Link href="/news" className={`text-sm ${publicTheme.link}`}>
            ← {t("backToNews")}
          </Link>
        </div>
      </article>
    </PageShell>
  );
}
