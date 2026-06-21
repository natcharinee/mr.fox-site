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
  { code: "zh", label: "จีน", flag: "🇨🇳" },
];

export function LocaleSwitcher({ inverted = false }: { inverted?: boolean }) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const current = LOCALES.find((item) => item.code === locale) ?? LOCALES[1];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "inline-flex h-8 items-center gap-2 rounded-lg border px-2.5 text-sm font-medium outline-none transition-colors select-none",
          inverted
            ? "border-white/15 bg-white/5 text-white hover:bg-white/10 data-popup-open:bg-white/10"
            : "border-border bg-background hover:bg-muted data-popup-open:bg-muted",
        )}
        aria-label="เปลี่ยนภาษา"
      >
        <span className="text-base leading-none" aria-hidden>
          {current.flag}
        </span>
        <span className="max-w-24 truncate">{current.label}</span>
        <ChevronDown className="size-4 shrink-0 opacity-70" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-40">
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
