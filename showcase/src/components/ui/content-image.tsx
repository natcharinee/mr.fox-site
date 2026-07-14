import Image from "next/image";
import { COMPANY_LOGO, isCompanyLogo, resolveImageUrl } from "@/lib/brand-assets";
import { cn } from "@/lib/utils";

type ContentImageProps = {
  src?: string | null;
  alt?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  unoptimized?: boolean;
  className?: string;
  fallbackClassName?: string;
  wrapperClassName?: string;
  objectPosition?: string | null;
  fit?: "cover" | "contain";
};

export function ContentImage({
  src,
  alt = "",
  fill,
  width,
  height,
  sizes,
  priority,
  quality,
  unoptimized,
  className,
  fallbackClassName,
  wrapperClassName,
  objectPosition,
  fit = "contain",
}: ContentImageProps) {
  const resolved = resolveImageUrl(src);
  const fallback = isCompanyLogo(resolved);
  const focusStyle = !fallback && objectPosition ? { objectPosition } : undefined;
  // Allow callers to force cover (e.g. brand mark matching header); default remain contain+pad.
  const objectFit = fit === "cover" ? "cover" : fallback ? "contain" : fit;
  const padFallback = fallback && objectFit === "contain";

  const image = (
    <Image
      src={resolved}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      quality={quality}
      unoptimized={unoptimized}
      style={focusStyle}
      className={cn(
        objectFit === "contain" ? "object-contain" : "object-cover",
        padFallback && "p-4",
        className,
        padFallback && fallbackClassName,
      )}
    />
  );

  if (!wrapperClassName) {
    return image;
  }

  return (
    <div
      className={cn(
        fallback && "bg-[var(--fox-gold)]",
        wrapperClassName,
      )}
    >
      {image}
    </div>
  );
}

export { COMPANY_LOGO };
