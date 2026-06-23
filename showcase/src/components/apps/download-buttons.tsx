"use client";

import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";
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
          "border-[#e8d49a] bg-[#fff4cc]/50 text-muted-foreground",
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
          className="border-[#e8d49a] bg-white/80 text-[var(--fox-charcoal)] hover:border-[var(--fox-gold)]/50 hover:bg-[#fff4cc]"
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
          className="bg-[var(--fox-charcoal)] text-white hover:bg-[var(--fox-charcoal)]/90"
        >
          รายละเอียด
        </LinkButton>
      ) : null}
    </div>
  );
}
