import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getRepositoryTree } from "@/services/repositories";
import { getDocumentStats, recordDocumentView } from "@/services/documents";
import { getServerSession } from "@/lib/session";
import { MarkdownRenderer } from "@/components/docs/markdown-renderer";
import { DocStatsHeader } from "@/components/docs/doc-stats-header";
import { DocActions } from "@/components/docs/doc-actions";
import { CommentSection } from "@/components/comments/comment-section";
import { RepoTree } from "@/components/repos/repo-tree";
import { Breadcrumbs } from "@/components/repos/breadcrumbs";
import { RightSidebar } from "@/components/layout/right-sidebar";
import { Button } from "@/components/ui/button";
import { formatUsername } from "@/lib/utils";

export default async function DocumentPage({
  params,
}: {
  params: Promise<{ username: string; repo: string; doc: string }>;
}) {
  const { username, repo: repoSlug, doc: docSlug } = await params;

  const document = await prisma.document.findFirst({
    where: {
      slug: docSlug,
      repository: {
        slug: repoSlug,
        owner: { username: username.replace(/^@/, "") },
      },
    },
    include: {
      author: { select: { id: true, username: true, name: true, image: true } },
      repository: {
        select: { id: true, name: true, slug: true, owner: { select: { username: true } } },
      },
    },
  });

  if (!document) notFound();

  const session = await getServerSession();
  const isAuthor = session?.user.id === document.authorId;

  await recordDocumentView(document.id, session?.user.id);

  const [stats, tree, comments, userLike, userBookmark, userRating, relatedDocs] =
    await Promise.all([
      getDocumentStats(document.id),
      getRepositoryTree(document.repositoryId),
      prisma.comment.findMany({
        where: { documentId: document.id, parentId: null },
        include: {
          author: { select: { id: true, username: true, name: true, image: true } },
          replies: {
            include: { author: { select: { id: true, username: true, name: true, image: true } } },
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      session
        ? prisma.documentLike.findUnique({
            where: { documentId_userId: { documentId: document.id, userId: session.user.id } },
          })
        : null,
      session
        ? prisma.bookmark.findUnique({
            where: { documentId_userId: { documentId: document.id, userId: session.user.id } },
          })
        : null,
      session
        ? prisma.rating.findUnique({
            where: { documentId_userId: { documentId: document.id, userId: session.user.id } },
          })
        : null,
      prisma.document.findMany({
        where: { repositoryId: document.repositoryId, NOT: { id: document.id } },
        take: 4,
        select: { title: true, slug: true },
      }),
    ]);

  const basePath = `/r/${document.repository.owner.username}/${document.repository.slug}`;
  const serializedComments = comments.map((c) => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
    replies: c.replies.map((r) => ({ ...r, createdAt: r.createdAt.toISOString(), replies: [] })),
  }));

  return (
    <div className="flex h-full">
      <div className="w-56 shrink-0 border-r border-border overflow-y-auto hidden lg:block">
        <RepoTree tree={tree} basePath={basePath} activeSlug={docSlug} />
      </div>

      <div className="flex flex-1 overflow-hidden">
        <article className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-6 py-8">
            <Breadcrumbs
              items={[
                { label: formatUsername(document.repository.owner.username), href: `/u/${document.repository.owner.username}` },
                { label: document.repository.name, href: basePath },
                { label: document.title },
              ]}
            />

            <header className="mt-6 mb-8">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-3xl font-semibold tracking-tight leading-tight">
                  {document.title}
                </h1>
                <div className="hidden sm:block shrink-0">
                  <DocStatsHeader stats={stats} />
                </div>
              </div>
              <div className="sm:hidden mb-4">
                <DocStatsHeader stats={stats} />
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <Link href={`/u/${document.author.username}`} className="hover:text-foreground font-medium">
                  {formatUsername(document.author.username)}
                </Link>
                <span>·</span>
                <span>Updated {formatDistanceToNow(document.updatedAt, { addSuffix: true })}</span>
              </div>
              {session && (
                <div className="mt-4 flex items-center gap-3">
                  <DocActions
                    documentId={document.id}
                    initialLiked={!!userLike}
                    initialBookmarked={!!userBookmark}
                    initialRating={userRating?.value}
                  />
                  {isAuthor && (
                    <Link href={`${basePath}/${docSlug}/edit`}>
                      <Button variant="outline" size="sm">
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </header>

            <MarkdownRenderer content={document.content} />

            <CommentSection
              documentId={document.id}
              initialComments={serializedComments}
              currentUserId={session?.user.id}
            />
          </div>
        </article>

        <RightSidebar
          content={document.content}
          stats={stats}
          relatedDocs={relatedDocs.map((d) => ({
            title: d.title,
            href: `${basePath}/${d.slug}`,
          }))}
        />
      </div>
    </div>
  );
}
