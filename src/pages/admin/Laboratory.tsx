
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Search, Edit, Trash2, FlaskRound, Eye, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

// Mock data for laboratory tests
const mockLabTests = [
  { id: 1, patientName: "John Doe", patientId: "P001", testType: "Complete Blood Count", requestedBy: "Dr. Emily Wilson", status: "Completed", requestDate: "2025-04-28", completionDate: "2025-04-29", result: "Normal" },
  { id: 2, patientName: "Jane Smith", patientId: "P002", testType: "Blood Glucose", requestedBy: "Dr. Robert Chen", status: "Pending", requestDate: "2025-04-28", completionDate: "", result: "" },
  { id: 3, patientName: "Bob Johnson", patientId: "P003", testType: "Liver Function", requestedBy: "Dr. Michael Stevens", status: "In Progress", requestDate: "2025-04-27", completionDate: "", result: "" },
  { id: 4, patientName: "Mary Williams", patientId: "P004", testType: "Urinalysis", requestedBy: "Dr. Sarah Adams", status: "Completed", requestDate: "2025-04-26", completionDate: "2025-04-27", result: "Abnormal" },
  { id: 5, patientName: "James Brown", patientId: "P005", testType: "Lipid Panel", requestedBy: "Dr. Thomas Lee", status: "Completed", requestDate: "2025-04-25", completionDate: "2025-04-26", result: "Normal" }
];

// Mock data for test types
const testTypes = [
  "Complete Blood Count",
  "Blood Glucose",
  "Lipid Panel",
  "Liver Function",
  "Kidney Function",
  "Thyroid Function",
  "Urinalysis",
  "Electrolytes",
  "HbA1c",
  "COVID-19 PCR"
];

interface LabTest {
  id: number;
  patientName: string;
  patientId: string;
  testType: string;
  requestedBy: string;
  status: string;
  requestDate: string;
  completionDate: string;
  result: string;
  resultDetails?: string;
}

const Laboratory = () => {
  const { toast } = useToast();
  const [labTests, setLabTests] = useState<LabTest[]>(mockLabTests);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentLabTest, setCurrentLabTest] = useState<LabTest>({
    id: 0,
    patientName: "",
    patientId: "",
    testType: "",
    requestedBy: "",
    status: "Pending",
    requestDate: new Date().toISOString().split('T')[0],
    completionDate: "",
    result: ""
  });

  // Filter lab tests based on search term
  const filteredLabTests = labTests.filter((test) =>
    test.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    test.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    test.testType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    test.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTest = () => {
    setIsEditMode(false);
    setIsViewMode(false);
    setCurrentLabTest({
      id: labTests.length > 0 ? Math.max(...labTests.map(test => test.id)) + 1 : 1,
      patientName: "",
      patientId: "",
      testType: "",
      requestedBy: "",
      status: "Pending",
      requestDate: new Date().toISOString().split('T')[0],
      completionDate: "",
      result: ""
    });
    setIsDialogOpen(true);
  };

  const handleViewTest = (test: LabTest) => {
    setIsEditMode(false);
    setIsViewMode(true);
    setCurrentLabTest({
      ...test,
      resultDetails: test.resultDetails || generateResultDetails(test)
    });
    setIsDialogOpen(true);
  };

  const handleEditTest = (test: LabTest) => {
    setIsEditMode(true);
    setIsViewMode(false);
    setCurrentLabTest({
      ...test,
      resultDetails: test.resultDetails || generateResultDetails(test)
    });
    setIsDialogOpen(true);
  };

  const handleDeleteTest = (id: number) => {
    setLabTests(labTests.filter(test => test.id !== id));
    toast({
      title: "Lab Test Removed",
      description: "The lab test record has been deleted successfully."
    });
  };

  const handleSaveTest = () => {
    if (!currentLabTest.patientName || !currentLabTest.patientId || !currentLabTest.testType || !currentLabTest.requestedBy) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (isEditMode) {
      setLabTests(
        labTests.map((test) =>
          test.id === currentLabTest.id ? currentLabTest : test
        )
      );
      toast({
        title: "Lab Test Updated",
        description: "Lab test record has been updated successfully."
      });
    } else {
      setLabTests([...labTests, currentLabTest]);
      toast({
        title: "Lab Test Added",
        description: "New lab test has been added successfully."
      });
    }
    setIsDialogOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentLabTest({
      ...currentLabTest,
      [name]: value
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setCurrentLabTest({
      ...currentLabTest,
      [name]: value,
      ...(name === 'status' && value === 'Completed' && !currentLabTest.completionDate
        ? { completionDate: new Date().toISOString().split('T')[0] }
        : {})
    });
  };

  const handleDownloadReport = (test: LabTest) => {
    toast({
      title: "Report Downloaded",
      description: `Lab report for ${test.patientName} has been downloaded.`
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'in progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getResultColor = (result: string) => {
    switch (result.toLowerCase()) {
      case 'normal':
        return 'text-green-600';
      case 'abnormal':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  // Generate mock result details
  const generateResultDetails = (test: LabTest) => {
    if (test.status !== 'Completed') {
      return '';
    }

    switch (test.testType) {
      case 'Complete Blood Count':
        return `WBC: 7.2 x10^3/μL (Normal: 4.5-11.0)
RBC: 4.8 x10^6/μL (Normal: 4.2-5.4)
Hemoglobin: 14.2 g/dL (Normal: 12.0-15.5)
Hematocrit: 42.1% (Normal: 36-46)
Platelets: 256 x10^3/μL (Normal: 150-450)`;
      case 'Blood Glucose':
        return `Fasting Blood Glucose: 92 mg/dL (Normal: 70-99)
Random Blood Glucose: 118 mg/dL (Normal: <140)`;
      case 'Lipid Panel':
        return `Total Cholesterol: 185 mg/dL (Desirable: <200)
HDL Cholesterol: 55 mg/dL (Good: >40)
LDL Cholesterol: 110 mg/dL (Near optimal: 100-129)
Triglycerides: 120 mg/dL (Normal: <150)`;
      case 'Urinalysis':
        return `Color: Yellow (Normal)
Clarity: Clear (Normal)
pH: 6.0 (Normal: 4.6-8.0)
Protein: Negative (Normal)
Glucose: Negative (Normal)
Ketones: Positive (Abnormal)
Blood: Negative (Normal)`;
      default:
        return 'No detailed results available for this test type.';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Laboratory Management</h1>
          <p className="text-muted-foreground">
            Manage laboratory tests, track test statuses, and view test results.
          </p>
        </div>
        <Button onClick={handleAddTest} className="bg-hospital-primary hover:bg-hospital-primary/90">
          <PlusCircle className="mr-2 h-4 w-4" />
          Request New Test
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tests by patient, ID, or type..."
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
              <TableHead>ID</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Patient ID</TableHead>
              <TableHead>Test Type</TableHead>
              <TableHead>Requested By</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Request Date</TableHead>
              <TableHead>Result</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLabTests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-10 text-muted-foreground">
                  No lab tests found
                </TableCell>
              </TableRow>
            ) : (
              filteredLabTests.map((test) => (
                <TableRow key={test.id}>
                  <TableCell>{test.id}</TableCell>
                  <TableCell className="font-medium">{test.patientName}</TableCell>
                  <TableCell>{test.patientId}</TableCell>
                  <TableCell>{test.testType}</TableCell>
                  <TableCell>{test.requestedBy}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(test.status)}>
                      {test.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{test.requestDate}</TableCell>
                  <TableCell className={getResultColor(test.result)}>
                    {test.result || '-'}
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button size="sm" variant="ghost" onClick={() => handleViewTest(test)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleEditTest(test)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    {test.status === 'Completed' && (
                      <Button size="sm" variant="ghost" onClick={() => handleDownloadReport(test)}>
                        <Download className="h-4 w-4 text-blue-500" />
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => handleDeleteTest(test.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit/View Lab Test Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {isViewMode 
                ? `View Lab Test: ${currentLabTest.testType}` 
                : isEditMode 
                  ? "Edit Lab Test" 
                  : "Request New Lab Test"
              }
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patientName">Patient Name</Label>
                <Input
                  id="patientName"
                  name="patientName"
                  value={currentLabTest.patientName}
                  onChange={handleInputChange}
                  readOnly={isViewMode}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patientId">Patient ID</Label>
                <Input
                  id="patientId"
                  name="patientId"
                  value={currentLabTest.patientId}
                  onChange={handleInputChange}
                  readOnly={isViewMode}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="testType">Test Type</Label>
                {isViewMode ? (
                  <Input
                    id="testType"
                    value={currentLabTest.testType}
                    readOnly
                  />
                ) : (
                  <Select
                    value={currentLabTest.testType}
                    onValueChange={(value) => handleSelectChange("testType", value)}
                  >
                    <SelectTrigger id="testType">
                      <SelectValue placeholder="Select test type" />
                    </SelectTrigger>
                    <SelectContent>
                      {testTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="requestedBy">Requested By</Label>
                <Input
                  id="requestedBy"
                  name="requestedBy"
                  value={currentLabTest.requestedBy}
                  onChange={handleInputChange}
                  readOnly={isViewMode}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="requestDate">Request Date</Label>
                <Input
                  id="requestDate"
                  name="requestDate"
                  type="date"
                  value={currentLabTest.requestDate}
                  onChange={handleInputChange}
                  readOnly={isViewMode}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                {isViewMode ? (
                  <Input
                    id="status"
                    value={currentLabTest.status}
                    readOnly
                  />
                ) : (
                  <Select
                    value={currentLabTest.status}
                    onValueChange={(value) => handleSelectChange("status", value)}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
              {(currentLabTest.status === "Completed" || isViewMode) && (
                <div className="space-y-2">
                  <Label htmlFor="completionDate">Completion Date</Label>
                  <Input
                    id="completionDate"
                    name="completionDate"
                    type="date"
                    value={currentLabTest.completionDate}
                    onChange={handleInputChange}
                    readOnly={isViewMode}
                  />
                </div>
              )}
            </div>
            {(currentLabTest.status === "Completed" || isViewMode) && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="result">Result</Label>
                  {isViewMode ? (
                    <Input
                      id="result"
                      value={currentLabTest.result}
                      readOnly
                    />
                  ) : (
                    <Select
                      value={currentLabTest.result}
                      onValueChange={(value) => handleSelectChange("result", value)}
                    >
                      <SelectTrigger id="result">
                        <SelectValue placeholder="Select result" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Normal">Normal</SelectItem>
                        <SelectItem value="Abnormal">Abnormal</SelectItem>
                        <SelectItem value="Inconclusive">Inconclusive</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="resultDetails">Result Details</Label>
                  <Textarea
                    id="resultDetails"
                    name="resultDetails"
                    rows={6}
                    value={currentLabTest.resultDetails}
                    onChange={handleInputChange}
                    readOnly={isViewMode}
                    className="resize-none font-mono text-sm"
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              {isViewMode ? 'Close' : 'Cancel'}
            </Button>
            {!isViewMode && (
              <Button onClick={handleSaveTest} className="bg-hospital-primary hover:bg-hospital-primary/90">
                {isEditMode ? "Update" : "Save"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Laboratory;
