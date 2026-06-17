import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { applications, downloadEvents } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { applicationId, linkType } = body as {
      applicationId?: number;
      linkType?: string;
    };

    if (!applicationId || !linkType) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    await db.insert(downloadEvents).values({
      applicationId,
      linkType: linkType as "ios" | "android" | "apk" | "web",
    });

    await db
      .update(applications)
      .set({ downloadCount: sql`${applications.downloadCount} + 1` })
      .where(eq(applications.id, applicationId));

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to track" }, { status: 500 });
  }
}
