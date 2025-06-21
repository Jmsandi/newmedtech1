import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  User,
  Calendar,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  Loader2
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { RecentAppointments } from "@/components/dashboard/RecentAppointments";
import { 
  getAdminDashboardStats, 
  getPatientTrendDataAdmin, 
  getTodayAppointmentsAdmin 
} from "@/services/database/admin-services";
import { useToast } from "@/hooks/use-toast";

interface DashboardData {
  totalPatients: number;
  totalDoctors: number;
  totalNurses: number;
  totalAppointments: number;
  todayAppointments: number;
  lastUpdated: string;
}

interface AppointmentData {
  id: string;
  patient: string;
  doctor: string;
  time: string;
  status: string;
}

const Dashboard = () => {
  const { toast } = useToast();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [patientChart, setPatientChart] = useState<any[]>([]);
  const [todayAppointments, setTodayAppointments] = useState<AppointmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboardData = async () => {
    try {
      const [stats, chartData, appointments] = await Promise.all([
        getAdminDashboardStats(),
        getPatientTrendDataAdmin(),
        getTodayAppointmentsAdmin()
      ]);

      setDashboardData(stats);
      setPatientChart(chartData);
      
      // Transform appointments for display
      const transformedAppointments = appointments.slice(0, 4).map((apt, index) => ({
        id: apt._id || `apt_${index}`,
        patient: apt.patientName || 'Unknown Patient',
        doctor: apt.doctor || 'Unknown Doctor',
        time: apt.time || 'No time set',
        status: apt.status || 'Scheduled'
      }));
      
      setTodayAppointments(transformedAppointments);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Error Loading Dashboard",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    toast({
      title: "Dashboard Refreshed",
      description: "All data has been updated successfully.",
    });
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  const statsData = dashboardData ? [
    { 
      id: 1, 
      title: "Total Patients", 
      value: dashboardData.totalPatients.toString(), 
      change: "+12%", 
      trend: "up" as const,
      icon: <Users className="h-5 w-5 text-hospital-primary" />
    },
    { 
      id: 2, 
      title: "Active Doctors", 
      value: dashboardData.totalDoctors.toString(), 
      change: "+3", 
      trend: "up" as const,
      icon: <User className="h-5 w-5 text-hospital-secondary" />
    },
    { 
      id: 3, 
      title: "Today's Appointments", 
      value: dashboardData.todayAppointments.toString(), 
      change: dashboardData.todayAppointments > 0 ? "+5" : "0", 
      trend: dashboardData.todayAppointments > 0 ? "up" as const : "neutral" as const,
      icon: <Calendar className="h-5 w-5 text-hospital-accent" />
    },
  ] : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Calendar className="mr-2 h-4 w-4" />
            )}
            {refreshing ? "Refreshing..." : new Date().toLocaleDateString()}
          </Button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid gap-4 md:grid-cols-3">
        {statsData.map(stat => (
          <DashboardStats key={stat.id} {...stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Patient Trends</CardTitle>
            <CardDescription>
              Inpatient vs Outpatient data for the past 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={patientChart}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="inPatients" name="Inpatients" fill="#1976d2" />
                  <Bar dataKey="outPatients" name="Outpatients" fill="#00acc1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle>Today's Appointments</CardTitle>
              <CardDescription>
                Recent appointments scheduled for today
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-hospital-primary">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {todayAppointments.length > 0 ? (
              <RecentAppointments appointments={todayAppointments} />
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>No appointments scheduled for today</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Database Status */}
      {dashboardData && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">
              Last updated: {new Date(dashboardData.lastUpdated).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
