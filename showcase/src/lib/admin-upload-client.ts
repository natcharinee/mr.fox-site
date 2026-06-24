export async function parseUploadResponse(
  res: Response,
): Promise<{ url?: string; error?: string; id?: number }> {
  const text = await res.text();

  if (!text.trim()) {
    throw new Error(
      res.ok
        ? "อัปโหลดไม่สำเร็จ"
        : `อัปโหลดไม่สำเร็จ (${res.status})`,
    );
  }

  try {
    return JSON.parse(text) as { url?: string; error?: string; id?: number };
  } catch {
    throw new Error("เซิร์ฟเวอร์ตอบกลับไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง");
  }
}

export async function uploadAdminFile(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/admin/upload", {
    method: "POST",
    body: formData,
    credentials: "same-origin",
  });

  const data = await parseUploadResponse(res);

  if (!res.ok || !data.url) {
    throw new Error(data.error ?? "อัปโหลดไม่สำเร็จ");
  }

  return data;
}
