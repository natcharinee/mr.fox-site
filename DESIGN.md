# Mr.FOX Design Tokens

> Shared design system — Showcase (Next.js) · Engine Admin (Next.js) · Engine Mobile (Flutter)

## Brand

| Token | Value | Usage |
|-------|-------|-------|
| `--fox-orange` | `#F97316` | Primary brand, CTAs |
| `--fox-orange-dark` | `#EA580C` | Hover states |
| `--fox-charcoal` | `#1C1917` | Headings, dark backgrounds |
| `--fox-slate` | `#64748B` | Body secondary text |

## Typography

| Token | Value |
|-------|-------|
| Font family | **Prompt** (Thai + Latin) |
| Heading weight | 600–700 |
| Body weight | 400 |
| Body size | 16px base |

## Spacing Scale

`4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96` (px)

## Radius

| Token | Value |
|-------|-------|
| `--radius-sm` | 6px |
| `--radius-md` | 10px |
| `--radius-lg` | 16px |
| `--radius-xl` | 24px |

## Flutter Export

Map to `ThemeData` in `engine/mobile/lib/theme/tokens.dart`:
- `foxOrange` = `Color(0xFFF97316)`
- `foxCharcoal` = `Color(0xFF1C1917)`
