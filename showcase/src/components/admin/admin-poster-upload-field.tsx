"use client";

import Image from "next/image";
import { useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type AdminPosterUploadFieldProps = {
  name?: string;
  label?: string;
  hint?: string;
  className?: string;
  defaultValue?: string;
  previewClassName?: string;
};

export function AdminPosterUploadField({
  name = "posterUrl",
  label = "รูปโปสเตอร์ (แสดงหน้าบ้าน)",
  hint = "อัปโหลดรูปแนวตั้งหรือสี่เหลี่ยม — แนะนำขนาดอย่างน้อย 600×800 px",
  className,
  defaultValue = "",
  previewClassName = "h-40 w-28",
}: AdminPosterUploadFieldProps) {
  const [fileInputKey, setFileInputKey] = useState(0);
  const [posterUrl, setPosterUrl] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);

  async function handleFileChange(file: File | null) {
    if (!file) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = (await res.json()) as { url?: string; error?: string };

      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "อัปโหลดไม่สำเร็จ");
      }

      setPosterUrl(data.url);
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
    setFileInputKey((k) => k + 1);
  }

  return (
    <div className={cn("sm:col-span-2", className)}>
      <input type="hidden" name={name} value={posterUrl} />

      <Label htmlFor={`${name}-file`}>{label}</Label>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start">
        <div
          className={cn(
            "relative shrink-0 overflow-hidden rounded-xl border border-dashed border-input bg-muted/30",
            previewClassName,
          )}
        >
          {posterUrl ? (
            <>
              <Image
                src={posterUrl}
                alt="ตัวอย่างโปสเตอร์"
                fill
                unoptimized
                className="object-cover"
                sizes="112px"
              />
              <Button
                type="button"
                size="icon-sm"
                variant="secondary"
                className="absolute top-1.5 right-1.5 size-7 bg-background/90"
                onClick={clearPoster}
                aria-label="ลบรูป"
              >
                <X className="size-3.5" />
              </Button>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 px-2 text-center text-xs text-muted-foreground">
              <ImagePlus className="size-5 opacity-60" aria-hidden />
              ยังไม่มีรูป
            </div>
          )}
        </div>

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
        </div>
      </div>
    </div>
  );
}
