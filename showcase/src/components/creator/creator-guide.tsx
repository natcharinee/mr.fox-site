import {
  ArrowRight,
  Check,
  Coins,
  ExternalLink,
  Layers,
  MessageCircle,
  Play,
  Rocket,
  Smartphone,
  Sparkles,
  X,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { SectionHeading } from "@/components/layout/section-heading";
import { publicTheme, themedCard } from "@/components/layout/public-theme";
import { CATEGORY_THEME } from "@/components/platforms/platform-category-theme";
import { GlassCard } from "@/components/vulpine/vulpine-primitives";
import { LinkButton } from "@/components/ui/link-button";
import { buttonVariants } from "@/components/ui/button";
import { MRFOX_LINE_URL } from "@/lib/contact/social-links";
import { MRFOX_APP_DOWNLOAD_URL } from "@/lib/app-download";
import { extractYoutubeId } from "@/lib/youtube";
import { cn } from "@/lib/utils";

type GuideBenefit = { title: string; description: string };
type GuideCompareRow = { label: string; fox: string; others: string };
type GuideStep = { title: string; description: string };
type GuideFormatFit = { slug: string; fit: string };

type PlatformType = {
  slug: string;
  name: string;
  concept: string | null;
  shortDescription: string | null;
  categorySlug: string;
  categoryName: string;
};

export type CreatorGuideContent = {
  intro: { eyebrow: string; title: string; description: string };
  benefits: { eyebrow: string; title: string; items: GuideBenefit[] };
  compare: {
    eyebrow: string;
    title: string;
    columns: { fox: string; others: string };
    rows: GuideCompareRow[];
  };
  registration: {
    eyebrow: string;
    title: string;
    description: string;
    posterAlt: string;
    videoId: string;
    caption?: string;
    openLabel: string;
    placeholder: string;
  };
  steps: { eyebrow: string; title: string; items: GuideStep[] };
  formats: {
    eyebrow: string;
    title: string;
    description: string;
    pickLabel: string;
    viewDetails: string;
    types: GuideFormatFit[];
  };
  cta: {
    title: string;
    description: string;
    apps: string;
    contact: string;
  };
};

const BENEFIT_ICONS = [Coins, Smartphone, Layers, Sparkles] as const;
const STEP_ICONS = [Sparkles, MessageCircle, Layers, Rocket] as const;

function RegistrationVideo({
  content,
}: {
  content: CreatorGuideContent["registration"];
}) {
  const videoId = extractYoutubeId(content.videoId);
  const watchUrl = videoId
    ? `https://www.youtube.com/watch?v=${videoId}`
    : content.videoId.trim().startsWith("http")
      ? content.videoId.trim()
      : null;

  return (
    <section className="mb-16 md:mb-20">
      <SectionHeading eyebrow={content.eyebrow} title={content.title} />
      <p
        className={cn(
          "-mt-4 mb-6 max-w-3xl text-sm leading-relaxed sm:text-base",
          publicTheme.muted,
        )}
      >
        {content.description}
      </p>

      <a
        href={MRFOX_APP_DOWNLOAD_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mb-6 block overflow-hidden rounded-2xl border border-[var(--vulpine-primary-container)]/25 bg-black transition-opacity hover:opacity-95"
      >
        <Image
          src="/creator/download-promo.png"
          alt={content.posterAlt}
          width={1024}
          height={576}
          className="h-auto w-full"
          sizes="(max-width: 768px) 100vw, 768px"
        />
      </a>

      <GlassCard className="overflow-hidden border-[var(--vulpine-primary-container)]/25">
        <div className="overflow-hidden border-b border-white/8 bg-black">
          {videoId ? (
            <div className="relative aspect-video w-full">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`}
                title={content.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
                className="absolute inset-0 h-full w-full border-0"
              />
            </div>
          ) : (
            <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 bg-[#16120c] px-4 text-center">
              <span className="inline-flex size-12 items-center justify-center rounded-full border border-[var(--vulpine-primary-container)]/35 bg-[var(--vulpine-primary-container)]/10 text-[var(--vulpine-primary-container)]">
                <Play className="ml-0.5 size-5" aria-hidden />
              </span>
              <p className={`text-sm sm:text-base ${publicTheme.muted}`}>
                {content.placeholder}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          {content.caption ? (
            <p className={`text-sm leading-relaxed sm:text-base ${publicTheme.muted}`}>
              {content.caption}
            </p>
          ) : (
            <span />
          )}
          {watchUrl ? (
            <a
              href={watchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 text-sm font-medium transition-colors hover:underline",
                publicTheme.link,
              )}
            >
              {content.openLabel}
              <ExternalLink className="size-3.5" aria-hidden />
            </a>
          ) : null}
        </div>
      </GlassCard>
    </section>
  );
}

export function CreatorGuide({
  content,
  platformTypes,
}: {
  content: CreatorGuideContent;
  platformTypes: PlatformType[];
}) {
  const theme = CATEGORY_THEME.creator;
  const fitBySlug = Object.fromEntries(
    content.formats.types.map((item) => [item.slug, item.fit]),
  );

  return (
    <div className={publicTheme.content}>
      <section className="mb-16 md:mb-20">
        <GlassCard className="relative overflow-hidden p-6 sm:p-8 md:p-10">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_0%_0%,rgba(255,184,0,0.1),transparent_55%)]"
            aria-hidden
          />
          <div className="relative max-w-3xl">
            <p className="vulpine-label mb-3 text-[var(--vulpine-primary-container)]">
              {content.intro.eyebrow}
            </p>
            <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-[var(--vulpine-on-surface)] sm:text-3xl">
              {content.intro.title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[var(--vulpine-on-surface-variant)] sm:text-lg">
              {content.intro.description}
            </p>
          </div>
        </GlassCard>
      </section>

      <section className="mb-16 md:mb-20">
        <SectionHeading
          eyebrow={content.benefits.eyebrow}
          title={content.benefits.title}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {content.benefits.items.map((item, index) => {
            const Icon = BENEFIT_ICONS[index] ?? Sparkles;
            return (
              <article
                key={item.title}
                className={cn(themedCard(), "p-5 sm:p-6", theme.cardHover)}
              >
                <div
                  className={cn(
                    "mb-4 flex size-11 items-center justify-center rounded-2xl",
                    theme.iconWrap,
                  )}
                >
                  <Icon className="size-5" aria-hidden />
                </div>
                <h3 className={`text-lg ${publicTheme.cardTitle}`}>{item.title}</h3>
                <p className={`mt-2 text-sm leading-relaxed ${publicTheme.muted}`}>
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mb-16 md:mb-20">
        <SectionHeading
          eyebrow={content.compare.eyebrow}
          title={content.compare.title}
        />
        <div className="overflow-hidden rounded-2xl border border-white/8">
          <div className="hidden grid-cols-[1.2fr_1fr_1fr] border-b border-white/8 bg-white/[0.03] sm:grid">
            <div className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--vulpine-on-surface-variant)]" />
            <div className="border-l border-white/8 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--vulpine-primary-container)]">
              {content.compare.columns.fox}
            </div>
            <div className="border-l border-white/8 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--vulpine-on-surface-variant)]">
              {content.compare.columns.others}
            </div>
          </div>
          {content.compare.rows.map((row, index) => (
            <div
              key={row.label}
              className={cn(
                "grid gap-3 border-white/8 p-4 sm:grid-cols-[1.2fr_1fr_1fr] sm:gap-0 sm:p-0",
                index > 0 && "border-t",
              )}
            >
              <p className="px-1 text-sm font-semibold text-[var(--vulpine-on-surface)] sm:px-5 sm:py-4">
                {row.label}
              </p>
              <div className="flex gap-2 rounded-xl border border-[var(--vulpine-primary-container)]/20 bg-[var(--vulpine-primary-container)]/[0.06] px-3 py-2.5 sm:rounded-none sm:border-0 sm:border-l sm:border-[var(--vulpine-primary-container)]/15 sm:bg-[var(--vulpine-primary-container)]/[0.04] sm:px-5 sm:py-4">
                <Check
                  className="mt-0.5 size-4 shrink-0 text-[var(--vulpine-primary-container)]"
                  aria-hidden
                />
                <p className="text-sm leading-relaxed text-[var(--vulpine-on-surface)]">
                  {row.fox}
                </p>
              </div>
              <div className="flex gap-2 rounded-xl border border-white/8 bg-white/[0.02] px-3 py-2.5 sm:rounded-none sm:border-0 sm:border-l sm:bg-transparent sm:px-5 sm:py-4">
                <X
                  className="mt-0.5 size-4 shrink-0 text-[var(--vulpine-on-surface-variant)]/60"
                  aria-hidden
                />
                <p className="text-sm leading-relaxed text-[var(--vulpine-on-surface-variant)]">
                  {row.others}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <RegistrationVideo content={content.registration} />

      <section className="mb-16 md:mb-20">
        <SectionHeading eyebrow={content.steps.eyebrow} title={content.steps.title} />
        <ol className="grid gap-4 md:grid-cols-2">
          {content.steps.items.map((step, index) => {
            const Icon = STEP_ICONS[index] ?? Rocket;
            return (
              <li
                key={step.title}
                className={cn(themedCard(), "flex gap-4 p-5 sm:p-6", theme.cardHover)}
              >
                <div className="flex flex-col items-center gap-2">
                  <span className="vulpine-label text-xs text-[var(--vulpine-primary-container)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div
                    className={cn(
                      "flex size-10 items-center justify-center rounded-xl",
                      theme.iconWrap,
                    )}
                  >
                    <Icon className="size-4" aria-hidden />
                  </div>
                </div>
                <div className="min-w-0">
                  <h3 className={`text-base font-bold ${publicTheme.cardTitle}`}>
                    {step.title}
                  </h3>
                  <p className={`mt-1.5 text-sm leading-relaxed ${publicTheme.muted}`}>
                    {step.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="mb-16 md:mb-20">
        <SectionHeading
          eyebrow={content.formats.eyebrow}
          title={content.formats.title}
        />
        <p className={cn("-mt-4 mb-8 max-w-3xl text-sm leading-relaxed sm:text-base", publicTheme.muted)}>
          {content.formats.description}
        </p>
        <div className="grid gap-4 lg:grid-cols-3">
          {platformTypes.map((pt, index) => {
            const cardTheme =
              CATEGORY_THEME[pt.categorySlug as keyof typeof CATEGORY_THEME] ??
              CATEGORY_THEME.creator;
            return (
            <Link key={pt.slug} href={`/platforms/${pt.slug}`} className="group block h-full">
              <article
                className={cn(
                  themedCard(),
                  "relative flex h-full flex-col overflow-hidden p-5 sm:p-6",
                  cardTheme.cardHover,
                )}
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute -top-2 -right-1 text-5xl font-black tabular-nums text-white/[0.04]"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span
                  className={cn(
                    "inline-flex w-fit rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide",
                    cardTheme.pill,
                  )}
                >
                  {pt.categoryName}
                </span>
                <h3 className={`mt-3 text-lg ${publicTheme.cardTitle}`}>{pt.name}</h3>
                <p className={`mt-2 flex-1 text-sm leading-relaxed ${publicTheme.muted}`}>
                  {pt.shortDescription ?? pt.concept}
                </p>
                <div className="mt-4 rounded-xl border border-[var(--vulpine-primary-container)]/20 bg-[var(--vulpine-primary-container)]/[0.05] px-3 py-2.5">
                  <p className="vulpine-label text-[10px] text-[var(--vulpine-primary-container)] sm:text-xs">
                    {content.formats.pickLabel}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--vulpine-on-surface)]">
                    {fitBySlug[pt.slug] ?? pt.concept}
                  </p>
                </div>
                <p
                  className={cn(
                    "mt-4 flex items-center gap-1.5 text-sm font-medium transition-all group-hover:gap-2.5",
                    cardTheme.accent,
                  )}
                >
                  {content.formats.viewDetails}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </p>
              </article>
            </Link>
            );
          })}
        </div>
      </section>

      <section>
        <GlassCard className="flex flex-col items-start justify-between gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
          <div className="max-w-xl">
            <h2 className="font-display text-xl font-bold uppercase text-[var(--vulpine-on-surface)] sm:text-2xl">
              {content.cta.title}
            </h2>
            <p className={`mt-2 text-sm leading-relaxed sm:text-base ${publicTheme.muted}`}>
              {content.cta.description}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <LinkButton href="/apps" variant="default" className="vulpine-label gap-2">
              {content.cta.apps}
              <ArrowRight className="size-4" aria-hidden />
            </LinkButton>
            <a
              href={MRFOX_LINE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "default" }),
                "vulpine-label border-[var(--vulpine-primary-container)]/40 text-[var(--vulpine-primary-container)]",
              )}
            >
              {content.cta.contact}
            </a>
          </div>
        </GlassCard>
      </section>
    </div>
  );
}
