import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  User, 
  ArrowLeft,
  Save,
  AlertTriangle,
  Heart,
  Activity,
  Edit
} from "lucide-react";
import { getAllMaternalPatients, type MaternalPatient } from "@/services/database/maternal-mortality";
import { cn } from "@/lib/utils";

export const PatientEdit = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<MaternalPatient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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

  useEffect(() => {
    // Use mock data to find the patient
    const foundPatient = mockPatients.find(p => p._id === patientId);
    if (foundPatient) {
      setPatient(foundPatient);
    }
    setIsLoading(false);
  }, [patientId]);

  const getPatientDisplayId = (nationalId: string) => {
    const numericPart = nationalId.replace(/\D/g, '').slice(-3);
    return `P${numericPart.padStart(3, '0')}`;
  };

  const handleInputChange = (field: keyof MaternalPatient, value: string | number | string[]) => {
    if (patient) {
      setPatient({
        ...patient,
        [field]: value
      });
    }
  };

  const handleSave = async () => {
    if (!patient) return;
    
    setIsSaving(true);
    try {
      // TODO: Implement actual save functionality
      console.log('Saving patient:', patient);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate back to view page after saving
      navigate(`/maternal/patient-view/${patientId}`);
    } catch (error) {
      console.error('Error saving patient:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/maternal/patient-view/${patientId}`);
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
                  Maternal Mortality Prevention - Edit Patient
                </h1>
                <p className="text-muted-foreground">
                  Editing patient: {patient.firstName} {patient.lastName}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
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
                    className={cn(
                      "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-gray-100 text-gray-700"
                    )}
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
            {/* Patient Header */}
            <Card>
              <CardContent className="p-6">
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
                    <Badge variant="outline">{patient.status}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Edit Form */}
            <div className="grid gap-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Basic patient details and contact information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={patient.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={patient.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={patient.dateOfBirth}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="nationalId">National ID</Label>
                      <Input
                        id="nationalId"
                        value={patient.nationalId}
                        onChange={(e) => handleInputChange('nationalId', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        value={patient.phoneNumber}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergencyContact">Emergency Contact</Label>
                      <Input
                        id="emergencyContact"
                        value={patient.emergencyContact}
                        onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="emergencyPhone">Emergency Phone</Label>
                      <Input
                        id="emergencyPhone"
                        value={patient.emergencyPhone}
                        onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="bloodType">Blood Type</Label>
                      <Select value={patient.bloodType || ''} onValueChange={(value) => handleInputChange('bloodType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select blood type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="A-">A-</SelectItem>
                          <SelectItem value="B+">B+</SelectItem>
                          <SelectItem value="B-">B-</SelectItem>
                          <SelectItem value="AB+">AB+</SelectItem>
                          <SelectItem value="AB-">AB-</SelectItem>
                          <SelectItem value="O+">O+</SelectItem>
                          <SelectItem value="O-">O-</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={patient.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="district">District</Label>
                      <Input
                        id="district"
                        value={patient.district}
                        onChange={(e) => handleInputChange('district', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="village">Village</Label>
                      <Input
                        id="village"
                        value={patient.village}
                        onChange={(e) => handleInputChange('village', e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pregnancy Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Pregnancy Information</CardTitle>
                  <CardDescription>Current pregnancy details and medical history</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="gestationalAge">Gestational Age (weeks)</Label>
                      <Input
                        id="gestationalAge"
                        type="number"
                        value={patient.gestationalAge}
                        onChange={(e) => handleInputChange('gestationalAge', parseInt(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="parity">Parity</Label>
                      <Input
                        id="parity"
                        type="number"
                        value={patient.parity}
                        onChange={(e) => handleInputChange('parity', parseInt(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="gravidity">Gravidity</Label>
                      <Input
                        id="gravidity"
                        type="number"
                        value={patient.gravidity}
                        onChange={(e) => handleInputChange('gravidity', parseInt(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expectedDeliveryDate">Expected Delivery Date</Label>
                      <Input
                        id="expectedDeliveryDate"
                        type="date"
                        value={patient.expectedDeliveryDate}
                        onChange={(e) => handleInputChange('expectedDeliveryDate', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="currentPregnancyNumber">Current Pregnancy Number</Label>
                      <Input
                        id="currentPregnancyNumber"
                        type="number"
                        value={patient.currentPregnancyNumber}
                        onChange={(e) => handleInputChange('currentPregnancyNumber', parseInt(e.target.value))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="previousComplications">Previous Complications (comma-separated)</Label>
                    <Textarea
                      id="previousComplications"
                      value={patient.previousComplications.join(', ')}
                      onChange={(e) => handleInputChange('previousComplications', e.target.value.split(', ').filter(Boolean))}
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="chronicDiseases">Chronic Diseases (comma-separated)</Label>
                    <Textarea
                      id="chronicDiseases"
                      value={patient.chronicDiseases.join(', ')}
                      onChange={(e) => handleInputChange('chronicDiseases', e.target.value.split(', ').filter(Boolean))}
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="allergies">Allergies (comma-separated)</Label>
                    <Textarea
                      id="allergies"
                      value={patient.allergies.join(', ')}
                      onChange={(e) => handleInputChange('allergies', e.target.value.split(', ').filter(Boolean))}
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="currentMedications">Current Medications (comma-separated)</Label>
                    <Textarea
                      id="currentMedications"
                      value={patient.currentMedications.join(', ')}
                      onChange={(e) => handleInputChange('currentMedications', e.target.value.split(', ').filter(Boolean))}
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Social & Economic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Social & Economic Information</CardTitle>
                  <CardDescription>Education, occupation, and household details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="education">Education Level</Label>
                      <Select value={patient.education} onValueChange={(value) => handleInputChange('education', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select education level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="primary">Primary</SelectItem>
                          <SelectItem value="secondary">Secondary</SelectItem>
                          <SelectItem value="tertiary">Tertiary</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="occupation">Occupation</Label>
                      <Input
                        id="occupation"
                        value={patient.occupation}
                        onChange={(e) => handleInputChange('occupation', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="maritalStatus">Marital Status</Label>
                      <Select value={patient.maritalStatus} onValueChange={(value) => handleInputChange('maritalStatus', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select marital status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single">Single</SelectItem>
                          <SelectItem value="married">Married</SelectItem>
                          <SelectItem value="divorced">Divorced</SelectItem>
                          <SelectItem value="widowed">Widowed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="householdIncome">Household Income</Label>
                      <Select value={patient.householdIncome} onValueChange={(value) => handleInputChange('householdIncome', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select income level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 