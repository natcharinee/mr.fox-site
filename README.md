# Mr.FOX Ecosystem

สองโปรดักต์แยก codebase:

| โฟลเดอร์ | โปรดักต์ | Stack | สถานะ |
|----------|----------|-------|--------|
| `showcase/` | Platform Showcase Website | Next.js · PostgreSQL · shadcn/ui | ✅ Level 2 ready |
| `engine/api/` | Creator Platform Engine API | NestJS · PostgreSQL · Redis | ✅ MVP API |
| `engine/mobile/` | Engine Flutter App | Flutter | ✅ Scaffold |
| `doc/` | Specifications & WBS | — | ✅ |

## Quick Start

### 1. Infrastructure

```bash
docker compose up -d
```

สร้าง DB: `mrfox_showcase` (auto) + `mrfox_engine` (via init script)

### 2. Showcase Website

```bash
cd showcase
cp .env.example .env.local
npm install
npm run db:push && npm run db:seed
npm run dev
```

- Public: http://localhost:3000/th
- Admin: http://localhost:3000/admin/login (`admin@mrfox.app` / `admin123`)

### 3. Engine API

```bash
cd engine/api
cp .env.example .env
npm install
npm run db:push && npm run db:seed
npm run start:dev
```

- API: http://localhost:4000/api/v1/health
- Creator: `creator@foxy.app` / `creator123`
- Visitor: `visitor@foxy.app` / `visitor123`

### 4. Flutter Mobile

```bash
cd engine/mobile
flutter pub get && flutter run
```

## Implementation Status (WBS)

| Epic | รายการ | สถานะ |
|------|--------|--------|
| 0 | Foundation + Design tokens | ✅ |
| 1-2 | Showcase Public + DB | ✅ |
| 3 | Showcase CMS | ✅ |
| 4 | i18n (th/en/zh) + Search | ✅ |
| 5 | Engine Foundation + Auth | ✅ |
| 6 | Profile · Post · Follow | ✅ |
| 7-8 | Wallet · Vote · Gift | ✅ |
| 9 | Subscription · Unlock | ✅ |
| 10-12 | Chat · Live · Calls | ✅ API (SFU/WebRTC = integration points) |
| 13 | Fan Club · Ranking · Moderation | ✅ |
| 14 | Flutter scaffold | ✅ |

## Staging Deploy (Level 2)

Showcase พร้อม deploy ไป Vercel + Neon — ดูคู่มือเต็มที่ [showcase/DEPLOY.md](showcase/DEPLOY.md)

```bash
export DATABASE_URL="postgresql://..."  # Neon
export AUTH_SECRET="$(openssl rand -base64 32)"
export VERCEL_TOKEN="..."
./scripts/staging-deploy.sh
```

## Docs

- [Website Spec](doc/Mr_FOX_Website_Spec.md)
- [Engine Spec](doc/Mr_FOX_Engine_Spec.md)
- [Architecture](doc/Mr_FOX_Architecture_Decisions.md)
- [WBS](doc/Mr_FOX_Implementation_Plan_WBS.md)
