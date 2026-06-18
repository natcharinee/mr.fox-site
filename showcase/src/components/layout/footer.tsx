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
    <footer className="mt-auto border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <BrandLogo wordmarkClassName="h-7" />
            <p className="mt-3 text-sm text-muted-foreground max-w-xs">
              {t("tagline")}
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold">{t("links")}</p>
            <ul className="mt-3 space-y-2">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold">{t("legal")}</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                  {t("privacy")}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  {t("terms")}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <Separator className="my-8" />
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Mr.FOX. {t("copyright")}.
        </p>
      </div>
    </footer>
  );
}
