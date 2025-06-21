import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { 
  Search, PlusCircle, ShoppingCart, Truck, Clock, CheckCircle, XCircle, Eye, Edit, Package
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

// Mock data for orders
const mockOrders = [
  { 
    id: 1, 
    orderNumber: "ORD-2025-001", 
    supplier: "MedPharm Inc.", 
    orderDate: "2025-04-28", 
    expectedDelivery: "2025-05-05", 
    status: "Pending", 
    totalAmount: 2450.00, 
    itemCount: 15,
    priority: "Normal",
    items: [
      { medication: "Amoxicillin 500mg", quantity: 500, unitCost: 0.50, totalCost: 250.00 },
      { medication: "Lisinopril 10mg", quantity: 1000, unitCost: 0.30, totalCost: 300.00 },
      { medication: "Salbutamol 100mcg", quantity: 100, unitCost: 15.00, totalCost: 1500.00 }
    ]
  },
  { 
    id: 2, 
    orderNumber: "ORD-2025-002", 
    supplier: "HealthCare Supplies", 
    orderDate: "2025-04-25", 
    expectedDelivery: "2025-05-02", 
    status: "Shipped", 
    totalAmount: 1875.50, 
    itemCount: 12,
    priority: "High",
    items: [
      { medication: "Metformin 850mg", quantity: 750, unitCost: 0.25, totalCost: 187.50 },
      { medication: "Ibuprofen 400mg", quantity: 2000, unitCost: 0.15, totalCost: 300.00 },
      { medication: "Paracetamol 500mg", quantity: 1500, unitCost: 0.10, totalCost: 150.00 }
    ]
  },
  { 
    id: 3, 
    orderNumber: "ORD-2025-003", 
    supplier: "PharmaCo Ltd.", 
    orderDate: "2025-04-20", 
    expectedDelivery: "2025-04-27", 
    status: "Delivered", 
    totalAmount: 3200.75, 
    itemCount: 20,
    priority: "Normal",
    items: [
      { medication: "Atorvastatin 20mg", quantity: 800, unitCost: 0.40, totalCost: 320.00 },
      { medication: "Simvastatin 20mg", quantity: 600, unitCost: 0.35, totalCost: 210.00 },
      { medication: "Aspirin 75mg", quantity: 2500, unitCost: 0.08, totalCost: 200.00 }
    ]
  },
  { 
    id: 4, 
    orderNumber: "ORD-2025-004", 
    supplier: "Global Pharma", 
    orderDate: "2025-04-30", 
    expectedDelivery: "2025-05-07", 
    status: "Processing", 
    totalAmount: 1650.25, 
    itemCount: 8,
    priority: "Urgent",
    items: [
      { medication: "Insulin Glargine", quantity: 50, unitCost: 25.00, totalCost: 1250.00 },
      { medication: "Epinephrine Auto-injector", quantity: 20, unitCost: 20.00, totalCost: 400.00 }
    ]
  }
];

const suppliers = [
  "MedPharm Inc.", "HealthCare Supplies", "PharmaCo Ltd.", "Global Pharma", "MediCore"
];

const priorities = ["Normal", "High", "Urgent"];

const Orders = () => {
  const [orders, setOrders] = useState(mockOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  // Form state for new order
  const [newOrder, setNewOrder] = useState({
    supplier: "",
    expectedDelivery: "",
    priority: "Normal",
    items: [{ medication: "", quantity: "", unitCost: "" }]
  });

  const filteredOrders = orders.filter(order =>
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'normal':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'shipped':
        return <Truck className="h-4 w-4 text-blue-600" />;
      case 'processing':
        return <Package className="h-4 w-4 text-yellow-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-orange-600" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setIsViewDialogOpen(true);
  };

  const handleCreateOrder = () => {
    // Validation
    if (!newOrder.supplier || !newOrder.expectedDelivery) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Validate items
    const validItems = newOrder.items.filter(item => 
      item.medication && item.quantity && item.unitCost
    );

    if (validItems.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one item to the order.",
        variant: "destructive",
      });
      return;
    }

    // Calculate totals
    const totalAmount = validItems.reduce((sum, item) => 
      sum + (parseFloat(item.quantity) * parseFloat(item.unitCost)), 0
    );

    // Create new order
    const orderToAdd = {
      id: Math.max(...orders.map(o => o.id)) + 1,
      orderNumber: `ORD-2025-${String(orders.length + 1).padStart(3, '0')}`,
      supplier: newOrder.supplier,
      orderDate: new Date().toISOString().split('T')[0],
      expectedDelivery: newOrder.expectedDelivery,
      status: "Pending",
      totalAmount: totalAmount,
      itemCount: validItems.length,
      priority: newOrder.priority,
      items: validItems.map(item => ({
        medication: item.medication,
        quantity: parseInt(item.quantity),
        unitCost: parseFloat(item.unitCost),
        totalCost: parseInt(item.quantity) * parseFloat(item.unitCost)
      }))
    };

    setOrders([orderToAdd, ...orders]);

    // Reset form
    setNewOrder({
      supplier: "",
      expectedDelivery: "",
      priority: "Normal",
      items: [{ medication: "", quantity: "", unitCost: "" }]
    });

    setIsCreateDialogOpen(false);

    toast({
      title: "Success",
      description: `Order ${orderToAdd.orderNumber} has been created.`,
    });
  };

  const addOrderItem = () => {
    setNewOrder(prev => ({
      ...prev,
      items: [...prev.items, { medication: "", quantity: "", unitCost: "" }]
    }));
  };

  const removeOrderItem = (index: number) => {
    setNewOrder(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateOrderItem = (index: number, field: string, value: string) => {
    setNewOrder(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === "Pending").length;
  const shippedOrders = orders.filter(o => o.status === "Shipped").length;
  const totalValue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600">Manage supplier orders and procurement</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Order
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingOrders}</div>
            <p className="text-xs text-muted-foreground">Awaiting processing</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shipped Orders</CardTitle>
            <Truck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{shippedOrders}</div>
            <p className="text-xs text-muted-foreground">In transit</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <Package className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Order value</p>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>Track and manage all supplier orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search orders by number, supplier, or status..."
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
                  <TableHead>Order Number</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Order Date</TableHead>
                  <TableHead>Expected Delivery</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.orderNumber}</TableCell>
                    <TableCell>{order.supplier}</TableCell>
                    <TableCell>{order.orderDate}</TableCell>
                    <TableCell>{order.expectedDelivery}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {order.itemCount} items
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(order.priority)}>
                        {order.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(order.status)}
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">${order.totalAmount.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewOrder(order)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
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

      {/* View Order Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.orderNumber}</DialogTitle>
            <DialogDescription>
              Complete order information and item details
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="grid gap-6 py-4">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Order Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium">Order Number:</span>
                      <span>{selectedOrder.orderNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Supplier:</span>
                      <span>{selectedOrder.supplier}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Order Date:</span>
                      <span>{selectedOrder.orderDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Expected Delivery:</span>
                      <span>{selectedOrder.expectedDelivery}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Priority:</span>
                      <Badge className={getPriorityColor(selectedOrder.priority)}>
                        {selectedOrder.priority}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Status:</span>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(selectedOrder.status)}
                        <Badge className={getStatusColor(selectedOrder.status)}>
                          {selectedOrder.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium">Total Items:</span>
                      <span>{selectedOrder.itemCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Subtotal:</span>
                      <span>${selectedOrder.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Tax (8%):</span>
                      <span>${(selectedOrder.totalAmount * 0.08).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Shipping:</span>
                      <span>$25.00</span>
                    </div>
                    <hr />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Amount:</span>
                      <span>${(selectedOrder.totalAmount * 1.08 + 25).toFixed(2)}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{item.medication}</p>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity} × ${item.unitCost.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${item.totalCost.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Order Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Create New Order</DialogTitle>
            <DialogDescription>
              Create a new order for medication procurement
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier *</Label>
                <Select value={newOrder.supplier} onValueChange={(value) => setNewOrder(prev => ({ ...prev, supplier: value }))}>
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
              <div className="space-y-2">
                <Label htmlFor="expectedDelivery">Expected Delivery *</Label>
                <Input
                  id="expectedDelivery"
                  type="date"
                  value={newOrder.expectedDelivery}
                  onChange={(e) => setNewOrder(prev => ({ ...prev, expectedDelivery: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={newOrder.priority} onValueChange={(value) => setNewOrder(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map((priority) => (
                      <SelectItem key={priority} value={priority}>
                        {priority}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-medium">Order Items</Label>
                <Button type="button" variant="outline" onClick={addOrderItem}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </div>
              
              {newOrder.items.map((item, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 p-4 border rounded-lg">
                  <div className="space-y-2">
                    <Label>Medication</Label>
                    <Input
                      placeholder="Medication name"
                      value={item.medication}
                      onChange={(e) => updateOrderItem(index, "medication", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      placeholder="Quantity"
                      value={item.quantity}
                      onChange={(e) => updateOrderItem(index, "quantity", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Unit Cost ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Unit cost"
                      value={item.unitCost}
                      onChange={(e) => updateOrderItem(index, "unitCost", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Total</Label>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">
                        ${item.quantity && item.unitCost ? (parseFloat(item.quantity) * parseFloat(item.unitCost)).toFixed(2) : '0.00'}
                      </span>
                      {newOrder.items.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOrderItem(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateOrder}>
              Create Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Orders; 