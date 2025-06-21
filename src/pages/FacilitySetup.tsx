import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Building2, Plus, Users, Settings, MapPin, Phone, Mail, 
  Save, ArrowLeft, Check, X, Edit, Trash2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Facility {
  id: string;
  name: string;
  type: 'main-hospital' | 'clinic' | 'health-center' | 'specialty-center';
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive' | 'pending';
  adminId?: string;
  adminName?: string;
  adminEmail?: string;
  createdAt: string;
}

interface FacilityAdmin {
  id: string;
  name: string;
  email: string;
  username: string;
  password: string;
  facilityId: string;
  facilityName: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

const FacilitySetup = () => {
  const [facilities, setFacilities] = useState<Facility[]>([
    {
      id: "fac_001",
      name: "Central Medical Hospital",
      type: "main-hospital",
      address: "123 Medical Drive",
      city: "Accra",
      state: "Greater Accra",
      phone: "+233-24-123-4567",
      email: "admin@centralmedical.gh",
      status: "active",
      adminId: "admin_001",
      adminName: "Dr. Michael Asante",
      adminEmail: "m.asante@centralmedical.gh",
      createdAt: "2024-01-15T10:00:00Z",
    }
  ]);

  const [facilityAdmins, setFacilityAdmins] = useState<FacilityAdmin[]>([
    {
      id: "admin_001",
      name: "Dr. Michael Asante",
      email: "m.asante@centralmedical.gh",
      username: "fadmin",
      password: "facility123",
      facilityId: "fac_001",
      facilityName: "Central Medical Hospital",
      status: "active",
      createdAt: "2024-01-15T10:00:00Z",
    }
  ]);

  const [showNewFacilityDialog, setShowNewFacilityDialog] = useState(false);
  const [showNewAdminDialog, setShowNewAdminDialog] = useState(false);
  const [selectedFacilityForAdmin, setSelectedFacilityForAdmin] = useState<string>("");
  
  const [newFacility, setNewFacility] = useState({
    name: "",
    type: "clinic" as const,
    address: "",
    city: "",
    state: "",
    phone: "",
    email: "",
  });

  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user has permission (Super Admin only)
  React.useEffect(() => {
    const user = localStorage.getItem("hms-user");
    if (!user) {
      navigate("/login");
      return;
    }
    
    const userData = JSON.parse(user);
    if (userData.role !== "super-admin") {
      toast({
        title: "Access Denied",
        description: "Only Super Administrators can access facility setup.",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [navigate, toast]);

  const handleCreateFacility = () => {
    if (!newFacility.name || !newFacility.address || !newFacility.city) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const facility: Facility = {
      id: `fac_${Date.now()}`,
      ...newFacility,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    setFacilities([...facilities, facility]);
    setNewFacility({
      name: "",
      type: "clinic",
      address: "",
      city: "",
      state: "",
      phone: "",
      email: "",
    });
    setShowNewFacilityDialog(false);

    toast({
      title: "Facility Created",
      description: `${facility.name} has been successfully created.`,
    });
  };

  const handleCreateAdmin = () => {
    if (!newAdmin.name || !newAdmin.email || !newAdmin.username || !selectedFacilityForAdmin) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields and select a facility.",
        variant: "destructive",
      });
      return;
    }

    const facility = facilities.find(f => f.id === selectedFacilityForAdmin);
    if (!facility) {
      toast({
        title: "Error",
        description: "Selected facility not found.",
        variant: "destructive",
      });
      return;
    }

    const admin: FacilityAdmin = {
      id: `admin_${Date.now()}`,
      ...newAdmin,
      password: newAdmin.password || "defaultpass123",
      facilityId: selectedFacilityForAdmin,
      facilityName: facility.name,
      status: "active",
      createdAt: new Date().toISOString(),
    };

    // Update facility with admin info
    setFacilities(facilities.map(f => 
      f.id === selectedFacilityForAdmin 
        ? { ...f, adminId: admin.id, adminName: admin.name, adminEmail: admin.email, status: "active" }
        : f
    ));

    setFacilityAdmins([...facilityAdmins, admin]);
    setNewAdmin({ name: "", email: "", username: "", password: "" });
    setSelectedFacilityForAdmin("");
    setShowNewAdminDialog(false);

    toast({
      title: "Facility Admin Created",
      description: `${admin.name} has been assigned as admin for ${facility.name}.`,
    });
  };

  const getFacilityTypeColor = (type: string) => {
    switch (type) {
      case 'main-hospital':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'clinic':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'health-center':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'specialty-center':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const facilitiesWithoutAdmin = facilities.filter(f => !f.adminId);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => navigate("/super-admin")}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Facility Management</h1>
                <p className="text-gray-600">Manage hospitals, clinics, and facility administrators</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Dialog open={showNewFacilityDialog} onOpenChange={setShowNewFacilityDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Facility
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create New Facility</DialogTitle>
                    <DialogDescription>
                      Add a new hospital, clinic, or health center to the system.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="facilityName">Facility Name *</Label>
                      <Input
                        id="facilityName"
                        value={newFacility.name}
                        onChange={(e) => setNewFacility({...newFacility, name: e.target.value})}
                        placeholder="Enter facility name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="facilityType">Facility Type</Label>
                      <Select value={newFacility.type} onValueChange={(value: any) => setNewFacility({...newFacility, type: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="main-hospital">Main Hospital</SelectItem>
                          <SelectItem value="clinic">Clinic</SelectItem>
                          <SelectItem value="health-center">Health Center</SelectItem>
                          <SelectItem value="specialty-center">Specialty Center</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="address">Address *</Label>
                      <Input
                        id="address"
                        value={newFacility.address}
                        onChange={(e) => setNewFacility({...newFacility, address: e.target.value})}
                        placeholder="Street address"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={newFacility.city}
                          onChange={(e) => setNewFacility({...newFacility, city: e.target.value})}
                          placeholder="City"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State/Region</Label>
                        <Input
                          id="state"
                          value={newFacility.state}
                          onChange={(e) => setNewFacility({...newFacility, state: e.target.value})}
                          placeholder="State/Region"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={newFacility.phone}
                        onChange={(e) => setNewFacility({...newFacility, phone: e.target.value})}
                        placeholder="+233-XX-XXX-XXXX"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newFacility.email}
                        onChange={(e) => setNewFacility({...newFacility, email: e.target.value})}
                        placeholder="facility@example.com"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowNewFacilityDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateFacility}>Create Facility</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={showNewAdminDialog} onOpenChange={setShowNewAdminDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Add Admin
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create Facility Administrator</DialogTitle>
                    <DialogDescription>
                      Assign an administrator to manage a specific facility.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="facility">Select Facility *</Label>
                      <Select value={selectedFacilityForAdmin} onValueChange={setSelectedFacilityForAdmin}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a facility" />
                        </SelectTrigger>
                        <SelectContent>
                          {facilitiesWithoutAdmin.map((facility) => (
                            <SelectItem key={facility.id} value={facility.id}>
                              {facility.name} ({facility.type})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {facilitiesWithoutAdmin.length === 0 && (
                        <p className="text-sm text-gray-500 mt-1">
                          All facilities have assigned administrators.
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="adminName">Administrator Name *</Label>
                      <Input
                        id="adminName"
                        value={newAdmin.name}
                        onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})}
                        placeholder="Full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="adminEmail">Email Address *</Label>
                      <Input
                        id="adminEmail"
                        type="email"
                        value={newAdmin.email}
                        onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                        placeholder="admin@facility.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="adminUsername">Username *</Label>
                      <Input
                        id="adminUsername"
                        value={newAdmin.username}
                        onChange={(e) => setNewAdmin({...newAdmin, username: e.target.value})}
                        placeholder="Username for login"
                      />
                    </div>
                    <div>
                      <Label htmlFor="adminPassword">Password</Label>
                      <Input
                        id="adminPassword"
                        type="password"
                        value={newAdmin.password}
                        onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                        placeholder="Leave blank for default password"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Default password: defaultpass123
                      </p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowNewAdminDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateAdmin} disabled={facilitiesWithoutAdmin.length === 0}>
                      Create Administrator
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Facilities Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {facilities.map((facility) => (
            <Card key={facility.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{facility.name}</CardTitle>
                    <CardDescription className="flex items-center space-x-2 mt-1">
                      <MapPin className="h-4 w-4" />
                      <span>{facility.city}, {facility.state}</span>
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Badge variant="outline" className={getFacilityTypeColor(facility.type)}>
                      {facility.type.replace('-', ' ')}
                    </Badge>
                    <Badge variant="outline" className={getStatusColor(facility.status)}>
                      {facility.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{facility.address}</span>
                  </div>
                  {facility.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{facility.phone}</span>
                    </div>
                  )}
                  {facility.email && (
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>{facility.email}</span>
                    </div>
                  )}
                  {facility.adminName && (
                    <div className="mt-3 p-2 bg-green-50 rounded border border-green-200">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-green-600" />
                        <div>
                          <div className="font-medium text-green-800">{facility.adminName}</div>
                          <div className="text-xs text-green-600">{facility.adminEmail}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex justify-between w-full">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Facility Administrators Table */}
        <Card>
          <CardHeader>
            <CardTitle>Facility Administrators</CardTitle>
            <CardDescription>
              Manage administrators for each facility
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">Administrator</th>
                    <th className="text-left p-3 font-medium">Facility</th>
                    <th className="text-left p-3 font-medium">Username</th>
                    <th className="text-left p-3 font-medium">Status</th>
                    <th className="text-left p-3 font-medium">Created</th>
                    <th className="text-left p-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {facilityAdmins.map((admin) => (
                    <tr key={admin.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div>
                          <div className="font-medium">{admin.name}</div>
                          <div className="text-sm text-gray-500">{admin.email}</div>
                        </div>
                      </td>
                      <td className="p-3">{admin.facilityName}</td>
                      <td className="p-3">
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                          {admin.username}
                        </code>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline" className={getStatusColor(admin.status)}>
                          {admin.status}
                        </Badge>
                      </td>
                      <td className="p-3 text-sm text-gray-500">
                        {new Date(admin.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
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
    </div>
  );
};

export default FacilitySetup; 