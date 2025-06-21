
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, Download, FileBarChart, FileText, FilePlus, Printer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Sample reports data
const reportsData = [
  {
    id: "R-10045",
    name: "Daily Test Summary",
    date: "2025-05-03",
    type: "Daily Summary",
    format: "PDF",
    size: "1.2 MB",
  },
  {
    id: "R-10044",
    name: "Weekly Department Statistics",
    date: "2025-05-01",
    type: "Weekly Report",
    format: "Excel",
    size: "3.5 MB",
  },
  {
    id: "R-10043",
    name: "Monthly Performance Analysis",
    date: "2025-04-30",
    type: "Monthly Analysis",
    format: "PDF",
    size: "4.8 MB",
  },
  {
    id: "R-10042",
    name: "Test Volume By Category",
    date: "2025-04-25",
    type: "Custom Report",
    format: "PDF",
    size: "2.1 MB",
  },
  {
    id: "R-10041",
    name: "TAT Compliance Report",
    date: "2025-04-20",
    type: "Monthly Analysis",
    format: "Excel",
    size: "1.7 MB",
  },
];

// Report types for dropdown
const reportTypes = [
  "Daily Summary",
  "Weekly Summary",
  "Monthly Summary",
  "Test Volume Report",
  "TAT Analysis",
  "Quality Control",
  "Custom Report",
];

const Reports: React.FC = () => {
  const { toast } = useToast();
  const [reportType, setReportType] = React.useState("");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");

  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!reportType) {
      toast({
        title: "Missing Report Type",
        description: "Please select a report type",
        variant: "destructive",
      });
      return;
    }
    
    if (!startDate) {
      toast({
        title: "Missing Date",
        description: "Please select a start date",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would generate the report
    toast({
      title: "Generating Report",
      description: `Your ${reportType} is being generated and will be available shortly.`,
    });

    // Reset form after submission
    setReportType("");
    setStartDate("");
    setEndDate("");
  };

  const handleDownload = (reportId: string, reportName: string) => {
    toast({
      title: "Download Started",
      description: `${reportName} is downloading...`,
    });
  };

  const handlePrint = (reportId: string, reportName: string) => {
    toast({
      title: "Preparing for Print",
      description: `${reportName} is being prepared for printing...`,
    });
  };

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Reports</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Generate Report Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FilePlus className="h-5 w-5 text-indigo-600" />
              Generate Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGenerateReport} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reportType">Report Type</Label>
                <Select 
                  value={reportType}
                  onValueChange={setReportType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input 
                    id="startDate" 
                    type="date" 
                    className="pl-8"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date (Optional)</Label>
                <div className="relative">
                  <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input 
                    id="endDate" 
                    type="date" 
                    className="pl-8" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                <FileBarChart className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-600" />
              Recent Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportsData.map((report) => (
                    <TableRow key={report.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {report.format === "PDF" ? (
                            <FileText className="h-4 w-4 text-red-500" />
                          ) : (
                            <FileBarChart className="h-4 w-4 text-green-500" />
                          )}
                          <span className="font-medium">{report.name}</span>
                        </div>
                        <span className="text-xs text-gray-500">{report.id}</span>
                      </TableCell>
                      <TableCell>{report.date}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{report.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={report.format === "PDF" ? "secondary" : "default"}>
                          {report.format} • {report.size}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(report.id, report.name)}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePrint(report.id, report.name)}
                          >
                            <Printer className="h-4 w-4 mr-1" />
                            Print
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
