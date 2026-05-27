import Link from "next/link";
import { ArrowRight, BookOpen, Lock, Zap, FolderTree, BarChart3 } from "lucide-react";
import { LandingHero } from "@/components/landing/hero";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatUsername, formatCount } from "@/lib/utils";

export default async function LandingPage() {
  const [repos, docs] = await Promise.all([
    prisma.repository.findMany({
      where: { visibility: "PUBLIC" },
      take: 3,
      include: { owner: { select: { username: true } }, _count: { select: { documents: true } } },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.document.findMany({
      where: { repository: { visibility: "PUBLIC" } },
      take: 4,
      include: { repository: { select: { name: true, slug: true, owner: { select: { username: true } } } }, author: { select: { username: true } } },
      orderBy: { readerCount: "desc" },
    }),
  ]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <span className="font-semibold tracking-tight">EVERYA</span>
          <nav className="flex items-center gap-4">
            <Link href="/explore" className="text-sm text-muted-foreground hover:text-foreground">
              Explore
            </Link>
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground">
              Sign in
            </Link>
            <Link href="/signup" className="inline-flex h-9 items-center justify-center rounded-md bg-foreground px-4 text-sm font-medium text-background hover:opacity-90">
              Get started
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <LandingHero />

        <section className="border-y border-border bg-muted/30 py-16">
          <div className="mx-auto max-w-6xl px-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Zap, title: "Extremely fast", desc: "Optimized rendering and instant navigation" },
              { icon: FolderTree, title: "Nested structure", desc: "Repositories, folders, and deep hierarchies" },
              { icon: BarChart3, title: "Measurable", desc: "Readers, ratings, and reading time analytics" },
              { icon: Lock, title: "Enterprise-ready", desc: "Public, private, and enterprise repositories" },
            ].map((f) => (
              <div key={f.title} className="space-y-2">
                <f.icon className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-medium">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-2xl font-semibold mb-8">Featured repositories</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {repos.map((repo) => (
              <Card key={repo.id}>
                <CardHeader>
                  <CardTitle className="text-base">{repo.name}</CardTitle>
                  <CardDescription>{formatUsername(repo.owner.username)}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{repo.description}</p>
                  <Link
                    href={`/r/${repo.owner.username}/${repo.slug}`}
                    className="text-sm font-medium inline-flex items-center gap-1 hover:underline"
                  >
                    {repo._count.documents} docs <ArrowRight className="h-3 w-3" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-24">
          <h2 className="text-2xl font-semibold mb-8">Popular documentation</h2>
          <div className="divide-y divide-border rounded-lg border border-border">
            {docs.map((doc) => (
              <Link
                key={doc.id}
                href={`/r/${doc.repository.owner.username}/${doc.repository.slug}/${doc.slug}`}
                className="flex items-center justify-between px-5 py-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <BookOpen className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium truncate">{doc.title}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {doc.repository.name} · {formatUsername(doc.author.username)}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground shrink-0 ml-4">
                  {formatCount(doc.readerCount)} readers
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} EVERYA. Built for technical teams.
      </footer>
    </div>
  );
}
