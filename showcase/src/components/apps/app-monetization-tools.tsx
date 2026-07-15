import {
  Archive,
  Gift,
  HeartHandshake,
  ImageIcon,
  MessageCircle,
  Radio,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { ContentImage } from "@/components/ui/content-image";
import { SectionHeading } from "@/components/layout/section-heading";
import { publicTheme } from "@/components/layout/public-theme";
import type { MonetizationToolId } from "@/lib/app-monetization";
import { MONETIZATION_SCREENSHOT_SIZE } from "@/lib/app-monetization";
import { cn } from "@/lib/utils";

const TOOL_ICONS: Record<MonetizationToolId, LucideIcon> = {
  vote: Trophy,
  gift: Gift,
  live: Radio,
  chatCall: MessageCircle,
  subscription: HeartHandshake,
  liveArchive: Archive,
};

export type MonetizationToolCopy = {
  id: MonetizationToolId;
  name: string;
  fan: string;
  earn: string;
  screenshot?: string | null;
};

type AppMonetizationToolsProps = {
  title: string;
  subtitle: string;
  fanLabel: string;
  earnLabel: string;
  placeholderLabel: string;
  tools: MonetizationToolCopy[];
};

export function AppMonetizationTools({
  title,
  subtitle,
  fanLabel,
  earnLabel,
  placeholderLabel,
  tools,
}: AppMonetizationToolsProps) {
  if (tools.length === 0) return null;

  return (
    <section className="mt-14">
      <div className="mb-6">
        <SectionHeading title={title} className="mb-2" />
        <p className={`max-w-2xl text-sm leading-relaxed sm:text-base ${publicTheme.muted}`}>
          {subtitle}
        </p>
      </div>

      <div className="grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => {
          const Icon = TOOL_ICONS[tool.id] ?? ImageIcon;
          return (
            <article
              key={tool.id}
              className={cn(
                "flex h-full flex-col overflow-hidden rounded-2xl border border-white/15",
                "bg-[var(--vulpine-surface-container)] shadow-[0_8px_32px_rgba(0,0,0,0.45)]",
              )}
            >
              <div
                className="relative w-full border-b border-white/10 bg-black"
                style={{
                  aspectRatio: `${MONETIZATION_SCREENSHOT_SIZE.width} / ${MONETIZATION_SCREENSHOT_SIZE.height}`,
                }}
              >
                {tool.screenshot ? (
                  <ContentImage
                    src={tool.screenshot}
                    alt={`${tool.name} UI`}
                    fill
                    quality={95}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
                    unoptimized
                    fit="contain"
                    objectPosition="top"
                    className="object-contain object-top"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center">
                    <span className="inline-flex size-11 items-center justify-center rounded-full border border-white/15 bg-white/8 text-[var(--vulpine-primary-container)]">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <p className={`text-xs ${publicTheme.muted}`}>
                      {placeholderLabel}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col gap-4 bg-[rgba(22,24,24,0.98)] p-5">
                <div className="flex items-center gap-2.5 rounded-xl border border-[var(--vulpine-primary-container)]/50 bg-[var(--vulpine-primary-container)]/15 px-3 py-2">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[var(--vulpine-primary-container)]/40 bg-[var(--vulpine-primary-container)]/15 text-[var(--vulpine-primary-container)]">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <h3 className="font-display text-lg text-white">
                    {tool.name}
                  </h3>
                </div>

                <dl className="space-y-3 text-sm leading-relaxed">
                  <div>
                    <dt className="vulpine-label mb-1 text-[var(--vulpine-primary-container)]">
                      {fanLabel}
                    </dt>
                    <dd className="text-[var(--vulpine-on-surface)]/90">
                      {tool.fan}
                    </dd>
                  </div>
                  <div>
                    <dt className="vulpine-label mb-1 text-[var(--vulpine-primary-container)]">
                      {earnLabel}
                    </dt>
                    <dd className="font-medium text-white">{tool.earn}</dd>
                  </div>
                </dl>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
