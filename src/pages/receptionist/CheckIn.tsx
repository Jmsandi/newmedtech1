import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  CheckCircle, 
  Clock, 
  Search, 
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  AlertTriangle,
  FileText,
  IdCard,
  CreditCard,
  Stethoscope,
  UserCheck,
  Timer,
  Eye
} from "lucide-react";

interface Appointment {
  id: string;
  time: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  appointmentType: string;
  status: "Scheduled" | "Checked In" | "In Progress" | "Completed" | "No Show";
  insurance?: {
    provider: string;
    policyNumber: string;
    groupNumber: string;
  };
  contactInfo: {
    phone: string;
    email: string;
    address: string;
  };
  checkinTime?: string;
  notes?: string;
}

const mockAppointments: Appointment[] = [
  {
    id: "APT001",
    time: "09:00",
    patientName: "Sarah Johnson",
    patientId: "PT001",
    doctorName: "Dr. Smith",
    appointmentType: "Follow-up",
    status: "Scheduled",
    insurance: {
      provider: "Blue Cross Blue Shield",
      policyNumber: "BC123456789",
      groupNumber: "GRP001"
    },
    contactInfo: {
      phone: "(555) 123-4567",
      email: "sarah.johnson@email.com",
      address: "123 Main St, City, State 12345"
    }
  },
  {
    id: "APT002",
    time: "09:30",
    patientName: "Michael Chen",
    patientId: "PT002",
    doctorName: "Dr. Wilson",
    appointmentType: "Consultation",
    status: "Checked In",
    checkinTime: "09:25",
    insurance: {
      provider: "Aetna",
      policyNumber: "AE987654321",
      groupNumber: "GRP002"
    },
    contactInfo: {
      phone: "(555) 234-5678",
      email: "michael.chen@email.com",
      address: "456 Oak Ave, City, State 12345"
    }
  },
  {
    id: "APT003",
    time: "10:00",
    patientName: "Emma Davis",
    patientId: "PT003",
    doctorName: "Dr. Brown",
    appointmentType: "Annual Physical",
    status: "In Progress",
    checkinTime: "09:55",
    insurance: {
      provider: "United Healthcare",
      policyNumber: "UH456789123",
      groupNumber: "GRP003"
    },
    contactInfo: {
      phone: "(555) 345-6789",
      email: "emma.davis@email.com",
      address: "789 Pine Rd, City, State 12345"
    },
    notes: "Patient arrived early, vitals taken"
  },
  {
    id: "APT004",
    time: "10:30",
    patientName: "Robert Wilson",
    patientId: "PT004",
    doctorName: "Dr. Smith",
    appointmentType: "Sick Visit",
    status: "Scheduled",
    insurance: {
      provider: "Medicare",
      policyNumber: "MC789123456",
      groupNumber: "GRP004"
    },
    contactInfo: {
      phone: "(555) 456-7890",
      email: "robert.wilson@email.com",
      address: "321 Elm St, City, State 12345"
    }
  },
  {
    id: "APT005",
    time: "11:00",
    patientName: "Lisa Thompson",
    patientId: "PT005",
    doctorName: "Dr. Johnson",
    appointmentType: "Preventive Care",
    status: "Completed",
    checkinTime: "10:50",
    contactInfo: {
      phone: "(555) 567-8901",
      email: "lisa.thompson@email.com",
      address: "654 Maple Dr, City, State 12345"
    },
    notes: "Vaccination administered, next appointment scheduled"
  }
];

export default function CheckIn() {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [checkinNotes, setCheckinNotes] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "bg-blue-100 text-blue-800";
      case "Checked In":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-yellow-100 text-yellow-800";
      case "Completed":
        return "bg-gray-100 text-gray-800";
      case "No Show":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Scheduled":
        return <Calendar className="w-4 h-4 text-blue-600" />;
      case "Checked In":
        return <UserCheck className="w-4 h-4 text-green-600" />;
      case "In Progress":
        return <Stethoscope className="w-4 h-4 text-yellow-600" />;
      case "Completed":
        return <CheckCircle className="w-4 h-4 text-gray-600" />;
      case "No Show":
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || appointment.status.toLowerCase().replace(" ", "-") === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleCheckIn = (appointmentId: string) => {
    setAppointments(prev =>
      prev.map(apt =>
        apt.id === appointmentId
          ? { ...apt, status: "Checked In" as const, checkinTime: new Date().toLocaleTimeString() }
          : apt
      )
    );
  };

  const handleStatusUpdate = (appointmentId: string, newStatus: Appointment["status"]) => {
    setAppointments(prev =>
      prev.map(apt =>
        apt.id === appointmentId ? { ...apt, status: newStatus } : apt
      )
    );
  };

  const handleAddNotes = (appointmentId: string, notes: string) => {
    setAppointments(prev =>
      prev.map(apt =>
        apt.id === appointmentId ? { ...apt, notes } : apt
      )
    );
    setCheckinNotes("");
    setSelectedAppointment(null);
  };

  const stats = {
    total: appointments.length,
    scheduled: appointments.filter(apt => apt.status === "Scheduled").length,
    checkedIn: appointments.filter(apt => apt.status === "Checked In").length,
    inProgress: appointments.filter(apt => apt.status === "In Progress").length,
    completed: appointments.filter(apt => apt.status === "Completed").length,
    noShow: appointments.filter(apt => apt.status === "No Show").length
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patient Check-In</h1>
          <p className="text-gray-600">Manage today's appointments and patient check-in process</p>
        </div>
        <div className="text-lg font-medium text-gray-700">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Appointment Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-blue-600">{stats.total}</h3>
              <p className="text-sm text-gray-600">Total</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-blue-500">{stats.scheduled}</h3>
              <p className="text-sm text-gray-600">Scheduled</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-green-600">{stats.checkedIn}</h3>
              <p className="text-sm text-gray-600">Checked In</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-yellow-600">{stats.inProgress}</h3>
              <p className="text-sm text-gray-600">In Progress</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-600">{stats.completed}</h3>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-red-600">{stats.noShow}</h3>
              <p className="text-sm text-gray-600">No Show</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by patient name, ID, or doctor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="checked-in">Checked In</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="no-show">No Show</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Check-In Tabs */}
      <Tabs defaultValue="appointments">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="appointments">Today's Appointments</TabsTrigger>
          <TabsTrigger value="checkin">Check-In Process</TabsTrigger>
        </TabsList>

        <TabsContent value="appointments" className="mt-6">
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <Card key={appointment.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 p-3 rounded-full">
                        <User className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {appointment.patientName}
                        </h3>
                        <p className="text-sm text-gray-600">ID: {appointment.patientId}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{appointment.time}</span>
                          <span className="text-sm text-gray-400">•</span>
                          <span className="text-sm text-gray-600">{appointment.doctorName}</span>
                          <span className="text-sm text-gray-400">•</span>
                          <span className="text-sm text-gray-600">{appointment.appointmentType}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={getStatusColor(appointment.status)}>
                        {getStatusIcon(appointment.status)}
                        <span className="ml-1">{appointment.status}</span>
                      </Badge>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{appointment.contactInfo.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{appointment.contactInfo.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{appointment.contactInfo.address}</span>
                    </div>
                  </div>

                  {/* Insurance Information */}
                  {appointment.insurance && (
                    <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                        <CreditCard className="w-4 h-4 mr-2" />
                        Insurance Information
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                        <div><strong>Provider:</strong> {appointment.insurance.provider}</div>
                        <div><strong>Policy:</strong> {appointment.insurance.policyNumber}</div>
                        <div><strong>Group:</strong> {appointment.insurance.groupNumber}</div>
                      </div>
                    </div>
                  )}

                  {/* Check-in Time and Notes */}
                  {appointment.checkinTime && (
                    <div className="mb-4 p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-800">
                        <Timer className="w-4 h-4 inline mr-1" />
                        <strong>Checked in at:</strong> {appointment.checkinTime}
                      </p>
                    </div>
                  )}

                  {appointment.notes && (
                    <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <FileText className="w-4 h-4 inline mr-1" />
                        <strong>Notes:</strong> {appointment.notes}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end space-x-2 pt-4 border-t border-gray-200">
                    {appointment.status === "Scheduled" && (
                      <Button
                        onClick={() => handleCheckIn(appointment.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <UserCheck className="w-4 h-4 mr-2" />
                        Check In
                      </Button>
                    )}
                    
                    {appointment.status === "Checked In" && (
                      <Button
                        onClick={() => handleStatusUpdate(appointment.id, "In Progress")}
                        className="bg-yellow-600 hover:bg-yellow-700"
                      >
                        <Stethoscope className="w-4 h-4 mr-2" />
                        Start Visit
                      </Button>
                    )}
                    
                    {appointment.status === "In Progress" && (
                      <Button
                        onClick={() => handleStatusUpdate(appointment.id, "Completed")}
                        className="bg-gray-600 hover:bg-gray-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Complete Visit
                      </Button>
                    )}
                    
                    {appointment.status === "Scheduled" && (
                      <Button
                        variant="outline"
                        onClick={() => handleStatusUpdate(appointment.id, "No Show")}
                      >
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Mark No Show
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      onClick={() => setSelectedAppointment(appointment)}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Add Notes
                    </Button>
                    
                    <Button variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredAppointments.length === 0 && (
              <Card>
                <CardContent className="text-center py-20">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
                  <p className="text-gray-600">
                    No appointments match the current search and filter criteria.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="checkin" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Check-In Process</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Patient Verification</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                        <IdCard className="w-5 h-5 text-blue-600" />
                        <span className="text-sm">Verify patient identity with ID</span>
                      </div>
                      <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                        <User className="w-5 h-5 text-blue-600" />
                        <span className="text-sm">Confirm personal information</span>
                      </div>
                      <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                        <span className="text-sm">Validate insurance coverage</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Check-In Steps</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm">Update contact information</span>
                      </div>
                      <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
                        <FileText className="w-5 h-5 text-green-600" />
                        <span className="text-sm">Review forms and consent</span>
                      </div>
                      <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
                        <Clock className="w-5 h-5 text-green-600" />
                        <span className="text-sm">Note arrival time</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="font-medium text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="outline" className="justify-start h-auto p-4">
                      <div className="text-left">
                        <div className="font-medium">Print Forms</div>
                        <p className="text-sm text-gray-600">Print required paperwork</p>
                      </div>
                    </Button>
                    <Button variant="outline" className="justify-start h-auto p-4">
                      <div className="text-left">
                        <div className="font-medium">Insurance Verification</div>
                        <p className="text-sm text-gray-600">Verify coverage status</p>
                      </div>
                    </Button>
                    <Button variant="outline" className="justify-start h-auto p-4">
                      <div className="text-left">
                        <div className="font-medium">Update Information</div>
                        <p className="text-sm text-gray-600">Edit patient details</p>
                      </div>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Notes Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Add Notes - {selectedAppointment.patientName}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder="Enter check-in notes..."
                  value={checkinNotes}
                  onChange={(e) => setCheckinNotes(e.target.value)}
                  rows={4}
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedAppointment(null);
                      setCheckinNotes("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleAddNotes(selectedAppointment.id, checkinNotes)}
                    disabled={!checkinNotes.trim()}
                  >
                    Save Notes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 