import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, UserPlus, Edit, Trash2, Users, Key, Calendar, Clock, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data for nurses
const mockNurses = [
  { 
    id: 1, 
    name: "Rachel Greene", 
    specialization: "Pediatric", 
    ward: "Children's Ward", 
    shift: "Morning", 
    contactNumber: "123-456-7890", 
    experience: "5 years",
    email: "rachel.greene@medhub.com",
    username: "rgreene",
    password: "nurse123",
    assignedPatients: ["P001", "P002", "P005"],
    weeklySchedule: {
      monday: { isWorking: true, startTime: "07:00", endTime: "15:00", break: "11:00-12:00" },
      tuesday: { isWorking: true, startTime: "07:00", endTime: "15:00", break: "11:00-12:00" },
      wednesday: { isWorking: true, startTime: "07:00", endTime: "15:00", break: "11:00-12:00" },
      thursday: { isWorking: true, startTime: "07:00", endTime: "15:00", break: "11:00-12:00" },
      friday: { isWorking: true, startTime: "07:00", endTime: "15:00", break: "11:00-12:00" },
      saturday: { isWorking: false, startTime: "", endTime: "", break: "" },
      sunday: { isWorking: false, startTime: "", endTime: "", break: "" }
    }
  },
  { 
    id: 2, 
    name: "Jessica Chen", 
    specialization: "ICU", 
    ward: "Intensive Care", 
    shift: "Night", 
    contactNumber: "234-567-8901", 
    experience: "8 years",
    email: "jessica.chen@medhub.com",
    username: "jchen",
    password: "nurse123",
    assignedPatients: ["P003", "P004"],
    weeklySchedule: {
      monday: { isWorking: true, startTime: "23:00", endTime: "07:00", break: "03:00-04:00" },
      tuesday: { isWorking: true, startTime: "23:00", endTime: "07:00", break: "03:00-04:00" },
      wednesday: { isWorking: true, startTime: "23:00", endTime: "07:00", break: "03:00-04:00" },
      thursday: { isWorking: false, startTime: "", endTime: "", break: "" },
      friday: { isWorking: false, startTime: "", endTime: "", break: "" },
      saturday: { isWorking: false, startTime: "", endTime: "", break: "" },
      sunday: { isWorking: false, startTime: "", endTime: "", break: "" }
    }
  },
  { 
    id: 3, 
    name: "Marcus Johnson", 
    specialization: "General", 
    ward: "General Ward", 
    shift: "Evening", 
    contactNumber: "345-678-9012", 
    experience: "3 years",
    email: "marcus.johnson@medhub.com",
    username: "mjohnson",
    password: "nurse123",
    assignedPatients: ["P006", "P007"],
    weeklySchedule: {
      monday: { isWorking: true, startTime: "15:00", endTime: "23:00", break: "19:00-20:00" },
      tuesday: { isWorking: true, startTime: "15:00", endTime: "23:00", break: "19:00-20:00" },
      wednesday: { isWorking: true, startTime: "15:00", endTime: "23:00", break: "19:00-20:00" },
      thursday: { isWorking: true, startTime: "15:00", endTime: "23:00", break: "19:00-20:00" },
      friday: { isWorking: true, startTime: "15:00", endTime: "23:00", break: "19:00-20:00" },
      saturday: { isWorking: false, startTime: "", endTime: "", break: "" },
      sunday: { isWorking: false, startTime: "", endTime: "", break: "" }
    }
  },
  { 
    id: 4, 
    name: "Sophia Martinez", 
    specialization: "Emergency", 
    ward: "Emergency Room", 
    shift: "Rotating", 
    contactNumber: "456-789-0123", 
    experience: "6 years",
    email: "sophia.martinez@medhub.com",
    username: "smartinez",
    password: "nurse123",
    assignedPatients: ["P008", "P009", "P010"],
    weeklySchedule: {
      monday: { isWorking: true, startTime: "07:00", endTime: "19:00", break: "13:00-14:00" },
      tuesday: { isWorking: false, startTime: "", endTime: "", break: "" },
      wednesday: { isWorking: true, startTime: "19:00", endTime: "07:00", break: "01:00-02:00" },
      thursday: { isWorking: false, startTime: "", endTime: "", break: "" },
      friday: { isWorking: true, startTime: "07:00", endTime: "19:00", break: "13:00-14:00" },
      saturday: { isWorking: false, startTime: "", endTime: "", break: "" },
      sunday: { isWorking: true, startTime: "19:00", endTime: "07:00", break: "01:00-02:00" }
    }
  },
  { 
    id: 5, 
    name: "William Davis", 
    specialization: "Geriatric", 
    ward: "Elderly Care", 
    shift: "Morning", 
    contactNumber: "567-890-1234", 
    experience: "4 years",
    email: "william.davis@medhub.com",
    username: "wdavis",
    password: "nurse123",
    assignedPatients: ["P001", "P003"],
    weeklySchedule: {
      monday: { isWorking: true, startTime: "06:00", endTime: "14:00", break: "10:00-11:00" },
      tuesday: { isWorking: true, startTime: "06:00", endTime: "14:00", break: "10:00-11:00" },
      wednesday: { isWorking: true, startTime: "06:00", endTime: "14:00", break: "10:00-11:00" },
      thursday: { isWorking: true, startTime: "06:00", endTime: "14:00", break: "10:00-11:00" },
      friday: { isWorking: true, startTime: "06:00", endTime: "14:00", break: "10:00-11:00" },
      saturday: { isWorking: true, startTime: "06:00", endTime: "14:00", break: "10:00-11:00" },
      sunday: { isWorking: false, startTime: "", endTime: "", break: "" }
    }
  }
];

// Mock patients data for assignment
const mockPatients = [
  { id: "P001", name: "James Wilson", age: 45, condition: "Hypertension", status: "Active", ward: "General Ward" },
  { id: "P002", name: "Maria Garcia", age: 38, condition: "Type 2 Diabetes", status: "Active", ward: "Children's Ward" },
  { id: "P003", name: "Robert Chen", age: 52, condition: "Post-operative care", status: "Monitoring", ward: "ICU" },
  { id: "P004", name: "Emma Johnson", age: 29, condition: "Prenatal care", status: "Active", ward: "Maternity Ward" },
  { id: "P005", name: "David Kim", age: 34, condition: "Asthma", status: "Active", ward: "Emergency Room" },
  { id: "P006", name: "Sarah Martinez", age: 41, condition: "Migraine", status: "Stable", ward: "Neurology Ward" },
  { id: "P007", name: "John Davis", age: 28, condition: "Anxiety", status: "Active", ward: "Psychiatric Ward" },
  { id: "P008", name: "Lisa Brown", age: 33, condition: "Allergies", status: "Stable", ward: "General Ward" },
  { id: "P009", name: "Mike Johnson", age: 42, condition: "Back pain", status: "Active", ward: "Orthopedic Ward" },
  { id: "P010", name: "Anna Taylor", age: 37, condition: "Knee injury", status: "Monitoring", ward: "Elderly Care" },
];

interface DaySchedule {
  isWorking: boolean;
  startTime: string;
  endTime: string;
  break: string;
}

interface WeeklySchedule {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

interface Nurse {
  id: number;
  name: string;
  specialization: string;
  ward: string;
  shift: string;
  contactNumber: string;
  experience: string;
  email: string;
  username: string;
  password: string;
  assignedPatients: string[];
  weeklySchedule: WeeklySchedule;
}

const Nurses = () => {
  const { toast } = useToast();
  const [nurses, setNurses] = useState<Nurse[]>(mockNurses);
  const [patients] = useState(mockPatients);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [selectedNurse, setSelectedNurse] = useState<Nurse | null>(null);
  
  const [currentNurse, setCurrentNurse] = useState<Nurse>({
    id: 0,
    name: "",
    specialization: "",
    ward: "",
    shift: "Morning",
    contactNumber: "",
    experience: "",
    email: "",
    username: "",
    password: "",
    assignedPatients: [],
    weeklySchedule: {
      monday: { isWorking: false, startTime: "", endTime: "", break: "" },
      tuesday: { isWorking: false, startTime: "", endTime: "", break: "" },
      wednesday: { isWorking: false, startTime: "", endTime: "", break: "" },
      thursday: { isWorking: false, startTime: "", endTime: "", break: "" },
      friday: { isWorking: false, startTime: "", endTime: "", break: "" },
      saturday: { isWorking: false, startTime: "", endTime: "", break: "" },
      sunday: { isWorking: false, startTime: "", endTime: "", break: "" }
    }
  });

  // Filter nurses based on search term
  const filteredNurses = nurses.filter((nurse) =>
    nurse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nurse.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nurse.ward.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNurse = () => {
    setIsEditMode(false);
    setActiveTab("basic");
    setCurrentNurse({
      id: nurses.length > 0 ? Math.max(...nurses.map(n => n.id)) + 1 : 1,
      name: "",
      specialization: "",
      ward: "",
      shift: "Morning",
      contactNumber: "",
      experience: "",
      email: "",
      username: "",
      password: "",
      assignedPatients: [],
      weeklySchedule: {
        monday: { isWorking: false, startTime: "", endTime: "", break: "" },
        tuesday: { isWorking: false, startTime: "", endTime: "", break: "" },
        wednesday: { isWorking: false, startTime: "", endTime: "", break: "" },
        thursday: { isWorking: false, startTime: "", endTime: "", break: "" },
        friday: { isWorking: false, startTime: "", endTime: "", break: "" },
        saturday: { isWorking: false, startTime: "", endTime: "", break: "" },
        sunday: { isWorking: false, startTime: "", endTime: "", break: "" }
      }
    });
    setIsDialogOpen(true);
  };

  const handleEditNurse = (nurse: Nurse) => {
    setIsEditMode(true);
    setActiveTab("basic");
    setCurrentNurse({ ...nurse });
    setIsDialogOpen(true);
  };

  const handleManageNurse = (nurse: Nurse, tab: string) => {
    setSelectedNurse(nurse);
    setCurrentNurse({ ...nurse });
    setActiveTab(tab);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleDeleteNurse = (id: number) => {
    setNurses(nurses.filter(nurse => nurse.id !== id));
    toast({
      title: "Nurse Removed",
      description: "The nurse record has been deleted successfully."
    });
  };

  const handleSaveNurse = () => {
    if (!currentNurse.name || !currentNurse.specialization || !currentNurse.ward || !currentNurse.email) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (isEditMode) {
      setNurses(
        nurses.map((nurse) =>
          nurse.id === currentNurse.id ? currentNurse : nurse
        )
      );
      toast({
        title: "Nurse Updated",
        description: "Nurse record has been updated successfully."
      });
    } else {
      setNurses([...nurses, currentNurse]);
      toast({
        title: "Nurse Added",
        description: "New nurse has been added successfully."
      });
    }
    setIsDialogOpen(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCurrentNurse({
      ...currentNurse,
      [name]: value
    });
  };

  const handlePatientAssignment = (patientId: string, isAssigned: boolean) => {
    if (isAssigned) {
      setCurrentNurse({
        ...currentNurse,
        assignedPatients: [...currentNurse.assignedPatients, patientId]
      });
    } else {
      setCurrentNurse({
        ...currentNurse,
        assignedPatients: currentNurse.assignedPatients.filter(id => id !== patientId)
      });
    }
  };

  const handleScheduleChange = (day: keyof WeeklySchedule, field: keyof DaySchedule, value: string | boolean) => {
    setCurrentNurse({
      ...currentNurse,
      weeklySchedule: {
        ...currentNurse.weeklySchedule,
        [day]: {
          ...currentNurse.weeklySchedule[day],
          [field]: value
        }
      }
    });
  };

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? patient.name : patientId;
  };

  const getAvailablePatients = () => {
    return patients.filter(patient => !currentNurse.assignedPatients.includes(patient.id));
  };

  const getAssignedPatients = () => {
    return patients.filter(patient => currentNurse.assignedPatients.includes(patient.id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Nurse Management</h1>
          <p className="text-muted-foreground">
            Manage nursing staff, schedules, specializations, patient assignments, and login credentials.
          </p>
        </div>
        <Button onClick={handleAddNurse} className="bg-hospital-primary hover:bg-hospital-primary/90">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Nurse
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search nurses by name, specialization, or ward..."
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
              <TableHead>Specialization</TableHead>
              <TableHead>Ward</TableHead>
              <TableHead>Shift</TableHead>
              <TableHead>Contact Number</TableHead>
              <TableHead>Assigned Patients</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredNurses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-10 text-muted-foreground">
                  No nurses found
                </TableCell>
              </TableRow>
            ) : (
              filteredNurses.map((nurse) => (
                <TableRow key={nurse.id}>
                  <TableCell>{nurse.id}</TableCell>
                  <TableCell className="font-medium">{nurse.name}</TableCell>
                  <TableCell>{nurse.specialization}</TableCell>
                  <TableCell>{nurse.ward}</TableCell>
                  <TableCell>{nurse.shift}</TableCell>
                  <TableCell>{nurse.contactNumber}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="mr-1">
                      {nurse.assignedPatients.length} patients
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">Active</Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="sm" variant="ghost" onClick={() => handleEditNurse(nurse)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleManageNurse(nurse, "patients")}>
                      <Users className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleManageNurse(nurse, "login")}>
                      <Key className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleManageNurse(nurse, "schedule")}>
                      <Calendar className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDeleteNurse(nurse.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Nurse Management Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? `Manage ${currentNurse.name}` : "Add New Nurse"}
            </DialogTitle>
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="patients">Assign Patients</TabsTrigger>
              <TabsTrigger value="login">Login Details</TabsTrigger>
              <TabsTrigger value="schedule">Weekly Schedule</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={currentNurse.name}
                    onChange={handleInputChange}
                    placeholder="Nurse Jane Smith"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialization">Specialization *</Label>
                  <Select
                    value={currentNurse.specialization}
                    onValueChange={(value) => setCurrentNurse({...currentNurse, specialization: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select specialization" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="General">General Nursing</SelectItem>
                      <SelectItem value="ICU">ICU/Critical Care</SelectItem>
                      <SelectItem value="Pediatric">Pediatric Nursing</SelectItem>
                      <SelectItem value="Emergency">Emergency Nursing</SelectItem>
                      <SelectItem value="Surgical">Surgical Nursing</SelectItem>
                      <SelectItem value="Geriatric">Geriatric Nursing</SelectItem>
                      <SelectItem value="Obstetric">Obstetric/Maternity</SelectItem>
                      <SelectItem value="Psychiatric">Psychiatric Nursing</SelectItem>
                      <SelectItem value="Oncology">Oncology Nursing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ward">Ward *</Label>
                  <Select
                    value={currentNurse.ward}
                    onValueChange={(value) => setCurrentNurse({...currentNurse, ward: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select ward" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="General Ward">General Ward</SelectItem>
                      <SelectItem value="ICU">Intensive Care Unit</SelectItem>
                      <SelectItem value="Emergency Room">Emergency Room</SelectItem>
                      <SelectItem value="Children's Ward">Children's Ward</SelectItem>
                      <SelectItem value="Maternity Ward">Maternity Ward</SelectItem>
                      <SelectItem value="Surgical Ward">Surgical Ward</SelectItem>
                      <SelectItem value="Elderly Care">Elderly Care</SelectItem>
                      <SelectItem value="Psychiatric Ward">Psychiatric Ward</SelectItem>
                      <SelectItem value="Oncology Ward">Oncology Ward</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shift">Shift</Label>
                  <Select 
                    value={currentNurse.shift} 
                    onValueChange={(value) => setCurrentNurse({...currentNurse, shift: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select shift" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Morning">Morning (7AM-3PM)</SelectItem>
                      <SelectItem value="Evening">Evening (3PM-11PM)</SelectItem>
                      <SelectItem value="Night">Night (11PM-7AM)</SelectItem>
                      <SelectItem value="Rotating">Rotating Shifts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={currentNurse.email}
                    onChange={handleInputChange}
                    placeholder="nurse@medhub.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactNumber">Contact Number</Label>
                  <Input
                    id="contactNumber"
                    name="contactNumber"
                    value={currentNurse.contactNumber}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Experience</Label>
                <Input
                  id="experience"
                  name="experience"
                  value={currentNurse.experience}
                  onChange={handleInputChange}
                  placeholder="3 years"
                />
              </div>
            </TabsContent>

            <TabsContent value="patients" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Patient Assignment</h3>
                
                {/* Currently Assigned Patients */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Currently Assigned Patients ({getAssignedPatients().length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {getAssignedPatients().length === 0 ? (
                      <p className="text-sm text-muted-foreground">No patients assigned</p>
                    ) : (
                      <div className="space-y-2">
                        {getAssignedPatients().map((patient) => (
                          <div key={patient.id} className="flex items-center justify-between p-2 border rounded">
                            <div className="flex items-center space-x-3">
                              <div>
                                <p className="font-medium">{patient.name}</p>
                                <p className="text-sm text-muted-foreground">{patient.condition} • {patient.ward}</p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handlePatientAssignment(patient.id, false)}
                            >
                              <X className="h-4 w-4" />
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Available Patients */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Available Patients ({getAvailablePatients().length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {getAvailablePatients().length === 0 ? (
                      <p className="text-sm text-muted-foreground">All patients are assigned</p>
                    ) : (
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {getAvailablePatients().map((patient) => (
                          <div key={patient.id} className="flex items-center justify-between p-2 border rounded">
                            <div className="flex items-center space-x-3">
                              <div>
                                <p className="font-medium">{patient.name}</p>
                                <p className="text-sm text-muted-foreground">{patient.condition} • {patient.ward}</p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => handlePatientAssignment(patient.id, true)}
                            >
                              <Plus className="h-4 w-4" />
                              Assign
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="login" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Login Credentials</h3>
                
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username *</Label>
                      <Input
                        id="username"
                        name="username"
                        value={currentNurse.username}
                        onChange={handleInputChange}
                        placeholder="nurse_username"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password *</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={currentNurse.password}
                        onChange={handleInputChange}
                        placeholder="Enter secure password"
                      />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>• Password should be at least 8 characters long</p>
                      <p>• Include both letters and numbers for security</p>
                      <p>• The nurse will use these credentials to log into the system</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Weekly Schedule</h3>
                
                <div className="space-y-4">
                  {Object.entries(currentNurse.weeklySchedule).map(([day, schedule]) => (
                    <Card key={day}>
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium capitalize">{day}</h4>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`${day}-working`}
                              checked={schedule.isWorking}
                              onCheckedChange={(checked) => 
                                handleScheduleChange(day as keyof WeeklySchedule, 'isWorking', checked as boolean)
                              }
                            />
                            <Label htmlFor={`${day}-working`}>Working Day</Label>
                          </div>
                        </div>
                        
                        {schedule.isWorking && (
                          <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label>Start Time</Label>
                              <Input
                                type="time"
                                value={schedule.startTime}
                                onChange={(e) => 
                                  handleScheduleChange(day as keyof WeeklySchedule, 'startTime', e.target.value)
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>End Time</Label>
                              <Input
                                type="time"
                                value={schedule.endTime}
                                onChange={(e) => 
                                  handleScheduleChange(day as keyof WeeklySchedule, 'endTime', e.target.value)
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Break Time</Label>
                              <Input
                                placeholder="12:00-13:00"
                                value={schedule.break}
                                onChange={(e) => 
                                  handleScheduleChange(day as keyof WeeklySchedule, 'break', e.target.value)
                                }
                              />
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <p>• Set working hours for each day of the week</p>
                  <p>• Break time format: HH:MM-HH:MM (e.g., 12:00-13:00)</p>
                  <p>• Uncheck "Working Day" for days off</p>
                  <p>• Consider shift rotations and ward requirements</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveNurse} className="bg-hospital-primary hover:bg-hospital-primary/90">
              {isEditMode ? "Update Nurse" : "Add Nurse"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Nurses;
