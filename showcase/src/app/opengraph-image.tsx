import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Mr.FOX — Platform Showcase";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
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
          fontFamily: "system-ui, sans-serif",
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
          Platform Showcase · Creator Economy Ecosystem
        </div>
      </div>
    ),
    { ...size },
  );
}
