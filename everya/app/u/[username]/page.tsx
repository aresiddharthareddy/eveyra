import Link from "next/link";
import { notFound } from "next/navigation";
import { FileText, FolderGit2, Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatUsername, formatCount } from "@/lib/utils";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username: raw } = await params;
  const username = raw.replace(/^@/, "");

  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      repositories: {
        include: { _count: { select: { documents: true } } },
        orderBy: { updatedAt: "desc" },
      },
      documents: {
        take: 10,
        orderBy: { readerCount: "desc" },
        include: { repository: { select: { slug: true, name: true, owner: { select: { username: true } } } } },
      },
      _count: { select: { docLikes: true, ratings: true } },
    },
  });

  if (!user) notFound();

  const totalReaders = user.documents.reduce((s, d) => s + d.readerCount, 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto max-w-4xl px-6 h-14 flex items-center">
          <Link href="/" className="font-semibold text-sm tracking-tight">
            EVERYA
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="flex items-start gap-6">
          <Avatar src={user.image} name={user.name || user.username} size="lg" />
          <div>
            <h1 className="text-2xl font-semibold">{formatUsername(user.username)}</h1>
            {user.name && <p className="text-muted-foreground">{user.name}</p>}
            {user.bio && <p className="text-sm mt-2 max-w-lg leading-relaxed">{user.bio}</p>}
            <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <FolderGit2 className="h-3.5 w-3.5" /> {user.repositories.length} repos
              </span>
              <span className="flex items-center gap-1">
                <FileText className="h-3.5 w-3.5" /> {user.documents.length}+ docs
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5" /> {user._count.ratings} ratings given
              </span>
              <span>{formatCount(totalReaders)} total readers</span>
            </div>
          </div>
        </div>

        <section className="mt-12">
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">
            Repositories
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {user.repositories.map((repo) => (
              <Link
                key={repo.id}
                href={`/r/${user.username}/${repo.slug}`}
                className="rounded-lg border border-border p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{repo.name}</span>
                  <Badge variant="outline">{repo.visibility}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{repo._count.documents} documents</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">
            Published docs
          </h2>
          <div className="divide-y divide-border rounded-lg border border-border">
            {user.documents.map((doc) => (
              <Link
                key={doc.id}
                href={`/r/${doc.repository.owner.username}/${doc.repository.slug}/${doc.slug}`}
                className="flex items-center justify-between px-4 py-3 text-sm hover:bg-muted/50 transition-colors"
              >
                <span>{doc.title}</span>
                <span className="text-muted-foreground">{formatCount(doc.readerCount)} readers</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
