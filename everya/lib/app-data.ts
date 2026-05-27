import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/session";

export async function getUserRepositories(userId: string) {
  return prisma.repository.findMany({
    where: { ownerId: userId },
    orderBy: { updatedAt: "desc" },
    select: { id: true, name: true, slug: true, owner: { select: { username: true } } },
  });
}

export async function getAppLayoutData() {
  const session = await getServerSession();
  if (!session) return { repositories: [] };

  const repos = await getUserRepositories(session.user.id);
  return {
    repositories: repos.map((r) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      ownerUsername: r.owner.username,
    })),
  };
}
