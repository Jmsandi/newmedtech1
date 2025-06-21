import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  DollarSign,
  CreditCard,
  FileText,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Plus,
  Eye,
  Edit,
  Send
} from "lucide-react";

interface BillingRecord {
  id: string;
  patientName: string;
  patientId: string;
  serviceDate: string;
  services: Array<{
    code: string;
    description: string;
    amount: number;
  }>;
  totalAmount: number;
  insuranceAmount: number;
  patientAmount: number;
  amountPaid: number;
  balance: number;
  status: "Pending" | "Submitted" | "Paid" | "Overdue" | "Denied";
  insuranceProvider: string;
  claimNumber?: string;
  dueDate: string;
  lastPayment?: {
    amount: number;
    date: string;
    method: string;
  };
}

const mockBillingRecords: BillingRecord[] = [
  {
    id: "INV001",
    patientName: "Sarah Johnson",
    patientId: "PT001",
    serviceDate: "2024-01-15",
    services: [
      { code: "99213", description: "Office Visit - Established Patient", amount: 150.00 },
      { code: "90471", description: "Immunization Administration", amount: 25.00 }
    ],
    totalAmount: 175.00,
    insuranceAmount: 140.00,
    patientAmount: 35.00,
    amountPaid: 140.00,
    balance: 35.00,
    status: "Pending",
    insuranceProvider: "Blue Cross Blue Shield",
    claimNumber: "BC123456789",
    dueDate: "2024-02-15"
  },
  {
    id: "INV002",
    patientName: "Michael Chen",
    patientId: "PT002",
    serviceDate: "2024-01-10",
    services: [
      { code: "99214", description: "Office Visit - Detailed", amount: 200.00 },
      { code: "85025", description: "Complete Blood Count", amount: 45.00 }
    ],
    totalAmount: 245.00,
    insuranceAmount: 196.00,
    patientAmount: 49.00,
    amountPaid: 245.00,
    balance: 0.00,
    status: "Paid",
    insuranceProvider: "Aetna",
    claimNumber: "AE987654321",
    dueDate: "2024-02-10",
    lastPayment: {
      amount: 49.00,
      date: "2024-01-25",
      method: "Credit Card"
    }
  },
  {
    id: "INV003",
    patientName: "Emma Davis",
    patientId: "PT003",
    serviceDate: "2024-01-05",
    services: [
      { code: "99212", description: "Office Visit - Brief", amount: 120.00 }
    ],
    totalAmount: 120.00,
    insuranceAmount: 96.00,
    patientAmount: 24.00,
    amountPaid: 96.00,
    balance: 24.00,
    status: "Overdue",
    insuranceProvider: "United Healthcare",
    claimNumber: "UH456789123",
    dueDate: "2024-01-20"
  },
  {
    id: "INV004",
    patientName: "Robert Wilson",
    patientId: "PT004",
    serviceDate: "2024-01-12",
    services: [
      { code: "99215", description: "Office Visit - Comprehensive", amount: 250.00 },
      { code: "93000", description: "Electrocardiogram", amount: 75.00 }
    ],
    totalAmount: 325.00,
    insuranceAmount: 260.00,
    patientAmount: 65.00,
    amountPaid: 0.00,
    balance: 325.00,
    status: "Denied",
    insuranceProvider: "Medicare",
    claimNumber: "MC789123456",
    dueDate: "2024-02-12"
  }
];

export default function Billing() {
  const [billingRecords, setBillingRecords] = useState<BillingRecord[]>(mockBillingRecords);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Submitted":
        return "bg-blue-100 text-blue-800";
      case "Overdue":
        return "bg-red-100 text-red-800";
      case "Denied":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Paid":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "Pending":
      case "Submitted":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "Overdue":
      case "Denied":
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const filteredRecords = billingRecords.filter(record => {
    const matchesSearch = record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || record.status.toLowerCase() === statusFilter;
    
    let matchesTab = true;
    switch (activeTab) {
      case "outstanding":
        matchesTab = record.balance > 0;
        break;
      case "paid":
        matchesTab = record.status === "Paid";
        break;
      case "overdue":
        matchesTab = record.status === "Overdue" || record.status === "Denied";
        break;
      case "all":
      default:
        matchesTab = true;
    }
    
    return matchesSearch && matchesStatus && matchesTab;
  });

  const stats = {
    totalOutstanding: billingRecords.reduce((sum, record) => sum + record.balance, 0),
    totalCollected: billingRecords.reduce((sum, record) => sum + record.amountPaid, 0),
    overdueCount: billingRecords.filter(record => record.status === "Overdue").length,
    pendingCount: billingRecords.filter(record => record.status === "Pending" || record.status === "Submitted").length
  };

  const handleSendStatement = (recordId: string) => {
    console.log("Sending statement for:", recordId);
  };

  const handleProcessPayment = (recordId: string) => {
    console.log("Processing payment for:", recordId);
  };

  const handleViewDetails = (record: BillingRecord) => {
    console.log("Viewing details for:", record);
  };

  const handleEditRecord = (recordId: string) => {
    console.log("Editing record:", recordId);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Billing & Payments</h1>
          <p className="text-gray-600">Manage patient billing, insurance claims, and payments</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Invoice
          </Button>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Outstanding Balance</p>
                <h3 className="text-2xl font-bold text-red-600">
                  ${stats.totalOutstanding.toLocaleString()}
                </h3>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Collected</p>
                <h3 className="text-2xl font-bold text-green-600">
                  ${stats.totalCollected.toLocaleString()}
                </h3>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Overdue Accounts</p>
                <h3 className="text-2xl font-bold text-orange-600">{stats.overdueCount}</h3>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending Claims</p>
                <h3 className="text-2xl font-bold text-blue-600">{stats.pendingCount}</h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-blue-600" />
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
                placeholder="Search by patient name, ID, or invoice number..."
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
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="denied">Denied</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Billing Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Invoices</TabsTrigger>
          <TabsTrigger value="outstanding">Outstanding</TabsTrigger>
          <TabsTrigger value="paid">Paid</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="space-y-4">
            {filteredRecords.map((record) => (
              <Card key={record.id} className={record.status === "Overdue" ? "border-red-200 bg-red-50/30" : ""}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Invoice #{record.id}
                        </h3>
                        <Badge className={getStatusColor(record.status)}>
                          {getStatusIcon(record.status)}
                          <span className="ml-1">{record.status}</span>
                        </Badge>
                        {record.status === "Overdue" && (
                          <Badge className="bg-red-100 text-red-800">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Overdue
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <p><strong>Patient:</strong> {record.patientName}</p>
                          <p><strong>Patient ID:</strong> {record.patientId}</p>
                          <p><strong>Service Date:</strong> {new Date(record.serviceDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p><strong>Insurance:</strong> {record.insuranceProvider}</p>
                          {record.claimNumber && (
                            <p><strong>Claim #:</strong> {record.claimNumber}</p>
                          )}
                          <p><strong>Due Date:</strong> {new Date(record.dueDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Services */}
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Services</h4>
                    <div className="bg-gray-50 rounded-lg p-3">
                      {record.services.map((service, index) => (
                        <div key={index} className="flex justify-between items-center py-1">
                          <div>
                            <span className="text-sm font-medium">{service.code}</span>
                            <span className="text-sm text-gray-600 ml-2">{service.description}</span>
                          </div>
                          <span className="text-sm font-medium">${service.amount.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Financial Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="text-lg font-bold">${record.totalAmount.toFixed(2)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Insurance</p>
                      <p className="text-lg font-bold text-blue-600">${record.insuranceAmount.toFixed(2)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Amount Paid</p>
                      <p className="text-lg font-bold text-green-600">${record.amountPaid.toFixed(2)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Balance Due</p>
                      <p className={`text-lg font-bold ${record.balance > 0 ? "text-red-600" : "text-green-600"}`}>
                        ${record.balance.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Last Payment Info */}
                  {record.lastPayment && (
                    <div className="mb-4 p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-800">
                        <strong>Last Payment:</strong> ${record.lastPayment.amount.toFixed(2)} on{" "}
                        {new Date(record.lastPayment.date).toLocaleDateString()} via {record.lastPayment.method}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end space-x-2 pt-4 border-t border-gray-200">
                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(record)}>
                      <Eye className="w-3 h-3 mr-1" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEditRecord(record.id)}>
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleSendStatement(record.id)}>
                      <Mail className="w-3 h-3 mr-1" />
                      Send Statement
                    </Button>
                    {record.balance > 0 && (
                      <Button size="sm" onClick={() => handleProcessPayment(record.id)}>
                        <CreditCard className="w-3 h-3 mr-1" />
                        Process Payment
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredRecords.length === 0 && (
              <Card>
                <CardContent className="text-center py-20">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No billing records found</h3>
                  <p className="text-gray-600">
                    No billing records match the current search and filter criteria.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="text-left">
                <div className="flex items-center">
                  <Send className="w-4 h-4 mr-2" />
                  <span className="font-medium">Send Batch Statements</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">Send statements to all overdue accounts</p>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="text-left">
                <div className="flex items-center">
                  <Download className="w-4 h-4 mr-2" />
                  <span className="font-medium">Export Reports</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">Download financial reports</p>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="text-left">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  <span className="font-medium">Collection Calls</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">View accounts needing follow-up</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 