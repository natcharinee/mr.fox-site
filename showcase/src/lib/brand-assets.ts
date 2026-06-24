export const COMPANY_LOGO = "/brand/mrfox-company-logo.png";
export const BRAND_ICON = "/brand/mrfox-icon.png";

const BRAND_FALLBACK_IMAGES = new Set([COMPANY_LOGO, BRAND_ICON]);

export function resolveImageUrl(url?: string | null): string {
  const trimmed = url?.trim();
  return trimmed ? trimmed : COMPANY_LOGO;
}

export function isCompanyLogo(url: string): boolean {
  return url === COMPANY_LOGO;
}

export function isBrandFallbackImage(url?: string | null): boolean {
  if (!url) return true;
  return BRAND_FALLBACK_IMAGES.has(url.trim());
}

export function resolvePosterUrl(
  posterUrl?: string | null,
  alternateUrl?: string | null,
): string | null {
  const primary = posterUrl?.trim();
  if (primary && !isBrandFallbackImage(primary)) return primary;

  const alternate = alternateUrl?.trim();
  if (alternate && !isBrandFallbackImage(alternate)) return alternate;

  return null;
}
