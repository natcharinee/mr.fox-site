"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { uploadAdminFile } from "@/lib/admin-upload-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function MediaUploadForm() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUploading(true);
    setError("");

    const fileInput = e.currentTarget.elements.namedItem("file");
    const file =
      fileInput instanceof HTMLInputElement ? fileInput.files?.[0] : null;

    if (!file) {
      setError("กรุณาเลือกไฟล์");
      setUploading(false);
      return;
    }

    try {
      await uploadAdminFile(file);
      router.refresh();
      e.currentTarget.reset();
      toast.success("อัปโหลดไฟล์สำเร็จแล้ว");
    } catch (uploadError) {
      const message =
        uploadError instanceof Error
          ? uploadError.message
          : "อัปโหลดไม่สำเร็จ";
      setError(message);
      toast.error(message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">อัปโหลดไฟล์</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="file">เลือกไฟล์ (รูป/วิดีโอ, สูงสุด 10MB)</Label>
            <Input
              id="file"
              name="file"
              type="file"
              accept="image/*,video/*"
              required
              className="mt-1"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={uploading}>
            {uploading ? "กำลังอัปโหลด..." : "อัปโหลด"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
