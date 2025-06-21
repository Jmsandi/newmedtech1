import React from "react";
import { useNavigate, Routes, Route, Navigate } from "react-router-dom";
import { 
  Building2, Users, Settings, BarChart3, Shield, Plus, 
  LogOut, Bell, Search, Menu, Home, Database, Monitor,
  MapPin, Phone, Mail, Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import FacilitySetup from "../FacilitySetup";

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    const userData = localStorage.getItem("hms-user");
    if (!userData) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== "super-admin") {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this area.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    setUser(parsedUser);
  }, [navigate, toast]);

  const handleLogout = () => {
    localStorage.removeItem("hms-user");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate("/login");
  };

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/super-admin", exact: true },
    { icon: Building2, label: "Facility Management", path: "/super-admin/facilities" },
    { icon: Users, label: "System Users", path: "/super-admin/users" },
    { icon: BarChart3, label: "Analytics", path: "/super-admin/analytics" },
    { icon: Database, label: "Data Management", path: "/super-admin/data" },
    { icon: Monitor, label: "System Monitor", path: "/super-admin/monitor" },
    { icon: Settings, label: "System Settings", path: "/super-admin/settings" },
  ];

  // Mock data for dashboard
  const systemStats = {
    totalFacilities: 15,
    activeFacilities: 12,
    totalUsers: 247,
    activeUsers: 189,
    totalPatients: 3421,
    systemUptime: "99.8%",
  };

  const recentActivities = [
    { id: 1, type: "facility", message: "New facility 'West Side Clinic' added", time: "2 hours ago" },
    { id: 2, type: "user", message: "5 new users registered across facilities", time: "4 hours ago" },
    { id: 3, type: "system", message: "Database backup completed successfully", time: "6 hours ago" },
    { id: 4, type: "alert", message: "High patient load at Central Hospital", time: "8 hours ago" },
  ];

  const facilityOverview = [
    { id: 1, name: "Central Medical Hospital", type: "Main Hospital", status: "Active", patients: 145, staff: 34 },
    { id: 2, name: "West Side Clinic", type: "Clinic", status: "Active", patients: 67, staff: 12 },
    { id: 3, name: "North Health Center", type: "Health Center", status: "Active", patients: 89, staff: 18 },
    { id: 4, name: "Emergency Response Unit", type: "Specialty Center", status: "Active", patients: 23, staff: 8 },
  ];

  const MainDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-blue-100">
          System Administrator Dashboard - Manage facilities, users, and system-wide operations
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Facilities</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.totalFacilities}</div>
            <p className="text-xs text-muted-foreground">
              {systemStats.activeFacilities} active facilities
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {systemStats.activeUsers} active users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.totalPatients}</div>
            <p className="text-xs text-muted-foreground">
              Across all facilities
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <Monitor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.systemUptime}</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Facility Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Facility Overview</CardTitle>
            <CardDescription>Quick view of all facilities in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {facilityOverview.map((facility) => (
                <div key={facility.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{facility.name}</div>
                    <div className="text-sm text-gray-500">{facility.type}</div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {facility.status}
                    </Badge>
                    <div className="text-sm text-gray-500 mt-1">
                      {facility.patients} patients, {facility.staff} staff
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button 
              className="w-full mt-4" 
              variant="outline" 
              onClick={() => navigate("/super-admin/facilities")}
            >
              Manage All Facilities
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent System Activities</CardTitle>
            <CardDescription>Latest events and system updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <div className={`p-1 rounded-full ${
                    activity.type === 'facility' ? 'bg-blue-100' :
                    activity.type === 'user' ? 'bg-green-100' :
                    activity.type === 'system' ? 'bg-purple-100' : 'bg-orange-100'
                  }`}>
                    {activity.type === 'facility' && <Building2 className="h-3 w-3" />}
                    {activity.type === 'user' && <Users className="h-3 w-3" />}
                    {activity.type === 'system' && <Database className="h-3 w-3" />}
                    {activity.type === 'alert' && <Bell className="h-3 w-3" />}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm">{activity.message}</div>
                    <div className="text-xs text-gray-500">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button 
              className="h-20 flex flex-col space-y-2" 
              variant="outline"
              onClick={() => navigate("/super-admin/facilities")}
            >
              <Plus className="h-5 w-5" />
              <span>Add New Facility</span>
            </Button>
            <Button 
              className="h-20 flex flex-col space-y-2" 
              variant="outline"
              onClick={() => navigate("/super-admin/users")}
            >
              <Users className="h-5 w-5" />
              <span>Manage Users</span>
            </Button>
            <Button 
              className="h-20 flex flex-col space-y-2" 
              variant="outline"
              onClick={() => navigate("/super-admin/analytics")}
            >
              <BarChart3 className="h-5 w-5" />
              <span>View Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-red-600" />
              <h1 className="text-xl font-bold">Super Admin Portal</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Search className="h-4 w-4" />
            </Button>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">{user.name}</span>
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                Super Admin
              </Badge>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm h-[calc(100vh-73px)] overflow-y-auto">
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                className={`w-full justify-start ${
                  window.location.pathname === item.path ? 'bg-blue-50 text-blue-700' : ''
                }`}
                onClick={() => navigate(item.path)}
              >
                <item.icon className="h-4 w-4 mr-3" />
                {item.label}
              </Button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Routes>
            <Route index element={<MainDashboard />} />
            <Route path="facilities" element={<FacilitySetup />} />
            <Route path="users" element={<div>User Management (Coming Soon)</div>} />
            <Route path="analytics" element={<div>System Analytics (Coming Soon)</div>} />
            <Route path="data" element={<div>Data Management (Coming Soon)</div>} />
            <Route path="monitor" element={<div>System Monitor (Coming Soon)</div>} />
            <Route path="settings" element={<div>System Settings (Coming Soon)</div>} />
            <Route path="*" element={<Navigate to="/super-admin" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default SuperAdminDashboard; 