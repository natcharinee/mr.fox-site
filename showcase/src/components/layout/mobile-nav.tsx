"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  Download,
  Menu,
  Search,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { BrandLogo } from "@/components/brand/brand-logo";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { MRFOX_APP_DOWNLOAD_URL } from "@/lib/app-download";
import { cn } from "@/lib/utils";

function isHomePath(pathname: string) {
  return /^\/(en|th|zh)\/?$/.test(pathname);
}

export type NavItem = {
  href: "/platforms" | "/apps" | "/creator" | "/news" | "/about";
  label: string;
  match: (pathname: string) => boolean;
};

type MobileNavProps = {
  items: NavItem[];
  isBrand?: boolean;
};

export function MobileNav({ items, isBrand = true }: MobileNavProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <button
        type="button"
        className={cn(
          "inline-flex size-10 shrink-0 items-center justify-center rounded-xl border outline-none transition-colors lg:hidden",
          isBrand
            ? "border-white/10 bg-white/5 text-white hover:border-[var(--vulpine-primary-container)]/40 hover:bg-[var(--vulpine-primary-container)]/10 hover:text-[var(--vulpine-primary-container)]"
            : "border-border bg-background hover:bg-muted",
        )}
        aria-label={t("openMenu")}
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <Menu className="size-5" aria-hidden />
      </button>

      <SheetContent
        side="left"
        showCloseButton
        className={cn(
          "flex h-full w-[min(100vw-3rem,20rem)] flex-col gap-0 border-r p-0 sm:max-w-xs",
          isBrand
            ? "border-[var(--vulpine-primary-container)]/20 bg-[var(--vulpine-surface)] text-[var(--vulpine-on-surface)]"
            : "bg-popover",
        )}
      >
        <SheetHeader className="border-b border-white/10 px-5 py-5 text-left">
          <div className="flex items-center gap-3 pr-8">
            <BrandLogo
              showWordmark={false}
              iconClassName="size-8"
              priority={false}
            />
            <div>
              <SheetTitle className="font-display text-base font-bold uppercase tracking-wide text-[var(--vulpine-on-surface)]">
                {t("menuTitle")}
              </SheetTitle>
              <SheetDescription className="text-xs text-[var(--vulpine-on-surface-variant)]">
                Mr.FOX
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label={t("menuTitle")}>
          <ul className="space-y-1">
            <li>
              <Link
                href="/"
                className={cn(
                  "flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium transition-colors",
                  isHomePath(pathname)
                    ? "border border-[var(--vulpine-primary-container)]/30 bg-[var(--vulpine-primary-container)]/10 text-[var(--vulpine-primary-container)]"
                    : "text-[var(--vulpine-on-surface-variant)] hover:bg-white/5 hover:text-[var(--vulpine-on-surface)]",
                )}
                onClick={() => setOpen(false)}
              >
                {t("home")}
                <ArrowRight className="size-4 opacity-40" aria-hidden />
              </Link>
            </li>
            {items.map((item) => {
              const active = item.match(pathname);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium transition-colors",
                      active
                        ? "border border-[var(--vulpine-primary-container)]/30 bg-[var(--vulpine-primary-container)]/10 text-[var(--vulpine-primary-container)]"
                        : "text-[var(--vulpine-on-surface-variant)] hover:bg-white/5 hover:text-[var(--vulpine-on-surface)]",
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                    <ArrowRight className="size-4 opacity-40" aria-hidden />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 border-t border-white/10 pt-4">
            <Link
              href="/search"
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[var(--vulpine-on-surface-variant)] transition-colors hover:bg-white/5 hover:text-[var(--vulpine-on-surface)]"
              onClick={() => setOpen(false)}
            >
              <Search className="size-4 text-[var(--vulpine-primary-container)]" aria-hidden />
              {t("search")}
            </Link>
          </div>
        </nav>

        <div className="mt-auto space-y-3 border-t border-white/10 p-4">
          <LocaleSwitcher inverted={isBrand} />
          <a
            href={MRFOX_APP_DOWNLOAD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ size: "lg" }),
              "vulpine-label vulpine-btn-glow w-full justify-center gap-2 rounded-xl",
              isBrand &&
                "bg-[var(--vulpine-primary-container)] text-[var(--vulpine-on-primary)] hover:brightness-110",
            )}
          >
            <Download className="size-4" aria-hidden />
            {t("download")}
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
}
