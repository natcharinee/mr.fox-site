import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const SITE_NAME = "Mr.FOX";

const SITE_ICONS: NonNullable<Metadata["icons"]> = {
  icon: [
    { url: "/brand/mrfox-favicon-32.png", sizes: "32x32", type: "image/png" },
    { url: "/brand/mrfox-favicon.png", sizes: "512x512", type: "image/png" },
  ],
  apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  shortcut: "/brand/mrfox-favicon-32.png",
};

const OG_LOCALE: Record<Locale, string> = {
  th: "th_TH",
  en: "en_US",
  zh: "zh_CN",
};

export function buildMetadata({
  title,
  description,
  path = "",
  locale = "th",
}: {
  title: string;
  description: string;
  path?: string;
  locale?: Locale;
}): Metadata {
  const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
  const localizedPath = path ? `/${locale}${path}` : `/${locale}`;
  const url = `${SITE_URL}${localizedPath}`;

  const languages = Object.fromEntries(
    routing.locales.map((l) => [
      l,
      `${SITE_URL}/${l}${path}`,
    ]),
  );

  return {
    metadataBase: new URL(SITE_URL),
    title: fullTitle,
    description,
    icons: SITE_ICONS,
    alternates: {
      canonical: url,
      languages,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: OG_LOCALE[locale],
      type: "website",
      images: [{ url: `${SITE_URL}/opengraph-image` }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}

export { SITE_NAME, SITE_URL };
