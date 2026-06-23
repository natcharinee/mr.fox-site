import {
  Gift,
  HandCoins,
  MessageCircle,
  PhoneCall,
  Radio,
  Sparkles,
  Video,
  type LucideIcon,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type Feature = {
  slug: string;
  name: string;
  description: string | null;
};

type FeatureVisual = {
  icon: LucideIcon;
  iconWrap: string;
  cardHover: string;
  accent: string;
  live?: boolean;
};

const FEATURE_VISUAL: Record<string, FeatureVisual> = {
  vote: {
    icon: HandCoins,
    iconWrap: "bg-gradient-to-br from-rose-100 to-rose-50 text-rose-600 ring-rose-200/80",
    cardHover: "hover:border-rose-200 hover:shadow-rose-100/80",
    accent: "text-rose-600",
  },
  gift: {
    icon: Gift,
    iconWrap:
      "bg-gradient-to-br from-[#fff4cc] to-amber-50 text-[var(--fox-gold-dark)] ring-[#e8d49a]/90",
    cardHover: "hover:border-[var(--fox-gold)]/40 hover:shadow-[var(--fox-gold)]/10",
    accent: "text-[var(--fox-gold-dark)]",
  },
  chat: {
    icon: MessageCircle,
    iconWrap: "bg-gradient-to-br from-sky-100 to-sky-50 text-sky-700 ring-sky-200/80",
    cardHover: "hover:border-sky-200 hover:shadow-sky-100/80",
    accent: "text-sky-700",
  },
  "voice-call": {
    icon: PhoneCall,
    iconWrap: "bg-gradient-to-br from-teal-100 to-teal-50 text-teal-700 ring-teal-200/80",
    cardHover: "hover:border-teal-200 hover:shadow-teal-100/80",
    accent: "text-teal-700",
  },
  "video-call": {
    icon: Video,
    iconWrap: "bg-gradient-to-br from-violet-100 to-violet-50 text-violet-700 ring-violet-200/80",
    cardHover: "hover:border-violet-200 hover:shadow-violet-100/80",
    accent: "text-violet-700",
  },
  live: {
    icon: Radio,
    iconWrap: "bg-gradient-to-br from-orange-100 to-orange-50 text-orange-700 ring-orange-200/80",
    cardHover: "hover:border-orange-200 hover:shadow-orange-100/80",
    accent: "text-orange-700",
    live: true,
  },
};

const DEFAULT_VISUAL: FeatureVisual = {
  icon: Sparkles,
  iconWrap: "bg-gradient-to-br from-[#fff4cc] to-white text-[var(--fox-gold-dark)] ring-[#e8d49a]/80",
  cardHover: "hover:border-[var(--fox-gold)]/40 hover:shadow-[var(--fox-gold)]/10",
  accent: "text-[var(--fox-gold-dark)]",
};

type CoreFeaturesGridProps = {
  title: string;
  exploreLabel: string;
  features: Feature[];
};

function FeatureCard({
  feature,
  exploreLabel,
}: {
  feature: Feature;
  exploreLabel: string;
}) {
  const visual = FEATURE_VISUAL[feature.slug] ?? DEFAULT_VISUAL;
  const Icon = visual.icon;

  return (
    <Link href={`/features/${feature.slug}`} className="group block h-full">
      <article
        className={cn(
          "relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#f0e4c3] bg-white p-5 shadow-sm transition-all duration-300",
          "hover:-translate-y-1 hover:shadow-lg",
          visual.cardHover,
        )}
      >
        <div
          className={cn(
            "flex size-12 items-center justify-center rounded-2xl ring-1 transition-transform duration-300 group-hover:scale-105",
            visual.iconWrap,
          )}
        >
          <Icon className="size-6" strokeWidth={2.25} />
        </div>

        <div className="mt-4 flex items-center gap-2">
          <h3 className="text-base font-bold text-[var(--fox-charcoal)]">{feature.name}</h3>
          {visual.live ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-red-600">
              <span className="size-1.5 animate-pulse rounded-full bg-red-500" />
              Live
            </span>
          ) : null}
        </div>

        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
          {feature.description}
        </p>

        <p
          className={cn(
            "mt-4 text-xs font-semibold uppercase tracking-wider opacity-0 transition-opacity duration-300 group-hover:opacity-100",
            visual.accent,
          )}
        >
          {exploreLabel} →
        </p>
      </article>
    </Link>
  );
}

export function CoreFeaturesGrid({ title, exploreLabel, features }: CoreFeaturesGridProps) {
  return (
    <section className="border-t border-[#f0e4c3] bg-gradient-to-b from-white/80 to-[var(--fox-cream)]/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="h-9 w-1 rounded-full bg-[var(--fox-gold)]" />
          <h2 className="text-2xl font-bold text-[var(--fox-charcoal)]">{title}</h2>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.slug} feature={feature} exploreLabel={exploreLabel} />
          ))}
        </div>
      </div>
    </section>
  );
}
