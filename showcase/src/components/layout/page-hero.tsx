type PageHeroProps = {
  title: string;
  description?: string;
  children?: React.ReactNode;
};

export function PageHero({ title, description, children }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-[#2a2418] bg-[var(--fox-charcoal)] text-white">
      <div className="pointer-events-none absolute -right-20 top-0 size-72 rounded-full bg-[var(--fox-gold)]/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 bottom-0 size-64 rounded-full bg-[var(--fox-gold)]/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
        <div className="flex items-center gap-3">
          <span className="h-10 w-1 shrink-0 rounded-full bg-[var(--fox-gold)]" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#fff8e8] sm:text-4xl">
              {title}
            </h1>
            {description ? (
              <p className="mt-2 max-w-2xl text-base text-[#c9b98a] sm:text-lg">{description}</p>
            ) : null}
          </div>
        </div>
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </section>
  );
}
