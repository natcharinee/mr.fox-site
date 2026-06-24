import { ContentImage } from "@/components/ui/content-image";
import { isCompanyLogo, resolveImageUrl } from "@/lib/brand-assets";
import { cn } from "@/lib/utils";

type AppMediaProps = {
  posterUrl?: string | null;
  posterFocus?: string | null;
  name: string;
  className?: string;
  imageClassName?: string;
  fit?: "cover" | "contain";
};

export function AppMedia({
  posterUrl,
  posterFocus,
  name,
  className,
  imageClassName,
  fit = "contain",
}: AppMediaProps) {
  const resolved = resolveImageUrl(posterUrl);
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
        src={posterUrl}
        alt={name}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        objectPosition={posterFocus}
        fit={fit}
        className={cn(fallback && "p-8", imageClassName)}
      />
    </div>
  );
}
