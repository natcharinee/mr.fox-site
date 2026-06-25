import { cn } from "@/lib/utils";

export const publicTheme = {
  shell: "vulpine-shell min-h-screen",
  content: "mx-auto max-w-[1200px] px-4 py-16 sm:px-6 md:px-16 lg:px-16",
  contentNarrow: "mx-auto max-w-3xl px-4 py-16 sm:px-6 md:px-16",
  section: "py-16 md:py-24",
  card:
    "rounded-2xl border border-white/8 bg-[rgba(18,20,20,0.4)] shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-2xl",
  cardHover:
    "transition-all hover:-translate-y-0.5 vulpine-glow-hover hover:border-[var(--vulpine-primary-container)]/30",
  link: "text-[var(--vulpine-primary-container)] transition-colors hover:text-[var(--vulpine-primary)]",
  input:
    "border-white/10 bg-[var(--vulpine-surface-container)] text-[var(--vulpine-on-surface)] focus-visible:border-[var(--vulpine-primary-container)] focus-visible:ring-[var(--vulpine-primary-container)]/20",
  select:
    "h-9 rounded-xl border border-white/10 bg-[var(--vulpine-surface-container)] px-3 text-sm text-[var(--vulpine-on-surface)] outline-none focus:border-[var(--vulpine-primary-container)] focus:ring-2 focus:ring-[var(--vulpine-primary-container)]/20",
  textarea:
    "rounded-xl border border-white/10 bg-[var(--vulpine-surface-container)] px-3 py-2 text-sm text-[var(--vulpine-on-surface)] outline-none focus:border-[var(--vulpine-primary-container)] focus:ring-2 focus:ring-[var(--vulpine-primary-container)]/20",
  submitButton:
    "h-9 rounded-xl bg-[var(--vulpine-primary-container)] px-4 text-sm font-bold text-[var(--vulpine-on-primary)] transition-all hover:brightness-110 vulpine-btn-glow",
  badgeGold:
    "bg-[var(--vulpine-primary-container)] text-[var(--vulpine-on-primary)] hover:bg-[var(--vulpine-primary-container)]",
  badgeOutline:
    "border-white/15 bg-white/5 text-[var(--vulpine-on-surface)] hover:border-[var(--vulpine-primary-container)]/40 hover:bg-[var(--vulpine-primary-container)]/10",
  heroBadge:
    "border-[var(--vulpine-primary-container)]/30 bg-[var(--vulpine-primary-container)]/10 text-[var(--vulpine-primary)]",
  prose:
    "prose prose-invert max-w-none prose-headings:font-display prose-headings:text-[var(--vulpine-on-surface)] prose-a:text-[var(--vulpine-primary-container)]",
  pageGrid: "mx-auto max-w-[1200px] px-4 py-12 md:px-16",
  cardTitle: "font-display text-[var(--vulpine-on-surface)]",
  cardTitleLink:
    "transition-colors hover:text-[var(--vulpine-primary-container)]",
  cardDescription: "text-[var(--vulpine-on-surface-variant)]",
  sectionTitle:
    "mb-4 font-display text-lg font-semibold text-[var(--vulpine-on-surface)]",
  label: "text-sm font-medium text-[var(--vulpine-on-surface)]",
  emptyState:
    "rounded-2xl border border-dashed border-white/15 bg-white/5 px-6 py-12 text-center text-[var(--vulpine-on-surface-variant)]",
  muted: "text-[var(--vulpine-on-surface-variant)]",
} as const;

export function themedCard(className?: string) {
  return cn(publicTheme.card, publicTheme.cardHover, className);
}
