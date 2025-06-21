import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  Calendar,
  MapPin,
  User,
  Clock,
  Heart,
  Activity
} from "lucide-react";

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  insuranceProvider: string;
  lastVisit: string;
  nextAppointment?: string;
  status: "Active" | "Inactive" | "Emergency";
  medicalHistory: string[];
  avatar?: string;
}

const mockPatients: Patient[] = [
  {
    id: "PT001",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    dateOfBirth: "1985-03-15",
    gender: "Female",
    address: "123 Main St, Springfield, IL 62701",
    insuranceProvider: "Blue Cross Blue Shield",
    lastVisit: "2024-01-15",
    nextAppointment: "2024-02-10",
    status: "Active",
    medicalHistory: ["Hypertension", "Type 2 Diabetes"],
  },
  {
    id: "PT002",
    name: "Michael Chen",
    email: "michael.chen@email.com",
    phone: "+1 (555) 234-5678",
    dateOfBirth: "1992-07-22",
    gender: "Male",
    address: "456 Oak Ave, Springfield, IL 62702",
    insuranceProvider: "Aetna",
    lastVisit: "2024-01-20",
    status: "Active",
    medicalHistory: ["Asthma"],
  },
  {
    id: "PT003",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@email.com",
    phone: "+1 (555) 345-6789",
    dateOfBirth: "1978-11-08",
    gender: "Female",
    address: "789 Pine St, Springfield, IL 62703",
    insuranceProvider: "Cigna",
    lastVisit: "2024-01-18",
    nextAppointment: "2024-02-05",
    status: "Active",
    medicalHistory: ["High Cholesterol", "Arthritis"],
  },
  {
    id: "PT004",
    name: "David Wilson",
    email: "david.wilson@email.com",
    phone: "+1 (555) 456-7890",
    dateOfBirth: "1965-12-25",
    gender: "Male",
    address: "321 Elm St, Springfield, IL 62704",
    insuranceProvider: "Medicare",
    lastVisit: "2024-01-12",
    status: "Emergency",
    medicalHistory: ["Heart Disease", "Stroke History"],
  },
  {
    id: "PT005",
    name: "Lisa Thompson",
    email: "lisa.thompson@email.com",
    phone: "+1 (555) 567-8901",
    dateOfBirth: "1990-05-18",
    gender: "Female",
    address: "654 Maple Dr, Springfield, IL 62705",
    insuranceProvider: "United Healthcare",
    lastVisit: "2024-01-25",
    status: "Inactive",
    medicalHistory: ["Allergies"],
  },
];

export default function Patients() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const filteredPatients = mockPatients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "All" || patient.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "Emergency": return "bg-red-100 text-red-800";
      case "Inactive": return "bg-gray-100 text-gray-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patient Management</h1>
          <p className="text-gray-600">Manage and view patient information</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>
            <User className="w-4 h-4 mr-2" />
            Add New Patient
          </Button>
        </div>
      </div>

      <Tabs value={selectedPatient ? "details" : "list"} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list" onClick={() => setSelectedPatient(null)}>
            Patient List
          </TabsTrigger>
          <TabsTrigger value="details" disabled={!selectedPatient}>
            Patient Details
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {/* Search and Filter Section */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search patients by name, ID, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="All">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Patient Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">Total Patients</p>
                    <p className="text-2xl font-bold">{mockPatients.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">Active</p>
                    <p className="text-2xl font-bold">{mockPatients.filter(p => p.status === "Active").length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-600">Emergency</p>
                    <p className="text-2xl font-bold">{mockPatients.filter(p => p.status === "Emergency").length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Inactive</p>
                    <p className="text-2xl font-bold">{mockPatients.filter(p => p.status === "Inactive").length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Patient List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPatients.map((patient) => (
              <Card 
                key={patient.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedPatient(patient)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Avatar>
                      <AvatarImage src={patient.avatar} />
                      <AvatarFallback>
                        {patient.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                        <Badge className={getStatusColor(patient.status)}>
                          {patient.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{patient.id}</p>
                      <p className="text-sm text-gray-600">Age: {calculateAge(patient.dateOfBirth)}</p>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Phone className="w-3 h-3" />
                          <span>{patient.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Calendar className="w-3 h-3" />
                          <span>Last visit: {new Date(patient.lastVisit).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          {selectedPatient && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Patient Information */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Patient Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={selectedPatient.avatar} />
                        <AvatarFallback className="text-xl">
                          {selectedPatient.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="text-2xl font-bold">{selectedPatient.name}</h2>
                        <p className="text-gray-600">{selectedPatient.id}</p>
                        <Badge className={getStatusColor(selectedPatient.status)}>
                          {selectedPatient.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                        <p className="text-gray-900">{new Date(selectedPatient.dateOfBirth).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Age</label>
                        <p className="text-gray-900">{calculateAge(selectedPatient.dateOfBirth)} years</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Gender</label>
                        <p className="text-gray-900">{selectedPatient.gender}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Insurance</label>
                        <p className="text-gray-900">{selectedPatient.insuranceProvider}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{selectedPatient.phone}</p>
                        <p className="text-sm text-gray-600">Primary Phone</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{selectedPatient.email}</p>
                        <p className="text-sm text-gray-600">Email Address</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                      <div>
                        <p className="font-medium">{selectedPatient.address}</p>
                        <p className="text-sm text-gray-600">Home Address</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Medical History & Appointments */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Medical History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedPatient.medicalHistory.map((condition, index) => (
                        <Badge key={index} variant="outline" className="mr-2">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Appointments</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Last Visit</label>
                      <p className="text-gray-900">{new Date(selectedPatient.lastVisit).toLocaleDateString()}</p>
                    </div>
                    {selectedPatient.nextAppointment && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Next Appointment</label>
                        <p className="text-gray-900">{new Date(selectedPatient.nextAppointment).toLocaleDateString()}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button className="w-full" variant="outline">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Appointment
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Phone className="w-4 h-4 mr-2" />
                      Call Patient
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Mail className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 