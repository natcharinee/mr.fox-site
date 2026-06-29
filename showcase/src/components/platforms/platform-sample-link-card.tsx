import { Play, Trophy, Users } from "lucide-react";
import { CATEGORY_THEME } from "@/components/platforms/platform-category-theme";
import { extractYoutubeId } from "@/lib/youtube";
import { cn } from "@/lib/utils";

export type PlatformSampleLink = {
  eyebrow: string;
  title: string;
  label: string;
  href?: string;
  pendingLabel?: string;
};

export function PlatformSampleLinkCard({
  sampleLink,
  categorySlug = "contest",
}: {
  sampleLink: PlatformSampleLink;
  categorySlug?: string;
}) {
  const theme = CATEGORY_THEME[categorySlug] ?? CATEGORY_THEME.contest;
  const videoId = sampleLink.href ? extractYoutubeId(sampleLink.href) : null;
  const Icon = categorySlug === "community" ? Users : Trophy;

  return (
    <aside
      className={cn(
        "relative overflow-hidden rounded-2xl border p-6 sm:p-8",
        "border-[var(--vulpine-primary-container)]/35 bg-gradient-to-br from-[var(--vulpine-primary-container)]/12 via-[rgba(18,20,20,0.55)] to-[rgba(18,20,20,0.35)]",
        "shadow-[0_12px_40px_rgba(0,0,0,0.22)]",
      )}
    >
      <div
        className="pointer-events-none absolute -right-10 -top-10 size-36 rounded-full bg-[var(--vulpine-primary-container)]/10 blur-3xl"
        aria-hidden
      />

      <div className="relative flex items-start gap-4">
        <div
          className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-2xl border sm:size-14",
            theme.iconWrap,
          )}
        >
          <Icon className="size-6 sm:size-7" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className={cn("vulpine-label text-xs sm:text-sm", theme.accent)}>
            {sampleLink.eyebrow}
          </p>
          <h3 className="font-display mt-1.5 text-lg font-bold uppercase tracking-wide text-[var(--vulpine-on-surface)] sm:text-xl">
            {sampleLink.title}
          </h3>
        </div>
      </div>

      <div className="relative mt-6 overflow-hidden rounded-xl border border-white/10 bg-black shadow-[inset_0_0_0_1px_rgba(255,184,0,0.08)]">
        {videoId ? (
          <div className="relative aspect-video w-full">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`}
              title={sampleLink.label || sampleLink.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              className="absolute inset-0 h-full w-full"
            />
          </div>
        ) : (
          <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 px-4 text-center">
            <span className="inline-flex size-12 items-center justify-center rounded-full border border-[var(--vulpine-primary-container)]/35 bg-[var(--vulpine-primary-container)]/10 text-[var(--vulpine-primary-container)]">
              <Play className="ml-0.5 size-5" aria-hidden />
            </span>
            <p className="text-sm text-[var(--vulpine-on-surface-variant)] sm:text-base">
              {sampleLink.pendingLabel ?? sampleLink.label}
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
