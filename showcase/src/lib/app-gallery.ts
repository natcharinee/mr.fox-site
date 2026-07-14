/**
 * Per-app gallery media for public detail pages.
 * Empty slots still render as placeholders until assets are added.
 */
export type AppGalleryMedia = {
  activities?: string[];
  videos?: string[];
  events?: string[];
};

export const APP_GALLERY: Record<string, AppGalleryMedia> = {
  foxy: {
    activities: [
      "/apps/gallery/foxy-activity-1.png",
      "/apps/gallery/foxy-activity-2.png",
      "/apps/gallery/foxy-activity-3.png",
      "/apps/gallery/foxy-activity-4.png",
    ],
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
