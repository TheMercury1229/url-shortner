"use client";

import { useState } from "react";
import { Link2, SearchX } from "lucide-react";

import { CreateUrlDialog, type UrlMappingDTO } from "@/components/dashboard/create-url-dialog";
import { LinkCard } from "@/components/dashboard/link-card";



import { useEffect } from "react";
import { getMyUrls } from "@/lib/axios";
import { DashboardLoader } from "@/components/dashboard/dashboard-loader";

export default function AllLinksPage() {
  const [urls, setUrls] = useState<UrlMappingDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUrls() {
      try {
        const urlList = await getMyUrls();
        setUrls(urlList);
      } catch (err) {
        console.error("Failed to load links:", err);
      } finally {
        setLoading(false);
      }
    }
    loadUrls();
  }, []);

  function handleUrlCreated(url: UrlMappingDTO) {
    setUrls((prev) => [url, ...prev]);
  }

  function handleUrlDeleted(id: number) {
    setUrls((prev) => prev.filter((u) => u.id !== id));
  }

  if (loading) {
    return <DashboardLoader message="Loading your links..." />;
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link2 className="size-5 text-primary" />
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">All Links</h1>
            <p className="text-sm text-muted-foreground">
              {urls.length} link{urls.length !== 1 ? "s" : ""} created
            </p>
          </div>
        </div>
        <CreateUrlDialog onSuccess={handleUrlCreated} />
      </div>

      {/* Grid */}
      {urls.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-xl border bg-card p-12 text-center shadow-sm">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <SearchX className="size-6 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium">No links yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Create your first short link to get started.
            </p>
          </div>
          <CreateUrlDialog onSuccess={handleUrlCreated} />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {urls.map((link) => (
            <LinkCard key={link.id} link={link} onDelete={handleUrlDeleted} />
          ))}
        </div>
      )}
    </div>
  );
}
