import { VulpineSectionHeader } from "@/components/vulpine/vulpine-primitives";
import { PageWidth } from "@/components/layout/page-width";

type PageHeroProps = {
  title: string;
  description?: string;
  children?: React.ReactNode;
};

export function PageHero({ title, description, children }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-white/5 bg-[var(--vulpine-surface-container-low)]">
      <div className="pointer-events-none absolute -right-20 top-0 size-72 rounded-full bg-[var(--vulpine-primary-container)]/10 blur-3xl" />
      <PageWidth className="relative py-12 lg:py-14">
        <VulpineSectionHeader title={title} description={description} />
        {children ? <div className="-mt-6">{children}</div> : null}
      </PageWidth>
    </section>
  );
}
