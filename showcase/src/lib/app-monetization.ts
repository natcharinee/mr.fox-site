/**
 * Which monetization tools each app detail page should explain.
 * Screenshots are optional — drop into public/apps/monetization/ then map here.
 *
 * Screenshot size (all tools, same for every card):
 *   723 × 1024 px  (portrait, PNG) — same size for every card
 *   Files: foxy-vote.png, foxy-gift.png, foxy-chat-call.png,
 *          foxy-live.png, foxy-live-archive.png, foxy-subscription.png
 */
export type AppMonetizationConfig = {
  toolIds: readonly MonetizationToolId[];
  /** Optional UI crop per tool, e.g. /apps/monetization/foxy-vote.png */
  screenshots?: Partial<Record<MonetizationToolId, string>>;
};

/** Canvas size for monetization UI screenshots (width × height). */
export const MONETIZATION_SCREENSHOT_SIZE = {
  width: 723,
  height: 1024,
} as const;

export const MONETIZATION_TOOL_IDS = [
  "vote",
  "gift",
  "live",
  "chatCall",
  "subscription",
  "liveArchive",
] as const;

export type MonetizationToolId = (typeof MONETIZATION_TOOL_IDS)[number];

/** Default tool order used across Creator apps. */
export const DEFAULT_MONETIZATION_TOOLS = [
  "vote",
  "gift",
  "chatCall",
  "live",
  "liveArchive",
  "subscription",
] as const satisfies readonly MonetizationToolId[];

/** Shared Mr.FOX ecosystem UI crops (same stack across FOXY / CupE / Cosplay Plus). */
export const SHARED_MONETIZATION_SCREENSHOTS: Partial<
  Record<MonetizationToolId, string>
> = {
  vote: "/apps/monetization/foxy-vote.png",
  gift: "/apps/monetization/foxy-gift.png",
  chatCall: "/apps/monetization/foxy-chat-call.png",
  live: "/apps/monetization/foxy-live.png",
  liveArchive: "/apps/monetization/foxy-live-archive.png",
  subscription: "/apps/monetization/foxy-subscription.png",
};

export const APP_MONETIZATION: Record<string, AppMonetizationConfig> = {
  foxy: {
    toolIds: DEFAULT_MONETIZATION_TOOLS,
    screenshots: SHARED_MONETIZATION_SCREENSHOTS,
  },
  cupe: {
    toolIds: DEFAULT_MONETIZATION_TOOLS,
    screenshots: SHARED_MONETIZATION_SCREENSHOTS,
  },
  "cosplay-plus": {
    toolIds: DEFAULT_MONETIZATION_TOOLS,
    screenshots: SHARED_MONETIZATION_SCREENSHOTS,
  },
};

export function getAppMonetization(
  slug: string,
): AppMonetizationConfig | null {
  return APP_MONETIZATION[slug] ?? null;
}
