"use client";

import { Flame, Zap, Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface AnalyticsCardsProps {
  streak: number;
  totalPosts: number;
  consistencyScore: number;
}

export default function AnalyticsCards({
  streak,
  totalPosts,
  consistencyScore,
}: AnalyticsCardsProps) {
  const cards = [
    {
      label: "Current Streak",
      value: `${streak} Days`,
      icon: Flame,
      color: "text-orange-500",
      gradient: "from-orange-500/20 to-orange-600/10",
      borderGradient: "border-orange-500/30",
    },
    {
      label: "Total Posts",
      value: totalPosts.toString(),
      icon: Zap,
      color: "text-yellow-500",
      gradient: "from-yellow-500/20 to-yellow-600/10",
      borderGradient: "border-yellow-500/30",
    },
    {
      label: "Consistency Score",
      value: `${consistencyScore}%`,
      icon: Activity,
      color: "text-cyan-500",
      gradient: "from-cyan-500/20 to-blue-600/10",
      borderGradient: "border-cyan-500/30",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card
            key={card.label}
            className={`relative overflow-hidden border-2 ${card.borderGradient} bg-gradient-to-br ${card.gradient}`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">
                    {card.label}
                  </p>
                  <p className="mt-2 text-3xl font-bold text-slate-200">
                    {card.value}
                  </p>
                </div>
                <div
                  className={`rounded-lg bg-slate-900/50 p-3 ${card.color}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

