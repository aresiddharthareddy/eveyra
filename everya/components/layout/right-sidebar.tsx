"use client";

import { useUIStore } from "@/hooks/use-ui-store";
import { TableOfContents } from "@/components/docs/table-of-contents";
import { DocStatsHeader } from "@/components/docs/doc-stats-header";
import { cn } from "@/lib/utils";
import type { DocStats } from "@/types";

export function RightSidebar({
  content,
  stats,
  relatedDocs,
}: {
  content?: string;
  stats?: DocStats;
  relatedDocs?: { title: string; href: string }[];
}) {
  const { rightSidebarOpen } = useUIStore();

  if (!rightSidebarOpen) return null;

  return (
    <aside className="hidden xl:block w-64 shrink-0 border-l border-border overflow-y-auto p-5 space-y-8">
      {stats && (
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">
            Document stats
          </p>
          <DocStatsHeader stats={stats} />
        </div>
      )}
      {content && <TableOfContents content={content} />}
      {relatedDocs && relatedDocs.length > 0 && (
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">
            Related
          </p>
          <ul className="space-y-2">
            {relatedDocs.map((doc) => (
              <li key={doc.href}>
                <a href={doc.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors line-clamp-2">
                  {doc.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
