"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import { cn } from "@/lib/utils";

export function MarkdownRenderer({ content, className }: { content: string; className?: string }) {
  return (
    <article
      className={cn(
        "prose prose-neutral dark:prose-invert max-w-none",
        "prose-headings:font-semibold prose-headings:tracking-tight",
        "prose-p:leading-relaxed prose-pre:bg-muted prose-pre:border prose-pre:border-border",
        "prose-code:before:content-none prose-code:after:content-none",
        "prose-a:text-foreground prose-a:underline-offset-4 hover:prose-a:underline",
        "prose-table:text-sm prose-th:font-medium",
        className
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight, rehypeSlug]}>
        {content}
      </ReactMarkdown>
    </article>
  );
}
