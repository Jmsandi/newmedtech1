import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Search, Download, Eye, Edit, Plus, Calendar, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PatientRecords: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editRecord, setEditRecord] = useState({
    recordType: "",
    diagnosis: "",
    provider: "",
    status: "",
    priority: "",
    notes: ""
  });
  
  const patientRecords = [
    {
      id: "R001",
      patientName: "James Wilson",
      patientId: "P001",
      recordType: "Medical History",
      date: "2024-01-15",
      diagnosis: "Hypertension",
      provider: "Dr. Sarah Johnson",
      status: "Active",
      priority: "Normal",
      notes: "Patient presents with elevated blood pressure readings. Started on ACE inhibitor therapy. Regular monitoring required.",
      vitals: {
        bloodPressure: "150/95 mmHg",
        heartRate: "78 bpm",
        temperature: "98.6°F",
        weight: "185 lbs"
      },
      medications: ["Lisinopril 10mg daily", "Hydrochlorothiazide 25mg daily"],
      allergies: ["Penicillin"],
      followUp: "2024-02-15"
    },
    {
      id: "R002",
      patientName: "Maria Garcia",
      patientId: "P002", 
      recordType: "Progress Note",
      date: "2024-01-14",
      diagnosis: "Type 2 Diabetes",
      provider: "Dr. Sarah Johnson",
      status: "Active",
      priority: "High",
      notes: "Blood glucose levels remain elevated despite medication compliance. Adjusting insulin dosage and recommending dietary consultation.",
      vitals: {
        bloodPressure: "140/85 mmHg",
        heartRate: "82 bpm",
        temperature: "98.4°F",
        weight: "165 lbs"
      },
      medications: ["Metformin 1000mg twice daily", "Insulin glargine 20 units bedtime"],
      allergies: ["Sulfa drugs"],
      followUp: "2024-01-28"
    },
    {
      id: "R003",
      patientName: "Robert Chen",
      patientId: "P003",
      recordType: "Surgical Report",
      date: "2024-01-13",
      diagnosis: "Appendectomy",
      provider: "Dr. Michael Chen",
      status: "Completed",
      priority: "Normal",
      notes: "Laparoscopic appendectomy performed successfully. No complications during surgery. Patient recovering well post-operatively.",
      vitals: {
        bloodPressure: "120/80 mmHg",
        heartRate: "75 bpm",
        temperature: "99.1°F",
        weight: "170 lbs"
      },
      medications: ["Oxycodone 5mg as needed for pain", "Cephalexin 500mg four times daily"],
      allergies: ["None known"],
      followUp: "2024-01-27"
    },
    {
      id: "R004",
      patientName: "Emma Johnson",
      patientId: "P004",
      recordType: "Prenatal Record",
      date: "2024-01-12",
      diagnosis: "Normal Pregnancy",
      provider: "Dr. Sarah Johnson",
      status: "Active",
      priority: "Routine",
      notes: "28-week prenatal visit. Fetal development progressing normally. No complications noted. Patient feeling well.",
      vitals: {
        bloodPressure: "115/70 mmHg",
        heartRate: "85 bpm",
        temperature: "98.2°F",
        weight: "145 lbs"
      },
      medications: ["Prenatal vitamins", "Iron supplement 65mg daily"],
      allergies: ["Latex"],
      followUp: "2024-02-09"
    },
    {
      id: "R005",
      patientName: "David Kim",
      patientId: "P005",
      recordType: "Emergency Report",
      date: "2024-01-11",
      diagnosis: "Asthma Attack",
      provider: "Dr. Emergency Team",
      status: "Completed",
      priority: "Urgent",
      notes: "Patient presented with acute asthma exacerbation. Treated with nebulizer treatments and corticosteroids. Symptoms resolved, discharged home.",
      vitals: {
        bloodPressure: "130/85 mmHg",
        heartRate: "95 bpm",
        temperature: "98.8°F",
        weight: "160 lbs"
      },
      medications: ["Albuterol inhaler as needed", "Prednisone 40mg daily for 5 days"],
      allergies: ["Dust mites", "Pollen"],
      followUp: "2024-01-25"
    }
  ];

  const filteredRecords = patientRecords.filter(record => {
    const matchesSearch = record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.recordType.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "active") return matchesSearch && record.status === "Active";
    if (activeTab === "completed") return matchesSearch && record.status === "Completed";
    if (activeTab === "recent") {
      const recordDate = new Date(record.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return matchesSearch && recordDate >= weekAgo;
    }
    
    return matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent":
        return "bg-red-100 text-red-800";
      case "High":
        return "bg-orange-100 text-orange-800";
      case "Normal":
        return "bg-blue-100 text-blue-800";
      case "Routine":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewRecord = (record: any) => {
    setSelectedRecord(record);
    setIsViewDialogOpen(true);
  };

  const handleEditRecord = (record: any) => {
    setSelectedRecord(record);
    setEditRecord({
      recordType: record.recordType,
      diagnosis: record.diagnosis,
      provider: record.provider,
      status: record.status,
      priority: record.priority,
      notes: record.notes
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    toast({
      title: "Record Updated",
      description: `Patient record for ${selectedRecord?.patientName} has been updated successfully.`
    });
    setIsEditDialogOpen(false);
  };

  const handleDownloadRecord = (record: any) => {
    // Simulate download
    const recordData = {
      patient: record.patientName,
      id: record.patientId,
      type: record.recordType,
      date: record.date,
      diagnosis: record.diagnosis,
      provider: record.provider,
      notes: record.notes,
      vitals: record.vitals,
      medications: record.medications,
      allergies: record.allergies
    };
    
    const dataStr = JSON.stringify(recordData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${record.patientName}_${record.recordType}_${record.date}.json`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Download Started",
      description: `Downloading record for ${record.patientName}.`
    });
  };

  const handleExportAll = () => {
    const allRecordsData = filteredRecords.map(record => ({
      patient: record.patientName,
      id: record.patientId,
      type: record.recordType,
      date: record.date,
      diagnosis: record.diagnosis,
      provider: record.provider,
      status: record.status,
      priority: record.priority
    }));
    
    const dataStr = JSON.stringify(allRecordsData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `patient_records_export_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: `Exported ${filteredRecords.length} patient records.`
    });
  };

  const handleNewRecord = () => {
    toast({
      title: "New Record",
      description: "New record creation feature will be implemented soon."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1e293b]">Patient Records</h1>
          <p className="text-gray-600">Manage and view patient medical records</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExportAll}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button className="bg-[#2563eb] hover:bg-[#1d4ed8]" onClick={handleNewRecord}>
            <Plus className="mr-2 h-4 w-4" />
            New Record
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by patient name, diagnosis, or record type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Date Range
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Records Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Records</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Medical Records
              </CardTitle>
              <CardDescription>
                Complete medical records and documentation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Record Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Diagnosis</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-10 text-gray-500">
                        No patient records found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{record.patientName}</p>
                            <p className="text-sm text-gray-500">ID: {record.patientId}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{record.recordType}</span>
                        </TableCell>
                        <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <span className="font-medium">{record.diagnosis}</span>
                        </TableCell>
                        <TableCell>{record.provider}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(record.status)}>
                            {record.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(record.priority)}>
                            {record.priority}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" onClick={() => handleViewRecord(record)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleEditRecord(record)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDownloadRecord(record)}>
                              <Download className="h-4 w-4" />
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

      {/* View Record Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Patient Record Details</DialogTitle>
            <DialogDescription>
              Complete medical record for {selectedRecord?.patientName}
            </DialogDescription>
          </DialogHeader>
          
          {selectedRecord && (
            <div className="space-y-6">
              {/* Patient Information */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Patient Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><strong>Name:</strong> {selectedRecord.patientName}</div>
                    <div><strong>Patient ID:</strong> {selectedRecord.patientId}</div>
                    <div><strong>Record Type:</strong> {selectedRecord.recordType}</div>
                    <div><strong>Date:</strong> {new Date(selectedRecord.date).toLocaleDateString()}</div>
                    <div><strong>Provider:</strong> {selectedRecord.provider}</div>
                    <div><strong>Follow-up:</strong> {new Date(selectedRecord.followUp).toLocaleDateString()}</div>
                  </div>
                </CardContent>
              </Card>

              {/* Diagnosis and Status */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Diagnosis & Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <strong>Primary Diagnosis:</strong>
                      <div className="mt-1">{selectedRecord.diagnosis}</div>
                    </div>
                    <div>
                      <strong>Status:</strong>
                      <div className="mt-1">
                        <Badge className={getStatusColor(selectedRecord.status)}>
                          {selectedRecord.status}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <strong>Priority:</strong>
                      <div className="mt-1">
                        <Badge className={getPriorityColor(selectedRecord.priority)}>
                          {selectedRecord.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Vital Signs */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Vital Signs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><strong>Blood Pressure:</strong> {selectedRecord.vitals?.bloodPressure}</div>
                    <div><strong>Heart Rate:</strong> {selectedRecord.vitals?.heartRate}</div>
                    <div><strong>Temperature:</strong> {selectedRecord.vitals?.temperature}</div>
                    <div><strong>Weight:</strong> {selectedRecord.vitals?.weight}</div>
                  </div>
                </CardContent>
              </Card>

              {/* Medications */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Current Medications</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-sm">
                    {selectedRecord.medications?.map((med: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span>{med}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Allergies */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Known Allergies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {selectedRecord.allergies?.map((allergy: string, index: number) => (
                      <Badge key={index} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        {allergy}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Clinical Notes */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Clinical Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 leading-relaxed">{selectedRecord.notes}</p>
                </CardContent>
              </Card>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => handleDownloadRecord(selectedRecord)} className="bg-[#2563eb] hover:bg-[#1d4ed8]">
              <Download className="mr-2 h-4 w-4" />
              Download Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Record Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Patient Record</DialogTitle>
            <DialogDescription>
              Update record information for {selectedRecord?.patientName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-record-type">Record Type</Label>
                <Select value={editRecord.recordType} onValueChange={(value) => setEditRecord({...editRecord, recordType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select record type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Medical History">Medical History</SelectItem>
                    <SelectItem value="Progress Note">Progress Note</SelectItem>
                    <SelectItem value="Surgical Report">Surgical Report</SelectItem>
                    <SelectItem value="Prenatal Record">Prenatal Record</SelectItem>
                    <SelectItem value="Emergency Report">Emergency Report</SelectItem>
                    <SelectItem value="Consultation">Consultation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-diagnosis">Diagnosis</Label>
                <Input
                  id="edit-diagnosis"
                  value={editRecord.diagnosis}
                  onChange={(e) => setEditRecord({...editRecord, diagnosis: e.target.value})}
                  placeholder="Enter diagnosis"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-provider">Provider</Label>
                <Input
                  id="edit-provider"
                  value={editRecord.provider}
                  onChange={(e) => setEditRecord({...editRecord, provider: e.target.value})}
                  placeholder="Enter provider name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={editRecord.status} onValueChange={(value) => setEditRecord({...editRecord, status: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-priority">Priority</Label>
              <Select value={editRecord.priority} onValueChange={(value) => setEditRecord({...editRecord, priority: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Routine">Routine</SelectItem>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-notes">Clinical Notes</Label>
              <Textarea
                id="edit-notes"
                value={editRecord.notes}
                onChange={(e) => setEditRecord({...editRecord, notes: e.target.value})}
                placeholder="Enter clinical notes..."
                rows={6}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} className="bg-[#2563eb] hover:bg-[#1d4ed8]">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientRecords; 