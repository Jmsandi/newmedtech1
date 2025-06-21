
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, Eye, Search, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Sample results data that needs verification
const pendingResults = [
  {
    id: "SR-12345",
    sampleId: "S-45678",
    patientName: "John Smith",
    patientId: "P-5023",
    testType: "Complete Blood Count",
    resultDate: "2025-05-03 10:15 AM",
    parameters: [
      { name: "Hemoglobin", value: "14.2", unit: "g/dL", refRange: "13.5-17.5", status: "normal" },
      { name: "White Blood Cells", value: "5.8", unit: "10³/µL", refRange: "4.5-11.0", status: "normal" },
      { name: "Platelets", value: "280", unit: "10³/µL", refRange: "150-450", status: "normal" }
    ]
  },
  {
    id: "SR-12346",
    sampleId: "S-45681",
    patientName: "Emily Williams",
    patientId: "P-6124",
    testType: "Lipid Panel",
    resultDate: "2025-05-03 11:30 AM",
    parameters: [
      { name: "Total Cholesterol", value: "245", unit: "mg/dL", refRange: "<200", status: "high" },
      { name: "HDL Cholesterol", value: "42", unit: "mg/dL", refRange: ">40", status: "normal" },
      { name: "LDL Cholesterol", value: "165", unit: "mg/dL", refRange: "<100", status: "high" }
    ]
  },
  {
    id: "SR-12347",
    sampleId: "S-45682",
    patientName: "Michael Brown",
    patientId: "P-3956",
    testType: "Comprehensive Metabolic Panel",
    resultDate: "2025-05-03 12:45 PM",
    parameters: [
      { name: "Glucose", value: "105", unit: "mg/dL", refRange: "70-99", status: "high" },
      { name: "Creatinine", value: "0.9", unit: "mg/dL", refRange: "0.6-1.2", status: "normal" },
      { name: "Sodium", value: "138", unit: "mmol/L", refRange: "135-145", status: "normal" }
    ]
  }
];

const Verification: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filteredResults, setFilteredResults] = React.useState(pendingResults);
  const [expandedResult, setExpandedResult] = React.useState<string | null>(null);

  // Filter results when search term changes
  React.useEffect(() => {
    const filtered = pendingResults.filter(
      result => 
        result.sampleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.testType.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredResults(filtered);
  }, [searchTerm]);

  const toggleResultDetails = (id: string) => {
    if (expandedResult === id) {
      setExpandedResult(null);
    } else {
      setExpandedResult(id);
    }
  };

  const handleApprove = (id: string) => {
    toast({
      title: "Result Verified",
      description: `Test result ${id} has been approved and verified.`
    });
    // In a real app, this would update the status in the database
    setFilteredResults(filteredResults.filter(result => result.id !== id));
  };

  const handleReject = (id: string) => {
    toast({
      title: "Result Rejected",
      description: `Test result ${id} has been rejected and sent back for review.`,
      variant: "destructive"
    });
    // In a real app, this would update the status in the database
    setFilteredResults(filteredResults.filter(result => result.id !== id));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "high":
        return <Badge variant="destructive">High</Badge>;
      case "low":
        return <Badge variant="outline">Low</Badge>;
      case "normal":
      default:
        return <Badge variant="secondary">Normal</Badge>;
    }
  };

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Result Verification</h1>
        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search results..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Badge className="bg-yellow-500">
            {filteredResults.length} Pending
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-indigo-600" />
            Pending Verification
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Sample ID</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Test Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResults.map((result) => (
                  <React.Fragment key={result.id}>
                    <TableRow className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium">{result.sampleId}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{result.patientName}</p>
                          <p className="text-xs text-muted-foreground">{result.patientId}</p>
                        </div>
                      </TableCell>
                      <TableCell>{result.testType}</TableCell>
                      <TableCell>{result.resultDate}</TableCell>
                      <TableCell>
                        {result.parameters.some(p => p.status === "high" || p.status === "low") ? (
                          <Badge variant="destructive">Abnormal</Badge>
                        ) : (
                          <Badge variant="secondary">Normal</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleResultDetails(result.id)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleApprove(result.id)}
                            className="bg-green-500 text-white hover:bg-green-600 border-none"
                          >
                            <CheckSquare className="h-4 w-4 mr-1" />
                            Verify
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReject(result.id)}
                            className="bg-red-500 text-white hover:bg-red-600 border-none"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    
                    {expandedResult === result.id && (
                      <TableRow className="bg-slate-50">
                        <TableCell colSpan={6} className="py-4">
                          <div className="px-4">
                            <h3 className="text-lg font-medium mb-2">Test Parameters</h3>
                            <div className="rounded-md border overflow-hidden">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Parameter</TableHead>
                                    <TableHead>Result</TableHead>
                                    <TableHead>Unit</TableHead>
                                    <TableHead>Reference Range</TableHead>
                                    <TableHead>Status</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {result.parameters.map((param, idx) => (
                                    <TableRow key={idx}>
                                      <TableCell>{param.name}</TableCell>
                                      <TableCell className="font-medium">{param.value}</TableCell>
                                      <TableCell>{param.unit}</TableCell>
                                      <TableCell>{param.refRange}</TableCell>
                                      <TableCell>{getStatusBadge(param.status)}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
                
                {filteredResults.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No results pending verification
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Verification;
