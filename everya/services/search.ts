import { prisma } from "@/lib/prisma";
import type { SearchResult } from "@/types";

export async function searchAll(query: string, limit = 20): Promise<SearchResult[]> {
  const q = query.trim();
  if (!q || q.length < 2) return [];

  const [documents, repositories] = await Promise.all([
    prisma.document.findMany({
      where: {
        OR: [
          { title: { contains: q } },
          { content: { contains: q } },
          { excerpt: { contains: q } },
        ],
        repository: { visibility: "PUBLIC" },
      },
      take: limit,
      include: {
        repository: { select: { slug: true, name: true, owner: { select: { username: true } } } },
      },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.repository.findMany({
      where: {
        visibility: "PUBLIC",
        OR: [
          { name: { contains: q } },
          { description: { contains: q } },
        ],
      },
      take: limit,
      include: { owner: { select: { username: true } } },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  const results: SearchResult[] = [
    ...repositories.map((r) => ({
      type: "repository" as const,
      id: r.id,
      title: r.name,
      subtitle: `@${r.owner.username}`,
      href: `/r/${r.owner.username}/${r.slug}`,
    })),
    ...documents.map((d) => ({
      type: "document" as const,
      id: d.id,
      title: d.title,
      subtitle: `${d.repository.name} · @${d.repository.owner.username}`,
      href: `/r/${d.repository.owner.username}/${d.repository.slug}/${d.slug}`,
    })),
  ];

  return results.slice(0, limit);
}
