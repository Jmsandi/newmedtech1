import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Save, X, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  getAllMaternalPatients,
  addMaternalPatient,
  updateMaternalPatient,
  deleteMaternalPatient,
  type MaternalPatient
} from "@/services/database/maternal-mortality";

interface DataManagementProps {
  onViewPatient?: (patientId: string) => void;
}

export const DataManagement = ({ onViewPatient }: DataManagementProps) => {
  const [patients, setPatients] = useState<MaternalPatient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    nationalId: "",
    phoneNumber: "",
    emergencyContact: "",
    emergencyPhone: "",
    address: "",
    district: "",
    village: "",
    gestationalAge: "",
    parity: "",
    gravidity: "",
    expectedDeliveryDate: "",
    currentPregnancyNumber: "",
    bloodType: "",
    education: "none" as "none" | "primary" | "secondary" | "tertiary",
    occupation: "",
    maritalStatus: "single" as "single" | "married" | "divorced" | "widowed",
    householdIncome: "low" as "low" | "medium" | "high",
    facilityId: "",
    status: "active" as "active" | "delivered" | "referred" | "deceased"
  });

  // Mock patient data for immediate display
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
  }, []);

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      nationalId: "",
      phoneNumber: "",
      emergencyContact: "",
      emergencyPhone: "",
      address: "",
      district: "",
      village: "",
      gestationalAge: "",
      parity: "",
      gravidity: "",
      expectedDeliveryDate: "",
      currentPregnancyNumber: "",
      bloodType: "",
      education: "none",
      occupation: "",
      maritalStatus: "single",
      householdIncome: "low",
      facilityId: "",
      status: "active"
    });
    setShowForm(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const patientData: Omit<MaternalPatient, '_id' | '_rev'> = {
        type: 'maternal-patient',
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        nationalId: formData.nationalId,
        phoneNumber: formData.phoneNumber,
        emergencyContact: formData.emergencyContact,
        emergencyPhone: formData.emergencyPhone,
        address: formData.address,
        district: formData.district,
        village: formData.village,
        gestationalAge: parseInt(formData.gestationalAge),
        parity: parseInt(formData.parity),
        gravidity: parseInt(formData.gravidity),
        expectedDeliveryDate: formData.expectedDeliveryDate,
        currentPregnancyNumber: parseInt(formData.currentPregnancyNumber),
        previousComplications: [],
        chronicDiseases: [],
        allergies: [],
        currentMedications: [],
        bloodType: formData.bloodType,
        education: formData.education,
        occupation: formData.occupation,
        maritalStatus: formData.maritalStatus,
        householdIncome: formData.householdIncome,
        registeredBy: "system",
        registrationDate: new Date().toISOString(),
        facilityId: formData.facilityId,
        status: formData.status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (editingId) {
        const existingPatient = patients.find(p => p._id === editingId);
        if (existingPatient) {
          await updateMaternalPatient({ ...patientData, _id: editingId, _rev: existingPatient._rev } as MaternalPatient);
          toast({
            title: "Success",
            description: "Patient updated successfully"
          });
        }
      } else {
        await addMaternalPatient({ ...patientData, _id: `patient-${Date.now()}` } as MaternalPatient);
        toast({
          title: "Success",
          description: "New patient added successfully"
        });
      }

      resetForm();
      loadPatients();
    } catch (error) {
      console.error('Error saving patient:', error);
      toast({
        title: "Error",
        description: "Failed to save patient",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (patient: MaternalPatient) => {
    setFormData({
      firstName: patient.firstName,
      lastName: patient.lastName,
      dateOfBirth: patient.dateOfBirth,
      nationalId: patient.nationalId,
      phoneNumber: patient.phoneNumber,
      emergencyContact: patient.emergencyContact,
      emergencyPhone: patient.emergencyPhone,
      address: patient.address,
      district: patient.district,
      village: patient.village,
      gestationalAge: patient.gestationalAge.toString(),
      parity: patient.parity.toString(),
      gravidity: patient.gravidity.toString(),
      expectedDeliveryDate: patient.expectedDeliveryDate,
      currentPregnancyNumber: patient.currentPregnancyNumber.toString(),
      bloodType: patient.bloodType,
      education: patient.education,
      occupation: patient.occupation,
      maritalStatus: patient.maritalStatus,
      householdIncome: patient.householdIncome,
      facilityId: patient.facilityId,
      status: patient.status
    });
    setEditingId(patient._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string, rev?: string) => {
    if (!rev) return;
    try {
      await deleteMaternalPatient(id, rev);
      toast({
        title: "Success",
        description: "Patient deleted successfully"
      });
      loadPatients();
    } catch (error) {
      console.error('Error deleting patient:', error);
      toast({
        title: "Error",
        description: "Failed to delete patient",
        variant: "destructive"
      });
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'delivered': return 'secondary';
      case 'referred': return 'secondary';
      case 'deceased': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Patient Data Management</h2>
        <Button onClick={() => setShowForm(true)} disabled={showForm}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Patient
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Patient' : 'Add New Patient'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="nationalId">National ID</Label>
                  <Input
                    id="nationalId"
                    value={formData.nationalId}
                    onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="gestationalAge">Gestational Age (weeks)</Label>
                  <Input
                    id="gestationalAge"
                    type="number"
                    value={formData.gestationalAge}
                    onChange={(e) => setFormData({ ...formData, gestationalAge: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="expectedDeliveryDate">Expected Delivery Date</Label>
                  <Input
                    id="expectedDeliveryDate"
                    type="date"
                    value={formData.expectedDeliveryDate}
                    onChange={(e) => setFormData({ ...formData, expectedDeliveryDate: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="bloodType">Blood Type</Label>
                  <Input
                    id="bloodType"
                    value={formData.bloodType}
                    onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                    placeholder="A+, B-, O+, etc."
                  />
                </div>
                <div>
                  <Label htmlFor="district">District</Label>
                  <Input
                    id="district"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="referred">Referred</SelectItem>
                      <SelectItem value="deceased">Deceased</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  {editingId ? 'Update' : 'Save'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Patient Records</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>Loading patients...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>District</TableHead>
                  <TableHead>Gestational Age</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((patient) => (
                  <TableRow key={patient._id}>
                    <TableCell>{`${patient.firstName} ${patient.lastName}`}</TableCell>
                    <TableCell>{new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()}</TableCell>
                    <TableCell>{patient.district}</TableCell>
                    <TableCell>{patient.gestationalAge} weeks</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(patient.status)}>
                        {patient.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => onViewPatient?.(patient._id)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleEdit(patient)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(patient._id, patient._rev)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
