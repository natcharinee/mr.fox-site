import { VulpineSectionHeader } from "@/components/vulpine/vulpine-primitives";

type PageHeroProps = {
  title: string;
  description?: string;
  children?: React.ReactNode;
};

export function PageHero({ title, description, children }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-white/5 bg-[var(--vulpine-surface-container-low)]">
      <div className="pointer-events-none absolute -right-20 top-0 size-72 rounded-full bg-[var(--vulpine-primary-container)]/10 blur-3xl" />
      <div className="relative mx-auto max-w-[1200px] px-4 py-12 md:px-16 lg:py-14">
        <VulpineSectionHeader title={title} description={description} />
        {children ? <div className="-mt-6">{children}</div> : null}
      </div>
    </section>
  );
}
