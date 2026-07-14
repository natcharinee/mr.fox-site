import { Link } from "@/i18n/navigation";
import { AppMedia } from "@/components/apps/app-media";
import { DownloadButtons } from "@/components/apps/download-buttons";
import { publicTheme } from "@/components/layout/public-theme";
import { CATEGORY_THEME } from "@/components/platforms/platform-category-theme";
import { cn } from "@/lib/utils";

type AppListCardProps = {
  app: {
    id: number;
    slug: string;
    name: string;
    description: string | null;
    platformTypeName: string | null;
    categoryName: string | null;
    categorySlug: string | null;
    posterUrl: string | null;
    posterFocus?: string | null;
    featuredPosterUrl?: string | null;
    featuredPosterFocus?: string | null;
  };
  links: { type: string; url: string }[];
  downloadLabel: string;
  className?: string;
};

export function AppListCard({
  app,
  links,
  downloadLabel,
  className,
}: AppListCardProps) {
  const theme =
    CATEGORY_THEME[app.categorySlug ?? "creator"] ?? CATEGORY_THEME.creator;

  return (
    <article
      id={`app-${app.slug}`}
      className={cn(
        publicTheme.card,
        "group flex scroll-mt-28 flex-col gap-0 overflow-hidden p-0 transition-all hover:-translate-y-0.5 sm:flex-row sm:items-stretch",
        "data-[highlight=true]:ring-2 data-[highlight=true]:ring-[var(--vulpine-primary-container)]/60",
        theme.cardHover,
        className,
      )}
    >
      <Link
        href={`/apps/${app.slug}`}
        className="relative flex shrink-0 items-center justify-center self-center py-4 pr-4 pl-3 pb-0 sm:py-5 sm:pr-0 sm:pl-4"
        tabIndex={-1}
        aria-hidden
      >
        <AppMedia
          posterUrl={app.featuredPosterUrl ?? app.posterUrl}
          posterFocus={app.featuredPosterFocus ?? app.posterFocus ?? "42% 50%"}
          name={app.name}
          fit="cover"
          className="aspect-square w-[7.5rem] rounded-2xl border border-[var(--vulpine-outline-variant)]/35 bg-[var(--vulpine-surface-container)] shadow-[0_8px_32px_rgba(0,0,0,0.25)] transition-transform duration-300 group-hover:scale-[1.02] sm:w-32 lg:w-36"
          imageClassName="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col p-4 pt-3 sm:p-5 sm:pl-4">
        <div className="flex flex-wrap items-center gap-2">
          {app.categoryName ? (
            <span
              className={cn(
                "vulpine-label inline-flex rounded-lg border px-2.5 py-1 text-[10px] font-bold tracking-[0.12em]",
                theme.pill,
              )}
            >
              {app.categoryName}
            </span>
          ) : null}
          {app.platformTypeName ? (
            <span className="inline-flex rounded-lg border border-[var(--vulpine-outline-variant)]/45 bg-[var(--vulpine-surface-container)] px-2.5 py-1 text-[11px] font-medium text-[var(--vulpine-on-surface-variant)]">
              {app.platformTypeName}
            </span>
          ) : null}
        </div>

        <h2 className="mt-3 font-display text-xl font-bold tracking-wide text-[var(--vulpine-on-surface)] sm:text-2xl">
          <Link
            href={`/apps/${app.slug}`}
            className="transition-colors hover:text-[var(--vulpine-primary-container)]"
          >
            {app.name}
          </Link>
        </h2>

        {app.description ? (
          <p className="mt-2 max-w-3xl text-[15px] leading-7 text-[var(--vulpine-on-surface-variant)] sm:mt-3 sm:text-base sm:leading-7">
            {app.description}
          </p>
        ) : null}

        <div className="mt-auto border-t border-white/5 pt-4 sm:pt-5">
          <p className="vulpine-label mb-3 text-[10px] tracking-[0.16em] text-[var(--vulpine-primary-container)]">
            {downloadLabel}
          </p>
          <DownloadButtons
            appSlug={app.slug}
            appId={app.id}
            links={links}
            layout="split"
          />
        </div>
      </div>
    </article>
  );
}
