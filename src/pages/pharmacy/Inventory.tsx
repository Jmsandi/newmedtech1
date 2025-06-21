import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { 
  Search, PlusCircle, Package, AlertTriangle, TrendingDown, Eye, Edit, Trash2
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

// Mock data for medications
const mockMedications = [
  { id: 1, name: "Amoxicillin", category: "Antibiotic", dosage: "500mg", formulation: "Capsule", quantity: 250, batchNumber: "AMX250-A", expiryDate: "2025-12-31", supplier: "MedPharm Inc.", cost: 0.50, price: 1.25 },
  { id: 2, name: "Lisinopril", category: "Antihypertensive", dosage: "10mg", formulation: "Tablet", quantity: 500, batchNumber: "LSP100-B", expiryDate: "2026-02-28", supplier: "HealthCare Supplies", cost: 0.30, price: 0.75 },
  { id: 3, name: "Metformin", category: "Antidiabetic", dosage: "850mg", formulation: "Tablet", quantity: 300, batchNumber: "MET850-C", expiryDate: "2025-10-15", supplier: "PharmaCo Ltd.", cost: 0.25, price: 0.60 },
  { id: 4, name: "Salbutamol", category: "Bronchodilator", dosage: "100mcg", formulation: "Inhaler", quantity: 50, batchNumber: "SLB100-D", expiryDate: "2025-09-30", supplier: "MedPharm Inc.", cost: 15.00, price: 35.00 },
  { id: 5, name: "Ibuprofen", category: "NSAID", dosage: "400mg", formulation: "Tablet", quantity: 1000, batchNumber: "IBU400-E", expiryDate: "2025-11-30", supplier: "HealthCare Supplies", cost: 0.15, price: 0.40 },
  { id: 6, name: "Paracetamol", category: "Analgesic", dosage: "500mg", formulation: "Tablet", quantity: 75, batchNumber: "PAR500-F", expiryDate: "2025-08-15", supplier: "PharmaCo Ltd.", cost: 0.10, price: 0.30 },
  { id: 7, name: "Aspirin", category: "NSAID", dosage: "75mg", formulation: "Tablet", quantity: 200, batchNumber: "ASP075-G", expiryDate: "2026-01-20", supplier: "MedPharm Inc.", cost: 0.08, price: 0.25 },
  { id: 8, name: "Simvastatin", category: "Statin", dosage: "20mg", formulation: "Tablet", quantity: 150, batchNumber: "SIM020-H", expiryDate: "2025-07-10", supplier: "HealthCare Supplies", cost: 0.40, price: 1.00 }
];

const categories = [
  "Antibiotic", "Antihypertensive", "Antidiabetic", "Bronchodilator", 
  "NSAID", "Analgesic", "Statin", "Antacid", "Antihistamine", "Vitamin"
];

const formulations = [
  "Tablet", "Capsule", "Syrup", "Injection", "Inhaler", "Cream", "Ointment", "Drops"
];

const suppliers = [
  "MedPharm Inc.", "HealthCare Supplies", "PharmaCo Ltd.", "Global Pharma", "MediCore"
];

const Inventory = () => {
  const [medications, setMedications] = useState(mockMedications);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  // Form state for new medication
  const [newMedication, setNewMedication] = useState({
    name: "",
    category: "",
    dosage: "",
    formulation: "",
    quantity: "",
    batchNumber: "",
    expiryDate: "",
    supplier: "",
    cost: "",
    price: ""
  });

  const isLowStock = (quantity: number) => quantity < 100;
  const isExpiringSoon = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
    return expiry <= threeMonthsFromNow && expiry >= today;
  };

  const getStockStatus = (quantity: number) => {
    if (quantity < 50) return { status: "Critical", color: "bg-red-100 text-red-800" };
    if (quantity < 100) return { status: "Low", color: "bg-yellow-100 text-yellow-800" };
    if (quantity < 200) return { status: "Medium", color: "bg-blue-100 text-blue-800" };
    return { status: "Good", color: "bg-green-100 text-green-800" };
  };

  const filteredMedications = medications.filter(medication =>
    medication.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medication.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medication.batchNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalItems = medications.length;
  const lowStockItems = medications.filter(med => isLowStock(med.quantity)).length;
  const expiringSoonItems = medications.filter(med => isExpiringSoon(med.expiryDate)).length;
  const totalValue = medications.reduce((sum, med) => sum + (med.quantity * med.cost), 0);

  const handleAddMedication = () => {
    // Validation
    if (!newMedication.name || !newMedication.category || !newMedication.dosage || 
        !newMedication.formulation || !newMedication.quantity || !newMedication.batchNumber ||
        !newMedication.expiryDate || !newMedication.supplier || !newMedication.cost || !newMedication.price) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Validate numbers
    const quantity = parseInt(newMedication.quantity);
    const cost = parseFloat(newMedication.cost);
    const price = parseFloat(newMedication.price);

    if (isNaN(quantity) || quantity <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid quantity.",
        variant: "destructive",
      });
      return;
    }

    if (isNaN(cost) || cost <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid cost.",
        variant: "destructive",
      });
      return;
    }

    if (isNaN(price) || price <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid price.",
        variant: "destructive",
      });
      return;
    }

    // Validate expiry date
    const expiryDate = new Date(newMedication.expiryDate);
    const today = new Date();
    if (expiryDate <= today) {
      toast({
        title: "Error",
        description: "Expiry date must be in the future.",
        variant: "destructive",
      });
      return;
    }

    // Create new medication object
    const medicationToAdd = {
      id: Math.max(...medications.map(m => m.id)) + 1,
      name: newMedication.name,
      category: newMedication.category,
      dosage: newMedication.dosage,
      formulation: newMedication.formulation,
      quantity: quantity,
      batchNumber: newMedication.batchNumber,
      expiryDate: newMedication.expiryDate,
      supplier: newMedication.supplier,
      cost: cost,
      price: price
    };

    // Add to medications list
    setMedications([...medications, medicationToAdd]);

    // Reset form
    setNewMedication({
      name: "",
      category: "",
      dosage: "",
      formulation: "",
      quantity: "",
      batchNumber: "",
      expiryDate: "",
      supplier: "",
      cost: "",
      price: ""
    });

    // Close dialog
    setIsDialogOpen(false);

    // Show success message
    toast({
      title: "Success",
      description: `${newMedication.name} has been added to inventory.`,
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setNewMedication(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600">Track medication stock levels and manage inventory</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setIsDialogOpen(true)}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Medication
        </Button>
      </div>

      {/* Add Medication Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Medication</DialogTitle>
            <DialogDescription>
              Enter the details for the new medication to add to inventory.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Medication Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Amoxicillin"
                  value={newMedication.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={newMedication.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dosage">Dosage *</Label>
                <Input
                  id="dosage"
                  placeholder="e.g., 500mg"
                  value={newMedication.dosage}
                  onChange={(e) => handleInputChange("dosage", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="formulation">Formulation *</Label>
                <Select value={newMedication.formulation} onValueChange={(value) => handleInputChange("formulation", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select formulation" />
                  </SelectTrigger>
                  <SelectContent>
                    {formulations.map((formulation) => (
                      <SelectItem key={formulation} value={formulation}>
                        {formulation}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="e.g., 100"
                  value={newMedication.quantity}
                  onChange={(e) => handleInputChange("quantity", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="batchNumber">Batch Number *</Label>
                <Input
                  id="batchNumber"
                  placeholder="e.g., AMX500-A"
                  value={newMedication.batchNumber}
                  onChange={(e) => handleInputChange("batchNumber", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date *</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={newMedication.expiryDate}
                  onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier *</Label>
                <Select value={newMedication.supplier} onValueChange={(value) => handleInputChange("supplier", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier} value={supplier}>
                        {supplier}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cost">Cost per Unit ($) *</Label>
                <Input
                  id="cost"
                  type="number"
                  step="0.01"
                  placeholder="e.g., 0.50"
                  value={newMedication.cost}
                  onChange={(e) => handleInputChange("cost", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Selling Price ($) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="e.g., 1.25"
                  value={newMedication.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddMedication}>
              Add Medication
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-muted-foreground">In inventory</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{lowStockItems}</div>
            <p className="text-xs text-muted-foreground">Need reordering</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{expiringSoonItems}</div>
            <p className="text-xs text-muted-foreground">Within 3 months</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <Package className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Inventory worth</p>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Medication Inventory</CardTitle>
          <CardDescription>Manage all medications and stock levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search medications by name, category, or batch number..."
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
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Dosage</TableHead>
                  <TableHead>Form</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Batch #</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMedications.map((medication) => {
                  const stockStatus = getStockStatus(medication.quantity);
                  const expiring = isExpiringSoon(medication.expiryDate);
                  
                  return (
                    <TableRow key={medication.id}>
                      <TableCell className="font-medium">{medication.name}</TableCell>
                      <TableCell>{medication.category}</TableCell>
                      <TableCell>{medication.dosage}</TableCell>
                      <TableCell>{medication.formulation}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className={isLowStock(medication.quantity) ? "text-red-600 font-medium" : ""}>
                            {medication.quantity}
                          </span>
                          {isLowStock(medication.quantity) && (
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={stockStatus.color}>
                          {stockStatus.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{medication.batchNumber}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className={expiring ? "text-red-600 font-medium" : ""}>
                            {medication.expiryDate}
                          </span>
                          {expiring && (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>${medication.cost.toFixed(2)}</TableCell>
                      <TableCell>${medication.price.toFixed(2)}</TableCell>
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
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Alerts Section */}
      {(lowStockItems > 0 || expiringSoonItems > 0) && (
        <div className="grid gap-4 md:grid-cols-2">
          {lowStockItems > 0 && (
            <Card className="border-yellow-200">
              <CardHeader>
                <CardTitle className="text-yellow-800 flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Low Stock Alerts
                </CardTitle>
                <CardDescription>Items that need immediate reordering</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {medications.filter(med => isLowStock(med.quantity)).map((medication) => (
                    <div key={medication.id} className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                      <div>
                        <p className="font-medium">{medication.name}</p>
                        <p className="text-sm text-muted-foreground">{medication.dosage}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-yellow-800">{medication.quantity} units</p>
                        <p className="text-sm text-muted-foreground">Low Stock</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {expiringSoonItems > 0 && (
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-800 flex items-center">
                  <TrendingDown className="mr-2 h-5 w-5" />
                  Expiry Alerts
                </CardTitle>
                <CardDescription>Items expiring within 3 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {medications.filter(med => isExpiringSoon(med.expiryDate)).map((medication) => (
                    <div key={medication.id} className="flex items-center justify-between p-2 bg-red-50 rounded">
                      <div>
                        <p className="font-medium">{medication.name}</p>
                        <p className="text-sm text-muted-foreground">{medication.dosage}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-red-800">{medication.expiryDate}</p>
                        <p className="text-sm text-muted-foreground">Expires Soon</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default Inventory; 