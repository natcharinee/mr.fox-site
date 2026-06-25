import { Play } from "lucide-react";
import { publicTheme } from "@/components/layout/public-theme";
import {
  extractYoutubeId,
  type AboutEventVideoContent,
  type AboutEventVideoItem,
} from "@/lib/youtube";

type AboutEventVideoSectionProps = {
  content: AboutEventVideoContent;
  placeholderLabel: string;
};

function EventVideoCard({
  item,
  index,
  placeholderLabel,
}: {
  item: AboutEventVideoItem;
  index: number;
  placeholderLabel: string;
}) {
  const videoId = extractYoutubeId(item.videoId);

  return (
    <article className="text-center">
      <div className="mb-4 flex flex-col items-center gap-2">
        <span className="inline-flex rounded-full border border-[var(--vulpine-primary-container)]/40 bg-[var(--vulpine-primary-container)]/12 px-3 py-1 text-[10px] font-bold tracking-[0.22em] text-[var(--vulpine-primary-container)] uppercase">
          Clip 0{index + 1}
        </span>
        <h3 className="font-display text-xl font-extrabold tracking-wide text-[var(--vulpine-primary-container)] drop-shadow-[0_0_10px_rgba(255,184,0,0.35)] sm:text-2xl md:text-3xl">
          {item.title}
        </h3>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#ffc20e]/25 bg-black shadow-[inset_0_0_0_1px_rgba(255,194,14,0.08)]">
        {videoId ? (
          <div className="relative aspect-video w-full">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`}
              title={item.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              className="absolute inset-0 h-full w-full"
            />
          </div>
        ) : (
          <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 bg-[#16120c] px-4 text-center">
            <span className="inline-flex size-12 items-center justify-center rounded-full border border-[var(--vulpine-primary-container)]/35 bg-[var(--vulpine-primary-container)]/10 text-[var(--vulpine-primary-container)]">
              <Play className="ml-0.5 size-5" aria-hidden />
            </span>
            <p className={`text-xs sm:text-sm ${publicTheme.muted}`}>
              {placeholderLabel}
            </p>
          </div>
        )}
      </div>

      {item.caption ? (
        <p className={`mt-3 text-base leading-relaxed sm:text-lg ${publicTheme.muted}`}>
          {item.caption}
        </p>
      ) : null}
    </article>
  );
}

export function AboutEventVideoSection({
  content,
  placeholderLabel,
}: AboutEventVideoSectionProps) {
  return (
    <section className="mt-16 border-t border-white/8 pt-12">
      <div className="relative overflow-hidden rounded-3xl border border-[var(--vulpine-primary-container)]/35 bg-[var(--vulpine-surface-container-lowest)] shadow-[0_24px_80px_rgba(42,36,24,0.18)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,194,14,0.14)_0%,transparent_55%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-4 rounded-2xl border border-[#ffc20e]/15 sm:inset-5"
        />

        <div className="relative px-4 py-8 text-center sm:px-8 sm:py-10">
          <p className="text-xs font-semibold tracking-[0.28em] text-[#ffc20e]/85 uppercase">
            {content.eyebrow}
          </p>
          <h2 className="mt-3 font-display text-2xl font-extrabold tracking-[0.1em] uppercase sm:text-3xl md:text-4xl">
            <span className="bg-gradient-to-r from-[var(--vulpine-primary-container)] via-[#ffb000] to-[#ff8c00] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(255,184,0,0.28)]">
              {content.title}
            </span>
          </h2>
          <p className={`mx-auto mt-4 max-w-2xl text-sm leading-relaxed sm:text-base ${publicTheme.muted}`}>
            {content.description}
          </p>

          <div className="mt-8 grid w-full gap-10 sm:mt-10 sm:gap-12">
            {content.videos.map((item, index) => (
              <EventVideoCard
                key={item.title}
                item={item}
                index={index}
                placeholderLabel={placeholderLabel}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
