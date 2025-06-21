import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Users, 
  Activity, 
  AlertTriangle, 
  Heart, 
  Clock,
  TrendingUp,
  MapPin,
  Phone,
  CheckCircle,
  XCircle,
  Truck
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

interface EmergencyTeamDashboardProps {
  stats: {
    totalTeams: number;
    activeTeams: number;
    totalNurseAssignments: number;
    totalDoctorAssignments: number;
    totalOutbreakResponses: number;
    totalMaternalResponses: number;
    totalDeployments: number;
    activeDeployments: number;
    averageResponseTime: number;
  };
  onRefresh: () => void;
}

export const EmergencyTeamDashboard: React.FC<EmergencyTeamDashboardProps> = ({ stats, onRefresh }) => {
  // Sample data for charts
  const teamTypeData = [
    { name: "Medical", count: 8, color: "#3b82f6" },
    { name: "Surgical", count: 5, color: "#ef4444" },
    { name: "Maternal", count: 6, color: "#f59e0b" },
    { name: "Outbreak", count: 4, color: "#10b981" },
    { name: "General", count: 7, color: "#8b5cf6" },
    { name: "Trauma", count: 3, color: "#f97316" }
  ];

  const responseTimeData = [
    { month: "Jan", avgTime: 12, target: 15 },
    { month: "Feb", avgTime: 14, target: 15 },
    { month: "Mar", avgTime: 11, target: 15 },
    { month: "Apr", avgTime: 13, target: 15 },
    { month: "May", avgTime: 10, target: 15 },
    { month: "Jun", avgTime: 9, target: 15 }
  ];

  const deploymentData = [
    { type: "Outbreak Response", count: stats.totalOutbreakResponses },
    { type: "Maternal Emergency", count: stats.totalMaternalResponses },
    { type: "Medical Emergency", count: 15 },
    { type: "Disaster Response", count: 8 }
  ];

  const recentActivities = [
    {
      id: 1,
      type: "deployment",
      title: "Team Alpha deployed to COVID-19 outbreak",
      location: "Central District",
      time: "2 hours ago",
      status: "active",
      icon: AlertTriangle,
      color: "text-red-600"
    },
    {
      id: 2,
      type: "maternal",
      title: "Maternal Emergency Team responded to eclampsia case",
      location: "District Hospital",
      time: "4 hours ago",
      status: "completed",
      icon: Heart,
      color: "text-pink-600"
    },
    {
      id: 3,
      type: "training",
      title: "Emergency Response Training completed",
      location: "Training Center",
      time: "1 day ago",
      status: "completed",
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      id: 4,
      type: "assignment",
      title: "Dr. Sarah Johnson assigned to Team Beta",
      location: "Emergency Department",
      time: "2 days ago",
      status: "completed",
      icon: Users,
      color: "text-blue-600"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Team Efficiency</p>
                <p className="text-2xl font-bold text-green-600">94.2%</p>
                <p className="text-xs text-gray-500">+2.1% from last month</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Response Rate</p>
                <p className="text-2xl font-bold text-blue-600">98.7%</p>
                <p className="text-xs text-gray-500">Within target time</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-green-600">96.4%</p>
                <p className="text-xs text-gray-500">Successful interventions</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Coverage Area</p>
                <p className="text-2xl font-bold text-purple-600">12</p>
                <p className="text-xs text-gray-500">Districts covered</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <MapPin className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Types Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Team Types Distribution</span>
            </CardTitle>
            <CardDescription>
              Distribution of emergency teams by specialization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={teamTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {teamTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Response Time Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Response Time Trends</span>
            </CardTitle>
            <CardDescription>
              Average response time vs target (minutes)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="avgTime" stroke="#3b82f6" strokeWidth={2} name="Actual" />
                <Line type="monotone" dataKey="target" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" name="Target" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Deployment Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Truck className="h-5 w-5" />
            <span>Deployment Statistics</span>
          </CardTitle>
          <CardDescription>
            Emergency team deployments by type
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={deploymentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Recent Activities</span>
          </CardTitle>
          <CardDescription>
            Latest emergency team activities and deployments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => {
              const IconComponent = activity.icon;
              return (
                <div key={activity.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className={`p-2 bg-white rounded-lg ${activity.color}`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{activity.title}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{activity.location}</span>
                      </span>
                      <span>{activity.time}</span>
                    </div>
                  </div>
                  <Badge 
                    variant={activity.status === 'active' ? 'destructive' : 'default'}
                    className={activity.status === 'active' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}
                  >
                    {activity.status}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common emergency team management tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="h-20 flex flex-col items-center justify-center space-y-2">
              <Shield className="h-6 w-6" />
              <span>Create Team</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Users className="h-6 w-6" />
              <span>Assign Staff</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Truck className="h-6 w-6" />
              <span>Deploy Team</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2" onClick={onRefresh}>
              <Activity className="h-6 w-6" />
              <span>Refresh Data</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 