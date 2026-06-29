export const ACTIVE_PLATFORM_TYPE_SLUGS = [
  "creator-specific",
  "community-specific",
  "the-contest",
] as const;

export type ActivePlatformTypeSlug = (typeof ACTIVE_PLATFORM_TYPE_SLUGS)[number];

export function isActivePlatformTypeSlug(slug: string): slug is ActivePlatformTypeSlug {
  return (ACTIVE_PLATFORM_TYPE_SLUGS as readonly string[]).includes(slug);
}
