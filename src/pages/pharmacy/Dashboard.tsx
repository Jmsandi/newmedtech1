import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, Clock, AlertCircle, Users, TrendingUp, ShoppingCart
} from "lucide-react";

// Mock data for dashboard metrics
const dashboardMetrics = {
  totalPrescriptions: 1247,
  pendingPrescriptions: 23,
  lowStockItems: 8,
  totalPatients: 456,
  monthlyRevenue: 125000,
  activeOrders: 15
};

// Mock data for prescriptions
const mockPrescriptions = [
  { id: 1, patientName: "John Doe", patientId: "P001", medication: "Amoxicillin 500mg", dosage: "1 capsule three times daily", duration: "7 days", prescribedBy: "Dr. Emily Wilson", status: "Filled", date: "2025-05-01", priority: "Normal" },
  { id: 2, patientName: "Jane Smith", patientId: "P002", medication: "Lisinopril 10mg", dosage: "1 tablet daily", duration: "30 days", prescribedBy: "Dr. Robert Chen", status: "Pending", date: "2025-05-01", priority: "High" },
  { id: 3, patientName: "Bob Johnson", patientId: "P003", medication: "Metformin 850mg", dosage: "1 tablet twice daily", duration: "30 days", prescribedBy: "Dr. Michael Stevens", status: "Partially Filled", date: "2025-04-30", priority: "Normal" },
  { id: 4, patientName: "Mary Williams", patientId: "P004", medication: "Salbutamol 100mcg", dosage: "2 puffs as needed", duration: "As needed", prescribedBy: "Dr. Sarah Adams", status: "Filled", date: "2025-04-30", priority: "Urgent" },
  { id: 5, patientName: "James Brown", patientId: "P005", medication: "Ibuprofen 400mg", dosage: "1 tablet three times daily", duration: "5 days", prescribedBy: "Dr. Thomas Lee", status: "Pending", date: "2025-04-29", priority: "Normal" }
];

// Mock data for medications
const mockMedications = [
  { id: 1, name: "Amoxicillin", category: "Antibiotic", dosage: "500mg", formulation: "Capsule", quantity: 250, batchNumber: "AMX250-A", expiryDate: "2025-12-31", supplier: "MedPharm Inc.", cost: 0.50, price: 1.25 },
  { id: 2, name: "Lisinopril", category: "Antihypertensive", dosage: "10mg", formulation: "Tablet", quantity: 500, batchNumber: "LSP100-B", expiryDate: "2026-02-28", supplier: "HealthCare Supplies", cost: 0.30, price: 0.75 },
  { id: 3, name: "Metformin", category: "Antidiabetic", dosage: "850mg", formulation: "Tablet", quantity: 300, batchNumber: "MET850-C", expiryDate: "2025-10-15", supplier: "PharmaCo Ltd.", cost: 0.25, price: 0.60 },
  { id: 4, name: "Salbutamol", category: "Bronchodilator", dosage: "100mcg", formulation: "Inhaler", quantity: 50, batchNumber: "SLB100-D", expiryDate: "2025-09-30", supplier: "MedPharm Inc.", cost: 15.00, price: 35.00 },
  { id: 5, name: "Ibuprofen", category: "NSAID", dosage: "400mg", formulation: "Tablet", quantity: 1000, batchNumber: "IBU400-E", expiryDate: "2025-11-30", supplier: "HealthCare Supplies", cost: 0.15, price: 0.40 }
];

const Dashboard = () => {
  const isLowStock = (quantity: number) => quantity < 100;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'filled': case 'completed': case 'delivered': case 'active': case 'normal':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'pending': case 'ongoing':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'partially filled': case 'shipped':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'cancelled': case 'high': case 'low':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'urgent':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Pharmacy Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Prescriptions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardMetrics.totalPrescriptions}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Prescriptions</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardMetrics.pendingPrescriptions}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{dashboardMetrics.lowStockItems}</div>
            <p className="text-xs text-muted-foreground">Need reordering</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardMetrics.totalPatients}</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${dashboardMetrics.monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardMetrics.activeOrders}</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Prescriptions</CardTitle>
            <CardDescription>Latest prescription activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockPrescriptions.slice(0, 5).map((prescription) => (
                <div key={prescription.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{prescription.patientName}</p>
                    <p className="text-sm text-muted-foreground">{prescription.medication}</p>
                  </div>
                  <Badge className={getStatusColor(prescription.status)}>
                    {prescription.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Low Stock Alerts</CardTitle>
            <CardDescription>Items requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockMedications.filter(med => isLowStock(med.quantity)).map((medication) => (
                <div key={medication.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{medication.name}</p>
                    <p className="text-sm text-muted-foreground">{medication.dosage}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-red-600">{medication.quantity} units</p>
                    <p className="text-sm text-muted-foreground">Low Stock</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard; 