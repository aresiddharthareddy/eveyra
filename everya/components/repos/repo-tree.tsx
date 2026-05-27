"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight, FileText, Folder } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TreeNode } from "@/types";

function TreeItem({
  node,
  basePath,
  activeSlug,
  depth = 0,
}: {
  node: TreeNode;
  basePath: string;
  activeSlug?: string;
  depth?: number;
}) {
  const [open, setOpen] = useState(true);
  const isFolder = node.type === "folder";
  const href = isFolder ? undefined : `${basePath}/${node.slug}`;
  const isActive = !isFolder && node.slug === activeSlug;

  if (isFolder) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={cn(
            "flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors",
          )}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
        >
          <ChevronRight className={cn("h-3 w-3 shrink-0 transition-transform", open && "rotate-90")} />
          <Folder className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{node.name}</span>
        </button>
        {open && node.children?.map((child) => (
          <TreeItem key={child.id} node={child} basePath={basePath} activeSlug={activeSlug} depth={depth + 1} />
        ))}
      </div>
    );
  }

  return (
    <Link
      href={href!}
      className={cn(
        "flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm transition-colors",
        isActive ? "bg-muted text-foreground font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
      style={{ paddingLeft: `${depth * 12 + 24}px` }}
    >
      <FileText className="h-3.5 w-3.5 shrink-0" />
      <span className="truncate">{node.name}</span>
    </Link>
  );
}

export function RepoTree({
  tree,
  basePath,
  activeSlug,
}: {
  tree: TreeNode[];
  basePath: string;
  activeSlug?: string;
}) {
  return (
    <div className="space-y-0.5 py-2">
      {tree.map((node) => (
        <TreeItem key={node.id} node={node} basePath={basePath} activeSlug={activeSlug} />
      ))}
    </div>
  );
}
