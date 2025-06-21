import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FlaskConical, Search, Download, Eye, AlertTriangle, Clock, TrendingUp, TrendingDown, CheckCircle, RefreshCw } from "lucide-react";

const LabResults: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const labResults = [
    {
      id: "LAB001",
      patientName: "James Wilson",
      patientId: "P001",
      room: "101",
      testType: "Complete Blood Count (CBC)",
      orderDate: "2024-01-15 08:00",
      completedDate: "2024-01-15 12:30",
      status: "Completed",
      priority: "Routine",
      results: {
        "White Blood Cells": { value: 7.2, unit: "K/uL", range: "4.5-11.0", status: "Normal" },
        "Red Blood Cells": { value: 4.1, unit: "M/uL", range: "4.5-5.5", status: "Low" },
        "Hemoglobin": { value: 12.5, unit: "g/dL", range: "13.5-17.5", status: "Low" },
        "Hematocrit": { value: 37.2, unit: "%", range: "41-53", status: "Low" },
        "Platelets": { value: 285, unit: "K/uL", range: "150-450", status: "Normal" }
      },
      orderedBy: "Dr. Smith",
      criticalValues: false,
      notes: "Mild anemia noted. Follow up with iron studies."
    },
    {
      id: "LAB002",
      patientName: "Maria Garcia",
      patientId: "P002",
      room: "205",
      testType: "Basic Metabolic Panel",
      orderDate: "2024-01-15 06:30",
      completedDate: "2024-01-15 10:15",
      status: "Critical",
      priority: "STAT",
      results: {
        "Glucose": { value: 285, unit: "mg/dL", range: "70-100", status: "Critical" },
        "Sodium": { value: 142, unit: "mEq/L", range: "136-145", status: "Normal" },
        "Potassium": { value: 3.2, unit: "mEq/L", range: "3.5-5.1", status: "Low" },
        "Chloride": { value: 105, unit: "mEq/L", range: "98-107", status: "Normal" },
        "BUN": { value: 35, unit: "mg/dL", range: "7-20", status: "High" },
        "Creatinine": { value: 1.8, unit: "mg/dL", range: "0.7-1.3", status: "High" }
      },
      orderedBy: "Dr. Johnson",
      criticalValues: true,
      notes: "CRITICAL: Severe hyperglycemia. Notify physician immediately."
    },
    {
      id: "LAB003",
      patientName: "Robert Chen",
      patientId: "P003",
      room: "302",
      testType: "Liver Function Panel",
      orderDate: "2024-01-15 09:00",
      completedDate: null,
      status: "Pending",
      priority: "Routine",
      results: null,
      orderedBy: "Dr. Williams",
      criticalValues: false,
      estimatedCompletion: "2024-01-15 16:00"
    },
    {
      id: "LAB004",
      patientName: "Sarah Thompson",
      patientId: "P004",
      room: "108",
      testType: "Cardiac Markers",
      orderDate: "2024-01-15 11:30",
      completedDate: "2024-01-15 14:45",
      status: "Completed",
      priority: "STAT",
      results: {
        "Troponin I": { value: 0.02, unit: "ng/mL", range: "<0.04", status: "Normal" },
        "CK-MB": { value: 3.2, unit: "ng/mL", range: "0.0-6.3", status: "Normal" },
        "Total CK": { value: 120, unit: "U/L", range: "30-200", status: "Normal" }
      },
      orderedBy: "Dr. Brown",
      criticalValues: false,
      notes: "Cardiac markers within normal limits. Rule out MI negative."
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Critical":
        return "bg-red-100 text-red-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "STAT":
        return "bg-red-100 text-red-800";
      case "Urgent":
        return "bg-orange-100 text-orange-800";
      case "Routine":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getResultStatusIcon = (status: string) => {
    switch (status) {
      case "Critical":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "High":
        return <TrendingUp className="h-4 w-4 text-orange-600" />;
      case "Low":
        return <TrendingDown className="h-4 w-4 text-orange-600" />;
      case "Normal":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return null;
    }
  };

  const getResultStatusColor = (status: string) => {
    switch (status) {
      case "Critical":
        return "text-red-600 font-bold";
      case "High":
      case "Low":
        return "text-orange-600 font-medium";
      case "Normal":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const filteredResults = labResults.filter(result => {
    const matchesSearch = result.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.testType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.patientId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || result.status.toLowerCase() === statusFilter;
    const matchesPriority = priorityFilter === "all" || result.priority.toLowerCase() === priorityFilter;
    
    let matchesTab = true;
    if (activeTab === "pending") matchesTab = result.status === "Pending";
    if (activeTab === "completed") matchesTab = result.status === "Completed";
    if (activeTab === "critical") matchesTab = result.criticalValues || result.status === "Critical";
    
    return matchesSearch && matchesStatus && matchesPriority && matchesTab;
  });

  const handleViewResults = (result: any) => {
    console.log("Viewing results for:", result.id);
  };

  const handleDownloadResults = (result: any) => {
    console.log("Downloading results for:", result.id);
  };

  const handleNotifyPhysician = (result: any) => {
    console.log("Notifying physician about:", result.id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1e293b]">Lab Results</h1>
          <p className="text-gray-600">View and manage patient laboratory results</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button className="bg-[#3498db] hover:bg-[#2980b9]">
            <FlaskConical className="mr-2 h-4 w-4" />
            New Lab Order
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending Results</p>
                <h3 className="text-2xl font-bold text-yellow-600">
                  {labResults.filter(r => r.status === "Pending").length}
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
                <p className="text-sm font-medium text-gray-500">Critical Values</p>
                <h3 className="text-2xl font-bold text-red-600">
                  {labResults.filter(r => r.criticalValues || r.status === "Critical").length}
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
                <p className="text-sm font-medium text-gray-500">Completed Today</p>
                <h3 className="text-2xl font-bold text-[#3498db]">
                  {labResults.filter(r => r.status === "Completed").length}
                </h3>
              </div>
              <div className="bg-[#3498db]/10 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-[#3498db]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">STAT Orders</p>
                <h3 className="text-2xl font-bold text-orange-600">
                  {labResults.filter(r => r.priority === "STAT").length}
                </h3>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <FlaskConical className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by patient name, test type, or patient ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="stat">STAT</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="routine">Routine</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lab Results Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Results</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="critical">Critical</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="space-y-4">
            {filteredResults.map((result) => (
              <Card key={result.id} className={`${result.criticalValues || result.status === "Critical" ? "border-red-200 bg-red-50/30" : ""}`}>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-lg">{result.testType}</CardTitle>
                        {result.criticalValues && (
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <CardDescription className="flex items-center gap-4 mt-1">
                        <span>{result.patientName}</span>
                        <span>•</span>
                        <span>ID: {result.patientId}</span>
                        <span>•</span>
                        <span>Room {result.room}</span>
                        <span>•</span>
                        <span>Ordered by {result.orderedBy}</span>
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(result.status)}>
                        {result.status}
                      </Badge>
                      <Badge className={getPriorityColor(result.priority)}>
                        {result.priority}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 text-sm text-gray-600 mb-4">
                    <div>
                      <p><strong>Order Date:</strong> {new Date(result.orderDate).toLocaleString()}</p>
                      {result.completedDate && (
                        <p><strong>Completed:</strong> {new Date(result.completedDate).toLocaleString()}</p>
                      )}
                      {result.estimatedCompletion && !result.completedDate && (
                        <p><strong>Est. Completion:</strong> {new Date(result.estimatedCompletion).toLocaleString()}</p>
                      )}
                    </div>
                    <div>
                      <p><strong>Lab ID:</strong> {result.id}</p>
                      {result.criticalValues && (
                        <p className="text-red-600 font-bold"><strong>⚠️ CRITICAL VALUES PRESENT</strong></p>
                      )}
                    </div>
                  </div>

                  {/* Lab Results Display */}
                  {result.results && (
                    <div className="mb-4">
                      <h4 className="font-medium mb-3 text-[#1e293b]">Test Results:</h4>
                      <div className="grid gap-3">
                        {Object.entries(result.results).map(([testName, testData]: [string, any]) => (
                          <div key={testName} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              {getResultStatusIcon(testData.status)}
                              <span className="font-medium">{testName}</span>
                            </div>
                            <div className="text-right">
                              <div className={`text-lg font-bold ${getResultStatusColor(testData.status)}`}>
                                {testData.value} {testData.unit}
                              </div>
                              <div className="text-xs text-gray-500">
                                Ref: {testData.range}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {result.notes && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{result.notes}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-2 pt-4 border-t">
                    {result.status === "Completed" && (
                      <>
                        <Button variant="outline" size="sm" onClick={() => handleViewResults(result)}>
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDownloadResults(result)}>
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </>
                    )}
                    {(result.criticalValues || result.status === "Critical") && (
                      <Button size="sm" className="bg-red-600 hover:bg-red-700" onClick={() => handleNotifyPhysician(result)}>
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Notify Physician
                      </Button>
                    )}
                    {result.status === "Pending" && (
                      <Button variant="outline" size="sm">
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Check Status
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredResults.length === 0 && (
              <Card>
                <CardContent className="text-center py-10">
                  <FlaskConical className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No lab results found</h3>
                  <p className="text-gray-600">No lab results match the current search and filter criteria.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LabResults; 