"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

    const formData = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "อัปโหลดไม่สำเร็จ");
      setUploading(false);
      return;
    }

    router.refresh();
    setUploading(false);
    e.currentTarget.reset();
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
