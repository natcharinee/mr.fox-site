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
  iconIdle: string;
  live?: boolean;
};

const FEATURE_VISUAL: Record<string, FeatureVisual> = {
  "public-post": { icon: FileText, iconIdle: "feature-icon-idle-chat" },
  "photo-album": { icon: Images, iconIdle: "feature-icon-idle-chat" },
  "video-post": { icon: Video, iconIdle: "feature-icon-idle-video" },
  follow: { icon: UserPlus, iconIdle: "feature-icon-idle-chat" },
  like: { icon: Heart, iconIdle: "feature-icon-idle-chat" },
  comment: { icon: MessageSquare, iconIdle: "feature-icon-idle-chat" },
  share: { icon: Share2, iconIdle: "feature-icon-idle-chat" },
  ranking: { icon: Trophy, iconIdle: "feature-icon-idle-chat" },
  vote: { icon: HandCoins, iconIdle: "feature-icon-idle-vote" },
  gift: { icon: Gift, iconIdle: "feature-icon-idle-gift" },
  wallet: { icon: Wallet, iconIdle: "feature-icon-idle-chat" },
  chat: { icon: MessageCircle, iconIdle: "feature-icon-idle-chat" },
  "voice-call": { icon: PhoneCall, iconIdle: "feature-icon-idle-voice" },
  "video-call": { icon: Video, iconIdle: "feature-icon-idle-video" },
  live: { icon: Radio, iconIdle: "feature-icon-idle-live", live: true },
  "live-archive": { icon: Archive, iconIdle: "feature-icon-idle-chat" },
  "unlock-photo": { icon: Images, iconIdle: "feature-icon-idle-chat" },
  "unlock-video": { icon: Video, iconIdle: "feature-icon-idle-video" },
  subscription: { icon: Star, iconIdle: "feature-icon-idle-chat" },
  "fan-club": { icon: Award, iconIdle: "feature-icon-idle-chat" },
  marketplace: { icon: ShoppingBag, iconIdle: "feature-icon-idle-chat" },
  event: { icon: Calendar, iconIdle: "feature-icon-idle-chat" },
  contest: { icon: Medal, iconIdle: "feature-icon-idle-chat" },
  "creator-directory": { icon: BookUser, iconIdle: "feature-icon-idle-chat" },
};

const DEFAULT_VISUAL: FeatureVisual = {
  icon: Sparkles,
  iconIdle: "feature-icon-idle-chat",
};

/** Soft spotlight order — style only, same card size for everyone. */
const FEATURED_SLUGS = new Set([
  "live",
  "vote",
  "gift",
  "chat",
  "ranking",
  "wallet",
]);

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
  const accent = FEATURED_SLUGS.has(feature.slug);

  return (
    <Link
      href={`/features/${feature.slug}`}
      className="feature-card-enter group block h-full motion-reduce:animate-none"
      style={{ animationDelay: `${Math.min(index, 16) * 40}ms` }}
      aria-label={feature.name}
    >
      <GlassCard
        className={cn(
          "relative flex h-full min-h-[10.5rem] flex-col overflow-hidden p-5 transition-all duration-300 sm:min-h-[11.5rem] sm:p-6",
          "group-hover:-translate-y-1 group-hover:border-[var(--vulpine-primary-container)]/40",
          "group-hover:shadow-[0_0_28px_rgba(255,184,0,0.12)]",
          accent && "border-[var(--vulpine-primary-container)]/20",
        )}
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--vulpine-primary-container)]/50 to-transparent opacity-70"
          aria-hidden
        />
        <div
          className={cn(
            "pointer-events-none absolute -right-8 -top-10 size-28 rounded-full blur-3xl transition-opacity duration-500",
            accent
              ? "bg-[var(--vulpine-primary-container)]/14 opacity-100"
              : "bg-[var(--vulpine-primary-container)]/8 opacity-0 group-hover:opacity-100",
          )}
          aria-hidden
        />

        {visual.live ? (
          <div className="absolute top-3.5 right-3.5 z-10 flex items-center gap-1.5">
            <span className="size-1.5 animate-pulse rounded-full bg-[var(--vulpine-primary-container)] shadow-[0_0_8px_rgba(255,184,0,0.85)]" />
            <span className="vulpine-label text-[10px] font-black tracking-wider text-[var(--vulpine-primary-container)]">
              LIVE
            </span>
          </div>
        ) : null}

        <div
          className={cn(
            "feature-icon-wrap relative mb-3.5 flex size-12 items-center justify-center rounded-xl border sm:mb-4 sm:size-[3.25rem]",
            "border-[var(--vulpine-primary-container)]/25 bg-[var(--vulpine-primary-container)]/8",
            "transition-transform duration-300 group-hover:scale-110 group-hover:border-[var(--vulpine-primary-container)]/45",
            "group-hover:shadow-[0_0_22px_rgba(255,184,0,0.28)]",
          )}
        >
          <Icon
            className={cn(
              "relative z-10 size-5 text-[var(--vulpine-primary-container)] sm:size-6",
              visual.iconIdle,
              "motion-reduce:animate-none",
            )}
            strokeWidth={2}
          />
        </div>

        <h3 className="relative font-display text-sm font-bold tracking-wide text-[var(--vulpine-on-surface)] uppercase transition-colors group-hover:text-[var(--vulpine-primary-container)] sm:text-[0.95rem]">
          {feature.name}
        </h3>
        <p className="relative mt-2 line-clamp-3 text-sm leading-relaxed text-[var(--vulpine-on-surface-variant)]">
          {feature.description ?? exploreLabel}
        </p>
      </GlassCard>
    </Link>
  );
}

export function CoreFeaturesGrid({ title, exploreLabel, features }: CoreFeaturesGridProps) {
  const ordered = [
    ...features.filter((f) => FEATURED_SLUGS.has(f.slug)),
    ...features.filter((f) => !FEATURED_SLUGS.has(f.slug)),
  ];

  return (
    <section
      id="core-features"
      className="relative scroll-mt-24 overflow-hidden border-y border-white/5 bg-[var(--vulpine-surface-container-lowest)] py-16 md:py-24"
    >
      <div className="vulpine-scanline opacity-20" aria-hidden />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(ellipse_55%_70%_at_50%_0%,rgba(255,184,0,0.07),transparent)]"
        aria-hidden
      />
      <PageWidth className="relative">
        <div className="mb-10 text-center sm:mb-12">
          <p className="vulpine-label mb-3 text-sm text-[var(--vulpine-primary-container)]">
            Platform Modules
          </p>
          <h2 className="font-display text-3xl font-bold tracking-[0.15em] text-[var(--vulpine-on-surface)] uppercase sm:text-4xl">
            {title}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-5">
          {ordered.map((feature, index) => (
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
