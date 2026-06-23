export const COMPANY_LOGO = "/brand/mrfox-company-logo.png";

export function resolveImageUrl(url?: string | null): string {
  const trimmed = url?.trim();
  return trimmed ? trimmed : COMPANY_LOGO;
}

export function isCompanyLogo(url: string): boolean {
  return url === COMPANY_LOGO;
}
