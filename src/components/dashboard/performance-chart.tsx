"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { format, eachDayOfInterval } from "date-fns";

interface PerformanceData {
  dailyMetricTimeSeries: {
    dailyMetric: string;
    timeSeries: {
      datedValues: {
        value?: string;
        date: { year: number; month: number; day: number };
      }[];
    };
  }[];
}

interface PerformanceChartProps {
  data: PerformanceData[];
  dateRange: { from: Date; to: Date };
}

const METRIC_CONFIG = {
  VIEWS: [
    "BUSINESS_IMPRESSIONS_DESKTOP_MAPS",
    "BUSINESS_IMPRESSIONS_MOBILE_MAPS",
    "BUSINESS_IMPRESSIONS_DESKTOP_SEARCH",
    "BUSINESS_IMPRESSIONS_MOBILE_SEARCH",
  ],
  WEBSITE: ["WEBSITE_CLICKS"],
  CALLS: ["CALL_CLICKS"],
  DIRECTIONS: ["BUSINESS_DIRECTION_REQUESTS"],
};

const CHART_COLORS = {
  views: "hsl(var(--chart-1))",
  website: "hsl(var(--chart-2))",
  calls: "hsl(var(--chart-3))",
  directions: "hsl(var(--chart-4))",
};

export default function PerformanceChart({
  data,
  dateRange,
}: PerformanceChartProps) {
  const chartData = useMemo(() => {
    if (!data) return [];

    const allDatedValues = new Map<string, any>();

    const interval = eachDayOfInterval({
      start: dateRange.from,
      end: dateRange.to,
    });
    interval.forEach((date) => {
      const dateString = format(date, "yyyy-MM-dd");
      allDatedValues.set(dateString, {
        date: format(date, "MMM d"),
        fullDate: dateString,
        views: 0,
        website: 0,
        calls: 0,
        directions: 0,
      });
    });

    data.forEach((tsSet) => {
      tsSet.dailyMetricTimeSeries.forEach((series) => {
        const metricName = series.dailyMetric;
        series.timeSeries.datedValues.forEach((dv) => {
          if (dv.date) {
            const dateString = `${dv.date.year}-${String(dv.date.month).padStart(2, "0")}-${String(dv.date.day).padStart(2, "0")}`;
            const value = parseInt(dv.value || "0", 10);

            if (allDatedValues.has(dateString)) {
              const entry = allDatedValues.get(dateString);
              if (METRIC_CONFIG.VIEWS.includes(metricName)) {
                entry.views += value;
              } else if (METRIC_CONFIG.WEBSITE.includes(metricName)) {
                entry.website += value;
              } else if (METRIC_CONFIG.CALLS.includes(metricName)) {
                entry.calls += value;
              } else if (METRIC_CONFIG.DIRECTIONS.includes(metricName)) {
                entry.directions += value;
              }
            }
          }
        });
      });
    });

    return Array.from(allDatedValues.values()).sort(
      (a, b) =>
        new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime()
    );
  }, [data, dateRange]);

  const chartConfig = {
    views: { label: "Total Views", color: CHART_COLORS.views },
    website: { label: "Website Clicks", color: CHART_COLORS.website },
    calls: { label: "Phone Calls", color: CHART_COLORS.calls },
    directions: { label: "Direction Requests", color: CHART_COLORS.directions },
  };

  const tickInterval = Math.max(1, Math.floor(chartData.length / 7) - 1);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-medium text-muted-foreground">Daily Trends</p>
      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-[320px] w-full"
      >
        <AreaChart
          data={chartData}
          margin={{ top: 12, right: 12, left: 0, bottom: 4 }}
        >
          <defs>
            <linearGradient id="fillViews" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor={CHART_COLORS.views}
                stopOpacity={0.35}
              />
              <stop
                offset="100%"
                stopColor={CHART_COLORS.views}
                stopOpacity={0.02}
              />
            </linearGradient>
            <linearGradient id="fillWebsite" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor={CHART_COLORS.website}
                stopOpacity={0.25}
              />
              <stop
                offset="100%"
                stopColor={CHART_COLORS.website}
                stopOpacity={0.02}
              />
            </linearGradient>
            <linearGradient id="fillCalls" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor={CHART_COLORS.calls}
                stopOpacity={0.2}
              />
              <stop
                offset="100%"
                stopColor={CHART_COLORS.calls}
                stopOpacity={0.02}
              />
            </linearGradient>
            <linearGradient id="fillDirections" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor={CHART_COLORS.directions}
                stopOpacity={0.2}
              />
              <stop
                offset="100%"
                stopColor={CHART_COLORS.directions}
                stopOpacity={0.02}
              />
            </linearGradient>
          </defs>
          <CartesianGrid
            vertical={false}
            strokeDasharray="4 6"
            stroke="hsl(var(--border))"
            strokeOpacity={0.7}
          />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={12}
            minTickGap={28}
            interval={tickInterval}
            tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            width={36}
            allowDecimals={false}
            tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
          />
          <Tooltip
            cursor={{
              stroke: "hsl(var(--muted-foreground))",
              strokeWidth: 1,
              strokeDasharray: "4 4",
              strokeOpacity: 0.5,
            }}
            content={<ChartTooltipContent indicator="line" />}
          />
          <ChartLegend content={<ChartLegendContent />} />
          <Area
            dataKey="views"
            type="monotone"
            fill="url(#fillViews)"
            stroke={CHART_COLORS.views}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            activeDot={{ r: 5, strokeWidth: 2, stroke: "hsl(var(--background))" }}
            isAnimationActive
            animationDuration={700}
          />
          <Area
            dataKey="website"
            type="monotone"
            fill="url(#fillWebsite)"
            stroke={CHART_COLORS.website}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            activeDot={{ r: 4, strokeWidth: 2, stroke: "hsl(var(--background))" }}
            isAnimationActive
            animationDuration={700}
          />
          <Area
            dataKey="calls"
            type="monotone"
            fill="url(#fillCalls)"
            stroke={CHART_COLORS.calls}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            activeDot={{ r: 4, strokeWidth: 2, stroke: "hsl(var(--background))" }}
            isAnimationActive
            animationDuration={700}
          />
          <Area
            dataKey="directions"
            type="monotone"
            fill="url(#fillDirections)"
            stroke={CHART_COLORS.directions}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            activeDot={{ r: 4, strokeWidth: 2, stroke: "hsl(var(--background))" }}
            isAnimationActive
            animationDuration={700}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
