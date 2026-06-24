import {
  Building2,
  CalendarRange,
  Sparkles,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";

export const CATEGORY_ORDER = [
  "creator",
  "community",
  "company",
  "contest",
  "exhibition",
] as const;

export type CategoryTheme = {
  icon: LucideIcon;
  header: string;
  iconWrap: string;
  pill: string;
  cardHover: string;
  accent: string;
  border: string;
};

export const CATEGORY_THEME: Record<string, CategoryTheme> = {
  creator: {
    icon: Sparkles,
    header:
      "border-[var(--vulpine-primary-container)]/30 bg-gradient-to-br from-[var(--vulpine-primary-container)]/12 to-[var(--vulpine-surface-container)]",
    iconWrap:
      "bg-[var(--vulpine-primary-container)]/20 text-[var(--vulpine-primary)]",
    pill: "border-[var(--vulpine-primary-container)]/40 bg-[var(--vulpine-primary-container)]/15 text-[var(--vulpine-primary)]",
    cardHover:
      "hover:border-[var(--vulpine-primary-container)]/45 hover:shadow-[var(--vulpine-primary-container)]/10",
    accent: "text-[var(--vulpine-primary)]",
    border: "border-l-[var(--vulpine-primary-container)]",
  },
  community: {
    icon: Users,
    header:
      "border-teal-500/30 bg-gradient-to-br from-teal-500/10 to-[var(--vulpine-surface-container)]",
    iconWrap: "bg-teal-500/20 text-teal-300",
    pill: "border-teal-500/40 bg-teal-500/15 text-teal-300",
    cardHover: "hover:border-teal-400/50 hover:shadow-teal-500/10",
    accent: "text-teal-300",
    border: "border-l-teal-400",
  },
  company: {
    icon: Building2,
    header:
      "border-slate-400/30 bg-gradient-to-br from-slate-400/10 to-[var(--vulpine-surface-container)]",
    iconWrap: "bg-slate-400/20 text-slate-300",
    pill: "border-slate-400/40 bg-slate-400/15 text-slate-300",
    cardHover: "hover:border-slate-300/50 hover:shadow-slate-400/10",
    accent: "text-slate-300",
    border: "border-l-slate-400",
  },
  contest: {
    icon: Trophy,
    header:
      "border-rose-500/30 bg-gradient-to-br from-rose-500/10 to-[var(--vulpine-surface-container)]",
    iconWrap: "bg-rose-500/20 text-rose-300",
    pill: "border-rose-500/40 bg-rose-500/15 text-rose-300",
    cardHover: "hover:border-rose-400/50 hover:shadow-rose-500/10",
    accent: "text-rose-300",
    border: "border-l-rose-400",
  },
  exhibition: {
    icon: CalendarRange,
    header:
      "border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-[var(--vulpine-surface-container)]",
    iconWrap: "bg-violet-500/20 text-violet-300",
    pill: "border-violet-500/40 bg-violet-500/15 text-violet-300",
    cardHover: "hover:border-violet-400/50 hover:shadow-violet-500/10",
    accent: "text-violet-300",
    border: "border-l-violet-400",
  },
};
