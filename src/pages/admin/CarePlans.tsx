
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PlusCircle, Search, Edit, Trash2, FileText, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

// Mock data for care plans
const mockCarePlans = [
  { id: 1, title: "Post-Surgery Recovery", patientName: "John Doe", assignedDoctor: "Dr. Emily Wilson", assignedNurse: "Rachel Greene", creationDate: "2025-04-15", status: "Active" },
  { id: 2, title: "Diabetes Management", patientName: "Jane Smith", assignedDoctor: "Dr. Robert Chen", assignedNurse: "Jessica Chen", creationDate: "2025-04-10", status: "Active" },
  { id: 3, title: "Cardiac Rehabilitation", patientName: "Bob Johnson", assignedDoctor: "Dr. Michael Stevens", assignedNurse: "Marcus Johnson", creationDate: "2025-04-05", status: "Completed" },
  { id: 4, title: "Respiratory Therapy", patientName: "Mary Williams", assignedDoctor: "Dr. Sarah Adams", assignedNurse: "Sophia Martinez", creationDate: "2025-04-01", status: "On Hold" },
  { id: 5, title: "Physical Rehabilitation", patientName: "James Brown", assignedDoctor: "Dr. Thomas Lee", assignedNurse: "William Davis", creationDate: "2025-03-25", status: "Active" }
];

interface CarePlan {
  id: number;
  title: string;
  patientName: string;
  assignedDoctor: string;
  assignedNurse: string;
  creationDate: string;
  status: string;
  careDetails?: string;
}

const CarePlans = () => {
  const { toast } = useToast();
  const [carePlans, setCarePlans] = useState<CarePlan[]>(mockCarePlans);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCarePlan, setCurrentCarePlan] = useState<CarePlan>({
    id: 0,
    title: "",
    patientName: "",
    assignedDoctor: "",
    assignedNurse: "",
    creationDate: new Date().toISOString().split('T')[0],
    status: "Active",
    careDetails: ""
  });

  // Filter care plans based on search term
  const filteredCarePlans = carePlans.filter((plan) =>
    plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.assignedDoctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCarePlan = () => {
    setIsEditMode(false);
    setIsViewMode(false);
    setCurrentCarePlan({
      id: carePlans.length > 0 ? Math.max(...carePlans.map(p => p.id)) + 1 : 1,
      title: "",
      patientName: "",
      assignedDoctor: "",
      assignedNurse: "",
      creationDate: new Date().toISOString().split('T')[0],
      status: "Active",
      careDetails: ""
    });
    setIsDialogOpen(true);
  };

  const handleViewCarePlan = (plan: CarePlan) => {
    setIsEditMode(false);
    setIsViewMode(true);
    setCurrentCarePlan({ 
      ...plan,
      careDetails: plan.careDetails || "This care plan includes regular monitoring of vital signs, medication administration as prescribed, and daily assessments. Patient should be encouraged to perform breathing exercises and gradually increase physical activity as tolerated."
    });
    setIsDialogOpen(true);
  };

  const handleEditCarePlan = (plan: CarePlan) => {
    setIsEditMode(true);
    setIsViewMode(false);
    setCurrentCarePlan({ 
      ...plan,
      careDetails: plan.careDetails || "This care plan includes regular monitoring of vital signs, medication administration as prescribed, and daily assessments. Patient should be encouraged to perform breathing exercises and gradually increase physical activity as tolerated."
    });
    setIsDialogOpen(true);
  };

  const handleDeleteCarePlan = (id: number) => {
    setCarePlans(carePlans.filter(plan => plan.id !== id));
    toast({
      title: "Care Plan Removed",
      description: "The care plan has been deleted successfully."
    });
  };

  const handleSaveCarePlan = () => {
    if (!currentCarePlan.title || !currentCarePlan.patientName || !currentCarePlan.assignedDoctor) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (isEditMode) {
      setCarePlans(
        carePlans.map((plan) =>
          plan.id === currentCarePlan.id ? currentCarePlan : plan
        )
      );
      toast({
        title: "Care Plan Updated",
        description: "Care plan has been updated successfully."
      });
    } else {
      setCarePlans([...carePlans, currentCarePlan]);
      toast({
        title: "Care Plan Added",
        description: "New care plan has been added successfully."
      });
    }
    setIsDialogOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentCarePlan({
      ...currentCarePlan,
      [name]: value
    });
  };

  const handleStatusChange = (status: string) => {
    setCurrentCarePlan({
      ...currentCarePlan,
      status
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'text-green-600';
      case 'completed':
        return 'text-blue-600';
      case 'on hold':
        return 'text-amber-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Care Plans</h1>
          <p className="text-muted-foreground">
            Manage patient care plans, view treatment details, and monitor progress.
          </p>
        </div>
        <Button onClick={handleAddCarePlan} className="bg-hospital-primary hover:bg-hospital-primary/90">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Care Plan
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search care plans by title, patient, or doctor..."
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
              <TableHead>Title</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Nurse</TableHead>
              <TableHead>Creation Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCarePlans.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                  No care plans found
                </TableCell>
              </TableRow>
            ) : (
              filteredCarePlans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell>{plan.id}</TableCell>
                  <TableCell className="font-medium">{plan.title}</TableCell>
                  <TableCell>{plan.patientName}</TableCell>
                  <TableCell>{plan.assignedDoctor}</TableCell>
                  <TableCell>{plan.assignedNurse}</TableCell>
                  <TableCell>{plan.creationDate}</TableCell>
                  <TableCell className={getStatusColor(plan.status)}>{plan.status}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="sm" variant="ghost" onClick={() => handleViewCarePlan(plan)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleEditCarePlan(plan)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDeleteCarePlan(plan.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit/View Care Plan Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {isViewMode 
                ? `View Care Plan: ${currentCarePlan.title}` 
                : isEditMode 
                  ? "Edit Care Plan" 
                  : "Create New Care Plan"
              }
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={currentCarePlan.title}
                  onChange={handleInputChange}
                  readOnly={isViewMode}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patientName">Patient Name</Label>
                <Input
                  id="patientName"
                  name="patientName"
                  value={currentCarePlan.patientName}
                  onChange={handleInputChange}
                  readOnly={isViewMode}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assignedDoctor">Assigned Doctor</Label>
                <Input
                  id="assignedDoctor"
                  name="assignedDoctor"
                  value={currentCarePlan.assignedDoctor}
                  onChange={handleInputChange}
                  readOnly={isViewMode}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assignedNurse">Assigned Nurse</Label>
                <Input
                  id="assignedNurse"
                  name="assignedNurse"
                  value={currentCarePlan.assignedNurse}
                  onChange={handleInputChange}
                  readOnly={isViewMode}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="creationDate">Creation Date</Label>
                <Input
                  id="creationDate"
                  name="creationDate"
                  type="date"
                  value={currentCarePlan.creationDate}
                  onChange={handleInputChange}
                  readOnly={isViewMode}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                {isViewMode ? (
                  <Input
                    id="status"
                    value={currentCarePlan.status}
                    readOnly
                  />
                ) : (
                  <div className="flex gap-2 mt-2">
                    <Button 
                      type="button"
                      size="sm"
                      variant={currentCarePlan.status === 'Active' ? 'default' : 'outline'}
                      onClick={() => handleStatusChange('Active')}
                    >
                      Active
                    </Button>
                    <Button 
                      type="button"
                      size="sm"
                      variant={currentCarePlan.status === 'On Hold' ? 'default' : 'outline'}
                      onClick={() => handleStatusChange('On Hold')}
                    >
                      On Hold
                    </Button>
                    <Button 
                      type="button"
                      size="sm"
                      variant={currentCarePlan.status === 'Completed' ? 'default' : 'outline'}
                      onClick={() => handleStatusChange('Completed')}
                    >
                      Completed
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="careDetails">Care Details</Label>
              <Textarea
                id="careDetails"
                name="careDetails"
                rows={5}
                value={currentCarePlan.careDetails}
                onChange={handleInputChange}
                readOnly={isViewMode}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              {isViewMode ? 'Close' : 'Cancel'}
            </Button>
            {!isViewMode && (
              <Button onClick={handleSaveCarePlan} className="bg-hospital-primary hover:bg-hospital-primary/90">
                {isEditMode ? "Update" : "Save"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CarePlans;
