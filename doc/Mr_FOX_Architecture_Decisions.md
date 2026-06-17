# Mr.FOX — Architecture & Decisions

> เอกสารคู่กับ `Mr_FOX_Website_Spec.md`
> สรุปสถาปัตยกรรมและการตัดสินใจหลัก หลังรวมเอกสาร Requirement + Features
> Version: 1.0 · สถานะ: Decisions ส่วนใหญ่ Locked, เหลือ 3 ข้อรอเคาะ

---

## 1. Two-Product Architecture

โปรเจ็คนี้คือ **2 โปรดักต์** ที่แยก codebase / stack / deployment กัน ใช้ร่วมกันแค่ Brand + Taxonomy (Matrix)

```
                    Mr.FOX Ecosystem
                          │
        ┌─────────────────┴─────────────────┐
        │                                     │
  PRODUCT A                             PRODUCT B
  Showcase Website                      Creator Platform Engine
  (พูดถึงแอป)                            (เป็นตัวแอป)
        │                                     │
  - Marketing / Directory               - Creator / Visitor app
  - CMS (Admin/Editor)                  - Wallet + Payment จริง
  - Download Hub                        - Vote/Gift/Chat/Call/Sub
  - Visitor ไม่ต้อง login                - Live + Real-time
  - spec: Requirement.md                - Revenue Share
                                        - spec: Features.md
        └─────────────┬───────────────────┘
                Shared: Brand, Platform Taxonomy (10 types),
                        Feature naming, Design tokens
```

**หลักคิด:** Showcase *อธิบาย* platform · Engine *คือ* platform
อย่าพยายามยัดสองอย่างใน codebase เดียว เพราะ scale และ requirement ต่างกันมาก

---

## 2. Tech Stack (Locked)

| Layer | Product A — Showcase | Product B — Engine |
|---|---|---|
| Frontend | Next.js + React + Tailwind + **shadcn/ui** | **Flutter** (mobile) · web admin = Next.js + shadcn/ui |
| UI / Components | shadcn/ui (Radix + Tailwind), lucide-react | Flutter (Material/Cupertino + custom widgets) |
| Animation | Framer Motion + Lenis (smooth scroll) | Flutter built-in / Rive / Lottie |
| Charts | Recharts (admin analytics) | fl_chart (ถ้ามี dashboard) |
| Backend | Next.js API / Route Handlers | **NestJS** (Node.js) |
| Database | PostgreSQL | PostgreSQL |
| Cache | – (optional) | **Redis** (session, rate limit, ranking) |
| Storage | S3-compatible | S3-compatible |
| Auth | CMS only (Admin/Editor, JWT) | Creator/Visitor (JWT + refresh) |
| Real-time | – | **WebRTC** + SFU (ดู §4) |
| Payment | – | KKP / Pay Solutions / Apple Pay / Google Pay |
| Deploy | Vercel / Docker | Docker + Cloudflare + VPS/Cloud |

> เหตุผลที่แยก: Showcase งานเบา (CMS + static-ish content) Next.js จบในตัว
> Engine ต้องการ backend แข็ง (transaction, wallet, real-time, queue) → NestJS + Redis เหมาะกว่า

### Frontend / Design System (Locked)
- **Web (Showcase + Engine admin):** Tailwind CSS + **shadcn/ui** เป็น component base, lucide-react สำหรับ icon
- ใช้ **Tailwind class discipline** (เลี่ยง inline style, แยก reusable class ด้วย `@apply`) ตาม SKILL.md เดิม → ทีม non-programmer แก้ต่อได้ง่าย
- Animation: Framer Motion + Lenis (premium feel ตาม Design Direction)
- Typography: Prompt (รองรับไทย)
- **Engine mobile (Flutter):** shadcn ใช้ไม่ได้ → ทำ custom design system ของ Flutter เอง (share design tokens เช่น สี/spacing/typography ผ่าน DESIGN.md ให้ตรงกับ web)
- หลักการ: **design tokens เดียวกันทั้ง ecosystem** (color/spacing/radius/typography) แม้คนละ framework

### Coding Standards (บังคับใช้ — Web/React)
1. ใช้ **shadcn/ui เป็น component library หลัก**
2. **อ่าน SKILL.md ก่อน code ทุกครั้ง**
3. **ห้าม build component จากศูนย์ถ้า shadcn มีอยู่แล้ว** — extend/compose จากของเดิมก่อน
4. **เลี่ยง Inline CSS** ใช้ **Tailwind utility classes** เป็นหลัก
   - ยกเว้นกรณีจำเป็นจริง: ค่าไดนามิกที่คำนวณ runtime (เช่น ตำแหน่ง/สีที่คำนวณ inline)
   - ค่าที่ใช้ซ้ำ → แยกเป็น reusable class ด้วย `@apply`

> Standards ชุดนี้ควร export เป็น `SKILL.md` วางใน repo ให้ Claude Code / Cursor อ่านอัตโนมัติ (ดูหมายเหตุท้ายเอกสาร)

---

## 3. Payment & Wallet

### Gateways
| Method | ใช้ทำอะไร |
|---|---|
| **KKP** | Card / QR PromptPay (เติมเงินเข้า wallet) |
| **Pay Solutions** | Card / Internet Banking (PG สำรอง/ทางเลือก) |
| **Apple Pay** | เติมเงินบน iOS |
| **Google Pay** | เติมเงินบน Android |

### Wallet Flow (กลไก revenue)
```
Visitor เติมเงิน (Gateway) → Wallet (Coin/Credit)
        │
        ▼
ใช้จ่าย: Vote / Gift / Chat / Call / Unlock / Subscription
        │
        ▼
แบ่งเงิน: Platform Share + Creator Share
        │
        ▼
Creator Wallet → ถอนออก (Payout)
```

### Revenue Share (Resolved)
- **สัดส่วนเป็น config ใน app ตามข้อตกลงรายดีล** — ไม่ fix เป็นเลขตายตัวในโค้ด
- เก็บใน table `revenue_shares` (configurable ต่อ creator / feature / agreement) → ปรับได้โดยไม่ deploy ใหม่
- Engine แค่อ่านค่าตอนคำนวณตอน transaction เกิด

---

## 4. Real-time Infrastructure

WebRTC ตามที่เลือก แต่ต้องแยก 2 รูปแบบ:

| Feature | Pattern | วิธี |
|---|---|---|
| Voice Call / Video Call | 1:1 (P2P) | WebRTC ตรง + TURN server |
| **Live** | 1-to-many (broadcast) | **ต้องมี SFU** — P2P ไม่ไหวเกิน ~4 คน |

### แนะนำ
- ใช้ **LiveKit** (open-source, WebRTC-based, self-host ได้) — รองรับทั้ง 1:1 และ broadcast ไม่ต้องเขียน media server เอง
- ทางเลือก managed: Agora / Twilio (จ่ายตาม usage, setup เร็ว แต่ค่าใช้จ่ายต่อนาทีสูง)
- ต้องมี **TURN server** (coturn) เสมอ สำหรับ NAT traversal

> ⚠️ ตัวนี้คือ cost driver ใหญ่สุดของ Engine — ประเมิน bandwidth/minute ก่อน commit vendor
>
> **สถานะ: มี SFU แล้ว ✅** — infra พร้อม ไม่ต้องเลือก vendor ใหม่

---

## 5. Platform Taxonomy & Scale

แก้ความสับสนเรื่อง "10 types" vs "50+ categories":

- **Platform Type (10)** = template ตายตัวใน Engine (กำหนด feature set + permission ตาม Matrix)
- **Category / Instance** = data เพิ่มได้ไม่จำกัด
- ถ้าทำ data-driven ตั้งแต่แรก → รองรับ 100+ apps, 50+ categories, 10,000+ records โดยไม่แก้ architecture (ตรงตาม Requirement §12)

> สถานะ: **Confirmed ✅** — ใช้ดีไซน์ data-driven (10 types เป็น template ในโค้ด, category เป็น data) รองรับ 100+ apps / 50+ categories / 10,000+ records โดยไม่แก้ architecture

---

## 6. Engine Data Model (High-level)

โครงคร่าวๆ ของ Product B (ขยายได้ตอนเริ่มทำจริง):

```
-- Identity
users                 id, role(creator/visitor), email, phone, kyc_status
creator_profiles      user_id, display_name, username, bio, category, social_links
creator_settings      user_id, chat_price, voice_price, video_price, sub_price

-- Content
posts                 id, creator_id, type(photo/video/text/album), is_locked, price
media                 post_id, url, blur_url, type
follows               follower_id, creator_id

-- Monetization (ทุกตัวกระทบ wallet)
wallets               user_id, balance
wallet_transactions   wallet_id, type(topup/spend/earn/withdraw), amount, ref
votes                 visitor_id, post_id, amount
gifts                 visitor_id, creator_id, sticker_id, amount
gift_stickers         id, name, animation_url, price
chats / chat_messages creator_id, visitor_id, price_per_msg, paid
calls                 type(voice/video), creator_id, visitor_id, price_per_min, duration, status
subscriptions         visitor_id, creator_id, tier, period, expires_at
unlocks               visitor_id, content_id, amount

-- Live
live_rooms            creator_id, type(free/paid/password/paid_password), price
live_archives         room_id, video_url, price
live_events           room_id, type(comment/gift/vote), payload   -- real-time log

-- Fan Club / Ranking
fan_clubs             visitor_id, creator_id, tier(bronze→diamond)
rankings              creator_id, period(daily/weekly/monthly/all), score

-- Revenue
revenue_shares        feature, platform_pct, creator_pct
payouts               creator_id, amount, status, requested_at

-- Ops
notifications, reports, moderation_logs
```

> เทียบกับ Showcase DB (PlatformType/Application/Feature/News) จะเห็นว่าคนละโลกเลย — ยืนยันว่าควรแยกโปรดักต์

---

## 7. Recommended Build Order

1. **Showcase Website ก่อน** — เสร็จเร็ว, ใช้เปิดตัว ecosystem + เก็บ lead ได้ทันที, ความเสี่ยงต่ำ
2. **Engine MVP** — เริ่มจาก 1 platform type (เช่น Creator Specific = FOXY) ทำ core loop: Post → Wallet → Vote/Gift ก่อน
3. **เพิ่ม real-time** (Live → Call) ทีหลัง เพราะ cost + complexity สูงสุด
4. ขยาย platform types อื่นจาก template เดิม

---

## 8. Open Decisions (เหลือ)

ปิดไปแล้ว: Revenue Share (config ใน app) ✅ · SFU (มีแล้ว) ✅ · 50+ Categories (data-driven) ✅

เหลือจริงๆ ข้อเดียวที่ blocking ตอนเริ่มทำ Engine:

1. **Engine Frontend** — mobile-first จะใช้ Flutter / React Native / PWA?
   - แนะนำ **Flutter** (เคยทำ sticker + live gift system มาแล้ว เข้าทาง + perf ดีสำหรับ real-time UI)

> *Showcase Website เริ่มได้เลยโดยไม่ต้องรอข้อนี้ — เป็น Next.js อยู่แล้ว*
