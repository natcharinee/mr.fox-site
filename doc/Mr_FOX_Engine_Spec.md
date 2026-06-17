# Mr.FOX — Creator Platform Engine Specification

> **Product B** ของ Ecosystem — ตัวแอปจริงที่ creator/visitor ใช้งานและทำเงิน
> เกลาจาก `Features.md` ให้เป็นสเปคเต็ม คู่กับ `Mr_FOX_Website_Spec.md` (Product A)
> สถาปัตยกรรม/stack/data model ดูที่ `Mr_FOX_Architecture_Decisions.md`
>
> Version: 1.0 · Stack: NestJS + PostgreSQL + Redis + WebRTC(SFU) · Frontend: Flutter (แนะนำ)

---

## 1. Purpose

Engine คือ template มาตรฐานของ Creator Platform ที่ instance ออกมาเป็นแอปได้หลายตัวในตระกูล Creator:

FOXY · TOMBOI · The Creator · Creator Specific · Creator Multi Category · Creator Single

**หลักการ:** Creator สร้าง content · Visitor บริโภค + สนับสนุน · Platform เป็นตัวกลาง Discovery / Engagement / Monetization เพื่อให้ creator หารายได้จากแฟนคลับโดยตรง

---

## 2. User Roles

### Creator
โพสต์ content · รับ Vote/Gift · เปิด Chat/Voice/Video Call · Live · ขาย content (unlock) · ขาย Subscription · ตั้งราคาบริการเอง

### Visitor
ดู content · Like/Comment/Share/Save · Vote · ส่ง Gift · Chat · Voice/Video Call · Subscribe

### Admin (Moderation)
Suspend creator · Remove content · Ban user · จัดการ report

---

## 3. Feature Specification

### 3.1 Profile
| ส่วน | Fields |
|---|---|
| Creator Profile | Profile Image, Cover, Display Name, Username, Bio, Category, Location, Social Links |
| Statistics | Followers, Following, Total Posts, Total Votes, Total Gifts, Total Subscribers |
| Creator Settings | Chat Price, Voice Call Price, Video Call Price, Subscription Price |

### 3.2 Post
- **Content Types:** Photo · Video · Text · Album
- **Visitor Actions:** Like · Comment · Share · Save · Report
- **Creator Actions:** Create · Edit · Delete · Pin Post

### 3.3 Follow
- Follow / Unfollow Creator
- Notification: New Post · New Live · New Content

### 3.4 Vote 💰
- **ใช้สำหรับ:** Popularity Ranking · Contest Ranking · Fan Support
- **Creator:** เปิดรับ vote, ดูคะแนน, ดู ranking
- **Visitor:** vote ด้วย Coin / Wallet
- **ราคาตัวอย่าง:** 10 / 20 / 50 / 100 บาท
- **Ranking:** Daily / Weekly / Monthly / All Time

### 3.5 Gift 💰
- **Visitor ส่ง:** Sticker Gift · Animated Gift
- **ตัวอย่าง Sticker:** Rose · Coffee · Cake · Crown · Diamond (ราคาต่างกันต่อชิ้น)
- **Creator:** ดู Gift History · Top Supporters

### 3.6 Chat 💰
- **Creator:** ตั้งราคา **ต่อข้อความ** (เช่น 10/20/50 บาท)
- **Visitor:** ต้องชำระก่อนส่ง
- **เสริม:** Read Status · Message History · Priority Message · Gift in Chat

### 3.7 Voice Call 💰
- **Creator:** ตั้งราคา **ต่อนาที** (เช่น 20/50/100 บาท)
- **Visitor:** ซื้อเวลาเพื่อสนทนาเสียง
- **เสริม:** Booking · Call History · Rating

### 3.8 Video Call 💰
- **Creator:** ตั้งราคา **ต่อนาที**
- **Visitor:** ซื้อเวลาเพื่อ video call
- **เสริม:** Booking · **Gift During Call** · Call History · Rating

### 3.9 Live 💰
- **Room Types:** Free · Paid · Password · Paid + Password
- **Visitor:** ดู Live · Comment · Send Gift · Vote
- **Moderation:** Kick · Mute · Ban User
- **Infra:** WebRTC broadcast ผ่าน SFU (ดู Architecture doc §4)

### 3.10 Live Archive 💰
- **Creator:** Save Live · Publish Archive · ตั้งราคา **ต่อคลิป**
- **Visitor:** ซื้อเพื่อดูย้อนหลัง

### 3.11 Unlock Photo 💰
- **Creator:** Upload · Blur · Set Price
- **Visitor:** จ่ายเพื่อปลดล็อกภาพ

### 3.12 Unlock Video 💰
- **Creator:** Upload · Set Preview · Set Price
- **Visitor:** จ่ายเพื่อดูเต็ม

### 3.13 Subscription 💰
- **Creator:** สร้าง Premium Feed
- **Pricing:** Monthly · Quarterly · Yearly
- **Visitor:** subscribe เพื่อเข้าถึง content พิเศษ

### 3.14 Fan Club
- **Tiers:** Bronze · Silver · Gold · Platinum · Diamond
- **Benefits:** Special Badge · Exclusive Content · Priority Chat · Priority Live

### 3.15 Wallet
- **User Wallet:** เติมเงิน · ถอนเงิน · Transaction History
- **ใช้กับ:** Vote · Gift · Chat · Voice/Video Call · Live · Subscription
- **Gateway:** KKP · Pay Solutions · Apple Pay · Google Pay

### 3.16 Notification
New Post · New Vote · New Gift · New Subscriber · New Message · New Live

### 3.17 Search
Creator · Category · Post · Hashtag

### 3.18 Ranking
- **Creator Ranking:** Daily / Weekly / Monthly / All Time
- **Factors:** Vote · Gift · Followers · Subscribers
- **Infra:** Redis sorted set (real-time leaderboard)

### 3.19 Reporting & Moderation
- **Report:** Creator · Post · Comment
- **Admin:** Suspend Creator · Remove Content · Ban User · Audit Log

---

## 4. Revenue System

ทุก revenue feature แบ่งเป็น **Platform Share + Creator Share**

| # | Feature | หน่วยคิดเงิน |
|---|---|---|
| 1 | Vote | ต่อโหวต |
| 2 | Gift | ต่อชิ้น |
| 3 | Chat | ต่อข้อความ |
| 4 | Voice Call | ต่อนาที |
| 5 | Video Call | ต่อนาที |
| 6 | Subscription | ต่อรอบ (เดือน/ไตรมาส/ปี) |
| 7 | Live | ค่าเข้า + gift |
| 8 | Live Archive | ต่อคลิป |
| 9 | Unlock Photo | ต่อภาพ |
| 10 | Unlock Video | ต่อคลิป |

> **Revenue Share %:** เป็น config ใน app ตามข้อตกลงรายดีล (ไม่ fix ในโค้ด)
> เก็บใน `revenue_shares` ปรับได้โดยไม่ deploy ใหม่ — Engine อ่านค่าตอน transaction เกิด

---

## 5. Wallet & Money Flow

```
Visitor เติมเงิน (KKP/PaySolutions/ApplePay/GooglePay)
        ▼
   Wallet (Coin/Credit)
        ▼
ใช้จ่าย: Vote / Gift / Chat / Call / Unlock / Subscription / Live
        ▼
แบ่งตาม revenue_shares → Platform Share + Creator Share
        ▼
Creator Wallet → Payout (ถอนออก, มี KYC)
```

---

## 6. Future Features (V2)

- **Marketplace** — creator ขายสินค้า
- **NFT Membership** — membership แบบ NFT
- **AI Creator** — AI Chat · AI Voice · AI Companion

---

## 7. Build Order (MVP-first)

1. **Core loop:** Profile → Post → Follow → Wallet (เติมเงิน)
2. **Monetization เบื้องต้น:** Vote → Gift (ง่ายสุด, ทำเงินได้เร็ว)
3. **Subscription / Unlock** (async, ไม่ต้อง real-time)
4. **Chat** (real-time text)
5. **Live** (broadcast + SFU) — ซับซ้อน + cost สูง
6. **Voice / Video Call** (1:1 WebRTC + booking)
7. **Fan Club · Ranking · Moderation** (รอบเสริม)

> เริ่มทำ 1 platform type ก่อน (เช่น Creator Specific = FOXY) แล้วค่อยขยายจาก template

---

## 8. Cross-reference

- Feature × Platform Type support matrix → `Mr_FOX_Website_Spec.md` §5
- Permission matrix → `Mr_FOX_Website_Spec.md` §6
- Data model + infra decisions → `Mr_FOX_Architecture_Decisions.md`
