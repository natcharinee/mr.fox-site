"use client";

import { useEffect, useRef, useState } from "react";
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
  usage?: string;
  hint?: string;
  className?: string;
  defaultValue?: string;
  defaultFocus?: string;
  previewClassName?: string;
};

export function AdminPosterUploadField({
  name = "posterUrl",
  focusName = "posterFocus",
  label = "รูป Poster (หน้าแรก)",
  usage,
  hint = "อัปโหลดรูปสำหรับส่วน Featured Applications บนหน้าแรก — แนะนำแนวตั้งอย่างน้อย 600×800 px",
  className,
  defaultValue = "",
  defaultFocus = DEFAULT_IMAGE_FOCUS,
  previewClassName = "h-44 w-32 sm:h-48 sm:w-36",
}: AdminPosterUploadFieldProps) {
  const [fileInputKey, setFileInputKey] = useState(0);
  const [posterUrl, setPosterUrl] = useState(defaultValue);
  const [posterFocus, setPosterFocus] = useState(defaultFocus);
  const [uploading, setUploading] = useState(false);
  const urlInputRef = useRef<HTMLInputElement>(null);
  const focusInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (urlInputRef.current) {
      urlInputRef.current.value = posterUrl;
    }
  }, [posterUrl]);

  useEffect(() => {
    if (focusInputRef.current) {
      focusInputRef.current.value = posterFocus;
    }
  }, [posterFocus]);

  async function handleFileChange(file: File | null) {
    if (!file) return;

    setUploading(true);

    try {
      const data = await uploadAdminFile(file);
      setPosterUrl(data.url!);
      setPosterFocus(DEFAULT_IMAGE_FOCUS);
      toast.success("อัปโหลดสำเร็จ — กดบันทึกด้านล่างเพื่อใช้รูปนี้บนหน้าบ้าน");
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
    <div
      className={cn(
        "sm:col-span-2 rounded-xl border border-border bg-muted/15 p-4 sm:p-5",
        className,
      )}
    >
      <input
        ref={urlInputRef}
        type="hidden"
        name={name}
        defaultValue={defaultValue}
      />
      <input
        ref={focusInputRef}
        type="hidden"
        name={focusName}
        defaultValue={defaultFocus}
      />

      <div className="space-y-1">
        <Label htmlFor={`${name}-file`} className="text-sm font-semibold">
          {label}
        </Label>
        {usage ? (
          <p className="text-xs font-medium text-[var(--fox-gold-dark)]">{usage}</p>
        ) : null}
        <p className="text-sm leading-relaxed text-muted-foreground">{hint}</p>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <Input
          key={fileInputKey}
          id={`${name}-file`}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          disabled={uploading}
          className="max-w-md bg-background"
          onChange={(e) => void handleFileChange(e.target.files?.[0] ?? null)}
        />
        <p className="text-xs text-muted-foreground">
          {uploading ? "กำลังอัปโหลด..." : "JPG, PNG, WebP, GIF · สูงสุด 10MB"}
        </p>
        {posterUrl ? (
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="shrink-0 sm:ml-auto"
            onClick={clearPoster}
          >
            <X className="mr-1.5 size-3.5" aria-hidden />
            ลบรูป
          </Button>
        ) : null}
      </div>

      {posterUrl ? (
        <div className="mt-5 border-t border-border/80 pt-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            ตัวอย่างบนหน้าบ้าน
          </p>
          <FocalPointPicker
            imageUrl={posterUrl}
            value={posterFocus}
            onChange={setPosterFocus}
            previewClassName={previewClassName}
          />
        </div>
      ) : (
        <div
          className={cn(
            "mt-4 flex items-center justify-center gap-3 rounded-xl border border-dashed border-input bg-background/60 px-4 py-10 text-center",
          )}
        >
          <ImagePlus className="size-5 shrink-0 text-muted-foreground/60" aria-hidden />
          <p className="text-sm text-muted-foreground">ยังไม่มีรูป — เลือกไฟล์ด้านบนเพื่ออัปโหลด</p>
        </div>
      )}
    </div>
  );
}
