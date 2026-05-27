import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, description, visibility } = await req.json();
  if (!name?.trim()) return NextResponse.json({ error: "Name required" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const slug = slugify(name);
  const existing = await prisma.repository.findUnique({
    where: { ownerId_slug: { ownerId: user.id, slug } },
  });
  if (existing) return NextResponse.json({ error: "Repository slug already exists" }, { status: 409 });

  const repo = await prisma.repository.create({
    data: {
      name: name.trim(),
      slug,
      description: description?.trim() || null,
      visibility: visibility || "PUBLIC",
      ownerId: user.id,
    },
  });

  return NextResponse.json({
    ...repo,
    ownerUsername: user.username,
  });
}
