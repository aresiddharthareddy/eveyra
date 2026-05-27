import Link from "next/link";
import { BookOpen, FolderGit2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { formatUsername, formatCount } from "@/lib/utils";

export default async function ExplorePage() {
  const [repos, docs] = await Promise.all([
    prisma.repository.findMany({
      where: { visibility: "PUBLIC" },
      include: { owner: { select: { username: true } }, _count: { select: { documents: true } } },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.document.findMany({
      where: { repository: { visibility: "PUBLIC" } },
      include: {
        author: { select: { username: true } },
        repository: { select: { name: true, slug: true, owner: { select: { username: true } } } },
      },
      orderBy: { readerCount: "desc" },
      take: 20,
    }),
  ]);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Explore</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Discover public repositories and documentation
        </p>
      </div>

      <section>
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">
          Repositories
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {repos.map((repo) => (
            <Link
              key={repo.id}
              href={`/r/${repo.owner.username}/${repo.slug}`}
              className="rounded-lg border border-border p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <FolderGit2 className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{repo.name}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{formatUsername(repo.owner.username)}</p>
              {repo.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{repo.description}</p>
              )}
              <Badge variant="outline">{repo._count.documents} docs</Badge>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">
          Popular documents
        </h2>
        <div className="divide-y divide-border rounded-lg border border-border">
          {docs.map((doc) => (
            <Link
              key={doc.id}
              href={`/r/${doc.repository.owner.username}/${doc.repository.slug}/${doc.slug}`}
              className="flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <BookOpen className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{doc.title}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {doc.repository.name} · {formatUsername(doc.author.username)}
                  </p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground shrink-0 ml-4">
                {formatCount(doc.readerCount)} readers
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
