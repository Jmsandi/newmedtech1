
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { TrendingDown, TrendingUp, Download, Calendar, Users, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Analytics = () => {
  // Mock data for charts
  const mortalityTrends = [
    { month: "Jan", deaths: 8, rate: 2.1 },
    { month: "Feb", deaths: 6, rate: 1.8 },
    { month: "Mar", deaths: 9, rate: 2.4 },
    { month: "Apr", deaths: 7, rate: 1.9 },
    { month: "May", deaths: 5, rate: 1.5 },
    { month: "Jun", deaths: 4, rate: 1.2 },
  ];

  const riskDistribution = [
    { risk: "Low", count: 1240, color: "#22c55e" },
    { risk: "Medium", count: 456, color: "#f59e0b" },
    { risk: "High", count: 189, color: "#ef4444" },
    { risk: "Critical", count: 67, color: "#dc2626" },
  ];

  const interventionSuccess = [
    { type: "Early Detection", success: 94, total: 120 },
    { type: "Emergency Response", success: 87, total: 95 },
    { type: "Referral System", success: 156, total: 167 },
    { type: "Preventive Care", success: 234, total: 245 },
  ];

  const ageGroupAnalysis = [
    { ageGroup: "15-19", count: 45, mortality: 3.2 },
    { ageGroup: "20-24", count: 234, mortality: 1.8 },
    { ageGroup: "25-29", count: 456, mortality: 1.4 },
    { ageGroup: "30-34", count: 378, mortality: 2.1 },
    { ageGroup: "35-39", count: 189, mortality: 3.8 },
    { ageGroup: "40+", count: 67, mortality: 5.2 },
  ];

  const chartConfig = {
    deaths: { label: "Deaths", color: "#ef4444" },
    rate: { label: "Rate (%)", color: "#3b82f6" },
    count: { label: "Count", color: "#22c55e" },
    success: { label: "Success Rate", color: "#22c55e" },
    mortality: { label: "Mortality Rate", color: "#ef4444" },
  };

  return (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maternal Mortality Rate</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">1.2%</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingDown className="h-3 w-3 mr-1" />
              -0.8% from last quarter
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Case Fatality Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0.8%</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingDown className="h-3 w-3 mr-1" />
              -0.3% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18min</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingDown className="h-3 w-3 mr-1" />
              -5min improvement
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,952</div>
            <div className="flex items-center text-xs text-blue-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% this month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Mortality Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Mortality Trends</CardTitle>
            <CardDescription>Monthly maternal mortality rates and absolute numbers</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <LineChart data={mortalityTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar yAxisId="left" dataKey="deaths" fill="#ef4444" />
                <Line yAxisId="right" type="monotone" dataKey="rate" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Risk Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Distribution</CardTitle>
            <CardDescription>Current patient risk level breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="count"
                  label={({ risk, count }) => `${risk}: ${count}`}
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Intervention Success Rates */}
        <Card>
          <CardHeader>
            <CardTitle>Intervention Success Rates</CardTitle>
            <CardDescription>Effectiveness of different intervention strategies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {interventionSuccess.map((item, index) => {
                const successRate = Math.round((item.success / item.total) * 100);
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{item.type}</span>
                      <span>{successRate}% ({item.success}/{item.total})</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${successRate}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Age Group Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Age Group Analysis</CardTitle>
            <CardDescription>Patient distribution and mortality rates by age group</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <BarChart data={ageGroupAnalysis}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ageGroup" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar yAxisId="left" dataKey="count" fill="#22c55e" />
                <Line yAxisId="right" type="monotone" dataKey="mortality" stroke="#ef4444" strokeWidth={2} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Report Generation</CardTitle>
          <CardDescription>Generate and export comprehensive reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Weekly Report (PDF)
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Monthly Report (Excel)
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Quarterly Analysis
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Custom Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
