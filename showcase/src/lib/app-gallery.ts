/**
 * Per-app gallery media for public detail pages.
 * Empty slots still render as placeholders until assets are added.
 */
export type AppGalleryMedia = {
  activities?: string[];
  /**
   * Live-app feed previews. Pass an array (even empty) to show the section;
   * missing/empty entries render dashed boxes ready for real screenshots.
   */
  feed?: (string | null | undefined)[];
  /** How many feed boxes to show when fewer images are provided (default 6). */
  feedSlotCount?: number;
  videos?: string[];
  events?: string[];
};

/** Shared Mr.FOX app screenshots from App Store (real product UI). */
export const MRFOX_APP_SCREENSHOTS = [
  "/apps/screenshots/mrfox/mrfox-screen-1.jpg",
  "/apps/screenshots/mrfox/mrfox-screen-2.jpg",
  "/apps/screenshots/mrfox/mrfox-screen-3.jpg",
  "/apps/screenshots/mrfox/mrfox-screen-4.jpg",
  "/apps/screenshots/mrfox/mrfox-screen-5.jpg",
  "/apps/screenshots/mrfox/mrfox-screen-6.png",
] as const;

/** Public live product URLs for “open on app” CTAs on detail pages. */
export const APP_LIVE_SITES: Record<string, string> = {
  foxy: "https://www.foxy.club",
};

export function getAppLiveSite(slug: string): string | null {
  return APP_LIVE_SITES[slug] ?? null;
}

export const APP_GALLERY: Record<string, AppGalleryMedia> = {
  foxy: {
    activities: [
      "/apps/gallery/foxy-activity-1.png",
      "/apps/gallery/foxy-activity-2.png",
      "/apps/gallery/foxy-activity-3.png",
      "/apps/gallery/foxy-activity-4.png",
    ],
    // Drop real feed screenshots into public/apps/gallery/ as foxy-feed-1.jpg …
    // then list paths here (empty slots stay as dashed boxes).
    feed: [null, null, null, null, null, null],
    feedSlotCount: 6,
  },
  "cosplay-plus": {
    activities: [
      "/apps/gallery/cosplay-plus-kurumin-activity.png",
      "/apps/gallery/cosplay-plus-toasty-activity.png",
      "/apps/gallery/cosplay-plus-lapis-activity.png",
      "/apps/gallery/cosplay-plus-jili-activity.png",
    ],
    videos: [
      "https://youtu.be/_TbjmMsO3Qk",
      "https://youtu.be/7yRVh1pcTXE",
      "https://youtu.be/PHIexC2js5M",
    ],
    events: [
      "/apps/gallery/cosplay-plus-villain-event.png",
      "/apps/gallery/cosplay-plus-wicked-event.png",
    ],
  },
};

export function getAppGallery(slug: string): AppGalleryMedia {
  return APP_GALLERY[slug] ?? {};
}
