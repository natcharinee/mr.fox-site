import { Check } from "lucide-react";
import { CATEGORY_THEME } from "@/components/platforms/platform-category-theme";
import { GlassCard } from "@/components/vulpine/vulpine-primitives";
import { cn } from "@/lib/utils";

export type PlatformTypeDetailContent = {
  subtitle?: string;
  paragraphs: string[];
  suitableForTitle?: string;
  suitableFor?: string[];
};

type PlatformTypeOverviewProps = {
  content: PlatformTypeDetailContent;
  categorySlug?: string;
  variant?: "default" | "catalog";
};

function splitParagraphs(paragraphs: string[]) {
  if (paragraphs.length === 0) {
    return { lead: "", middle: [] as string[], closing: null as string | null };
  }
  if (paragraphs.length === 1) {
    return { lead: paragraphs[0], middle: [], closing: null };
  }
  if (paragraphs.length === 2) {
    return { lead: paragraphs[0], middle: [], closing: paragraphs[1] };
  }

  return {
    lead: paragraphs[0],
    middle: paragraphs.slice(1, -1),
    closing: paragraphs[paragraphs.length - 1],
  };
}

export function PlatformTypeOverview({
  content,
  categorySlug = "creator",
  variant = "default",
}: PlatformTypeOverviewProps) {
  const { paragraphs, suitableForTitle, suitableFor, subtitle } = content;
  const theme = CATEGORY_THEME[categorySlug];
  const Icon = theme?.icon;
  const { lead, middle, closing } = splitParagraphs(paragraphs);
  const isCatalog = variant === "catalog";

  const proseClass = isCatalog
    ? "text-base leading-[1.85] text-[var(--vulpine-on-surface)] sm:text-[17px]"
    : "text-base leading-[1.75] text-[var(--vulpine-on-surface)] sm:text-lg";

  return (
    <div className={cn(isCatalog ? "space-y-8" : "space-y-5 sm:space-y-6")}>
      {isCatalog ? (
        <div className="space-y-3">
          {subtitle ? (
            <p className={cn("text-sm font-semibold sm:text-base", theme?.accent)}>
              {subtitle}
            </p>
          ) : null}
          <p className={cn(proseClass, "max-w-4xl text-lg sm:text-xl sm:leading-[1.8]")}>
            {lead}
          </p>
        </div>
      ) : (
        <GlassCard
          className={cn(
            "relative overflow-hidden border-white/10 p-6 sm:p-8",
            theme?.header,
          )}
        >
          <div
            className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-[var(--vulpine-primary-container)]/10 blur-3xl"
            aria-hidden
          />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
            {Icon ? (
              <div
                className={cn(
                  "flex size-14 shrink-0 items-center justify-center rounded-2xl sm:size-16",
                  theme?.iconWrap,
                )}
              >
                <Icon className="size-7 sm:size-8" aria-hidden />
              </div>
            ) : null}
            <div className="min-w-0 flex-1">
              <p className={proseClass}>{lead}</p>
            </div>
          </div>
        </GlassCard>
      )}

      {middle.length > 0 ? (
        <div
          className={cn(
            isCatalog
              ? "space-y-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8"
              : cn("grid gap-4", middle.length > 1 ? "md:grid-cols-2" : "max-w-3xl"),
          )}
        >
          {middle.map((paragraph) =>
            isCatalog ? (
              <p key={paragraph.slice(0, 40)} className={proseClass}>
                {paragraph}
              </p>
            ) : (
              <div
                key={paragraph.slice(0, 40)}
                className={cn(
                  "rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6",
                  "border-l-4",
                  theme?.borderAccent,
                )}
              >
                <p className="text-sm leading-relaxed text-[var(--vulpine-on-surface-variant)] sm:text-base">
                  {paragraph}
                </p>
              </div>
            ),
          )}
        </div>
      ) : null}

      {closing ? (
        <div
          className={cn(
            "rounded-2xl border border-[var(--vulpine-primary-container)]/30 bg-gradient-to-r from-[var(--vulpine-primary-container)]/14 to-transparent",
            isCatalog ? "px-6 py-6 sm:px-8 sm:py-7" : "px-5 py-5 sm:px-6 sm:py-6",
          )}
        >
          <p className={proseClass}>{closing}</p>
        </div>
      ) : null}

      {suitableFor && suitableFor.length > 0 ? (
        isCatalog ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
            {suitableForTitle ? (
              <h3 className="font-display text-xl font-bold uppercase tracking-wide text-[var(--vulpine-on-surface)]">
                {suitableForTitle}
              </h3>
            ) : null}
            <ul
              className={cn(
                "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
                suitableForTitle && "mt-6",
              )}
            >
              {suitableFor.map((item) => (
                <li key={item}>
                  <span className="flex h-full items-center gap-2.5 rounded-xl border border-white/10 bg-[var(--vulpine-surface-container)]/60 px-4 py-3.5 text-sm leading-snug text-[var(--vulpine-on-surface)] sm:text-[15px]">
                    <Check
                      className={cn("size-4 shrink-0", theme?.accent)}
                      aria-hidden
                    />
                    <span>{item}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <GlassCard className="border-white/10 p-6 sm:p-8">
            {suitableForTitle ? (
              <h3
                className={cn(
                  "font-display text-lg font-bold uppercase tracking-wide text-[var(--vulpine-on-surface)] sm:text-xl",
                )}
              >
                {suitableForTitle}
              </h3>
            ) : null}
            <ul
              className={cn(
                "mt-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4",
                !suitableForTitle && "mt-0",
              )}
            >
              {suitableFor.map((item) => (
                <li key={item}>
                  <span
                    className={cn(
                      "flex h-full items-start gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-3 text-sm leading-snug text-[var(--vulpine-on-surface-variant)] transition-colors hover:border-[var(--vulpine-primary-container)]/30 hover:bg-[var(--vulpine-primary-container)]/5 sm:text-[15px]",
                    )}
                  >
                    <Check
                      className={cn("mt-0.5 size-4 shrink-0", theme?.accent)}
                      aria-hidden
                    />
                    <span>{item}</span>
                  </span>
                </li>
              ))}
            </ul>
          </GlassCard>
        )
      ) : null}
    </div>
  );
}
