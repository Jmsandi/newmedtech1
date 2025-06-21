import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, TestTube, Users, Eye, TrendingUp, TrendingDown, AlertTriangle, Calendar
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Mock data for lab results
const mockLabResults = [
  { 
    id: 1, 
    patientName: "John Doe", 
    patientId: "P001", 
    testName: "HbA1c", 
    result: "7.2%", 
    referenceRange: "4.0-5.6%", 
    status: "High", 
    testDate: "2025-04-28", 
    orderedBy: "Dr. Smith",
    relevantMedications: ["Metformin 850mg", "Insulin Glargine"],
    clinicalSignificance: "Diabetes monitoring - consider medication adjustment",
    previousResults: [
      { date: "2025-01-28", value: "7.8%" },
      { date: "2025-02-28", value: "7.5%" },
      { date: "2025-03-28", value: "7.3%" }
    ]
  },
  { 
    id: 2, 
    patientName: "Jane Smith", 
    patientId: "P002", 
    testName: "Blood Pressure", 
    result: "125/82 mmHg", 
    referenceRange: "<130/80 mmHg", 
    status: "Normal", 
    testDate: "2025-04-30", 
    orderedBy: "Dr. Johnson",
    relevantMedications: ["Lisinopril 10mg", "Amlodipine 5mg"],
    clinicalSignificance: "Hypertension monitoring - current therapy effective",
    previousResults: [
      { date: "2025-01-30", value: "140/90 mmHg" },
      { date: "2025-02-28", value: "135/85 mmHg" },
      { date: "2025-03-30", value: "128/83 mmHg" }
    ]
  },
  { 
    id: 3, 
    patientName: "Bob Johnson", 
    patientId: "P003", 
    testName: "LDL Cholesterol", 
    result: "145 mg/dL", 
    referenceRange: "<100 mg/dL", 
    status: "High", 
    testDate: "2025-04-25", 
    orderedBy: "Dr. Wilson",
    relevantMedications: ["Atorvastatin 20mg", "Ezetimibe 10mg"],
    clinicalSignificance: "Cholesterol management - may need dose adjustment",
    previousResults: [
      { date: "2025-01-25", value: "165 mg/dL" },
      { date: "2025-02-25", value: "155 mg/dL" },
      { date: "2025-03-25", value: "150 mg/dL" }
    ]
  },
  { 
    id: 4, 
    patientName: "Mary Williams", 
    patientId: "P004", 
    testName: "Peak Flow", 
    result: "380 L/min", 
    referenceRange: "400-500 L/min", 
    status: "Low", 
    testDate: "2025-05-01", 
    orderedBy: "Dr. Chen",
    relevantMedications: ["Salbutamol 100mcg", "Budesonide 200mcg"],
    clinicalSignificance: "Asthma monitoring - consider inhaler technique review",
    previousResults: [
      { date: "2025-02-01", value: "350 L/min" },
      { date: "2025-03-01", value: "365 L/min" },
      { date: "2025-04-01", value: "375 L/min" }
    ]
  },
  { 
    id: 5, 
    patientName: "James Brown", 
    patientId: "P005", 
    testName: "Creatinine", 
    result: "1.2 mg/dL", 
    referenceRange: "0.7-1.3 mg/dL", 
    status: "Normal", 
    testDate: "2025-04-27", 
    orderedBy: "Dr. Davis",
    relevantMedications: ["Lisinopril 10mg"],
    clinicalSignificance: "Kidney function monitoring - ACE inhibitor therapy",
    previousResults: [
      { date: "2025-01-27", value: "1.1 mg/dL" },
      { date: "2025-02-27", value: "1.15 mg/dL" },
      { date: "2025-03-27", value: "1.18 mg/dL" }
    ]
  }
];

const LabResults = () => {
  const [labResults, setLabResults] = useState(mockLabResults);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedResult, setSelectedResult] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredResults = labResults.filter(result =>
    result.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    result.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    result.testName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'normal':
        return 'bg-green-100 text-green-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'low':
        return 'bg-yellow-100 text-yellow-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'high':
        return <TrendingUp className="h-4 w-4 text-red-600" />;
      case 'low':
        return <TrendingDown className="h-4 w-4 text-yellow-600" />;
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const handleViewResult = (result: any) => {
    setSelectedResult(result);
    setIsDialogOpen(true);
  };

  const totalResults = labResults.length;
  const abnormalResults = labResults.filter(r => r.status !== "Normal").length;
  const criticalResults = labResults.filter(r => r.status === "Critical").length;
  const recentResults = labResults.filter(r => new Date(r.testDate) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lab Results</h1>
          <p className="text-gray-600">Review laboratory results for medication management</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Results</CardTitle>
            <TestTube className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalResults}</div>
            <p className="text-xs text-muted-foreground">All lab results</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Abnormal Results</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{abnormalResults}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Results</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalResults}</div>
            <p className="text-xs text-muted-foreground">Immediate action needed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Results</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{recentResults}</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
      </div>

      {/* Lab Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>Laboratory Results</CardTitle>
          <CardDescription>Monitor lab results relevant to medication therapy</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search results by patient, test name, or ID..."
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
                  <TableHead>Patient</TableHead>
                  <TableHead>Test</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>Reference Range</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Test Date</TableHead>
                  <TableHead>Ordered By</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResults.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{result.patientName}</p>
                        <p className="text-sm text-muted-foreground">{result.patientId}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{result.testName}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className={result.status !== "Normal" ? "font-medium" : ""}>
                          {result.result}
                        </span>
                        {getStatusIcon(result.status)}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {result.referenceRange}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(result.status)}>
                        {result.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{result.testDate}</TableCell>
                    <TableCell>{result.orderedBy}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewResult(result)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Lab Result Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Lab Result Details - {selectedResult?.testName}</DialogTitle>
            <DialogDescription>
              Complete lab result information and medication relevance
            </DialogDescription>
          </DialogHeader>
          
          {selectedResult && (
            <div className="grid gap-6 py-4">
              {/* Result Overview */}
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Test Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium">Patient:</span>
                      <span>{selectedResult.patientName} ({selectedResult.patientId})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Test:</span>
                      <span>{selectedResult.testName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Result:</span>
                      <div className="flex items-center space-x-2">
                        <span className={selectedResult.status !== "Normal" ? "font-medium" : ""}>
                          {selectedResult.result}
                        </span>
                        {getStatusIcon(selectedResult.status)}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Reference Range:</span>
                      <span>{selectedResult.referenceRange}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Status:</span>
                      <Badge className={getStatusColor(selectedResult.status)}>
                        {selectedResult.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Test Date:</span>
                      <span>{selectedResult.testDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Ordered By:</span>
                      <span>{selectedResult.orderedBy}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Clinical Significance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="font-medium text-sm mb-2">Medication Relevance:</p>
                      <p className="text-sm text-muted-foreground mb-3">
                        {selectedResult.clinicalSignificance}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-sm mb-2">Related Medications:</p>
                      <div className="space-y-1">
                        {selectedResult.relevantMedications.map((med: string, index: number) => (
                          <Badge key={index} variant="outline" className="mr-2">
                            {med}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Trend Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Result Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-4 gap-4 text-sm font-medium text-muted-foreground">
                      <span>Date</span>
                      <span>Result</span>
                      <span>Trend</span>
                      <span>Notes</span>
                    </div>
                    {selectedResult.previousResults.map((prev: any, index: number) => {
                      const currentValue = parseFloat(selectedResult.result);
                      const prevValue = parseFloat(prev.value);
                      const trend = currentValue > prevValue ? 'up' : currentValue < prevValue ? 'down' : 'stable';
                      
                      return (
                        <div key={index} className="grid grid-cols-4 gap-4 p-3 border rounded-lg">
                          <span>{prev.date}</span>
                          <span>{prev.value}</span>
                          <div className="flex items-center space-x-1">
                            {trend === 'up' && <TrendingUp className="h-4 w-4 text-red-600" />}
                            {trend === 'down' && <TrendingDown className="h-4 w-4 text-green-600" />}
                            <span className="text-sm capitalize">{trend}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {index === selectedResult.previousResults.length - 1 ? 'Previous result' : 'Historical'}
                          </span>
                        </div>
                      );
                    })}
                    <div className="grid grid-cols-4 gap-4 p-3 border rounded-lg bg-blue-50">
                      <span className="font-medium">{selectedResult.testDate}</span>
                      <span className="font-medium">{selectedResult.result}</span>
                      <span className="font-medium">Current</span>
                      <span className="text-sm font-medium text-blue-600">Latest result</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LabResults; 