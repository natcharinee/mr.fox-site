"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import "./particle-hero.css";

interface Particle {
  x: number;
  y: number;
  speed: number;
  opacity: number;
  fadeDelay: number;
  fadeStart: number;
  fadingOut: boolean;
  reset: () => void;
  update: () => void;
  draw: (ctx: CanvasRenderingContext2D) => void;
}

type ParticleHeroProps = {
  children: React.ReactNode;
  className?: string;
};

export function ParticleHero({ children, className }: ParticleHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const createParticle = (): Particle => {
      const particle = {
        x: 0,
        y: 0,
        speed: 0,
        opacity: 1,
        fadeDelay: 0,
        fadeStart: 0,
        fadingOut: false,
        reset() {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
          this.speed = Math.random() / 5 + 0.1;
          this.opacity = 1;
          this.fadeDelay = Math.random() * 600 + 100;
          this.fadeStart = Date.now() + this.fadeDelay;
          this.fadingOut = false;
        },
        update() {
          this.y -= this.speed;
          if (this.y < 0) this.reset();

          if (!this.fadingOut && Date.now() > this.fadeStart) {
            this.fadingOut = true;
          }

          if (this.fadingOut) {
            this.opacity -= 0.008;
            if (this.opacity <= 0) this.reset();
          }
        },
        draw(context: CanvasRenderingContext2D) {
          const gold = 194 + Math.random() * 50;
          context.fillStyle = `rgba(255, ${gold}, ${20 + Math.random() * 30}, ${this.opacity * 0.75})`;
          context.fillRect(this.x, this.y, 0.4, Math.random() * 2 + 1);
        },
      };

      particle.reset();
      particle.y = Math.random() * canvas.height;
      return particle;
    };

    const initParticles = () => {
      const count = Math.floor((canvas.width * canvas.height) / 6000);
      particlesRef.current = Array.from({ length: count }, () => createParticle());
    };

    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      if (width === 0 || height === 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      initParticles();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!reduceMotion) {
        particlesRef.current.forEach((particle) => {
          particle.update();
          particle.draw(ctx);
        });
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    resize();
    animate();

    const observer = new ResizeObserver(resize);
    observer.observe(container);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const horizontalLines = [6, 11, 16, 24, 29];
  const verticalLines = [24, 34, -24, -34];

  return (
    <div
      ref={containerRef}
      className={cn("particle-hero relative w-full overflow-hidden", className)}
    >
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        <div className="absolute inset-x-0 top-0 mx-auto h-[42em] w-full overflow-hidden">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                "absolute inset-x-0 top-[3em] mx-auto h-[max(42em,70vh)] w-[30em] origin-top",
                i === 0 && "particle-hero__spotlight-beam rotate-[20deg]",
                i === 1 && "particle-hero__spotlight-beam--alt -rotate-[20deg]",
                i === 2 && "particle-hero__spotlight-beam--reverse",
              )}
              style={{
                borderRadius: "0 0 50% 50%",
                backgroundImage:
                  "conic-gradient(from 0deg at 50% -5%, transparent 45%, var(--particle-spotlight) 49%, rgba(255, 224, 138, 0.45) 50%, var(--particle-spotlight) 51%, transparent 55%)",
                filter: "blur(15px) opacity(0.45)",
              }}
            />
          ))}
        </div>

        <div className="absolute inset-x-0 top-0 h-[42em] w-full">
          <div className="absolute inset-0">
            {horizontalLines.map((top) => (
              <div
                key={`h-${top}`}
                className="particle-hero__accent-h absolute inset-x-0 h-px scale-0 opacity-0"
                style={{
                  top: `${top}em`,
                  background:
                    "linear-gradient(90deg, transparent, var(--particle-accent), transparent)",
                }}
              />
            ))}
          </div>
          <div className="absolute inset-0">
            {verticalLines.map((left) => (
              <div
                key={`v-${left}`}
                className="particle-hero__accent-v absolute top-0 h-full w-px scale-0 opacity-0"
                style={{
                  left: left > 0 ? `${left}em` : undefined,
                  right: left < 0 ? `${Math.abs(left)}em` : undefined,
                  background: "var(--particle-accent)",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        className="particle-hero__canvas pointer-events-none absolute inset-0 z-[1]"
        aria-hidden
      />

      <div className="particle-hero__content relative z-10 overflow-visible">{children}</div>
    </div>
  );
}
