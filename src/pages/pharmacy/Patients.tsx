import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, Users, Eye, FileText, Pill, Calendar, Phone, Mail, MapPin
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Mock data for patients
const mockPatients = [
  { 
    id: 1, 
    name: "John Doe", 
    patientId: "P001", 
    age: 45, 
    gender: "Male", 
    phone: "+1-555-0123", 
    email: "john.doe@email.com",
    address: "123 Main St, City, State 12345",
    lastVisit: "2025-05-01", 
    activePrescriptions: 3, 
    allergies: ["Penicillin", "Sulfa"],
    chronicConditions: ["Hypertension", "Diabetes Type 2"],
    insuranceProvider: "HealthCare Plus"
  },
  { 
    id: 2, 
    name: "Jane Smith", 
    patientId: "P002", 
    age: 32, 
    gender: "Female", 
    phone: "+1-555-0124", 
    email: "jane.smith@email.com",
    address: "456 Oak Ave, City, State 12345",
    lastVisit: "2025-04-30", 
    activePrescriptions: 1, 
    allergies: ["Latex"],
    chronicConditions: ["Asthma"],
    insuranceProvider: "MediCare Pro"
  },
  { 
    id: 3, 
    name: "Bob Johnson", 
    patientId: "P003", 
    age: 58, 
    gender: "Male", 
    phone: "+1-555-0125", 
    email: "bob.johnson@email.com",
    address: "789 Pine St, City, State 12345",
    lastVisit: "2025-04-28", 
    activePrescriptions: 5, 
    allergies: ["None Known"],
    chronicConditions: ["High Cholesterol", "Arthritis"],
    insuranceProvider: "Universal Health"
  },
  { 
    id: 4, 
    name: "Mary Williams", 
    patientId: "P004", 
    age: 28, 
    gender: "Female", 
    phone: "+1-555-0126", 
    email: "mary.williams@email.com",
    address: "321 Elm St, City, State 12345",
    lastVisit: "2025-05-02", 
    activePrescriptions: 2, 
    allergies: ["Shellfish"],
    chronicConditions: ["Migraine"],
    insuranceProvider: "HealthCare Plus"
  },
  { 
    id: 5, 
    name: "James Brown", 
    patientId: "P005", 
    age: 41, 
    gender: "Male", 
    phone: "+1-555-0127", 
    email: "james.brown@email.com",
    address: "654 Maple Ave, City, State 12345",
    lastVisit: "2025-04-25", 
    activePrescriptions: 1, 
    allergies: ["Iodine"],
    chronicConditions: ["None"],
    insuranceProvider: "MediCare Pro"
  }
];

// Mock medication history
const mockMedicationHistory = {
  1: [
    { medication: "Lisinopril 10mg", prescribedDate: "2025-04-15", status: "Active", refillsRemaining: 2 },
    { medication: "Metformin 850mg", prescribedDate: "2025-04-15", status: "Active", refillsRemaining: 1 },
    { medication: "Atorvastatin 20mg", prescribedDate: "2025-03-20", status: "Completed", refillsRemaining: 0 }
  ],
  2: [
    { medication: "Salbutamol 100mcg", prescribedDate: "2025-04-20", status: "Active", refillsRemaining: 3 }
  ],
  3: [
    { medication: "Simvastatin 20mg", prescribedDate: "2025-04-10", status: "Active", refillsRemaining: 2 },
    { medication: "Ibuprofen 400mg", prescribedDate: "2025-04-25", status: "Active", refillsRemaining: 0 },
    { medication: "Glucosamine 500mg", prescribedDate: "2025-03-15", status: "Active", refillsRemaining: 1 }
  ]
};

const Patients = () => {
  const [patients, setPatients] = useState(mockPatients);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPatients = patients.length;
  const activePrescriptionsTotal = patients.reduce((sum, patient) => sum + patient.activePrescriptions, 0);
  const patientsWithAllergies = patients.filter(p => p.allergies.length > 0 && !p.allergies.includes("None Known")).length;

  const handleViewPatient = (patient: any) => {
    setSelectedPatient(patient);
    setIsDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patient Management</h1>
          <p className="text-gray-600">Manage patient information and medication history</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPatients}</div>
            <p className="text-xs text-muted-foreground">Registered patients</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Prescriptions</CardTitle>
            <Pill className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{activePrescriptionsTotal}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patients with Allergies</CardTitle>
            <FileText className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{patientsWithAllergies}</div>
            <p className="text-xs text-muted-foreground">Require special attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Visits</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {patients.filter(p => new Date(p.lastVisit) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
            </div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
      </div>

      {/* Patient List */}
      <Card>
        <CardHeader>
          <CardTitle>Patient Directory</CardTitle>
          <CardDescription>Search and view patient information and medication history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search patients by name, ID, or email..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Age/Gender</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Last Visit</TableHead>
                  <TableHead>Active Prescriptions</TableHead>
                  <TableHead>Allergies</TableHead>
                  <TableHead>Insurance</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{patient.name}</p>
                        <p className="text-sm text-muted-foreground">{patient.patientId}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p>{patient.age} years</p>
                        <p className="text-sm text-muted-foreground">{patient.gender}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{patient.phone}</p>
                        <p className="text-sm text-muted-foreground">{patient.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{patient.lastVisit}</TableCell>
                    <TableCell>
                      <Badge className="bg-blue-100 text-blue-800">
                        {patient.activePrescriptions} active
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {patient.allergies.slice(0, 2).map((allergy, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {allergy}
                          </Badge>
                        ))}
                        {patient.allergies.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{patient.allergies.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{patient.insuranceProvider}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewPatient(patient)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Patient Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Patient Details - {selectedPatient?.name}</DialogTitle>
            <DialogDescription>
              Complete patient information and medication history
            </DialogDescription>
          </DialogHeader>
          
          {selectedPatient && (
            <div className="grid gap-6 py-4">
              {/* Patient Info */}
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedPatient.name} ({selectedPatient.patientId})</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedPatient.age} years old, {selectedPatient.gender}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedPatient.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedPatient.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedPatient.address}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Medical Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="font-medium text-sm">Allergies:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedPatient.allergies.map((allergy: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {allergy}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Chronic Conditions:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedPatient.chronicConditions.map((condition: string, index: number) => (
                          <Badge key={index} className="bg-blue-100 text-blue-800 text-xs">
                            {condition}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Insurance:</p>
                      <p className="text-sm text-muted-foreground">{selectedPatient.insuranceProvider}</p>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Last Visit:</p>
                      <p className="text-sm text-muted-foreground">{selectedPatient.lastVisit}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Medication History */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Medication History</CardTitle>
                </CardHeader>
                <CardContent>
                  {mockMedicationHistory[selectedPatient.id as keyof typeof mockMedicationHistory] ? (
                    <div className="space-y-3">
                      {mockMedicationHistory[selectedPatient.id as keyof typeof mockMedicationHistory].map((med, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{med.medication}</p>
                            <p className="text-sm text-muted-foreground">Prescribed: {med.prescribedDate}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(med.status)}>
                              {med.status}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {med.refillsRemaining} refills left
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No medication history available</p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Patients; 