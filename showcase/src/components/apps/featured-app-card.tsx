import { ContentImage } from "@/components/ui/content-image";
import { DownloadButtons } from "@/components/apps/download-buttons";
import { GlassCard } from "@/components/vulpine/vulpine-primitives";
import { isCompanyLogo, isUploadedMediaUrl, resolveImageUrl, resolvePosterUrl } from "@/lib/brand-assets";
import { cn } from "@/lib/utils";

type FeaturedAppCardProps = {
  app: {
    id: number;
    slug: string;
    name: string;
    description: string | null;
    platformTypeName: string | null;
    categoryName: string | null;
    logoUrl: string | null;
    posterUrl: string | null;
    posterFocus?: string | null;
    featuredPosterUrl?: string | null;
    featuredPosterFocus?: string | null;
  };
  featuredLabel: string;
  downloadLabel: string;
  links: { type: string; url: string }[];
  className?: string;
};

export function FeaturedAppCard({
  app,
  featuredLabel,
  downloadLabel,
  links,
  className,
}: FeaturedAppCardProps) {
  const posterSrc = resolvePosterUrl(app.posterUrl, app.featuredPosterUrl);
  const posterFocus = posterSrc === app.posterUrl?.trim()
    ? app.posterFocus
    : app.featuredPosterFocus ?? app.posterFocus;
  const logo = resolveImageUrl(app.logoUrl);

  return (
    <GlassCard
      className={cn(
        "group overflow-hidden rounded-2xl border-white/10 vulpine-glow-hover",
        className,
      )}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-black">
        {posterSrc ? (
          <ContentImage
            src={posterSrc}
            fill
            sizes="(max-width: 640px) 50vw, 25vw"
            objectPosition={posterFocus}
            fit="cover"
            unoptimized={isUploadedMediaUrl(posterSrc)}
            className="transition-all duration-700 group-hover:scale-105 grayscale-[0.15] group-hover:grayscale-0"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-4 bg-gradient-to-br from-[var(--fox-charcoal)] via-[#1a1a1a] to-black p-8 text-center">
            <div className="relative size-24 overflow-hidden rounded-xl border border-white/10 bg-[var(--fox-gold)] shadow-[0_0_30px_rgba(255,184,0,0.15)]">
              <ContentImage
                src={app.logoUrl}
                fill
                sizes="96px"
                fallbackClassName="p-4"
              />
            </div>
            <p className="font-display text-lg font-bold uppercase tracking-wide text-white/70">
              {app.name}
            </p>
          </div>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[var(--vulpine-background)] to-transparent opacity-90" />
        <span className="vulpine-label absolute top-4 right-4 rounded-lg bg-[var(--vulpine-primary)] px-2 py-0.5 text-xs text-[var(--vulpine-on-primary)] shadow-[0_0_10px_rgba(255,184,0,0.5)]">
          {featuredLabel}
        </span>
      </div>

      <div className="relative p-6">
        {app.categoryName ? (
          <span className="vulpine-label mb-3 inline-block rounded-lg border border-white/20 px-2 py-0.5 text-xs text-[var(--vulpine-on-surface-variant)]">
            CAT:{app.categoryName.replace(/\s+/g, "_").toUpperCase()}
          </span>
        ) : null}

        <div className="flex items-start gap-3">
          <div
            className={cn(
              "relative size-10 shrink-0 overflow-hidden rounded-xl border border-white/15",
              isCompanyLogo(logo) ? "bg-[var(--vulpine-primary-container)]/20" : "bg-white/5",
            )}
          >
            <ContentImage src={app.logoUrl} fill sizes="40px" fallbackClassName="p-1" />
          </div>
          <div className="min-w-0">
            <h3 className="font-display text-lg font-bold uppercase text-[var(--vulpine-on-surface)]">
              {app.name}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-[var(--vulpine-on-surface-variant)] opacity-90 line-clamp-2">
              {app.description}
            </p>
          </div>
        </div>

        <div className="mt-5 border-t border-white/5 pt-4">
          <p className="vulpine-label mb-3 text-xs text-[var(--vulpine-on-surface-variant)] sm:text-sm">
            {downloadLabel}
          </p>
          <DownloadButtons appSlug={app.slug} appId={app.id} links={links} />
        </div>
      </div>
    </GlassCard>
  );
}
