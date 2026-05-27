import { NextRequest, NextResponse } from "next/server";
import { searchAll } from "@/services/search";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") || "";
  const results = await searchAll(q);
  return NextResponse.json({ results });
}
