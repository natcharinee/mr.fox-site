"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

const LABELS: Record<Locale, string> = {
  th: "ไทย",
  en: "EN",
  zh: "中文",
};

export function LocaleSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex gap-1">
      {routing.locales.map((l) => (
        <Button
          key={l}
          size="xs"
          variant={l === locale ? "default" : "ghost"}
          onClick={() => router.replace(pathname, { locale: l })}
        >
          {LABELS[l]}
        </Button>
      ))}
    </div>
  );
}
