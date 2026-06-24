import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { media } from "@/db/schema";

function useDatabaseStorage() {
  return Boolean(process.env.VERCEL);
}

function sanitizeFilename(name: string) {
  return `${Date.now()}-${name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
}

export async function storeUploadedFile(params: {
  buffer: Buffer;
  filename: string;
  mimeType: string;
  uploadedBy: number;
}) {
  const { buffer, filename, mimeType, uploadedBy } = params;
  const safeName = sanitizeFilename(filename);
  const sizeBytes = buffer.length;

  if (!useDatabaseStorage()) {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, safeName), buffer);

    const url = `/uploads/${safeName}`;
    const [row] = await db
      .insert(media)
      .values({
        filename,
        url,
        mimeType,
        sizeBytes,
        uploadedBy,
      })
      .returning();

    return { url, id: row.id };
  }

  const [row] = await db
    .insert(media)
    .values({
      filename,
      url: "/api/media/pending",
      mimeType,
      sizeBytes,
      uploadedBy,
      storageData: buffer.toString("base64"),
    })
    .returning();

  const url = `/api/media/${row.id}`;
  await db.update(media).set({ url }).where(eq(media.id, row.id));

  return { url, id: row.id };
}
