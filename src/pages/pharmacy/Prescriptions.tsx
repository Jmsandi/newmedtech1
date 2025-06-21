import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, PlusCircle, FileText, Clock, AlertCircle, Eye, Edit, Trash2
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data for prescriptions
const mockPrescriptions = [
  { id: 1, patientName: "John Doe", patientId: "P001", medication: "Amoxicillin 500mg", dosage: "1 capsule three times daily", duration: "7 days", prescribedBy: "Dr. Emily Wilson", status: "Filled", date: "2025-05-01", priority: "Normal" },
  { id: 2, patientName: "Jane Smith", patientId: "P002", medication: "Lisinopril 10mg", dosage: "1 tablet daily", duration: "30 days", prescribedBy: "Dr. Robert Chen", status: "Pending", date: "2025-05-01", priority: "High" },
  { id: 3, patientName: "Bob Johnson", patientId: "P003", medication: "Metformin 850mg", dosage: "1 tablet twice daily", duration: "30 days", prescribedBy: "Dr. Michael Stevens", status: "Partially Filled", date: "2025-04-30", priority: "Normal" },
  { id: 4, patientName: "Mary Williams", patientId: "P004", medication: "Salbutamol 100mcg", dosage: "2 puffs as needed", duration: "As needed", prescribedBy: "Dr. Sarah Adams", status: "Filled", date: "2025-04-30", priority: "Urgent" },
  { id: 5, patientName: "James Brown", patientId: "P005", medication: "Ibuprofen 400mg", dosage: "1 tablet three times daily", duration: "5 days", prescribedBy: "Dr. Thomas Lee", status: "Pending", date: "2025-04-29", priority: "Normal" },
  { id: 6, patientName: "Sarah Davis", patientId: "P006", medication: "Atorvastatin 20mg", dosage: "1 tablet daily", duration: "30 days", prescribedBy: "Dr. Jennifer Martinez", status: "Filled", date: "2025-04-29", priority: "Normal" },
  { id: 7, patientName: "Michael Wilson", patientId: "P007", medication: "Omeprazole 20mg", dosage: "1 capsule daily", duration: "14 days", prescribedBy: "Dr. David Thompson", status: "Pending", date: "2025-04-28", priority: "High" },
  { id: 8, patientName: "Lisa Anderson", patientId: "P008", medication: "Levothyroxine 50mcg", dosage: "1 tablet daily", duration: "30 days", prescribedBy: "Dr. Emily Wilson", status: "Filled", date: "2025-04-28", priority: "Normal" }
];

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState(mockPrescriptions);
  const [searchTerm, setSearchTerm] = useState("");

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'filled': case 'completed':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'partially filled':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'urgent':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
      case 'normal':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const filteredPrescriptions = prescriptions.filter(prescription =>
    prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.medication.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.prescribedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingCount = prescriptions.filter(p => p.status === "Pending").length;
  const filledCount = prescriptions.filter(p => p.status === "Filled").length;
  const partiallyFilledCount = prescriptions.filter(p => p.status === "Partially Filled").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Prescriptions</h1>
          <p className="text-gray-600">Manage patient prescriptions and medication orders</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Prescription
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Prescriptions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{prescriptions.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">Awaiting processing</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Filled</CardTitle>
            <FileText className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{filledCount}</div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Partially Filled</CardTitle>
            <AlertCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{partiallyFilledCount}</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Prescription Management</CardTitle>
          <CardDescription>Search and manage all prescriptions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search prescriptions by patient, medication, or doctor..."
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
                  <TableHead>Medication</TableHead>
                  <TableHead>Dosage</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Prescribed By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPrescriptions.map((prescription) => (
                  <TableRow key={prescription.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{prescription.patientName}</p>
                        <p className="text-sm text-muted-foreground">{prescription.patientId}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{prescription.medication}</TableCell>
                    <TableCell>{prescription.dosage}</TableCell>
                    <TableCell>{prescription.duration}</TableCell>
                    <TableCell>{prescription.prescribedBy}</TableCell>
                    <TableCell>{prescription.date}</TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(prescription.priority)}>
                        {prescription.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(prescription.status)}>
                        {prescription.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
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
  );
};

export default Prescriptions; 