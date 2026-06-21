"use client";

import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { LinkButton } from "@/components/ui/link-button";
import { buttonVariants } from "@/components/ui/button";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { BrandLogo } from "@/components/brand/brand-logo";
import { cn } from "@/lib/utils";

type HeaderProps = {
  variant?: "default" | "brand";
};

export function Header({ variant = "brand" }: HeaderProps) {
  const t = useTranslations("nav");
  const isBrand = variant === "brand";

  const NAV = [
    { href: "/platforms" as const, label: t("platforms") },
    { href: "/apps" as const, label: t("apps") },
    { href: "/features" as const, label: t("features") },
    { href: "/news" as const, label: t("news") },
    { href: "/about" as const, label: t("about") },
    { href: "/contact" as const, label: t("contact") },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b backdrop-blur-md",
        isBrand
          ? "border-white/10 bg-[var(--fox-charcoal)]/95 text-white shadow-lg shadow-black/10"
          : "border-border/60 bg-background/80",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center">
          <BrandLogo priority />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isBrand
                  ? "text-white/75 hover:bg-white/10 hover:text-[var(--fox-gold)]"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LinkButton
            href="/search"
            variant="ghost"
            size="icon-sm"
            className={cn(
              "hidden sm:inline-flex",
              isBrand && "text-white/75 hover:bg-white/10 hover:text-white",
            )}
            aria-label={t("search")}
          >
            <Search className="size-4" />
          </LinkButton>
          <LocaleSwitcher inverted={isBrand} />
          <a
            href="https://link.mrfox.app"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ size: "sm" }),
              isBrand &&
                "bg-[var(--fox-gold)] text-[var(--fox-charcoal)] hover:bg-[var(--fox-gold-dark)] hover:text-[var(--fox-charcoal)]",
            )}
          >
            {t("download")}
          </a>
        </div>
      </div>
    </header>
  );
}
