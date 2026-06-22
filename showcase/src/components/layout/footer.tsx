"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Separator } from "@/components/ui/separator";
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
    <footer className="mt-auto border-t border-[#2a2418] bg-[var(--fox-charcoal)] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <BrandLogo wordmarkClassName="h-7" />
            <p className="mt-3 max-w-xs text-sm text-[#c9b98a]">{t("tagline")}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#fff8e8]">{t("links")}</p>
            <ul className="mt-3 space-y-2">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#c9b98a] transition-colors hover:text-[var(--fox-gold)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#fff8e8]">{t("legal")}</p>
            <ul className="mt-3 space-y-2 text-sm text-[#c9b98a]">
              <li>
                <Link href="/privacy" className="transition-colors hover:text-[var(--fox-gold)]">
                  {t("privacy")}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="transition-colors hover:text-[var(--fox-gold)]">
                  {t("terms")}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <Separator className="my-8 bg-white/10" />
        <p className="text-center text-sm text-[#c9b98a]">
          © {new Date().getFullYear()} Mr.FOX. {t("copyright")}.
        </p>
      </div>
    </footer>
  );
}
