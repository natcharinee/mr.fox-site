import { cn } from "@/lib/utils";

export function SectionHeading({
  title,
  className,
  eyebrow,
}: {
  title: string;
  className?: string;
  eyebrow?: string;
}) {
  return (
    <div className={cn("mb-8", className)}>
      {eyebrow ? (
        <p className="vulpine-label mb-2 text-[var(--vulpine-primary-container)]">{eyebrow}</p>
      ) : null}
      <h2 className="font-display text-xl font-bold tracking-wide text-[var(--vulpine-on-surface)] uppercase md:text-2xl">
        {title}
      </h2>
    </div>
  );
}
