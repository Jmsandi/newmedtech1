import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Users, Search, UserPlus, Edit, MessageSquare, Phone, MapPin, UserCheck, Calendar, Activity, FileText, AlertTriangle, Clock, Pill, ClipboardList } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data for nurses
const mockNurses = [
  { 
    id: 1, 
    name: "Rachel Greene", 
    specialization: "Pediatric", 
    ward: "Children's Ward", 
    shift: "Morning", 
    contactNumber: "123-456-7890", 
    experience: "5 years",
    assignedPatients: ["P001", "P002", "P005"],
    maxPatients: 6
  },
  { 
    id: 2, 
    name: "Jessica Chen", 
    specialization: "ICU", 
    ward: "Intensive Care", 
    shift: "Night", 
    contactNumber: "234-567-8901", 
    experience: "8 years",
    assignedPatients: ["P003", "P004"],
    maxPatients: 4
  },
  { 
    id: 3, 
    name: "Marcus Johnson", 
    specialization: "General", 
    ward: "General Ward", 
    shift: "Evening", 
    contactNumber: "345-678-9012", 
    experience: "3 years",
    assignedPatients: [],
    maxPatients: 5
  },
  { 
    id: 4, 
    name: "Sophia Martinez", 
    specialization: "Emergency", 
    ward: "Emergency Room", 
    shift: "Rotating", 
    contactNumber: "456-789-0123", 
    experience: "6 years",
    assignedPatients: ["P006"],
    maxPatients: 8
  }
];

// Mock data for patients
const initialPatients = [
  {
    id: "P001",
    name: "James Wilson",
    age: 45,
    gender: "Male",
    condition: "Hypertension",
    severity: "Moderate",
    lastVisit: "2024-01-15",
    nextAppointment: "2024-01-22",
    status: "Active",
    contact: "+1 (555) 123-4567",
    address: "123 Main St, City",
    assignedDate: "2023-12-01",
    assignedNurse: "Rachel Greene",
    nurseId: 1,
    room: "201A",
    ward: "General Ward",
    admissionDate: "2024-01-10",
    emergencyContact: "Jane Wilson - Wife",
    emergencyPhone: "+1 (555) 123-4568",
    insurance: "Blue Cross Blue Shield",
    allergies: ["Penicillin"],
    currentMedications: ["Lisinopril 10mg", "Metformin 500mg"],
    careTasks: [
      "Monitor blood pressure every 4 hours",
      "Administer medications as prescribed",
      "Assist with daily activities",
      "Document vital signs"
    ],
    medicationSchedule: [
      { medication: "Lisinopril 10mg", time: "08:00 AM", frequency: "Once daily" },
      { medication: "Metformin 500mg", time: "08:00 AM, 06:00 PM", frequency: "Twice daily" }
    ],
    carePlans: [
      "Blood pressure monitoring and management",
      "Dietary consultation for low-sodium diet",
      "Regular exercise program initiation",
      "Patient education on hypertension management"
    ]
  },
  {
    id: "P002",
    name: "Maria Garcia",
    age: 38,
    gender: "Female", 
    condition: "Type 2 Diabetes",
    severity: "High",
    lastVisit: "2024-01-14",
    nextAppointment: "2024-01-21",
    status: "Active",
    contact: "+1 (555) 234-5678",
    address: "456 Oak Ave, City",
    assignedDate: "2023-11-15",
    assignedNurse: "Rachel Greene",
    nurseId: 1,
    room: "203B",
    ward: "ICU",
    admissionDate: "2024-01-08",
    emergencyContact: "Carlos Garcia - Husband",
    emergencyPhone: "+1 (555) 234-5679",
    insurance: "Aetna",
    allergies: ["Sulfa drugs"],
    currentMedications: ["Insulin", "Metformin 1000mg"],
    careTasks: [
      "Monitor blood glucose levels every 6 hours",
      "Administer insulin as prescribed",
      "Monitor for signs of hypoglycemia",
      "Provide diabetic diet education"
    ],
    medicationSchedule: [
      { medication: "Insulin", time: "Before meals", frequency: "3 times daily" },
      { medication: "Metformin 1000mg", time: "08:00 AM, 08:00 PM", frequency: "Twice daily" }
    ],
    carePlans: [
      "Intensive glucose monitoring and management",
      "Insulin therapy optimization",
      "Diabetic diet education and counseling",
      "Foot care and complication prevention"
    ]
  },
  {
    id: "P003",
    name: "Robert Chen",
    age: 52,
    gender: "Male",
    condition: "Post-operative care",
    severity: "Critical",
    lastVisit: "2024-01-13",
    nextAppointment: "2024-01-18",
    status: "Monitoring",
    contact: "+1 (555) 345-6789",
    address: "789 Pine St, City",
    assignedDate: "2024-01-08",
    assignedNurse: "Jessica Chen",
    nurseId: 2,
    room: "105C",
    ward: "Surgery",
    admissionDate: "2024-01-05",
    emergencyContact: "Linda Chen - Wife",
    emergencyPhone: "+1 (555) 345-6790",
    insurance: "United Healthcare",
    allergies: ["None known"],
    currentMedications: ["Oxycodone 5mg", "Antibiotics"],
    careTasks: [
      "Monitor surgical site for infection",
      "Assess pain levels every 2 hours",
      "Assist with mobility and ambulation",
      "Monitor vital signs closely"
    ],
    medicationSchedule: [
      { medication: "Oxycodone 5mg", time: "Every 6 hours as needed", frequency: "PRN" },
      { medication: "Cephalexin 500mg", time: "08:00 AM, 02:00 PM, 08:00 PM", frequency: "Three times daily" }
    ],
    carePlans: [
      "Post-operative wound care and monitoring",
      "Pain management and assessment",
      "Early mobilization and physical therapy",
      "Infection prevention and antibiotic therapy"
    ]
  },
  {
    id: "P004",
    name: "Emma Johnson",
    age: 29,
    gender: "Female",
    condition: "Prenatal care",
    severity: "Low",
    lastVisit: "2024-01-12",
    nextAppointment: "2024-01-26",
    status: "Active",
    contact: "+1 (555) 456-7890",
    address: "321 Elm Dr, City",
    assignedDate: "2023-10-01",
    assignedNurse: "Jessica Chen",
    nurseId: 2,
    room: "301A",
    ward: "Maternity",
    admissionDate: "2024-01-01",
    emergencyContact: "Michael Johnson - Husband",
    emergencyPhone: "+1 (555) 456-7891",
    insurance: "Cigna",
    allergies: ["Latex"],
    currentMedications: ["Prenatal vitamins", "Iron supplements"],
    careTasks: [
      "Monitor fetal heart rate",
      "Assess maternal vital signs",
      "Provide prenatal education",
      "Monitor for signs of complications"
    ],
    medicationSchedule: [
      { medication: "Prenatal vitamins", time: "08:00 AM", frequency: "Once daily" },
      { medication: "Iron supplements", time: "12:00 PM", frequency: "Once daily" }
    ],
    carePlans: [
      "Regular prenatal monitoring and assessment",
      "Nutritional counseling and support",
      "Preparation for labor and delivery",
      "Breastfeeding education and support"
    ]
  },
  {
    id: "P005",
    name: "David Kim",
    age: 34,
    gender: "Male",
    condition: "Asthma",
    severity: "Moderate",
    lastVisit: "2024-01-11",
    nextAppointment: "2024-01-25",
    status: "Active",
    contact: "+1 (555) 567-8901",
    address: "654 Maple Ave, City",
    assignedDate: "2023-09-20",
    assignedNurse: "Rachel Greene",
    nurseId: 1,
    room: "102B",
    ward: "General Ward",
    admissionDate: "2024-01-09",
    emergencyContact: "Sarah Kim - Wife",
    emergencyPhone: "+1 (555) 567-8902",
    insurance: "Kaiser Permanente",
    allergies: ["Dust mites", "Pollen"],
    currentMedications: ["Albuterol inhaler", "Fluticasone"],
    careTasks: [
      "Monitor respiratory status",
      "Assess peak flow measurements",
      "Provide inhaler technique education",
      "Monitor for asthma triggers"
    ],
    medicationSchedule: [
      { medication: "Albuterol inhaler", time: "As needed", frequency: "PRN for symptoms" },
      { medication: "Fluticasone", time: "08:00 AM, 08:00 PM", frequency: "Twice daily" }
    ],
    carePlans: [
      "Asthma management and monitoring",
      "Inhaler technique education and training",
      "Trigger identification and avoidance",
      "Emergency action plan development"
    ]
  },
  {
    id: "P006",
    name: "Sarah Martinez",
    age: 41,
    gender: "Female",
    condition: "Migraine",
    severity: "Moderate",
    lastVisit: "2024-01-10",
    nextAppointment: "2024-01-24",
    status: "Active",
    contact: "+1 (555) 678-9012",
    address: "987 Cedar St, City",
    assignedDate: "2024-01-05",
    assignedNurse: "Sophia Martinez",
    nurseId: 4,
    room: "204A",
    ward: "Neurology",
    admissionDate: "2024-01-03",
    emergencyContact: "Jose Martinez - Brother",
    emergencyPhone: "+1 (555) 678-9013",
    insurance: "Blue Cross Blue Shield",
    allergies: ["Aspirin"],
    currentMedications: ["Sumatriptan", "Propranolol"],
    careTasks: [
      "Monitor headache frequency and intensity",
      "Assess neurological status",
      "Provide comfort measures",
      "Monitor medication effectiveness"
    ],
    medicationSchedule: [
      { medication: "Sumatriptan", time: "As needed", frequency: "PRN for migraine" },
      { medication: "Propranolol", time: "08:00 AM, 08:00 PM", frequency: "Twice daily" }
    ],
    carePlans: [
      "Migraine management and prevention",
      "Trigger identification and avoidance",
      "Stress management techniques",
      "Medication optimization and monitoring"
    ]
  }
];

const PatientManagement: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("assigned");
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [isAddPatientDialogOpen, setIsAddPatientDialogOpen] = useState(false);
  const [selectedNurse, setSelectedNurse] = useState("");
  const [assignmentNotes, setAssignmentNotes] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [messageSubject, setMessageSubject] = useState("");
  const [nurses, setNurses] = useState(mockNurses);
  const [patients, setPatientsState] = useState(initialPatients);
  const [newPatient, setNewPatient] = useState({
    name: "",
    age: "",
    gender: "",
    condition: "",
    severity: "Moderate",
    status: "Active",
    contact: "",
    address: "",
    room: "",
    ward: "",
    emergencyContact: "",
    emergencyPhone: "",
    insurance: "",
    allergies: "",
    currentMedications: ""
  });
  
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "assigned") return matchesSearch && patient.assignedNurse;
    if (activeTab === "unassigned") return matchesSearch && !patient.assignedNurse;
    if (activeTab === "monitoring") return matchesSearch && patient.status === "Monitoring";
    if (activeTab === "critical") return matchesSearch && patient.severity === "Critical";
    if (activeTab === "all") return matchesSearch;
    
    return matchesSearch;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-100 text-red-800";
      case "High":
        return "bg-orange-100 text-orange-800";
      case "Moderate":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Monitoring":
        return "bg-blue-100 text-blue-800";
      case "Discharged":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleAssignNurse = (patient: any) => {
    setSelectedPatient(patient);
    setSelectedNurse(patient.nurseId?.toString() || "");
    setAssignmentNotes("");
    setIsAssignDialogOpen(true);
  };

  const handleEditPatient = (patient: any) => {
    setSelectedPatient(patient);
    setNewPatient({
      name: patient.name,
      age: patient.age.toString(),
      gender: patient.gender,
      condition: patient.condition,
      severity: patient.severity,
      status: patient.status,
      contact: patient.contact,
      address: patient.address,
      room: patient.room,
      ward: patient.ward,
      emergencyContact: patient.emergencyContact,
      emergencyPhone: patient.emergencyPhone,
      insurance: patient.insurance,
      allergies: patient.allergies.join(", "),
      currentMedications: patient.currentMedications.join(", ")
    });
    setIsEditDialogOpen(true);
  };

  const handleMessagePatient = (patient: any) => {
    setSelectedPatient(patient);
    setMessageSubject("");
    setMessageContent("");
    setIsMessageDialogOpen(true);
  };

  const handleAddPatient = () => {
    setNewPatient({
      name: "",
      age: "",
      gender: "",
      condition: "",
      severity: "Moderate",
      status: "Active",
      contact: "",
      address: "",
      room: "",
      ward: "",
      emergencyContact: "",
      emergencyPhone: "",
      insurance: "",
      allergies: "",
      currentMedications: ""
    });
    setIsAddPatientDialogOpen(true);
  };

  const handleSavePatient = () => {
    if (!newPatient.name || !newPatient.age || !newPatient.condition) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (Name, Age, Condition).",
        variant: "destructive"
      });
      return;
    }

    const currentDate = new Date().toISOString().split('T')[0];
    
    if (selectedPatient && isEditDialogOpen) {
      // Edit existing patient
      const updatedPatient = {
        ...selectedPatient,
        name: newPatient.name,
        age: parseInt(newPatient.age),
        gender: newPatient.gender,
        condition: newPatient.condition,
        severity: newPatient.severity,
        status: newPatient.status,
        contact: newPatient.contact,
        address: newPatient.address,
        room: newPatient.room,
        ward: newPatient.ward,
        emergencyContact: newPatient.emergencyContact,
        emergencyPhone: newPatient.emergencyPhone,
        insurance: newPatient.insurance,
        allergies: newPatient.allergies.split(",").map(a => a.trim()).filter(a => a),
        currentMedications: newPatient.currentMedications.split(",").map(m => m.trim()).filter(m => m)
      };

      setPatientsState(patients.map(p => p.id === selectedPatient.id ? updatedPatient : p));
      
      toast({
        title: "Patient Updated",
        description: `${newPatient.name}'s information has been updated successfully.`
      });
    } else {
      // Add new patient
      const newId = `P${String(Math.max(...patients.map(p => parseInt(p.id.substring(1)))) + 1).padStart(3, '0')}`;
      const patient = {
        id: newId,
        name: newPatient.name,
        age: parseInt(newPatient.age),
        gender: newPatient.gender,
        condition: newPatient.condition,
        severity: newPatient.severity,
        lastVisit: currentDate,
        nextAppointment: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: newPatient.status,
        contact: newPatient.contact,
        address: newPatient.address,
        assignedDate: currentDate,
        assignedNurse: null,
        nurseId: null,
        room: newPatient.room,
        ward: newPatient.ward,
        admissionDate: currentDate,
        emergencyContact: newPatient.emergencyContact,
        emergencyPhone: newPatient.emergencyPhone,
        insurance: newPatient.insurance,
        allergies: newPatient.allergies.split(",").map(a => a.trim()).filter(a => a),
        currentMedications: newPatient.currentMedications.split(",").map(m => m.trim()).filter(m => m),
        careTasks: ["Monitor vital signs", "Administer medications as prescribed", "Assist with daily activities"],
        medicationSchedule: [],
        carePlans: ["Initial assessment and care plan development"]
      };

      setPatientsState([...patients, patient]);
      
      toast({
        title: "Patient Added",
        description: `${newPatient.name} has been added successfully.`
      });
    }

    setIsEditDialogOpen(false);
    setIsAddPatientDialogOpen(false);
    setSelectedPatient(null);
  };

  const handleSendMessage = () => {
    if (!messageSubject || !messageContent) {
      toast({
        title: "Validation Error",
        description: "Please fill in both subject and message content.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Message Sent",
      description: `Message sent to ${selectedPatient?.name} successfully.`
    });

    setIsMessageDialogOpen(false);
    setMessageSubject("");
    setMessageContent("");
  };

  const handleSaveAssignment = () => {
    if (!selectedNurse) {
      toast({
        title: "Error",
        description: "Please select a nurse to assign.",
        variant: "destructive"
      });
      return;
    }

    const nurse = nurses.find(n => n.id.toString() === selectedNurse);
    if (!nurse) return;

    if (nurse.assignedPatients.length >= nurse.maxPatients) {
      toast({
        title: "Assignment Failed",
        description: `${nurse.name} has reached maximum patient capacity (${nurse.maxPatients} patients).`,
        variant: "destructive"
      });
      return;
    }

    // Update nurse assignments
    setNurses(nurses.map(n => {
      if (n.id.toString() === selectedNurse) {
        return {
          ...n,
          assignedPatients: [...n.assignedPatients.filter(p => p !== selectedPatient.id), selectedPatient.id]
        };
      }
      // Remove patient from previous nurse if reassigning
      if (selectedPatient.nurseId && n.id === selectedPatient.nurseId) {
        return {
          ...n,
          assignedPatients: n.assignedPatients.filter(p => p !== selectedPatient.id)
        };
      }
      return n;
    }));

    toast({
      title: "Assignment Successful",
      description: `${selectedPatient.name} has been assigned to ${nurse.name}.`,
    });

    setIsAssignDialogOpen(false);
  };

  const getAvailableNurses = () => {
    return nurses.filter(nurse => nurse.assignedPatients.length < nurse.maxPatients);
  };

  const unassignedPatientsCount = patients.filter(p => !p.assignedNurse).length;
  const criticalPatientsCount = patients.filter(p => p.severity === "Critical").length;
  const monitoringPatientsCount = patients.filter(p => p.status === "Monitoring").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1e293b]">Patient Management</h1>
          <p className="text-gray-600">Manage your assigned patients and their care coordination</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <MessageSquare className="mr-2 h-4 w-4" />
            Bulk Message
          </Button>
          <Button className="bg-[#2563eb] hover:bg-[#1d4ed8]" onClick={handleAddPatient}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Patient
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Assigned</p>
                <h3 className="text-2xl font-bold text-[#1e293b]">{patients.length}</h3>
              </div>
              <div className="bg-[#3b82f6]/10 p-3 rounded-full">
                <Users className="h-6 w-6 text-[#2563eb]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Unassigned</p>
                <h3 className="text-2xl font-bold text-[#1e293b]">{unassignedPatientsCount}</h3>
              </div>
              <div className="bg-[#f59e0b]/10 p-3 rounded-full">
                <AlertTriangle className="h-6 w-6 text-[#f59e0b]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Critical Cases</p>
                <h3 className="text-2xl font-bold text-[#1e293b]">{criticalPatientsCount}</h3>
              </div>
              <div className="bg-[#dc2626]/10 p-3 rounded-full">
                <Activity className="h-6 w-6 text-[#dc2626]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Under Monitoring</p>
                <h3 className="text-2xl font-bold text-[#1e293b]">{monitoringPatientsCount}</h3>
              </div>
              <div className="bg-[#3b82f6]/10 p-3 rounded-full">
                <FileText className="h-6 w-6 text-[#2563eb]" />
              </div>
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
                placeholder="Search by patient name, condition, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patient Management Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="assigned">Assigned ({patients.filter(p => p.assignedNurse).length})</TabsTrigger>
          <TabsTrigger value="unassigned">Unassigned ({unassignedPatientsCount})</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring ({monitoringPatientsCount})</TabsTrigger>
          <TabsTrigger value="critical">Critical ({criticalPatientsCount})</TabsTrigger>
          <TabsTrigger value="all">All Patients</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Patient List
              </CardTitle>
              <CardDescription>
                Manage your patient assignments and care coordination
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned Nurse</TableHead>
                    <TableHead>Room/Ward</TableHead>
                    <TableHead>Last Visit</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-10 text-gray-500">
                        No patients found matching your criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPatients.map((patient) => (
                      <TableRow key={patient.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-[#1e293b]">{patient.name}</p>
                            <p className="text-sm text-gray-500">{patient.id} • {patient.age}y • {patient.gender}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{patient.condition}</span>
                        </TableCell>
                        <TableCell>
                          <Badge className={getSeverityColor(patient.severity)}>
                            {patient.severity}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(patient.status)}>
                            {patient.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {patient.assignedNurse ? (
                            <div className="flex items-center gap-2">
                              <UserCheck className="h-4 w-4 text-green-600" />
                              <span className="text-sm">{patient.assignedNurse}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4 text-orange-500" />
                              <span className="text-sm text-gray-500">Unassigned</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm font-medium">{patient.room}</p>
                            <p className="text-xs text-gray-500">{patient.ward}</p>
                          </div>
                        </TableCell>
                        <TableCell>{patient.lastVisit}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-1 justify-end">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEditPatient(patient)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleAssignNurse(patient)}
                            >
                              <UserCheck className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleMessagePatient(patient)}
                            >
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Nurse Assignment Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Assign Nurse to Patient</DialogTitle>
            <DialogDescription>
              Assign or reassign a nurse to {selectedPatient?.name} and review care requirements
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Patient Information */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Patient Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div><strong>Name:</strong> {selectedPatient?.name}</div>
                  <div><strong>ID:</strong> {selectedPatient?.id}</div>
                  <div><strong>Age:</strong> {selectedPatient?.age} years</div>
                  <div><strong>Room:</strong> {selectedPatient?.room}</div>
                  <div><strong>Ward:</strong> {selectedPatient?.ward}</div>
                  <div><strong>Admission:</strong> {selectedPatient?.admissionDate}</div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <strong>Condition:</strong>
                    <div className="mt-1">{selectedPatient?.condition}</div>
                  </div>
                  <div>
                    <strong>Severity:</strong>
                    <div className="mt-1">
                      <Badge className={getSeverityColor(selectedPatient?.severity || "")}>
                        {selectedPatient?.severity}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <strong>Status:</strong>
                    <div className="mt-1">
                      <Badge className={getStatusColor(selectedPatient?.status || "")}>
                        {selectedPatient?.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Patient Care Requirements */}
            <Tabs defaultValue="care-tasks" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="care-tasks">Patient Care Tasks</TabsTrigger>
                <TabsTrigger value="medication">Medication Schedule</TabsTrigger>
                <TabsTrigger value="care-plans">Care Plans</TabsTrigger>
              </TabsList>
              
              <TabsContent value="care-tasks" className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center">
                      <ClipboardList className="h-4 w-4 mr-2" />
                      Daily Care Tasks
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {selectedPatient?.careTasks?.map((task: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="medication" className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center">
                      <Pill className="h-4 w-4 mr-2" />
                      Medication Schedule
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedPatient?.medicationSchedule?.map((med: any, index: number) => (
                        <div key={index} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-sm">{med.medication}</p>
                              <p className="text-xs text-gray-500">{med.frequency}</p>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-600">
                              <Clock className="h-3 w-3" />
                              {med.time}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="care-plans" className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Care Plans
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {selectedPatient?.carePlans?.map((plan: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span>{plan}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Current Assignment */}
            {selectedPatient?.assignedNurse && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Current Assignment</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Currently assigned to: <strong>{selectedPatient.assignedNurse}</strong></p>
                </CardContent>
              </Card>
            )}

            {/* Nurse Selection */}
            <div className="space-y-2">
              <Label htmlFor="nurse-select">Select Nurse</Label>
              <Select value={selectedNurse} onValueChange={setSelectedNurse}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a nurse..." />
                </SelectTrigger>
                <SelectContent>
                  {nurses.map((nurse) => (
                    <SelectItem 
                      key={nurse.id} 
                      value={nurse.id.toString()}
                      disabled={nurse.assignedPatients.length >= nurse.maxPatients}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div>
                          <span className="font-medium">{nurse.name}</span>
                          <span className="text-sm text-gray-500 ml-2">
                            ({nurse.specialization} - {nurse.ward})
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 ml-2">
                          {nurse.assignedPatients.length}/{nurse.maxPatients} patients
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Available Nurses Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Available Nurses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {getAvailableNurses().map((nurse) => (
                    <div key={nurse.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <p className="font-medium">{nurse.name}</p>
                        <p className="text-sm text-gray-500">{nurse.specialization} • {nurse.ward} • {nurse.shift} shift</p>
                      </div>
                      <Badge variant="outline">
                        {nurse.assignedPatients.length}/{nurse.maxPatients} patients
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Assignment Notes */}
            <div className="space-y-2">
              <Label htmlFor="assignment-notes">Assignment Notes (Optional)</Label>
              <Textarea
                id="assignment-notes"
                placeholder="Add any special instructions or notes for this assignment..."
                value={assignmentNotes}
                onChange={(e) => setAssignmentNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveAssignment} className="bg-[#2563eb] hover:bg-[#1d4ed8]">
              Assign Nurse
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Patient Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Patient Information</DialogTitle>
            <DialogDescription>
              Update patient details and medical information
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name *</Label>
                <Input
                  id="edit-name"
                  value={newPatient.name}
                  onChange={(e) => setNewPatient({...newPatient, name: e.target.value})}
                  placeholder="Enter patient name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-age">Age *</Label>
                <Input
                  id="edit-age"
                  type="number"
                  value={newPatient.age}
                  onChange={(e) => setNewPatient({...newPatient, age: e.target.value})}
                  placeholder="Enter age"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-gender">Gender</Label>
                <Select value={newPatient.gender} onValueChange={(value) => setNewPatient({...newPatient, gender: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-condition">Primary Condition *</Label>
                <Input
                  id="edit-condition"
                  value={newPatient.condition}
                  onChange={(e) => setNewPatient({...newPatient, condition: e.target.value})}
                  placeholder="Enter primary condition"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-severity">Severity</Label>
                <Select value={newPatient.severity} onValueChange={(value) => setNewPatient({...newPatient, severity: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={newPatient.status} onValueChange={(value) => setNewPatient({...newPatient, status: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Monitoring">Monitoring</SelectItem>
                    <SelectItem value="Discharged">Discharged</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-room">Room</Label>
                <Input
                  id="edit-room"
                  value={newPatient.room}
                  onChange={(e) => setNewPatient({...newPatient, room: e.target.value})}
                  placeholder="Room number"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-ward">Ward</Label>
                <Input
                  id="edit-ward"
                  value={newPatient.ward}
                  onChange={(e) => setNewPatient({...newPatient, ward: e.target.value})}
                  placeholder="Ward name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-contact">Contact Number</Label>
                <Input
                  id="edit-contact"
                  value={newPatient.contact}
                  onChange={(e) => setNewPatient({...newPatient, contact: e.target.value})}
                  placeholder="Phone number"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-address">Address</Label>
              <Input
                id="edit-address"
                value={newPatient.address}
                onChange={(e) => setNewPatient({...newPatient, address: e.target.value})}
                placeholder="Patient address"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-emergency-contact">Emergency Contact</Label>
                <Input
                  id="edit-emergency-contact"
                  value={newPatient.emergencyContact}
                  onChange={(e) => setNewPatient({...newPatient, emergencyContact: e.target.value})}
                  placeholder="Emergency contact name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-emergency-phone">Emergency Phone</Label>
                <Input
                  id="edit-emergency-phone"
                  value={newPatient.emergencyPhone}
                  onChange={(e) => setNewPatient({...newPatient, emergencyPhone: e.target.value})}
                  placeholder="Emergency contact phone"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-insurance">Insurance</Label>
              <Input
                id="edit-insurance"
                value={newPatient.insurance}
                onChange={(e) => setNewPatient({...newPatient, insurance: e.target.value})}
                placeholder="Insurance provider"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-allergies">Allergies</Label>
              <Input
                id="edit-allergies"
                value={newPatient.allergies}
                onChange={(e) => setNewPatient({...newPatient, allergies: e.target.value})}
                placeholder="Allergies (comma separated)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-medications">Current Medications</Label>
              <Textarea
                id="edit-medications"
                value={newPatient.currentMedications}
                onChange={(e) => setNewPatient({...newPatient, currentMedications: e.target.value})}
                placeholder="Current medications (comma separated)"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePatient} className="bg-[#2563eb] hover:bg-[#1d4ed8]">
              <Edit className="mr-2 h-4 w-4" />
              Update Patient
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Patient Dialog */}
      <Dialog open={isAddPatientDialogOpen} onOpenChange={setIsAddPatientDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Patient</DialogTitle>
            <DialogDescription>
              Enter patient information to add them to the system
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add-name">Full Name *</Label>
                <Input
                  id="add-name"
                  value={newPatient.name}
                  onChange={(e) => setNewPatient({...newPatient, name: e.target.value})}
                  placeholder="Enter patient name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-age">Age *</Label>
                <Input
                  id="add-age"
                  type="number"
                  value={newPatient.age}
                  onChange={(e) => setNewPatient({...newPatient, age: e.target.value})}
                  placeholder="Enter age"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add-gender">Gender</Label>
                <Select value={newPatient.gender} onValueChange={(value) => setNewPatient({...newPatient, gender: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-condition">Primary Condition *</Label>
                <Input
                  id="add-condition"
                  value={newPatient.condition}
                  onChange={(e) => setNewPatient({...newPatient, condition: e.target.value})}
                  placeholder="Enter primary condition"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add-severity">Severity</Label>
                <Select value={newPatient.severity} onValueChange={(value) => setNewPatient({...newPatient, severity: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-status">Status</Label>
                <Select value={newPatient.status} onValueChange={(value) => setNewPatient({...newPatient, status: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Monitoring">Monitoring</SelectItem>
                    <SelectItem value="Discharged">Discharged</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-room">Room</Label>
                <Input
                  id="add-room"
                  value={newPatient.room}
                  onChange={(e) => setNewPatient({...newPatient, room: e.target.value})}
                  placeholder="Room number"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add-ward">Ward</Label>
                <Input
                  id="add-ward"
                  value={newPatient.ward}
                  onChange={(e) => setNewPatient({...newPatient, ward: e.target.value})}
                  placeholder="Ward name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-contact">Contact Number</Label>
                <Input
                  id="add-contact"
                  value={newPatient.contact}
                  onChange={(e) => setNewPatient({...newPatient, contact: e.target.value})}
                  placeholder="Phone number"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="add-address">Address</Label>
              <Input
                id="add-address"
                value={newPatient.address}
                onChange={(e) => setNewPatient({...newPatient, address: e.target.value})}
                placeholder="Patient address"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add-emergency-contact">Emergency Contact</Label>
                <Input
                  id="add-emergency-contact"
                  value={newPatient.emergencyContact}
                  onChange={(e) => setNewPatient({...newPatient, emergencyContact: e.target.value})}
                  placeholder="Emergency contact name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-emergency-phone">Emergency Phone</Label>
                <Input
                  id="add-emergency-phone"
                  value={newPatient.emergencyPhone}
                  onChange={(e) => setNewPatient({...newPatient, emergencyPhone: e.target.value})}
                  placeholder="Emergency contact phone"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="add-insurance">Insurance</Label>
              <Input
                id="add-insurance"
                value={newPatient.insurance}
                onChange={(e) => setNewPatient({...newPatient, insurance: e.target.value})}
                placeholder="Insurance provider"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="add-allergies">Allergies</Label>
              <Input
                id="add-allergies"
                value={newPatient.allergies}
                onChange={(e) => setNewPatient({...newPatient, allergies: e.target.value})}
                placeholder="Allergies (comma separated)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="add-medications">Current Medications</Label>
              <Textarea
                id="add-medications"
                value={newPatient.currentMedications}
                onChange={(e) => setNewPatient({...newPatient, currentMedications: e.target.value})}
                placeholder="Current medications (comma separated)"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddPatientDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePatient} className="bg-[#2563eb] hover:bg-[#1d4ed8]">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Patient
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Message Patient Dialog */}
      <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Send Message</DialogTitle>
            <DialogDescription>
              Send a message to {selectedPatient?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="message-subject">Subject</Label>
              <Input
                id="message-subject"
                value={messageSubject}
                onChange={(e) => setMessageSubject(e.target.value)}
                placeholder="Enter message subject"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message-content">Message</Label>
              <Textarea
                id="message-content"
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder="Enter your message..."
                rows={6}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMessageDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendMessage} className="bg-[#2563eb] hover:bg-[#1d4ed8]">
              <MessageSquare className="mr-2 h-4 w-4" />
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientManagement; 