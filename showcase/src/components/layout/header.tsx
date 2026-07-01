"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Download, Search } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { LinkButton } from "@/components/ui/link-button";
import { buttonVariants } from "@/components/ui/button";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { MobileNav } from "@/components/layout/mobile-nav";
import { BrandLogo } from "@/components/brand/brand-logo";
import { MRFOX_APP_DOWNLOAD_URL } from "@/lib/app-download";
import { cn } from "@/lib/utils";

type HeaderProps = {
  variant?: "default" | "brand";
};

function HeaderActions({
  isBrand,
  searchLabel,
  downloadLabel,
  showLocale,
  showSearch = true,
  showSearchText = false,
  compactLocale = false,
}: {
  isBrand: boolean;
  searchLabel: string;
  downloadLabel: string;
  showLocale: boolean;
  showSearch?: boolean;
  showSearchText?: boolean;
  compactLocale?: boolean;
}) {
  return (
    <div className="flex shrink-0 items-center gap-2 xl:gap-2.5">
      {showSearch ? (
        <LinkButton
          href="/search"
          variant="ghost"
          size={showSearchText ? "sm" : "icon-sm"}
          className={cn(
            showSearchText
              ? "vulpine-label h-9 gap-2 rounded-xl border px-3 text-sm font-medium"
              : "size-9 sm:size-8",
            isBrand &&
              (showSearchText
                ? "border-white/15 bg-white/5 text-white hover:bg-white/10"
                : "text-white/75 hover:bg-white/10 hover:text-white"),
          )}
          aria-label={searchLabel}
        >
          <Search className="size-4 shrink-0" />
          {showSearchText ? <span>{searchLabel}</span> : null}
        </LinkButton>
      ) : null}

      {showLocale ? (
        <div className="hidden lg:block">
          <LocaleSwitcher inverted={isBrand} compact={compactLocale} />
        </div>
      ) : null}

      <a
        href={MRFOX_APP_DOWNLOAD_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          buttonVariants({ size: "sm" }),
          "vulpine-label vulpine-btn-glow h-9 rounded-xl px-3 xl:px-3.5",
          isBrand &&
            "bg-[var(--vulpine-primary-container)] text-[var(--vulpine-on-primary)] hover:brightness-110",
        )}
      >
        <Download className="size-4 lg:hidden" aria-hidden />
        <span className="hidden sm:inline">{downloadLabel}</span>
        <span className="sr-only sm:hidden">{downloadLabel}</span>
      </a>
    </div>
  );
}

export function Header({ variant = "brand" }: HeaderProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const isBrand = variant === "brand";

  const NAV = [
    { href: "/platforms" as const, label: t("platforms"), match: (p: string) => p.includes("/platforms") },
    { href: "/apps" as const, label: t("apps"), match: (p: string) => p.includes("/apps") },
    { href: "/creator" as const, label: t("creator"), match: (p: string) => p.includes("/creator") },
    { href: "/news" as const, label: t("news"), match: (p: string) => p.includes("/news") },
    { href: "/about" as const, label: t("about"), match: (p: string) => p.includes("/about") },
  ];

  const navLinkClass = (active: boolean) =>
    cn(
      "vulpine-label whitespace-nowrap text-[15px] transition-colors xl:text-base",
      active
        ? "border-b-2 border-[var(--vulpine-primary-container)] pb-1 text-[var(--vulpine-primary)]"
        : "text-[var(--vulpine-on-surface-variant)] hover:text-[var(--vulpine-primary)]",
    );

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b backdrop-blur-3xl",
        isBrand
          ? "border-white/5 bg-[var(--vulpine-surface)]/40 text-[var(--vulpine-on-surface)]"
          : "border-border/60 bg-background/80",
      )}
    >
      <div className="mx-auto h-14 max-w-[1200px] px-3 sm:h-16 sm:px-4 md:px-10 lg:px-12">
        {/* Mobile & tablet */}
        <div className="relative flex h-full items-center lg:hidden">
          <div className="z-10 shrink-0">
            <MobileNav items={NAV} isBrand={isBrand} />
          </div>

          <Link
            href="/"
            className="absolute top-1/2 left-1/2 z-[1] -translate-x-1/2 -translate-y-1/2 brightness-110 transition-opacity hover:opacity-90"
          >
            <BrandLogo
              priority
              wordmarkClassName="h-6 sm:h-7"
              iconClassName="size-8 sm:size-9"
            />
          </Link>

          <div className="z-10 ml-auto">
            <HeaderActions
              isBrand={isBrand}
              searchLabel={t("search")}
              downloadLabel={t("download")}
              showLocale={false}
            />
          </div>
        </div>

        {/* Desktop — เมนูกลางระหว่างโลโก้กับ actions */}
        <div className="hidden h-full w-full items-center lg:flex">
          <Link href="/" className="shrink-0 brightness-110 transition-opacity hover:opacity-90">
            <BrandLogo priority wordmarkClassName="h-7" iconClassName="size-9" />
          </Link>

          <nav className="flex min-w-0 flex-1 items-center justify-center gap-4 px-4 xl:gap-5 xl:px-6">
            {NAV.map((item) => {
              const active = item.match(pathname);
              return (
                <Link key={item.href} href={item.href} className={navLinkClass(active)}>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="shrink-0">
            <HeaderActions
              isBrand={isBrand}
              searchLabel={t("search")}
              downloadLabel={t("download")}
              showLocale
            />
          </div>
        </div>
      </div>
    </header>
  );
}
