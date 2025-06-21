import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  Droplet, 
  AlertTriangle,
  Activity,
  Heart,
  Stethoscope,
  TestTube,
  ArrowLeft,
  Edit
} from "lucide-react";
import { getAllMaternalPatients, type MaternalPatient } from "@/services/database/maternal-mortality";

interface BloodTestResult {
  date: string;
  hemoglobin: string;
  hematocrit: string;
  platelets: string;
  glucose: string;
}

export const PatientView = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<MaternalPatient | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);

  // Mock patient data for immediate testing
  const mockPatients: MaternalPatient[] = [
    {
      _id: 'mock_patient_001',
      type: 'maternal-patient',
      firstName: 'Sarah',
      lastName: 'Johnson',
      dateOfBirth: '1985-03-15',
      nationalId: '001',
      phoneNumber: '+1 (555) 123-4567',
      emergencyContact: 'John Johnson',
      emergencyPhone: '+1 (555) 123-4568',
      address: '123 Main St, Springfield, IL',
      district: 'Central District',
      village: 'Westlands',
      gestationalAge: 32,
      parity: 1,
      gravidity: 2,
      expectedDeliveryDate: '2025-08-15',
      currentPregnancyNumber: 2,
      previousComplications: ['Preeclampsia'],
      chronicDiseases: ['Hypertension'],
      allergies: [],
      currentMedications: ['Methyldopa 250mg'],
      bloodType: 'O+',
      education: 'tertiary',
      occupation: 'Teacher',
      maritalStatus: 'married',
      householdIncome: 'medium',
      registeredBy: 'Dr. Mary Nurse',
      registrationDate: '2024-01-10',
      facilityId: 'facility_001',
      status: 'active',
      createdAt: '2024-01-10T10:00:00Z',
      updatedAt: '2025-05-28T15:30:00Z'
    },
    {
      _id: 'mock_patient_002',
      type: 'maternal-patient',
      firstName: 'Maria',
      lastName: 'Rodriguez',
      dateOfBirth: '1990-07-22',
      nationalId: '002',
      phoneNumber: '+1 (555) 333-3333',
      emergencyContact: 'Carlos Rodriguez',
      emergencyPhone: '+1 (555) 444-4444',
      address: '456 Oak Avenue, Northern Region',
      district: 'Northern Region',
      village: 'Kileleshwa',
      gestationalAge: 28,
      parity: 0,
      gravidity: 1,
      expectedDeliveryDate: '2025-09-01',
      currentPregnancyNumber: 1,
      previousComplications: [],
      chronicDiseases: ['Diabetes Type 2'],
      allergies: ['Penicillin'],
      currentMedications: ['Insulin', 'Folic Acid'],
      bloodType: 'A+',
      education: 'secondary',
      occupation: 'Shop Owner',
      maritalStatus: 'married',
      householdIncome: 'low',
      registeredBy: 'Nurse Jane Doe',
      registrationDate: '2024-01-15',
      facilityId: 'facility_001',
      status: 'active',
      createdAt: '2024-01-15T14:00:00Z',
      updatedAt: '2024-01-25T09:45:00Z'
    },
    {
      _id: 'mock_patient_003',
      type: 'maternal-patient',
      firstName: 'Emma',
      lastName: 'Thompson',
      dateOfBirth: '1992-11-08',
      nationalId: '003',
      phoneNumber: '+1 (555) 555-5555',
      emergencyContact: 'David Thompson',
      emergencyPhone: '+1 (555) 555-5556',
      address: '789 Pine Street, Eastern District',
      district: 'Eastern District',
      village: 'Karen',
      gestationalAge: 24,
      parity: 2,
      gravidity: 3,
      expectedDeliveryDate: '2025-10-15',
      currentPregnancyNumber: 3,
      previousComplications: ['Gestational Diabetes'],
      chronicDiseases: [],
      allergies: ['Latex'],
      currentMedications: ['Prenatal vitamins', 'Iron supplements'],
      bloodType: 'B+',
      education: 'tertiary',
      occupation: 'Nurse',
      maritalStatus: 'married',
      householdIncome: 'high',
      registeredBy: 'Dr. Sarah Wilson',
      registrationDate: '2024-02-01',
      facilityId: 'facility_001',
      status: 'active',
      createdAt: '2024-02-01T08:00:00Z',
      updatedAt: '2024-02-15T11:20:00Z'
    },
    {
      _id: 'mock_patient_004',
      type: 'maternal-patient',
      firstName: 'Aisha',
      lastName: 'Patel',
      dateOfBirth: '1988-05-12',
      nationalId: '004',
      phoneNumber: '+1 (555) 777-7777',
      emergencyContact: 'Raj Patel',
      emergencyPhone: '+1 (555) 777-7778',
      address: '321 Elm Drive, Western Region',
      district: 'Western Region',
      village: 'Lavington',
      gestationalAge: 36,
      parity: 1,
      gravidity: 2,
      expectedDeliveryDate: '2025-07-20',
      currentPregnancyNumber: 2,
      previousComplications: [],
      chronicDiseases: ['Asthma'],
      allergies: ['Shellfish'],
      currentMedications: ['Albuterol inhaler', 'Prenatal vitamins'],
      bloodType: 'AB+',
      education: 'tertiary',
      occupation: 'Software Engineer',
      maritalStatus: 'married',
      householdIncome: 'high',
      registeredBy: 'Dr. Michael Chen',
      registrationDate: '2024-01-20',
      facilityId: 'facility_001',
      status: 'active',
      createdAt: '2024-01-20T09:30:00Z',
      updatedAt: '2024-02-10T14:15:00Z'
    },
    {
      _id: 'mock_patient_005',
      type: 'maternal-patient',
      firstName: 'Grace',
      lastName: 'Ochieng',
      dateOfBirth: '1995-09-25',
      nationalId: '005',
      phoneNumber: '+1 (555) 888-8888',
      emergencyContact: 'Peter Ochieng',
      emergencyPhone: '+1 (555) 888-8889',
      address: '654 Maple Lane, Southern District',
      district: 'Southern District',
      village: 'Langata',
      gestationalAge: 20,
      parity: 0,
      gravidity: 1,
      expectedDeliveryDate: '2025-11-30',
      currentPregnancyNumber: 1,
      previousComplications: [],
      chronicDiseases: [],
      allergies: [],
      currentMedications: ['Folic acid', 'Iron supplements'],
      bloodType: 'O-',
      education: 'secondary',
      occupation: 'Student',
      maritalStatus: 'single',
      householdIncome: 'low',
      registeredBy: 'Nurse Patricia Wanjiku',
      registrationDate: '2024-02-10',
      facilityId: 'facility_001',
      status: 'active',
      createdAt: '2024-02-10T13:45:00Z',
      updatedAt: '2024-02-20T10:30:00Z'
    }
  ];

  // Sample blood test results data
  const bloodTestResults: BloodTestResult[] = [
    {
      date: "2025-04-01",
      hemoglobin: "11.2 g/dL",
      hematocrit: "33.5%",
      platelets: "250 × 10³/μL",
      glucose: "92 mg/dL"
    },
    {
      date: "2025-05-01",
      hemoglobin: "10.8 g/dL",
      hematocrit: "32.1%",
      platelets: "240 × 10³/μL",
      glucose: "95 mg/dL"
    },
    {
      date: "2025-05-28",
      hemoglobin: "10.5 g/dL",
      hematocrit: "31.8%",
      platelets: "235 × 10³/μL",
      glucose: "98 mg/dL"
    }
  ];

  useEffect(() => {
    // Use mock data to find the patient
    const foundPatient = mockPatients.find(p => p._id === patientId);
    if (foundPatient) {
      setPatient(foundPatient);
    }
    setIsLoading(false);
  }, [patientId]);

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

  const getRiskLevel = (patient: MaternalPatient) => {
    if (patient.chronicDiseases.length > 0 || patient.gestationalAge > 35) {
      return { level: "HIGH RISK", variant: "destructive" as const };
    } else if (patient.gestationalAge > 30 || patient.parity > 3) {
      return { level: "MEDIUM RISK", variant: "secondary" as const };
    }
    return { level: "LOW RISK", variant: "default" as const };
  };

  const getPatientDisplayId = (nationalId: string) => {
    const numericPart = nationalId.replace(/\D/g, '').slice(-3);
    return `P${numericPart.padStart(3, '0')}`;
  };

  const handleEdit = () => {
    navigate(`/maternal/patient-edit/${patientId}`);
  };

  const handleBack = () => {
    navigate('/maternal/patient-management');
  };

  if (isLoading) {
    return <div className="p-6">Loading patient data...</div>;
  }

  if (!patient) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Patient Not Found</h2>
          <Button onClick={handleBack}>Back to Patient Management</Button>
        </div>
      </div>
    );
  }

  const risk = getRiskLevel(patient);
  const age = calculateAge(patient.dateOfBirth);

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: Activity, path: "/maternal-mortality" },
    { id: "patient-management", label: "Patient Management", icon: User, path: "/maternal/patient-management" },
    { id: "data", label: "Data", icon: Activity, path: "/maternal-mortality" },
    { id: "registration", label: "Registration", icon: User, path: "/maternal-mortality" },
    { id: "risk-analysis", label: "Risk Analysis", icon: AlertTriangle, path: "/maternal-mortality" },
    { id: "emergency", label: "Emergency Response", icon: AlertTriangle, path: "/maternal-mortality" },
    { id: "analytics", label: "Analytics", icon: Activity, path: "/maternal-mortality" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => navigate("/admin/dashboard")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Admin
              </Button>
              <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                  <Heart className="h-8 w-8 text-red-500" />
                  Maternal Mortality Prevention - Patient Details
                </h1>
                <p className="text-muted-foreground">
                  Viewing patient: {patient.firstName} {patient.lastName}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={handleBack}>
                Back to Patients
              </Button>
              <Button onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Patient
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout with Sidebar */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r min-h-[calc(100vh-80px)]">
          <div className="p-4">
            <nav className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.id === "patient-management";
                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="space-y-6">

      {/* Patient Info Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-semibold">
                  {patient.firstName} {patient.lastName}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Patient ID: {getPatientDisplayId(patient.nationalId)}
                </p>
              </div>
            </div>
            <Badge variant={risk.variant}>{risk.level}</Badge>
          </div>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Age</p>
                <p className="font-medium">{age} years</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{patient.phoneNumber}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium">{patient.address}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Blood Type</p>
                <p className="font-medium">{patient.bloodType || "O+"}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Gestational Week</p>
              <p className="font-medium">{patient.gestationalAge} weeks</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Due Date</p>
              <p className="font-medium">{new Date(patient.expectedDeliveryDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Visit</p>
              <p className="font-medium">{new Date(patient.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Critical Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Critical Alerts
            <Badge variant="destructive" className="ml-2">1</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start space-x-3 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-800">Low Hemoglobin Alert</h4>
              <p className="text-sm text-yellow-700">
                {patient.firstName} {patient.lastName}: Hemoglobin 10.5 g/dL - Below normal range
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Section */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="vital-signs" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Vital Signs
          </TabsTrigger>
          <TabsTrigger value="lab-tests" className="flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            Lab Tests
          </TabsTrigger>
          <TabsTrigger value="ultrasound" className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4" />
            Ultrasound
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Patient Overview</CardTitle>
              <CardDescription>General information and current status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Medical History</h4>
                  <div className="space-y-1">
                    <p className="text-sm">Parity: {patient.parity}</p>
                    <p className="text-sm">Gravidity: {patient.gravidity}</p>
                    <p className="text-sm">Chronic Diseases: {patient.chronicDiseases.length > 0 ? patient.chronicDiseases.join(", ") : "None"}</p>
                    <p className="text-sm">Allergies: {patient.allergies.length > 0 ? patient.allergies.join(", ") : "None"}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Current Status</h4>
                  <div className="space-y-1">
                    <p className="text-sm">Status: <Badge variant="outline">{patient.status}</Badge></p>
                    <p className="text-sm">Facility: {patient.facilityId}</p>
                    <p className="text-sm">Registered: {new Date(patient.registrationDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vital-signs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vital Signs Monitoring</CardTitle>
              <CardDescription>Recent vital signs and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Vital signs data will be displayed here when available.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lab-tests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplet className="h-5 w-5 text-red-500" />
                Blood Test Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>DATE</TableHead>
                    <TableHead>HEMOGLOBIN</TableHead>
                    <TableHead>HEMATOCRIT</TableHead>
                    <TableHead>PLATELETS</TableHead>
                    <TableHead>GLUCOSE</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bloodTestResults.map((result, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{result.date}</TableCell>
                      <TableCell className={parseFloat(result.hemoglobin) < 11.0 ? "text-red-600 font-medium" : ""}>
                        {result.hemoglobin}
                      </TableCell>
                      <TableCell>{result.hematocrit}</TableCell>
                      <TableCell>{result.platelets}</TableCell>
                      <TableCell>{result.glucose}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ultrasound" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ultrasound Results</CardTitle>
              <CardDescription>Fetal development and monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Ultrasound results will be displayed here when available.</p>
            </CardContent>
          </Card>
                  </TabsContent>
        </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}; 