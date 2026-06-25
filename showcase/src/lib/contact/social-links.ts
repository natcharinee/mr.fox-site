export const MRFOX_SOCIAL_LINKS = [
  {
    id: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/mrfoxthailand",
  },
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/mrfox.token/",
  },
  {
    id: "line",
    label: "LINE",
    href: "https://line.me/R/ti/p/@989ubhfy",
  },
  {
    id: "telegram",
    label: "Telegram",
    href: "https://t.me/mrfoxtoken",
  },
  {
    id: "youtube",
    label: "YouTube",
    href: "https://www.youtube.com/channel/UClBVvU_D7IlA7bfIv98reug",
  },
  {
    id: "twitter",
    label: "Twitter",
    href: "https://twitter.com/mrfox_token",
  },
  {
    id: "tiktok",
    label: "TikTok",
    href: "https://www.tiktok.com/@mrfox.token",
  },
  {
    id: "vk",
    label: "VK",
    href: "https://vk.com/mrfox.token",
  },
  {
    id: "coinmarketcap",
    label: "CoinMarketCap",
    href: "https://coinmarketcap.com/currencies/mr-fox-token/",
  },
] as const;

export type SocialPlatformId = (typeof MRFOX_SOCIAL_LINKS)[number]["id"];
