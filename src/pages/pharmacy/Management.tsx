import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Settings, 
  Shield, 
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle,
  UserPlus,
  Key,
  Calendar,
  BarChart3,
  Activity,
  Bell,
  Lock,
  Unlock,
  Eye,
  EyeOff
} from 'lucide-react';

interface Staff {
  id: string;
  name: string;
  role: 'Pharmacist' | 'Pharmacy Technician' | 'Manager' | 'Intern';
  email: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: string;
  status: 'Active' | 'Inactive' | 'On Leave';
  permissions: string[];
  lastLogin: string;
  workSchedule: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
}

interface ComplianceItem {
  id: string;
  title: string;
  type: 'License' | 'Certification' | 'Training' | 'Audit' | 'Policy';
  status: 'Compliant' | 'Expiring Soon' | 'Expired' | 'Pending';
  dueDate: string;
  assignedTo: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
}

interface SystemSetting {
  id: string;
  category: string;
  name: string;
  description: string;
  value: string | boolean;
  type: 'text' | 'boolean' | 'number' | 'select';
  options?: string[];
}

const mockStaff: Staff[] = [
  {
    id: 'STF-001',
    name: 'Dr. Emily Chen',
    role: 'Pharmacist',
    email: 'emily.chen@pharmacy.com',
    phone: '(555) 123-4567',
    licenseNumber: 'RPH-12345',
    licenseExpiry: '2025-06-15',
    status: 'Active',
    permissions: ['Prescriptions', 'Inventory', 'Reports', 'Patient Counseling'],
    lastLogin: '2024-02-01T08:30:00Z',
    workSchedule: {
      monday: '8:00 AM - 6:00 PM',
      tuesday: '8:00 AM - 6:00 PM',
      wednesday: '8:00 AM - 6:00 PM',
      thursday: '8:00 AM - 6:00 PM',
      friday: '8:00 AM - 6:00 PM',
      saturday: 'Off',
      sunday: 'Off'
    }
  },
  {
    id: 'STF-002',
    name: 'James Wilson',
    role: 'Pharmacy Technician',
    email: 'james.wilson@pharmacy.com',
    phone: '(555) 234-5678',
    licenseNumber: 'PT-67890',
    licenseExpiry: '2024-12-31',
    status: 'Active',
    permissions: ['Inventory', 'Data Entry', 'Customer Service'],
    lastLogin: '2024-02-01T09:15:00Z',
    workSchedule: {
      monday: '9:00 AM - 5:00 PM',
      tuesday: '9:00 AM - 5:00 PM',
      wednesday: '9:00 AM - 5:00 PM',
      thursday: '9:00 AM - 5:00 PM',
      friday: '9:00 AM - 5:00 PM',
      saturday: '9:00 AM - 2:00 PM',
      sunday: 'Off'
    }
  },
  {
    id: 'STF-003',
    name: 'Sarah Martinez',
    role: 'Manager',
    email: 'sarah.martinez@pharmacy.com',
    phone: '(555) 345-6789',
    licenseNumber: 'MGR-11111',
    licenseExpiry: '2025-03-20',
    status: 'Active',
    permissions: ['All Access', 'Staff Management', 'Financial Reports', 'Compliance'],
    lastLogin: '2024-02-01T07:45:00Z',
    workSchedule: {
      monday: '7:00 AM - 7:00 PM',
      tuesday: '7:00 AM - 7:00 PM',
      wednesday: '7:00 AM - 7:00 PM',
      thursday: '7:00 AM - 7:00 PM',
      friday: '7:00 AM - 7:00 PM',
      saturday: 'Off',
      sunday: 'Off'
    }
  }
];

const mockCompliance: ComplianceItem[] = [
  {
    id: 'CMP-001',
    title: 'DEA Registration Renewal',
    type: 'License',
    status: 'Expiring Soon',
    dueDate: '2024-03-15',
    assignedTo: 'Sarah Martinez',
    description: 'Annual DEA registration renewal required for controlled substance dispensing',
    priority: 'High'
  },
  {
    id: 'CMP-002',
    title: 'HIPAA Training Completion',
    type: 'Training',
    status: 'Pending',
    dueDate: '2024-02-28',
    assignedTo: 'All Staff',
    description: 'Annual HIPAA privacy and security training for all pharmacy staff',
    priority: 'Medium'
  },
  {
    id: 'CMP-003',
    title: 'Pharmacy License Renewal',
    type: 'License',
    status: 'Compliant',
    dueDate: '2024-12-31',
    assignedTo: 'Dr. Emily Chen',
    description: 'State pharmacy license renewal',
    priority: 'Medium'
  },
  {
    id: 'CMP-004',
    title: 'Controlled Substance Audit',
    type: 'Audit',
    status: 'Pending',
    dueDate: '2024-02-15',
    assignedTo: 'James Wilson',
    description: 'Monthly controlled substance inventory audit and reconciliation',
    priority: 'High'
  }
];

const mockSettings: SystemSetting[] = [
  {
    id: 'SET-001',
    category: 'Security',
    name: 'Password Expiry Days',
    description: 'Number of days before passwords expire',
    value: 90,
    type: 'number'
  },
  {
    id: 'SET-002',
    category: 'Security',
    name: 'Two-Factor Authentication',
    description: 'Require 2FA for all user logins',
    value: true,
    type: 'boolean'
  },
  {
    id: 'SET-003',
    category: 'Workflow',
    name: 'Auto-Refill Notifications',
    description: 'Send automatic refill reminders to patients',
    value: true,
    type: 'boolean'
  },
  {
    id: 'SET-004',
    category: 'Workflow',
    name: 'Prescription Hold Time',
    description: 'Days to hold filled prescriptions before returning to stock',
    value: 14,
    type: 'number'
  },
  {
    id: 'SET-005',
    category: 'Notifications',
    name: 'Low Stock Alert Threshold',
    description: 'Inventory level that triggers low stock alerts',
    value: 10,
    type: 'number'
  }
];

const Management: React.FC = () => {
  const [staff, setStaff] = useState<Staff[]>(mockStaff);
  const [compliance, setCompliance] = useState<ComplianceItem[]>(mockCompliance);
  const [settings, setSettings] = useState<SystemSetting[]>(mockSettings);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [isAddStaffDialogOpen, setIsAddStaffDialogOpen] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
      case 'Compliant':
        return <CheckCircle className="h-4 w-4" />;
      case 'Inactive':
      case 'Expired':
        return <AlertTriangle className="h-4 w-4" />;
      case 'On Leave':
      case 'Expiring Soon':
        return <Clock className="h-4 w-4" />;
      case 'Pending':
        return <Activity className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
      case 'Compliant':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
      case 'Expired':
        return 'bg-red-100 text-red-800';
      case 'On Leave':
      case 'Expiring Soon':
        return 'bg-yellow-100 text-yellow-800';
      case 'Pending':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Pharmacist':
        return 'bg-blue-100 text-blue-800';
      case 'Manager':
        return 'bg-purple-100 text-purple-800';
      case 'Pharmacy Technician':
        return 'bg-green-100 text-green-800';
      case 'Intern':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredStaff = staff.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeStaff = staff.filter(s => s.status === 'Active').length;
  const expiringLicenses = staff.filter(s => {
    const expiryDate = new Date(s.licenseExpiry);
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    return expiryDate <= thirtyDaysFromNow;
  }).length;
  const pendingCompliance = compliance.filter(c => c.status === 'Pending' || c.status === 'Expiring Soon').length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Management</h1>
        <Dialog open={isAddStaffDialogOpen} onOpenChange={setIsAddStaffDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Staff Member
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Staff Member</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input placeholder="Enter full name" />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pharmacist">Pharmacist</SelectItem>
                    <SelectItem value="technician">Pharmacy Technician</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="intern">Intern</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input placeholder="Enter email address" />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input placeholder="Enter phone number" />
              </div>
              <div>
                <Label htmlFor="license">License Number</Label>
                <Input placeholder="Enter license number" />
              </div>
              <div>
                <Label htmlFor="expiry">License Expiry</Label>
                <Input type="date" />
              </div>
              <div className="col-span-2">
                <Label htmlFor="permissions">Permissions</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Prescriptions</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Inventory</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Reports</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Patient Counseling</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setIsAddStaffDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsAddStaffDialogOpen(false)}>
                Add Staff Member
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Staff</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeStaff}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Licenses</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expiringLicenses}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Compliance</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCompliance}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Good</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="staff" className="space-y-4">
        <TabsList>
          <TabsTrigger value="staff">Staff Management</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="settings">System Settings</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="staff" className="space-y-4">
          {/* Search */}
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search staff members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {/* Staff Table */}
          <Card>
            <CardHeader>
              <CardTitle>Staff Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Name</th>
                      <th className="text-left p-2">Role</th>
                      <th className="text-left p-2">Contact</th>
                      <th className="text-left p-2">License</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Last Login</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStaff.map((member) => (
                      <tr key={member.id} className="border-b hover:bg-gray-50">
                        <td className="p-2">
                          <div className="font-medium">{member.name}</div>
                        </td>
                        <td className="p-2">
                          <Badge className={getRoleColor(member.role)}>
                            {member.role}
                          </Badge>
                        </td>
                        <td className="p-2">
                          <div className="text-sm">
                            <div>{member.email}</div>
                            <div className="text-gray-500">{member.phone}</div>
                          </div>
                        </td>
                        <td className="p-2">
                          <div className="text-sm">
                            <div>{member.licenseNumber}</div>
                            <div className="text-gray-500">
                              Expires: {new Date(member.licenseExpiry).toLocaleDateString()}
                            </div>
                          </div>
                        </td>
                        <td className="p-2">
                          <Badge className={`${getStatusColor(member.status)} flex items-center gap-1 w-fit`}>
                            {getStatusIcon(member.status)}
                            {member.status}
                          </Badge>
                        </td>
                        <td className="p-2">
                          <div className="text-sm">
                            {new Date(member.lastLogin).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="p-2">
                          <div className="flex space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedStaff(member)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl">
                                <DialogHeader>
                                  <DialogTitle>Staff Details - {member.name}</DialogTitle>
                                </DialogHeader>
                                {selectedStaff && (
                                  <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                      <div>
                                        <h3 className="font-semibold mb-2">Personal Information</h3>
                                        <div className="space-y-2 text-sm">
                                          <div><strong>Name:</strong> {selectedStaff.name}</div>
                                          <div><strong>Role:</strong> {selectedStaff.role}</div>
                                          <div><strong>Email:</strong> {selectedStaff.email}</div>
                                          <div><strong>Phone:</strong> {selectedStaff.phone}</div>
                                          <div><strong>License:</strong> {selectedStaff.licenseNumber}</div>
                                          <div><strong>License Expiry:</strong> {new Date(selectedStaff.licenseExpiry).toLocaleDateString()}</div>
                                        </div>
                                      </div>
                                      <div>
                                        <h3 className="font-semibold mb-2">Permissions</h3>
                                        <div className="space-y-1">
                                          {selectedStaff.permissions.map((permission, index) => (
                                            <Badge key={index} variant="outline" className="mr-2 mb-1">
                                              {permission}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="space-y-4">
                                      <div>
                                        <h3 className="font-semibold mb-2">Work Schedule</h3>
                                        <div className="space-y-1 text-sm">
                                          <div><strong>Monday:</strong> {selectedStaff.workSchedule.monday}</div>
                                          <div><strong>Tuesday:</strong> {selectedStaff.workSchedule.tuesday}</div>
                                          <div><strong>Wednesday:</strong> {selectedStaff.workSchedule.wednesday}</div>
                                          <div><strong>Thursday:</strong> {selectedStaff.workSchedule.thursday}</div>
                                          <div><strong>Friday:</strong> {selectedStaff.workSchedule.friday}</div>
                                          <div><strong>Saturday:</strong> {selectedStaff.workSchedule.saturday}</div>
                                          <div><strong>Sunday:</strong> {selectedStaff.workSchedule.sunday}</div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
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
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Item</th>
                      <th className="text-left p-2">Type</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Due Date</th>
                      <th className="text-left p-2">Assigned To</th>
                      <th className="text-left p-2">Priority</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {compliance.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="p-2">
                          <div className="font-medium">{item.title}</div>
                          <div className="text-sm text-gray-500">{item.description}</div>
                        </td>
                        <td className="p-2">{item.type}</td>
                        <td className="p-2">
                          <Badge className={`${getStatusColor(item.status)} flex items-center gap-1 w-fit`}>
                            {getStatusIcon(item.status)}
                            {item.status}
                          </Badge>
                        </td>
                        <td className="p-2">{new Date(item.dueDate).toLocaleDateString()}</td>
                        <td className="p-2">{item.assignedTo}</td>
                        <td className="p-2">
                          <Badge className={getPriorityColor(item.priority)}>
                            {item.priority}
                          </Badge>
                        </td>
                        <td className="p-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {['Security', 'Workflow', 'Notifications'].map((category) => (
                  <div key={category}>
                    <h3 className="font-semibold mb-4">{category}</h3>
                    <div className="space-y-4">
                      {settings
                        .filter((setting) => setting.category === category)
                        .map((setting) => (
                          <div key={setting.id} className="flex items-center justify-between p-4 border rounded">
                            <div>
                              <div className="font-medium">{setting.name}</div>
                              <div className="text-sm text-gray-500">{setting.description}</div>
                            </div>
                            <div>
                              {setting.type === 'boolean' ? (
                                <Switch checked={setting.value as boolean} />
                              ) : (
                                <Input
                                  type={setting.type}
                                  value={setting.value as string}
                                  className="w-24"
                                />
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Two-Factor Authentication</span>
                    <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Password Policy</span>
                    <Badge className="bg-green-100 text-green-800">Strong</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Session Timeout</span>
                    <Badge className="bg-green-100 text-green-800">30 minutes</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Failed Login Attempts</span>
                    <Badge className="bg-yellow-100 text-yellow-800">3 today</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Access Control
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Active Sessions</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Admin Users</span>
                    <span className="font-medium">2</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Role-Based Access</span>
                    <Badge className="bg-green-100 text-green-800">Configured</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Audit Logging</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Management; 