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
  const objectFit = fallback ? "contain" : fit;

  const image = (
    <Image
      src={resolved}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      unoptimized={unoptimized}
      style={focusStyle}
      className={cn(
        objectFit === "contain" ? "object-contain" : "object-cover",
        fallback && "p-4",
        className,
        fallback && fallbackClassName,
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
