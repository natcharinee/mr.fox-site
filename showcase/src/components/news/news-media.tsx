import { ContentImage } from "@/components/ui/content-image";
import { isCompanyLogo, resolveImageUrl } from "@/lib/brand-assets";
import { cn } from "@/lib/utils";

type NewsMediaProps = {
  thumbnailUrl?: string | null;
  title: string;
  className?: string;
  imageClassName?: string;
};

export function NewsMedia({
  thumbnailUrl,
  title,
  className,
  imageClassName,
}: NewsMediaProps) {
  const resolved = resolveImageUrl(thumbnailUrl);
  const fallback = isCompanyLogo(resolved);

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-black",
        fallback && "bg-[var(--fox-gold)]",
        className,
      )}
    >
      <ContentImage
        src={thumbnailUrl}
        alt={title}
        fill
        fit={fallback ? "contain" : "cover"}
        quality={90}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 420px"
        className={cn(
          fallback ? "object-contain p-8" : "object-cover",
          imageClassName,
        )}
      />
    </div>
  );
}
