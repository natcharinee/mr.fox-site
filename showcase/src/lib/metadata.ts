import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const SITE_NAME = "Mr.FOX";

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
