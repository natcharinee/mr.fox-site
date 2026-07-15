import type { ReactNode } from "react";
import { CalendarDays, ImageIcon, LayoutGrid, Play } from "lucide-react";
import { ContentImage } from "@/components/ui/content-image";
import { SectionHeading } from "@/components/layout/section-heading";
import { publicTheme } from "@/components/layout/public-theme";
import type { AppGalleryMedia } from "@/lib/app-gallery";
import { isUploadedMediaUrl } from "@/lib/brand-assets";
import { extractYoutubeId } from "@/lib/youtube";
import { cn } from "@/lib/utils";

type SlotProps = {
  label: string;
  aspectClassName: string;
  icon: ReactNode;
  mediaUrl?: string | null;
  imageAlt?: string;
  objectPosition?: string;
};

function MediaSlot({
  label,
  aspectClassName,
  icon,
  mediaUrl,
  imageAlt = "",
  objectPosition,
}: SlotProps) {
  const youtubeId = mediaUrl ? extractYoutubeId(mediaUrl) : null;

  if (youtubeId) {
    return (
      <div
        className={cn(
          "overflow-hidden rounded-2xl border border-white/10 bg-black",
        )}
      >
        <div className={cn("relative w-full", aspectClassName)}>
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1`}
            title={imageAlt || "YouTube video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            className="absolute inset-0 h-full w-full"
          />
        </div>
      </div>
    );
  }

  if (mediaUrl) {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border border-white/10 bg-transparent",
          aspectClassName,
        )}
      >
        <ContentImage
          src={mediaUrl}
          alt={imageAlt}
          fill
          fit="cover"
          objectPosition={objectPosition}
          sizes="(max-width: 768px) 100vw, 33vw"
          unoptimized={isUploadedMediaUrl(mediaUrl)}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/15 bg-black px-4 text-center",
        aspectClassName,
      )}
    >
      <span className="inline-flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[var(--vulpine-on-surface-variant)]">
        {icon}
      </span>
      <p className={`text-sm ${publicTheme.muted}`}>{label}</p>
    </div>
  );
}

function padSlots(
  urls: (string | null | undefined)[] | undefined,
  count: number,
) {
  return Array.from({ length: count }, (_, i) => urls?.[i] ?? null);
}

type AppGalleryPlaceholdersProps = {
  activitiesTitle: string;
  feedTitle: string;
  videosTitle: string;
  eventsTitle: string;
  placeholderLabel: string;
  appName: string;
  media?: AppGalleryMedia;
};

export function AppGalleryPlaceholders({
  activitiesTitle,
  feedTitle,
  videosTitle,
  eventsTitle,
  placeholderLabel,
  appName,
  media = {},
}: AppGalleryPlaceholdersProps) {
  const activities = padSlots(
    media.activities,
    Math.max(4, media.activities?.length ?? 0),
  );
  const showFeed = media.feed !== undefined;
  const feed = showFeed
    ? padSlots(
        media.feed,
        Math.max(media.feedSlotCount ?? 6, media.feed?.length ?? 0),
      )
    : [];
  const videoUrls = (media.videos ?? []).filter(Boolean);
  const videos = videoUrls.length > 0 ? padSlots(videoUrls, videoUrls.length) : [];
  const eventUrls = (media.events ?? []).filter(Boolean);
  const events = eventUrls.length > 0 ? padSlots(eventUrls, eventUrls.length) : [];

  return (
    <div className="mt-14 space-y-12">
      {showFeed ? (
        <section>
          <SectionHeading title={feedTitle} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {feed.map((url, i) => (
              <MediaSlot
                key={`feed-${i}`}
                label={placeholderLabel}
                aspectClassName="aspect-[3/4]"
                icon={<LayoutGrid className="size-5" aria-hidden />}
                mediaUrl={url}
                imageAlt={`${appName} feed ${i + 1}`}
                objectPosition="top"
              />
            ))}
          </div>
        </section>
      ) : null}

      <section>
        <SectionHeading title={activitiesTitle} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {activities.map((url, i) => (
            <MediaSlot
              key={`activity-${i}`}
              label={placeholderLabel}
              aspectClassName="aspect-[3/4]"
              icon={<ImageIcon className="size-5" aria-hidden />}
              mediaUrl={url}
              imageAlt={`${appName} activity ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {videos.length > 0 ? (
        <section>
          <SectionHeading title={videosTitle} />
          <div className="grid gap-4">
            {videos.map((url, i) => (
              <MediaSlot
                key={`video-${i}`}
                label={placeholderLabel}
                aspectClassName="aspect-video"
                icon={<Play className="ml-0.5 size-5" aria-hidden />}
                mediaUrl={url}
                imageAlt={`${appName} video ${i + 1}`}
              />
            ))}
          </div>
        </section>
      ) : null}

      {events.length > 0 ? (
        <section>
          <SectionHeading title={eventsTitle} />
          <div className="grid gap-4 sm:grid-cols-2">
            {events.map((url, i) => (
              <MediaSlot
                key={`event-${i}`}
                label={placeholderLabel}
                aspectClassName="aspect-[16/10]"
                icon={<CalendarDays className="size-5" aria-hidden />}
                mediaUrl={url}
                imageAlt={`${appName} event ${i + 1}`}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
