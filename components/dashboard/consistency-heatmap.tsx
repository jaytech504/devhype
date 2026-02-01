"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ContributionData {
  date: string;
  count: number;
}

interface ConsistencyHeatmapProps {
  data: ContributionData[];
}

export default function ConsistencyHeatmap({
  data,
}: ConsistencyHeatmapProps) {
  // Group data by week (53 weeks for 365 days)
  const weeks: (ContributionData | null)[][] = [];
  let currentWeek: (ContributionData | null)[] = [];

  // Start from 365 days ago
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 364);

  // Create a map for quick lookup
  const dataMap = new Map(
    data.map((item) => [item.date, item.count])
  );

  // Generate all 365 days
  for (let i = 0; i < 365; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split("T")[0];
    const count = dataMap.get(dateStr) || 0;

    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 && currentWeek.length > 0) {
      // Start new week on Sunday
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
    currentWeek.push({ date: dateStr, count });
  }
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  // Pad weeks to ensure they start on Sunday
  weeks.forEach((week) => {
    while (week.length < 7) {
      week.unshift(null);
    }
  });

  const getIntensity = (count: number) => {
    if (count === 0) return "bg-slate-800";
    if (count === 1) return "bg-green-500/30";
    if (count === 2) return "bg-green-500/50";
    if (count >= 3) return "bg-green-500/70";
    return "bg-slate-800";
  };

  return (
    <Card className="border-slate-800">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-slate-200">
          Your Posting History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((day, dayIndex) => {
                  if (!day) {
                    return (
                      <div
                        key={`${weekIndex}-${dayIndex}`}
                        className="w-3 h-3 rounded-sm bg-transparent"
                      />
                    );
                  }
                  return (
                    <div
                      key={day.date}
                      className={`w-3 h-3 rounded-sm ${getIntensity(
                        day.count
                      )} hover:ring-2 hover:ring-green-400/50 transition-all cursor-pointer`}
                      title={`${day.date}: ${day.count} posts`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
            <span>Less</span>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm bg-slate-800" />
              <div className="w-3 h-3 rounded-sm bg-green-500/30" />
              <div className="w-3 h-3 rounded-sm bg-green-500/50" />
              <div className="w-3 h-3 rounded-sm bg-green-500/70" />
            </div>
            <span>More</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

