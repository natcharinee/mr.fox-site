"use client";

import { useLocale } from "next-intl";
import { Check, ChevronDown } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { type Locale } from "@/i18n/routing";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "th", label: "ภาษาไทย", flag: "🇹🇭" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
];

export function LocaleSwitcher({
  inverted = false,
  compact = false,
  fullWidth = false,
}: {
  inverted?: boolean;
  compact?: boolean;
  fullWidth?: boolean;
}) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const current = LOCALES.find((item) => item.code === locale) ?? LOCALES[1];

  return (
    <DropdownMenu>
      <div className={cn(fullWidth && "w-full")}>
        <DropdownMenuTrigger
        className={cn(
          "items-center gap-2 rounded-xl border font-medium outline-none transition-colors select-none",
          fullWidth
            ? "flex h-11 w-full justify-between px-4 text-sm"
            : cn("inline-flex h-8 px-2.5 text-sm", compact && "gap-1.5 px-2"),
          inverted
            ? "border-white/15 bg-white/5 text-white hover:bg-white/10 data-popup-open:bg-white/10"
            : "border-border bg-background hover:bg-muted data-popup-open:bg-muted",
        )}
        aria-label="เปลี่ยนภาษา"
      >
        <span className="inline-flex min-w-0 items-center gap-2">
          <span className="text-base leading-none" aria-hidden>
            {current.flag}
          </span>
          <span className={cn("truncate", compact && !fullWidth && "sr-only")}>
            {current.label}
          </span>
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 opacity-70",
            compact && !fullWidth && "size-3.5",
          )}
        />
      </DropdownMenuTrigger>
      </div>

      <DropdownMenuContent
        align={fullWidth ? "start" : "end"}
        className={cn(fullWidth ? "w-[var(--anchor-width)]" : "min-w-40")}
      >
        {LOCALES.map((item) => (
          <DropdownMenuItem
            key={item.code}
            className="gap-2"
            onClick={() => router.replace(pathname, { locale: item.code })}
          >
            <span className="text-base leading-none" aria-hidden>
              {item.flag}
            </span>
            <span>{item.label}</span>
            {item.code === locale ? (
              <Check className="ml-auto size-4 text-primary" />
            ) : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
