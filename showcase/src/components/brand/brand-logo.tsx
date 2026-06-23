import Image from "next/image";
import { cn } from "@/lib/utils";

const ICON = "/brand/mrfox-icon.png";
const WORDMARK = "/brand/mrfox-wordmark.png";

type BrandLogoProps = {
  className?: string;
  iconClassName?: string;
  wordmarkClassName?: string;
  showIcon?: boolean;
  showWordmark?: boolean;
  priority?: boolean;
};

export function BrandLogo({
  className,
  iconClassName,
  wordmarkClassName,
  showIcon = true,
  showWordmark = true,
  priority = false,
}: BrandLogoProps) {
  return (
    <span className={cn("inline-flex h-9 items-center gap-2.5", className)}>
      {showIcon && (
        <Image
          src={ICON}
          alt=""
          width={36}
          height={36}
          priority={priority}
          className={cn("size-9 shrink-0 rounded-lg object-cover", iconClassName)}
        />
      )}
      {showWordmark && (
        <Image
          src={WORDMARK}
          alt="Mr.FOX"
          width={148}
          height={37}
          priority={priority}
          className={cn("h-9 w-auto shrink-0", wordmarkClassName)}
        />
      )}
    </span>
  );
}
