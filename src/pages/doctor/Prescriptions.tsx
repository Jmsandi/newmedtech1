import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Edit, Eye, Calendar, Pill, AlertTriangle, Clock, User, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Prescription {
  id: number;
  patientName: string;
  patientId: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  status: string;
  prescribedDate: string;
  refillsRemaining: number;
  instructions: string;
  indication: string;
  pharmacy: string;
  prescribedBy: string;
  lastRefillDate?: string;
  expiryDate: string;
  priority: string;
}

const Prescriptions: React.FC = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isNewPrescriptionOpen, setIsNewPrescriptionOpen] = useState(false);
  const [isEditPrescriptionOpen, setIsEditPrescriptionOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [newPrescription, setNewPrescription] = useState<Partial<Prescription>>({
    patientName: "",
    patientId: "",
    medication: "",
    dosage: "",
    frequency: "",
    duration: "",
    instructions: "",
    indication: "",
    pharmacy: "",
    refillsRemaining: 0,
    priority: "Normal"
  });

  const [prescriptions, setPrescriptions] = useState<Prescription[]>([
    {
      id: 1,
      patientName: "James Wilson",
      patientId: "P-001",
      medication: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      duration: "30 days",
      status: "Active",
      prescribedDate: "2025-01-15",
      refillsRemaining: 3,
      instructions: "Take with food in the morning",
      indication: "Hypertension",
      pharmacy: "CVS Pharmacy",
      prescribedBy: "Dr. Sarah Johnson",
      expiryDate: "2025-07-15",
      priority: "Normal"
    },
    {
      id: 2,
      patientName: "Maria Garcia",
      patientId: "P-002",
      medication: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      duration: "90 days",
      status: "Active",
      prescribedDate: "2025-01-10",
      refillsRemaining: 2,
      instructions: "Take with meals",
      indication: "Type 2 Diabetes",
      pharmacy: "Walgreens",
      prescribedBy: "Dr. Sarah Johnson",
      expiryDate: "2025-07-10",
      priority: "High"
    },
    {
      id: 3,
      patientName: "Robert Chen",
      patientId: "P-003",
      medication: "Oxycodone",
      dosage: "5mg",
      frequency: "Every 6 hours as needed",
      duration: "7 days",
      status: "Completed",
      prescribedDate: "2025-01-12",
      refillsRemaining: 0,
      instructions: "For post-operative pain management",
      indication: "Post-operative pain",
      pharmacy: "Rite Aid",
      prescribedBy: "Dr. Sarah Johnson",
      expiryDate: "2025-01-19",
      priority: "High"
    },
    {
      id: 4,
      patientName: "Emma Johnson",
      patientId: "P-004",
      medication: "Prenatal Vitamins",
      dosage: "1 tablet",
      frequency: "Once daily",
      duration: "90 days",
      status: "Active",
      prescribedDate: "2025-01-08",
      refillsRemaining: 5,
      instructions: "Take with breakfast",
      indication: "Prenatal care",
      pharmacy: "CVS Pharmacy",
      prescribedBy: "Dr. Sarah Johnson",
      expiryDate: "2025-07-08",
      priority: "Normal"
    },
    {
      id: 5,
      patientName: "David Kim",
      patientId: "P-005",
      medication: "Albuterol Inhaler",
      dosage: "90mcg",
      frequency: "2 puffs every 4-6 hours as needed",
      duration: "30 days",
      status: "Pending",
      prescribedDate: "2025-01-16",
      refillsRemaining: 2,
      instructions: "Use for asthma symptoms, rinse mouth after use",
      indication: "Asthma",
      pharmacy: "Walgreens",
      prescribedBy: "Dr. Sarah Johnson",
      expiryDate: "2025-07-16",
      priority: "High"
    }
  ]);

  const patients = [
    { id: "P-001", name: "James Wilson" },
    { id: "P-002", name: "Maria Garcia" },
    { id: "P-003", name: "Robert Chen" },
    { id: "P-004", name: "Emma Johnson" },
    { id: "P-005", name: "David Kim" },
    { id: "P-006", name: "Sarah Martinez" }
  ];

  const medications = [
    "Lisinopril", "Metformin", "Oxycodone", "Prenatal Vitamins", "Albuterol Inhaler",
    "Amoxicillin", "Ibuprofen", "Acetaminophen", "Aspirin", "Insulin",
    "Atorvastatin", "Omeprazole", "Levothyroxine", "Amlodipine", "Hydrochlorothiazide"
  ];

  const pharmacies = [
    "CVS Pharmacy", "Walgreens", "Rite Aid", "Walmart Pharmacy", "Kroger Pharmacy"
  ];

  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = prescription.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prescription.medication.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prescription.patientId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterStatus === "all" || prescription.status.toLowerCase() === filterStatus.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active": return "bg-green-100 text-green-800";
      case "completed": return "bg-gray-100 text-gray-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "expired": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high": return "bg-red-100 text-red-800";
      case "normal": return "bg-blue-100 text-blue-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleNewPrescription = () => {
    setNewPrescription({
      patientName: "",
      patientId: "",
      medication: "",
      dosage: "",
      frequency: "",
      duration: "",
      instructions: "",
      indication: "",
      pharmacy: "",
      refillsRemaining: 0,
      priority: "Normal"
    });
    setIsNewPrescriptionOpen(true);
  };

  const handleEditPrescription = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setNewPrescription({ ...prescription });
    setIsEditPrescriptionOpen(true);
  };

  const handleSavePrescription = () => {
    if (!newPrescription.patientId || !newPrescription.medication || !newPrescription.dosage) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const currentDate = new Date().toISOString().split('T')[0];
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 6);

    if (selectedPrescription) {
      // Edit existing prescription
      setPrescriptions(prescriptions.map(p => 
        p.id === selectedPrescription.id 
          ? { ...newPrescription, id: selectedPrescription.id } as Prescription
          : p
      ));
      toast({
        title: "Prescription Updated",
        description: `Prescription for ${newPrescription.patientName} has been updated.`
      });
    } else {
      // Add new prescription
      const newId = Math.max(...prescriptions.map(p => p.id)) + 1;
      const prescription: Prescription = {
        ...newPrescription,
        id: newId,
        status: "Pending",
        prescribedDate: currentDate,
        prescribedBy: "Dr. Sarah Johnson",
        expiryDate: expiryDate.toISOString().split('T')[0]
      } as Prescription;

      setPrescriptions([...prescriptions, prescription]);
      toast({
        title: "Prescription Created",
        description: `New prescription for ${newPrescription.patientName} has been created.`
      });
    }

    setIsNewPrescriptionOpen(false);
    setIsEditPrescriptionOpen(false);
    setSelectedPrescription(null);
  };

  const handlePatientSelect = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    if (patient) {
      setNewPrescription({
        ...newPrescription,
        patientId: patient.id,
        patientName: patient.name
      });
    }
  };

  const statusCounts = {
    all: prescriptions.length,
    active: prescriptions.filter(p => p.status === "Active").length,
    pending: prescriptions.filter(p => p.status === "Pending").length,
    completed: prescriptions.filter(p => p.status === "Completed").length
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1e293b]">Prescriptions</h1>
          <p className="text-gray-600">Manage patient prescriptions and medication orders</p>
        </div>
        <div className="flex gap-2">
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input 
              placeholder="Search prescriptions..." 
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button className="bg-[#2563eb] hover:bg-[#1d4ed8]" onClick={handleNewPrescription}>
            <Plus className="h-4 w-4 mr-2" />
            New Prescription
          </Button>
        </div>
      </div>

      {/* Status Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2 flex-wrap">
            <Button 
              variant={filterStatus === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("all")}
            >
              All ({statusCounts.all})
            </Button>
            <Button 
              variant={filterStatus === "active" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("active")}
            >
              Active ({statusCounts.active})
            </Button>
            <Button 
              variant={filterStatus === "pending" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("pending")}
            >
              Pending ({statusCounts.pending})
            </Button>
            <Button 
              variant={filterStatus === "completed" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("completed")}
            >
              Completed ({statusCounts.completed})
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {filteredPrescriptions.map((prescription) => (
          <Card key={prescription.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Pill className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{prescription.medication}</CardTitle>
                    <CardDescription>
                      {prescription.patientName} • {prescription.patientId}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge className={getStatusColor(prescription.status)}>
                    {prescription.status}
                  </Badge>
                  <Badge className={getPriorityColor(prescription.priority)} variant="outline">
                    {prescription.priority}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-5 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Dosage & Frequency</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div><strong>Dosage:</strong> {prescription.dosage}</div>
                    <div><strong>Frequency:</strong> {prescription.frequency}</div>
                    <div><strong>Duration:</strong> {prescription.duration}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Prescription Details</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div><strong>Prescribed:</strong> {prescription.prescribedDate}</div>
                    <div><strong>Refills:</strong> {prescription.refillsRemaining} remaining</div>
                    <div><strong>Expires:</strong> {prescription.expiryDate}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Medical Information</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div><strong>Indication:</strong> {prescription.indication}</div>
                    <div><strong>Prescribed by:</strong> {prescription.prescribedBy}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Instructions</h4>
                  <p className="text-sm text-gray-600">{prescription.instructions}</p>
                </div>
                <div className="flex justify-end items-end">
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-[#2563eb] hover:bg-[#1d4ed8]"
                      onClick={() => handleEditPrescription(prescription)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Modify
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPrescriptions.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Pill className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No prescriptions found</h3>
            <p className="text-gray-500">No prescriptions match your search criteria</p>
          </CardContent>
        </Card>
      )}

      {/* New/Edit Prescription Dialog */}
      <Dialog open={isNewPrescriptionOpen || isEditPrescriptionOpen} onOpenChange={(open) => {
        if (!open) {
          setIsNewPrescriptionOpen(false);
          setIsEditPrescriptionOpen(false);
          setSelectedPrescription(null);
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedPrescription ? "Edit Prescription" : "New Prescription"}
            </DialogTitle>
            <DialogDescription>
              {selectedPrescription ? "Modify the existing prescription details" : "Create a new prescription for a patient"}
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Information</TabsTrigger>
              <TabsTrigger value="medication">Medication Details</TabsTrigger>
              <TabsTrigger value="instructions">Instructions & Notes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patient">Patient</Label>
                  <Select 
                    value={newPrescription.patientId} 
                    onValueChange={handlePatientSelect}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select patient..." />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.name} ({patient.id})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select 
                    value={newPrescription.priority} 
                    onValueChange={(value) => setNewPrescription({...newPrescription, priority: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Normal">Normal</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="indication">Medical Indication</Label>
                <Input
                  id="indication"
                  placeholder="e.g., Hypertension, Type 2 Diabetes"
                  value={newPrescription.indication}
                  onChange={(e) => setNewPrescription({...newPrescription, indication: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pharmacy">Preferred Pharmacy</Label>
                <Select 
                  value={newPrescription.pharmacy} 
                  onValueChange={(value) => setNewPrescription({...newPrescription, pharmacy: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select pharmacy..." />
                  </SelectTrigger>
                  <SelectContent>
                    {pharmacies.map((pharmacy) => (
                      <SelectItem key={pharmacy} value={pharmacy}>
                        {pharmacy}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
            
            <TabsContent value="medication" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="medication">Medication</Label>
                  <Select 
                    value={newPrescription.medication} 
                    onValueChange={(value) => setNewPrescription({...newPrescription, medication: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select medication..." />
                    </SelectTrigger>
                    <SelectContent>
                      {medications.map((medication) => (
                        <SelectItem key={medication} value={medication}>
                          {medication}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dosage">Dosage</Label>
                  <Input
                    id="dosage"
                    placeholder="e.g., 10mg, 500mg"
                    value={newPrescription.dosage}
                    onChange={(e) => setNewPrescription({...newPrescription, dosage: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select 
                    value={newPrescription.frequency} 
                    onValueChange={(value) => setNewPrescription({...newPrescription, frequency: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Once daily">Once daily</SelectItem>
                      <SelectItem value="Twice daily">Twice daily</SelectItem>
                      <SelectItem value="Three times daily">Three times daily</SelectItem>
                      <SelectItem value="Four times daily">Four times daily</SelectItem>
                      <SelectItem value="Every 4 hours">Every 4 hours</SelectItem>
                      <SelectItem value="Every 6 hours">Every 6 hours</SelectItem>
                      <SelectItem value="Every 8 hours">Every 8 hours</SelectItem>
                      <SelectItem value="As needed">As needed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Select 
                    value={newPrescription.duration} 
                    onValueChange={(value) => setNewPrescription({...newPrescription, duration: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7 days">7 days</SelectItem>
                      <SelectItem value="14 days">14 days</SelectItem>
                      <SelectItem value="30 days">30 days</SelectItem>
                      <SelectItem value="60 days">60 days</SelectItem>
                      <SelectItem value="90 days">90 days</SelectItem>
                      <SelectItem value="6 months">6 months</SelectItem>
                      <SelectItem value="1 year">1 year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="refills">Number of Refills</Label>
                <Select 
                  value={newPrescription.refillsRemaining?.toString()} 
                  onValueChange={(value) => setNewPrescription({...newPrescription, refillsRemaining: parseInt(value)})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select refills..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0 refills</SelectItem>
                    <SelectItem value="1">1 refill</SelectItem>
                    <SelectItem value="2">2 refills</SelectItem>
                    <SelectItem value="3">3 refills</SelectItem>
                    <SelectItem value="5">5 refills</SelectItem>
                    <SelectItem value="6">6 refills</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
            
            <TabsContent value="instructions" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="instructions">Patient Instructions</Label>
                <Textarea
                  id="instructions"
                  placeholder="Enter detailed instructions for the patient..."
                  value={newPrescription.instructions}
                  onChange={(e) => setNewPrescription({...newPrescription, instructions: e.target.value})}
                  rows={6}
                />
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Prescription Summary</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <div><strong>Patient:</strong> {newPrescription.patientName || "Not selected"}</div>
                  <div><strong>Medication:</strong> {newPrescription.medication || "Not selected"}</div>
                  <div><strong>Dosage:</strong> {newPrescription.dosage || "Not specified"}</div>
                  <div><strong>Frequency:</strong> {newPrescription.frequency || "Not specified"}</div>
                  <div><strong>Duration:</strong> {newPrescription.duration || "Not specified"}</div>
                  <div><strong>Refills:</strong> {newPrescription.refillsRemaining || 0}</div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsNewPrescriptionOpen(false);
              setIsEditPrescriptionOpen(false);
              setSelectedPrescription(null);
            }}>
              Cancel
            </Button>
            <Button onClick={handleSavePrescription} className="bg-[#2563eb] hover:bg-[#1d4ed8]">
              <Pill className="mr-2 h-4 w-4" />
              {selectedPrescription ? "Update Prescription" : "Create Prescription"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Prescriptions;
