"use client";

import { useState } from "react";
import { Home, MousePointerClick, Link2, TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { CreateUrlDialog, type UrlMappingDTO } from "@/components/dashboard/create-url-dialog";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_URLS: UrlMappingDTO[] = [
  { id: 1, originalUrl: "https://github.com/features/actions", shortUrl: "gh-act", clickCount: 142, createdDate: "2026-06-01T10:00:00", username: "demo_user" },
  { id: 2, originalUrl: "https://nextjs.org/docs/app/building-your-application/routing", shortUrl: "nxt-rt", clickCount: 87, createdDate: "2026-06-10T14:30:00", username: "demo_user" },
  { id: 3, originalUrl: "https://tailwindcss.com/docs/installation", shortUrl: "tw-ins", clickCount: 56, createdDate: "2026-06-18T09:15:00", username: "demo_user" },
  { id: 4, originalUrl: "https://ui.shadcn.com/docs/components/sidebar", shortUrl: "sh-sid", clickCount: 34, createdDate: "2026-06-22T16:45:00", username: "demo_user" },
  { id: 5, originalUrl: "https://vercel.com/docs/deployments/overview", shortUrl: "vrc-dp", clickCount: 21, createdDate: "2026-06-28T11:00:00", username: "demo_user" },
];

const MOCK_CHART_DATA = [
  { date: "Jun 3",  clicks: 12 },
  { date: "Jun 5",  clicks: 19 },
  { date: "Jun 7",  clicks: 8  },
  { date: "Jun 9",  clicks: 27 },
  { date: "Jun 11", clicks: 15 },
  { date: "Jun 13", clicks: 33 },
  { date: "Jun 15", clicks: 21 },
  { date: "Jun 17", clicks: 45 },
  { date: "Jun 19", clicks: 38 },
  { date: "Jun 21", clicks: 52 },
  { date: "Jun 23", clicks: 41 },
  { date: "Jun 25", clicks: 29 },
  { date: "Jun 27", clicks: 63 },
  { date: "Jun 29", clicks: 57 },
  { date: "Jul 1",  clicks: 74 },
];

// ─── Chart config ─────────────────────────────────────────────────────────────

const chartConfig: ChartConfig = {
  clicks: {
    label: "Clicks",
    color: "var(--color-primary)",
  },
};

import { useEffect } from "react";
import { getMyUrls, getTotalClicksByDate } from "@/lib/axios";
import { StatCard } from "@/components/dashboard/stat-card";
import { DashboardLoader } from "@/components/dashboard/dashboard-loader";

export default function HomePage() {
  const [urls, setUrls] = useState<UrlMappingDTO[]>([]);
  const [chartData, setChartData] = useState<{ date: string; clicks: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const urlList = await getMyUrls();
        setUrls(urlList);

        // Fetch last 30 days of clicks
        const endDateStr = new Date().toISOString().split("T")[0];
        const startDateObj = new Date();
        startDateObj.setDate(startDateObj.getDate() - 30);
        const startDateStr = startDateObj.toISOString().split("T")[0];

        const clicksMap = await getTotalClicksByDate(startDateStr, endDateStr);
        
        // Sort keys and format them
        const formattedChart = Object.entries(clicksMap)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([dateStr, clicks]) => {
            const date = new Date(dateStr);
            const formattedDate = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
            return { date: formattedDate, clicks: Number(clicks) };
          });
        setChartData(formattedChart);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  function handleUrlCreated(url: UrlMappingDTO) {
    setUrls((prev) => [url, ...prev]);
  }

  const totalClicks = urls.reduce((sum, u) => sum + u.clickCount, 0);
  const maxClicks = urls.length > 0 ? Math.max(...urls.map((u) => u.clickCount)) : 0;

  if (loading) {
    return <DashboardLoader message="Loading link dashboard..." />;
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Home className="size-5 text-primary" />
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Home</h1>
            <p className="text-sm text-muted-foreground">
              Your link activity at a glance
            </p>
          </div>
        </div>
        <CreateUrlDialog onSuccess={handleUrlCreated} />
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Total Links"
          value={urls.length}
          icon={Link2}
          description="Shortened URLs created"
        />
        <StatCard
          label="Total Clicks"
          value={totalClicks.toLocaleString()}
          icon={MousePointerClick}
          description="All-time across all links"
        />
        <StatCard
          label="Top Performer"
          value={`${maxClicks} clicks`}
          icon={TrendingUp}
          description="Best performing link this month"
        />
      </div>

      {/* Clicks over time chart */}
      <div className="rounded-xl border bg-card p-5 text-card-foreground shadow-sm flex flex-col gap-4">
        <div>
          <p className="text-sm font-medium">Clicks Over Time</p>
          <p className="text-xs text-muted-foreground">Last 30 days</p>
        </div>
        {chartData.length === 0 ? (
          <div className="flex h-[240px] w-full items-center justify-center text-sm text-muted-foreground border border-dashed rounded-lg">
            No click activity in the last 30 days.
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[240px] w-full">
            <AreaChart data={chartData} margin={{ left: -16, right: 8 }}>
              <defs>
                <linearGradient id="clicksGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="var(--color-primary)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}   />
                </linearGradient>
              </defs>
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
              <Area
                type="monotone"
                dataKey="clicks"
                stroke="var(--color-primary)"
                strokeWidth={2}
                fill="url(#clicksGradient)"
                dot={false}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </div>
    </div>
  );
}
