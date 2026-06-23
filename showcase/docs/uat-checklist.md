# UAT Checklist — Mr.FOX Showcase (Full)

**Production:** https://mrfox-showcase.vercel.app  
**Locales:** `th` (default) · `en` · `zh`  
**Admin seed:** `admin@mrfox.app` / `admin123` · `editor@mrfox.app` / `editor123`

**Related files**

- [uat-smoke.md](./uat-smoke.md) — 30–45 min smoke test
- [uat-checklist.csv](./uat-checklist.csv) — import into Google Sheets

**CSV import (Google Sheets):** File → Import → Upload `uat-checklist.csv` → Separator: Comma. Add checkbox columns or use Pass/Fail columns.

---

## 0. Setup

| ID | Test | Expected | Pass | Fail | Notes |
|----|------|----------|------|------|-------|
| 0.1 | Open `/api/health` | `{ status: "ok" }` | ☐ | ☐ | |
| 0.2 | Open `/robots.txt` | `Allow: /` + sitemap URL | ☐ | ☐ | |
| 0.3 | Open `/sitemap.xml` | URLs for th, en, zh | ☐ | ☐ | |
| 0.4 | Open `/opengraph-image` | Image loads 1200×630 | ☐ | ☐ | |
| 0.5 | `NEXT_PUBLIC_SITE_URL` set | Canonical = production URL | ☐ | ☐ | |

---

## 1. i18n (th / en / zh)

### 1.1 Locale switcher

| ID | Test | Expected | th | en | zh |
|----|------|----------|----|----|-----|
| 1.1.1 | Switch on home | URL + content update | ☐ | ☐ | ☐ |
| 1.1.2 | Switch on detail page | Same path, new locale prefix | ☐ | ☐ | ☐ |
| 1.1.3 | th → en → zh → th | Correct round-trip | ☐ | ☐ | ☐ |

### 1.2 UI labels (messages)

| ID | Page | Check | Pass | Fail |
|----|------|-------|------|------|
| 1.2.1 | All | Nav, footer | ☐ | ☐ |
| 1.2.2 | Home | Hero, stats, sections | ☐ | ☐ |
| 1.2.3 | Platforms | Models, matrix headers, perm/revenue labels | ☐ | ☐ |
| 1.2.4 | Apps | Filters, placeholders, empty state | ☐ | ☐ |
| 1.2.5 | Features | Group label, workflow, revenue | ☐ | ☐ |
| 1.2.6 | News | Back link, date format | ☐ | ☐ |
| 1.2.7 | About | Vision, mission, roadmap | ☐ | ☐ |
| 1.2.8 | Contact | Form, success/error | ☐ | ☐ |
| 1.2.9 | Search | Placeholder, sections, no results | ☐ | ☐ |
| 1.2.10 | Privacy / Terms | Legal copy | ☐ | ☐ |

### 1.3 DB content (content packs)

| ID | Entity | th | en | zh | Pass |
|----|--------|----|----|-----|------|
| 1.3.1 | Categories (5) | DB | `en.json` / `zh.json` | Same | ☐ |
| 1.3.2 | Platforms (10) | DB | Localized fields | Localized | ☐ |
| 1.3.3 | Features Group B (18) | DB | Localized | Localized | ☐ |
| 1.3.4 | Apps (6) | DB | description + audience | Same | ☐ |
| 1.3.5 | News (3 seed) | DB | title, excerpt, content | Same | ☐ |
| 1.3.6 | News dates | th-TH | en-US | zh-CN | ☐ |

**Known gaps (record if still true):**

- App **names** not localized (DB name on all locales)
- Download buttons: "เร็วๆ นี้", "รายละเอียด" hardcoded Thai

---

## 2. Home `/[locale]`

| ID | Test | Expected | Pass | Fail |
|----|------|----------|------|------|
| 2.1 | Hero CTAs | → `/platforms`, `/apps` | ☐ | ☐ |
| 2.2 | Stats (4) | Match DB counts | ☐ | ☐ |
| 2.3 | Ecosystem bento | 5 categories + types | ☐ | ☐ |
| 2.4 | Platform grid (6) | Links to detail | ☐ | ☐ |
| 2.5 | Featured apps (4) | Badge + downloads | ☐ | ☐ |
| 2.6 | Core features (6) | → feature detail | ☐ | ☐ |
| 2.7 | Latest news (3) | Published only | ☐ | ☐ |
| 2.8 | View all links | platforms, news | ☐ | ☐ |

---

## 3. Platforms

### 3.1 List `/[locale]/platforms`

| ID | Test | Pass | Fail |
|----|------|------|------|
| 3.1.1 | 10 platform types | ☐ | ☐ |
| 3.1.2 | Category badge + concept | ☐ | ☐ |
| 3.1.3 | Card → detail | ☐ | ☐ |

### 3.2 Detail — all slugs

Slugs: `creator-specific`, `creator-multi-category`, `creator-single`, `community-specific`, `the-company`, `company-single`, `the-contest`, `contest-single`, `the-exhibition`, `exhibition-single`

| ID | Test | Expected | Pass | Fail |
|----|------|----------|------|------|
| 3.2.1 | Hero | name, concept, category | ☐ | ☐ |
| 3.2.2 | Creator / visitor cards | Localized content | ☐ | ☐ |
| 3.2.3 | Features matrix | Group B; names localized | ☐ | ☐ |
| 3.2.4 | Permission matrix | Labels + values localized | ☐ | ☐ |
| 3.2.5 | Revenue model | 10 types + category note | ☐ | ☐ |
| 3.2.6 | Example apps | If any, downloads work | ☐ | ☐ |
| 3.2.7 | Back link | → `/platforms` | ☐ | ☐ |
| 3.2.8 | Invalid slug | 404 | ☐ | ☐ |

---

## 4. Applications

### 4.1 List `/[locale]/apps`

| ID | Test | Expected | Pass | Fail |
|----|------|----------|------|------|
| 4.1.1 | List | 6 apps | ☐ | ☐ |
| 4.1.2 | `?q=foxy` | Finds FOXY | ☐ | ☐ |
| 4.1.3 | `?category=creator` | Filtered | ☐ | ☐ |
| 4.1.4 | `?platform=creator-specific` | Filtered | ☐ | ☐ |
| 4.1.5 | Combined filters | Consistent results | ☐ | ☐ |
| 4.1.6 | No match | Empty state | ☐ | ☐ |
| 4.1.7 | Dropdown labels | Localized | ☐ | ☐ |
| 4.1.8 | Featured badge | foxy, the-expert, tom-thailand, miss-grand | ☐ | ☐ |

### 4.2 Detail — all slugs

Slugs: `foxy`, `the-expert`, `tom-thailand`, `the-alumni`, `miss-grand`, `exhibition-hub`

| ID | Test | Pass | Fail |
|----|------|------|------|
| 4.2.1 | Hero + badges | ☐ | ☐ |
| 4.2.2 | iOS / Android / APK buttons | ☐ | ☐ |
| 4.2.3 | Platform type link | ☐ | ☐ |
| 4.2.4 | Target audience localized | ☐ | ☐ |
| 4.2.5 | Related apps (≤3) | ☐ | ☐ |
| 4.2.6 | Invalid slug → 404 | ☐ | ☐ |

---

## 5. Features

### 5.1 List `/[locale]/features`

| ID | Test | Expected | Pass | Fail |
|----|------|----------|------|------|
| 5.1.1 | Count | 18 Group B only | ☐ | ☐ |
| 5.1.2 | Revenue badge | 💰 on revenue features | ☐ | ☐ |
| 5.1.3 | Card → detail | Works | ☐ | ☐ |

### 5.2 Detail (sample slugs)

`vote`, `gift`, `live`, `subscription`, `contest`, `ticketing`

| ID | Test | Pass | Fail |
|----|------|------|------|
| 5.2.1 | Hero + group badge | ☐ | ☐ |
| 5.2.2 | Workflow card | ☐ | ☐ |
| 5.2.3 | Revenue model card | ☐ | ☐ |
| 5.2.4 | Used by apps | ☐ | ☐ |
| 5.2.5 | Group A slug direct URL | Opens; not in list/sitemap | ☐ | ☐ |

---

## 6. News

### 6.1 Public

| ID | Test | Expected | Pass | Fail |
|----|------|----------|------|------|
| 6.1.1 | `/news` | Published only, newest first | ☐ | ☐ |
| 6.1.2 | Date format | Per locale | ☐ | ☐ |
| 6.1.3 | Seed slugs | `mrfox-ecosystem-launch`, `foxy-app-update`, `creator-platform-engine` | ☐ | ☐ |
| 6.1.4 | Draft/scheduled slug | 404 on public | ☐ | ☐ |

### 6.2 Publish states (admin)

| State | Condition | Public list | Public detail | Admin badge | Pass |
|-------|-----------|-------------|---------------|-------------|------|
| Draft | `publishedAt` empty | Hidden | 404 | Draft · ยังไม่เผยแพร่ | ☐ |
| Scheduled | Future date (Bangkok) | Hidden | 404 | รอเผยแพร่ · date | ☐ |
| Published | Today or past | Visible | Opens | เผยแพร่แล้ว | ☐ |

| ID | Scenario | Pass | Fail |
|----|----------|------|------|
| 6.2.4 | Tomorrow date — not public today | ☐ | ☐ |
| 6.2.5 | After Bangkok midnight — goes public | ☐ | ☐ |
| 6.2.6 | View button disabled draft/scheduled | ☐ | ☐ |
| 6.2.7 | Change slug — old URL 404 | ☐ | ☐ |

---

## 7. About · Contact · Legal

| ID | Test | Pass | Fail |
|----|------|------|------|
| 7.1.1 | About vision, mission, roadmap | ☐ | ☐ |
| 7.2.1 | Contact — General | ☐ | ☐ |
| 7.2.2 | Contact — Business | ☐ | ☐ |
| 7.2.3 | Contact — Partnership | ☐ | ☐ |
| 7.2.4 | Contact — empty fields | ☐ | ☐ |
| 7.2.5 | Contact — invalid email | ☐ | ☐ |
| 7.2.6 | Contact — sending state | ☐ | ☐ |
| 7.2.7 | Contact — success replaces form | ☐ | ☐ |
| 7.2.8 | Audit log `contact_submit` | ☐ | ☐ |
| 7.2.9 | Webhook (if configured) | ☐ | ☐ |
| 7.3.1 | Privacy page 3 locales | ☐ | ☐ |
| 7.3.2 | Terms page 3 locales | ☐ | ☐ |

---

## 8. Search

| ID | Query / action | Expected | Pass | Fail |
|----|----------------|----------|------|------|
| 8.1.1 | Empty or 1 char | No search | ☐ | ☐ |
| 8.1.2 | `creator` | Platforms | ☐ | ☐ |
| 8.1.3 | `foxy` | Apps | ☐ | ☐ |
| 8.1.4 | `vote` | Features | ☐ | ☐ |
| 8.1.5 | `ecosystem` | News | ☐ | ☐ |
| 8.1.6 | `zzzznotfound` | No results | ☐ | ☐ |
| 8.1.7 | Results localized | Per locale | ☐ | ☐ |
| 8.1.8 | Draft not in results | Hidden | ☐ | ☐ |
| 8.1.9 | Click result → detail | Correct | ☐ | ☐ |
| 8.2.1 | `GET /api/search?q=foxy` | JSON apps | ☐ | ☐ |
| 8.2.2 | `GET /api/search?q=a` | Empty arrays | ☐ | ☐ |
| 8.3.1 | Header search icon | → `/[locale]/search` | ☐ | ☐ |

---

## 9. Navigation & layout

| ID | Test | Pass | Fail |
|----|------|------|------|
| 9.1 | Header links | ☐ | ☐ |
| 9.2 | Logo → home | ☐ | ☐ |
| 9.3 | Download apps → link.mrfox.app | ☐ | ☐ |
| 9.4 | Footer links | ☐ | ☐ |
| 9.5 | Mobile layout | ☐ | ☐ |
| 9.6 | Tablet / desktop | ☐ | ☐ |

---

## 10. Download tracking

| ID | Test | Pass | Fail |
|----|------|------|------|
| 10.1 | App Store click | ☐ | ☐ |
| 10.2 | Google Play click | ☐ | ☐ |
| 10.3 | APK click | ☐ | ☐ |
| 10.4 | Admin analytics increases | ☐ | ☐ |
| 10.5 | Home download stat increases | ☐ | ☐ |
| 10.6 | No links — disabled button | ☐ | ☐ |
| 10.7 | Invalid track API payload → 400 | ☐ | ☐ |

---

## 11. Admin — authentication

| ID | Test | Expected | Pass | Fail |
|----|------|----------|------|------|
| 11.1 | `/admin` no session | → login | ☐ | ☐ |
| 11.2 | Wrong password | Thai error | ☐ | ☐ |
| 11.3 | Admin login | Dashboard | ☐ | ☐ |
| 11.4 | Editor → `/admin/users` | Blocked | ☐ | ☐ |
| 11.5 | Logout | Cookie cleared | ☐ | ☐ |
| 11.6 | Session expiry (8h) | Re-login | ☐ | ☐ |
| 11.7 | Invalid cookie | → login | ☐ | ☐ |

---

## 12. Admin — dashboard

| ID | Test | Pass | Fail |
|----|------|------|------|
| 12.1 | Entity counts | ☐ | ☐ |
| 12.2 | Top apps by downloads | ☐ | ☐ |
| 12.3 | Recent audit log | ☐ | ☐ |

---

## 13. Admin — CRUD

### Platforms

| ID | Test | Pass | Fail |
|----|------|------|------|
| 13.1.1 | List 10 | ☐ | ☐ |
| 13.1.2 | Update text fields | ☐ | ☐ |
| 13.1.3 | Slug read-only | ☐ | ☐ |
| 13.1.4 | Toast on save | ☐ | ☐ |
| 13.1.5 | Public reflects change | ☐ | ☐ |

### Applications

| ID | Test | Pass | Fail |
|----|------|------|------|
| 13.2.1 | Create app | ☐ | ☐ |
| 13.2.2 | Featured checkbox | ☐ | ☐ |
| 13.2.3 | iOS + Android URLs | ☐ | ☐ |
| 13.2.4 | Delete app | ☐ | ☐ |
| 13.2.5 | No update UI (known) | ☐ | ☐ |

### Features

| ID | Test | Pass | Fail |
|----|------|------|------|
| 13.3.1 | List | ☐ | ☐ |
| 13.3.2 | Update fields | ☐ | ☐ |
| 13.3.3 | Slug/group read-only | ☐ | ☐ |

### News

| ID | Test | Pass | Fail |
|----|------|------|------|
| 13.4.1 | Create draft | ☐ | ☐ |
| 13.4.2 | Create scheduled | ☐ | ☐ |
| 13.4.3 | Create published | ☐ | ☐ |
| 13.4.4 | Update all fields | ☐ | ☐ |
| 13.4.5 | Delete | ☐ | ☐ |
| 13.4.6 | Duplicate slug error | ☐ | ☐ |

### Banners · Media · Users · Analytics

| ID | Test | Pass | Fail |
|----|------|------|------|
| 13.5.1 | Create/delete banner | ☐ | ☐ |
| 13.5.2 | Banner not on public (known) | ☐ | ☐ |
| 13.6.1 | Upload image OK | ☐ | ☐ |
| 13.6.2 | Upload >10MB fail | ☐ | ☐ |
| 13.6.3 | Wrong MIME fail | ☐ | ☐ |
| 13.6.4 | Upload without auth → 401 | ☐ | ☐ |
| 13.7.1 | Create user (admin only) | ☐ | ☐ |
| 13.7.2 | Cannot delete self | ☐ | ☐ |
| 13.8.1 | Analytics downloads by type | ☐ | ☐ |
| 13.8.2 | Analytics top apps | ☐ | ☐ |

---

## 14. SEO

| ID | Test | Pass | Fail |
|----|------|------|------|
| 14.1 | Home title + description | ☐ | ☐ |
| 14.2 | Detail pages metadata | ☐ | ☐ |
| 14.3 | Canonical URL | ☐ | ☐ |
| 14.4 | hreflang th/en/zh | ☐ | ☐ |
| 14.5 | OG tags + image | ☐ | ☐ |
| 14.6 | Sitemap dynamic slugs | ☐ | ☐ |
| 14.7 | Sitemap excludes privacy/terms | ☐ | ☐ |
| 14.8 | Draft news not in sitemap | ☐ | ☐ |

---

## 15. Edge cases

| ID | Scenario | Expected | Pass | Fail |
|----|----------|----------|------|------|
| 15.1 | Invalid entity slugs | 404 | ☐ | ☐ |
| 15.2 | Search form from `/en/apps` | Locale preserved | ☐ | ☐ |
| 15.3 | DB unavailable | health 503 | ☐ | ☐ |
| 15.4 | Matrix row group≠B status=no | Hidden on platform page | ☐ | ☐ |

---

## 16. Browser smoke

| ID | Test | Pass | Fail |
|----|------|------|------|
| 16.1 | Chrome desktop | ☐ | ☐ |
| 16.2 | Safari mobile | ☐ | ☐ |
| 16.3 | No critical console errors | ☐ | ☐ |

---

## 17. Known limitations — sign-off

| ID | Limitation | Accepted |
|----|------------|----------|
| L1 | Banners not on public site | ☐ |
| L2 | No application update in admin | ☐ |
| L3 | Feature matrix not editable in admin | ☐ |
| L4 | App names + some download strings not i18n | ☐ |
| L5 | Admin UI Thai only | ☐ |
| L6 | Contact: audit + webhook only, no email | ☐ |
| L7 | Media stored locally in `public/uploads/` | ☐ |

---

## Sign-off

| Area | Result | Tester | Date |
|------|--------|--------|------|
| Public (3 locales) | Pass / Fail | | |
| Admin CMS | Pass / Fail | | |
| News workflow | Pass / Fail | | |
| SEO | Pass / Fail | | |
| **Overall UAT** | **Pass / Fail** | | |

### Bugs found

| ID | Checklist ref | Steps | Severity | Status |
|----|---------------|-------|----------|--------|
| | | | P0/P1/P2 | Open/Fixed |

---

## Seed reference

**Categories:** creator, community, company, contest, exhibition  

**Platforms:** creator-specific, creator-multi-category, creator-single, community-specific, the-company, company-single, the-contest, contest-single, the-exhibition, exhibition-single  

**Apps:** foxy, the-expert, tom-thailand, the-alumni, miss-grand, exhibition-hub  

**News:** mrfox-ecosystem-launch, foxy-app-update, creator-platform-engine  

**Features (public Group B):** vote, gift, chat, voice-call, video-call, live, live-archive, unlock-photo, unlock-video, subscription, fan-club, marketplace, event, contest, exhibition, ticketing, membership, ranking
