"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Eye, PenLine } from "lucide-react";
import { cn } from "@/lib/utils";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Write in Markdown...",
  rows = 8,
  className,
}: MarkdownEditorProps) {
  const [isPreview, setIsPreview] = useState(false);

  return (
    <div className={cn("space-y-2", className)}>
      {/* Write / Preview toggle */}
      <div className="flex items-center gap-1 rounded-md border border-input bg-muted/30 p-1 w-fit">
        <Button
          type="button"
          variant={!isPreview ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setIsPreview(false)}
          className="h-7 px-3 font-body text-xs gap-1.5"
        >
          <PenLine className="w-3 h-3" />
          Write
        </Button>
        <Button
          type="button"
          variant={isPreview ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setIsPreview(true)}
          className="h-7 px-3 font-body text-xs gap-1.5"
        >
          <Eye className="w-3 h-3" />
          Preview
        </Button>
      </div>

      {isPreview ? (
        <div
          className={cn(
            "rounded-md border border-input bg-muted/10 px-4 py-3",
            "prose prose-sm dark:prose-invert max-w-none font-body",
          )}
          style={{ minHeight: `${rows * 1.625}rem` }}
        >
          {value ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
          ) : (
            <p className="text-muted-foreground text-sm italic">
              Nothing to preview.
            </p>
          )}
        </div>
      ) : (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="font-mono text-sm resize-none"
        />
      )}

      <p className="text-xs text-muted-foreground font-body">
        Supports Markdown: <span className="font-mono">**bold**</span>,{" "}
        <span className="font-mono">*italic*</span>,{" "}
        <span className="font-mono"># heading</span>,{" "}
        <span className="font-mono">- list</span>,{" "}
        <span className="font-mono">[link](url)</span>
      </p>
    </div>
  );
}
