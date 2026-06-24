import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { getSession } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { storeUploadedFile } from "@/lib/media-storage";

const MAX_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
];

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "File type not allowed" }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File too large (max 10MB)" },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const { url, id } = await storeUploadedFile({
      buffer,
      filename: file.name,
      mimeType: file.type,
      uploadedBy: session.userId,
    });

    await logAudit(session, "upload", "media", id, file.name);

    return NextResponse.json({ url, id });
  } catch (error) {
    console.error("Upload failed:", error);

    const message =
      error instanceof Error ? error.message : "อัปโหลดไม่สำเร็จ";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
