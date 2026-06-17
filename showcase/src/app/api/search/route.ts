import { NextRequest, NextResponse } from "next/server";
import { globalSearch } from "@/lib/queries";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 2) {
    return NextResponse.json({ platforms: [], apps: [], features: [], news: [] });
  }

  const results = await globalSearch(q);
  return NextResponse.json(results);
}
