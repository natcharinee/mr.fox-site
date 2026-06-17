# Mr.FOX Coding Standards (Web)

## Stack

- **Showcase:** Next.js App Router + Tailwind v4 + shadcn/ui + Drizzle + PostgreSQL
- **Engine Admin:** Next.js + shadcn/ui (same rules)

## Rules

1. **shadcn/ui first** — ห้าม build component จากศูนย์ถ้า shadcn มีอยู่แล้ว
2. **Tailwind utility classes** — ห้าม inline style ยกเว้นค่า dynamic runtime
3. **Reusable classes** — ค่าซ้ำใช้ `@apply` ใน globals.css
4. **Design tokens** — อ่าน `DESIGN.md` ก่อนเพิ่มสี/spacing ใหม่
5. **Data-driven** — หน้า Platform/App/Feature อ่านจาก DB ไม่ hardcode
6. **SEO** — ทุกหน้า content ต้องมี metadata (title, description, OG)

## File Structure

```
showcase/src/
  app/          # routes
  components/   # UI + layout
  db/           # schema, seed, connection
  lib/          # queries, utils
```
