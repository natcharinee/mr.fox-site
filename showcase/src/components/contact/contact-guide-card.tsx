import { Inbox, MessageSquare, Send, Users } from "lucide-react";
import { GlassCard } from "@/components/vulpine/vulpine-primitives";
import { cn } from "@/lib/utils";

export type GuideStep = {
  title: string;
  description: string;
};

export type GuideFaqItem = {
  question: string;
  answer: string;
};

export type ContactGuideContent = {
  eyebrow: string;
  title: string;
  stepsTitle: string;
  steps: GuideStep[];
  faqTitle: string;
  faq: GuideFaqItem[];
};

const STEP_ICONS = [Send, Inbox, Users, MessageSquare] as const;

export function ContactGuideCard({
  content,
  className,
}: {
  content: ContactGuideContent;
  className?: string;
}) {
  return (
    <GlassCard className={cn("p-6 sm:p-8", className)}>
      <div>
        <p className="vulpine-label mb-2 text-[var(--vulpine-primary-container)]">
          {content.eyebrow}
        </p>
        <h3 className="font-display text-lg font-bold uppercase text-[var(--vulpine-on-surface)]">
          {content.title}
        </h3>
      </div>

      <div className="mt-6">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--vulpine-on-surface-variant)]">
          {content.stepsTitle}
        </p>
        <ol className="relative mt-4 space-y-0">
          {content.steps.map((step, index) => {
            const Icon = STEP_ICONS[index] ?? MessageSquare;
            const isLast = index === content.steps.length - 1;

            return (
              <li key={step.title} className="relative flex gap-4 pb-6 last:pb-0">
                {!isLast ? (
                  <span
                    className="absolute left-[19px] top-10 h-[calc(100%-1.25rem)] w-px bg-gradient-to-b from-[var(--vulpine-primary-container)]/40 to-white/10"
                    aria-hidden
                  />
                ) : null}
                <div className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-xl border border-[var(--vulpine-primary-container)]/25 bg-[var(--vulpine-primary-container)]/10 text-[var(--vulpine-primary-container)]">
                  <Icon className="size-4" aria-hidden />
                </div>
                <div className="min-w-0 pt-1">
                  <p className="font-display text-sm font-bold text-[var(--vulpine-on-surface)]">
                    {step.title}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--vulpine-on-surface-variant)]">
                    {step.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="mt-8 border-t border-white/8 pt-6">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--vulpine-on-surface-variant)]">
          {content.faqTitle}
        </p>
        <dl className="mt-4 space-y-4">
          {content.faq.map((item) => (
            <div
              key={item.question}
              className="rounded-xl border border-white/8 bg-white/[0.02] px-4 py-3"
            >
              <dt className="text-sm font-medium text-[var(--vulpine-on-surface)]">
                {item.question}
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-[var(--vulpine-on-surface-variant)]">
                {item.answer}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </GlassCard>
  );
}
