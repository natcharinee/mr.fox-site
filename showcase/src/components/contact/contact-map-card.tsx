import { useTranslations } from "next-intl";
import { ExternalLink } from "lucide-react";
import { GlassCard } from "@/components/vulpine/vulpine-primitives";
import { publicTheme } from "@/components/layout/public-theme";
import { MRFOX_MAP_EMBED_URL } from "@/lib/contact/map";
import { cn } from "@/lib/utils";

export function ContactMapCard() {
  const t = useTranslations("contact.map");

  return (
    <GlassCard className="overflow-hidden">
      <div className="p-6 pb-4">
        <p className="vulpine-label mb-2 text-[var(--vulpine-primary-container)]">
          {t("eyebrow")}
        </p>
        <h3 className="font-display text-base font-bold uppercase text-[var(--vulpine-on-surface)]">
          {t("title")}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--vulpine-on-surface-variant)]">
          {t("address")}
        </p>
      </div>

      <div className="relative aspect-[4/3] w-full border-y border-white/8 bg-[#0d0f0f]">
        <iframe
          src={MRFOX_MAP_EMBED_URL}
          title={t("iframeTitle")}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>

      <div className="p-4">
        <a
          href={t("openHref")}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:underline",
            publicTheme.link,
          )}
        >
          {t("openLabel")}
          <ExternalLink className="size-3.5" aria-hidden />
        </a>
      </div>
    </GlassCard>
  );
}
