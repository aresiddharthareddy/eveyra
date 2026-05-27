"use client";

import dynamic from "next/dynamic";
import { useCallback } from "react";
import { cn } from "@/lib/utils";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  onSave?: (value: string) => void;
  className?: string;
}

export function MarkdownEditor({ value, onChange, onSave, className }: MarkdownEditorProps) {
  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (!file?.type.startsWith("image/")) return;

      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      if (!res.ok) return;
      const { url } = await res.json();
      onChange(`${value}\n\n![${file.name}](${url})\n`);
    },
    [value, onChange]
  );

  return (
    <div
      className={cn("rounded-lg border border-border overflow-hidden", className)}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      data-color-mode=""
    >
      <MDEditor
        value={value}
        onChange={(v) => onChange(v || "")}
        height={480}
        preview="live"
        visibleDragbar={false}
        extraCommands={[]}
      />
      {onSave && (
        <div className="border-t border-border px-3 py-2 flex justify-end bg-muted/30">
          <button
            type="button"
            onClick={() => onSave(value)}
            className="text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            Save now
          </button>
        </div>
      )}
    </div>
  );
}
