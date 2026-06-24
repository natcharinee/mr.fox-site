import { ContentImage } from "@/components/ui/content-image";
import { DownloadButtons } from "@/components/apps/download-buttons";
import { GlassCard } from "@/components/vulpine/vulpine-primitives";
import { isCompanyLogo, resolveImageUrl } from "@/lib/brand-assets";
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
  const poster = resolveImageUrl(app.posterUrl);
  const logo = resolveImageUrl(app.logoUrl);
  const posterIsFallback = isCompanyLogo(poster);

  return (
    <GlassCard
      hud
      className={cn(
        "group overflow-hidden rounded-lg border-white/10 vulpine-glow-hover",
        className,
      )}
    >
      <div
        className={cn(
          "relative aspect-[3/4] w-full overflow-hidden",
          posterIsFallback ? "bg-[var(--fox-gold)]" : "bg-[var(--fox-charcoal)]",
        )}
      >
        <ContentImage
          src={app.posterUrl}
          fill
          sizes="(max-width: 640px) 50vw, 25vw"
          objectPosition={app.posterFocus}
          fit={posterIsFallback ? "contain" : "cover"}
          fallbackClassName="p-8"
          className={cn(
            "transition-all duration-700 group-hover:scale-105",
            !posterIsFallback && "grayscale-[0.15] group-hover:grayscale-0",
          )}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[var(--vulpine-background)] to-transparent opacity-90" />
        <span className="vulpine-label absolute top-4 right-4 rounded-sm bg-[var(--vulpine-primary)] px-2 py-0.5 text-[10px] text-[var(--vulpine-on-primary)] shadow-[0_0_10px_rgba(255,184,0,0.5)]">
          {featuredLabel}
        </span>
      </div>

      <div className="relative p-6">
        {app.categoryName ? (
          <span className="vulpine-label mb-3 inline-block rounded-sm border border-white/20 px-2 py-0.5 text-[9px] text-[var(--vulpine-on-surface-variant)]">
            CAT:{app.categoryName.replace(/\s+/g, "_").toUpperCase()}
          </span>
        ) : null}

        <div className="flex items-start gap-3">
          <div
            className={cn(
              "relative size-10 shrink-0 overflow-hidden rounded-sm border border-white/15",
              isCompanyLogo(logo) ? "bg-[var(--vulpine-primary-container)]/20" : "bg-white/5",
            )}
          >
            <ContentImage src={app.logoUrl} fill sizes="40px" fallbackClassName="p-1" />
          </div>
          <div className="min-w-0">
            <h3 className="font-display text-lg font-bold uppercase text-[var(--vulpine-on-surface)]">
              {app.name}
            </h3>
            <p className="mt-1 text-[11px] leading-relaxed text-[var(--vulpine-on-surface-variant)] opacity-80 line-clamp-2">
              {app.description}
            </p>
          </div>
        </div>

        <div className="mt-5 border-t border-white/5 pt-4">
          <p className="vulpine-label mb-3 text-[10px] text-[var(--vulpine-on-surface-variant)]">
            {downloadLabel}
          </p>
          <DownloadButtons appSlug={app.slug} appId={app.id} links={links} />
        </div>
      </div>
    </GlassCard>
  );
}
