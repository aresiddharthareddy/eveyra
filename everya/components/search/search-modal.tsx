"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, FileText, FolderGit2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUIStore } from "@/hooks/use-ui-store";
import { cn } from "@/lib/utils";
import type { SearchResult } from "@/types";

export function SearchModal() {
  const { searchOpen, setSearchOpen } = useUIStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.results || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => search(query), 200);
    return () => clearTimeout(t);
  }, [query, search]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(!searchOpen);
      }
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [searchOpen, setSearchOpen]);

  if (!searchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSearchOpen(false)} />
      <div className="relative w-full max-w-lg mx-4 rounded-xl border border-border bg-card shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search docs, repositories..."
            className="flex-1 h-12 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <kbd className="hidden sm:inline text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5">
            ESC
          </kbd>
        </div>
        <div className="max-h-80 overflow-y-auto py-2">
          {loading && (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          )}
          {!loading && query.length >= 2 && results.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">No results found</p>
          )}
          {results.map((r) => (
            <button
              key={`${r.type}-${r.id}`}
              type="button"
              onClick={() => {
                router.push(r.href);
                setSearchOpen(false);
                setQuery("");
              }}
              className={cn(
                "w-full flex items-start gap-3 px-4 py-2.5 text-left",
                "hover:bg-muted transition-colors"
              )}
            >
              {r.type === "document" ? (
                <FileText className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
              ) : (
                <FolderGit2 className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
              )}
              <div>
                <p className="text-sm font-medium">{r.title}</p>
                {r.subtitle && <p className="text-xs text-muted-foreground">{r.subtitle}</p>}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
