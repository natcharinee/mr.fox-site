export type NewsPublishStatus = "draft" | "scheduled" | "published";

const BANGKOK_TZ = "Asia/Bangkok";

export function parseNewsPublishDate(value: string | undefined): Date | null {
  if (!value) return null;
  return new Date(`${value}T00:00:00+07:00`);
}

export function getBangkokCalendarDate(value: Date | string): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: BANGKOK_TZ }).format(
    new Date(value),
  );
}

export function formatNewsPublishDateInput(
  value: Date | string | null,
): string {
  if (!value) return "";
  return getBangkokCalendarDate(value);
}

export function getNewsPublishStatus(
  publishedAt: Date | string | null,
  now: Date = new Date(),
): NewsPublishStatus {
  if (!publishedAt) return "draft";

  const publishDay = getBangkokCalendarDate(publishedAt);
  const today = getBangkokCalendarDate(now);

  if (publishDay > today) return "scheduled";
  return "published";
}

export function isNewsPublic(
  publishedAt: Date | string | null,
  now: Date = new Date(),
): boolean {
  return getNewsPublishStatus(publishedAt, now) === "published";
}
