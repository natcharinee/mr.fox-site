"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const isBrand = variant === "brand";

  const NAV = [
    { href: "/platforms" as const, label: t("platforms"), match: (p: string) => p.includes("/platforms") },
    { href: "/apps" as const, label: t("apps"), match: (p: string) => p.includes("/apps") },
    { href: "/news" as const, label: t("news"), match: (p: string) => p.includes("/news") },
    { href: "/about" as const, label: t("about"), match: (p: string) => p.includes("/about") },
    { href: "/contact" as const, label: t("contact"), match: (p: string) => p.includes("/contact") },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b backdrop-blur-3xl",
        isBrand
          ? "border-white/5 bg-[var(--vulpine-surface)]/40 text-[var(--vulpine-on-surface)]"
          : "border-border/60 bg-background/80",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-4 px-4 md:px-16">
        <Link href="/" className="flex items-center brightness-110">
          <BrandLogo priority />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV.map((item) => {
            const active = item.match(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "vulpine-label text-sm transition-colors",
                  active
                    ? "border-b-2 border-[var(--vulpine-primary-container)] pb-1 text-[var(--vulpine-primary)]"
                    : "text-[var(--vulpine-on-surface-variant)] hover:text-[var(--vulpine-primary)]",
                )}
              >
                {item.label}
              </Link>
            );
          })}
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
              "vulpine-label vulpine-btn-glow rounded-xl",
              isBrand &&
                "bg-[var(--vulpine-primary-container)] text-[var(--vulpine-on-primary)] hover:brightness-110",
            )}
          >
            {t("download")}
          </a>
        </div>
      </div>
    </header>
  );
}
