
'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { FileSearch, MessageSquare, Star, Phone, MapPin, Eye } from 'lucide-react';
import { Button } from '../ui/button';
import { useState, useEffect } from 'react';


const generateDailyMockData = (numPoints: number, max: number, min: number) => {
  return Array.from({ length: numPoints }, (_, i) => ({
    label: `Day ${i + 1}`,
    value: Math.floor(Math.random() * (max - min + 1)) + min,
  }));
};

const generateMonthlyMockData = (numPoints: number, max: number, min: number) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentMonth = new Date().getMonth();
  
  return Array.from({ length: numPoints }, (_, i) => {
    const monthIndex = (currentMonth - (numPoints - 1) + i + 12) % 12;
    return {
      label: months[monthIndex],
      value: Math.floor(Math.random() * (max - min + 1)) + min,
    };
  });
};

const getMockDataSets = () => ({
  'Last 7 Days': generateDailyMockData(7, 380, 375),
  'Last 30 Days': generateDailyMockData(30, 500, 490),
  'Last 3 Months': generateDailyMockData(90, 750, 740),
  'Last 6 Months': generateMonthlyMockData(6, 4500, 4400),
  'Last Year': generateMonthlyMockData(12, 12000, 11000),
});

const mockStatsSets = {
  'Last 7 Days': {
    views: { value: 2800, change: '+5.2%' },
    calls: { value: 150, change: '+8.1%' },
    directionRequests: { value: 95, change: '+3.5%' },
    reviews: { rating: 4.9, change: '+3 new reviews' },
  },
  'Last 30 Days': {
    views: { value: 12403, change: '+18.7%' },
    calls: { value: 620, change: '+12.3%' },
    directionRequests: { value: 410, change: '+9.8%' },
    reviews: { rating: 4.8, change: '+12 new reviews' },
  },
  'Last 3 Months': {
    views: { value: 41200, change: '+15.1%' },
    calls: { value: 1980, change: '+14.2%' },
    directionRequests: { value: 1350, change: '+11.1%' },
    reviews: { rating: 4.8, change: '+45 new reviews' },
  },
  'Last 6 Months': {
    views: { value: 85000, change: '+12.5%' },
    calls: { value: 4100, change: '+11.8%' },
    directionRequests: { value: 2800, change: '+10.2%' },
    reviews: { rating: 4.7, change: '+88 new reviews' },
  },
  'Last Year': {
    views: { value: 180000, change: '+10.3%' },
    calls: { value: 8500, change: '+9.5%' },
    directionRequests: { value: 5900, change: '+8.7%' },
    reviews: { rating: 4.7, change: '+150 new reviews' },
  },
};

type StatKey = 'views' | 'calls' | 'directionRequests';
const statConfig: Record<StatKey, { title: string; icon: React.ElementType }> = {
    views: { title: "Views", icon: Eye },
    calls: { title: "Calls", icon: Phone },
    directionRequests: { title: "Direction Requests", icon: MapPin },
};

const generatePath = (data: { label: string; value: number }[]): string => {
  if (!data || data.length === 0) {
    return "M 0,40 L 100,40"; // Flat line if no data
  }
  const maxValue = Math.max(...data.map(p => p.value));
  const minValue = Math.min(...data.map(p => p.value));
  const range = maxValue - minValue === 0 ? 1 : maxValue - minValue;

  const points = data.map((point, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 40 - ((point.value - minValue) / range) * 38; // Scale y within viewbox, with a small margin
    return `${x},${y}`;
  });

  return "M " + points.join(" L ");
};


export default function DashboardPreview() {
  const [isClient, setIsClient] = useState(false);
  const [selectedRange, setSelectedRange] = useState('Last 30 Days');
  const [chartData, setChartData] = useState<{label: string; value: number}[]>([]);
  const [statsData, setStatsData] = useState(mockStatsSets['Last 30 Days']);
  const [activeStat, setActiveStat] = useState<StatKey>('views');
  
  const [hoveredData, setHoveredData] = useState<{
    label: string;
    value: number;
  } | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    setIsClient(true);
    const mockDataSets = getMockDataSets();
    setChartData(mockDataSets['Last 30 Days']);
  }, []);


  const chartPath = generatePath(chartData);
  const areaPath = chartPath + " L 100,40 L 0,40 Z";

  const handleRangeChange = (range: string) => {
    const mockDataSets = getMockDataSets();
    setSelectedRange(range);
    setChartData(mockDataSets[range as keyof typeof mockDataSets]);
    setStatsData(mockStatsSets[range as keyof typeof mockStatsSets]);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const { x } = pt.matrixTransform(svg.getScreenCTM()!.inverse());

    if (chartData.length === 0) return;
    
    const dataIndex = Math.max(0, Math.min(chartData.length - 1, Math.round((x / 100) * (chartData.length - 1))));
    const dataPoint = chartData[dataIndex];
    
    if (dataPoint) {
      setHoveredData(dataPoint);
      const maxValue = Math.max(...chartData.map(p => p.value));
      const minValue = Math.min(...chartData.map(p => p.value));
      const range = maxValue - minValue === 0 ? 1 : maxValue - minValue;
      const chartY = 40 - ((dataPoint.value - minValue) / range) * 38;
      setPosition({ x: (dataIndex / (chartData.length - 1)) * 100, y: chartY });
    }
  };

  const handleMouseLeave = () => {
    setHoveredData(null);
  };
  
  const currentStatData = statsData[activeStat];
  const ActiveIcon = statConfig[activeStat].icon;

  if (!isClient) {
    return (
      <Card className="w-full animate-pulse border-0 bg-background/80 shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Loading preview…</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72 rounded-lg bg-muted" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full overflow-hidden border-0 bg-background/90 shadow-none">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="font-headline text-lg">Your Dashboard</CardTitle>
          <span className="text-xs text-muted-foreground">Interactive demo</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border bg-card p-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{statConfig[activeStat].title}</p>
              <ActiveIcon className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <p className="mt-1 text-2xl font-bold tabular-nums text-brand-blue md:text-3xl">
              {currentStatData.value.toLocaleString()}
            </p>
            <p className="mt-1 text-xs font-medium text-brand-green">
              {currentStatData.change} from last month
            </p>
            <TooltipProvider>
              <div className="mt-3 flex gap-1">
                {(Object.keys(statConfig) as StatKey[]).map((key) => {
                  const Icon = statConfig[key].icon;
                  return (
                    <Tooltip key={key}>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant={activeStat === key ? 'secondary' : 'ghost'}
                          className="h-7 w-7"
                          onClick={() => setActiveStat(key)}
                        >
                          <Icon className="h-3.5 w-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{statConfig[key].title}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </TooltipProvider>
          </div>
          <div className="rounded-xl border bg-card p-3">
            <p className="text-xs text-muted-foreground">Reviews</p>
            <p className="mt-1 flex items-baseline gap-1.5 text-2xl font-bold tabular-nums text-brand-blue md:text-3xl">
              {statsData.reviews.rating}
              <Star className="h-4 w-4 fill-brand-yellow text-brand-yellow md:h-5 md:w-5" />
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{statsData.reviews.change}</p>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-3">
          <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold">Traffic Overview</p>
              <p className="text-xs text-muted-foreground">How customers find you on Google</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline" className="h-8 text-xs">
                  {selectedRange}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {Object.keys(getMockDataSets()).map((range) => (
                  <DropdownMenuItem key={range} onClick={() => handleRangeChange(range)}>
                    {range}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="relative h-28 rounded-lg bg-muted/70 p-3 sm:h-32">
            <svg
              className="h-full w-full overflow-visible"
              viewBox="0 0 100 40"
              preserveAspectRatio="none"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <defs>
                <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <path d={chartPath} fill="none" stroke="hsl(var(--primary))" strokeWidth="1.2" />
              <path d={areaPath} fill="url(#chart-gradient)" />
              {hoveredData && (
                <g className="pointer-events-none">
                  <line
                    x1={position.x}
                    y1="0"
                    x2={position.x}
                    y2="40"
                    stroke="hsl(var(--primary))"
                    strokeWidth="0.5"
                    strokeDasharray="3 3"
                  />
                  <circle
                    cx={position.x}
                    cy={position.y}
                    r="2"
                    fill="hsl(var(--primary))"
                    stroke="hsl(var(--background))"
                    strokeWidth="0.5"
                  />
                </g>
              )}
            </svg>
            {hoveredData && (
              <div
                className="pointer-events-none absolute rounded-md border bg-popover px-2 py-1 text-xs shadow-lg"
                style={{
                  left: `${position.x}%`,
                  top: `${position.y}%`,
                  transform: 'translate(-50%, -120%)',
                }}
              >
                <div className="font-semibold">{hoveredData.label}</div>
                <div>{hoveredData.value.toLocaleString()} Views</div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Recent Activity
          </p>
          <div className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2.5">
            <MessageSquare className="h-4 w-4 shrink-0 text-brand-blue" />
            <p className="min-w-0 flex-1 truncate text-sm">
              <span className="font-semibold">New review</span> from Jane D.
            </p>
            <time className="shrink-0 text-xs text-muted-foreground">2m ago</time>
          </div>
          <div className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2.5">
            <FileSearch className="h-4 w-4 shrink-0 text-brand-green" />
            <p className="min-w-0 flex-1 truncate text-sm">
              <span className="font-semibold">Profile optimized:</span> Added 3 photos
            </p>
            <time className="shrink-0 text-xs text-muted-foreground">1h ago</time>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
