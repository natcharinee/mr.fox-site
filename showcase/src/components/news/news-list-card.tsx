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
      <Card className={themedCard("flex h-full flex-col overflow-hidden")}>
        <NewsMedia
          thumbnailUrl={thumbnailUrl}
          title={title}
          className="aspect-[16/10]"
        />
        <CardHeader className="flex-1">
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
        <div className="px-4 pb-4 pt-0">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--vulpine-primary-container)] transition-all group-hover:gap-2.5">
            {readMoreLabel}
            <ArrowRight className="size-4" aria-hidden />
          </span>
        </div>
      </Card>
    </Link>
  );
}
