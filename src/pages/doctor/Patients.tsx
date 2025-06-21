import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Search, ArrowRight, ClipboardList, Eye, Edit, Phone, MessageSquare, Activity, FileText, Calendar, AlertTriangle, Heart, Thermometer, Droplets } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PatientCard: React.FC<{
  patient: any;
  onViewDetails: (patient: any) => void;
  onCreateCarePlan: (patient: any) => void;
  onContactPatient: (patient: any) => void;
}> = ({ patient, onViewDetails, onCreateCarePlan, onContactPatient }) => {
  const statusColor = 
    patient.status === "Critical" ? "bg-[#dc2626]" : 
    patient.status === "Stable" ? "bg-[#22c55e]" : 
    "bg-[#eab308]";

  const priorityColor = 
    patient.priority === "High" ? "bg-red-100 text-red-800" :
    patient.priority === "Medium" ? "bg-yellow-100 text-yellow-800" :
    "bg-green-100 text-green-800";

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-medium text-[#1e293b]">{patient.name}</h3>
            <p className="text-sm text-gray-500">{patient.age} years • {patient.gender} • Room {patient.room}</p>
            <p className="text-xs text-gray-400">ID: {patient.id}</p>
          </div>
          <div className="flex flex-col gap-1">
            <Badge className={statusColor}>{patient.status}</Badge>
            <Badge className={priorityColor} variant="outline">{patient.priority}</Badge>
          </div>
        </div>
        
        <div className="space-y-3 mb-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Primary Condition</p>
            <p className="text-[#1e293b]">{patient.condition}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-sm font-medium text-gray-500">Last Visit</p>
              <p className="text-sm text-[#1e293b]">{patient.lastVisit}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Next Appointment</p>
              <p className="text-sm text-[#1e293b]">{patient.nextAppointment}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Assigned Nurse</p>
            <p className="text-sm text-[#1e293b]">{patient.assignedNurse || "Not assigned"}</p>
          </div>

          {patient.alerts && patient.alerts.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Active Alerts</p>
              <div className="flex flex-wrap gap-1">
                {patient.alerts.map((alert: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs bg-orange-50 text-orange-700">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    {alert}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {patient.vitals && (
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">Latest Vitals</p>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <Heart className="h-3 w-3 text-red-500" />
                  <span>{patient.vitals.heartRate} bpm</span>
                </div>
                <div className="flex items-center gap-1">
                  <Thermometer className="h-3 w-3 text-blue-500" />
                  <span>{patient.vitals.temperature}°F</span>
                </div>
                <div className="flex items-center gap-1">
                  <Droplets className="h-3 w-3 text-purple-500" />
                  <span>{patient.vitals.bloodPressure}</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex gap-2 mt-4">
          <Button 
            className="flex-1 text-xs h-8" 
            variant="outline"
            onClick={() => onViewDetails(patient)}
          >
            <Eye className="mr-1 h-3 w-3" />
            View Details
          </Button>
          <Button 
            className="flex-1 text-xs h-8 bg-[#2563eb] hover:bg-[#1d4ed8]"
            onClick={() => onCreateCarePlan(patient)}
          >
            <ClipboardList className="mr-1 h-3 w-3" />
            Care Plan
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onContactPatient(patient)}
          >
            <Phone className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const DoctorPatients: React.FC = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isCarePlanDialogOpen, setIsCarePlanDialogOpen] = useState(false);
  const [carePlanNotes, setCarePlanNotes] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  
  const patients = [
    { 
      id: "P001",
      name: "James Wilson", 
      age: 48, 
      gender: "Male", 
      condition: "Hypertension", 
      status: "Monitoring", 
      priority: "Medium",
      lastVisit: "May 1, 2025",
      nextAppointment: "May 8, 2025",
      room: "201A",
      assignedNurse: "Rachel Greene",
      admissionDate: "April 28, 2025",
      emergencyContact: "Jane Wilson (Wife)",
      emergencyPhone: "+1 (555) 123-4568",
      insurance: "Blue Cross Blue Shield",
      allergies: ["Penicillin"],
      currentMedications: ["Lisinopril 10mg daily", "Metformin 500mg twice daily"],
      alerts: ["BP Check Due"],
      vitals: {
        heartRate: 78,
        temperature: 98.6,
        bloodPressure: "140/90",
        oxygenSaturation: 98
      },
      recentNotes: "Blood pressure slightly elevated, monitoring response to medication adjustment.",
      carePlan: "Continue current medication regimen, monitor BP daily, dietary consultation scheduled."
    },
    { 
      id: "P002",
      name: "Maria Garcia", 
      age: 62, 
      gender: "Female", 
      condition: "Diabetes Type 2", 
      status: "Stable", 
      priority: "High",
      lastVisit: "April 30, 2025",
      nextAppointment: "May 7, 2025",
      room: "203B",
      assignedNurse: "Jessica Chen",
      admissionDate: "April 25, 2025",
      emergencyContact: "Carlos Garcia (Husband)",
      emergencyPhone: "+1 (555) 234-5679",
      insurance: "Aetna",
      allergies: ["Sulfa drugs"],
      currentMedications: ["Insulin 20 units", "Metformin 1000mg twice daily"],
      alerts: ["Glucose Check", "Insulin Due"],
      vitals: {
        heartRate: 82,
        temperature: 99.1,
        bloodPressure: "130/85",
        oxygenSaturation: 97
      },
      recentNotes: "Blood glucose levels stabilizing with current insulin regimen.",
      carePlan: "Continue insulin therapy, monitor glucose levels q6h, diabetic diet education."
    },
    { 
      id: "P003",
      name: "Robert Chen", 
      age: 54, 
      gender: "Male", 
      condition: "Post-op Recovery", 
      status: "Critical", 
      priority: "High",
      lastVisit: "May 1, 2025",
      nextAppointment: "May 3, 2025",
      room: "105C",
      assignedNurse: "Marcus Johnson",
      admissionDate: "April 30, 2025",
      emergencyContact: "Linda Chen (Wife)",
      emergencyPhone: "+1 (555) 345-6790",
      insurance: "United Healthcare",
      allergies: ["None known"],
      currentMedications: ["Oxycodone 5mg q6h PRN", "Cephalexin 500mg q8h"],
      alerts: ["Wound Check", "Pain Assessment"],
      vitals: {
        heartRate: 95,
        temperature: 100.2,
        bloodPressure: "125/80",
        oxygenSaturation: 96
      },
      recentNotes: "Post-operative day 2, surgical site clean and dry, pain well controlled.",
      carePlan: "Daily wound assessment, pain management, early mobilization, antibiotic course."
    },
    { 
      id: "P004",
      name: "Emma Johnson", 
      age: 34, 
      gender: "Female", 
      condition: "Pregnancy (28 weeks)", 
      status: "Stable", 
      priority: "Low",
      lastVisit: "April 29, 2025",
      nextAppointment: "May 6, 2025",
      room: "301A",
      assignedNurse: "Sophia Martinez",
      admissionDate: "April 27, 2025",
      emergencyContact: "Michael Johnson (Husband)",
      emergencyPhone: "+1 (555) 456-7891",
      insurance: "Cigna",
      allergies: ["Latex"],
      currentMedications: ["Prenatal vitamins", "Iron supplements"],
      alerts: [],
      vitals: {
        heartRate: 88,
        temperature: 98.4,
        bloodPressure: "110/70",
        oxygenSaturation: 99
      },
      recentNotes: "Routine prenatal visit, fetal heart rate normal, no complications.",
      carePlan: "Regular prenatal monitoring, nutritional counseling, prepare for delivery."
    },
    { 
      id: "P005",
      name: "David Kim", 
      age: 22, 
      gender: "Male", 
      condition: "Asthma", 
      status: "Monitoring", 
      priority: "Medium",
      lastVisit: "April 30, 2025",
      nextAppointment: "May 14, 2025",
      room: "102B",
      assignedNurse: "Rachel Greene",
      admissionDate: "April 29, 2025",
      emergencyContact: "Sarah Kim (Mother)",
      emergencyPhone: "+1 (555) 567-8902",
      insurance: "Kaiser Permanente",
      allergies: ["Dust mites", "Pollen"],
      currentMedications: ["Albuterol inhaler PRN", "Fluticasone 2 puffs BID"],
      alerts: ["Inhaler Technique Review"],
      vitals: {
        heartRate: 75,
        temperature: 98.2,
        bloodPressure: "118/75",
        oxygenSaturation: 98
      },
      recentNotes: "Asthma well controlled with current medications, peak flow improved.",
      carePlan: "Continue current inhaler regimen, allergen avoidance education, follow-up in 2 weeks."
    },
    { 
      id: "P006",
      name: "Sarah Martinez", 
      age: 41, 
      gender: "Female", 
      condition: "Migraine", 
      status: "Stable", 
      priority: "Low",
      lastVisit: "April 28, 2025",
      nextAppointment: "May 12, 2025",
      room: "204A",
      assignedNurse: "Marcus Johnson",
      admissionDate: "April 26, 2025",
      emergencyContact: "Jose Martinez (Brother)",
      emergencyPhone: "+1 (555) 678-9013",
      insurance: "Blue Cross Blue Shield",
      allergies: ["Aspirin"],
      currentMedications: ["Sumatriptan 50mg PRN", "Propranolol 40mg BID"],
      alerts: [],
      vitals: {
        heartRate: 72,
        temperature: 98.5,
        bloodPressure: "115/75",
        oxygenSaturation: 99
      },
      recentNotes: "Migraine frequency reduced with prophylactic treatment.",
      carePlan: "Continue prophylactic therapy, trigger identification, stress management."
    }
  ];
  
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         patient.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         patient.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterStatus === "all" || patient.status.toLowerCase() === filterStatus.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  const handleViewDetails = (patient: any) => {
    setSelectedPatient(patient);
    setIsDetailsDialogOpen(true);
  };

  const handleCreateCarePlan = (patient: any) => {
    setSelectedPatient(patient);
    setCarePlanNotes(patient.carePlan || "");
    setIsCarePlanDialogOpen(true);
  };

  const handleContactPatient = (patient: any) => {
    toast({
      title: "Contact Patient",
      description: `Calling ${patient.name} at ${patient.emergencyPhone}`,
    });
  };

  const handleSaveCarePlan = () => {
    toast({
      title: "Care Plan Updated",
      description: `Care plan for ${selectedPatient?.name} has been updated successfully.`,
    });
    setIsCarePlanDialogOpen(false);
  };

  const statusCounts = {
    all: patients.length,
    stable: patients.filter(p => p.status === "Stable").length,
    monitoring: patients.filter(p => p.status === "Monitoring").length,
    critical: patients.filter(p => p.status === "Critical").length
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1e293b]">Current Patients</h1>
          <p className="text-gray-600">Monitor and manage your assigned patients</p>
        </div>
        <div className="flex gap-2">
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input 
              placeholder="Search patients..." 
              className="pl-8 w-full md:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button className="bg-[#2563eb] hover:bg-[#1d4ed8]">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule
          </Button>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2 flex-wrap">
            <Button 
              variant={filterStatus === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("all")}
            >
              All Patients ({statusCounts.all})
            </Button>
            <Button 
              variant={filterStatus === "stable" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("stable")}
            >
              Stable ({statusCounts.stable})
            </Button>
            <Button 
              variant={filterStatus === "monitoring" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("monitoring")}
            >
              Monitoring ({statusCounts.monitoring})
            </Button>
            <Button 
              variant={filterStatus === "critical" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("critical")}
            >
              Critical ({statusCounts.critical})
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>My Patients</CardTitle>
          <CardDescription>
            You have {patients.length} patients assigned to your care
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPatients.map((patient) => (
              <PatientCard 
                key={patient.id} 
                patient={patient}
                onViewDetails={handleViewDetails}
                onCreateCarePlan={handleCreateCarePlan}
                onContactPatient={handleContactPatient}
              />
            ))}
          </div>
          
          {filteredPatients.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              No patients match your search criteria
            </div>
          )}
          
          {filteredPatients.length > 0 && filteredPatients.length < patients.length && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">
                Showing {filteredPatients.length} of {patients.length} patients
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Patient Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Patient Details - {selectedPatient?.name}</DialogTitle>
            <DialogDescription>
              Comprehensive patient information and medical history
            </DialogDescription>
          </DialogHeader>
          
          {selectedPatient && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="medical">Medical Info</TabsTrigger>
                <TabsTrigger value="vitals">Vitals</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Patient Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div><strong>ID:</strong> {selectedPatient.id}</div>
                      <div><strong>Age:</strong> {selectedPatient.age} years</div>
                      <div><strong>Gender:</strong> {selectedPatient.gender}</div>
                      <div><strong>Room:</strong> {selectedPatient.room}</div>
                      <div><strong>Admission:</strong> {selectedPatient.admissionDate}</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div><strong>Emergency Contact:</strong> {selectedPatient.emergencyContact}</div>
                      <div><strong>Phone:</strong> {selectedPatient.emergencyPhone}</div>
                      <div><strong>Insurance:</strong> {selectedPatient.insurance}</div>
                      <div><strong>Assigned Nurse:</strong> {selectedPatient.assignedNurse}</div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="medical" className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Medical Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <strong>Primary Condition:</strong> {selectedPatient.condition}
                      </div>
                      <div>
                        <strong>Status:</strong> 
                        <Badge className="ml-2">{selectedPatient.status}</Badge>
                      </div>
                      <div>
                        <strong>Priority:</strong> 
                        <Badge variant="outline" className="ml-2">{selectedPatient.priority}</Badge>
                      </div>
                      <div>
                        <strong>Allergies:</strong> {selectedPatient.allergies.join(", ") || "None known"}
                      </div>
                      <div>
                        <strong>Current Medications:</strong>
                        <ul className="list-disc list-inside mt-1 ml-4">
                          {selectedPatient.currentMedications.map((med: string, index: number) => (
                            <li key={index} className="text-sm">{med}</li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="vitals" className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Latest Vital Signs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-red-500" />
                        <div>
                          <p className="font-medium">Heart Rate</p>
                          <p className="text-2xl">{selectedPatient.vitals.heartRate} bpm</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Thermometer className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="font-medium">Temperature</p>
                          <p className="text-2xl">{selectedPatient.vitals.temperature}°F</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Droplets className="h-5 w-5 text-purple-500" />
                        <div>
                          <p className="font-medium">Blood Pressure</p>
                          <p className="text-2xl">{selectedPatient.vitals.bloodPressure}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="font-medium">Oxygen Saturation</p>
                          <p className="text-2xl">{selectedPatient.vitals.oxygenSaturation}%</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="notes" className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Recent Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{selectedPatient.recentNotes}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Current Care Plan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{selectedPatient.carePlan}</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
              Close
            </Button>
            <Button className="bg-[#2563eb] hover:bg-[#1d4ed8]">
              <Edit className="mr-2 h-4 w-4" />
              Edit Patient
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Care Plan Dialog */}
      <Dialog open={isCarePlanDialogOpen} onOpenChange={setIsCarePlanDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Care Plan - {selectedPatient?.name}</DialogTitle>
            <DialogDescription>
              Create or update the care plan for this patient
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="care-plan">Care Plan Details</Label>
              <Textarea
                id="care-plan"
                placeholder="Enter detailed care plan instructions..."
                value={carePlanNotes}
                onChange={(e) => setCarePlanNotes(e.target.value)}
                rows={8}
                className="mt-2"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCarePlanDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCarePlan} className="bg-[#2563eb] hover:bg-[#1d4ed8]">
              <ClipboardList className="mr-2 h-4 w-4" />
              Save Care Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorPatients;
