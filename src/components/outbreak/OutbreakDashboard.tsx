
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, TrendingDown, Users, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

const caseData = [
  { date: "Jan 15", confirmed: 12, suspected: 8, recovered: 5 },
  { date: "Jan 16", confirmed: 18, suspected: 12, recovered: 8 },
  { date: "Jan 17", confirmed: 25, suspected: 15, recovered: 12 },
  { date: "Jan 18", confirmed: 32, suspected: 18, recovered: 18 },
  { date: "Jan 19", confirmed: 28, suspected: 14, recovered: 22 },
  { date: "Jan 20", confirmed: 35, suspected: 20, recovered: 28 }
];

const ageGroupData = [
  { name: "0-18", value: 15, color: "#8884d8" },
  { name: "19-35", value: 45, color: "#82ca9d" },
  { name: "36-50", value: 35, color: "#ffc658" },
  { name: "51-65", value: 25, color: "#ff7300" },
  { name: "65+", value: 20, color: "#d84315" }
];

const regionData = [
  { region: "North", cases: 45, population: 50000, rate: 90 },
  { region: "South", cases: 32, population: 45000, rate: 71 },
  { region: "East", cases: 28, population: 38000, rate: 74 },
  { region: "West", cases: 38, population: 42000, rate: 90 },
  { region: "Central", cases: 55, population: 60000, rate: 92 }
];

export const OutbreakDashboard = () => {
  const totalCases = 198;
  const activeCases = 125;
  const recovered = 68;
  const deaths = 5;
  const suspectedCases = 87;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCases}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12% from yesterday
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{activeCases}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-orange-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +8% from yesterday
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recovered</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{recovered}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +15% from yesterday
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deaths</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{deaths}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingDown className="h-3 w-3 mr-1" />
                No change
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suspected</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{suspectedCases}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-yellow-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +5% from yesterday
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Case Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Case Trends (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={caseData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="confirmed" stroke="#ef4444" strokeWidth={2} name="Confirmed" />
                  <Line type="monotone" dataKey="suspected" stroke="#f59e0b" strokeWidth={2} name="Suspected" />
                  <Line type="monotone" dataKey="recovered" stroke="#10b981" strokeWidth={2} name="Recovered" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Age Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Cases by Age Group</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ageGroupData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {ageGroupData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Regional Data */}
      <Card>
        <CardHeader>
          <CardTitle>Regional Case Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="region" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'cases' ? `${value} cases` : `${value} per 100k`,
                    name === 'cases' ? 'Cases' : 'Rate per 100k'
                  ]}
                />
                <Bar dataKey="cases" fill="#3b82f6" name="cases" />
                <Bar dataKey="rate" fill="#ef4444" name="rate" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts & Updates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg border border-red-200">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <p className="font-medium text-red-900">High case cluster detected in North Region</p>
                <p className="text-sm text-red-700">15 new cases reported in the last 24 hours. Enhanced monitoring activated.</p>
                <span className="text-xs text-red-600">2 hours ago</span>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-900">Contact tracing update</p>
                <p className="text-sm text-yellow-700">142 contacts identified and notified for Case #045.</p>
                <span className="text-xs text-yellow-600">4 hours ago</span>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-900">Recovery milestone reached</p>
                <p className="text-sm text-green-700">Recovery rate has improved to 68% this week.</p>
                <span className="text-xs text-green-600">6 hours ago</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
