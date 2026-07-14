import { Sparkles, Trophy, Users, type LucideIcon } from "lucide-react";

export const CATEGORY_ORDER = ["creator", "community", "contest"] as const;

export const CATEGORY_IMAGE: Record<(typeof CATEGORY_ORDER)[number], string> = {
  creator: "/platforms/ecosystem/creator-live.png",
  community: "/platforms/ecosystem/community-live.png",
  contest: "/platforms/ecosystem/contest-live.png",
};

export type CategoryTheme = {
  icon: LucideIcon;
  header: string;
  iconWrap: string;
  pill: string;
  cardHover: string;
  accent: string;
  borderAccent: string;
};

const GOLD_BRIGHT: Omit<CategoryTheme, "icon"> = {
  header:
    "border-[var(--vulpine-primary-container)]/30 bg-gradient-to-br from-[var(--vulpine-primary-container)]/14 to-[var(--vulpine-surface-container-low)]",
  iconWrap:
    "bg-[var(--vulpine-primary-container)]/22 text-[var(--vulpine-primary)] ring-1 ring-[var(--vulpine-primary-container)]/25",
  pill: "border-[var(--vulpine-primary-container)]/40 bg-[var(--vulpine-primary-container)]/16 text-[var(--vulpine-primary)]",
  cardHover:
    "hover:border-[var(--vulpine-primary-container)]/45 hover:shadow-[var(--vulpine-primary-container)]/12",
  accent: "text-[var(--vulpine-primary-container)]",
  borderAccent: "border-l-[var(--vulpine-primary-container)]",
};

const GOLD_SOFT: Omit<CategoryTheme, "icon"> = {
  header:
    "border-[var(--vulpine-primary-container)]/25 bg-gradient-to-br from-[var(--vulpine-primary-container)]/10 to-[var(--vulpine-surface-container-low)]",
  iconWrap:
    "bg-[var(--vulpine-primary-container)]/18 text-[var(--vulpine-primary)] ring-1 ring-[var(--vulpine-primary-container)]/20",
  pill: "border-[var(--vulpine-primary-container)]/35 bg-[var(--vulpine-primary-container)]/12 text-[var(--vulpine-primary)]",
  cardHover:
    "hover:border-[var(--vulpine-primary-container)]/40 hover:shadow-[var(--vulpine-primary-container)]/10",
  accent: "text-[var(--vulpine-primary-container)]",
  borderAccent: "border-l-[var(--vulpine-primary-container)]/85",
};

const GOLD_MUTED: Omit<CategoryTheme, "icon"> = {
  header:
    "border-[var(--vulpine-primary-container)]/20 bg-gradient-to-br from-[var(--vulpine-primary-container)]/8 to-[var(--vulpine-surface-container-low)]",
  iconWrap:
    "bg-[var(--vulpine-primary-container)]/14 text-[var(--vulpine-primary)] ring-1 ring-[var(--vulpine-primary-container)]/18",
  pill: "border-[var(--vulpine-primary-container)]/30 bg-[var(--vulpine-primary-container)]/10 text-[var(--vulpine-primary)]",
  cardHover:
    "hover:border-[var(--vulpine-primary-container)]/35 hover:shadow-[var(--vulpine-primary-container)]/8",
  accent: "text-[var(--vulpine-primary-container)]",
  borderAccent: "border-l-[var(--vulpine-primary-container)]/70",
};

export const CATEGORY_THEME: Record<string, CategoryTheme> = {
  creator: { icon: Sparkles, ...GOLD_BRIGHT },
  community: { icon: Users, ...GOLD_SOFT },
  contest: { icon: Trophy, ...GOLD_MUTED },
};
