
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardStatsProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: React.ReactNode;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  title,
  value,
  change,
  trend,
  icon,
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-x-2">
          <div className="flex items-center space-x-4">
            <div className="bg-primary/10 p-2 rounded-full">{icon}</div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {title}
              </p>
              <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
            </div>
          </div>
          <div
            className={cn(
              "flex items-center text-xs font-medium",
              trend === "up" && "text-hospital-success",
              trend === "down" && "text-hospital-danger",
              trend === "neutral" && "text-muted-foreground"
            )}
          >
            {trend === "up" && <ArrowUp className="mr-1 h-3 w-3" />}
            {trend === "down" && <ArrowDown className="mr-1 h-3 w-3" />}
            {change}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
