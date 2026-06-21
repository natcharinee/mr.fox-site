import Image from "next/image";

export function HeroPhoneMockup() {
  return (
    <div className="relative mx-auto w-[240px] sm:w-[280px]">
      <div className="pointer-events-none absolute -inset-6 rounded-full bg-[var(--fox-gold)]/20 blur-2xl" />

      <Image
        src="/hero/mrfox-app-mockup@2x.png"
        alt="Mr.FOX app"
        width={560}
        height={1131}
        priority
        unoptimized
        sizes="(max-width: 640px) 240px, 280px"
        className="relative h-auto w-full [transform:translateZ(0)]"
      />
    </div>
  );
}
