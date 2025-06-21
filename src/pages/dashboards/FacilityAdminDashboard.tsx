import React from "react";
import { useNavigate, Routes, Route, Navigate } from "react-router-dom";
import { 
  Building2, Users, UserCheck, Stethoscope, Plus, LogOut, Bell, Search,
  Home, Calendar, FileText, BarChart3, Settings, Activity, Clock, AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StaffMember {
  id: string;
  name: string;
  role: 'doctor' | 'nurse' | 'staff';
  email: string;
  username: string;
  department?: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

const FacilityAdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [user, setUser] = React.useState<any>(null);
  const [staffMembers, setStaffMembers] = React.useState<StaffMember[]>([
    {
      id: "doc_001",
      name: "Dr. Sarah Johnson",
      role: "doctor",
      email: "s.johnson@centralmedical.gh",
      username: "doctor",
      department: "General Medicine",
      status: "active",
      createdAt: "2024-01-20T10:00:00Z",
    },
    {
      id: "nurse_001",
      name: "Nurse Mary Williams",
      role: "nurse",
      email: "m.williams@centralmedical.gh",
      username: "nurse",
      department: "Emergency",
      status: "active",
      createdAt: "2024-01-22T10:00:00Z",
    },
    {
      id: "staff_001",
      name: "John Miller",
      role: "staff",
      email: "j.miller@centralmedical.gh",
      username: "staff",
      department: "Administration",
      status: "active",
      createdAt: "2024-01-25T10:00:00Z",
    },
  ]);

  const [showNewUserDialog, setShowNewUserDialog] = React.useState(false);
  const [newUser, setNewUser] = React.useState({
    name: "",
    role: "staff" as "doctor" | "nurse" | "staff",
    email: "",
    username: "",
    password: "",
    department: "",
  });

  React.useEffect(() => {
    const userData = localStorage.getItem("hms-user");
    if (!userData) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== "facility-admin") {
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

  const handleCreateUser = () => {
    if (!newUser.name || !newUser.email || !newUser.username || !newUser.role) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const staff: StaffMember = {
      id: `${newUser.role}_${Date.now()}`,
      ...newUser,
      status: "active",
      createdAt: new Date().toISOString(),
    };

    setStaffMembers([...staffMembers, staff]);
    setNewUser({
      name: "",
      role: "staff",
      email: "",
      username: "",
      password: "",
      department: "",
    });
    setShowNewUserDialog(false);

    toast({
      title: "User Created",
      description: `${staff.name} has been added as ${staff.role} with login credentials.`,
    });
  };

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/facility-admin" },
    { icon: Users, label: "Staff Management", path: "/facility-admin/staff" },
    { icon: Stethoscope, label: "Doctors", path: "/facility-admin/doctors" },
    { icon: UserCheck, label: "Nurses", path: "/facility-admin/nurses" },
    { icon: Calendar, label: "Schedules", path: "/facility-admin/schedules" },
    { icon: FileText, label: "Reports", path: "/facility-admin/reports" },
    { icon: BarChart3, label: "Analytics", path: "/facility-admin/analytics" },
    { icon: Settings, label: "Settings", path: "/facility-admin/settings" },
  ];

  // Mock data for dashboard
  const facilityStats = {
    totalStaff: staffMembers.length,
    activeStaff: staffMembers.filter(s => s.status === 'active').length,
    doctors: staffMembers.filter(s => s.role === 'doctor').length,
    nurses: staffMembers.filter(s => s.role === 'nurse').length,
    patients: 145,
    appointments: 23,
  };

  const recentActivities = [
    { id: 1, message: "Dr. Sarah Johnson completed patient consultation", time: "30 minutes ago" },
    { id: 2, message: "New patient registered: Jane Doe", time: "1 hour ago" },
    { id: 3, message: "Nurse Mary Williams updated patient vitals", time: "2 hours ago" },
    { id: 4, message: "Appointment scheduled for tomorrow", time: "3 hours ago" },
  ];

  const departments = [
    "General Medicine", "Emergency", "Pediatrics", "Surgery", 
    "Cardiology", "Laboratory", "Pharmacy", "Administration"
  ];

  const MainDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">Welcome, {user?.name}!</h1>
        <p className="text-blue-100">
          Facility Administrator - {user?.facilityName}
        </p>
        <p className="text-blue-200 text-sm mt-1">
          Manage your facility's staff, operations, and patient care
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{facilityStats.totalStaff}</div>
            <p className="text-xs text-muted-foreground">
              {facilityStats.activeStaff} active members
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medical Staff</CardTitle>
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{facilityStats.doctors}</div>
            <p className="text-xs text-muted-foreground">
              Doctors available today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nursing Staff</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{facilityStats.nurses}</div>
            <p className="text-xs text-muted-foreground">
              Nurses on duty
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{facilityStats.patients}</div>
            <p className="text-xs text-muted-foreground">
              Current patient load
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Staff Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Staff Overview</CardTitle>
                <CardDescription>Manage your facility's staff members</CardDescription>
              </div>
              <Dialog open={showNewUserDialog} onOpenChange={setShowNewUserDialog}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Staff
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Staff Member</DialogTitle>
                    <DialogDescription>
                      Create a new account for a doctor, nurse, or staff member.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={newUser.name}
                        onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                        placeholder="Enter full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="role">Role *</Label>
                      <Select value={newUser.role} onValueChange={(value: any) => setNewUser({...newUser, role: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="doctor">Doctor</SelectItem>
                          <SelectItem value="nurse">Nurse</SelectItem>
                          <SelectItem value="staff">Staff</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="department">Department</Label>
                      <Select value={newUser.department} onValueChange={(value) => setNewUser({...newUser, department: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                        placeholder="user@facility.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="username">Username *</Label>
                      <Input
                        id="username"
                        value={newUser.username}
                        onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                        placeholder="Username for login"
                      />
                    </div>
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                        placeholder="Leave blank for default password"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Default password: {newUser.role}123
                      </p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowNewUserDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateUser}>Create User</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {staffMembers.slice(0, 5).map((staff) => (
                <div key={staff.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{staff.name}</div>
                    <div className="text-sm text-gray-500">{staff.department}</div>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant="outline" 
                      className={`${
                        staff.role === 'doctor' ? 'bg-green-50 text-green-700 border-green-200' :
                        staff.role === 'nurse' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                        'bg-blue-50 text-blue-700 border-blue-200'
                      }`}
                    >
                      {staff.role}
                    </Badge>
                    <div className="text-sm text-gray-500 mt-1">
                      {staff.email}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button 
              className="w-full mt-4" 
              variant="outline" 
              onClick={() => navigate("/facility-admin/staff")}
            >
              Manage All Staff
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest updates from your facility</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <div className="p-1 rounded-full bg-blue-100">
                    <Clock className="h-3 w-3 text-blue-600" />
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
          <CardDescription>Common facility management tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Button 
              className="h-20 flex flex-col space-y-2" 
              variant="outline"
              onClick={() => setShowNewUserDialog(true)}
            >
              <Plus className="h-5 w-5" />
              <span>Add Staff</span>
            </Button>
            <Button 
              className="h-20 flex flex-col space-y-2" 
              variant="outline"
              onClick={() => navigate("/facility-admin/schedules")}
            >
              <Calendar className="h-5 w-5" />
              <span>Manage Schedules</span>
            </Button>
            <Button 
              className="h-20 flex flex-col space-y-2" 
              variant="outline"
              onClick={() => navigate("/facility-admin/reports")}
            >
              <FileText className="h-5 w-5" />
              <span>View Reports</span>
            </Button>
            <Button 
              className="h-20 flex flex-col space-y-2" 
              variant="outline"
              onClick={() => navigate("/facility-admin/analytics")}
            >
              <BarChart3 className="h-5 w-5" />
              <span>Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const StaffManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Staff Management</h1>
          <p className="text-gray-600">Manage all staff members at {user?.facilityName}</p>
        </div>
        <Button onClick={() => setShowNewUserDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Staff
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Staff Members</CardTitle>
          <CardDescription>Complete list of facility staff with their roles and contact information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Name</th>
                  <th className="text-left p-3 font-medium">Role</th>
                  <th className="text-left p-3 font-medium">Department</th>
                  <th className="text-left p-3 font-medium">Email</th>
                  <th className="text-left p-3 font-medium">Username</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {staffMembers.map((staff) => (
                  <tr key={staff.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{staff.name}</td>
                    <td className="p-3">
                      <Badge 
                        variant="outline" 
                        className={`${
                          staff.role === 'doctor' ? 'bg-green-50 text-green-700 border-green-200' :
                          staff.role === 'nurse' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                          'bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                      >
                        {staff.role}
                      </Badge>
                    </td>
                    <td className="p-3">{staff.department}</td>
                    <td className="p-3">{staff.email}</td>
                    <td className="p-3">
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                        {staff.username}
                      </code>
                    </td>
                    <td className="p-3">
                      <Badge 
                        variant="outline" 
                        className={staff.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}
                      >
                        {staff.status}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          Deactivate
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
              <Building2 className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold">Facility Admin Portal</h1>
                <p className="text-sm text-gray-600">{user.facilityName}</p>
              </div>
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
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Facility Admin
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
            <Route path="staff" element={<StaffManagement />} />
            <Route path="doctors" element={<div>Doctor Management (Coming Soon)</div>} />
            <Route path="nurses" element={<div>Nurse Management (Coming Soon)</div>} />
            <Route path="schedules" element={<div>Schedule Management (Coming Soon)</div>} />
            <Route path="reports" element={<div>Reports (Coming Soon)</div>} />
            <Route path="analytics" element={<div>Analytics (Coming Soon)</div>} />
            <Route path="settings" element={<div>Settings (Coming Soon)</div>} />
            <Route path="*" element={<Navigate to="/facility-admin" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default FacilityAdminDashboard; 