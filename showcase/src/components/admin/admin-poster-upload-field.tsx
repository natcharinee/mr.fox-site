"use client";

import Image from "next/image";
import { useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { FocalPointPicker } from "@/components/admin/focal-point-picker";
import { uploadAdminFile } from "@/lib/admin-upload-client";
import { DEFAULT_IMAGE_FOCUS } from "@/lib/image-focus";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type AdminPosterUploadFieldProps = {
  name?: string;
  focusName?: string;
  label?: string;
  hint?: string;
  className?: string;
  defaultValue?: string;
  defaultFocus?: string;
  previewClassName?: string;
};

export function AdminPosterUploadField({
  name = "posterUrl",
  focusName = "posterFocus",
  label = "รูปโปสเตอร์ (แสดงหน้าบ้าน)",
  hint = "อัปโหลดรูปแนวตั้งหรือสี่เหลี่ยม — แนะนำขนาดอย่างน้อย 600×800 px",
  className,
  defaultValue = "",
  defaultFocus = DEFAULT_IMAGE_FOCUS,
  previewClassName = "h-40 w-28",
}: AdminPosterUploadFieldProps) {
  const [fileInputKey, setFileInputKey] = useState(0);
  const [posterUrl, setPosterUrl] = useState(defaultValue);
  const [posterFocus, setPosterFocus] = useState(defaultFocus);
  const [uploading, setUploading] = useState(false);

  async function handleFileChange(file: File | null) {
    if (!file) return;

    setUploading(true);

    try {
      const data = await uploadAdminFile(file);
      setPosterUrl(data.url!);
      setPosterFocus(DEFAULT_IMAGE_FOCUS);
      toast.success("อัปโหลดรูปสำเร็จแล้ว");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "อัปโหลดไม่สำเร็จ";
      toast.error(message);
      setFileInputKey((k) => k + 1);
    } finally {
      setUploading(false);
    }
  }

  function clearPoster() {
    setPosterUrl("");
    setPosterFocus(DEFAULT_IMAGE_FOCUS);
    setFileInputKey((k) => k + 1);
  }

  return (
    <div className={cn("sm:col-span-2", className)}>
      <input type="hidden" name={name} value={posterUrl} />
      <input type="hidden" name={focusName} value={posterFocus} />

      <Label htmlFor={`${name}-file`}>{label}</Label>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>

      <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-start">
        {posterUrl ? (
          <div className="relative shrink-0">
            <FocalPointPicker
              imageUrl={posterUrl}
              value={posterFocus}
              onChange={setPosterFocus}
              previewClassName={previewClassName}
            />
            <Button
              type="button"
              size="icon-sm"
              variant="secondary"
              className="absolute top-1.5 right-1.5 z-10 size-7 bg-background/90"
              onClick={clearPoster}
              aria-label="ลบรูป"
            >
              <X className="size-3.5" />
            </Button>
          </div>
        ) : (
          <div
            className={cn(
              "relative shrink-0 overflow-hidden rounded-xl border border-dashed border-input bg-muted/30",
              previewClassName,
            )}
          >
            <div className="flex h-full flex-col items-center justify-center gap-2 px-2 text-center text-xs text-muted-foreground">
              <ImagePlus className="size-5 opacity-60" aria-hidden />
              ยังไม่มีรูป
            </div>
          </div>
        )}

        <div className="flex flex-1 flex-col gap-2">
          <Input
            key={fileInputKey}
            id={`${name}-file`}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            disabled={uploading}
            className="mt-0"
            onChange={(e) => void handleFileChange(e.target.files?.[0] ?? null)}
          />
          <p className="text-xs text-muted-foreground">
            {uploading
              ? "กำลังอัปโหลด..."
              : "รองรับ JPG, PNG, WebP, GIF สูงสุด 10MB"}
          </p>
          {posterUrl ? (
            <div className="relative mt-1 hidden h-24 w-full overflow-hidden rounded-lg border bg-[var(--fox-charcoal)] sm:block">
              <Image
                src={posterUrl}
                alt=""
                fill
                unoptimized
                className="object-contain"
                style={{ objectPosition: posterFocus }}
                sizes="320px"
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
