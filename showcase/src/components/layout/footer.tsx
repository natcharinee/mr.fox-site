"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BrandLogo } from "@/components/brand/brand-logo";

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");

  const FOOTER_LINKS = [
    { href: "/about" as const, label: nav("about") },
    { href: "/contact" as const, label: nav("contact") },
    { href: "/platforms" as const, label: nav("platforms") },
    { href: "/features" as const, label: nav("features") },
    { href: "/privacy" as const, label: t("privacy") },
    { href: "/terms" as const, label: t("terms") },
  ];

  return (
    <footer className="mt-auto border-t border-white/5 bg-[var(--vulpine-surface-container-lowest)] pt-16 pb-10 text-[var(--vulpine-on-surface)]">
      <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-8 px-4 md:grid-cols-4 md:px-16 lg:grid-cols-6">
        <div className="col-span-2">
          <BrandLogo wordmarkClassName="h-8 brightness-110" />
          <p className="mt-4 max-w-xs text-sm text-[var(--vulpine-on-surface-variant)] opacity-80">
            {t("tagline")}
          </p>
        </div>
        <div>
          <h5 className="vulpine-label mb-4 text-[var(--vulpine-on-surface)]">Navigation</h5>
          <ul className="space-y-3">
            {FOOTER_LINKS.slice(0, 4).map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="vulpine-label text-[11px] text-[var(--vulpine-on-surface-variant)] transition-colors hover:text-[var(--vulpine-primary)]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h5 className="vulpine-label mb-4 text-[var(--vulpine-on-surface)]">{t("legal")}</h5>
          <ul className="space-y-3">
            {FOOTER_LINKS.slice(4).map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="vulpine-label text-[11px] text-[var(--vulpine-on-surface-variant)] transition-colors hover:text-[var(--vulpine-primary)]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-[1200px] flex-col items-center justify-between gap-4 border-t border-white/5 px-4 pt-8 md:flex-row md:px-16">
        <p className="vulpine-label text-[11px] text-[var(--vulpine-on-surface-variant)]">
          © {new Date().getFullYear()} MR.FOX ECOSYSTEM // {t("copyright").toUpperCase()}
        </p>
      </div>
    </footer>
  );
}
