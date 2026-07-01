# Showcase — Deploy Guide (Level 2: Staging Live)

Deploy Mr.FOX Showcase ไป **Vercel + PostgreSQL (Neon)** — URL จริงให้คนเข้าดูได้

## สิ่งที่ได้หลัง deploy

- Public site: `https://your-domain.vercel.app/th`
- Health check: `https://your-domain.vercel.app/api/health`
- Admin CMS: `https://your-domain.vercel.app/admin/login`
- 3 ภาษา: `/th` `/en` `/zh`

---

## วิธีเร็ว — One-command deploy

### 1. สร้าง Neon database

1. [neon.tech](https://neon.tech) → New Project
2. Copy **pooled** connection string:
   ```
   postgresql://user:pass@ep-xxx.region.aws.neon.tech/mrfox_showcase?sslmode=require
   ```

### 2. สร้าง Vercel token

1. [vercel.com/account/tokens](https://vercel.com/account/tokens) → Create Token

### 3. รัน deploy script

```bash
cd mr.fox-site
chmod +x scripts/staging-deploy.sh

export DATABASE_URL="postgresql://..."   # Neon pooled URL
export AUTH_SECRET="$(openssl rand -base64 32)"
export VERCEL_TOKEN="..."
export DEPLOY_PROD=1                     # production URL

./scripts/staging-deploy.sh
```

### 4. ตั้ง env บน Vercel (ครั้งแรก)

Vercel Dashboard → Project → Settings → Environment Variables:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Neon **pooled** connection string |
| `DATABASE_URL_DIRECT` | (recommended) Neon **direct** connection string for build migrations |
| `AUTH_SECRET` | ค่าเดียวกับที่ใช้ตอน deploy |
| `NEXT_PUBLIC_SITE_URL` | `https://your-project.vercel.app` |
| `CONTACT_WEBHOOK_URL` | (optional) Slack/Discord webhook |
| `RESEND_API_KEY` | API key จาก [resend.com](https://resend.com) — ใช้ส่งฟอร์ม Contact |
| `CONTACT_EMAIL_TO` | (optional) ปลายทางอีเมล — default `support@mrfox.com` |
| `CONTACT_EMAIL_FROM` | (optional) ผู้ส่ง เช่น `Mr.FOX Contact <noreply@mrfox.com>` (ต้อง verify domain บน Resend) |

Redeploy หลังตั้ง env

---

## วิธี GitHub → Vercel (แนะนำระยะยาว)

### Step 1 — Push โค้ด

```bash
cd mr.fox-site
git init
git add .
git commit -m "Mr.FOX Showcase ready for staging"
git remote add origin <your-repo>
git push -u origin main
```

### Step 2 — Import บน Vercel

1. [vercel.com](https://vercel.com) → Import repo
2. **Root Directory:** `showcase`
3. ตั้ง env vars ตามตารางด้านบน
4. Deploy

### Step 3 — Seed database

```bash
cd showcase
DATABASE_URL="postgresql://..." AUTH_SECRET="..." npm run db:push
DATABASE_URL="postgresql://..." AUTH_SECRET="..." npm run db:seed
```

### Step 4 — GitHub Actions auto-deploy (optional)

ตั้ง secrets ใน repo → Settings → Secrets:

| Secret | คำอธิบาย |
|--------|----------|
| `DATABASE_URL` | Neon connection string |
| `AUTH_SECRET` | JWT secret 32+ chars |
| `VERCEL_TOKEN` | Vercel API token |
| `VERCEL_ORG_ID` | จาก `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | จาก `.vercel/project.json` |

จากนั้นรัน workflow **Deploy Staging** ใน Actions tab

---

## บัญชี Admin หลัง seed

| Email | Password |
|-------|----------|
| admin@mrfox.app | admin123 |
| editor@mrfox.app | editor123 |

**เปลี่ยนรหัสผ่านทันทีหลัง staging deploy**

---

## ตรวจสอบหลัง deploy (Level 2 checklist)

- [ ] `/api/health` → `{"status":"ok"}`
- [ ] `/th` โหลดได้ พร้อมข้อมูลจาก DB
- [ ] `/th/apps` → ดาวน์โหลด ≤ 3 คลิก
- [ ] `/admin/login` เข้า CMS ได้
- [ ] เพิ่ม news ใน admin → เห็นบน `/th/news`
- [ ] Contact form ส่งได้ (ดูใน audit_logs หรือ webhook)
- [ ] `/sitemap.xml` มี URL ครบ 3 ภาษา
- [ ] `/opengraph-image` แสดง OG image
- [ ] เปลี่ยนรหัส admin แล้ว

---

## Custom Domain

Vercel → Project → Settings → Domains → เพิ่ม `mrfox.app`

อัปเดต `NEXT_PUBLIC_SITE_URL` เป็น domain จริง แล้ว Redeploy

---

## Local Development

```bash
docker compose up -d postgres
cd showcase
cp .env.example .env.local
npm install
npm run db:push && npm run db:seed
npm run dev
```

---

## Troubleshooting

| ปัญหา | แก้ |
|-------|-----|
| `/api/health` 503 | ตรวจ `DATABASE_URL` บน Vercel — ใช้ **pooled** URL |
| หน้าว่าง / error 500 | รัน `db:push` + `db:seed` กับ Neon |
| Admin login ไม่ได้ | รัน `db:seed` อีกครั้ง |
| Redirect loop | ตรวจ `NEXT_PUBLIC_SITE_URL` ตรงกับ domain จริง |
| Build fail | ต้องมี `AUTH_SECRET` ใน env |
| Connection timeout | ใช้ Neon pooled connection (`-pooler` host) |
