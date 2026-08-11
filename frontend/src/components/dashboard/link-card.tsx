import { useState } from "react";
import Link from "next/link";
import {
  ExternalLink,
  MousePointerClick,
  Calendar,
  Copy,
  Check,
  Trash,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { UrlMappingDTO } from "./create-url-dialog";

type LinkCardProps = {
  link: UrlMappingDTO;
  onDelete?: (id: number) => void;
};

import { SHORT_BASE_URL } from "@/lib/config";

export function LinkCard({ link, onDelete }: LinkCardProps) {
  const shortBase = SHORT_BASE_URL;
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(`${shortBase}/${link.shortUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this link?")) return;
    setDeleting(true);
    try {
      const { deleteUrl } = await import("@/lib/axios");
      await deleteUrl(link.id);
      onDelete?.(link.id);
    } catch (err) {
      console.error(err);
      alert("Failed to delete link.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Link
      href={`/all-links/${link.id}`}
      className="group flex flex-col gap-4 rounded-xl border bg-card p-5 text-card-foreground shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
    >
      {/* Top row: short url + actions + click badge */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <ExternalLink className="size-4 shrink-0 text-primary" />
          <span className="text-base font-semibold text-primary truncate">
            {shortBase}/{link.shortUrl}
          </span>
          <div className="flex items-center gap-0.5 shrink-0">
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={handleCopy}
              className="size-7 opacity-80 hover:opacity-100 hover:bg-muted"
              aria-label="Copy short URL"
            >
              {copied ? (
                <Check className="size-3.5 text-green-500" />
              ) : (
                <Copy className="size-3.5" />
              )}
            </Button>
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={handleDelete}
              disabled={deleting}
              className="size-7 text-destructive/80 hover:text-destructive hover:bg-destructive/10"
              aria-label="Delete short URL"
            >
              <Trash className="size-3.5" />
            </Button>
          </div>
        </div>
        <Badge
          variant="secondary"
          className="shrink-0 text-xs px-2.5 py-1 gap-1"
        >
          <MousePointerClick className="size-3.5" />
          {link.clickCount}
        </Badge>
      </div>

      {/* Original URL */}
      <p className="text-sm text-muted-foreground truncate leading-relaxed">
        {link.originalUrl}
      </p>

      {/* Footer: date */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
        <Calendar className="size-3.5 shrink-0" />
        <span>
          {formatDistanceToNow(new Date(link.createdDate), { addSuffix: true })}
        </span>
      </div>
    </Link>
  );
}
export function LinkCardSkeleton() {
  return <h1>h1</h1>;
}
// Change for push
