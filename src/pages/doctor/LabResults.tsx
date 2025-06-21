import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FlaskRound, Search, Download, Eye, AlertTriangle, CheckCircle, Clock, TrendingUp, TrendingDown, User, Calendar, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  getAllLabTests, 
  getLabTestsForDoctor, 
  getLabTestsRequiringReview,
  reviewLabTest,
  getLabStatistics 
} from "@/services/database/lab-tests";
import { LabTest, TestParameter } from "@/services/database/types";

const LabResults: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedResult, setSelectedResult] = useState<LabTest | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [labTests, setLabTests] = useState<LabTest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statistics, setStatistics] = useState<any>(null);
  
  // Load lab tests on component mount
  useEffect(() => {
    loadLabTests();
    loadStatistics();
  }, []);

  const loadLabTests = async () => {
    setIsLoading(true);
    try {
      const tests = await getAllLabTests();
      setLabTests(tests);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load lab tests",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const stats = await getLabStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error("Failed to load statistics:", error);
    }
  };

  const filteredResults = labTests.filter(result => {
    const matchesSearch = result.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.testType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.sampleId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "pending") return matchesSearch && (result.status === "Pending" || result.status === "Collected");
    if (activeTab === "complete") return matchesSearch && result.status === "Completed";
    if (activeTab === "abnormal") return matchesSearch && result.abnormalResults;
    if (activeTab === "critical") return matchesSearch && result.criticalValues;
    
    return matchesSearch;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "Pending":
      case "Collected":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "Processing":
        return <Clock className="h-4 w-4 text-blue-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Collected":
        return "bg-blue-100 text-blue-800";
      case "Processing":
        return "bg-purple-100 text-purple-800";
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
      case "High":
        return "bg-yellow-100 text-yellow-800";
      case "Routine":
        return "bg-gray-100 text-gray-800";
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

  const handleViewResult = (result: LabTest) => {
    setSelectedResult(result);
    setIsViewDialogOpen(true);
  };

  const handleDownloadResult = (result: LabTest) => {
    const resultData = {
      patient: result.patientName,
      patientId: result.patientId,
      testType: result.testType,
      sampleId: result.sampleId,
      requestDate: result.requestDate,
      completionDate: result.completionDate,
      status: result.status,
      priority: result.priority,
      requestedBy: result.requestedBy,
      technician: result.technician,
      testParameters: result.testParameters,
      clinicalNotes: result.clinicalNotes,
      abnormalResults: result.abnormalResults,
      criticalValues: result.criticalValues
    };

    const blob = new Blob([JSON.stringify(resultData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lab_result_${result.sampleId || result._id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download Started",
      description: "Lab result has been downloaded",
    });
  };

  const handleReviewResult = async (testId: string, notes?: string) => {
    try {
      const success = await reviewLabTest(testId, "Dr. Current User", notes);
      if (success) {
        toast({
          title: "Result Reviewed",
          description: "Lab result has been marked as reviewed",
        });
        loadLabTests(); // Refresh the list
        setIsViewDialogOpen(false);
      } else {
        toast({
          title: "Error",
          description: "Failed to review lab result",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while reviewing the result",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Laboratory Results</h1>
        <Button onClick={loadLabTests} disabled={isLoading}>
          {isLoading ? "Loading..." : "Refresh"}
        </Button>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Tests</p>
                  <p className="text-2xl font-bold">{statistics.totalTests}</p>
                </div>
                <FlaskRound className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{statistics.pendingTests}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Critical Results</p>
                  <p className="text-2xl font-bold text-red-600">{statistics.criticalResults}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Need Review</p>
                  <p className="text-2xl font-bold text-orange-600">{statistics.testsRequiringReview}</p>
                </div>
                <Eye className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FlaskRound className="h-5 w-5 text-indigo-600" />
            Lab Results Management
          </CardTitle>
          <CardDescription>
            View and manage laboratory test results from lab technicians
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="relative flex-grow">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by patient name, test type, or sample ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All Results</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="complete">Complete</TabsTrigger>
                <TabsTrigger value="abnormal">Abnormal</TabsTrigger>
                <TabsTrigger value="critical">Critical</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="space-y-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient</TableHead>
                        <TableHead>Test Type</TableHead>
                        <TableHead>Sample ID</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Request Date</TableHead>
                        <TableHead>Completion Date</TableHead>
                        <TableHead>Technician</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredResults.map((result) => (
                        <TableRow key={result._id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{result.patientName}</div>
                              <div className="text-sm text-gray-500">{result.patientId}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{result.testType}</div>
                              <div className="text-sm text-gray-500">{result.specificTest}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{result.sampleId || "N/A"}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(result.status)}
                              <Badge className={getStatusColor(result.status)}>
                                {result.status}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getPriorityColor(result.priority)}>
                              {result.priority}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">
                            {formatDate(result.requestDate)}
                          </TableCell>
                          <TableCell className="text-sm">
                            {result.completionDate ? formatDate(result.completionDate) : "N/A"}
                          </TableCell>
                          <TableCell className="text-sm">
                            {result.technician || "N/A"}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewResult(result)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownloadResult(result)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              {(result.abnormalResults || result.criticalValues) && !result.reviewedBy && (
                                <Badge className="bg-orange-500 text-white text-xs">
                                  Needs Review
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* View Result Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FlaskRound className="h-5 w-5" />
              Lab Result Details
            </DialogTitle>
            <DialogDescription>
              Detailed view of laboratory test results
            </DialogDescription>
          </DialogHeader>
          
          {selectedResult && (
            <div className="space-y-6">
              {/* Patient and Test Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Patient Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <span className="font-medium">Name:</span> {selectedResult.patientName}
                    </div>
                    <div>
                      <span className="font-medium">ID:</span> {selectedResult.patientId}
                    </div>
                    <div>
                      <span className="font-medium">Sample ID:</span> {selectedResult.sampleId || "N/A"}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Test Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <span className="font-medium">Test:</span> {selectedResult.testType}
                    </div>
                    <div>
                      <span className="font-medium">Requested by:</span> {selectedResult.requestedBy}
                    </div>
                    <div>
                      <span className="font-medium">Technician:</span> {selectedResult.technician || "N/A"}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span> 
                      <Badge className={`ml-2 ${getStatusColor(selectedResult.status)}`}>
                        {selectedResult.status}
                      </Badge>
                    </div>
                    <div>
                      <span className="font-medium">Priority:</span> 
                      <Badge className={`ml-2 ${getPriorityColor(selectedResult.priority)}`}>
                        {selectedResult.priority}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Test Results */}
              {selectedResult.testParameters && selectedResult.testParameters.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Test Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedResult.testParameters.map((param) => (
                        <div key={param.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center p-3 border rounded">
                          <div className="font-medium">{param.name}</div>
                          <div className="flex items-center gap-2">
                            <span className={getResultStatusColor(param.status)}>
                              {param.value} {param.unit}
                            </span>
                            {getResultStatusIcon(param.status)}
                          </div>
                          <div className="text-sm text-gray-500">
                            Range: {param.referenceRange}
                          </div>
                          <div>
                            <Badge className={`text-xs ${
                              param.status === 'Critical' ? 'bg-red-500' :
                              param.status === 'High' || param.status === 'Low' ? 'bg-orange-500' :
                              param.status === 'Abnormal' ? 'bg-yellow-500' : 'bg-green-500'
                            }`}>
                              {param.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Clinical Notes */}
              {selectedResult.clinicalNotes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Clinical Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-wrap">{selectedResult.clinicalNotes}</p>
                  </CardContent>
                </Card>
              )}

              {/* Alerts */}
              {(selectedResult.abnormalResults || selectedResult.criticalValues) && (
                <Card className="border-orange-200 bg-orange-50">
                  <CardHeader>
                    <CardTitle className="text-sm text-orange-800 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Attention Required
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedResult.criticalValues && (
                        <div className="text-red-600 font-medium">
                          ⚠️ Critical values detected - Immediate attention required
                        </div>
                      )}
                      {selectedResult.abnormalResults && (
                        <div className="text-orange-600">
                          📊 Abnormal results detected - Review recommended
                        </div>
                      )}
                      {!selectedResult.reviewedBy && (
                        <div className="text-blue-600">
                          👨‍⚕️ Awaiting physician review
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            {selectedResult && (selectedResult.abnormalResults || selectedResult.criticalValues) && !selectedResult.reviewedBy && (
              <Button onClick={() => handleReviewResult(selectedResult._id)}>
                Mark as Reviewed
              </Button>
            )}
            {selectedResult && (
              <Button onClick={() => handleDownloadResult(selectedResult)}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LabResults; 