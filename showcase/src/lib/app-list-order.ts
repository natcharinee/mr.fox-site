import { compareAppsByPosterPriority } from "@/lib/app-poster";

/** Pinned order on Applications list / homepage featured strip. */
export const PINNED_APP_SLUGS = ["foxy", "cupe", "cosplay-plus"] as const;

type AppListFields = {
  slug: string;
  featured?: boolean | null;
  sortOrder: number;
  posterUrl?: string | null;
  featuredPosterUrl?: string | null;
};

function pinnedIndex(slug: string): number {
  return (PINNED_APP_SLUGS as readonly string[]).indexOf(slug);
}

export function compareAppsByListOrder<T extends AppListFields>(a: T, b: T): number {
  const ai = pinnedIndex(a.slug);
  const bi = pinnedIndex(b.slug);
  if (ai !== -1 || bi !== -1) {
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  }

  const posterOrder = compareAppsByPosterPriority(a, b);
  if (posterOrder !== 0) return posterOrder;
  if (a.featured !== b.featured) return a.featured ? -1 : 1;
  return a.sortOrder - b.sortOrder;
}
