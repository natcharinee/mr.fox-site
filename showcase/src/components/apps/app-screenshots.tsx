import Image from "next/image";
import type { CSSProperties } from "react";
import { SectionHeading } from "@/components/layout/section-heading";
import { cn } from "@/lib/utils";

type AppScreenshotsProps = {
  title: string;
  appName: string;
  images: string[];
  className?: string;
};

export function AppScreenshots({
  title,
  appName,
  images,
  className,
}: AppScreenshotsProps) {
  if (images.length === 0) return null;

  // Duplicate once for a seamless CSS marquee loop (translate -50%).
  const loopImages = [...images, ...images];
  const durationSec = Math.max(images.length, 4) * 7;

  return (
    <section className={cn("mt-10", className)}>
      <SectionHeading title={title} className="mb-5" />
      <div
        className={cn(
          "app-screenshots-viewport -mx-1 overflow-hidden px-1 pb-2",
          "[mask-image:linear-gradient(to_right,transparent,black_1.5%,black_98.5%,transparent)]",
        )}
        style={
          {
            "--app-screenshots-duration": `${durationSec}s`,
          } as CSSProperties
        }
      >
        <div className="app-screenshots-track flex gap-3 sm:gap-4">
          {loopImages.map((src, i) => (
            <figure
              key={`${src}-${i}`}
              className={cn(
                "relative aspect-[9/16] w-[10.5rem] shrink-0 overflow-hidden rounded-2xl sm:w-[12rem] md:w-[13.5rem]",
                "border border-white/10 bg-black shadow-[0_10px_36px_rgba(0,0,0,0.4)]",
              )}
            >
              <Image
                src={src}
                alt={`${appName} screenshot ${(i % images.length) + 1}`}
                fill
                sizes="(max-width: 640px) 168px, (max-width: 768px) 192px, 216px"
                className="object-cover object-top"
                draggable={false}
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
