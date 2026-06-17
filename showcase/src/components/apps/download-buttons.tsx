"use client";

import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";

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
}: {
  appSlug: string;
  appId: number;
  links: { type: string; url: string }[];
}) {
  if (links.length === 0) {
    return (
      <Button disabled size="sm">
        เร็วๆ นี้
      </Button>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {links.map((link) => (
        <Button key={link.type} size="sm" variant="outline" nativeButton={false} render={
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
        }>
          {LABELS[link.type] ?? link.type}
          <ExternalLink className="ml-1 size-3" />
        </Button>
      ))}
      <LinkButton href={`/apps/${appSlug}`} size="sm">
        รายละเอียด
      </LinkButton>
    </div>
  );
}
