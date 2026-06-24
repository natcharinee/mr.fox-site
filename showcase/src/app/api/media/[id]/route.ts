import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { media } from "@/db/schema";

type Props = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Props) {
  const { id } = await params;
  const mediaId = Number(id);

  if (!Number.isFinite(mediaId)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const [row] = await db
    .select({
      mimeType: media.mimeType,
      storageData: media.storageData,
      url: media.url,
    })
    .from(media)
    .where(eq(media.id, mediaId))
    .limit(1);

  if (!row) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (row.storageData) {
    const body = Buffer.from(row.storageData, "base64");

    return new NextResponse(body, {
      headers: {
        "Content-Type": row.mimeType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }

  if (row.url.startsWith("/uploads/")) {
    return NextResponse.redirect(new URL(row.url, _request.url));
  }

  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
