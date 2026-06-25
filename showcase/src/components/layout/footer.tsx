"use client";

import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BrandLogo } from "@/components/brand/brand-logo";
import { publicTheme } from "@/components/layout/public-theme";
import { cn } from "@/lib/utils";

const linkClass =
  "group inline-flex items-center gap-1.5 text-sm text-[var(--vulpine-on-surface-variant)] transition-colors hover:text-[var(--vulpine-primary)]";

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");

  const EXPLORE_LINKS = [
    { href: "/platforms" as const, label: nav("platforms") },
    { href: "/apps" as const, label: nav("apps") },
    { href: "/features" as const, label: nav("features") },
    { href: "/news" as const, label: nav("news") },
  ];

  const COMPANY_LINKS = [
    { href: "/about" as const, label: nav("about") },
    { href: "/contact" as const, label: nav("contact") },
    { href: "/search" as const, label: nav("search") },
  ];

  const LEGAL_LINKS = [
    { href: "/privacy" as const, label: t("privacy") },
    { href: "/terms" as const, label: t("terms") },
  ];

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

      <div className="relative mx-auto max-w-[1200px] px-4 py-14 md:px-16 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Link href="/" className="inline-flex brightness-110 transition-opacity hover:opacity-90">
              <BrandLogo wordmarkClassName="h-8" />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-[var(--vulpine-on-surface-variant)]">
              {t("tagline")}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-4">
            <div>
              <h5 className="vulpine-label mb-4 text-[var(--vulpine-primary-container)]">
                {t("explore")}
              </h5>
              <ul className="space-y-2.5">
                {EXPLORE_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={linkClass}>
                      <span>{link.label}</span>
                      <ArrowUpRight className="size-3.5 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-60" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="vulpine-label mb-4 text-[var(--vulpine-primary-container)]">
                {t("company")}
              </h5>
              <ul className="space-y-2.5">
                {COMPANY_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={linkClass}>
                      <span>{link.label}</span>
                      <ArrowUpRight className="size-3.5 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-60" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="vulpine-label mb-4 text-[var(--vulpine-primary-container)]">
                {t("legal")}
              </h5>
              <ul className="space-y-2.5">
                {LEGAL_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={linkClass}>
                      <span>{link.label}</span>
                      <ArrowUpRight className="size-3.5 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-60" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div
              className={cn(
                "rounded-2xl border border-[var(--vulpine-primary-container)]/25 bg-gradient-to-br from-[var(--vulpine-primary-container)]/10 to-transparent p-5 backdrop-blur-sm",
              )}
            >
              <p className="vulpine-label text-[10px] text-[var(--vulpine-primary-container)]">
                Mr.FOX Apps
              </p>
              <p className="mt-2 text-sm font-semibold leading-snug text-[var(--vulpine-on-surface)]">
                {t("downloadTitle")}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-[var(--vulpine-on-surface-variant)]">
                {t("downloadDesc")}
              </p>
              <a
                href="https://link.mrfox.app"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold",
                  publicTheme.submitButton,
                )}
              >
                {nav("download")}
                <ArrowUpRight className="size-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-white/5 pt-8 sm:flex-row sm:items-center">
          <p className="text-xs text-[var(--vulpine-on-surface-variant)]">
            © {new Date().getFullYear()} Mr.FOX · {t("copyright")}
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-xs text-[var(--vulpine-on-surface-variant)] transition-colors hover:text-[var(--vulpine-primary)]"
          >
            {t("backToTop")}
          </button>
        </div>
      </div>
    </footer>
  );
}
