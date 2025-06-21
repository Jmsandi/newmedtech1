import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  User, 
  Eye,
  Edit,
  Trash2,
  Plus
} from "lucide-react";
import { getAllMaternalPatients, type MaternalPatient } from "@/services/database/maternal-mortality";

interface PatientManagementProps {
  selectedPatientId?: string;
}

export const PatientManagement = ({ selectedPatientId }: PatientManagementProps) => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<MaternalPatient[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
    // Use mock data instead of loading from database
    setPatients(mockPatients);
    setIsLoading(false);
  }, [selectedPatientId]);

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
    // Simple risk assessment based on gestational age and chronic diseases
    if (patient.chronicDiseases.length > 0 || patient.gestationalAge > 35) {
      return { level: "HIGH RISK", variant: "destructive" as const };
    } else if (patient.gestationalAge > 30 || patient.parity > 3) {
      return { level: "MEDIUM RISK", variant: "secondary" as const };
    }
    return { level: "LOW RISK", variant: "default" as const };
  };

  const getPatientDisplayId = (nationalId: string) => {
    // Convert national ID to P001 format for display
    const numericPart = nationalId.replace(/\D/g, '').slice(-3);
    return `P${numericPart.padStart(3, '0')}`;
  };

  const handleViewPatient = (patient: MaternalPatient) => {
    navigate(`/maternal/patient-view/${patient._id}`);
  };

  const handleEditPatient = (patient: MaternalPatient) => {
    navigate(`/maternal/patient-edit/${patient._id}`);
  };

  const handleDeletePatient = (patient: MaternalPatient) => {
    // TODO: Implement delete functionality with confirmation dialog
    if (window.confirm(`Are you sure you want to delete patient ${patient.firstName} ${patient.lastName}?`)) {
      console.log('Delete patient:', patient);
      // Remove from mock data for demonstration
      setPatients(prev => prev.filter(p => p._id !== patient._id));
    }
  };

  const handleAddNewPatient = () => {
    navigate('/maternal/patient-registration');
  };

  if (isLoading) {
    return <div className="p-6">Loading patient data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Patient Management</h1>
        <Button onClick={handleAddNewPatient} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Patient
        </Button>
      </div>

      {/* Patients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Patients List</CardTitle>
          <CardDescription>Manage all maternal patients and their information</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PATIENT ID</TableHead>
                <TableHead>NAME</TableHead>
                <TableHead>AGE</TableHead>
                <TableHead>PHONE</TableHead>
                <TableHead>GESTATIONAL AGE</TableHead>
                <TableHead>DUE DATE</TableHead>
                <TableHead>RISK LEVEL</TableHead>
                <TableHead>STATUS</TableHead>
                <TableHead>ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient) => {
                const age = calculateAge(patient.dateOfBirth);
                const risk = getRiskLevel(patient);
                return (
                  <TableRow key={patient._id}>
                    <TableCell className="font-medium">
                      {getPatientDisplayId(patient.nationalId)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{patient.firstName} {patient.lastName}</p>
                          <p className="text-sm text-muted-foreground">{patient.occupation}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{age} years</TableCell>
                    <TableCell>{patient.phoneNumber}</TableCell>
                    <TableCell>{patient.gestationalAge} weeks</TableCell>
                    <TableCell>{new Date(patient.expectedDeliveryDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={risk.variant}>{risk.level}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{patient.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleViewPatient(patient)}
                          title="View Patient Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditPatient(patient)}
                          title="Edit Patient"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDeletePatient(patient)}
                          className="text-red-600 hover:text-red-700"
                          title="Delete Patient"
                        >
                          <Trash2 className="h-4 w-4" />
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
    </div>
  );
}; 