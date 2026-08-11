"use client";

import { useState } from "react";
import { Plus, Link2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { shortenUrl } from "@/lib/axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type UrlMappingDTO = {
  id: number;
  originalUrl: string;
  shortUrl: string;
  clickCount: number;
  createdDate: string;
  username: string;
};

type CreateUrlDialogProps = {
  onSuccess?: (url: UrlMappingDTO) => void;
  trigger?: React.ReactNode;
};

export function CreateUrlDialog({ onSuccess, trigger }: CreateUrlDialogProps) {
  const [open, setOpen] = useState(false);
  const [originalUrl, setOriginalUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!originalUrl.trim()) {
      setError("Please enter a URL.");
      return;
    }

    setLoading(true);

    shortenUrl(originalUrl.trim())
      .then((urlDto) => {
        onSuccess?.(urlDto);
        setOriginalUrl("");
        setOpen(false);
      })
      .catch((err) => {
        setError(err?.message || err || "Failed to shorten URL.");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="sm">
            <Plus className="size-4" />
            Create Link
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
              <Link2 className="size-4 text-primary" />
            </div>
            <DialogTitle>Shorten a URL</DialogTitle>
          </div>
          <DialogDescription>
            Paste your long URL below and we&apos;ll generate a short link for
            you instantly.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="original-url">Destination URL</Label>
            <div className="relative">
              <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="original-url"
                placeholder="https://example.com/very/long/url"
                className="pl-9"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                disabled={loading}
                autoFocus
              />
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Shortening…" : "Create Link"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
