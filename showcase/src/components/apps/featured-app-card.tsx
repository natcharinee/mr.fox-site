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
  featuredLabel?: string;
  downloadLabel: string;
  links: { type: string; url: string }[];
  className?: string;
  compactBelowLg?: boolean;
};

export function FeaturedAppCard({
  app,
  featuredLabel,
  downloadLabel,
  links,
  className,
  compactBelowLg = false,
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
      <div
        className={cn(
          "relative w-full overflow-hidden bg-[var(--fox-charcoal)]",
          "aspect-[4/5]",
        )}
      >
        {posterSrc ? (
          <ContentImage
            src={posterSrc}
            fill
            sizes={
              compactBelowLg
                ? "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                : "(max-width: 1024px) 100vw, 33vw"
            }
            objectPosition={posterFocus}
            fit="contain"
            unoptimized={isUploadedMediaUrl(posterSrc)}
            className="transition-all duration-700 group-hover:scale-[1.02] grayscale-[0.15] group-hover:grayscale-0"
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
        {featuredLabel ? (
          <span
            className={cn(
              "vulpine-label absolute rounded-lg bg-[var(--vulpine-primary)] text-[var(--vulpine-on-primary)] shadow-[0_0_10px_rgba(255,184,0,0.5)]",
              compactBelowLg
                ? "top-3 right-3 px-1.5 py-0.5 text-[10px] lg:top-4 lg:right-4 lg:px-2 lg:text-xs"
                : "top-4 right-4 px-2 py-0.5 text-xs",
            )}
          >
            {featuredLabel}
          </span>
        ) : null}
      </div>

      <div className={cn("relative", compactBelowLg ? "p-4 lg:p-6" : "p-6")}>
        {app.categoryName ? (
          <span
            className={cn(
              "vulpine-label mb-3 inline-block rounded-lg border border-white/20 px-2 py-0.5 text-xs text-[var(--vulpine-on-surface-variant)]",
              compactBelowLg && "mb-2 text-[10px] lg:mb-3 lg:text-xs",
            )}
          >
            CAT:{app.categoryName.replace(/\s+/g, "_").toUpperCase()}
          </span>
        ) : null}

        <div className={cn("flex items-start", compactBelowLg ? "gap-2.5 lg:gap-3" : "gap-3")}>
          <div
            className={cn(
              "relative shrink-0 overflow-hidden",
              compactBelowLg
                ? "size-9 rounded-lg lg:size-10 lg:rounded-xl"
                : "size-10 rounded-xl",
              isCompanyLogo(logo)
                ? null
                : "border border-white/15 bg-white/5",
            )}
          >
            <ContentImage
              src={app.logoUrl}
              fill
              sizes="40px"
              fit={isCompanyLogo(logo) ? "cover" : "contain"}
              className={isCompanyLogo(logo) ? "object-cover p-0" : undefined}
              fallbackClassName={isCompanyLogo(logo) ? "p-0" : "p-1"}
            />
          </div>
          <div className="min-w-0">
            <h3
              className={cn(
                "font-display font-bold uppercase text-[var(--vulpine-on-surface)]",
                compactBelowLg ? "text-base lg:text-lg" : "text-lg",
              )}
            >
              {app.name}
            </h3>
            <p
              className={cn(
                "leading-relaxed text-[var(--vulpine-on-surface-variant)] opacity-90 line-clamp-2",
                compactBelowLg ? "mt-1 text-sm lg:mt-1.5" : "mt-1.5 text-sm",
              )}
            >
              {app.description}
            </p>
          </div>
        </div>

        <div className={cn("border-t border-white/5", compactBelowLg ? "mt-4 pt-3 lg:mt-5 lg:pt-4" : "mt-5 pt-4")}>
          <p
            className={cn(
              "vulpine-label mb-3 text-center text-[var(--vulpine-on-surface-variant)]",
              compactBelowLg ? "mb-2 text-[10px] sm:text-xs lg:mb-3 lg:text-sm" : "text-xs sm:text-sm",
            )}
          >
            {downloadLabel}
          </p>
          <DownloadButtons
            appSlug={app.slug}
            appId={app.id}
            links={links}
            align="center"
            compact
          />
        </div>
      </div>
    </GlassCard>
  );
}
