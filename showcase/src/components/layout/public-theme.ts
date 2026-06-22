import { cn } from "@/lib/utils";

export const publicTheme = {
  shell: "min-h-screen bg-[var(--fox-cream)]",
  content: "mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8",
  contentNarrow: "mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8",
  card: "border-[#f0e4c3] bg-white/85 shadow-sm",
  cardHover:
    "transition-all hover:-translate-y-0.5 hover:border-[var(--fox-gold)]/40 hover:shadow-md",
  link: "text-[var(--fox-gold-dark)] transition-colors hover:text-[var(--fox-gold)]",
  input:
    "border-[#e8d49a] bg-white/90 text-[var(--fox-charcoal)] focus-visible:border-[var(--fox-gold)] focus-visible:ring-[var(--fox-gold)]/20",
  select:
    "h-9 rounded-lg border border-[#e8d49a] bg-white/90 px-3 text-sm text-[var(--fox-charcoal)] outline-none focus:border-[var(--fox-gold)] focus:ring-2 focus:ring-[var(--fox-gold)]/20",
  textarea:
    "rounded-lg border border-[#e8d49a] bg-white/90 px-3 py-2 text-sm text-[var(--fox-charcoal)] outline-none focus:border-[var(--fox-gold)] focus:ring-2 focus:ring-[var(--fox-gold)]/20",
  submitButton:
    "h-9 rounded-lg bg-[var(--fox-gold)] px-4 text-sm font-medium text-[var(--fox-charcoal)] transition-colors hover:bg-[var(--fox-gold-dark)]",
  badgeGold: "bg-[var(--fox-gold)] text-[var(--fox-charcoal)] hover:bg-[var(--fox-gold)]",
  badgeOutline:
    "border-[#e8d49a] bg-white/80 text-[var(--fox-charcoal)] hover:border-[var(--fox-gold)]/50 hover:bg-[#fff4cc]",
  heroBadge: "border-[#5c4a12] bg-[#ffc20e]/10 text-[#ffe08a]",
  prose:
    "prose prose-neutral max-w-none prose-headings:text-[var(--fox-charcoal)] prose-a:text-[var(--fox-gold-dark)]",
} as const;

export function themedCard(className?: string) {
  return cn(publicTheme.card, publicTheme.cardHover, className);
}
