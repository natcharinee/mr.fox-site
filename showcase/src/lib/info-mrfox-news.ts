import { createHash } from "node:crypto";

export const INFO_MRFOX_NEWS_PAGE = "https://info.mrfox.com/index.html";
export const INFO_MRFOX_ORIGIN = "https://info.mrfox.com";

export type InfoMrfoxReview = {
  slug: string;
  title: string;
  excerpt: string;
  source: string;
  thumbnailUrl: string | null;
  publishedAt: Date | null;
};

function decodeHtml(text: string) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function stripTags(text: string) {
  return decodeHtml(text.replace(/<[^>]+>/g, " "));
}

function normalizeWhitespace(text: string) {
  return stripTags(text).replace(/\s+/g, " ").trim();
}

function resolveImageUrl(src: string | undefined) {
  if (!src) return null;
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  if (src.startsWith("/")) return `${INFO_MRFOX_ORIGIN}${src}`;
  return `${INFO_MRFOX_ORIGIN}/${src.replace(/^\.\//, "")}`;
}

export function slugFromInfoMrfoxUrl(url: string) {
  const hash = createHash("sha256").update(url).digest("hex").slice(0, 12);
  return `info-${hash}`;
}

function parsePublishedDate(raw: string) {
  const [year, month, day] = raw.split("-").map((part) => Number(part));
  if (!year || !month || !day) return null;
  return new Date(Date.UTC(year, month - 1, day));
}

function extractNewsSection(html: string) {
  const start = html.indexOf('id="news-Fox"');
  if (start === -1) return "";

  const sectionStart = html.indexOf(">", start) + 1;
  const endMarkers = [
    "Main Coins Market Price",
    '<section data-settings="particles-2"',
    '<hr class="divide" />\n\n      <section>\n        <div class="container">\n          <div class="medium-padding40">\n            <div class="text-center pb-2">\n              <h4 class="heading-title c-primary weight-normal" lang="en"><span class="t500">Main Coins',
  ];

  let sectionEnd = html.length;
  for (const marker of endMarkers) {
    const index = html.indexOf(marker, sectionStart);
    if (index !== -1) sectionEnd = Math.min(sectionEnd, index);
  }

  return html.slice(sectionStart, sectionEnd);
}

export function parseReviewBlock(block: string, publishedAt: Date | null): InfoMrfoxReview | null {
  const hrefMatch = block.match(/href="([^"]+)"/);
  if (!hrefMatch) return null;

  const source = hrefMatch[1].trim();
  const imageMatch = block.match(/<img[^>]+src="([^"]+)"/i);
  const excerptMatch = block.match(/<p class="f-size-14">([\s\S]*?)<\/p>/i);
  const excerpt = normalizeWhitespace(excerptMatch?.[1] ?? "");

  const titleFromSmall = block.match(/<h5[^>]*>\s*<small>([\s\S]*?)<\/small>/i);
  const titleFromH5 = block.match(/<h5[^>]*>([\s\S]*?)<\/h5>/i);
  const h5Text = normalizeWhitespace(titleFromH5?.[1] ?? "");
  const title = normalizeWhitespace(
    titleFromSmall?.[1] ?? (/^เพจ\s/i.test(h5Text) && excerpt ? excerpt : h5Text),
  );

  if (!title) return null;

  return {
    slug: slugFromInfoMrfoxUrl(source),
    title,
    excerpt: excerpt || title,
    source,
    thumbnailUrl: resolveImageUrl(imageMatch?.[1]),
    publishedAt,
  };
}

export function parseInfoMrfoxReviews(html: string): InfoMrfoxReview[] {
  const section = extractNewsSection(html);
  if (!section) return [];

  const items: InfoMrfoxReview[] = [];
  let currentDate: Date | null = null;

  const tokenRegex =
    /<!--news (\d{4}-\d{1,2}-\d{1,2}) str\s*-->|<a class="row no-gutters"[\s\S]*?<\/a>/g;

  for (const match of section.matchAll(tokenRegex)) {
    const full = match[0];
    if (full.startsWith("<!--news")) {
      const dateMatch = full.match(/(\d{4}-\d{1,2}-\d{1,2})/);
      currentDate = dateMatch ? parsePublishedDate(dateMatch[1]) : null;
      continue;
    }

    const parsed = parseReviewBlock(full, currentDate);
    if (parsed) items.push(parsed);
  }

  return items;
}

export async function fetchInfoMrfoxReviews() {
  const response = await fetch(INFO_MRFOX_NEWS_PAGE, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${INFO_MRFOX_NEWS_PAGE}: ${response.status}`);
  }

  const html = await response.text();
  return parseInfoMrfoxReviews(html);
}
