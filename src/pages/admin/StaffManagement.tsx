
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PlusCircle, Search, Edit, Trash2, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data for staff members
const mockStaff = [
  { id: 1, name: "Sarah Johnson", role: "Admin Staff", department: "Administration", contactNumber: "123-456-7890", email: "sarah.j@medhub.com" },
  { id: 2, name: "Michael Smith", role: "IT Specialist", department: "IT Department", contactNumber: "234-567-8901", email: "michael.s@medhub.com" },
  { id: 3, name: "Emily Davis", role: "HR Manager", department: "Human Resources", contactNumber: "345-678-9012", email: "emily.d@medhub.com" },
  { id: 4, name: "Robert Brown", role: "Accountant", department: "Finance", contactNumber: "456-789-0123", email: "robert.b@medhub.com" },
  { id: 5, name: "Jessica Wilson", role: "Receptionist", department: "Front Desk", contactNumber: "567-890-1234", email: "jessica.w@medhub.com" }
];

interface Staff {
  id: number;
  name: string;
  role: string;
  department: string;
  contactNumber: string;
  email: string;
}

const StaffManagement = () => {
  const { toast } = useToast();
  const [staff, setStaff] = useState<Staff[]>(mockStaff);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentStaff, setCurrentStaff] = useState<Staff>({
    id: 0,
    name: "",
    role: "",
    department: "",
    contactNumber: "",
    email: ""
  });

  // Filter staff based on search term
  const filteredStaff = staff.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStaff = () => {
    setIsEditMode(false);
    setCurrentStaff({
      id: staff.length > 0 ? Math.max(...staff.map(s => s.id)) + 1 : 1,
      name: "",
      role: "",
      department: "",
      contactNumber: "",
      email: ""
    });
    setIsDialogOpen(true);
  };

  const handleEditStaff = (member: Staff) => {
    setIsEditMode(true);
    setCurrentStaff({ ...member });
    setIsDialogOpen(true);
  };

  const handleDeleteStaff = (id: number) => {
    setStaff(staff.filter(member => member.id !== id));
    toast({
      title: "Staff Member Removed",
      description: "The staff record has been deleted successfully."
    });
  };

  const handleSaveStaff = () => {
    if (!currentStaff.name || !currentStaff.role || !currentStaff.department) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (isEditMode) {
      setStaff(
        staff.map((member) =>
          member.id === currentStaff.id ? currentStaff : member
        )
      );
      toast({
        title: "Staff Updated",
        description: "Staff record has been updated successfully."
      });
    } else {
      setStaff([...staff, currentStaff]);
      toast({
        title: "Staff Added",
        description: "New staff member has been added successfully."
      });
    }
    setIsDialogOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentStaff({
      ...currentStaff,
      [name]: value
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Staff Management</h1>
          <p className="text-muted-foreground">
            Manage hospital staff, view departments, and add new staff members to the system.
          </p>
        </div>
        <Button onClick={handleAddStaff} className="bg-hospital-primary hover:bg-hospital-primary/90">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Staff
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search staff by name, role, or department..."
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
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Contact Number</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStaff.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                  No staff found
                </TableCell>
              </TableRow>
            ) : (
              filteredStaff.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>{member.id}</TableCell>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell>{member.department}</TableCell>
                  <TableCell>{member.contactNumber}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="sm" variant="ghost" onClick={() => handleEditStaff(member)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDeleteStaff(member.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Staff Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Staff Member" : "Add New Staff Member"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={currentStaff.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  name="role"
                  value={currentStaff.role}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                name="department"
                value={currentStaff.department}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactNumber">Contact Number</Label>
                <Input
                  id="contactNumber"
                  name="contactNumber"
                  value={currentStaff.contactNumber}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={currentStaff.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveStaff} className="bg-hospital-primary hover:bg-hospital-primary/90">
              {isEditMode ? "Update" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StaffManagement;
