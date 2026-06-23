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
        "relative overflow-hidden",
        fallback ? "bg-[var(--fox-gold)]" : "bg-[var(--fox-charcoal)]",
        className,
      )}
    >
      <ContentImage
        src={thumbnailUrl}
        alt={title}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className={cn(fallback && "p-8", imageClassName)}
      />
    </div>
  );
}
