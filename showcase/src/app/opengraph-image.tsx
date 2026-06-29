import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { LINE_SEED_SANS_TH_FAMILY } from "@/lib/fonts/line-seed-sans-th";

export const runtime = "nodejs";
export const alt = "Mr.FOX — 18+ Creator Platform";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const fontPath = join(
    process.cwd(),
    "public/LINE_Seed_Sans_TH_V1.003/Desktop/TTF/LINESeedSansTH_Bd.ttf",
  );
  const fontData = await readFile(fontPath);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
          color: "#f8fafc",
          fontFamily: LINE_SEED_SANS_TH_FAMILY,
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          Mr.FOX
        </div>
        <div
          style={{
            marginTop: 16,
            fontSize: 28,
            color: "#94a3b8",
          }}
        >
          18+ Creator Platform · Creator · Community · Contest
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: LINE_SEED_SANS_TH_FAMILY,
          data: fontData,
          style: "normal",
          weight: 700,
        },
      ],
    },
  );
}
