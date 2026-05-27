import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: documentId } = await params;
  const { value } = await req.json();
  if (!value || value < 1 || value > 5) {
    return NextResponse.json({ error: "Rating must be 1-5" }, { status: 400 });
  }

  await prisma.rating.upsert({
    where: { documentId_userId: { documentId, userId: session.user.id } },
    create: { documentId, userId: session.user.id, value },
    update: { value },
  });

  return NextResponse.json({ ok: true });
}
