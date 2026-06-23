import localFont from "next/font/local";

export const lineSeedSansTH = localFont({
  src: [
    {
      path: "../../assets/fonts/line-seed-sans-th/LINESeedSansTH_W_Th.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../assets/fonts/line-seed-sans-th/LINESeedSansTH_W_Rg.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../assets/fonts/line-seed-sans-th/LINESeedSansTH_W_Bd.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../assets/fonts/line-seed-sans-th/LINESeedSansTH_W_He.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../assets/fonts/line-seed-sans-th/LINESeedSansTH_W_XBd.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-sans",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

export const LINE_SEED_SANS_TH_FAMILY = "LINE Seed Sans TH";
