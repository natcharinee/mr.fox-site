# Mr.FOX Website — Master Specification

> **เอกสารฉบับรวม** — รวมจาก `context.md` + `sitemap.md` + `Creator Platform Matrix.xlsx`
> เกลาให้สอดคล้องกัน แก้จุดที่ขัดแย้ง และจัดโครงสร้างให้พร้อมใช้เป็น spec สำหรับ dev / Claude Code / Cursor
>
> Version: 2.0 (Consolidated) · Stack เป้าหมาย: Next.js · Tailwind · shadcn/ui · Supabase · Drizzle ORM

---

## 1. Project Overview

Mr.FOX เป็นบริษัทที่พัฒนา Platform และ Mobile Applications หลายประเภท เพื่อสร้าง Ecosystem ครอบคลุม Creator Economy, Community, Organization, Contest และ Exhibition

เว็บไซต์นี้ **ไม่ใช่ Corporate Website ทั่วไป** แต่เป็น **Platform Showcase + Application Directory + Feature Library + Download Hub** รวมในตัวเดียว

**สิ่งที่ผู้เข้าชมต้องเข้าใจภายใน 2–3 นาที**

1. Mr.FOX คืออะไร
2. มี Platform กี่ประเภท แต่ละประเภทต่างกันอย่างไร
3. มี Application อะไรบ้างใน Ecosystem
4. แต่ละ Feature ทำงานอย่างไร
5. ดาวน์โหลดแอปได้จากที่ไหน (ภายใน ≤ 3 คลิกจากหน้าแรก)

### Core Architecture Principle

```
Mr.FOX
  → Platform Category (5 กลุ่มใหญ่)
      → Platform Type (10 ประเภท)
          → Applications (ไม่จำกัดจำนวน)
              → Features (ใช้ร่วมกันทั้ง Ecosystem)
                  → Download
```

**หลักการสำคัญ:** ทุกอย่างเป็น **data-driven** ทั้งหมด การเพิ่มแอปจาก 10 → 100+ ตัว = เพิ่ม record ใน database เท่านั้น **ห้ามแก้โครงสร้างเว็บ** ตัว Matrix (ส่วนที่ 5–7) คือ config schema ของระบบ ไม่ใช่แค่เอกสารประกอบ

---

## 2. Platform Taxonomy

แบ่งเป็น **2 ชั้น**: 5 Category ใหญ่ → 10 Platform Type ย่อย

| # | Platform Type | Category | นิยามสั้น | ตัวอย่าง |
|---|---|---|---|---|
| 1 | Creator Specific | Creator | หลาย Creator, 1 Category, Visitor โพสต์ไม่ได้ | FOXY |
| 2 | Creator Multi Category | Creator | หลาย Creator, หลาย Category, Visitor โพสต์ไม่ได้ | The Expert, The Consult |
| 3 | Creator Single | Creator | Creator คนเดียว | Lisa Official, Celebrity Platform |
| 4 | Community Specific | Community | สมาชิกทุกคนโพสต์ได้ ไม่แยก Creator/Visitor | TOM Thailand, Silom |
| 5 | The Company / Alumni / Gov | Company | รวมหลายองค์กร | The Alumni, Local Government |
| 6 | Company Single | Company | องค์กรเดียว | SRICHA, University Platform |
| 7 | The Contest | Contest | รวมหลายรายการประกวด | Music Contest, Photo Contest |
| 8 | Contest Single | Contest | ประกวดรายการเดียว | Miss Grand, MUT |
| 9 | The Exhibition | Exhibition | รวมนิทรรศการหลายงาน | Exhibition Hub |
| 10 | Exhibition Single | Exhibition | นิทรรศการเฉพาะงาน | Museum Event, Expo |

---

## 3. Feature Library

จัดกลุ่มใหม่ให้ชัด (เดิมใน context/sitemap ปนกันระหว่าง feature พื้นฐานกับ feature ที่ขายได้)

**Group A — Engagement Basics** (ทุก platform มีเหมือนกัน ไม่ต้องโชว์เป็นการ์ดใน /features)
Public Post · Photo Album · Video Post · Like · Comment · Share · Follow

**Group B — Showcase Features** (ตัวที่แสดงใน Feature Library `/features` และมี Detail page)
Vote · Gift · Chat · Voice Call · Video Call · Live · Live Archive · Unlock Photo · Unlock Video · Subscription · Fan Club · Marketplace · Event · Contest · Exhibition · Ticketing · Membership · Ranking

**Group C — System Features** (เบื้องหลัง)
Wallet · Creator Directory · Organization Directory · Download App Links

### นิยาม Feature ที่มี Revenue

| Feature | การทำงาน | Revenue Model |
|---|---|---|
| **Vote** | Creator ใช้ Post รับ vote, Visitor จ่ายเงินเพื่อโหวต | 10/20/50/100 บาท ต่อโหวต |
| **Gift** | Visitor ส่ง Sticker ให้ Creator | ราคาตาม Sticker |
| **Chat** | Creator ตั้งราคาต่อข้อความ | ต่อข้อความ |
| **Voice Call** | Creator ตั้งราคาต่อนาที | ต่อนาที |
| **Video Call** | Creator ตั้งราคาต่อนาที + ส่ง Gift ระหว่างคุยได้ | ต่อนาที + Gift |
| **Live** | ห้อง Live: Free / Paid / Password / Paid+Password | ค่าเข้า + Gift |
| **Live Archive** | ขาย video live ย้อนหลัง | ต่อคลิป |
| **Unlock Photo/Video** | แสดง Blur, จ่ายเพื่อปลดล็อก | ต่อชิ้น |
| **Subscription** | Premium Feed รายเดือน | รายเดือน |
| **Ticketing** | บัตรเข้างาน Exhibition | ต่อใบ |
| **Membership** | สมาชิกองค์กร | รายปี/รายเดือน |
| **Marketplace** | ซื้อขายสินค้า | คอมมิชชัน |

---

## 4. Status Legend (ใช้ในทุก Matrix)

| Status | ความหมาย |
|---|---|
| **CORE** | เปิดใช้ default ทุกแอปในประเภทนี้ |
| **OPTIONAL** | เปิด/ปิดได้ตามแอป (toggle ใน CMS) |
| **CUSTOM** | ต้องตั้งค่าเฉพาะองค์กร ไม่เปิดอัตโนมัติ ต้องคุย config ก่อน |
| **NO** | ไม่รองรับในประเภทนี้ |

---

## 5. Features Matrix (Feature × Platform Type)

> คอลัมน์ย่อ: CrSpec=Creator Specific · CrMulti=Creator Multi · CrSingle=Creator Single · Comm=Community · Co=The Company · CoSingle=Company Single · Cont=The Contest · ContS=Contest Single · Exh=The Exhibition · ExhS=Exhibition Single

| Feature | CrSpec | CrMulti | CrSingle | Comm | Co | CoSingle | Cont | ContS | Exh | ExhS |
|---|---|---|---|---|---|---|---|---|---|---|
| Public Post | CORE | CORE | CORE | CORE | CORE | CORE | CORE | CORE | CORE | CORE |
| Photo Album | CORE | CORE | CORE | CORE | CORE | CORE | OPT | OPT | CORE | CORE |
| Video Post | CORE | CORE | CORE | CORE | CORE | CORE | OPT | OPT | CORE | CORE |
| Follow Creator | CORE | CORE | CORE | NO | NO | NO | OPT | OPT | NO | NO |
| Like | CORE | CORE | CORE | CORE | CORE | CORE | CORE | CORE | CORE | CORE |
| Comment | CORE | CORE | CORE | CORE | CORE | CORE | CORE | CORE | OPT | OPT |
| Share | CORE | CORE | CORE | CORE | CORE | CORE | CORE | CORE | CORE | CORE |
| Ranking | CORE | CORE | OPT | OPT | NO | NO | CORE | CORE | NO | NO |
| Vote | CORE | CORE | OPT | OPT | NO | NO | CORE | CORE | NO | NO |
| Gift | CORE | CORE | CORE | OPT | OPT | OPT | CORE | CORE | NO | NO |
| Wallet | CORE | CORE | CORE | OPT | OPT | OPT | CORE | CORE | OPT | OPT |
| Chat | CORE | CORE | CORE | OPT | CUSTOM | CUSTOM | OPT | OPT | NO | NO |
| Voice Call | CORE | CORE | CORE | NO | NO | NO | NO | NO | NO | NO |
| Video Call | CORE | CORE | CORE | NO | NO | NO | NO | NO | NO | NO |
| Live | CORE | CORE | CORE | OPT | OPT | OPT | CORE | CORE | OPT | OPT |
| Live Archive | CORE | CORE | CORE | OPT | OPT | OPT | OPT | OPT | OPT | OPT |
| Unlock Photo | CORE | CORE | CORE | NO | NO | NO | NO | NO | NO | NO |
| Unlock Video | CORE | CORE | CORE | NO | NO | NO | NO | NO | NO | NO |
| Subscription | CORE | CORE | CORE | OPT | OPT | OPT | NO | NO | NO | NO |
| Fan Club | CORE | CORE | CORE | OPT | NO | NO | OPT | OPT | NO | NO |
| Marketplace | OPT | OPT | OPT | CORE | OPT | OPT | OPT | OPT | OPT | OPT |
| Event | OPT | OPT | OPT | OPT | CORE | CORE | CORE | CORE | CORE | CORE |
| Contest | OPT | OPT | OPT | OPT | OPT | OPT | CORE | CORE | NO | NO |
| Exhibition | NO | NO | NO | OPT | OPT | OPT | NO | NO | CORE | CORE |
| Ticketing | NO | NO | NO | OPT | OPT | OPT | OPT | OPT | CORE | CORE |
| Membership | OPT | OPT | OPT | OPT | CORE | CORE | OPT | OPT | OPT | OPT |
| Organization Directory | NO | NO | NO | NO | CORE | CORE | NO | NO | NO | NO |
| Creator Directory | CORE | CORE | OPT | OPT | NO | NO | CORE | CORE | OPT | OPT |
| Download App Links | CORE | CORE | CORE | CORE | CORE | CORE | CORE | CORE | CORE | CORE |

---

## 6. Creator / Visitor Permission Matrix

| Platform Type | Creator Post | Visitor Post | Creator Live | Visitor Comment | Visitor Vote | Visitor Gift |
|---|---|---|---|---|---|---|
| Creator Specific | Yes | No | Yes | Yes | Yes | Yes |
| Creator Multi | Yes | No | Yes | Yes | Yes | Yes |
| Creator Single | Yes | No | Yes | Yes | Optional | Yes |
| Community | Yes | Yes | Optional | Yes | Optional | Optional* |
| The Company | Yes | Yes | Optional | Yes | No | No |
| Company Single | Yes | Yes | Optional | Yes | No | No |
| The Contest | Contestant Only | No | Optional | Yes | Yes | Optional |
| Contest Single | Contestant Only | No | Optional | Yes | Yes | Optional |
| The Exhibition | Exhibitor Only | No | No | Optional | No | No |
| Exhibition Single | Exhibitor Only | No | No | Optional | No | No |

> **\* แก้ความขัดแย้ง:** ต้นฉบับ Permission Matrix เขียน Community Visitor Gift = `No` แต่ Features Matrix และ Revenue Matrix เขียน Gift ของ Community = `Optional` → ปรับให้ตรงกันเป็น **Optional** (เปิดได้ถ้าแอปต้องการ) — *รอ confirm จากเจ้าของโปรเจ็ค*

---

## 7. Revenue Feature Matrix (Category Level)

| Revenue Feature | Creator | Community | Company | Contest | Exhibition |
|---|---|---|---|---|---|
| Vote Revenue | Yes | Optional | No | Yes | No |
| Gift Revenue | Yes | Optional | No | Optional | No |
| Chat Revenue | Yes | No | No | No | No |
| Voice Revenue | Yes | No | No | No | No |
| Video Revenue | Yes | No | No | No | No |
| Subscription Revenue | Yes | Optional | Optional | No | No |
| Live Revenue | Yes | Optional | Optional | Optional | Optional |
| Ticket Revenue | No | Optional | Optional | Optional | Yes |
| Marketplace Revenue | Optional | Yes | Optional | Optional | Optional |
| Membership Revenue | Optional | Optional | Yes | Optional | Optional |

---

## 8. Sitemap (Public)

```
/                          Home
/platforms                 Platform Types (list)
/platforms/{slug}          Platform Detail        เช่น /platforms/creator-specific
/apps                      Applications (list + search/filter)
/apps/{slug}               Application Detail      เช่น /apps/foxy
/features                  Feature Library
/features/{slug}           Feature Detail          เช่น /features/vote
/news                      News (list)
/news/{slug}               News Detail
/about                     About Mr.FOX
/contact                   Contact
```

### 8.1 Home `/`
Hero Banner (Logo, Tagline, Intro Video optional, CTA: Explore Platforms / Explore Applications) · Ecosystem Overview (5 categories) · Platform Types Overview (10 cards) · Featured Applications · Core Features · Statistics (Platform Types / Apps / Features / Downloads) · Latest News · Footer

### 8.2 Platform Detail `/platforms/{slug}`
Platform Hero · Concept · Creator & Visitor Model · Structure Diagram · **Features Matrix (generate จาก §5 อัตโนมัติ)** · Revenue Model (จาก §7) · Example Applications · Download Applications

### 8.3 Applications `/apps`
Card grid: Poster · Logo · Name · Platform Type · Download Button
Controls: Search · Filter by Category · Filter by Platform Type

### 8.4 Application Detail `/apps/{slug}`
Hero (Poster, Logo, Download buttons) · About · Platform Type · Target Audience (Creator/Visitor) · Features (จาก mapping) · Screenshots · Download (iOS / Android / APK / Website) · Related Applications

### 8.5 Feature Library `/features`
Grid ของ Group B features เท่านั้น

### 8.6 Feature Detail `/features/{slug}`
Hero · Description · Workflow · Screenshots · Revenue Model (ถ้ามี) · Used By (apps ที่ใช้ feature นี้)

### 8.7 News / About / Contact
- **News**: list (search/filter/pagination) + detail (cover/content/related)
- **About**: Overview · Vision · Mission · Ecosystem Diagram · Roadmap (Phase 1/2/3) · Partners (optional)
- **Contact**: Form (Name/Email/Subject/Message) · Business Inquiry · Partnership Inquiry · Social (FB/IG/TikTok/YT/LinkedIn)

### 8.8 Global Components
Header (Logo, Menu, Search, Language Switcher–future) · Global Search (Platform/App/Feature/News) · Footer (About, Contact, Privacy, Terms, Copyright)

---

## 9. CMS / Back Office `/admin`

| Module | หน้าที่ |
|---|---|
| Dashboard | Statistics รวม |
| Platform Management | CRUD Platform Types (name, desc, poster, features, example apps) |
| Application Management | CRUD Apps (name, logo, poster, desc, screenshots, download links, platform type) |
| Feature Management | CRUD Features (name, desc, images, examples) |
| News Management | CRUD News (title, thumbnail, content, publish date) |
| Banner Management | CRUD Banners (homepage, campaign, announcement) |
| Media Library | Upload poster/logo/screenshot/video |
| Download Management | App Store / Google Play / APK / Website URL |
| User Management | Admin / Editor roles |
| Analytics | Visitors · Downloads · Popular Apps/Features/Platforms |

---

## 10. Data Model (แนะนำ — Next.js + PostgreSQL)

```
platform_categories        (5)   id, name, slug
platform_types             (10)  id, category_id, name, slug, concept, poster
features                   (~30) id, name, slug, group(A/B/C), description, workflow, revenue_model
applications               (N)   id, platform_type_id, name, slug, logo, poster, description
download_links                   app_id, type(ios/android/apk/web), url
screenshots                      app_id, image_url, order

-- junction (มาจาก Matrix โดยตรง)
platform_type_features           platform_type_id, feature_id, status(core/optional/custom/no)
platform_type_permissions        platform_type_id, key, value      -- §6
category_revenue                 category_id, revenue_feature, value -- §7
application_features             app_id, feature_id, enabled         -- override รายแอป

news                             id, slug, title, thumbnail, content, published_at
banners, media, users, ...
```

**ผลลัพธ์:** หน้า Features Matrix / Revenue Model ใน Platform Detail generate เองจาก junction tables เพิ่มแอป/ฟีเจอร์ใหม่ = insert row ไม่ต้องแตะโค้ด → ตอบโจทย์ scale 100+ apps

---

## 11. User Roles (Showcase)

| Role | สิทธิ์ |
|---|---|
| **Public Visitor** | ดูทุกอย่าง · ค้นหา Platform/App · ดู Features · อ่านข่าว · กด Download — **ไม่ต้อง login** |
| **Content Editor** | เพิ่ม/แก้ Content · จัดการ Platform/Application/Feature/News |
| **Administrator** | สิทธิ์ทั้งหมด + จัดการ User/Permission · Site Settings · Banner · ดู Analytics |

---

## 12. Non-Functional Requirements

### SEO (ทุกหน้า content)
SEO Title · SEO Description · Open Graph Image · Canonical URL · `sitemap.xml` (generate อัตโนมัติ)

### Performance
Lighthouse > 90 · Mobile-first · Responsive · Image Optimization · Lazy Loading

### Security (CMS)
HTTPS · Role-Based Access · CSRF Protection · Rate Limiting · Audit Log · JWT auth

### Analytics Dashboard
Total Visitors · Page Views · Downloads · Top Applications · Top Platform Types · Top Features
(+ Download Count tracking ต่อแอป)

### Storage & Infra
S3-compatible storage · Cloudflare CDN · Docker deploy

---

## 13. Design Direction

Modern · Technology · Startup Ecosystem · Creator Economy · Premium
เป้าหมาย UX: เข้าใจ Ecosystem ภายใน 2–3 นาที + ถึงหน้า Download ใน ≤ 3 คลิก

---

## 14. Phasing (Showcase)

- **Phase 1 — Public site:** Home, Platforms, Apps, Features, News, About, Contact + Data Model + seed จาก Matrix
- **Phase 2 — CMS / Back Office:** Admin CRUD ทุก module + Media Library + Analytics + SEO/Banner
- **Phase 3 — Polish:** Multi-language (th/en/zh), Global Search ขั้นสูง

> ส่วน Transactional (Wallet/Payment/Vote/Gift จริง) = **คนละโปรดักต์** → ดู `Mr_FOX_Engine_Spec.md`

---

## 15. Future Expansion (V2)

`/creators/{slug}` · `/organizations/{slug}` · `/contests/{slug}` · `/exhibitions/{slug}` · `/marketplace` · `/nft` · Multi-language `/th` `/en` `/zh`

รองรับ scale: 100+ Applications · 50+ Categories · 10,000+ Content Records (โดยไม่แก้ architecture หลัก)

---

## 16. Open Decisions (Resolved ✅)

1. **`CUSTOM` (Chat ของ Company)** = ต้อง config เฉพาะองค์กร ไม่เปิดอัตโนมัติ
2. **Community Gift** = Optional ✅
3. **Feature Library scope** = แสดงเฉพาะ Group B
4. **Scope / Stack** = Showcase แยกจาก Engine, ใช้ Next.js + PostgreSQL ✅
5. **Revenue Share / Wallet** = อยู่ฝั่ง Engine (config ใน app), Showcase ไม่มี transactional
