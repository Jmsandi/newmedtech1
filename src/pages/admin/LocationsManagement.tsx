import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  Building2,
  Plus,
  MapPin,
  Phone,
  Mail,
  Users,
  Bed,
  Activity,
  Clock,
  ArrowUpDown,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  ArrowRightLeft,
  Settings,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Building,
  Hospital,
  Stethoscope,
  Ambulance,
  Search,
  Filter,
  Calendar,
  BarChart3
} from 'lucide-react';
import {
  getAllLocations,
  createLocation,
  updateLocation,
  deleteLocation,
  getLocationHierarchy,
  getLocationStatistics,
  getAllLocationTransfers,
  createLocationTransfer,
  approveLocationTransfer,
  completeLocationTransfer,
  getCentralizedDashboardData,
  getLocationPerformanceMetrics,
  findNearestLocationWithCapacity
} from '@/services/database/locations';
import { Location, LocationTransfer } from '@/services/database/types';
import { useNavigate } from 'react-router-dom';

const LocationsManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [locations, setLocations] = useState<Location[]>([]);
  const [transfers, setTransfers] = useState<LocationTransfer[]>([]);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const { toast } = useToast();
  const navigate = useNavigate();

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [locationsData, transfersData, dashData] = await Promise.all([
        getAllLocations(),
        getAllLocationTransfers(),
        getCentralizedDashboardData()
      ]);
      
      setLocations(locationsData);
      setTransfers(transfersData);
      setDashboardData(dashData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load locations data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // New Location Form
  const [newLocation, setNewLocation] = useState<Partial<Location>>({
    name: '',
    locationCode: '',
    locationType: 'clinic',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    contactInfo: {
      phone: '',
      email: ''
    },
    operatingHours: {
      monday: { open: '08:00', close: '18:00', isOpen: true },
      tuesday: { open: '08:00', close: '18:00', isOpen: true },
      wednesday: { open: '08:00', close: '18:00', isOpen: true },
      thursday: { open: '08:00', close: '18:00', isOpen: true },
      friday: { open: '08:00', close: '18:00', isOpen: true },
      saturday: { open: '08:00', close: '14:00', isOpen: true },
      sunday: { open: '09:00', close: '12:00', isOpen: false }
    },
    services: {
      emergency: false,
      outpatient: true,
      inpatient: false,
      surgery: false,
      icu: false,
      pediatrics: false,
      maternity: false,
      laboratory: false,
      pharmacy: false,
      radiology: false,
      cardiology: false,
      orthopedics: false,
      neurology: false,
      oncology: false,
      psychiatry: false,
      dermatology: false,
      ophthalmology: false,
      ent: false,
      dental: false,
      physiotherapy: false,
      dialysis: false,
      bloodBank: false
    },
    capacity: {
      totalBeds: 0,
      availableBeds: 0,
      icuBeds: 0,
      emergencyBeds: 0,
      operatingRooms: 0,
      outpatientRooms: 1
    },
    staffCount: {
      doctors: 0,
      nurses: 0,
      technicians: 0,
      administrators: 0,
      support: 0
    },
    equipment: {
      ctScan: false,
      mri: false,
      xRay: false,
      ultrasound: false,
      mammography: false,
      ecg: false,
      ventilators: 0,
      ambulances: 0
    },
    establishedDate: new Date().toISOString().split('T')[0],
    status: 'active'
  });

  // Transfer Form
  const [newTransfer, setNewTransfer] = useState<Partial<LocationTransfer>>({
    patientId: '',
    fromLocationId: '',
    toLocationId: '',
    transferReason: '',
    transferType: 'routine',
    transportMethod: 'ambulance',
    medicalEscort: false,
    notes: ''
  });

  const handleCreateLocation = async () => {
    try {
      if (!newLocation.name || !newLocation.locationCode) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      await createLocation(newLocation as Omit<Location, '_id'>);
      toast({
        title: "Success",
        description: "Location created successfully",
      });
      
      setIsLocationDialogOpen(false);
      setNewLocation({});
      loadData();
    } catch (error) {
      console.error('Error creating location:', error);
      toast({
        title: "Error",
        description: "Failed to create location",
        variant: "destructive",
      });
    }
  };

  const handleCreateTransfer = async () => {
    try {
      if (!newTransfer.patientId || !newTransfer.fromLocationId || !newTransfer.toLocationId) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      await createLocationTransfer({
        ...newTransfer,
        transferDate: new Date().toISOString(),
        requestedBy: 'Admin User', // Replace with actual user
        status: 'pending'
      } as Omit<LocationTransfer, '_id'>);
      
      toast({
        title: "Success",
        description: "Transfer request created successfully",
      });
      
      setIsTransferDialogOpen(false);
      setNewTransfer({});
      loadData();
    } catch (error) {
      console.error('Error creating transfer:', error);
      toast({
        title: "Error",
        description: "Failed to create transfer request",
        variant: "destructive",
      });
    }
  };

  const handleApproveTransfer = async (transferId: string) => {
    try {
      await approveLocationTransfer(transferId, 'Admin User');
      toast({
        title: "Success",
        description: "Transfer approved successfully",
      });
      loadData();
    } catch (error) {
      console.error('Error approving transfer:', error);
      toast({
        title: "Error",
        description: "Failed to approve transfer",
        variant: "destructive",
      });
    }
  };

  const handleCompleteTransfer = async (transferId: string) => {
    try {
      await completeLocationTransfer(transferId);
      toast({
        title: "Success",
        description: "Transfer completed successfully",
      });
      loadData();
    } catch (error) {
      console.error('Error completing transfer:', error);
      toast({
        title: "Error",
        description: "Failed to complete transfer",
        variant: "destructive",
      });
    }
  };

  const getLocationTypeIcon = (type: Location['locationType']) => {
    switch (type) {
      case 'main-hospital': return <Hospital className="h-4 w-4" />;
      case 'clinic': return <Building className="h-4 w-4" />;
      case 'health-center': return <Building2 className="h-4 w-4" />;
      case 'specialty-center': return <Stethoscope className="h-4 w-4" />;
      case 'branch': return <Building className="h-4 w-4" />;
      default: return <Building2 className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: Location['status']) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary"><XCircle className="h-3 w-3 mr-1" />Inactive</Badge>;
      case 'under-construction':
        return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />Under Construction</Badge>;
      case 'temporarily-closed':
        return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />Temporarily Closed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTransferStatusBadge = (status: LocationTransfer['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-blue-100 text-blue-800"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'in-transit':
        return <Badge variant="default" className="bg-orange-100 text-orange-800"><Ambulance className="h-3 w-3 mr-1" />In Transit</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Filter locations based on search and type
  const filteredLocations = locations.filter(location => {
    const matchesSearch = location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.locationCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = locationFilter === 'all' || location.locationType === locationFilter;
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-hospital-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-hospital-primary">Multi-Location Management</h1>
          <p className="text-muted-foreground">Manage multiple hospital locations, clinics, and health centers</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <ArrowRightLeft className="h-4 w-4 mr-2" />
                New Transfer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Patient Transfer</DialogTitle>
                <DialogDescription>
                  Transfer a patient between locations
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Patient ID</Label>
                  <Input
                    value={newTransfer.patientId || ''}
                    onChange={(e) => setNewTransfer({...newTransfer, patientId: e.target.value})}
                    placeholder="Enter patient ID"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Transfer Type</Label>
                  <Select value={newTransfer.transferType} onValueChange={(value) => setNewTransfer({...newTransfer, transferType: value as any})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="emergency">Emergency</SelectItem>
                      <SelectItem value="routine">Routine</SelectItem>
                      <SelectItem value="specialty-care">Specialty Care</SelectItem>
                      <SelectItem value="capacity">Capacity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>From Location</Label>
                  <Select value={newTransfer.fromLocationId} onValueChange={(value) => setNewTransfer({...newTransfer, fromLocationId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location._id} value={location._id}>
                          {location.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>To Location</Label>
                  <Select value={newTransfer.toLocationId} onValueChange={(value) => setNewTransfer({...newTransfer, toLocationId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location._id} value={location._id}>
                          {location.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Transport Method</Label>
                  <Select value={newTransfer.transportMethod} onValueChange={(value) => setNewTransfer({...newTransfer, transportMethod: value as any})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ambulance">Ambulance</SelectItem>
                      <SelectItem value="private">Private Vehicle</SelectItem>
                      <SelectItem value="public">Public Transport</SelectItem>
                      <SelectItem value="air-transport">Air Transport</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Medical Escort Required</Label>
                  <Switch
                    checked={newTransfer.medicalEscort}
                    onCheckedChange={(checked) => setNewTransfer({...newTransfer, medicalEscort: checked})}
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Transfer Reason</Label>
                  <Textarea
                    value={newTransfer.transferReason || ''}
                    onChange={(e) => setNewTransfer({...newTransfer, transferReason: e.target.value})}
                    placeholder="Reason for transfer"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    value={newTransfer.notes || ''}
                    onChange={(e) => setNewTransfer({...newTransfer, notes: e.target.value})}
                    placeholder="Additional notes"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsTransferDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTransfer}>
                  Create Transfer
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline" onClick={() => navigate('/admin/hospital-registration')}>
            <Hospital className="h-4 w-4 mr-2" />
            Register Hospital
          </Button>

          <Dialog open={isLocationDialogOpen} onOpenChange={setIsLocationDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Location
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Location</DialogTitle>
                <DialogDescription>
                  Create a new hospital, clinic, or health center location
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Location Name *</Label>
                    <Input
                      value={newLocation.name || ''}
                      onChange={(e) => setNewLocation({...newLocation, name: e.target.value})}
                      placeholder="Enter location name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Location Code *</Label>
                    <Input
                      value={newLocation.locationCode || ''}
                      onChange={(e) => setNewLocation({...newLocation, locationCode: e.target.value})}
                      placeholder="Unique location code"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Location Type</Label>
                    <Select value={newLocation.locationType} onValueChange={(value) => setNewLocation({...newLocation, locationType: value as any})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="main-hospital">Main Hospital</SelectItem>
                        <SelectItem value="clinic">Clinic</SelectItem>
                        <SelectItem value="health-center">Health Center</SelectItem>
                        <SelectItem value="specialty-center">Specialty Center</SelectItem>
                        <SelectItem value="branch">Branch Office</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Parent Location</Label>
                    <Select value={newLocation.parentLocationId} onValueChange={(value) => setNewLocation({...newLocation, parentLocationId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select parent location (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((location) => (
                          <SelectItem key={location._id} value={location._id}>
                            {location.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Address Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Address Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Street Address</Label>
                      <Input
                        value={newLocation.address?.street || ''}
                        onChange={(e) => setNewLocation({
                          ...newLocation,
                          address: {...newLocation.address, street: e.target.value}
                        })}
                        placeholder="Street address"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>City</Label>
                      <Input
                        value={newLocation.address?.city || ''}
                        onChange={(e) => setNewLocation({
                          ...newLocation,
                          address: {...newLocation.address, city: e.target.value}
                        })}
                        placeholder="City"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>State</Label>
                      <Input
                        value={newLocation.address?.state || ''}
                        onChange={(e) => setNewLocation({
                          ...newLocation,
                          address: {...newLocation.address, state: e.target.value}
                        })}
                        placeholder="State"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>ZIP Code</Label>
                      <Input
                        value={newLocation.address?.zipCode || ''}
                        onChange={(e) => setNewLocation({
                          ...newLocation,
                          address: {...newLocation.address, zipCode: e.target.value}
                        })}
                        placeholder="ZIP code"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Contact Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <Input
                        value={newLocation.contactInfo?.phone || ''}
                        onChange={(e) => setNewLocation({
                          ...newLocation,
                          contactInfo: {...newLocation.contactInfo, phone: e.target.value}
                        })}
                        placeholder="Phone number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        value={newLocation.contactInfo?.email || ''}
                        onChange={(e) => setNewLocation({
                          ...newLocation,
                          contactInfo: {...newLocation.contactInfo, email: e.target.value}
                        })}
                        placeholder="Email address"
                      />
                    </div>
                  </div>
                </div>

                {/* Capacity Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Capacity Information</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Total Beds</Label>
                      <Input
                        type="number"
                        value={newLocation.capacity?.totalBeds || 0}
                        onChange={(e) => setNewLocation({
                          ...newLocation,
                          capacity: {...newLocation.capacity, totalBeds: parseInt(e.target.value) || 0}
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>ICU Beds</Label>
                      <Input
                        type="number"
                        value={newLocation.capacity?.icuBeds || 0}
                        onChange={(e) => setNewLocation({
                          ...newLocation,
                          capacity: {...newLocation.capacity, icuBeds: parseInt(e.target.value) || 0}
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Operating Rooms</Label>
                      <Input
                        type="number"
                        value={newLocation.capacity?.operatingRooms || 0}
                        onChange={(e) => setNewLocation({
                          ...newLocation,
                          capacity: {...newLocation.capacity, operatingRooms: parseInt(e.target.value) || 0}
                        })}
                      />
                    </div>
                  </div>
                </div>

                {/* Services */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Available Services</h3>
                  <div className="grid grid-cols-4 gap-4">
                    {Object.entries(newLocation.services || {}).map(([service, enabled]) => (
                      <div key={service} className="flex items-center space-x-2">
                        <Switch
                          checked={enabled}
                          onCheckedChange={(checked) => setNewLocation({
                            ...newLocation,
                            services: {...newLocation.services, [service]: checked}
                          })}
                        />
                        <Label className="text-sm capitalize">
                          {service.replace(/([A-Z])/g, ' $1').trim()}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsLocationDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateLocation}>
                  Create Location
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="transfers">Transfers</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {dashboardData && (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Locations</CardTitle>
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardData.summary.totalLocations}</div>
                    <p className="text-xs text-muted-foreground">Active healthcare facilities</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Transfers</CardTitle>
                    <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardData.summary.pendingTransfers}</div>
                    <p className="text-xs text-muted-foreground">Awaiting approval</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Beds</CardTitle>
                    <Bed className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardData.capacity.totalBeds}</div>
                    <p className="text-xs text-muted-foreground">{dashboardData.capacity.occupancyRate}% occupied</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">System Health</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold capitalize">{dashboardData.summary.systemHealth}</div>
                    <p className="text-xs text-muted-foreground">All systems operational</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Transfers */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transfers</CardTitle>
                  <CardDescription>Latest patient transfers between locations</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient</TableHead>
                        <TableHead>From</TableHead>
                        <TableHead>To</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dashboardData.recentTransfers.map((transfer: LocationTransfer) => {
                        const fromLocation = locations.find(l => l._id === transfer.fromLocationId);
                        const toLocation = locations.find(l => l._id === transfer.toLocationId);
                        return (
                          <TableRow key={transfer._id}>
                            <TableCell className="font-medium">{transfer.patientId}</TableCell>
                            <TableCell>{fromLocation?.name || 'Unknown'}</TableCell>
                            <TableCell>{toLocation?.name || 'Unknown'}</TableCell>
                            <TableCell className="capitalize">{transfer.transferType}</TableCell>
                            <TableCell>{getTransferStatusBadge(transfer.status)}</TableCell>
                            <TableCell>{new Date(transfer.createdAt).toLocaleDateString()}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="locations" className="space-y-6">
          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="main-hospital">Main Hospital</SelectItem>
                <SelectItem value="clinic">Clinic</SelectItem>
                <SelectItem value="health-center">Health Center</SelectItem>
                <SelectItem value="specialty-center">Specialty Center</SelectItem>
                <SelectItem value="branch">Branch Office</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Locations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLocations.map((location) => (
              <Card key={location._id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getLocationTypeIcon(location.locationType)}
                      <CardTitle className="text-lg">{location.name}</CardTitle>
                    </div>
                    {getStatusBadge(location.status)}
                  </div>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {location.address.city}, {location.address.state}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="capitalize">{location.locationType.replace('-', ' ')}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Total Beds:</span>
                      <span>{location.capacity.totalBeds}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Available:</span>
                      <span className="text-green-600">{location.capacity.availableBeds}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <span>{location.contactInfo.phone}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <span className="truncate">{location.contactInfo.email}</span>
                    </div>
                    
                    {/* Key Services */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {Object.entries(location.services)
                        .filter(([_, enabled]) => enabled)
                        .slice(0, 3)
                        .map(([service]) => (
                          <Badge key={service} variant="outline" className="text-xs">
                            {service.replace(/([A-Z])/g, ' $1').trim()}
                          </Badge>
                        ))}
                      {Object.values(location.services).filter(Boolean).length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{Object.values(location.services).filter(Boolean).length - 3} more
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="transfers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Patient Transfers</CardTitle>
              <CardDescription>Manage patient transfers between locations</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient ID</TableHead>
                    <TableHead>From Location</TableHead>
                    <TableHead>To Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Requested By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transfers.map((transfer) => {
                    const fromLocation = locations.find(l => l._id === transfer.fromLocationId);
                    const toLocation = locations.find(l => l._id === transfer.toLocationId);
                    return (
                      <TableRow key={transfer._id}>
                        <TableCell className="font-medium">{transfer.patientId}</TableCell>
                        <TableCell>{fromLocation?.name || 'Unknown'}</TableCell>
                        <TableCell>{toLocation?.name || 'Unknown'}</TableCell>
                        <TableCell className="capitalize">{transfer.transferType}</TableCell>
                        <TableCell>{getTransferStatusBadge(transfer.status)}</TableCell>
                        <TableCell>{transfer.requestedBy}</TableCell>
                        <TableCell>{new Date(transfer.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {transfer.status === 'pending' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleApproveTransfer(transfer._id)}
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Approve
                              </Button>
                            )}
                            {transfer.status === 'approved' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCompleteTransfer(transfer._id)}
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Complete
                              </Button>
                            )}
                            <Button size="sm" variant="ghost">
                              <Eye className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Location Performance</CardTitle>
                <CardDescription>Performance metrics across all locations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {locations.slice(0, 5).map((location) => (
                    <div key={location._id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{location.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {location.capacity.totalBeds} beds • {location.locationType}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {(((location.capacity.totalBeds - location.capacity.availableBeds) / location.capacity.totalBeds) * 100).toFixed(1)}%
                        </p>
                        <p className="text-sm text-muted-foreground">Occupancy</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Transfer Statistics</CardTitle>
                <CardDescription>Patient transfer analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Total Transfers (30 days)</span>
                    <span className="font-medium">{transfers.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Pending Approvals</span>
                    <span className="font-medium text-orange-600">
                      {transfers.filter(t => t.status === 'pending').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Completed</span>
                    <span className="font-medium text-green-600">
                      {transfers.filter(t => t.status === 'completed').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Emergency Transfers</span>
                    <span className="font-medium text-red-600">
                      {transfers.filter(t => t.transferType === 'emergency').length}
                    </span>
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

export default LocationsManagement; 