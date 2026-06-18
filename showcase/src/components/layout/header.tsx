"use client";

import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { LinkButton } from "@/components/ui/link-button";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { BrandLogo } from "@/components/brand/brand-logo";

export function Header() {
  const t = useTranslations("nav");

  const NAV = [
    { href: "/platforms" as const, label: t("platforms") },
    { href: "/apps" as const, label: t("apps") },
    { href: "/features" as const, label: t("features") },
    { href: "/news" as const, label: t("news") },
    { href: "/about" as const, label: t("about") },
    { href: "/contact" as const, label: t("contact") },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center">
          <BrandLogo priority />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <LinkButton
            href="/search"
            variant="ghost"
            size="icon-sm"
            className="hidden sm:inline-flex"
            aria-label={t("search")}
          >
            <Search className="size-4" />
          </LinkButton>
          <LinkButton href="/apps" size="sm">
            {t("download")}
          </LinkButton>
        </div>
      </div>
    </header>
  );
}
