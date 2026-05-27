import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const username = req.nextUrl.searchParams.get("username")?.replace(/^@/, "");
  const repo = req.nextUrl.searchParams.get("repo");
  const doc = req.nextUrl.searchParams.get("doc");

  const document = await prisma.document.findFirst({
    where: {
      slug: doc || "",
      authorId: session.user.id,
      repository: { slug: repo || "", owner: { username: username || "" } },
    },
  });

  if (!document) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ document });
}
