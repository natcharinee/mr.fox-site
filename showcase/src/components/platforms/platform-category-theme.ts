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
    header: "border-[#e8d49a] bg-gradient-to-br from-[#fff8e1] to-white",
    iconWrap: "bg-[#fff4cc] text-[var(--fox-gold-dark)]",
    pill: "border-[#e8d49a] bg-[#fff4cc]/80 text-[var(--fox-gold-dark)]",
    cardHover: "hover:border-[var(--fox-gold)]/45 hover:shadow-[var(--fox-gold)]/10",
    accent: "text-[var(--fox-gold-dark)]",
    border: "border-l-[var(--fox-gold)]",
  },
  community: {
    icon: Users,
    header: "border-teal-200 bg-gradient-to-br from-teal-50 to-white",
    iconWrap: "bg-teal-100 text-teal-800",
    pill: "border-teal-200 bg-teal-50 text-teal-800",
    cardHover: "hover:border-teal-300 hover:shadow-teal-100",
    accent: "text-teal-700",
    border: "border-l-teal-500",
  },
  company: {
    icon: Building2,
    header: "border-slate-200 bg-gradient-to-br from-slate-50 to-white",
    iconWrap: "bg-slate-100 text-slate-700",
    pill: "border-slate-200 bg-slate-50 text-slate-700",
    cardHover: "hover:border-slate-300 hover:shadow-slate-100",
    accent: "text-slate-700",
    border: "border-l-slate-500",
  },
  contest: {
    icon: Trophy,
    header: "border-rose-200 bg-gradient-to-br from-rose-50 to-white",
    iconWrap: "bg-rose-100 text-rose-800",
    pill: "border-rose-200 bg-rose-50 text-rose-800",
    cardHover: "hover:border-rose-300 hover:shadow-rose-100",
    accent: "text-rose-700",
    border: "border-l-rose-500",
  },
  exhibition: {
    icon: CalendarRange,
    header: "border-violet-200 bg-gradient-to-br from-violet-50 to-white",
    iconWrap: "bg-violet-100 text-violet-800",
    pill: "border-violet-200 bg-violet-50 text-violet-800",
    cardHover: "hover:border-violet-300 hover:shadow-violet-100",
    accent: "text-violet-700",
    border: "border-l-violet-500",
  },
};
