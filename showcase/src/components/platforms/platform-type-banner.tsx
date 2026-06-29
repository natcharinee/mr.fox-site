import Image from "next/image";
import { cn } from "@/lib/utils";

export const PLATFORM_TYPE_BANNER = "/platforms/content-to-earn-banner.png";

type PlatformTypeBannerProps = {
  alt: string;
  className?: string;
  variant?: "card" | "page-top";
  href?: string;
};

export function PlatformTypeBanner({
  alt,
  className,
  variant = "card",
  href,
}: PlatformTypeBannerProps) {
  const shellClass = cn(
    variant === "card" &&
      "relative overflow-hidden rounded-2xl border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.2)]",
    variant === "page-top" && "relative w-full overflow-hidden",
    href &&
      "block transition-opacity hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--vulpine-primary-container)]",
    className,
  );

  const content = (
    <div className="relative aspect-[1024/390] w-full">
      <Image
        src={PLATFORM_TYPE_BANNER}
        alt={alt}
        fill
        priority
        sizes="(max-width: 768px) 100vw, 1200px"
        className="object-cover"
      />
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={shellClass}
        aria-label={alt}
      >
        {content}
      </a>
    );
  }

  return <div className={shellClass}>{content}</div>;
}
