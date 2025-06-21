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
import { Search, Plus, Eye, Calendar, FileText, Activity, User, Clock, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TreatmentRecord {
  id: number;
  patientName: string;
  patientId: string;
  treatmentType: string;
  diagnosis: string;
  treatmentDate: string;
  duration: string;
  outcome: string;
  status: string;
  provider: string;
  notes: string;
  medications: string[];
  procedures: string[];
  followUpDate?: string;
  complications?: string;
  severity: string;
  location: string;
}

const TreatmentHistory: React.FC = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [selectedRecord, setSelectedRecord] = useState<TreatmentRecord | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isNewRecordOpen, setIsNewRecordOpen] = useState(false);
  const [newRecord, setNewRecord] = useState<Partial<TreatmentRecord>>({
    patientName: "",
    patientId: "",
    treatmentType: "",
    diagnosis: "",
    treatmentDate: "",
    duration: "",
    outcome: "",
    status: "In Progress",
    provider: "Dr. Sarah Johnson",
    notes: "",
    medications: [],
    procedures: [],
    severity: "Moderate",
    location: "Outpatient"
  });

  const [treatmentRecords, setTreatmentRecords] = useState<TreatmentRecord[]>([
    {
      id: 1,
      patientName: "James Wilson",
      patientId: "P-001",
      treatmentType: "Medication Management",
      diagnosis: "Hypertension",
      treatmentDate: "2025-01-15",
      duration: "Ongoing",
      outcome: "Blood pressure controlled",
      status: "Active",
      provider: "Dr. Sarah Johnson",
      notes: "Patient responding well to ACE inhibitor therapy. Blood pressure readings have improved significantly.",
      medications: ["Lisinopril 10mg daily", "Hydrochlorothiazide 25mg daily"],
      procedures: ["Blood pressure monitoring", "ECG"],
      followUpDate: "2025-02-15",
      severity: "Moderate",
      location: "Outpatient"
    },
    {
      id: 2,
      patientName: "Maria Garcia",
      patientId: "P-002",
      treatmentType: "Diabetes Management",
      diagnosis: "Type 2 Diabetes Mellitus",
      treatmentDate: "2025-01-10",
      duration: "6 months",
      outcome: "HbA1c improved from 9.2% to 7.1%",
      status: "Active",
      provider: "Dr. Sarah Johnson",
      notes: "Comprehensive diabetes management including medication adjustment and lifestyle counseling.",
      medications: ["Metformin 1000mg BID", "Insulin glargine 20 units daily"],
      procedures: ["HbA1c testing", "Diabetic foot exam", "Retinal screening"],
      followUpDate: "2025-02-10",
      severity: "High",
      location: "Outpatient"
    },
    {
      id: 3,
      patientName: "Robert Chen",
      patientId: "P-003",
      treatmentType: "Surgical Treatment",
      diagnosis: "Acute Appendicitis",
      treatmentDate: "2025-01-12",
      duration: "3 days",
      outcome: "Successful appendectomy, no complications",
      status: "Completed",
      provider: "Dr. Michael Chen",
      notes: "Laparoscopic appendectomy performed successfully. Patient recovered without complications.",
      medications: ["Cephalexin 500mg QID", "Oxycodone 5mg PRN"],
      procedures: ["Laparoscopic appendectomy", "Post-operative monitoring"],
      followUpDate: "2025-01-26",
      complications: "None",
      severity: "High",
      location: "Inpatient"
    },
    {
      id: 4,
      patientName: "Emma Johnson",
      patientId: "P-004",
      treatmentType: "Prenatal Care",
      diagnosis: "Normal Pregnancy (28 weeks)",
      treatmentDate: "2025-01-08",
      duration: "Ongoing",
      outcome: "Normal fetal development",
      status: "Active",
      provider: "Dr. Sarah Johnson",
      notes: "Regular prenatal visits, all parameters within normal limits. Preparing for delivery.",
      medications: ["Prenatal vitamins", "Iron supplements"],
      procedures: ["Ultrasound", "Fetal monitoring", "Blood work"],
      followUpDate: "2025-02-05",
      severity: "Low",
      location: "Outpatient"
    },
    {
      id: 5,
      patientName: "David Kim",
      patientId: "P-005",
      treatmentType: "Respiratory Treatment",
      diagnosis: "Asthma Exacerbation",
      treatmentDate: "2025-01-14",
      duration: "2 weeks",
      outcome: "Symptoms resolved, peak flow normalized",
      status: "Completed",
      provider: "Dr. Sarah Johnson",
      notes: "Acute asthma exacerbation treated with bronchodilators and corticosteroids.",
      medications: ["Albuterol inhaler", "Prednisone 40mg daily x 5 days"],
      procedures: ["Peak flow measurement", "Chest X-ray", "Pulmonary function test"],
      followUpDate: "2025-01-28",
      severity: "Moderate",
      location: "Emergency"
    },
    {
      id: 6,
      patientName: "Sarah Martinez",
      patientId: "P-006",
      treatmentType: "Neurological Treatment",
      diagnosis: "Chronic Migraine",
      treatmentDate: "2025-01-05",
      duration: "3 months",
      outcome: "50% reduction in migraine frequency",
      status: "Active",
      provider: "Dr. Sarah Johnson",
      notes: "Prophylactic treatment initiated with good response. Patient education on trigger avoidance.",
      medications: ["Propranolol 80mg daily", "Sumatriptan 50mg PRN"],
      procedures: ["Neurological examination", "MRI brain"],
      followUpDate: "2025-02-05",
      severity: "Moderate",
      location: "Outpatient"
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

  const treatmentTypes = [
    "Medication Management",
    "Surgical Treatment", 
    "Physical Therapy",
    "Diagnostic Procedure",
    "Preventive Care",
    "Emergency Treatment",
    "Chronic Disease Management",
    "Mental Health Treatment",
    "Rehabilitation",
    "Palliative Care"
  ];

  const filteredRecords = treatmentRecords.filter(record => {
    const matchesSearch = record.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.treatmentType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.patientId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || record.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesType = filterType === "all" || record.treatmentType.toLowerCase().includes(filterType.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active": return "bg-green-100 text-green-800";
      case "completed": return "bg-blue-100 text-blue-800";
      case "in progress": return "bg-yellow-100 text-yellow-800";
      case "cancelled": return "bg-red-100 text-red-800";
      case "on hold": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high": return "bg-red-100 text-red-800";
      case "moderate": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "in progress":
        return <Activity className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const handleViewDetails = (record: TreatmentRecord) => {
    setSelectedRecord(record);
    setIsDetailsOpen(true);
  };

  const handleNewRecord = () => {
    setNewRecord({
      patientName: "",
      patientId: "",
      treatmentType: "",
      diagnosis: "",
      treatmentDate: new Date().toISOString().split('T')[0],
      duration: "",
      outcome: "",
      status: "In Progress",
      provider: "Dr. Sarah Johnson",
      notes: "",
      medications: [],
      procedures: [],
      severity: "Moderate",
      location: "Outpatient"
    });
    setIsNewRecordOpen(true);
  };

  const handleSaveRecord = () => {
    if (!newRecord.patientId || !newRecord.treatmentType || !newRecord.diagnosis) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const newId = Math.max(...treatmentRecords.map(r => r.id)) + 1;
    const record: TreatmentRecord = {
      ...newRecord,
      id: newId,
      medications: newRecord.medications || [],
      procedures: newRecord.procedures || []
    } as TreatmentRecord;

    setTreatmentRecords([...treatmentRecords, record]);
    toast({
      title: "Treatment Record Added",
      description: `New treatment record for ${newRecord.patientName} has been created.`
    });
    setIsNewRecordOpen(false);
  };

  const handlePatientSelect = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    if (patient) {
      setNewRecord({
        ...newRecord,
        patientId: patient.id,
        patientName: patient.name
      });
    }
  };

  const statusCounts = {
    all: treatmentRecords.length,
    active: treatmentRecords.filter(r => r.status === "Active").length,
    completed: treatmentRecords.filter(r => r.status === "Completed").length,
    inprogress: treatmentRecords.filter(r => r.status === "In Progress").length
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1e293b]">Treatment History</h1>
          <p className="text-gray-600">Comprehensive treatment records and patient outcomes</p>
        </div>
        <div className="flex gap-2">
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input 
              placeholder="Search treatments..." 
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button className="bg-[#2563eb] hover:bg-[#1d4ed8]" onClick={handleNewRecord}>
            <Plus className="h-4 w-4 mr-2" />
            New Record
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 flex-wrap">
            <div className="flex gap-2">
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
                variant={filterStatus === "completed" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("completed")}
              >
                Completed ({statusCounts.completed})
              </Button>
              <Button 
                variant={filterStatus === "in progress" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("in progress")}
              >
                In Progress ({statusCounts.inprogress})
              </Button>
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Treatment Types</SelectItem>
                {treatmentTypes.map((type) => (
                  <SelectItem key={type} value={type.toLowerCase()}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Treatment Records */}
      <div className="grid gap-4">
        {filteredRecords.map((record) => (
          <Card key={record.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{record.treatmentType}</CardTitle>
                    <CardDescription>
                      {record.patientName} • {record.patientId} • {record.diagnosis}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge className={getStatusColor(record.status)}>
                    {getStatusIcon(record.status)}
                    <span className="ml-1">{record.status}</span>
                  </Badge>
                  <Badge className={getSeverityColor(record.severity)} variant="outline">
                    {record.severity}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Treatment Details</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div><strong>Date:</strong> {record.treatmentDate}</div>
                    <div><strong>Duration:</strong> {record.duration}</div>
                    <div><strong>Location:</strong> {record.location}</div>
                    <div><strong>Provider:</strong> {record.provider}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Medications</h4>
                  <div className="text-sm text-gray-600">
                    {record.medications.length > 0 ? (
                      <ul className="list-disc list-inside space-y-1">
                        {record.medications.slice(0, 2).map((med, index) => (
                          <li key={index}>{med}</li>
                        ))}
                        {record.medications.length > 2 && (
                          <li className="text-blue-600">+{record.medications.length - 2} more</li>
                        )}
                      </ul>
                    ) : (
                      <span className="text-gray-400">No medications</span>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Procedures</h4>
                  <div className="text-sm text-gray-600">
                    {record.procedures.length > 0 ? (
                      <ul className="list-disc list-inside space-y-1">
                        {record.procedures.slice(0, 2).map((proc, index) => (
                          <li key={index}>{proc}</li>
                        ))}
                        {record.procedures.length > 2 && (
                          <li className="text-blue-600">+{record.procedures.length - 2} more</li>
                        )}
                      </ul>
                    ) : (
                      <span className="text-gray-400">No procedures</span>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Outcome</h4>
                  <p className="text-sm text-gray-600 mb-3">{record.outcome}</p>
                  {record.followUpDate && (
                    <div className="text-sm">
                      <strong>Follow-up:</strong> {record.followUpDate}
                    </div>
                  )}
                  <div className="flex justify-end mt-3">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleViewDetails(record)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRecords.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No treatment records found</h3>
            <p className="text-gray-500">No treatment records match your search criteria</p>
          </CardContent>
        </Card>
      )}

      {/* Treatment Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Treatment Details - {selectedRecord?.treatmentType}</DialogTitle>
            <DialogDescription>
              Comprehensive treatment information for {selectedRecord?.patientName}
            </DialogDescription>
          </DialogHeader>
          
          {selectedRecord && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="medications">Medications</TabsTrigger>
                <TabsTrigger value="procedures">Procedures</TabsTrigger>
                <TabsTrigger value="notes">Notes & Outcome</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Patient Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div><strong>Name:</strong> {selectedRecord.patientName}</div>
                      <div><strong>ID:</strong> {selectedRecord.patientId}</div>
                      <div><strong>Diagnosis:</strong> {selectedRecord.diagnosis}</div>
                      <div><strong>Severity:</strong> 
                        <Badge className={`ml-2 ${getSeverityColor(selectedRecord.severity)}`}>
                          {selectedRecord.severity}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Treatment Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div><strong>Type:</strong> {selectedRecord.treatmentType}</div>
                      <div><strong>Date:</strong> {selectedRecord.treatmentDate}</div>
                      <div><strong>Duration:</strong> {selectedRecord.duration}</div>
                      <div><strong>Location:</strong> {selectedRecord.location}</div>
                      <div><strong>Provider:</strong> {selectedRecord.provider}</div>
                      <div><strong>Status:</strong> 
                        <Badge className={`ml-2 ${getStatusColor(selectedRecord.status)}`}>
                          {selectedRecord.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {selectedRecord.followUpDate && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Follow-up Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <span>Next follow-up: {selectedRecord.followUpDate}</span>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="medications" className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Prescribed Medications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedRecord.medications.length > 0 ? (
                      <ul className="space-y-2">
                        {selectedRecord.medications.map((medication, index) => (
                          <li key={index} className="flex items-center gap-2 p-2 border rounded">
                            <div className="p-1 bg-blue-100 rounded">
                              <Activity className="h-3 w-3 text-blue-600" />
                            </div>
                            <span>{medication}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">No medications prescribed for this treatment</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="procedures" className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Procedures Performed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedRecord.procedures.length > 0 ? (
                      <ul className="space-y-2">
                        {selectedRecord.procedures.map((procedure, index) => (
                          <li key={index} className="flex items-center gap-2 p-2 border rounded">
                            <div className="p-1 bg-green-100 rounded">
                              <FileText className="h-3 w-3 text-green-600" />
                            </div>
                            <span>{procedure}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">No procedures performed for this treatment</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="notes" className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Treatment Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{selectedRecord.notes}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Treatment Outcome</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{selectedRecord.outcome}</p>
                  </CardContent>
                </Card>
                
                {selectedRecord.complications && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        Complications
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{selectedRecord.complications}</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Treatment Record Dialog */}
      <Dialog open={isNewRecordOpen} onOpenChange={setIsNewRecordOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Treatment Record</DialogTitle>
            <DialogDescription>
              Create a new treatment record for a patient
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patient">Patient</Label>
                <Select 
                  value={newRecord.patientId} 
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
                <Label htmlFor="treatmentType">Treatment Type</Label>
                <Select 
                  value={newRecord.treatmentType} 
                  onValueChange={(value) => setNewRecord({...newRecord, treatmentType: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select treatment type..." />
                  </SelectTrigger>
                  <SelectContent>
                    {treatmentTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="diagnosis">Diagnosis</Label>
              <Input
                id="diagnosis"
                placeholder="Enter diagnosis..."
                value={newRecord.diagnosis}
                onChange={(e) => setNewRecord({...newRecord, diagnosis: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="treatmentDate">Treatment Date</Label>
                <Input
                  id="treatmentDate"
                  type="date"
                  value={newRecord.treatmentDate}
                  onChange={(e) => setNewRecord({...newRecord, treatmentDate: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="severity">Severity</Label>
                <Select 
                  value={newRecord.severity} 
                  onValueChange={(value) => setNewRecord({...newRecord, severity: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Select 
                  value={newRecord.location} 
                  onValueChange={(value) => setNewRecord({...newRecord, location: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Outpatient">Outpatient</SelectItem>
                    <SelectItem value="Inpatient">Inpatient</SelectItem>
                    <SelectItem value="Emergency">Emergency</SelectItem>
                    <SelectItem value="ICU">ICU</SelectItem>
                    <SelectItem value="Surgery">Surgery</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Treatment Notes</Label>
              <Textarea
                id="notes"
                placeholder="Enter detailed treatment notes..."
                value={newRecord.notes}
                onChange={(e) => setNewRecord({...newRecord, notes: e.target.value})}
                rows={4}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="outcome">Expected/Actual Outcome</Label>
              <Textarea
                id="outcome"
                placeholder="Describe the expected or actual treatment outcome..."
                value={newRecord.outcome}
                onChange={(e) => setNewRecord({...newRecord, outcome: e.target.value})}
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewRecordOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveRecord} className="bg-[#2563eb] hover:bg-[#1d4ed8]">
              <FileText className="mr-2 h-4 w-4" />
              Create Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TreatmentHistory; 