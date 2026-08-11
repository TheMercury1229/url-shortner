"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  MousePointerClick,
  Calendar,
  Copy,
  Check,
} from "lucide-react";
import { format } from "date-fns";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { UrlMappingDTO } from "@/components/dashboard/create-url-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";




const chartConfig: ChartConfig = {
  clicks: {
    label: "Clicks",
    color: "var(--color-primary)",
  },
};

import { useEffect } from "react";
import { getMyUrls, getUrlAnalytics } from "@/lib/axios";
import { toLocalISOString } from "@/lib/utils";
import { SHORT_BASE_URL } from "@/lib/config";
import { DashboardLoader } from "@/components/dashboard/dashboard-loader";

const shortBase = SHORT_BASE_URL;

export default function LinkDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [copied, setCopied] = useState(false);
  const [link, setLink] = useState<UrlMappingDTO | null>(null);
  const [chartData, setChartData] = useState<{ date: string; clicks: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDays, setFilterDays] = useState<string>("30");

  useEffect(() => {
    async function loadLinkData() {
      try {
        setLoading(true);
        const urlList = await getMyUrls();
        const found = urlList.find((u) => String(u.id) === id);
        if (found) {
          setLink(found);

          // Get analytics dates based on filterDays
          const daysNum = parseInt(filterDays, 10);
          const endDateObj = new Date();
          const endDateStr = toLocalISOString(endDateObj);
          const startDateObj = new Date();
          startDateObj.setDate(startDateObj.getDate() - daysNum);
          const startDateStr = toLocalISOString(startDateObj);

          const clickEvents = await getUrlAnalytics(found.shortUrl, startDateStr, endDateStr);
          
          // Map backend pre-grouped click counts directly
          const formattedChart = clickEvents
            .sort((a, b) => a.clickDate.localeCompare(b.clickDate))
            .map((ev) => {
              const d = new Date(ev.clickDate);
              const formattedDate = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
              return { date: formattedDate, clicks: Number(ev.count || 0) };
            });

          setChartData(formattedChart);
        }
      } catch (err) {
        console.error("Failed to load link analytics:", err);
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      loadLinkData();
    }
  }, [id, filterDays]);

  function copyShortUrl() {
    if (!link) return;
    navigator.clipboard.writeText(`${shortBase}/${link.shortUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return <DashboardLoader message="Loading link analytics..." />;
  }

  if (!link) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center min-h-[400px]">
        <p className="font-medium text-muted-foreground">Link not found or unauthorized</p>
        <Button variant="outline" asChild>
          <Link href="/all-links">
            <ArrowLeft className="size-4" />
            Back to All Links
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      {/* Back + title */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" asChild>
          <Link href="/all-links">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Link Analytics
          </h1>
          <p className="text-sm text-muted-foreground">
            Last 30 days performance
          </p>
        </div>
      </div>

      {/* Link info card */}
      <div className="rounded-xl border bg-card p-5 text-card-foreground shadow-sm flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-primary">
                {shortBase}/{link.shortUrl}
              </span>
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={copyShortUrl}
                className="size-6"
              >
                {copied ? (
                  <Check className="size-3.5 text-green-500" />
                ) : (
                  <Copy className="size-3.5" />
                )}
              </Button>
            </div>
            <a
              href={link.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors truncate max-w-md"
            >
              <ExternalLink className="size-3.5 shrink-0" />
              {link.originalUrl}
            </a>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Badge variant="secondary" className="gap-1 px-3 py-1.5 text-sm">
              <MousePointerClick className="size-3.5" />
              {link.clickCount.toLocaleString()} clicks
            </Badge>
            <Badge variant="outline" className="gap-1 px-3 py-1.5 text-sm">
              <Calendar className="size-3.5" />
              {format(new Date(link.createdDate), "MMM d, yyyy")}
            </Badge>
          </div>
        </div>
      </div>

      {/* Analytics chart */}
      <div className="rounded-xl border bg-card p-5 text-card-foreground shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Click Activity</p>
            <p className="text-xs text-muted-foreground">
              Clicks per day over the selected period
            </p>
          </div>
          <Select value={filterDays} onValueChange={setFilterDays}>
            <SelectTrigger size="sm" className="w-[140px]">
              <SelectValue placeholder="Select Range" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {chartData.length === 0 ? (
          <div className="flex h-[280px] w-full items-center justify-center text-sm text-muted-foreground border border-dashed rounded-lg">
            No click events recorded for this link in the last 30 days.
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[280px] w-full">
            <BarChart data={chartData} margin={{ left: -16, right: 8 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 11 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 11 }}
                allowDecimals={false}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="clicks"
                fill="var(--color-primary)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        )}
      </div>
    </div>
  );
}
