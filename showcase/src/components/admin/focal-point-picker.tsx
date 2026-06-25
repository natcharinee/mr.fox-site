"use client";

import Image from "next/image";
import { useState } from "react";
import {
  DEFAULT_IMAGE_FOCUS,
  formatImageFocus,
  parseImageFocus,
} from "@/lib/image-focus";
import { cn } from "@/lib/utils";

type FocalPointPickerProps = {
  imageUrl: string;
  value?: string;
  onChange: (value: string) => void;
  className?: string;
  previewClassName?: string;
};

export function FocalPointPicker({
  imageUrl,
  value = DEFAULT_IMAGE_FOCUS,
  onChange,
  className,
  previewClassName = "h-40 w-28",
}: FocalPointPickerProps) {
  const [focus, setFocus] = useState(() => parseImageFocus(value).css);
  const { x, y } = parseImageFocus(focus);

  function updateFocus(nextX: number, nextY: number) {
    const next = formatImageFocus(nextX, nextY);
    setFocus(next);
    onChange(next);
  }

  function handlePointer(event: React.PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const nextX = ((event.clientX - rect.left) / rect.width) * 100;
    const nextY = ((event.clientY - rect.top) / rect.height) * 100;
    updateFocus(nextX, nextY);
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div
        className={cn(
          "relative touch-none overflow-hidden rounded-xl border border-dashed border-input bg-muted/30",
          previewClassName,
        )}
        onPointerDown={handlePointer}
        role="button"
        tabIndex={0}
        aria-label="เลือกจุดโฟกัสของรูป"
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            updateFocus(50, 50);
          }
        }}
      >
        <Image
          src={imageUrl}
          alt=""
          fill
          unoptimized
          draggable={false}
          className="pointer-events-none object-contain"
          style={{ objectPosition: focus }}
          sizes="160px"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[var(--fox-gold)] shadow-md ring-2 ring-black/30"
          style={{ left: `${x}%`, top: `${y}%` }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_45%,rgba(0,0,0,0.18))]"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <p className="text-xs text-muted-foreground">
          คลิกบนรูปเพื่อเลือกจุดที่อยากให้แสดงในกรอบ (focal point)
        </p>
        <button
          type="button"
          className="text-xs font-medium text-[var(--fox-gold-dark)] underline-offset-2 hover:underline"
          onClick={() => updateFocus(50, 50)}
        >
          รีเซ็ตกลางรูป
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <FramePreview
          label="ตาราง admin"
          imageUrl={imageUrl}
          focus={focus}
          className="h-12 w-9 rounded-md"
        />
        <FramePreview
          label="การ์ดแอป"
          imageUrl={imageUrl}
          focus={focus}
          className="h-16 w-12 rounded-lg"
        />
        <FramePreview
          label="หน้าแรก"
          imageUrl={imageUrl}
          focus={focus}
          className="col-span-2 h-20 w-full max-w-[5.5rem] rounded-lg sm:col-span-1 sm:w-16"
        />
      </div>
    </div>
  );
}

function FramePreview({
  label,
  imageUrl,
  focus,
  className,
}: {
  label: string;
  imageUrl: string;
  focus: string;
  className: string;
}) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-medium text-muted-foreground">{label}</p>
      <div
        className={cn(
          "relative overflow-hidden bg-[var(--fox-charcoal)]",
          className,
        )}
      >
        <Image
          src={imageUrl}
          alt=""
          fill
          unoptimized
          className="object-contain p-0.5"
          style={{ objectPosition: focus }}
          sizes="80px"
        />
      </div>
    </div>
  );
}
