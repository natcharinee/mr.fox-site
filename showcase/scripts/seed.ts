import "dotenv/config";
import { eq } from "drizzle-orm";
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
import { hashPassword } from "../src/lib/password";

type Status = "core" | "optional" | "custom" | "no";
type PtSlug =
  | "creator-specific"
  | "creator-multi-category"
  | "creator-single"
  | "community-specific"
  | "the-company"
  | "company-single"
  | "the-contest"
  | "contest-single"
  | "the-exhibition"
  | "exhibition-single";

const PT_ORDER: PtSlug[] = [
  "creator-specific",
  "creator-multi-category",
  "creator-single",
  "community-specific",
  "the-company",
  "company-single",
  "the-contest",
  "contest-single",
  "the-exhibition",
  "exhibition-single",
];

const CATEGORIES = [
  {
    slug: "creator",
    name: "Creator",
    description: "แพลตฟอร์มสำหรับ Creator Economy — หลายรูปแบบตั้งแต่ Creator คนเดียวถึงหลาย Category",
    sortOrder: 1,
  },
  {
    slug: "community",
    name: "Community",
    description: "ชุมชนที่สมาชิกทุกคนมีส่วนร่วม โพสต์และแลกเปลี่ยนได้",
    sortOrder: 2,
  },
  {
    slug: "company",
    name: "Company",
    description: "แพลตฟอร์มองค์กร บริษัท มหาวิทยาลัย และ Alumni",
    sortOrder: 3,
  },
  {
    slug: "contest",
    name: "Contest",
    description: "แพลตฟอร์มประกวดและโหวต — รองรับทั้งหลายรายการและรายการเดียว",
    sortOrder: 4,
  },
  {
    slug: "exhibition",
    name: "Exhibition",
    description: "นิทรรศการและงานแสดงสินค้า — ขายบัตรและจัดการผู้จัดแสดง",
    sortOrder: 5,
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
    concept: "หลาย Creator, 1 Category, Visitor โพสต์ไม่ได้",
    shortDescription: "แพลตฟอร์ม Creator ใน Category เดียว เช่น FOXY",
    creatorModel: "Creator โพสต์ content, รับ Vote/Gift, เปิด Live และบริการ monetization",
    visitorModel: "Visitor ดู content, โหวต, ส่ง Gift, Subscribe — โพสต์ไม่ได้",
    sortOrder: 1,
  },
  {
    slug: "creator-multi-category",
    categorySlug: "creator",
    name: "Creator Multi Category",
    concept: "หลาย Creator, หลาย Category, Visitor โพสต์ไม่ได้",
    shortDescription: "รวม Creator หลายสาขา เช่น The Expert, The Consult",
    creatorModel: "Creator แยกตาม Category, ตั้งราคาบริการเอง",
    visitorModel: "Visitor เลือกติดตาม Creator ตาม Category ที่สนใจ",
    sortOrder: 2,
  },
  {
    slug: "creator-single",
    categorySlug: "creator",
    name: "Creator Single",
    concept: "Creator คนเดียว — Official Platform",
    shortDescription: "แพลตฟอร์มเฉพาะ Celebrity หรือ Creator รายบุคคล",
    creatorModel: "Creator คนเดียวควบคุมทุก content และ monetization",
    visitorModel: "แฟนคลับสนับสนุนผ่าน Vote, Gift, Subscription",
    sortOrder: 3,
  },
  {
    slug: "community-specific",
    categorySlug: "community",
    name: "Community Specific",
    concept: "สมาชิกทุกคนโพสต์ได้ ไม่แยก Creator/Visitor",
    shortDescription: "ชุมชนออนไลน์ เช่น TOM Thailand, Silom",
    creatorModel: "ทุกสมาชิกเป็น Creator ได้",
    visitorModel: "ทุกคนโพสต์ แสดงความคิดเห็น และมีส่วนร่วม",
    sortOrder: 4,
  },
  {
    slug: "the-company",
    categorySlug: "company",
    name: "The Company / Alumni / Gov",
    concept: "รวมหลายองค์กรในแพลตฟอร์มเดียว",
    shortDescription: "เช่น The Alumni, Local Government",
    creatorModel: "องค์กรและสมาชิกโพสต์ข่าวสาร",
    visitorModel: "สมาชิกและผู้สนใจติดตามข่าวสารองค์กร",
    sortOrder: 5,
  },
  {
    slug: "company-single",
    categorySlug: "company",
    name: "Company Single",
    concept: "องค์กรเดียว",
    shortDescription: "เช่น SRICHA, University Platform",
    creatorModel: "องค์กรเดียวจัดการ content ทั้งหมด",
    visitorModel: "สมาชิกและผู้สนใจในองค์กร",
    sortOrder: 6,
  },
  {
    slug: "the-contest",
    categorySlug: "contest",
    name: "The Contest",
    concept: "รวมหลายรายการประกวด",
    shortDescription: "เช่น Music Contest, Photo Contest",
    creatorModel: "ผู้เข้าประกวด (Contestant) โพสต์ผลงาน",
    visitorModel: "ผู้ชมโหวตและสนับสนุนผู้เข้าประกวด",
    sortOrder: 7,
  },
  {
    slug: "contest-single",
    categorySlug: "contest",
    name: "Contest Single",
    concept: "ประกวดรายการเดียว",
    shortDescription: "เช่น Miss Grand, MUT",
    creatorModel: "ผู้เข้าประกวดโพสต์และแข่งขัน",
    visitorModel: "แฟนคลับโหวตและส่ง Gift",
    sortOrder: 8,
  },
  {
    slug: "the-exhibition",
    categorySlug: "exhibition",
    name: "The Exhibition",
    concept: "รวมนิทรรศการหลายงาน",
    shortDescription: "Exhibition Hub รวมงานแสดงสินค้า",
    creatorModel: "ผู้จัดแสดง (Exhibitor) ลงทะเบียนและจัดบูธ",
    visitorModel: "ผู้ชมซื้อบัตรและเยี่ยมชมงาน",
    sortOrder: 9,
  },
  {
    slug: "exhibition-single",
    categorySlug: "exhibition",
    name: "Exhibition Single",
    concept: "นิทรรศการเฉพาะงาน",
    shortDescription: "เช่น Museum Event, Expo",
    creatorModel: "ผู้จัดงานจัดการ Exhibitor และ content",
    visitorModel: "ผู้ชมซื้อบัตรเข้างาน",
    sortOrder: 10,
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
  { slug: "exhibition", name: "Exhibition", group: "B", description: "จัดการนิทรรศการและบูธ", sortOrder: 22 },
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
  { slug: "organization-directory", name: "Organization Directory", group: "C", description: "ไดเรกทอรีองค์กร", sortOrder: 28 },
  { slug: "download-app-links", name: "Download App Links", group: "C", description: "ลิงก์ดาวน์โหลดแอป", sortOrder: 29 },
];

// Matrix §5: rows = feature slug, cols = PT_ORDER
const FEATURE_MATRIX: Record<string, Status[]> = {
  "public-post": ["core", "core", "core", "core", "core", "core", "core", "core", "core", "core"],
  "photo-album": ["core", "core", "core", "core", "core", "core", "optional", "optional", "core", "core"],
  "video-post": ["core", "core", "core", "core", "core", "core", "optional", "optional", "core", "core"],
  "follow": ["core", "core", "core", "no", "no", "no", "optional", "optional", "no", "no"],
  "like": ["core", "core", "core", "core", "core", "core", "core", "core", "core", "core"],
  "comment": ["core", "core", "core", "core", "core", "core", "core", "core", "optional", "optional"],
  "share": ["core", "core", "core", "core", "core", "core", "core", "core", "core", "core"],
  "ranking": ["core", "core", "optional", "optional", "no", "no", "core", "core", "no", "no"],
  "vote": ["core", "core", "optional", "optional", "no", "no", "core", "core", "no", "no"],
  "gift": ["core", "core", "core", "optional", "optional", "optional", "core", "core", "no", "no"],
  "wallet": ["core", "core", "core", "optional", "optional", "optional", "core", "core", "optional", "optional"],
  "chat": ["core", "core", "core", "optional", "custom", "custom", "optional", "optional", "no", "no"],
  "voice-call": ["core", "core", "core", "no", "no", "no", "no", "no", "no", "no"],
  "video-call": ["core", "core", "core", "no", "no", "no", "no", "no", "no", "no"],
  "live": ["core", "core", "core", "optional", "optional", "optional", "core", "core", "optional", "optional"],
  "live-archive": ["core", "core", "core", "optional", "optional", "optional", "optional", "optional", "optional", "optional"],
  "unlock-photo": ["core", "core", "core", "no", "no", "no", "no", "no", "no", "no"],
  "unlock-video": ["core", "core", "core", "no", "no", "no", "no", "no", "no", "no"],
  "subscription": ["core", "core", "core", "optional", "optional", "optional", "no", "no", "no", "no"],
  "fan-club": ["core", "core", "core", "optional", "no", "no", "optional", "optional", "no", "no"],
  "marketplace": ["optional", "optional", "optional", "core", "optional", "optional", "optional", "optional", "optional", "optional"],
  "event": ["optional", "optional", "optional", "optional", "core", "core", "core", "core", "core", "core"],
  "contest": ["optional", "optional", "optional", "optional", "optional", "optional", "core", "core", "no", "no"],
  "exhibition": ["no", "no", "no", "optional", "optional", "optional", "no", "no", "core", "core"],
  "ticketing": ["no", "no", "no", "optional", "optional", "optional", "optional", "optional", "core", "core"],
  "membership": ["optional", "optional", "optional", "optional", "core", "core", "optional", "optional", "optional", "optional"],
  "organization-directory": ["no", "no", "no", "no", "core", "core", "no", "no", "no", "no"],
  "creator-directory": ["core", "core", "optional", "optional", "no", "no", "core", "core", "optional", "optional"],
  "download-app-links": ["core", "core", "core", "core", "core", "core", "core", "core", "core", "core"],
};

const PERMISSIONS: Record<PtSlug, Record<string, string>> = {
  "creator-specific": { creator_post: "yes", visitor_post: "no", creator_live: "yes", visitor_comment: "yes", visitor_vote: "yes", visitor_gift: "yes" },
  "creator-multi-category": { creator_post: "yes", visitor_post: "no", creator_live: "yes", visitor_comment: "yes", visitor_vote: "yes", visitor_gift: "yes" },
  "creator-single": { creator_post: "yes", visitor_post: "no", creator_live: "yes", visitor_comment: "yes", visitor_vote: "optional", visitor_gift: "yes" },
  "community-specific": { creator_post: "yes", visitor_post: "yes", creator_live: "optional", visitor_comment: "yes", visitor_vote: "optional", visitor_gift: "optional" },
  "the-company": { creator_post: "yes", visitor_post: "yes", creator_live: "optional", visitor_comment: "yes", visitor_vote: "no", visitor_gift: "no" },
  "company-single": { creator_post: "yes", visitor_post: "yes", creator_live: "optional", visitor_comment: "yes", visitor_vote: "no", visitor_gift: "no" },
  "the-contest": { creator_post: "contestant_only", visitor_post: "no", creator_live: "optional", visitor_comment: "yes", visitor_vote: "yes", visitor_gift: "optional" },
  "contest-single": { creator_post: "contestant_only", visitor_post: "no", creator_live: "optional", visitor_comment: "yes", visitor_vote: "yes", visitor_gift: "optional" },
  "the-exhibition": { creator_post: "exhibitor_only", visitor_post: "no", creator_live: "no", visitor_comment: "optional", visitor_vote: "no", visitor_gift: "no" },
  "exhibition-single": { creator_post: "exhibitor_only", visitor_post: "no", creator_live: "no", visitor_comment: "optional", visitor_vote: "no", visitor_gift: "no" },
};

const REVENUE_MATRIX: Record<string, Record<string, string>> = {
  creator: { vote: "yes", gift: "yes", chat: "yes", voice: "yes", video: "yes", subscription: "yes", live: "yes", ticket: "no", marketplace: "optional", membership: "optional" },
  community: { vote: "optional", gift: "optional", chat: "no", voice: "no", video: "no", subscription: "optional", live: "optional", ticket: "optional", marketplace: "yes", membership: "optional" },
  company: { vote: "no", gift: "optional", chat: "no", voice: "no", video: "no", subscription: "optional", live: "optional", ticket: "optional", marketplace: "optional", membership: "yes" },
  contest: { vote: "yes", gift: "optional", chat: "no", voice: "no", video: "no", subscription: "no", live: "optional", ticket: "optional", marketplace: "optional", membership: "optional" },
  exhibition: { vote: "no", gift: "no", chat: "no", voice: "no", video: "no", subscription: "no", live: "optional", ticket: "yes", marketplace: "optional", membership: "optional" },
};

const SAMPLE_APPS = [
  { slug: "foxy", name: "FOXY", platformType: "creator-specific", description: "แพลตฟอร์ม Creator Economy หลักของ Mr.FOX — รองรับ Vote, Gift, Live และ monetization ครบ", targetAudience: "Creator และแฟนคลับ", featured: true },
  { slug: "the-expert", name: "The Expert", platformType: "creator-multi-category", description: "รวมผู้เชี่ยวชาญหลายสาขา — Consult, Coaching, Knowledge sharing", targetAudience: "ผู้เชี่ยวชาญและผู้เรียนรู้", featured: true },
  { slug: "tom-thailand", name: "TOM Thailand", platformType: "community-specific", description: "ชุมชนออนไลน์ที่สมาชิกทุกคนมีส่วนร่วม", targetAudience: "สมาชิกชุมชน", featured: true },
  { slug: "the-alumni", name: "The Alumni", platformType: "the-company", description: "แพลตฟอร์มศิษย์เก่ารวมหลายสถาบัน", targetAudience: "ศิษย์เก่าและองค์กร", featured: false },
  { slug: "miss-grand", name: "Miss Grand", platformType: "contest-single", description: "แพลตฟอร์มประกวดนางงาม — โหวตและสนับสนุนผู้เข้าประกวด", targetAudience: "ผู้เข้าประกวดและแฟนคลับ", featured: true },
  { slug: "exhibition-hub", name: "Exhibition Hub", platformType: "the-exhibition", description: "ศูนย์รวมนิทรรศการและงานแสดงสินค้า", targetAudience: "ผู้จัดงานและผู้ชม", featured: false },
];

async function seed() {
  console.log("🌱 Seeding Mr.FOX Showcase database...");

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
      if (existing) ptMap.set(pt.slug, existing.id);
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

    if (appId) {
      await db.insert(downloadLinks).values([
        { applicationId: appId, type: "ios", url: `https://apps.apple.com/app/${app.slug}` },
        { applicationId: appId, type: "android", url: `https://play.google.com/store/apps/details?id=com.mrfox.${app.slug}` },
        { applicationId: appId, type: "apk", url: `https://download.mrfox.app/${app.slug}.apk` },
      ]).onConflictDoNothing();
    }
  }

  await db.insert(news).values([
    {
      slug: "mrfox-ecosystem-launch",
      title: "Mr.FOX เปิดตัว Ecosystem แพลตฟอร์ม Creator Economy",
      excerpt: "รวม 10 Platform Types ครอบคลุม Creator, Community, Company, Contest และ Exhibition",
      content: "Mr.FOX ประกาศเปิดตัว ecosystem แพลตฟอร์มครบวงจรสำหรับ Creator Economy รองรับ monetization ผ่าน Vote, Gift, Live, Subscription และอีกมากมาย",
      publishedAt: new Date("2026-01-15"),
    },
    {
      slug: "foxy-app-update",
      title: "FOXY App อัปเดตฟีเจอร์ Live และ Gift ใหม่",
      excerpt: "เพิ่ม Animated Gift และปรับปรุงประสบการณ์ Live streaming",
      content: "FOXY เปิดตัว Animated Gift ชุดใหม่พร้อมปรับปรุง Live room ให้รองรับผู้ชมได้มากขึ้น",
      publishedAt: new Date("2026-02-01"),
    },
    {
      slug: "creator-platform-engine",
      title: "Creator Platform Engine — Template มาตรฐานสำหรับทุกแอป",
      excerpt: "Engine ใหม่ช่วยเปิดแอป Creator Platform ได้เร็วขึ้น",
      content: "Mr.FOX พัฒนา Creator Platform Engine เป็น template มาตรฐาน รองรับ Wallet, Vote, Gift, Chat, Live และ Video Call",
      publishedAt: new Date("2026-03-01"),
    },
  ]).onConflictDoNothing();

  await db.insert(banners).values({
    title: "Mr.FOX Ecosystem",
    subtitle: "Creator Economy · Community · Contest · Exhibition",
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

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
