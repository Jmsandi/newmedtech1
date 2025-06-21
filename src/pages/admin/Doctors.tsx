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

// Mock data for doctors
const mockDoctors = [
  { 
    id: 1, 
    name: "Dr. Emily Chen", 
    specialty: "Cardiology", 
    experience: "12 years", 
    email: "emily.chen@medhub.com", 
    phone: "123-456-7890", 
    availability: "Mon-Fri, 9AM-5PM",
    username: "echen",
    password: "doctor123",
    assignedPatients: ["P001", "P002", "P005"],
    weeklySchedule: {
      monday: { isWorking: true, startTime: "09:00", endTime: "17:00", break: "12:00-13:00" },
      tuesday: { isWorking: true, startTime: "09:00", endTime: "17:00", break: "12:00-13:00" },
      wednesday: { isWorking: true, startTime: "09:00", endTime: "17:00", break: "12:00-13:00" },
      thursday: { isWorking: true, startTime: "09:00", endTime: "17:00", break: "12:00-13:00" },
      friday: { isWorking: true, startTime: "09:00", endTime: "17:00", break: "12:00-13:00" },
      saturday: { isWorking: false, startTime: "", endTime: "", break: "" },
      sunday: { isWorking: false, startTime: "", endTime: "", break: "" }
    }
  },
  { 
    id: 2, 
    name: "Dr. Michael Rodriguez", 
    specialty: "Neurology", 
    experience: "8 years", 
    email: "michael.rodriguez@medhub.com", 
    phone: "234-567-8901", 
    availability: "Mon-Wed, 8AM-4PM",
    username: "mrodriguez",
    password: "doctor123",
    assignedPatients: ["P003", "P004"],
    weeklySchedule: {
      monday: { isWorking: true, startTime: "08:00", endTime: "16:00", break: "12:00-13:00" },
      tuesday: { isWorking: true, startTime: "08:00", endTime: "16:00", break: "12:00-13:00" },
      wednesday: { isWorking: true, startTime: "08:00", endTime: "16:00", break: "12:00-13:00" },
      thursday: { isWorking: false, startTime: "", endTime: "", break: "" },
      friday: { isWorking: false, startTime: "", endTime: "", break: "" },
      saturday: { isWorking: false, startTime: "", endTime: "", break: "" },
      sunday: { isWorking: false, startTime: "", endTime: "", break: "" }
    }
  },
  { 
    id: 3, 
    name: "Dr. Sarah Kim", 
    specialty: "Pediatrics", 
    experience: "15 years", 
    email: "sarah.kim@medhub.com", 
    phone: "345-678-9012", 
    availability: "Tue-Sat, 10AM-6PM",
    username: "skim",
    password: "doctor123",
    assignedPatients: ["P006", "P007", "P008"],
    weeklySchedule: {
      monday: { isWorking: false, startTime: "", endTime: "", break: "" },
      tuesday: { isWorking: true, startTime: "10:00", endTime: "18:00", break: "13:00-14:00" },
      wednesday: { isWorking: true, startTime: "10:00", endTime: "18:00", break: "13:00-14:00" },
      thursday: { isWorking: true, startTime: "10:00", endTime: "18:00", break: "13:00-14:00" },
      friday: { isWorking: true, startTime: "10:00", endTime: "18:00", break: "13:00-14:00" },
      saturday: { isWorking: true, startTime: "10:00", endTime: "18:00", break: "13:00-14:00" },
      sunday: { isWorking: false, startTime: "", endTime: "", break: "" }
    }
  },
  { 
    id: 4, 
    name: "Dr. James Wilson", 
    specialty: "Orthopedics", 
    experience: "10 years", 
    email: "james.wilson@medhub.com", 
    phone: "456-789-0123", 
    availability: "Mon-Thu, 7AM-3PM",
    username: "jwilson",
    password: "doctor123",
    assignedPatients: ["P009", "P010"],
    weeklySchedule: {
      monday: { isWorking: true, startTime: "07:00", endTime: "15:00", break: "11:00-12:00" },
      tuesday: { isWorking: true, startTime: "07:00", endTime: "15:00", break: "11:00-12:00" },
      wednesday: { isWorking: true, startTime: "07:00", endTime: "15:00", break: "11:00-12:00" },
      thursday: { isWorking: true, startTime: "07:00", endTime: "15:00", break: "11:00-12:00" },
      friday: { isWorking: false, startTime: "", endTime: "", break: "" },
      saturday: { isWorking: false, startTime: "", endTime: "", break: "" },
      sunday: { isWorking: false, startTime: "", endTime: "", break: "" }
    }
  },
];

// Mock patients data for assignment
const mockPatients = [
  { id: "P001", name: "James Wilson", age: 45, condition: "Hypertension", status: "Active" },
  { id: "P002", name: "Maria Garcia", age: 38, condition: "Type 2 Diabetes", status: "Active" },
  { id: "P003", name: "Robert Chen", age: 52, condition: "Post-operative care", status: "Monitoring" },
  { id: "P004", name: "Emma Johnson", age: 29, condition: "Prenatal care", status: "Active" },
  { id: "P005", name: "David Kim", age: 34, condition: "Asthma", status: "Active" },
  { id: "P006", name: "Sarah Martinez", age: 41, condition: "Migraine", status: "Stable" },
  { id: "P007", name: "John Davis", age: 28, condition: "Anxiety", status: "Active" },
  { id: "P008", name: "Lisa Brown", age: 33, condition: "Allergies", status: "Stable" },
  { id: "P009", name: "Mike Johnson", age: 42, condition: "Back pain", status: "Active" },
  { id: "P010", name: "Anna Taylor", age: 37, condition: "Knee injury", status: "Monitoring" },
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

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  experience: string;
  email: string;
  phone: string;
  availability: string;
  username: string;
  password: string;
  assignedPatients: string[];
  weeklySchedule: WeeklySchedule;
}

const Doctors = () => {
  const { toast } = useToast();
  const [doctors, setDoctors] = useState<Doctor[]>(mockDoctors);
  const [patients] = useState(mockPatients);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  
  const [currentDoctor, setCurrentDoctor] = useState<Doctor>({
    id: 0,
    name: "",
    specialty: "",
    experience: "",
    email: "",
    phone: "",
    availability: "",
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

  // Filter doctors based on search term
  const filteredDoctors = doctors.filter((doctor) =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddDoctor = () => {
    setIsEditMode(false);
    setActiveTab("basic");
    setCurrentDoctor({
      id: doctors.length > 0 ? Math.max(...doctors.map(d => d.id)) + 1 : 1,
      name: "",
      specialty: "",
      experience: "",
      email: "",
      phone: "",
      availability: "",
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

  const handleEditDoctor = (doctor: Doctor) => {
    setIsEditMode(true);
    setActiveTab("basic");
    setCurrentDoctor({ ...doctor });
    setIsDialogOpen(true);
  };

  const handleManageDoctor = (doctor: Doctor, tab: string) => {
    setSelectedDoctor(doctor);
    setCurrentDoctor({ ...doctor });
    setActiveTab(tab);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleDeleteDoctor = (id: number) => {
    setDoctors(doctors.filter(doctor => doctor.id !== id));
    toast({
      title: "Doctor Removed",
      description: "The doctor record has been deleted successfully.",
    });
  };

  const handleSaveDoctor = () => {
    if (!currentDoctor.name || !currentDoctor.specialty || !currentDoctor.email) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (isEditMode) {
      setDoctors(
        doctors.map((doctor) =>
          doctor.id === currentDoctor.id ? currentDoctor : doctor
        )
      );
      toast({
        title: "Doctor Updated",
        description: "Doctor record has been updated successfully.",
      });
    } else {
      setDoctors([...doctors, currentDoctor]);
      toast({
        title: "Doctor Added",
        description: "New doctor has been added successfully.",
      });
    }
    setIsDialogOpen(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCurrentDoctor({
      ...currentDoctor,
      [name]: value,
    });
  };

  const handlePatientAssignment = (patientId: string, isAssigned: boolean) => {
    if (isAssigned) {
      setCurrentDoctor({
        ...currentDoctor,
        assignedPatients: [...currentDoctor.assignedPatients, patientId]
      });
    } else {
      setCurrentDoctor({
        ...currentDoctor,
        assignedPatients: currentDoctor.assignedPatients.filter(id => id !== patientId)
      });
    }
  };

  const handleScheduleChange = (day: keyof WeeklySchedule, field: keyof DaySchedule, value: string | boolean) => {
    setCurrentDoctor({
      ...currentDoctor,
      weeklySchedule: {
        ...currentDoctor.weeklySchedule,
        [day]: {
          ...currentDoctor.weeklySchedule[day],
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
    return patients.filter(patient => !currentDoctor.assignedPatients.includes(patient.id));
  };

  const getAssignedPatients = () => {
    return patients.filter(patient => currentDoctor.assignedPatients.includes(patient.id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Doctors Management</h1>
          <p className="text-muted-foreground">
            Manage doctor profiles, schedules, specialties, patient assignments, and login credentials.
          </p>
        </div>
        <Button onClick={handleAddDoctor} className="bg-hospital-primary hover:bg-hospital-primary/90">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Doctor
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search doctors by name or specialty..."
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
              <TableHead>Specialty</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Assigned Patients</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDoctors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-10 text-muted-foreground">
                  No doctors found
                </TableCell>
              </TableRow>
            ) : (
              filteredDoctors.map((doctor) => (
                <TableRow key={doctor.id}>
                  <TableCell>{doctor.id}</TableCell>
                  <TableCell className="font-medium">{doctor.name}</TableCell>
                  <TableCell>{doctor.specialty}</TableCell>
                  <TableCell>{doctor.experience}</TableCell>
                  <TableCell>{doctor.email}</TableCell>
                  <TableCell>{doctor.phone}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="mr-1">
                      {doctor.assignedPatients.length} patients
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">Active</Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="sm" variant="ghost" onClick={() => handleEditDoctor(doctor)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleManageDoctor(doctor, "patients")}>
                      <Users className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleManageDoctor(doctor, "login")}>
                      <Key className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleManageDoctor(doctor, "schedule")}>
                      <Calendar className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDeleteDoctor(doctor.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Doctor Management Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? `Manage ${currentDoctor.name}` : "Add New Doctor"}
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
                    value={currentDoctor.name}
                    onChange={handleInputChange}
                    placeholder="Dr. John Smith"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialty">Specialty *</Label>
                  <Select
                    value={currentDoctor.specialty}
                    onValueChange={(value) => setCurrentDoctor({...currentDoctor, specialty: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cardiology">Cardiology</SelectItem>
                      <SelectItem value="Neurology">Neurology</SelectItem>
                      <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                      <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                      <SelectItem value="Dermatology">Dermatology</SelectItem>
                      <SelectItem value="Oncology">Oncology</SelectItem>
                      <SelectItem value="Psychiatry">Psychiatry</SelectItem>
                      <SelectItem value="Emergency Medicine">Emergency Medicine</SelectItem>
                      <SelectItem value="General Practice">General Practice</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience</Label>
                  <Input
                    id="experience"
                    name="experience"
                    value={currentDoctor.experience}
                    onChange={handleInputChange}
                    placeholder="5 years"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={currentDoctor.email}
                    onChange={handleInputChange}
                    placeholder="doctor@medhub.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={currentDoctor.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="availability">General Availability</Label>
                  <Input
                    id="availability"
                    name="availability"
                    value={currentDoctor.availability}
                    onChange={handleInputChange}
                    placeholder="Mon-Fri, 9AM-5PM"
                  />
                </div>
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
                                <p className="text-sm text-muted-foreground">{patient.condition}</p>
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
                                <p className="text-sm text-muted-foreground">{patient.condition}</p>
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
                        value={currentDoctor.username}
                        onChange={handleInputChange}
                        placeholder="doctor_username"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password *</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={currentDoctor.password}
                        onChange={handleInputChange}
                        placeholder="Enter secure password"
                      />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>• Password should be at least 8 characters long</p>
                      <p>• Include both letters and numbers for security</p>
                      <p>• The doctor will use these credentials to log into the system</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Weekly Schedule</h3>
                
                <div className="space-y-4">
                  {Object.entries(currentDoctor.weeklySchedule).map(([day, schedule]) => (
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
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveDoctor} className="bg-hospital-primary hover:bg-hospital-primary/90">
              {isEditMode ? "Update Doctor" : "Add Doctor"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Doctors;
