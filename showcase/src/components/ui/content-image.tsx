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
}: ContentImageProps) {
  const resolved = resolveImageUrl(src);
  const fallback = isCompanyLogo(resolved);

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
      className={cn(
        fallback ? "object-contain p-4" : "object-cover",
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
