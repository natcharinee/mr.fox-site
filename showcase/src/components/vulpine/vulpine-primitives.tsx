import { cn } from "@/lib/utils";

export function GlassCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/8 bg-[rgba(18,20,20,0.4)] shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-2xl transition-all",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function VulpineSectionHeader({
  eyebrow,
  title,
  description,
  className,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={cn(
        "mb-12",
        align === "left" && "border-l-2 border-[var(--vulpine-primary-container)] pl-6",
        align === "center" && "text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p className="vulpine-label mb-2 text-[var(--vulpine-primary-container)]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-display text-2xl font-bold tracking-wide text-[var(--vulpine-on-surface)] uppercase md:text-3xl">
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-2 max-w-2xl text-[var(--vulpine-on-surface-variant)]",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function VulpineEyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block rounded-lg border border-[var(--vulpine-primary-container)]/30 bg-[var(--vulpine-primary-container)]/10 px-4 py-1 text-[var(--vulpine-primary-container)] shadow-[0_0_10px_rgba(255,184,0,0.2)] vulpine-label",
        className,
      )}
    >
      [ {children} ]
    </span>
  );
}
