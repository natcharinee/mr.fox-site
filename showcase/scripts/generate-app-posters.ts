import { mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const OUT_DIR = join(process.cwd(), "public/apps/posters");
const SIZE = 300;

const APPS: { slug: string; name: string; group: string; category: string }[] = [
  { slug: "cupe", name: "CupE", group: "Creator", category: "creator" },
  { slug: "cliq", name: "CLIQ", group: "Creator", category: "creator" },
  { slug: "himbo", name: "Himbo", group: "Creator", category: "creator" },
  { slug: "lesbie", name: "Lesbie", group: "Creator", category: "creator" },
  { slug: "tomboi", name: "Tomboi", group: "Creator", category: "creator" },
  { slug: "bargirl", name: "BarGirl", group: "Creator", category: "creator" },
  { slug: "silom", name: "Silom", group: "Community", category: "community" },
  { slug: "cosplay-plus", name: "Cosplay Plus", group: "Creator", category: "creator" },
  { slug: "expat-idols", name: "Expat Idols", group: "Creator", category: "creator" },
  { slug: "beauty-queen", name: "Beauty Queen", group: "Contest", category: "contest" },
  { slug: "nak-sueksa", name: "นักศึกษา", group: "Community", category: "community" },
];

const CATEGORY_COLORS: Record<string, { stroke: string; glow: string; text: string; muted: string }> = {
  creator: { stroke: "#ffb800", glow: "#ffdca1", text: "#ffdca1", muted: "#ffb800" },
  community: { stroke: "#e6a800", glow: "#ffdca1", text: "#f5d9a8", muted: "#cc9600" },
  contest: { stroke: "#d4a017", glow: "#f0c96e", text: "#e8c878", muted: "#b8860b" },
};

const force = process.argv.includes("--force");

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function splitName(name: string): [string, string | null] {
  if (!name.includes(" ")) return [name, null];
  const idx = name.indexOf(" ");
  return [name.slice(0, idx), name.slice(idx + 1)];
}

function posterSvg(name: string, group: string, category: string): string {
  const [line1, line2] = splitName(name);
  const fontSize = line2 ? 34 : name.length > 8 ? 32 : 40;
  const colors = CATEGORY_COLORS[category] ?? CATEGORY_COLORS.creator;

  return `<svg width="${SIZE}" height="${SIZE}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#080a0a"/>
      <stop offset="55%" stop-color="#121414"/>
      <stop offset="100%" stop-color="#0c0f0f"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${colors.glow}"/>
      <stop offset="100%" stop-color="${colors.stroke}"/>
    </linearGradient>
    <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
      <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#ffb800" stroke-opacity="0.05" stroke-width="1"/>
    </pattern>
    <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <rect width="100%" height="100%" fill="url(#grid)"/>
  <rect x="0" y="0" width="4" height="${SIZE}" fill="${colors.stroke}" fill-opacity="0.85"/>
  <rect x="12" y="12" width="${SIZE - 24}" height="${SIZE - 24}" rx="18" fill="none" stroke="${colors.stroke}" stroke-opacity="0.28" stroke-width="1.5"/>
  <rect x="18" y="18" width="${SIZE - 36}" height="${SIZE - 36}" rx="14" fill="#1e2020" fill-opacity="0.45"/>
  <text x="28" y="38" font-family="Arial, Helvetica, sans-serif" font-size="11" font-weight="700" letter-spacing="3" fill="${colors.muted}" opacity="0.9">MR.FOX</text>
  <text x="${SIZE - 28}" y="38" text-anchor="end" font-family="Arial, Helvetica, sans-serif" font-size="10" font-weight="700" fill="#d5c4ab" opacity="0.55">18+</text>
  <g filter="url(#glow)">
    <text x="50%" y="${line2 ? "44%" : "48%"}" text-anchor="middle" dominant-baseline="middle"
      font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}" font-weight="800"
      letter-spacing="1" fill="url(#accent)">${escapeXml(line1)}</text>
    ${
      line2
        ? `<text x="50%" y="56%" text-anchor="middle" dominant-baseline="middle"
      font-family="Arial, Helvetica, sans-serif" font-size="${fontSize - 4}" font-weight="800"
      letter-spacing="1" fill="url(#accent)">${escapeXml(line2)}</text>`
        : ""
    }
  </g>
  <rect x="${SIZE / 2 - 54}" y="${SIZE - 72}" width="108" height="1.5" fill="${colors.stroke}" fill-opacity="0.4"/>
  <text x="50%" y="${SIZE - 52}" text-anchor="middle"
    font-family="Arial, Helvetica, sans-serif" font-size="11" font-weight="600"
    letter-spacing="2" fill="#d5c4ab">${escapeXml(group.toUpperCase())}</text>
  <text x="50%" y="${SIZE - 30}" text-anchor="middle"
    font-family="Arial, Helvetica, sans-serif" font-size="8" font-weight="500"
    letter-spacing="2" fill="${colors.muted}" fill-opacity="0.65">PLACEHOLDER</text>
</svg>`;
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });

  for (const app of APPS) {
    const outPath = join(OUT_DIR, `${app.slug}.png`);
    if (!force && existsSync(outPath)) {
      console.log(`skip ${app.slug} (exists)`);
      continue;
    }

    const svg = posterSvg(app.name, app.group, app.category);
    await sharp(Buffer.from(svg)).png().toFile(outPath);
    console.log(`created ${outPath}`);
  }

  console.log("done");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
