import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { VulpineSectionHeader } from "@/components/vulpine/vulpine-primitives";
import { PageWidth } from "@/components/layout/page-width";
import { publicTheme } from "@/components/layout/public-theme";

type PageHeroProps = {
  title: string;
  description?: string;
  children?: React.ReactNode;
  backHref?: string;
  backLabel?: string;
};

export function PageHero({
  title,
  description,
  children,
  backHref,
  backLabel,
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-white/5 bg-[var(--vulpine-surface-container-low)]">
      <div className="pointer-events-none absolute -right-20 top-0 size-72 rounded-full bg-[var(--vulpine-primary-container)]/10 blur-3xl" />
      <PageWidth className="relative py-12 lg:py-14">
        {backHref && backLabel ? (
          <Link
            href={backHref}
            className={`mb-6 inline-flex items-center gap-2 text-sm font-medium ${publicTheme.link}`}
          >
            <ArrowLeft className="size-4" aria-hidden />
            {backLabel}
          </Link>
        ) : null}
        <VulpineSectionHeader title={title} description={description} />
        {children ? <div className="-mt-6">{children}</div> : null}
      </PageWidth>
    </section>
  );
}
