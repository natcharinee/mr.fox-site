"use client";

import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";
import { publicTheme } from "@/components/layout/public-theme";
import { cn } from "@/lib/utils";

const LABELS: Record<string, string> = {
  ios: "App Store",
  android: "Google Play",
  web: "Website",
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
}: {
  appSlug: string;
  appId: number;
  links: { type: string; url: string }[];
  className?: string;
  showDetailsLink?: boolean;
}) {
  const uniqueLinks = normalizeDownloadLinks(links);

  if (uniqueLinks.length === 0) {
    return (
      <Button
        disabled
        size="sm"
        className={cn(
          "border-white/10 bg-white/5 text-[var(--vulpine-on-surface-variant)]",
          className,
        )}
      >
        เร็วๆ นี้
      </Button>
    );
  }

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {uniqueLinks.map((link) => (
        <Button
          key={link.type}
          size="sm"
          variant="outline"
          className="border-white/15 bg-white/5 text-[var(--vulpine-on-surface)] hover:border-[var(--vulpine-primary-container)]/50 hover:bg-[var(--vulpine-primary-container)]/10 hover:text-[var(--vulpine-primary)]"
          nativeButton={false}
          render={
            <a
              href={link.url}
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
          <ExternalLink className="ml-1 size-3" />
        </Button>
      ))}
      {showDetailsLink ? (
        <LinkButton
          href={`/apps/${appSlug}`}
          size="sm"
          className={publicTheme.submitButton}
        >
          รายละเอียด
        </LinkButton>
      ) : null}
    </div>
  );
}
