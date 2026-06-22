import { cn } from "@/lib/utils";

export function SectionHeading({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-4 flex items-center gap-3", className)}>
      <span className="h-8 w-1 shrink-0 rounded-full bg-[var(--fox-gold)]" />
      <h2 className="text-xl font-bold text-[var(--fox-charcoal)]">{title}</h2>
    </div>
  );
}
