# UAT Smoke Test — Mr.FOX Showcase

**Production:** https://mrfox-showcase.vercel.app  
**Time:** ~30–45 min  
**Admin:** `admin@mrfox.app` / `admin123`

Mark each item: ✅ Pass · ❌ Fail · ⏭ Skip

---

## A. Locales (10 min)

| # | Test | th | en | zh |
|---|------|----|----|-----|
| A1 | Home — UI labels change | ☐ | ☐ | ☐ |
| A2 | `/platforms/creator-specific` — platform text changes | ☐ | ☐ | ☐ |
| A3 | `/news/mrfox-ecosystem-launch` — article + date format | ☐ | ☐ | ☐ |
| A4 | Locale switcher keeps same page path | ☐ | ☐ | ☐ |
| A5 | About — roadmap text localized | ☐ | ☐ | ☐ |

---

## B. Public pages (10 min)

| # | Test | ✓ |
|---|------|---|
| B1 | Home loads: stats, bento, featured apps, news | ☐ |
| B2 | `/platforms` — 10 cards, click one → detail + matrix | ☐ |
| B3 | `/apps` — filter `?q=foxy` works | ☐ |
| B4 | `/apps/foxy` — download buttons open links | ☐ |
| B5 | `/features` — 18 Group B features | ☐ |
| B6 | `/search?q=vote` — results in all sections | ☐ |
| B7 | `/contact` — submit form → success message | ☐ |
| B8 | Invalid slug `/platforms/not-real` → 404 | ☐ |

---

## C. News publish (10 min)

| # | Test | ✓ |
|---|------|---|
| C1 | Create **draft** (no date) — hidden on public | ☐ |
| C2 | Create **scheduled** (tomorrow) — hidden on public | ☐ |
| C3 | Create **published** (today) — visible on `/news` | ☐ |
| C4 | Admin badge matches state | ☐ |
| C5 | Delete test news after verify | ☐ |

---

## D. Admin (10 min)

| # | Test | ✓ |
|---|------|---|
| D1 | `/admin` without login → redirect login | ☐ |
| D2 | Login admin → dashboard counts load | ☐ |
| D3 | Edit platform → toast + public reflects change | ☐ |
| D4 | Editor login → `/admin/users` blocked | ☐ |
| D5 | Logout works | ☐ |
| D6 | Click download on public → analytics count increases | ☐ |

---

## E. SEO (5 min)

| # | Test | ✓ |
|---|------|---|
| E1 | `/api/health` → `{ status: "ok" }` | ☐ |
| E2 | `/sitemap.xml` has locale URLs | ☐ |
| E3 | Page source: canonical + hreflang on home | ☐ |
| E4 | `/opengraph-image` loads | ☐ |

---

## Sign-off

| Area | Result | Tester | Date |
|------|--------|--------|------|
| Locales | Pass / Fail | | |
| Public | Pass / Fail | | |
| News | Pass / Fail | | |
| Admin | Pass / Fail | | |
| SEO | Pass / Fail | | |
| **Overall** | **Pass / Fail** | | |

**Blockers:**

---

_See [uat-checklist.md](./uat-checklist.md) for full coverage. Import [uat-checklist.csv](./uat-checklist.csv) into Google Sheets._
