import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  color?: "gold" | "green" | "blue" | "red";
}

const colors = {
  gold: "bg-accent/15 text-accent",
  green: "bg-green-100 text-green-700",
  blue: "bg-blue-100 text-blue-700",
  red: "bg-red-100 text-red-700",
};

export function StatsCard({ title, value, icon: Icon, trend, color = "gold" }: StatsCardProps) {
  const positive = trend?.startsWith("+");

  return (
    <div className="rounded-lg border border-border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-semibold text-text-muted">{title}</div>
        <div className={cn("rounded-full p-2", colors[color])}>
          <Icon size={18} />
        </div>
      </div>
      <div className="mt-4 text-3xl font-bold text-primary">{value}</div>
      {trend ? (
        <div className={cn("mt-3 text-xs font-semibold", positive ? "text-green-600" : "text-red-600")}>
          {trend}
        </div>
      ) : null}
    </div>
  );
}
