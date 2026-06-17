import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildMetadata({
    title: "About Mr.FOX",
    description:
      "Mr.FOX — พัฒนา Platform และ Mobile Applications สำหรับ Creator Economy Ecosystem",
    path: "/about",
    locale: locale as Locale,
  });
}

const ROADMAP = [
  {
    phase: "Phase 1",
    title: "Public Showcase",
    items: ["Home, Platforms, Apps, Features", "News, About, Contact", "Data Model + Matrix seed"],
  },
  {
    phase: "Phase 2",
    title: "CMS / Back Office",
    items: ["Admin CRUD ทุก module", "Media Library + Analytics", "SEO + Banner management"],
  },
  {
    phase: "Phase 3",
    title: "Polish & Scale",
    items: ["Multi-language (th/en/zh)", "Global Search ขั้นสูง", "100+ Applications"],
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">About Mr.FOX</h1>
      <p className="mt-4 max-w-3xl text-lg text-muted-foreground leading-relaxed">
        Mr.FOX เป็นบริษัทที่พัฒนา Platform และ Mobile Applications หลายประเภท
        เพื่อสร้าง Ecosystem ครอบคลุม Creator Economy, Community, Organization,
        Contest และ Exhibition
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Vision</CardTitle>
            <CardDescription className="text-foreground text-base leading-relaxed">
              สร้าง ecosystem ที่ Creator หารายได้จากแฟนคลับโดยตรง
              ผ่านแพลตฟอร์มมาตรฐานที่ scale ได้ไม่จำกัด
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Mission</CardTitle>
            <CardDescription className="text-foreground text-base leading-relaxed">
              พัฒนา Showcase + Engine ที่ data-driven — เพิ่มแอปจาก 10 เป็น 100+
              โดยเพิ่ม record ใน database เท่านั้น
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <section className="mt-12">
        <h2 className="text-xl font-bold">Roadmap</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {ROADMAP.map((r) => (
            <Card key={r.phase}>
              <CardHeader>
                <CardTitle className="text-base">{r.phase}</CardTitle>
                <CardDescription className="font-medium text-foreground">
                  {r.title}
                </CardDescription>
                <ul className="mt-3 space-y-1 text-sm text-muted-foreground list-disc list-inside">
                  {r.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
