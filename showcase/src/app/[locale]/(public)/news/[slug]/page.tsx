import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/page-hero";
import { PageShell } from "@/components/layout/page-shell";
import { publicTheme } from "@/components/layout/public-theme";
import { buildMetadata } from "@/lib/metadata";
import { getNewsBySlug } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);
  if (!item) return {};
  return buildMetadata({
    title: item.title,
    description: item.excerpt ?? "",
    path: `/news/${slug}`,
  });
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const t = await getTranslations("news");
  const item = await getNewsBySlug(slug);
  if (!item) notFound();

  const publishedLabel = item.publishedAt
    ? new Date(item.publishedAt).toLocaleDateString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
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
