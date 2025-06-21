import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PlusCircle, Search, UserPlus, Edit, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  getAllPatientsForAdmin, 
  searchPatientsAdmin, 
  addPatientAdmin, 
  updatePatientAdmin, 
  deletePatientAdmin 
} from "@/services/database/admin-services";
import { Patient } from "@/services/database/types";

interface PatientFormData {
  name: string;
  age: number;
  gender: string;
  phone: string;
  condition: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

const Patients = () => {
  const { toast } = useToast();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPatient, setCurrentPatient] = useState<PatientFormData>({
    name: "",
    age: 0,
    gender: "",
    phone: "",
    condition: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [saving, setSaving] = useState(false);
  const [searchResults, setSearchResults] = useState<Patient[]>([]);

  // Load all patients on component mount
  useEffect(() => {
    loadPatients();
  }, []);

  // Handle search
  useEffect(() => {
    handleSearch();
  }, [searchTerm, patients]);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const patientsData = await getAllPatientsForAdmin();
      setPatients(patientsData);
    } catch (error) {
      console.error('Error loading patients:', error);
      toast({
        title: "Error Loading Patients",
        description: "Failed to load patients. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchResults(patients);
      return;
    }

    try {
      const results = await searchPatientsAdmin(searchTerm);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching patients:', error);
      setSearchResults(patients);
    }
  };

  // Filter patients based on search term (fallback for client-side search)
  const filteredPatients = searchResults.length > 0 || searchTerm ? searchResults : patients;

  const handleAddPatient = () => {
    setIsEditMode(false);
    setCurrentPatient({
      name: "",
      age: 0,
      gender: "",
      phone: "",
      condition: "",
      email: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
    });
    setIsDialogOpen(true);
  };

  const handleEditPatient = (patient: Patient) => {
    setIsEditMode(true);
    setCurrentPatient({
      name: patient.name || "",
      age: patient.age || 0,
      gender: patient.gender || "",
      phone: patient.phone || "",
      condition: patient.condition || "",
      email: patient.email || "",
      address: patient.address || "",
      city: patient.city || "",
      state: patient.state || "",
      zipCode: patient.zipCode || "",
    });
    setIsDialogOpen(true);
  };

  const handleDeletePatient = async (patient: Patient) => {
    if (!window.confirm(`Are you sure you want to delete ${patient.name}?`)) {
      return;
    }

    try {
      const success = await deletePatientAdmin(patient._id);
      if (success) {
        setPatients(patients.filter(p => p._id !== patient._id));
        toast({
          title: "Patient Removed",
          description: "The patient record has been deleted successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete patient. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error deleting patient:', error);
      toast({
        title: "Error",
        description: "Failed to delete patient. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSavePatient = async () => {
    if (!currentPatient.name || !currentPatient.gender) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    try {
      if (isEditMode) {
        // Find the original patient to get the _id and other required fields
        const originalPatient = patients.find(p => p.name === currentPatient.name);
        if (!originalPatient) {
          toast({
            title: "Error",
            description: "Original patient record not found.",
            variant: "destructive",
          });
          return;
        }

        const updatedPatient: Patient = {
          ...originalPatient,
          ...currentPatient,
        };

        const success = await updatePatientAdmin(updatedPatient);
        if (success) {
          setPatients(patients.map(p => p._id === originalPatient._id ? updatedPatient : p));
          toast({
            title: "Patient Updated",
            description: "Patient record has been updated successfully.",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to update patient. Please try again.",
            variant: "destructive",
          });
          return;
        }
      } else {
        const success = await addPatientAdmin(currentPatient);
        if (success) {
          await loadPatients(); // Reload to get the new patient with proper ID
          toast({
            title: "Patient Added",
            description: "New patient has been added successfully.",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to add patient. Please try again.",
            variant: "destructive",
          });
          return;
        }
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving patient:', error);
      toast({
        title: "Error",
        description: "Failed to save patient. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentPatient({
      ...currentPatient,
      [name]: name === "age" ? parseInt(value) || 0 : value,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading patients...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Patients Management</h1>
          <p className="text-muted-foreground">
            Manage patient records, view medical histories, and add new patients to the system.
          </p>
        </div>
        <Button onClick={handleAddPatient} className="bg-hospital-primary hover:bg-hospital-primary/90">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Patient
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search patients by name or condition..."
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
              <TableHead>Name</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Medical Condition</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                  {searchTerm ? "No patients found matching your search" : "No patients found"}
                </TableCell>
              </TableRow>
            ) : (
              filteredPatients.map((patient) => (
                <TableRow key={patient._id}>
                  <TableCell className="font-medium">{patient.name}</TableCell>
                  <TableCell>{patient.age}</TableCell>
                  <TableCell>{patient.gender}</TableCell>
                  <TableCell>{patient.phone}</TableCell>
                  <TableCell>{patient.condition}</TableCell>
                  <TableCell>{patient.email || 'N/A'}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="sm" variant="ghost" onClick={() => handleEditPatient(patient)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDeletePatient(patient)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Patient Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Patient" : "Add New Patient"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={currentPatient.name}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={currentPatient.age || ""}
                  onChange={handleInputChange}
                  placeholder="Enter age"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Input
                  id="gender"
                  name="gender"
                  value={currentPatient.gender}
                  onChange={handleInputChange}
                  placeholder="Male/Female/Other"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={currentPatient.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="condition">Medical Condition</Label>
              <Input
                id="condition"
                name="condition"
                value={currentPatient.condition}
                onChange={handleInputChange}
                placeholder="Enter medical condition"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={currentPatient.email}
                onChange={handleInputChange}
                placeholder="Enter email address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={currentPatient.address}
                onChange={handleInputChange}
                placeholder="Enter address"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePatient} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditMode ? "Updating..." : "Adding..."}
                </>
              ) : (
                isEditMode ? "Update Patient" : "Add Patient"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Patients;
