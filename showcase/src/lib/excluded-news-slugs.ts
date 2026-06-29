export const EXCLUDED_NEWS_SLUGS = ["test", "tes", "news-test", "test-news"] as const;

export function isExcludedNewsSlug(slug: string): boolean {
  return (EXCLUDED_NEWS_SLUGS as readonly string[]).includes(slug);
}
