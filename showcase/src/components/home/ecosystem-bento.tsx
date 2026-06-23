import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type Category = {
  name: string;
  slug: string;
  description: string | null;
};

type PlatformType = {
  name: string;
  categorySlug: string;
};

type EcosystemBentoProps = {
  title: string;
  description: string;
  viewAllLabel: string;
  categories: Category[];
  platformTypes: PlatformType[];
};

function BentoShell({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <article
      className={cn(
        "flex flex-col overflow-hidden rounded-3xl border border-white/8 bg-[#1c1c1c] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:p-6",
        className,
      )}
    >
      {children}
    </article>
  );
}

function ProgressRow({
  index,
  label,
  value,
}: {
  index: number;
  label: string;
  value: number;
}) {
  return (
    <div className="grid grid-cols-[2rem_1fr_4.5rem] items-center gap-3 text-sm">
      <span className="text-white/40">{String(index).padStart(2, "0")}</span>
      <div>
        <p className="truncate font-medium text-white/90">{label}</p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-[var(--fox-gold)]"
            style={{ width: `${value}%` }}
          />
        </div>
      </div>
      <span className="text-right text-xs text-white/45">{value}%</span>
    </div>
  );
}

function MiniBars({ values }: { values: number[] }) {
  return (
    <div className="flex h-28 items-end justify-center gap-2 sm:gap-3">
      {values.map((value, i) => (
        <div key={i} className="flex flex-col items-center gap-2">
          <div
            className="w-7 rounded-t-md bg-[var(--fox-gold)]/90 sm:w-8"
            style={{ height: `${value}%` }}
          />
          <span className="text-[10px] text-white/35">{i + 1}</span>
        </div>
      ))}
    </div>
  );
}

function DonutGauge({ value }: { value: number }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative mx-auto flex size-32 items-center justify-center">
      <svg className="-rotate-90 size-32" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="10"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="var(--fox-gold)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="absolute text-2xl font-bold text-white">{value}%</span>
    </div>
  );
}

function MiniLineChart() {
  const points = "4,52 18,38 32,44 46,28 60,34 74,18 88,24 96,12";
  return (
    <svg viewBox="0 0 100 60" className="h-24 w-full" preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke="var(--fox-gold)"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        points={points}
      />
      {[12, 24, 36, 48].map((y) => (
        <line
          key={y}
          x1="0"
          y1={y}
          x2="100"
          y2={y}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="0.5"
        />
      ))}
    </svg>
  );
}

function categoryTypes(types: PlatformType[], slug: string) {
  return types.filter((t) => t.categorySlug === slug);
}

export function EcosystemBento({
  title,
  description,
  viewAllLabel,
  categories,
  platformTypes,
}: EcosystemBentoProps) {
  const bySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));
  const creatorTypes = categoryTypes(platformTypes, "creator");
  const communityTypes = categoryTypes(platformTypes, "community");
  const companyTypes = categoryTypes(platformTypes, "company");
  const contestTypes = categoryTypes(platformTypes, "contest");
  const exhibitionTypes = categoryTypes(platformTypes, "exhibition");

  const creatorBars = creatorTypes.slice(0, 3).map((_, i) => 88 - i * 14);
  const communityBars = communityTypes.length
    ? communityTypes.map((_, i) => 45 + (i % 3) * 18)
    : [40, 65, 52, 78];

  return (
    <section className="bg-[var(--fox-charcoal)] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {title}
          </h2>
          <p className="mt-2 text-sm text-white/55 sm:text-base">{description}</p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-12 lg:grid-rows-[auto_auto]">
          {/* Creator — large top-left */}
          <BentoShell className="lg:col-span-7">
            <p className="text-sm font-medium text-white/55">
              {bySlug.creator?.name ?? "Creator"}
            </p>
            <div className="mt-4 space-y-4">
              {creatorTypes.slice(0, 3).map((pt, i) => (
                <ProgressRow
                  key={pt.name}
                  index={i + 1}
                  label={pt.name}
                  value={creatorBars[i] ?? 60}
                />
              ))}
            </div>
            <div className="mt-auto pt-8">
              <h3 className="text-xl font-bold leading-snug text-white sm:text-2xl">
                {bySlug.creator?.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/50">
                {bySlug.creator?.description}
              </p>
            </div>
          </BentoShell>

          {/* Community — top-right */}
          <BentoShell className="lg:col-span-5">
            <p className="text-sm font-medium text-white/55">
              {bySlug.community?.name ?? "Community"}
            </p>
            <MiniBars values={communityBars.slice(0, 4)} />
            <div className="mt-auto pt-6">
              <h3 className="text-xl font-bold text-white">{bySlug.community?.name}</h3>
              <p className="mt-2 text-sm text-white/50">{bySlug.community?.description}</p>
            </div>
          </BentoShell>

          {/* Company — bottom-left */}
          <BentoShell className="lg:col-span-4">
            <p className="text-sm font-medium text-white/55">
              {bySlug.company?.name ?? "Company"}
            </p>
            <DonutGauge value={Math.min(95, 68 + companyTypes.length * 6)} />
            <div className="mt-auto pt-4">
              <h3 className="text-lg font-bold text-white">{bySlug.company?.name}</h3>
              <p className="mt-2 text-sm text-white/50 line-clamp-2">
                {bySlug.company?.description}
              </p>
            </div>
          </BentoShell>

          {/* Contest — bottom-center */}
          <BentoShell className="lg:col-span-4">
            <p className="text-sm font-medium text-white/55">
              {bySlug.contest?.name ?? "Contest"}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {contestTypes.slice(0, 2).map((pt, i) => (
                <div
                  key={pt.name}
                  className="rounded-2xl border border-white/8 bg-white/[0.03] p-3"
                >
                  <p className="text-xs text-white/45">0{i + 1}</p>
                  <p className="mt-1 text-sm font-semibold text-white line-clamp-2">
                    {pt.name}
                  </p>
                  <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full bg-[var(--fox-gold)]"
                      style={{ width: `${72 - i * 12}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-auto pt-6">
              <h3 className="text-lg font-bold text-white">{bySlug.contest?.name}</h3>
              <p className="mt-2 text-sm text-white/50 line-clamp-2">
                {bySlug.contest?.description}
              </p>
            </div>
          </BentoShell>

          {/* Exhibition — bottom-right wide */}
          <BentoShell className="lg:col-span-4">
            <p className="text-sm font-medium text-white/55">
              {bySlug.exhibition?.name ?? "Exhibition"}
            </p>
            <MiniLineChart />
            <div className="mt-4 flex justify-between text-[10px] text-white/35">
              <span>Q1</span>
              <span>Q2</span>
              <span>Q3</span>
              <span>Q4</span>
            </div>
            <div className="mt-auto pt-4">
              <h3 className="text-lg font-bold text-white">{bySlug.exhibition?.name}</h3>
              <p className="mt-2 text-sm text-white/50 line-clamp-2">
                {bySlug.exhibition?.description}
              </p>
            </div>
          </BentoShell>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/platforms"
            className="text-sm font-medium text-[var(--fox-gold)] transition-colors hover:text-[var(--fox-gold)]/80"
          >
            {viewAllLabel} →
          </Link>
        </div>
      </div>
    </section>
  );
}
