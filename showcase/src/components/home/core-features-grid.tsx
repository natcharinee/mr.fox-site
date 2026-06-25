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
import { GlassCard } from "@/components/vulpine/vulpine-primitives";
import { cn } from "@/lib/utils";

type Feature = {
  slug: string;
  name: string;
  description: string | null;
};

type FeatureVisual = {
  icon: LucideIcon;
  borderHover: string;
  iconWrap: string;
  iconColor: string;
  iconIdle: string;
  iconGlow: string;
  live?: boolean;
};

const GOLD_FEATURE_STYLE = {
  borderHover:
    "hover:border-[var(--vulpine-primary-container)]/45 hover:shadow-[0_0_24px_rgba(255,184,0,0.14)]",
  iconWrap:
    "border-[var(--vulpine-primary-container)]/25 bg-[var(--vulpine-primary-container)]/8",
  iconColor: "text-[var(--vulpine-primary-container)]",
  iconGlow: "group-hover:shadow-[0_0_22px_rgba(255,184,0,0.32)]",
} as const;

const FEATURE_VISUAL: Record<string, FeatureVisual> = {
  vote: {
    icon: HandCoins,
    ...GOLD_FEATURE_STYLE,
    iconIdle: "feature-icon-idle-vote",
  },
  gift: {
    icon: Gift,
    ...GOLD_FEATURE_STYLE,
    iconIdle: "feature-icon-idle-gift",
  },
  chat: {
    icon: MessageCircle,
    ...GOLD_FEATURE_STYLE,
    iconIdle: "feature-icon-idle-chat",
  },
  "voice-call": {
    icon: PhoneCall,
    ...GOLD_FEATURE_STYLE,
    iconIdle: "feature-icon-idle-voice",
  },
  "video-call": {
    icon: Video,
    ...GOLD_FEATURE_STYLE,
    iconIdle: "feature-icon-idle-video",
  },
  live: {
    icon: Radio,
    ...GOLD_FEATURE_STYLE,
    iconIdle: "feature-icon-idle-live",
    live: true,
  },
};

const DEFAULT_VISUAL: FeatureVisual = {
  icon: Sparkles,
  ...GOLD_FEATURE_STYLE,
  iconIdle: "feature-icon-idle-chat",
};

type CoreFeaturesGridProps = {
  title: string;
  exploreLabel: string;
  features: Feature[];
};

function FeatureCard({
  feature,
  exploreLabel,
  index,
}: {
  feature: Feature;
  exploreLabel: string;
  index: number;
}) {
  const visual = FEATURE_VISUAL[feature.slug] ?? DEFAULT_VISUAL;
  const Icon = visual.icon;

  return (
    <Link
      href={`/features/${feature.slug}`}
      className="feature-card-enter group block h-full motion-reduce:animate-none"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <GlassCard
        className={cn(
          "relative flex h-full flex-col items-center p-7 text-center transition-all duration-300 group-hover:-translate-y-1 sm:p-8",
          visual.borderHover,
        )}
      >
        {visual.live ? (
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
            <span className="size-2 animate-pulse rounded-full bg-[var(--vulpine-primary-container)] shadow-[0_0_8px_rgba(255,184,0,0.8)]" />
            <span className="vulpine-label text-xs font-black text-[var(--vulpine-primary-container)] sm:text-sm">
              LIVE
            </span>
          </div>
        ) : null}
        <div
          className={cn(
            "feature-icon-wrap mb-5 flex size-[4.5rem] items-center justify-center rounded-2xl border sm:size-20",
            "group-hover:scale-110 group-hover:border-[var(--vulpine-primary-container)]/40",
            visual.iconWrap,
            visual.iconGlow,
          )}
        >
          <Icon
            className={cn(
              "relative z-10 size-8 sm:size-9",
              visual.iconColor,
              visual.iconIdle,
              "motion-reduce:animate-none",
            )}
            strokeWidth={2}
          />
        </div>
        <h3 className="font-display text-sm font-bold tracking-wide text-[var(--vulpine-on-surface)] uppercase transition-colors group-hover:text-[var(--vulpine-primary-container)] sm:text-base">
          {feature.name}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[var(--vulpine-on-surface-variant)] transition-opacity group-hover:opacity-100 sm:text-base sm:leading-relaxed">
          {feature.description ?? exploreLabel}
        </p>
      </GlassCard>
    </Link>
  );
}

export function CoreFeaturesGrid({ title, exploreLabel, features }: CoreFeaturesGridProps) {
  return (
    <section className="relative overflow-hidden border-y border-white/5 bg-[var(--vulpine-surface-container-lowest)] py-16 md:py-24">
      <div className="vulpine-scanline opacity-20" aria-hidden />
      <div className="relative mx-auto max-w-[1200px] px-4 md:px-16">
        <h2 className="mb-12 text-center font-display text-3xl font-bold tracking-[0.15em] text-[var(--vulpine-on-surface)] uppercase sm:text-4xl">
          {title}
        </h2>
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 md:gap-6 lg:grid-cols-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.slug}
              feature={feature}
              exploreLabel={exploreLabel}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
