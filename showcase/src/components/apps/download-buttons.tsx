"use client";

import { ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";
import { publicTheme } from "@/components/layout/public-theme";
import { resolveStoreDownloadUrl } from "@/lib/app-download";
import { cn } from "@/lib/utils";

const LABELS: Record<string, string> = {
  ios: "App Store",
  android: "Google Play",
  web: "Website",
};

const STORE_BUTTON_STYLES: Record<string, string> = {
  ios: cn(
    "border-white/35 bg-gradient-to-b from-white/14 to-white/[0.06] text-white",
    "shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_4px_14px_rgba(0,0,0,0.35)]",
    "hover:border-white/55 hover:from-white/20 hover:to-white/10 hover:text-white",
  ),
  android: cn(
    "border-[var(--vulpine-primary-container)]/55",
    "bg-gradient-to-b from-[var(--vulpine-primary-container)] to-[var(--vulpine-primary)]/90",
    "text-[var(--vulpine-on-primary)]",
    "shadow-[0_0_0_1px_rgba(255,184,0,0.18),0_4px_16px_rgba(255,184,0,0.2)]",
    "hover:border-[var(--vulpine-primary-container)] hover:brightness-110 hover:text-[var(--vulpine-on-primary)]",
    "vulpine-btn-glow",
  ),
  web: publicTheme.badgeOutline,
};

const LINK_ORDER = ["ios", "android", "web"] as const;

function normalizeDownloadLinks(links: { type: string; url: string }[]) {
  return Array.from(new Map(links.map((link) => [link.type, link])).values())
    .filter((link) => link.type !== "apk")
    .sort((a, b) => {
      const order = (type: string) => {
        const index = LINK_ORDER.indexOf(type as (typeof LINK_ORDER)[number]);
        return index === -1 ? LINK_ORDER.length : index;
      };
      return order(a.type) - order(b.type);
    });
}

export function DownloadButtons({
  appSlug,
  appId,
  links,
  className,
  showDetailsLink = true,
  layout = "inline",
  align = "start",
  compact = false,
}: {
  appSlug: string;
  appId: number;
  links: { type: string; url: string }[];
  className?: string;
  showDetailsLink?: boolean;
  layout?: "inline" | "split";
  align?: "start" | "center" | "end";
  compact?: boolean;
}) {
  const t = useTranslations("apps");
  const uniqueLinks = normalizeDownloadLinks(links);

  if (uniqueLinks.length === 0) {
    return (
      <Button
        disabled
        size="sm"
        className={cn(
          publicTheme.badgeOutline,
          "text-[var(--vulpine-on-surface-variant)] opacity-70",
          className,
        )}
      >
        {t("comingSoon")}
      </Button>
    );
  }

  const storeButtons = uniqueLinks.map((link) => (
    <Button
      key={link.type}
      size="sm"
      variant="outline"
      className={cn(
        "shrink-0 rounded-xl border font-semibold transition-all",
        compact ? "h-8 max-w-full px-2.5 text-xs" : "h-10 px-4 text-sm",
        STORE_BUTTON_STYLES[link.type] ?? publicTheme.badgeOutline,
      )}
      nativeButton={false}
      render={
        <a
          href={resolveStoreDownloadUrl(link.type, link.url)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            void fetch("/api/downloads/track", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                applicationId: appId,
                linkType: link.type,
              }),
            });
          }}
        />
      }
    >
      {LABELS[link.type] ?? link.type}
      <ExternalLink className={cn("opacity-80", compact ? "ml-1 size-3" : "ml-1.5 size-3.5")} />
    </Button>
  ));

  const detailsButton = showDetailsLink ? (
    <LinkButton
      href={`/apps/${appSlug}`}
      size="sm"
      className={cn(
        publicTheme.submitButton,
        compact ? "h-8 w-full max-w-[11rem] px-3 text-xs" : "h-9 px-4",
      )}
    >
      {t("viewDetails")}
    </LinkButton>
  ) : null;

  const storeButtonRow = (
    <div
      className={cn(
        "flex w-full max-w-full gap-2",
        compact || align === "center"
          ? "justify-center"
          : align === "end"
            ? "justify-end"
            : "justify-start",
        compact ? "flex-wrap" : "flex-nowrap",
      )}
    >
      {storeButtons}
    </div>
  );

  if (layout === "split") {
    return (
      <div
        className={cn(
          "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
          className,
        )}
      >
        {storeButtonRow}
        {detailsButton}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex w-full max-w-full flex-col gap-2",
        align === "center" ? "items-center" : align === "end" ? "items-end" : "items-start",
        className,
      )}
    >
      {storeButtonRow}
      {detailsButton}
    </div>
  );
}
