import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NewsMedia } from "@/components/news/news-media";
import { themedCard, publicTheme } from "@/components/layout/public-theme";
import type { Locale } from "@/i18n/routing";
import { formatLocaleDate } from "@/lib/content-i18n";

type NewsListCardProps = {
  slug: string;
  title: string;
  excerpt: string | null;
  thumbnailUrl: string | null;
  publishedAt: Date | null;
  locale: Locale;
  readMoreLabel: string;
};

export function NewsListCard({
  slug,
  title,
  excerpt,
  thumbnailUrl,
  publishedAt,
  locale,
  readMoreLabel,
}: NewsListCardProps) {
  return (
    <Link href={`/news/${slug}`} className="group block h-full">
      <Card
        className={themedCard(
          "flex h-full flex-col gap-0 overflow-hidden pt-0 [--card-spacing:1rem]",
        )}
      >
        <NewsMedia
          thumbnailUrl={thumbnailUrl}
          title={title}
          className="aspect-[16/10] w-full shrink-0"
        />
        <CardHeader className="flex-1 pt-4">
          <CardTitle className={`line-clamp-2 text-base ${publicTheme.cardTitle}`}>
            {title}
          </CardTitle>
          {publishedAt ? (
            <CardDescription className={publicTheme.cardDescription}>
              {formatLocaleDate(locale, publishedAt)}
            </CardDescription>
          ) : null}
          {excerpt ? (
            <CardDescription className={`line-clamp-2 text-base ${publicTheme.muted}`}>
              {excerpt}
            </CardDescription>
          ) : null}
        </CardHeader>
        <div className="px-4 pb-4 pt-2">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--vulpine-primary-container)]/40 bg-white/[0.04] px-3 py-1.5 text-sm font-semibold text-[var(--vulpine-primary-container)] transition-all group-hover:border-[var(--vulpine-primary-container)]/60 group-hover:bg-[var(--vulpine-primary-container)]/10">
            {readMoreLabel}
            <ArrowRight className="size-4" aria-hidden />
          </span>
        </div>
      </Card>
    </Link>
  );
}
