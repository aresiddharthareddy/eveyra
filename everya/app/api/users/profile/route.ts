import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, bio } = await req.json();
  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: { name: name?.trim(), bio: bio?.trim() },
  });

  return NextResponse.json(user);
}
