import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { FlaskRound, Search, CheckCircle, Clock, AlertTriangle, User, Calendar, FileText, TestTube } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  getAllLabRequests, 
  getPendingLabRequests,
  createLabTestFromRequest,
  generateSampleId,
  getLabRequestById,
  updateLabRequest
} from "@/services/database/lab-tests";
import { LabRequest } from "@/services/database/types";

const TestRequests: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedRequest, setSelectedRequest] = useState<LabRequest | null>(null);
  const [isProcessDialogOpen, setIsProcessDialogOpen] = useState(false);
  const [labRequests, setLabRequests] = useState<LabRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sampleId, setSampleId] = useState("");
  const [technician, setTechnician] = useState("Lab Technician"); // In real app, get from auth

  // Load lab requests on component mount
  useEffect(() => {
    loadLabRequests();
  }, []);

  const loadLabRequests = async () => {
    setIsLoading(true);
    try {
      const requests = await getAllLabRequests();
      setLabRequests(requests);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load lab requests",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRequests = labRequests.filter(request => {
    const matchesSearch = request.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.requestedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.requestedTests.some(test => 
                           test.testType.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "pending") return matchesSearch && request.status === "Pending";
    if (activeTab === "approved") return matchesSearch && request.status === "Approved";
    if (activeTab === "completed") return matchesSearch && request.status === "Completed";
    
    return matchesSearch;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "Approved":
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case "Pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "Rejected":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Approved":
        return "bg-blue-100 text-blue-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
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

  const handleProcessRequest = (request: LabRequest) => {
    setSelectedRequest(request);
    setSampleId(generateSampleId());
    setIsProcessDialogOpen(true);
  };

  const handleApproveRequest = async () => {
    if (!selectedRequest || !sampleId) {
      toast({
        title: "Error",
        description: "Please provide a sample ID",
        variant: "destructive",
      });
      return;
    }

    try {
      const success = await createLabTestFromRequest(selectedRequest._id, sampleId, technician);
      
      if (success) {
        toast({
          title: "Request Processed",
          description: `Lab request approved and sample ${sampleId} created for processing`,
        });
        
        setIsProcessDialogOpen(false);
        setSelectedRequest(null);
        setSampleId("");
        loadLabRequests(); // Refresh the list
      } else {
        toast({
          title: "Error",
          description: "Failed to process lab request",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while processing the request",
        variant: "destructive",
      });
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      const request = await getLabRequestById(requestId);
      if (request) {
        const updatedRequest = { ...request, status: "Rejected" as const };
        const success = await updateLabRequest(updatedRequest);
        
        if (success) {
          toast({
            title: "Request Rejected",
            description: "Lab request has been rejected",
          });
          loadLabRequests();
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject request",
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

  const getHighestPriority = (tests: LabRequest['requestedTests']) => {
    const priorities = tests.map(test => test.priority);
    if (priorities.includes('STAT')) return 'STAT';
    if (priorities.includes('Urgent')) return 'Urgent';
    if (priorities.includes('High')) return 'High';
    return 'Routine';
  };

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Test Requests</h1>
        <Button onClick={loadLabRequests} disabled={isLoading}>
          {isLoading ? "Loading..." : "Refresh"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5 text-indigo-600" />
            Laboratory Test Requests
          </CardTitle>
          <CardDescription>
            Process and manage laboratory test requests from doctors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="relative flex-grow">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by patient name, doctor, or test type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="all">All Requests</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="space-y-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient</TableHead>
                        <TableHead>Requested Tests</TableHead>
                        <TableHead>Requested By</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Request Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRequests.map((request) => (
                        <TableRow key={request._id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{request.patientName}</div>
                              <div className="text-sm text-gray-500">{request.patientId}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {request.requestedTests.slice(0, 2).map((test, index) => (
                                <div key={index} className="text-sm">
                                  <span className="font-medium">{test.testType}</span>
                                  <span className="text-gray-500"> - {test.specificTest}</span>
                                </div>
                              ))}
                              {request.requestedTests.length > 2 && (
                                <div className="text-sm text-gray-500">
                                  +{request.requestedTests.length - 2} more tests
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="font-medium">{request.requestedBy}</div>
                              <div className="text-gray-500">{formatDate(request.requestDate)}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getPriorityColor(getHighestPriority(request.requestedTests))}>
                              {getHighestPriority(request.requestedTests)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">
                            {formatDate(request.requestDate)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(request.status)}
                              <Badge className={getStatusColor(request.status)}>
                                {request.status}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {request.status === "Pending" && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleProcessRequest(request)}
                                    className="bg-green-50 hover:bg-green-100 text-green-700"
                                  >
                                    Process
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleRejectRequest(request._id)}
                                    className="bg-red-50 hover:bg-red-100 text-red-700"
                                  >
                                    Reject
                                  </Button>
                                </>
                              )}
                              {request.status === "Approved" && (
                                <Badge className="bg-blue-500 text-white text-xs">
                                  Ready for Testing
                                </Badge>
                              )}
                              {request.status === "Completed" && (
                                <Badge className="bg-green-500 text-white text-xs">
                                  Completed
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

      {/* Process Request Dialog */}
      <Dialog open={isProcessDialogOpen} onOpenChange={setIsProcessDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FlaskRound className="h-5 w-5" />
              Process Lab Request
            </DialogTitle>
            <DialogDescription>
              Review and approve the laboratory test request
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-6">
              {/* Patient Information */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Patient Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <span className="font-medium">Name:</span> {selectedRequest.patientName}
                  </div>
                  <div>
                    <span className="font-medium">ID:</span> {selectedRequest.patientId}
                  </div>
                  <div>
                    <span className="font-medium">Requested by:</span> {selectedRequest.requestedBy}
                  </div>
                  <div>
                    <span className="font-medium">Request Date:</span> {formatDate(selectedRequest.requestDate)}
                  </div>
                </CardContent>
              </Card>

              {/* Requested Tests */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Requested Tests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedRequest.requestedTests.map((test, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <div className="font-medium">{test.testType}</div>
                          <div className="text-sm text-gray-500">{test.specificTest}</div>
                          <div className="text-sm text-gray-500">Category: {test.testCategory}</div>
                        </div>
                        <Badge className={getPriorityColor(test.priority)}>
                          {test.priority}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Sample Information */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <TestTube className="h-4 w-4" />
                    Sample Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="sampleId">Sample ID</Label>
                    <Input
                      id="sampleId"
                      value={sampleId}
                      onChange={(e) => setSampleId(e.target.value)}
                      placeholder="Enter sample ID"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="technician">Assigned Technician</Label>
                    <Input
                      id="technician"
                      value={technician}
                      onChange={(e) => setTechnician(e.target.value)}
                      placeholder="Enter technician name"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Notes */}
              {selectedRequest.notes && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Request Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700">{selectedRequest.notes}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsProcessDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleApproveRequest}
              className="bg-green-600 hover:bg-green-700"
            >
              Approve & Create Sample
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TestRequests;
