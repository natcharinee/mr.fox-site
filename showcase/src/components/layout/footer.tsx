"use client";

import { ArrowUp, ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BrandLogo } from "@/components/brand/brand-logo";
import { publicTheme, pageWidth } from "@/components/layout/public-theme";
import { MRFOX_APP_DOWNLOAD_URL } from "@/lib/app-download";
import { cn } from "@/lib/utils";

const linkClass =
  "group inline-flex min-h-9 items-center gap-1.5 text-sm text-[var(--vulpine-on-surface-variant)] transition-colors hover:text-[var(--vulpine-primary)]";

const legalPillClass =
  "inline-flex min-h-9 items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 text-sm text-[var(--vulpine-on-surface-variant)] transition-colors hover:border-[var(--vulpine-primary-container)]/35 hover:text-[var(--vulpine-primary)]";

const contactLabelClass =
  "vulpine-label text-xs text-[var(--vulpine-primary-container)] sm:text-sm";

const contactLinkClass =
  "text-sm text-[var(--vulpine-on-surface-variant)] transition-colors hover:text-[var(--vulpine-primary)]";

function FooterLinkList({
  links,
}: {
  links: ReadonlyArray<{ href: string; label: string; external?: boolean }>;
}) {
  return (
    <ul className="space-y-1">
      {links.map((link) => (
        <li key={link.href}>
          {link.external ? (
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              <span>{link.label}</span>
              <ArrowUpRight className="size-3.5 opacity-40 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-80 md:opacity-0 md:group-hover:opacity-60" />
            </a>
          ) : (
            <Link href={link.href} className={linkClass}>
              <span>{link.label}</span>
              <ArrowUpRight className="size-3.5 opacity-40 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-80 md:opacity-0 md:group-hover:opacity-60" />
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");

  const EXPLORE_LINKS = [
    { href: "/platforms", label: nav("platforms") },
    { href: "/apps", label: nav("apps") },
    { href: "/features", label: nav("features") },
    { href: "/news", label: nav("news") },
  ] as const;

  const COMPANY_LINKS = [
    { href: "/about", label: nav("about") },
    { href: "/search", label: nav("search") },
  ] as const;

  const LEGAL_LINKS = [
    {
      href: "https://info.mrfox.com/privacypolicy.html",
      label: t("privacy"),
      external: true,
    },
    { href: "/terms", label: t("terms"), external: false },
  ] as const;

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-white/5 bg-[var(--vulpine-surface-container-lowest)] text-[var(--vulpine-on-surface)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--vulpine-primary-container)]/60 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-0 size-64 rounded-full bg-[var(--vulpine-primary-container)]/8 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 size-48 rounded-full bg-[var(--vulpine-primary-container)]/5 blur-3xl md:hidden"
      />

      <div className={cn("relative py-10 sm:py-12 md:py-16", pageWidth)}>
        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-12 lg:items-stretch lg:gap-6">
          <div className="flex lg:col-span-5">
            <div className="flex h-full w-full flex-col rounded-2xl border border-white/8 bg-white/[0.03] p-5 sm:p-6">
              <Link
                href="/"
                className="inline-flex brightness-110 transition-opacity hover:opacity-90"
              >
                <BrandLogo wordmarkClassName="h-8" />
              </Link>
              <div className="mt-4 flex flex-1 flex-col gap-4 sm:mt-5">
                <p className="text-sm leading-relaxed text-[var(--vulpine-on-surface-variant)]">
                  {t("tagline")}
                </p>
                <address className="not-italic space-y-3 text-sm leading-relaxed text-[var(--vulpine-on-surface-variant)]">
                  <div>
                    <span className="block text-base font-semibold text-[var(--vulpine-primary-container)]">
                      {t("companyName")}
                    </span>
                    {t("address")}
                  </div>
                  <div>
                    <span className={cn("mb-1 block", contactLabelClass)}>
                      {t("emailLabel")}
                    </span>
                    <a href={t("emailHref")} className={contactLinkClass}>
                      {t("email")}
                    </a>
                  </div>
                  <div>
                    <span className={cn("mb-1 block", contactLabelClass)}>
                      {t("phoneLabel")}
                    </span>
                    <a href={t("phoneHref")} className={contactLinkClass}>
                      {t("phone")}
                    </a>
                  </div>
                </address>
              </div>
            </div>
          </div>

          <div className="flex lg:col-span-4 lg:col-start-6">
            <div className="flex h-full w-full flex-col rounded-2xl border border-white/8 bg-white/[0.03] p-5 sm:p-6">
              <div className="grid flex-1 grid-cols-2 gap-6 sm:gap-8">
                <div>
                  <h5 className="vulpine-label mb-3 text-[var(--vulpine-primary-container)] sm:mb-4">
                    {t("explore")}
                  </h5>
                  <FooterLinkList links={EXPLORE_LINKS} />
                </div>

                <div>
                  <h5 className="vulpine-label mb-3 text-[var(--vulpine-primary-container)] sm:mb-4">
                    {t("company")}
                  </h5>
                  <FooterLinkList links={COMPANY_LINKS} />
                </div>
              </div>

              <div className="mt-6 border-t border-white/8 pt-5 lg:mt-auto">
                <h5 className="vulpine-label mb-3 text-[var(--vulpine-primary-container)]">
                  {t("legal")}
                </h5>
                <div className="flex flex-wrap gap-2">
                  {LEGAL_LINKS.map((link) =>
                    link.external ? (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={legalPillClass}
                      >
                        {link.label}
                        <ArrowUpRight className="size-3.5 opacity-60" />
                      </a>
                    ) : (
                      <Link key={link.href} href={link.href} className={legalPillClass}>
                        {link.label}
                      </Link>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex lg:col-span-3 lg:col-start-10">
            <div
              className={cn(
                "relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-[var(--vulpine-primary-container)]/30 bg-gradient-to-br from-[var(--vulpine-primary-container)]/14 via-[var(--vulpine-primary-container)]/6 to-transparent p-5 shadow-[0_12px_40px_rgba(0,0,0,0.28)] backdrop-blur-sm sm:p-6",
              )}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-8 -top-8 size-28 rounded-full bg-[var(--vulpine-primary-container)]/15 blur-2xl"
              />
              <div className="relative flex flex-1 flex-col">
                <p className="vulpine-label text-xs text-[var(--vulpine-primary-container)] sm:text-sm">
                  Mr.FOX Apps
                </p>
                <p className="mt-2 text-base font-semibold leading-snug text-[var(--vulpine-on-surface)]">
                  {t("downloadTitle")}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-[var(--vulpine-on-surface-variant)]">
                  {t("downloadDesc")}
                </p>
                <a
                  href={MRFOX_APP_DOWNLOAD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold sm:py-2.5 lg:mt-auto",
                    publicTheme.submitButton,
                  )}
                >
                  {nav("download")}
                  <ArrowUpRight className="size-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 border-t border-white/5 pt-6 max-sm:text-center sm:mt-12 sm:flex-row sm:items-center sm:justify-between sm:pt-8">
          <p className="w-full text-sm text-[var(--vulpine-on-surface-variant)] max-sm:text-center sm:w-auto sm:text-left">
            © {new Date().getFullYear()} Mr.FOX · {t("copyright")}
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex min-h-9 items-center justify-center gap-1.5 self-center rounded-full border border-white/10 bg-white/[0.04] px-4 text-sm text-[var(--vulpine-on-surface-variant)] transition-colors hover:border-[var(--vulpine-primary-container)]/35 hover:text-[var(--vulpine-primary)] sm:self-auto"
          >
            <ArrowUp className="size-3.5" aria-hidden />
            {t("backToTop")}
          </button>
        </div>
      </div>
    </footer>
  );
}
