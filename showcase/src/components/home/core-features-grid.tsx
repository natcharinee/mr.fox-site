import {
  Archive,
  Award,
  BookUser,
  Calendar,
  FileText,
  Gift,
  HandCoins,
  Heart,
  Images,
  MessageCircle,
  MessageSquare,
  Medal,
  PhoneCall,
  Radio,
  Share2,
  ShoppingBag,
  Sparkles,
  Star,
  Trophy,
  UserPlus,
  Video,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { GlassCard } from "@/components/vulpine/vulpine-primitives";
import { PageWidth } from "@/components/layout/page-width";
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

function featureVisual(
  icon: LucideIcon,
  iconIdle = "feature-icon-idle-chat",
  extras?: Partial<FeatureVisual>,
): FeatureVisual {
  return { icon, ...GOLD_FEATURE_STYLE, iconIdle, ...extras };
}

const FEATURE_VISUAL: Record<string, FeatureVisual> = {
  "public-post": featureVisual(FileText),
  "photo-album": featureVisual(Images),
  "video-post": featureVisual(Video, "feature-icon-idle-video"),
  follow: featureVisual(UserPlus),
  like: featureVisual(Heart),
  comment: featureVisual(MessageSquare),
  share: featureVisual(Share2),
  ranking: featureVisual(Trophy),
  vote: featureVisual(HandCoins, "feature-icon-idle-vote"),
  gift: featureVisual(Gift, "feature-icon-idle-gift"),
  wallet: featureVisual(Wallet),
  chat: featureVisual(MessageCircle, "feature-icon-idle-chat"),
  "voice-call": featureVisual(PhoneCall, "feature-icon-idle-voice"),
  "video-call": featureVisual(Video, "feature-icon-idle-video"),
  live: featureVisual(Radio, "feature-icon-idle-live", { live: true }),
  "live-archive": featureVisual(Archive),
  "unlock-photo": featureVisual(Images),
  "unlock-video": featureVisual(Video, "feature-icon-idle-video"),
  subscription: featureVisual(Star),
  "fan-club": featureVisual(Award),
  marketplace: featureVisual(ShoppingBag),
  event: featureVisual(Calendar),
  contest: featureVisual(Medal),
  "creator-directory": featureVisual(BookUser),
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
      style={{ animationDelay: `${Math.min(index, 12) * 50}ms` }}
    >
      <GlassCard
        className={cn(
          "relative flex h-full flex-col items-center p-5 text-center transition-all duration-300 group-hover:-translate-y-1 sm:p-6",
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
            "feature-icon-wrap mb-4 flex size-16 items-center justify-center rounded-2xl border sm:mb-5 sm:size-[4.5rem]",
            "group-hover:scale-110 group-hover:border-[var(--vulpine-primary-container)]/40",
            visual.iconWrap,
            visual.iconGlow,
          )}
        >
          <Icon
            className={cn(
              "relative z-10 size-7 sm:size-8",
              visual.iconColor,
              visual.iconIdle,
              "motion-reduce:animate-none",
            )}
            strokeWidth={2}
          />
        </div>
        <h3 className="font-display text-xs font-bold tracking-wide text-[var(--vulpine-on-surface)] uppercase transition-colors group-hover:text-[var(--vulpine-primary-container)] sm:text-sm">
          {feature.name}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-[var(--vulpine-on-surface-variant)] transition-opacity group-hover:opacity-100 sm:line-clamp-3 sm:text-base sm:leading-relaxed">
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
      <PageWidth className="relative">
        <h2 className="mb-10 text-center font-display text-3xl font-bold tracking-[0.15em] text-[var(--vulpine-on-surface)] uppercase sm:mb-12 sm:text-4xl">
          {title}
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-5 lg:grid-cols-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.slug}
              feature={feature}
              exploreLabel={exploreLabel}
              index={index}
            />
          ))}
        </div>
      </PageWidth>
    </section>
  );
}
