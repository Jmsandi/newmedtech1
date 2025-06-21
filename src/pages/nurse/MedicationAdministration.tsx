import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pill, Clock, AlertTriangle, CheckCircle, Search, Plus, User, Calendar } from "lucide-react";

const MedicationAdministration: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("due");
  
  const medications = [
    {
      id: "MED001",
      patientName: "James Wilson",
      patientId: "P001",
      room: "101",
      medication: "Lisinopril 10mg",
      dosage: "10mg",
      route: "PO",
      frequency: "Once daily",
      scheduledTime: "08:00",
      status: "Due",
      priority: "Normal",
      indication: "Hypertension",
      prescribedBy: "Dr. Sarah Johnson",
      notes: "Take with food",
      lastGiven: "2024-01-14 08:00",
      nextDue: "2024-01-15 08:00"
    },
    {
      id: "MED002",
      patientName: "Maria Garcia",
      patientId: "P002",
      room: "205",
      medication: "Insulin Aspart",
      dosage: "8 units",
      route: "SubQ",
      frequency: "Before meals",
      scheduledTime: "08:00",
      status: "Overdue",
      priority: "High",
      indication: "Type 2 Diabetes",
      prescribedBy: "Dr. Michael Chen",
      notes: "Check blood glucose before administration",
      lastGiven: "2024-01-14 20:00",
      nextDue: "2024-01-15 08:00"
    },
    {
      id: "MED003",
      patientName: "Robert Chen",
      patientId: "P003",
      room: "302",
      medication: "Morphine 5mg",
      dosage: "5mg",
      route: "IV",
      frequency: "Q4H PRN",
      scheduledTime: "10:00",
      status: "Given",
      priority: "High",
      indication: "Post-operative pain",
      prescribedBy: "Dr. Emily Davis",
      notes: "Assess pain level before administration",
      lastGiven: "2024-01-15 10:00",
      nextDue: "2024-01-15 14:00"
    },
    {
      id: "MED004",
      patientName: "Sarah Thompson",
      patientId: "P004",
      room: "205",
      medication: "Metformin 500mg",
      dosage: "500mg",
      route: "PO",
      frequency: "Twice daily",
      scheduledTime: "12:00",
      status: "Due",
      priority: "Normal",
      indication: "Type 2 Diabetes",
      prescribedBy: "Dr. Michael Chen",
      notes: "Take with meals",
      lastGiven: "2024-01-14 20:00",
      nextDue: "2024-01-15 12:00"
    }
  ];

  const filteredMedications = medications.filter(med => {
    const matchesSearch = med.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         med.medication.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         med.patientId.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "due") return matchesSearch && med.status === "Due";
    if (activeTab === "overdue") return matchesSearch && med.status === "Overdue";
    if (activeTab === "given") return matchesSearch && med.status === "Given";
    if (activeTab === "high-priority") return matchesSearch && med.priority === "High";
    if (activeTab === "all") return matchesSearch;
    
    return matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Due":
        return "bg-yellow-100 text-yellow-800";
      case "Overdue":
        return "bg-red-100 text-red-800";
      case "Given":
        return "bg-green-100 text-green-800";
      case "Held":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Normal":
        return "bg-blue-100 text-blue-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleGiveMedication = (medId: string) => {
    // Handle medication administration
    console.log("Administering medication:", medId);
  };

  const handleHoldMedication = (medId: string) => {
    // Handle holding medication
    console.log("Holding medication:", medId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1e293b]">Medication Administration</h1>
          <p className="text-gray-600">Manage and track medication administration</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            MAR View
          </Button>
          <Button className="bg-[#3498db] hover:bg-[#2980b9]">
            <Plus className="mr-2 h-4 w-4" />
            Add PRN Medication
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Due Now</p>
                <h3 className="text-2xl font-bold text-yellow-600">
                  {medications.filter(med => med.status === "Due").length}
                </h3>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Overdue</p>
                <h3 className="text-2xl font-bold text-red-600">
                  {medications.filter(med => med.status === "Overdue").length}
                </h3>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Given Today</p>
                <h3 className="text-2xl font-bold text-green-600">
                  {medications.filter(med => med.status === "Given").length}
                </h3>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">High Priority</p>
                <h3 className="text-2xl font-bold text-orange-600">
                  {medications.filter(med => med.priority === "High").length}
                </h3>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Pill className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by patient name, medication, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medication Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="due">Due Now</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
          <TabsTrigger value="given">Given</TabsTrigger>
          <TabsTrigger value="high-priority">High Priority</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="space-y-4">
            {filteredMedications.map((med) => (
              <Card key={med.id} className={`${med.status === "Overdue" ? "border-red-200 bg-red-50/30" : ""}`}>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Pill className="h-5 w-5 text-[#3498db]" />
                        {med.medication}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-1">
                        <span>{med.patientName}</span>
                        <span>•</span>
                        <span>ID: {med.patientId}</span>
                        <span>•</span>
                        <span>Room {med.room}</span>
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(med.priority)}>
                        {med.priority}
                      </Badge>
                      <Badge className={getStatusColor(med.status)}>
                        {med.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {/* Medication Details */}
                    <div>
                      <h4 className="font-medium mb-3 text-[#1e293b]">Medication Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Dosage:</span>
                          <span className="font-medium">{med.dosage}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Route:</span>
                          <span className="font-medium">{med.route}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Frequency:</span>
                          <span className="font-medium">{med.frequency}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Scheduled:</span>
                          <span className="font-medium">{med.scheduledTime}</span>
                        </div>
                      </div>
                    </div>

                    {/* Clinical Information */}
                    <div>
                      <h4 className="font-medium mb-3 text-[#1e293b]">Clinical Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Indication:</span>
                          <span className="font-medium">{med.indication}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Prescribed by:</span>
                          <span className="font-medium">{med.prescribedBy}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Last given:</span>
                          <span className="font-medium">{new Date(med.lastGiven).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Next due:</span>
                          <span className="font-medium">{new Date(med.nextDue).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Special Instructions */}
                    <div>
                      <h4 className="font-medium mb-3 text-[#1e293b]">Special Instructions</h4>
                      <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                        {med.notes}
                      </div>
                      
                      {med.priority === "High" && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-center gap-2 text-red-800">
                            <AlertTriangle className="h-4 w-4" />
                            <span className="text-sm font-medium">High Priority Medication</span>
                          </div>
                          <p className="text-sm text-red-700 mt-1">
                            Requires immediate attention and careful monitoring.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between mt-6 pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <User className="h-4 w-4 mr-1" />
                        View Patient
                      </Button>
                      <Button variant="outline" size="sm">
                        View MAR
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {med.status === "Due" || med.status === "Overdue" ? (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleHoldMedication(med.id)}
                          >
                            Hold
                          </Button>
                          <Button 
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleGiveMedication(med.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Give Medication
                          </Button>
                        </>
                      ) : (
                        <Badge className={getStatusColor(med.status)}>
                          {med.status === "Given" ? "✓ Administered" : med.status}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredMedications.length === 0 && (
              <Card>
                <CardContent className="text-center py-10">
                  <Pill className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No medications found</h3>
                  <p className="text-gray-600">No medications match the current search and filter criteria.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MedicationAdministration; 