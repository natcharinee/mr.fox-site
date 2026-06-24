"use client";

import { useState, useTransition } from "react";
import { RefreshCw } from "lucide-react";
import { syncInfoMrfoxNews } from "@/lib/admin/actions";
import { Button } from "@/components/ui/button";

export function SyncInfoNewsButton() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSync() {
    setMessage(null);
    setError(null);

    startTransition(async () => {
      try {
        const result = await syncInfoMrfoxNews();
        setMessage(
          `ดึงข่าวจาก info.mrfox.com สำเร็จ (${result.total} รายการ · ใหม่ ${result.created} · อัปเดต ${result.updated})`,
        );
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "ดึงข่าวจาก info.mrfox.com ไม่สำเร็จ",
        );
      }
    });
  }

  return (
    <div className="rounded-lg border bg-muted/30 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium">ดึงข่าวจาก info.mrfox.com</p>
          <p className="text-sm text-muted-foreground">
            นำเข้าข่าวจากส่วน Mr.FOX Reviews — ข่าวที่เพิ่มเองใน CMS ยังแก้ไขได้ตามปกติ
          </p>
        </div>
        <Button type="button" variant="outline" onClick={handleSync} disabled={pending}>
          <RefreshCw className={`mr-2 size-4 ${pending ? "animate-spin" : ""}`} />
          {pending ? "กำลังดึงข้อมูล..." : "Sync ข่าว"}
        </Button>
      </div>
      {message ? <p className="mt-3 text-sm text-green-700">{message}</p> : null}
      {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
