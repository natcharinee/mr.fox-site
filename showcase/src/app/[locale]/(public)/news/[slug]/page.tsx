import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/page-hero";
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

      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className={`${publicTheme.prose} text-[var(--fox-charcoal)]`}>
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
