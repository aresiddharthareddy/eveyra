import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: documentId } = await params;
  const existing = await prisma.documentLike.findUnique({
    where: { documentId_userId: { documentId, userId: session.user.id } },
  });

  if (existing) {
    await prisma.documentLike.delete({ where: { id: existing.id } });
    return NextResponse.json({ liked: false });
  }

  await prisma.documentLike.create({ data: { documentId, userId: session.user.id } });
  return NextResponse.json({ liked: true });
}
