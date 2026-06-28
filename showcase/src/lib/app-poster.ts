import { statSync } from "node:fs";
import { join } from "node:path";
import {
  isBrandFallbackImage,
  isUploadedMediaUrl,
  resolvePosterUrl,
} from "@/lib/brand-assets";

/** Auto-generated SVG posters are ~23–31 KB; real photos are typically larger. */
const PLACEHOLDER_MAX_BYTES = 35_000;

type AppPosterFields = {
  slug: string;
  posterUrl?: string | null;
  featuredPosterUrl?: string | null;
};

export function getAppDisplayPosterUrl(app: AppPosterFields): string | null {
  return resolvePosterUrl(app.featuredPosterUrl, app.posterUrl);
}

function isLargeStaticPoster(url: string): boolean {
  if (!url.startsWith("/apps/posters/") && !url.startsWith("/uploads/")) {
    return true;
  }

  try {
    const filePath = join(process.cwd(), "public", url.replace(/^\//, ""));
    return statSync(filePath).size > PLACEHOLDER_MAX_BYTES;
  } catch {
    return false;
  }
}

export function hasRealAppPoster(app: AppPosterFields): boolean {
  if (isUploadedMediaUrl(app.featuredPosterUrl) || isUploadedMediaUrl(app.posterUrl)) {
    return true;
  }

  const posterUrl = getAppDisplayPosterUrl(app);
  if (!posterUrl || isBrandFallbackImage(posterUrl)) {
    return false;
  }

  return isLargeStaticPoster(posterUrl);
}

export function compareAppsByPosterPriority<T extends AppPosterFields>(
  a: T,
  b: T,
): number {
  const aHasPoster = hasRealAppPoster(a);
  const bHasPoster = hasRealAppPoster(b);
  if (aHasPoster !== bHasPoster) {
    return aHasPoster ? -1 : 1;
  }
  return 0;
}
