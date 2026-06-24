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
  live?: boolean;
};

const FEATURE_VISUAL: Record<string, FeatureVisual> = {
  vote: {
    icon: HandCoins,
    borderHover: "hover:border-pink-500/40",
    iconWrap: "border-pink-500/20 bg-pink-500/5",
    iconColor: "text-pink-400",
  },
  gift: {
    icon: Gift,
    borderHover: "hover:border-yellow-500/40",
    iconWrap: "border-yellow-500/20 bg-yellow-500/5",
    iconColor: "text-yellow-400",
  },
  chat: {
    icon: MessageCircle,
    borderHover: "hover:border-blue-500/40",
    iconWrap: "border-blue-500/20 bg-blue-500/5",
    iconColor: "text-blue-400",
  },
  "voice-call": {
    icon: PhoneCall,
    borderHover: "hover:border-teal-500/40",
    iconWrap: "border-teal-500/20 bg-teal-500/5",
    iconColor: "text-teal-400",
  },
  "video-call": {
    icon: Video,
    borderHover: "hover:border-purple-500/40",
    iconWrap: "border-purple-500/20 bg-purple-500/5",
    iconColor: "text-purple-400",
  },
  live: {
    icon: Radio,
    borderHover: "hover:border-red-500/40",
    iconWrap: "border-red-500/20 bg-red-500/5",
    iconColor: "text-red-400",
    live: true,
  },
};

const DEFAULT_VISUAL: FeatureVisual = {
  icon: Sparkles,
  borderHover: "hover:border-[var(--vulpine-primary-container)]/40",
  iconWrap: "border-[var(--vulpine-primary-container)]/20 bg-[var(--vulpine-primary-container)]/5",
  iconColor: "text-[var(--vulpine-primary-container)]",
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
      <GlassCard
        hud
        className={cn(
          "relative flex h-full flex-col items-center p-6 text-center transition-all",
          visual.borderHover,
        )}
      >
        {visual.live ? (
          <div className="absolute top-2 right-2 flex items-center gap-1">
            <span className="size-1.5 animate-pulse rounded-full bg-red-500" />
            <span className="vulpine-label text-[8px] font-black text-red-500">LIVE</span>
          </div>
        ) : null}
        <div
          className={cn(
            "mb-4 flex size-16 items-center justify-center rounded-sm border transition-transform group-hover:scale-110",
            visual.iconWrap,
          )}
        >
          <Icon className={cn("size-7", visual.iconColor)} strokeWidth={2} />
        </div>
        <h3 className="vulpine-label text-xs font-bold text-[var(--vulpine-on-surface)] uppercase">
          {feature.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-[10px] leading-relaxed text-[var(--vulpine-on-surface-variant)] opacity-70">
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
        <h2 className="mb-12 text-center font-display text-2xl font-bold tracking-[0.2em] text-[var(--vulpine-on-surface)] uppercase md:text-3xl">
          {title}
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6 lg:gap-6">
          {features.map((feature) => (
            <FeatureCard key={feature.slug} feature={feature} exploreLabel={exploreLabel} />
          ))}
        </div>
      </div>
    </section>
  );
}
