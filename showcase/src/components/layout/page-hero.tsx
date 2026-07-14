import { VulpineSectionHeader } from "@/components/vulpine/vulpine-primitives";
import { pageWidth } from "@/components/layout/public-theme";
import { cn } from "@/lib/utils";

type PageHeroProps = {
  title: string;
  description?: string;
  children?: React.ReactNode;
};

export function PageHero({ title, description, children }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-white/5 bg-[var(--vulpine-surface-container-low)]">
      <div className="pointer-events-none absolute -right-20 top-0 size-72 rounded-full bg-[var(--vulpine-primary-container)]/10 blur-3xl" />
      <div className={cn("relative py-12 lg:py-14", pageWidth)}>
        <VulpineSectionHeader title={title} description={description} />
        {children ? <div className="-mt-6">{children}</div> : null}
      </div>
    </section>
  );
}
