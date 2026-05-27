import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { documentId, content, parentId } = await req.json();
  if (!documentId || !content?.trim()) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const comment = await prisma.comment.create({
    data: {
      documentId,
      content: content.trim(),
      authorId: session.user.id,
      parentId: parentId || null,
    },
    include: {
      author: { select: { id: true, username: true, name: true, image: true } },
    },
  });

  return NextResponse.json({
    ...comment,
    createdAt: comment.createdAt.toISOString(),
    replies: [],
  });
}
