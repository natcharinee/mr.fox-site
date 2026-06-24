import { Badge } from "@/components/ui/badge";
import { ContentImage } from "@/components/ui/content-image";
import { DownloadButtons } from "@/components/apps/download-buttons";
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
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-[#f0e4c3] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--fox-gold)]/35 hover:shadow-lg hover:shadow-[var(--fox-gold)]/10",
        className,
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden",
          "aspect-[4/5] sm:aspect-[3/4]",
          posterIsFallback ? "bg-[var(--fox-gold)]" : "bg-[var(--fox-charcoal)]",
        )}
      >
        <ContentImage
          src={app.posterUrl}
          fill
          sizes="(max-width: 640px) 100vw, 50vw"
          objectPosition={app.posterFocus}
          className={cn(
            "transition-transform duration-500 group-hover:scale-[1.03]",
            posterIsFallback && "p-10 sm:p-12",
          )}
        />
        {!posterIsFallback ? (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        ) : null}
        <Badge className="absolute right-3 top-3 border-0 bg-[var(--fox-gold)] text-[var(--fox-charcoal)] shadow-md">
          {featuredLabel}
        </Badge>
        <div className="absolute bottom-3 left-3 flex items-center gap-3">
          <div
            className={cn(
              "relative size-11 shrink-0 overflow-hidden rounded-xl ring-2 ring-white/25 backdrop-blur-sm",
              isCompanyLogo(logo) ? "bg-[var(--fox-gold)]" : "bg-white/10",
            )}
          >
            <ContentImage
              src={app.logoUrl}
              fill
              sizes="44px"
              fallbackClassName="p-1.5"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="space-y-2">
          <h3 className="text-lg font-bold leading-tight text-[var(--fox-charcoal)]">
            {app.name}
          </h3>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full bg-[#fff4cc] px-2.5 py-1 font-medium text-[var(--fox-gold-dark)]">
              {app.platformTypeName}
            </span>
            {app.categoryName ? (
              <span className="text-muted-foreground">{app.categoryName}</span>
            ) : null}
          </div>
        </div>

        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
          {app.description}
        </p>

        <div className="mt-5 border-t border-[#f0e4c3] pt-4">
          <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {downloadLabel}
          </p>
          <DownloadButtons appSlug={app.slug} appId={app.id} links={links} />
        </div>
      </div>
    </article>
  );
}
