import "dotenv/config";
import { and, eq, inArray, isNull, notInArray, or, sql } from "drizzle-orm";
import { db } from "../src/db/index";
import {
  applications,
  banners,
  categoryRevenue,
  downloadLinks,
  features,
  news,
  platformCategories,
  platformTypeFeatures,
  platformTypePermissions,
  platformTypes,
  users,
} from "../src/db/schema";

const MRFOX_APP_DOWNLOAD_URL = "https://link.mrfox.app/";
const GOOGLE_PLAY_URL =
  "https://play.google.com/store/apps/details?id=com.mrfox.app";

/** Apps shown in homepage Featured Applications (synced on every seed/deploy). */
const HOMEPAGE_FEATURED_SLUGS = [
  "foxy",
  "cosplay-plus",
  "nak-sueksa",
  "cupe",
] as const;
import { hashPassword } from "../src/lib/password";
import { EXCLUDED_NEWS_SLUGS } from "../src/lib/excluded-news-slugs";

type Status = "core" | "optional" | "custom" | "no";
type PtSlug = "creator-specific" | "community-specific" | "the-contest";

const PT_ORDER: PtSlug[] = ["creator-specific", "community-specific", "the-contest"];

const REMOVED_PT_SLUGS = [
  "the-company",
  "company-single",
  "the-exhibition",
  "exhibition-single",
  "creator-single",
  "creator-multi-category",
  "contest-single",
] as const;

const PLATFORM_TYPE_MIGRATIONS: Record<string, PtSlug> = {
  "creator-single": "creator-specific",
  "creator-multi-category": "creator-specific",
  "contest-single": "the-contest",
};

const REMOVED_CAT_SLUGS = ["company", "exhibition"] as const;

const REMOVED_APP_SLUGS = [
  "the-alumni",
  "exhibition-hub",
  "the-expert",
  "tom-thailand",
  "miss-grand",
] as const;

const REMOVED_FEATURE_SLUGS = ["exhibition", "organization-directory"] as const;

const CATEGORIES = [
  {
    slug: "creator",
    name: "Creator",
    description: "ไซต์ Creator 18+ — หลายรูปแบบตั้งแต่ Creator คนเดียวถึงหลาย Category",
    sortOrder: 1,
  },
  {
    slug: "community",
    name: "Community",
    description: "ชุมชนที่สมาชิกทุกคนมีส่วนร่วม โพสต์และแลกเปลี่ยนได้",
    sortOrder: 2,
  },
  {
    slug: "contest",
    name: "Contest",
    description: "แพลตฟอร์มประกวดและโหวต — รองรับหลายรายการประกวด",
    sortOrder: 3,
  },
] as const;

const PLATFORM_TYPES: {
  slug: PtSlug;
  categorySlug: string;
  name: string;
  concept: string;
  shortDescription: string;
  creatorModel: string;
  visitorModel: string;
  sortOrder: number;
}[] = [
  {
    slug: "creator-specific",
    categorySlug: "creator",
    name: "Creator Specific",
    concept: "แพลตฟอร์มที่ออกแบบมาเพื่อครีเอเตอร์แต่ละกลุ่มโดยเฉพาะ",
    shortDescription:
      "แพลตฟอร์มที่ออกแบบมาเพื่อครีเอเตอร์แต่ละกลุ่มโดยเฉพาะ — ปรับประสบการณ์ให้เหมาะกับแต่ละคอมมูนิตี้",
    creatorModel: "Creator โพสต์ content, รับ Vote/Gift, เปิด Live และบริการ monetization",
    visitorModel: "Visitor ดู content, โหวต, ส่ง Gift, Subscribe — โพสต์ไม่ได้",
    sortOrder: 1,
  },
  {
    slug: "community-specific",
    categorySlug: "community",
    name: "Community",
    concept: "เมื่อทุกคนสามารถเป็นผู้สร้างคุณค่าให้กับชุมชน",
    shortDescription:
      "เมื่อทุกคนสามารถเป็นผู้สร้างคุณค่าให้กับชุมชน — สร้างสังคมออนไลน์ที่ทุกคนมีส่วนร่วม",
    creatorModel: "ทุกสมาชิกเป็น Creator ได้",
    visitorModel: "ทุกคนโพสต์ แสดงความคิดเห็น และมีส่วนร่วม",
    sortOrder: 2,
  },
  {
    slug: "the-contest",
    categorySlug: "contest",
    name: "The Contest",
    concept: "แพลตฟอร์มสำหรับการแข่งขันที่ออกแบบมาเพื่อครีเอเตอร์โดยเฉพาะ",
    shortDescription:
      "แพลตฟอร์มสำหรับการแข่งขันที่ออกแบบมาเพื่อครีเอเตอร์โดยเฉพาะ — ครบวงจรตั้งแต่สมัครถึงโหวตและถ่ายทอดสด",
    creatorModel: "ผู้เข้าประกวด (Contestant) โพสต์ผลงาน",
    visitorModel: "ผู้ชมโหวตและสนับสนุนผู้เข้าประกวด",
    sortOrder: 3,
  },
];

const FEATURES_LIST: {
  slug: string;
  name: string;
  group: "A" | "B" | "C";
  description: string;
  workflow?: string;
  revenueModel?: string;
  sortOrder: number;
}[] = [
  { slug: "public-post", name: "Public Post", group: "A", description: "โพสต์ content สาธารณะ", sortOrder: 1 },
  { slug: "photo-album", name: "Photo Album", group: "A", description: "อัลบั้มรูปภาพ", sortOrder: 2 },
  { slug: "video-post", name: "Video Post", group: "A", description: "โพสต์วิดีโอ", sortOrder: 3 },
  { slug: "follow", name: "Follow Creator", group: "A", description: "ติดตาม Creator", sortOrder: 4 },
  { slug: "like", name: "Like", group: "A", description: "กดถูกใจ", sortOrder: 5 },
  { slug: "comment", name: "Comment", group: "A", description: "แสดงความคิดเห็น", sortOrder: 6 },
  { slug: "share", name: "Share", group: "A", description: "แชร์ content", sortOrder: 7 },
  {
    slug: "vote",
    name: "Vote",
    group: "B",
    description: "โหวตสนับสนุน Creator ด้วยเงิน",
    workflow: "Creator เปิดรับ vote → Visitor จ่ายเงินโหวต → คะแนนสะสมใน Ranking",
    revenueModel: "10/20/50/100 บาท ต่อโหวต",
    sortOrder: 8,
  },
  {
    slug: "gift",
    name: "Gift",
    group: "B",
    description: "ส่ง Sticker Gift ให้ Creator",
    workflow: "Visitor เลือก Sticker → จ่ายจาก Wallet → Creator ได้รับ Gift",
    revenueModel: "ราคาตาม Sticker",
    sortOrder: 9,
  },
  {
    slug: "chat",
    name: "Chat",
    group: "B",
    description: "แชทกับ Creator แบบจ่ายต่อข้อความ",
    workflow: "Creator ตั้งราคา → Visitor จ่ายก่อนส่ง → ข้อความส่งถึง Creator",
    revenueModel: "ต่อข้อความ",
    sortOrder: 10,
  },
  {
    slug: "voice-call",
    name: "Voice Call",
    group: "B",
    description: "คุยเสียงกับ Creator แบบจ่ายต่อนาที",
    workflow: "Visitor ซื้อเวลา → เริ่ม Voice Call 1:1",
    revenueModel: "ต่อนาที",
    sortOrder: 11,
  },
  {
    slug: "video-call",
    name: "Video Call",
    group: "B",
    description: "วิดีโอคอลกับ Creator แบบจ่ายต่อนาที",
    workflow: "Visitor ซื้อเวลา → Video Call + ส่ง Gift ระหว่างคุยได้",
    revenueModel: "ต่อนาที + Gift",
    sortOrder: 12,
  },
  {
    slug: "live",
    name: "Live",
    group: "B",
    description: "ถ่ายทอดสด — Free / Paid / Password",
    workflow: "Creator เปิดห้อง Live → Visitor เข้าชม แสดงความคิดเห็น ส่ง Gift",
    revenueModel: "ค่าเข้า + Gift",
    sortOrder: 13,
  },
  {
    slug: "live-archive",
    name: "Live Archive",
    group: "B",
    description: "ขายวิดีโอ Live ย้อนหลัง",
    workflow: "Creator บันทึก Live → ตั้งราคา → Visitor ซื้อเพื่อดู",
    revenueModel: "ต่อคลิป",
    sortOrder: 14,
  },
  {
    slug: "unlock-photo",
    name: "Unlock Photo",
    group: "B",
    description: "ภาพ Blur จ่ายเพื่อปลดล็อก",
    workflow: "Creator อัปโหลดภาพ Blur → Visitor จ่ายเพื่อดูเต็ม",
    revenueModel: "ต่อชิ้น",
    sortOrder: 15,
  },
  {
    slug: "unlock-video",
    name: "Unlock Video",
    group: "B",
    description: "วิดีโอ Preview จ่ายเพื่อดูเต็ม",
    workflow: "Creator อัปโหลด Preview → Visitor จ่ายเพื่อดูเต็ม",
    revenueModel: "ต่อคลิป",
    sortOrder: 16,
  },
  {
    slug: "subscription",
    name: "Subscription",
    group: "B",
    description: "Premium Feed รายเดือน",
    workflow: "Creator สร้าง Premium content → Visitor subscribe",
    revenueModel: "รายเดือน/ไตรมาส/ปี",
    sortOrder: 17,
  },
  {
    slug: "fan-club",
    name: "Fan Club",
    group: "B",
    description: "สมาชิกแฟนคลับหลายระดับ",
    workflow: "Visitor เข้าร่วม Fan Club → ได้ Badge และสิทธิพิเศษ",
    sortOrder: 18,
  },
  {
    slug: "marketplace",
    name: "Marketplace",
    group: "B",
    description: "ซื้อขายสินค้าในชุมชน",
    revenueModel: "คอมมิชชัน",
    sortOrder: 19,
  },
  { slug: "event", name: "Event", group: "B", description: "จัดการงานอีเวนต์", sortOrder: 20 },
  { slug: "contest", name: "Contest", group: "B", description: "ระบบประกวดและจัดอันดับ", sortOrder: 21 },
  {
    slug: "ticketing",
    name: "Ticketing",
    group: "B",
    description: "ขายบัตรเข้างาน",
    revenueModel: "ต่อใบ",
    sortOrder: 23,
  },
  {
    slug: "membership",
    name: "Membership",
    group: "B",
    description: "สมาชิกองค์กร",
    revenueModel: "รายปี/รายเดือน",
    sortOrder: 24,
  },
  { slug: "ranking", name: "Ranking", group: "B", description: "อันดับ Creator ตาม Vote/Gift", sortOrder: 25 },
  { slug: "wallet", name: "Wallet", group: "C", description: "กระเป๋าเงินในแอป", sortOrder: 26 },
  { slug: "creator-directory", name: "Creator Directory", group: "C", description: "ไดเรกทอรี Creator", sortOrder: 27 },
  { slug: "download-app-links", name: "Download App Links", group: "C", description: "ลิงก์ดาวน์โหลดแอป", sortOrder: 29 },
];

// Matrix §5: rows = feature slug, cols = PT_ORDER
const FEATURE_MATRIX: Record<string, Status[]> = {
  "public-post": ["core", "core", "core"],
  "photo-album": ["core", "core", "optional"],
  "video-post": ["core", "core", "optional"],
  "follow": ["core", "no", "optional"],
  "like": ["core", "core", "core"],
  "comment": ["core", "core", "core"],
  "share": ["core", "core", "core"],
  "ranking": ["core", "optional", "core"],
  "vote": ["core", "optional", "core"],
  "gift": ["core", "optional", "core"],
  "wallet": ["core", "optional", "core"],
  "chat": ["core", "optional", "optional"],
  "voice-call": ["core", "no", "no"],
  "video-call": ["core", "no", "no"],
  "live": ["core", "optional", "core"],
  "live-archive": ["core", "optional", "optional"],
  "unlock-photo": ["core", "no", "no"],
  "unlock-video": ["core", "no", "no"],
  "subscription": ["core", "optional", "no"],
  "fan-club": ["core", "optional", "optional"],
  "marketplace": ["optional", "core", "optional"],
  "event": ["optional", "optional", "core"],
  "contest": ["optional", "optional", "core"],
  "ticketing": ["no", "optional", "optional"],
  "membership": ["optional", "optional", "optional"],
  "creator-directory": ["core", "optional", "core"],
  "download-app-links": ["core", "core", "core"],
};

const PERMISSIONS: Record<PtSlug, Record<string, string>> = {
  "creator-specific": { creator_post: "yes", visitor_post: "no", creator_live: "yes", visitor_comment: "yes", visitor_vote: "yes", visitor_gift: "yes" },
  "community-specific": { creator_post: "yes", visitor_post: "yes", creator_live: "optional", visitor_comment: "yes", visitor_vote: "optional", visitor_gift: "optional" },
  "the-contest": { creator_post: "contestant_only", visitor_post: "no", creator_live: "optional", visitor_comment: "yes", visitor_vote: "yes", visitor_gift: "optional" },
};

const REVENUE_MATRIX: Record<string, Record<string, string>> = {
  creator: { vote: "yes", gift: "yes", chat: "yes", voice: "yes", video: "yes", subscription: "yes", live: "yes", ticket: "no", marketplace: "optional", membership: "optional" },
  community: { vote: "optional", gift: "optional", chat: "no", voice: "no", video: "no", subscription: "optional", live: "optional", ticket: "optional", marketplace: "yes", membership: "optional" },
  contest: { vote: "yes", gift: "optional", chat: "no", voice: "no", video: "no", subscription: "no", live: "optional", ticket: "optional", marketplace: "optional", membership: "optional" },
};

const SAMPLE_APPS = [
  {
    slug: "foxy",
    name: "FOXY",
    platformType: "creator-specific",
    description: "ไซต์ Creator 18+ หลักของ Mr.FOX — รองรับ Vote, Gift, Live และ monetization ครบ",
    targetAudience: "Creator และแฟนคลับ",
    featured: true,
    logoUrl: "/brand/mrfox-icon.png",
    posterUrl: "/apps/posters/foxy.png",
  },
  {
    slug: "cupe",
    name: "CupE",
    platformType: "creator-specific",
    description: "ไซต์ Creator 18+ สำหรับคอนเทนต์ Cup E — โหวต ส่งของขวัญ และ Live",
    targetAudience: "Creator และแฟนคลับ",
    featured: true,
    logoUrl: "/brand/mrfox-icon.png",
    posterUrl: "/apps/posters/cupe.png",
  },
  {
    slug: "cliq",
    name: "CLIQ",
    platformType: "creator-specific",
    description: "ไซต์ Creator 18+ แบบ CLIQ — เชื่อมต่อ Creator กับแฟนคลับอย่างใกล้ชิด",
    targetAudience: "Creator และแฟนคลับ",
    featured: false,
    logoUrl: "/brand/mrfox-icon.png",
    posterUrl: "/apps/posters/cliq.png",
  },
  {
    slug: "himbo",
    name: "Himbo",
    platformType: "creator-specific",
    description: "ไซต์ Creator 18+ สำหรับ Himbo — Vote, Gift และ Live",
    targetAudience: "Creator และแฟนคลับ",
    featured: false,
    logoUrl: "/brand/mrfox-icon.png",
    posterUrl: "/apps/posters/himbo.png",
  },
  {
    slug: "lesbie",
    name: "Lesbie",
    platformType: "creator-specific",
    description: "ไซต์ Creator 18+ สำหรับ Lesbian community — สนับสนุน Creator ด้วย Vote และ Gift",
    targetAudience: "Creator และแฟนคลับ",
    featured: false,
    logoUrl: "/brand/mrfox-icon.png",
    posterUrl: "/apps/posters/lesbie.png",
  },
  {
    slug: "tomboi",
    name: "Tomboi",
    platformType: "creator-specific",
    description: "ไซต์ Creator 18+ สำหรับ Tom community — โปรไฟล์เดี่ยวและ monetization ครบ",
    targetAudience: "Creator และแฟนคลับ",
    featured: false,
    logoUrl: "/brand/mrfox-icon.png",
    posterUrl: "/apps/posters/tomboi.png",
  },
  {
    slug: "bargirl",
    name: "BarGirl",
    platformType: "creator-specific",
    description: "ไซต์ Creator 18+ สำหรับ Bar Girl / entertainer — Vote, Gift และ Live",
    targetAudience: "Creator และแฟนคลับ",
    featured: false,
    logoUrl: "/brand/mrfox-icon.png",
    posterUrl: "/apps/posters/bargirl.png",
  },
  {
    slug: "silom",
    name: "Silom",
    platformType: "community-specific",
    description: "ชุมชน Silom 18+ — สมาชิกทุกคนมีส่วนร่วม โพสต์และแลกเปลี่ยนได้",
    targetAudience: "สมาชิกชุมชน",
    featured: false,
    logoUrl: "/brand/mrfox-icon.png",
    posterUrl: "/apps/posters/silom.png",
  },
  {
    slug: "cosplay-plus",
    name: "Cosplay Plus",
    platformType: "creator-specific",
    description: "ศูนย์รวม Creator Cosplay หลายสไตล์ — หลายหมวดหมู่ในไซต์เดียว",
    targetAudience: "Creator Cosplay และแฟนคลับ",
    featured: true,
    logoUrl: "/brand/mrfox-icon.png",
    posterUrl: "/apps/posters/cosplay-plus.png",
  },
  {
    slug: "expat-idols",
    name: "Expat Idols",
    platformType: "creator-specific",
    description: "ไซต์ Creator 18+ สำหรับ Expat Idols — โหวต ส่งของขวัญ และ Live",
    targetAudience: "Creator และแฟนคลับ",
    featured: false,
    logoUrl: "/brand/mrfox-icon.png",
    posterUrl: "/apps/posters/expat-idols.png",
  },
  {
    slug: "beauty-queen",
    name: "Beauty Queen",
    platformType: "the-contest",
    description: "แพลตฟอร์มประกวด Beauty Queen — โหวตและสนับสนุนผู้เข้าประกวด",
    targetAudience: "ผู้เข้าประกวดและแฟนคลับ",
    featured: false,
    logoUrl: "/brand/mrfox-icon.png",
    posterUrl: "/apps/posters/beauty-queen.png",
  },
  {
    slug: "nak-sueksa",
    name: "นักศึกษา",
    platformType: "community-specific",
    description: "ชุมชนนักศึกษา 18+ — สมาชิกมีส่วนร่วม โพสต์และแลกเปลี่ยนไอเดีย",
    targetAudience: "นักศึกษาและสมาชิกชุมชน",
    featured: true,
    logoUrl: "/brand/mrfox-icon.png",
    posterUrl: "/apps/posters/nak-sueksa.png",
  },
];

async function migrateDeprecatedPlatformTypes() {
  for (const [fromSlug, toSlug] of Object.entries(PLATFORM_TYPE_MIGRATIONS)) {
    const [fromPt] = await db
      .select({ id: platformTypes.id })
      .from(platformTypes)
      .where(eq(platformTypes.slug, fromSlug))
      .limit(1);
    const [toPt] = await db
      .select({ id: platformTypes.id })
      .from(platformTypes)
      .where(eq(platformTypes.slug, toSlug))
      .limit(1);
    if (fromPt && toPt) {
      await db
        .update(applications)
        .set({ platformTypeId: toPt.id })
        .where(eq(applications.platformTypeId, fromPt.id));
    }
  }
}

async function purgeExcludedNews() {
  await db.delete(news).where(inArray(news.slug, [...EXCLUDED_NEWS_SLUGS]));
}

async function purgeRemovedEcosystem() {
  await migrateDeprecatedPlatformTypes();

  for (const slug of REMOVED_APP_SLUGS) {
    const [app] = await db
      .select({ id: applications.id })
      .from(applications)
      .where(eq(applications.slug, slug))
      .limit(1);
    if (app) {
      await db.delete(downloadLinks).where(eq(downloadLinks.applicationId, app.id));
      await db.delete(applications).where(eq(applications.id, app.id));
    }
  }

  const removedPts = await db
    .select({ id: platformTypes.id })
    .from(platformTypes)
    .where(notInArray(platformTypes.slug, [...PT_ORDER]));
  const removedPtIds = removedPts.map((row) => row.id);
  if (removedPtIds.length > 0) {
    await db.delete(applications).where(inArray(applications.platformTypeId, removedPtIds));
    await db
      .delete(platformTypeFeatures)
      .where(inArray(platformTypeFeatures.platformTypeId, removedPtIds));
    await db
      .delete(platformTypePermissions)
      .where(inArray(platformTypePermissions.platformTypeId, removedPtIds));
    await db.delete(platformTypes).where(inArray(platformTypes.id, removedPtIds));
  }

  const removedCats = await db
    .select({ id: platformCategories.id })
    .from(platformCategories)
    .where(inArray(platformCategories.slug, [...REMOVED_CAT_SLUGS]));
  const removedCatIds = removedCats.map((row) => row.id);
  if (removedCatIds.length > 0) {
    await db.delete(categoryRevenue).where(inArray(categoryRevenue.categoryId, removedCatIds));
    await db.delete(platformCategories).where(inArray(platformCategories.id, removedCatIds));
  }

  const removedFeatures = await db
    .select({ id: features.id })
    .from(features)
    .where(inArray(features.slug, [...REMOVED_FEATURE_SLUGS]));
  const removedFeatureIds = removedFeatures.map((row) => row.id);
  if (removedFeatureIds.length > 0) {
    await db
      .delete(platformTypeFeatures)
      .where(inArray(platformTypeFeatures.featureId, removedFeatureIds));
    await db.delete(features).where(inArray(features.id, removedFeatureIds));
  }

  await db.delete(platformTypeFeatures);
}

async function seed() {
  console.log("🌱 Seeding Mr.FOX Showcase database...");

  await purgeRemovedEcosystem();
  await purgeExcludedNews();
  await db.execute(sql`
    DELETE FROM download_links a
    USING download_links b
    WHERE a.application_id = b.application_id
      AND a.type = b.type
      AND a.id > b.id
  `);

  const categoryMap = new Map<string, number>();
  for (const cat of CATEGORIES) {
    const [row] = await db
      .insert(platformCategories)
      .values(cat)
      .onConflictDoNothing()
      .returning();
    if (row) categoryMap.set(cat.slug, row.id);
    else {
      const [existing] = await db
        .select()
        .from(platformCategories)
        .where(eq(platformCategories.slug, cat.slug))
        .limit(1);
      if (existing) categoryMap.set(cat.slug, existing.id);
    }
  }

  const ptMap = new Map<PtSlug, number>();
  for (const pt of PLATFORM_TYPES) {
    const categoryId = categoryMap.get(pt.categorySlug)!;
    const [row] = await db
      .insert(platformTypes)
      .values({ ...pt, categoryId })
      .onConflictDoNothing()
      .returning();
    if (row) ptMap.set(pt.slug, row.id);
    else {
      const [existing] = await db
        .select()
        .from(platformTypes)
        .where(eq(platformTypes.slug, pt.slug))
        .limit(1);
      if (existing) {
        ptMap.set(pt.slug, existing.id);
        await db
          .update(platformTypes)
          .set({
            name: pt.name,
            concept: pt.concept,
            shortDescription: pt.shortDescription,
            creatorModel: pt.creatorModel,
            visitorModel: pt.visitorModel,
            sortOrder: pt.sortOrder,
            categoryId,
          })
          .where(eq(platformTypes.id, existing.id));
      }
    }
  }

  const featureMap = new Map<string, number>();
  for (const f of FEATURES_LIST) {
    const [row] = await db
      .insert(features)
      .values(f)
      .onConflictDoNothing()
      .returning();
    if (row) featureMap.set(f.slug, row.id);
    else {
      const [existing] = await db
        .select()
        .from(features)
        .where(eq(features.slug, f.slug))
        .limit(1);
      if (existing) featureMap.set(f.slug, existing.id);
    }
  }

  for (const [featureSlug, statuses] of Object.entries(FEATURE_MATRIX)) {
    const featureId = featureMap.get(featureSlug)!;
    for (let i = 0; i < statuses.length; i++) {
      const platformTypeId = ptMap.get(PT_ORDER[i])!;
      await db
        .insert(platformTypeFeatures)
        .values({ platformTypeId, featureId, status: statuses[i] })
        .onConflictDoNothing();
    }
  }

  for (const [ptSlug, perms] of Object.entries(PERMISSIONS)) {
    const platformTypeId = ptMap.get(ptSlug as PtSlug)!;
    for (const [key, value] of Object.entries(perms)) {
      await db
        .insert(platformTypePermissions)
        .values({ platformTypeId, key, value })
        .onConflictDoNothing();
    }
  }

  for (const [catSlug, revenues] of Object.entries(REVENUE_MATRIX)) {
    const categoryId = categoryMap.get(catSlug)!;
    for (const [revenueFeature, value] of Object.entries(revenues)) {
      await db
        .insert(categoryRevenue)
        .values({ categoryId, revenueFeature, value })
        .onConflictDoNothing();
    }
  }

  for (const app of SAMPLE_APPS) {
    const platformTypeId = ptMap.get(app.platformType as PtSlug)!;
    const [row] = await db
      .insert(applications)
      .values({
        name: app.name,
        slug: app.slug,
        platformTypeId,
        description: app.description,
        targetAudience: app.targetAudience,
        featured: app.featured,
        published: true,
        logoUrl: app.logoUrl,
        posterUrl: app.posterUrl,
      })
      .onConflictDoNothing()
      .returning();

    const [existingApp] = row
      ? [row]
      : await db
          .select()
          .from(applications)
          .where(eq(applications.slug, app.slug))
          .limit(1);
    const appId = existingApp?.id;

    if (appId && app.posterUrl) {
      await db
        .update(applications)
        .set({ posterUrl: app.posterUrl })
        .where(
          and(
            eq(applications.id, appId),
            or(isNull(applications.posterUrl), eq(applications.posterUrl, "")),
          ),
        );
    }

    if (appId) {
      await db
        .update(applications)
        .set({ featured: app.featured })
        .where(eq(applications.id, appId));

      const existingLinks = await db
        .select({ id: downloadLinks.id })
        .from(downloadLinks)
        .where(eq(downloadLinks.applicationId, appId))
        .limit(1);

      if (existingLinks.length === 0) {
        await db.insert(downloadLinks).values([
          { applicationId: appId, type: "ios", url: MRFOX_APP_DOWNLOAD_URL },
          { applicationId: appId, type: "android", url: GOOGLE_PLAY_URL },
          { applicationId: appId, type: "apk", url: `https://download.mrfox.app/${app.slug}.apk` },
        ]);
      }
    }
  }

  for (let i = 0; i < HOMEPAGE_FEATURED_SLUGS.length; i++) {
    const slug = HOMEPAGE_FEATURED_SLUGS[i]!;
    await db
      .update(applications)
      .set({ featured: true, sortOrder: i + 1 })
      .where(eq(applications.slug, slug));
  }

  await db
    .update(downloadLinks)
    .set({ url: MRFOX_APP_DOWNLOAD_URL })
    .where(eq(downloadLinks.type, "ios"));

  await db
    .update(downloadLinks)
    .set({ url: GOOGLE_PLAY_URL })
    .where(eq(downloadLinks.type, "android"));

  // News is imported from info.mrfox.com via `npm run news:import` or Admin → Sync ข่าว.

  await db.insert(banners).values({
    title: "Mr.FOX",
    subtitle: "18+ Creator Platform · Community · Contest",
    active: true,
    sortOrder: 1,
  }).onConflictDoNothing();

  const adminHash = await hashPassword("admin123");
  await db.insert(users).values({
    email: "admin@mrfox.app",
    name: "Admin",
    role: "admin",
    passwordHash: adminHash,
  }).onConflictDoNothing();

  await db.insert(users).values({
    email: "editor@mrfox.app",
    name: "Editor",
    role: "editor",
    passwordHash: await hashPassword("editor123"),
  }).onConflictDoNothing();

  console.log("✅ Seed complete");
  console.log("   Admin: admin@mrfox.app / admin123");
  console.log("   Editor: editor@mrfox.app / editor123");
  process.exit(0);
}

seed().catch((err: unknown) => {
  console.error("❌ Seed failed:");
  if (err instanceof Error) {
    console.error(err.message);
    if ("code" in err) console.error("code:", (err as { code?: string }).code);
  } else {
    console.error(err);
  }
  process.exit(1);
});
