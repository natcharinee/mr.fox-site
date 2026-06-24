"use client";

import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";
import { publicTheme } from "@/components/layout/public-theme";
import { cn } from "@/lib/utils";

const LABELS: Record<string, string> = {
  ios: "App Store",
  android: "Google Play",
  apk: "APK",
  web: "Website",
};

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
  if (links.length === 0) {
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

  const uniqueLinks = Array.from(
    new Map(links.map((link) => [link.type, link])).values(),
  );

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
