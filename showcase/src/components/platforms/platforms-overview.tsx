import { Check, Minus, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "@/components/layout/section-heading";
import { publicTheme, themedCard } from "@/components/layout/public-theme";
import { CATEGORY_THEME } from "@/components/platforms/platform-category-theme";
import { GlassCard } from "@/components/vulpine/vulpine-primitives";
import { cn } from "@/lib/utils";

type PermissionRow = { label: string; value: "yes" | "no" | "optional" | "contestant" };
type OverviewType = {
  slug: string;
  categorySlug: string;
  name: string;
  tagline: string;
  summary: string;
  example: string;
  permissions: PermissionRow[];
};
type OverviewLayer = { label: string; text: string };

export type PlatformsOverviewContent = {
  eyebrow: string;
  title: string;
  description: string;
  layers: OverviewLayer[];
  coexistTitle: string;
  coexistDescription: string;
  typesTitle: string;
  types: OverviewType[];
  valueLabels: {
    yes: string;
    no: string;
    optional: string;
    contestant: string;
  };
  exampleLabel: string;
  catalogHint: string;
};

function PermissionValue({
  value,
  labels,
}: {
  value: PermissionRow["value"];
  labels: PlatformsOverviewContent["valueLabels"];
}) {
  const text =
    value === "yes"
      ? labels.yes
      : value === "no"
        ? labels.no
        : value === "contestant"
          ? labels.contestant
          : labels.optional;

  const Icon = value === "yes" ? Check : value === "no" ? X : Minus;
  const tone =
    value === "yes"
      ? "text-emerald-400"
      : value === "no"
        ? "text-white/35"
        : "text-[var(--vulpine-primary-container)]";

  return (
    <span className={cn("inline-flex items-center gap-1.5 text-sm font-medium", tone)}>
      <Icon className="size-3.5 shrink-0" aria-hidden />
      {text}
    </span>
  );
}

export function PlatformsOverview({ content }: { content: PlatformsOverviewContent }) {
  return (
    <section className={cn(publicTheme.content, "mb-14 md:mb-16")}>
      <GlassCard className="relative overflow-hidden p-6 sm:p-8">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_0%_0%,rgba(255,184,0,0.1),transparent_55%)]"
          aria-hidden
        />
        <div className="relative">
          <p className="vulpine-label mb-3 text-[var(--vulpine-primary-container)]">
            {content.eyebrow}
          </p>
          <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-[var(--vulpine-on-surface)] sm:text-3xl">
            {content.title}
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-[var(--vulpine-on-surface-variant)] sm:text-lg">
            {content.description}
          </p>

          <ol className="mt-8 grid gap-3 sm:grid-cols-3">
            {content.layers.map((layer, index) => (
              <li
                key={layer.label}
                className="rounded-xl border border-[var(--vulpine-primary-container)]/20 bg-[var(--vulpine-primary-container)]/[0.05] p-4"
              >
                <div className="flex items-center gap-2">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--vulpine-primary-container)]/20 text-xs font-bold text-[var(--vulpine-primary-container)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm font-semibold text-[var(--vulpine-on-surface)]">
                    {layer.label}
                  </p>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-[var(--vulpine-on-surface-variant)]">
                  {layer.text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </GlassCard>

      <div className="mt-8 rounded-2xl border border-[var(--vulpine-primary-container)]/25 bg-[var(--vulpine-surface-container-low)]/60 p-5 sm:p-6">
        <h3 className="text-base font-bold text-[var(--vulpine-on-surface)] sm:text-lg">
          {content.coexistTitle}
        </h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--vulpine-on-surface-variant)] sm:text-base">
          {content.coexistDescription}
        </p>
      </div>

      <SectionHeading title={content.typesTitle} className="mt-12" />

      <div className="grid gap-4 lg:grid-cols-3">
        {content.types.map((type) => {
          const theme =
            CATEGORY_THEME[type.categorySlug] ?? CATEGORY_THEME.creator;
          const Icon = theme.icon;

          return (
            <Link
              key={type.slug}
              href={`/platforms/${type.slug}`}
              className="group block h-full"
            >
              <article
                className={cn(
                  themedCard(),
                  "flex h-full flex-col p-5 sm:p-6",
                  theme.cardHover,
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-xl",
                      theme.iconWrap,
                    )}
                  >
                    <Icon className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <span
                      className={cn(
                        "inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                        theme.pill,
                      )}
                    >
                      {type.tagline}
                    </span>
                    <h3 className={`mt-2 text-lg leading-snug ${publicTheme.cardTitle}`}>
                      {type.name}
                    </h3>
                  </div>
                </div>

                <p className={`mt-3 flex-1 text-sm leading-relaxed ${publicTheme.muted}`}>
                  {type.summary}
                </p>

                <ul className="mt-4 space-y-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3">
                  {type.permissions.map((row) => (
                    <li
                      key={row.label}
                      className="flex items-center justify-between gap-3 text-sm"
                    >
                      <span className="text-[var(--vulpine-on-surface-variant)]">
                        {row.label}
                      </span>
                      <PermissionValue value={row.value} labels={content.valueLabels} />
                    </li>
                  ))}
                </ul>

                <p className="mt-4 text-xs text-[var(--vulpine-on-surface-variant)]">
                  <span className="font-semibold text-[var(--vulpine-primary-container)]">
                    {content.exampleLabel}
                  </span>{" "}
                  {type.example}
                </p>
              </article>
            </Link>
          );
        })}
      </div>

      <p className={`mt-8 text-center text-sm ${publicTheme.muted}`}>{content.catalogHint}</p>
    </section>
  );
}
