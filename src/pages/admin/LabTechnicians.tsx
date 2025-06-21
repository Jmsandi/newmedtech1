import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  PlusCircle, 
  Search, 
  Edit, 
  Trash2, 
  TestTube, 
  AlertTriangle, 
  Users, 
  Activity,
  Shield,
  Clock,
  Award,
  Phone,
  Mail
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  getAllLabTechnicians,
  addLabTechnician,
  updateLabTechnician,
  deleteLabTechnician,
  getLabTechsBySpecialization,
  getLabTechsByStatus,
  getEmergencyAvailableLabTechs,
  getDepartmentStats,
  LabTechnician
} from "@/services/database/labtechs";
import {
  getAllLabTechOutbreakAssignments,
  addLabTechOutbreakAssignment,
  getOutbreakAssignmentsByLabTech,
  getLabTechOutbreakStats,
  LabTechOutbreakAssignment
} from "@/services/database/outbreak";

// Specializations and departments
const specializations = [
  "Hematology",
  "Microbiology",
  "Biochemistry",
  "Immunology",
  "Cytology",
  "Histology",
  "Molecular Biology",
  "Phlebotomy",
  "Serology",
  "Toxicology",
  "Clinical Chemistry",
  "Parasitology",
  "Virology"
];

const departments = [
  "Clinical Laboratory",
  "Pathology",
  "Microbiology",
  "Hematology",
  "Chemistry",
  "Immunology",
  "Blood Bank",
  "Molecular Diagnostics"
];

const LabTechnicians = () => {
  const { toast } = useToast();
  const [labTechnicians, setLabTechnicians] = useState<LabTechnician[]>([]);
  const [outbreakAssignments, setOutbreakAssignments] = useState<LabTechOutbreakAssignment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isOutbreakDialogOpen, setIsOutbreakDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLabTech, setSelectedLabTech] = useState<LabTechnician | null>(null);
  const [activeTab, setActiveTab] = useState("technicians");
  const [departmentStats, setDepartmentStats] = useState<any>({});
  const [outbreakStats, setOutbreakStats] = useState<any>({});
  
  const [currentTechnician, setCurrentTechnician] = useState<Partial<LabTechnician>>({
    name: "",
    specialization: "",
    qualification: "",
    experience: "",
    contactNumber: "",
    email: "",
    status: "Active",
    department: "",
    shift: "Morning",
    testingCapabilities: [],
    equipmentProficiency: [],
    specializedTraining: [],
    certifications: [],
    averageTestsPerDay: 0,
    accuracyRate: 95,
    averageProcessingTime: 30,
    emergencyAvailable: false,
    outbreakTrainingCompleted: false,
    biosafetyCertifications: []
  });

  const [outbreakAssignmentForm, setOutbreakAssignmentForm] = useState({
    assignmentType: "sample-testing" as const,
    outbreakType: "",
    priority: "medium" as const,
    testingCapabilities: "",
    dailyTestingCapacity: "",
    sampleProcessingLocation: "",
    workDays: [] as string[],
    startTime: "",
    endTime: "",
    isOnCall: false,
    emergencyAvailable: false,
    biosafetyCertifications: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [techsData, assignmentsData, statsData] = await Promise.all([
        getAllLabTechnicians(),
        getAllLabTechOutbreakAssignments(),
        getLabTechOutbreakStats()
      ]);

      setLabTechnicians(techsData);
      setOutbreakAssignments(assignmentsData);
      setOutbreakStats(statsData);

      // Load department stats for each department
      const deptStats = {};
      for (const dept of departments) {
        deptStats[dept] = await getDepartmentStats(dept);
      }
      setDepartmentStats(deptStats);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load lab technician data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter technicians based on search term
  const filteredTechnicians = labTechnicians.filter((tech) =>
    tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tech.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tech.qualification.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tech.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTechnician = () => {
    setIsEditMode(false);
    setCurrentTechnician({
      name: "",
      specialization: "",
      qualification: "",
      experience: "",
      contactNumber: "",
      email: "",
      status: "Active",
      department: "",
      shift: "Morning",
      testingCapabilities: [],
      equipmentProficiency: [],
      specializedTraining: [],
      certifications: [],
      averageTestsPerDay: 0,
      accuracyRate: 95,
      averageProcessingTime: 30,
      emergencyAvailable: false,
      outbreakTrainingCompleted: false,
      biosafetyCertifications: []
    });
    setIsDialogOpen(true);
  };

  const handleEditTechnician = (technician: LabTechnician) => {
    setIsEditMode(true);
    setCurrentTechnician({ ...technician });
    setIsDialogOpen(true);
  };

  const handleDeleteTechnician = async (id: string, rev?: string) => {
    try {
      await deleteLabTechnician(id, rev);
      await loadData();
      toast({
        title: "Lab Technician Removed",
        description: "The lab technician record has been deleted successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete lab technician",
        variant: "destructive"
      });
    }
  };

  const handleSaveTechnician = async () => {
    if (!currentTechnician.name || !currentTechnician.specialization || !currentTechnician.qualification) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      const technicianData: LabTechnician = {
        _id: currentTechnician._id || `labtech-${Date.now()}`,
        type: 'labtech',
        name: currentTechnician.name!,
        specialization: currentTechnician.specialization!,
        qualification: currentTechnician.qualification!,
        experience: currentTechnician.experience!,
        contactNumber: currentTechnician.contactNumber!,
        email: currentTechnician.email!,
        status: currentTechnician.status as 'Active' | 'On Leave' | 'Inactive',
        department: currentTechnician.department!,
        shift: currentTechnician.shift as 'Morning' | 'Evening' | 'Night' | 'Rotating',
        testingCapabilities: currentTechnician.testingCapabilities || [],
        equipmentProficiency: currentTechnician.equipmentProficiency || [],
        specializedTraining: currentTechnician.specializedTraining || [],
        certifications: currentTechnician.certifications || [],
        averageTestsPerDay: currentTechnician.averageTestsPerDay || 0,
        accuracyRate: currentTechnician.accuracyRate || 95,
        averageProcessingTime: currentTechnician.averageProcessingTime || 30,
        emergencyAvailable: currentTechnician.emergencyAvailable || false,
        outbreakTrainingCompleted: currentTechnician.outbreakTrainingCompleted || false,
        biosafetyCertifications: currentTechnician.biosafetyCertifications || [],
        hireDate: currentTechnician.hireDate || new Date().toISOString().split('T')[0],
        createdAt: currentTechnician.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (isEditMode && currentTechnician._id) {
        await updateLabTechnician(technicianData);
        toast({
          title: "Lab Technician Updated",
          description: "Lab technician record has been updated successfully."
        });
      } else {
        await addLabTechnician(technicianData);
        toast({
          title: "Lab Technician Added",
          description: "New lab technician has been added successfully."
        });
      }
      
      setIsDialogOpen(false);
      await loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save lab technician",
        variant: "destructive"
      });
    }
  };

  const handleOutbreakAssignment = (technician: LabTechnician) => {
    setSelectedLabTech(technician);
    setOutbreakAssignmentForm({
      assignmentType: "sample-testing",
      outbreakType: "",
      priority: "medium",
      testingCapabilities: technician.testingCapabilities.join(', '),
      dailyTestingCapacity: technician.averageTestsPerDay.toString(),
      sampleProcessingLocation: "",
      workDays: [],
      startTime: "",
      endTime: "",
      isOnCall: false,
      emergencyAvailable: technician.emergencyAvailable,
      biosafetyCertifications: technician.biosafetyCertifications.join(', ')
    });
    setIsOutbreakDialogOpen(true);
  };

  const handleSaveOutbreakAssignment = async () => {
    if (!selectedLabTech || !outbreakAssignmentForm.outbreakType) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      const assignment: LabTechOutbreakAssignment = {
        _id: `labtech-outbreak-${Date.now()}`,
        type: 'labtech-outbreak-assignment',
        labTechId: selectedLabTech._id,
        labTechName: selectedLabTech.name,
        labTechSpecialization: selectedLabTech.specialization,
        labTechQualification: selectedLabTech.qualification,
        labTechContactNumber: selectedLabTech.contactNumber,
        labTechEmail: selectedLabTech.email,
        assignmentDate: new Date().toISOString().split('T')[0],
        assignmentType: outbreakAssignmentForm.assignmentType,
        assignmentStatus: 'active',
        outbreakType: outbreakAssignmentForm.outbreakType,
        priority: outbreakAssignmentForm.priority,
        testingCapabilities: outbreakAssignmentForm.testingCapabilities.split(',').map(s => s.trim()),
        assignedTestTypes: outbreakAssignmentForm.testingCapabilities.split(',').map(s => s.trim()),
        dailyTestingCapacity: parseInt(outbreakAssignmentForm.dailyTestingCapacity) || 0,
        specializedEquipment: selectedLabTech.equipmentProficiency,
        sampleCollectionSites: [],
        sampleProcessingLocation: outbreakAssignmentForm.sampleProcessingLocation,
        sampleStorageCapacity: 100,
        samplesProcessed: 0,
        testsCompleted: 0,
        positiveResults: 0,
        criticalResultsReported: 0,
        averageProcessingTime: selectedLabTech.averageProcessingTime,
        workSchedule: {
          days: outbreakAssignmentForm.workDays,
          startTime: outbreakAssignmentForm.startTime,
          endTime: outbreakAssignmentForm.endTime,
          isOnCall: outbreakAssignmentForm.isOnCall,
          emergencyAvailable: outbreakAssignmentForm.emergencyAvailable
        },
        outbreakTestingTrainingCompleted: selectedLabTech.outbreakTrainingCompleted,
        biosafetyCertifications: outbreakAssignmentForm.biosafetyCertifications.split(',').map(s => s.trim()),
        emergencyProtocolsTraining: false,
        qualityControlMetrics: {
          accuracy: selectedLabTech.accuracyRate,
          turnaroundTime: 4,
          errorRate: 100 - selectedLabTech.accuracyRate,
          calibrationStatus: 'current'
        },
        reportingStructure: "Lab Supervisor",
        reportingFrequency: 'daily',
        communicationChannels: ['email', 'phone'],
        escalationProtocol: ['supervisor', 'department-head'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await addLabTechOutbreakAssignment(assignment);
      toast({
        title: "Outbreak Assignment Created",
        description: "Lab technician has been assigned to outbreak response successfully."
      });
      
      setIsOutbreakDialogOpen(false);
      await loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create outbreak assignment",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentTechnician({
      ...currentTechnician,
      [name]: value
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setCurrentTechnician({
      ...currentTechnician,
      [name]: value
    });
  };

  const handleArrayInputChange = (name: string, value: string) => {
    setCurrentTechnician({
      ...currentTechnician,
      [name]: value.split(',').map(s => s.trim()).filter(s => s.length > 0)
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'on leave':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getOutbreakAssignmentsByTech = (labTechId: string) => {
    return outbreakAssignments.filter(assignment => 
      assignment.labTechId === labTechId && assignment.assignmentStatus === 'active'
    );
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Lab Technicians Management</h1>
          <p className="text-muted-foreground">
            Manage lab technicians, view specializations, monitor workloads, and assign outbreak response duties.
          </p>
        </div>
        <Button onClick={handleAddTechnician} className="bg-hospital-primary hover:bg-hospital-primary/90">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Lab Technician
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TestTube className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{labTechnicians.filter(lt => lt.status === 'Active').length}</p>
                <p className="text-sm text-gray-600">Active Lab Techs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{outbreakStats.totalLabTechsAssigned || 0}</p>
                <p className="text-sm text-gray-600">Outbreak Assigned</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{labTechnicians.filter(lt => lt.emergencyAvailable).length}</p>
                <p className="text-sm text-gray-600">Emergency Available</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Award className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{labTechnicians.filter(lt => lt.outbreakTrainingCompleted).length}</p>
                <p className="text-sm text-gray-600">Outbreak Trained</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="technicians">Lab Technicians</TabsTrigger>
          <TabsTrigger value="assignments">Outbreak Assignments</TabsTrigger>
          <TabsTrigger value="departments">Department Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="technicians" className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search technicians by name, specialization, qualification, or department..."
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
                  <TableHead>Specialization</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Outbreak</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTechnicians.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                      No lab technicians found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTechnicians.map((tech) => {
                    const outbreakAssignments = getOutbreakAssignmentsByTech(tech._id);
                    return (
                      <TableRow key={tech._id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{tech.name}</div>
                            <div className="text-sm text-gray-500 flex items-center space-x-2">
                              <Mail className="h-3 w-3" />
                              <span>{tech.email}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div>{tech.specialization}</div>
                            <div className="text-sm text-gray-500">{tech.qualification}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div>{tech.department}</div>
                            <div className="text-sm text-gray-500">{tech.shift} Shift</div>
                          </div>
                        </TableCell>
                        <TableCell>{tech.experience}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Phone className="h-3 w-3" />
                            <span className="text-sm">{tech.contactNumber}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(tech.status)}>
                            {tech.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col space-y-1">
                            {tech.emergencyAvailable && (
                              <Badge variant="outline" className="text-xs">Emergency Ready</Badge>
                            )}
                            {tech.outbreakTrainingCompleted && (
                              <Badge variant="outline" className="text-xs">Outbreak Trained</Badge>
                            )}
                            {outbreakAssignments.length > 0 && (
                              <Badge className="bg-red-100 text-red-800 text-xs">
                                {outbreakAssignments.length} Active
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button size="sm" variant="ghost" onClick={() => handleEditTechnician(tech)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => handleOutbreakAssignment(tech)}
                            className="text-orange-600"
                          >
                            <AlertTriangle className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => handleDeleteTechnician(tech._id, tech._rev)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Active Outbreak Assignments</span>
              </CardTitle>
              <CardDescription>
                Lab technicians currently assigned to outbreak response activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lab Technician</TableHead>
                    <TableHead>Assignment Type</TableHead>
                    <TableHead>Outbreak Type</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Daily Capacity</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {outbreakAssignments.filter(assignment => assignment.assignmentStatus === 'active').map((assignment) => (
                    <TableRow key={assignment._id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{assignment.labTechName}</div>
                          <div className="text-sm text-gray-500">{assignment.labTechSpecialization}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {assignment.assignmentType.replace('-', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>{assignment.outbreakType}</TableCell>
                      <TableCell>
                        <Badge className={
                          assignment.priority === 'critical' ? 'bg-red-100 text-red-800' :
                          assignment.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          assignment.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }>
                          {assignment.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>{assignment.dailyTestingCapacity}/day</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">
                          {assignment.assignmentStatus}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map((dept) => {
              const stats = departmentStats[dept] || {};
              return (
                <Card key={dept}>
                  <CardHeader>
                    <CardTitle className="text-lg">{dept}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Staff:</span>
                        <span className="font-medium">{stats.totalLabTechs || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Active:</span>
                        <span className="font-medium text-green-600">{stats.activeCount || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Emergency Ready:</span>
                        <span className="font-medium text-blue-600">{stats.emergencyAvailableCount || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Outbreak Trained:</span>
                        <span className="font-medium text-purple-600">{stats.outbreakTrainedCount || 0}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Lab Technician Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Lab Technician" : "Add New Lab Technician"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={currentTechnician.name || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={currentTechnician.email || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization *</Label>
                <Select 
                  value={currentTechnician.specialization || ""} 
                  onValueChange={(value) => handleSelectChange("specialization", value)}
                >
                  <SelectTrigger id="specialization">
                    <SelectValue placeholder="Select specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    {specializations.map((spec) => (
                      <SelectItem key={spec} value={spec}>
                        {spec}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Select 
                  value={currentTechnician.department || ""} 
                  onValueChange={(value) => handleSelectChange("department", value)}
                >
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="qualification">Qualification *</Label>
                <Input
                  id="qualification"
                  name="qualification"
                  value={currentTechnician.qualification || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Experience *</Label>
                <Input
                  id="experience"
                  name="experience"
                  value={currentTechnician.experience || ""}
                  onChange={handleInputChange}
                  placeholder="e.g., 5 years"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactNumber">Contact Number *</Label>
                <Input
                  id="contactNumber"
                  name="contactNumber"
                  value={currentTechnician.contactNumber || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shift">Shift</Label>
                <Select 
                  value={currentTechnician.shift || "Morning"} 
                  onValueChange={(value) => handleSelectChange("shift", value)}
                >
                  <SelectTrigger id="shift">
                    <SelectValue placeholder="Select shift" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Morning">Morning</SelectItem>
                    <SelectItem value="Evening">Evening</SelectItem>
                    <SelectItem value="Night">Night</SelectItem>
                    <SelectItem value="Rotating">Rotating</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="testingCapabilities">Testing Capabilities (comma separated)</Label>
              <Input
                id="testingCapabilities"
                value={Array.isArray(currentTechnician.testingCapabilities) ? currentTechnician.testingCapabilities.join(', ') : ""}
                onChange={(e) => handleArrayInputChange("testingCapabilities", e.target.value)}
                placeholder="PCR, Antigen, Serology, Culture"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="certifications">Certifications (comma separated)</Label>
              <Input
                id="certifications"
                value={Array.isArray(currentTechnician.certifications) ? currentTechnician.certifications.join(', ') : ""}
                onChange={(e) => handleArrayInputChange("certifications", e.target.value)}
                placeholder="ASCP, AMT, NCA"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="averageTestsPerDay">Avg Tests/Day</Label>
                <Input
                  id="averageTestsPerDay"
                  name="averageTestsPerDay"
                  type="number"
                  value={currentTechnician.averageTestsPerDay || 0}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accuracyRate">Accuracy Rate (%)</Label>
                <Input
                  id="accuracyRate"
                  name="accuracyRate"
                  type="number"
                  min="0"
                  max="100"
                  value={currentTechnician.accuracyRate || 95}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="averageProcessingTime">Avg Processing Time (min)</Label>
                <Input
                  id="averageProcessingTime"
                  name="averageProcessingTime"
                  type="number"
                  value={currentTechnician.averageProcessingTime || 30}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={currentTechnician.status || "Active"} 
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="On Leave">On Leave</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="biosafetyCertifications">Biosafety Certifications</Label>
                <Input
                  id="biosafetyCertifications"
                  value={Array.isArray(currentTechnician.biosafetyCertifications) ? currentTechnician.biosafetyCertifications.join(', ') : ""}
                  onChange={(e) => handleArrayInputChange("biosafetyCertifications", e.target.value)}
                  placeholder="BSL-2, BSL-3, Pathogen Handling"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="emergencyAvailable"
                  checked={currentTechnician.emergencyAvailable || false}
                  onCheckedChange={(checked) => setCurrentTechnician({
                    ...currentTechnician,
                    emergencyAvailable: !!checked
                  })}
                />
                <Label htmlFor="emergencyAvailable">Emergency Available</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="outbreakTrainingCompleted"
                  checked={currentTechnician.outbreakTrainingCompleted || false}
                  onCheckedChange={(checked) => setCurrentTechnician({
                    ...currentTechnician,
                    outbreakTrainingCompleted: !!checked
                  })}
                />
                <Label htmlFor="outbreakTrainingCompleted">Outbreak Training Completed</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTechnician} className="bg-hospital-primary hover:bg-hospital-primary/90">
              {isEditMode ? "Update" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Outbreak Assignment Dialog */}
      <Dialog open={isOutbreakDialogOpen} onOpenChange={setIsOutbreakDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Assign to Outbreak Response</DialogTitle>
            <DialogDescription>
              Assign {selectedLabTech?.name} to outbreak testing activities
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assignmentType">Assignment Type</Label>
                <Select 
                  value={outbreakAssignmentForm.assignmentType} 
                  onValueChange={(value) => setOutbreakAssignmentForm({
                    ...outbreakAssignmentForm, 
                    assignmentType: value as any
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sample-testing">Sample Testing</SelectItem>
                    <SelectItem value="diagnostic-support">Diagnostic Support</SelectItem>
                    <SelectItem value="surveillance-testing">Surveillance Testing</SelectItem>
                    <SelectItem value="contact-screening">Contact Screening</SelectItem>
                    <SelectItem value="vaccine-testing">Vaccine Testing</SelectItem>
                    <SelectItem value="research-support">Research Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select 
                  value={outbreakAssignmentForm.priority} 
                  onValueChange={(value) => setOutbreakAssignmentForm({
                    ...outbreakAssignmentForm, 
                    priority: value as any
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="outbreakType">Outbreak Type *</Label>
              <Input
                id="outbreakType"
                value={outbreakAssignmentForm.outbreakType}
                onChange={(e) => setOutbreakAssignmentForm({
                  ...outbreakAssignmentForm, 
                  outbreakType: e.target.value
                })}
                placeholder="COVID-19, Influenza, etc."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sampleProcessingLocation">Sample Processing Location</Label>
              <Input
                id="sampleProcessingLocation"
                value={outbreakAssignmentForm.sampleProcessingLocation}
                onChange={(e) => setOutbreakAssignmentForm({
                  ...outbreakAssignmentForm, 
                  sampleProcessingLocation: e.target.value
                })}
                placeholder="Main Lab, Building A"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={outbreakAssignmentForm.startTime}
                  onChange={(e) => setOutbreakAssignmentForm({
                    ...outbreakAssignmentForm, 
                    startTime: e.target.value
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={outbreakAssignmentForm.endTime}
                  onChange={(e) => setOutbreakAssignmentForm({
                    ...outbreakAssignmentForm, 
                    endTime: e.target.value
                  })}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isOnCall"
                  checked={outbreakAssignmentForm.isOnCall}
                  onCheckedChange={(checked) => setOutbreakAssignmentForm({
                    ...outbreakAssignmentForm, 
                    isOnCall: !!checked
                  })}
                />
                <Label htmlFor="isOnCall">On Call</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="emergencyAvailable"
                  checked={outbreakAssignmentForm.emergencyAvailable}
                  onCheckedChange={(checked) => setOutbreakAssignmentForm({
                    ...outbreakAssignmentForm, 
                    emergencyAvailable: !!checked
                  })}
                />
                <Label htmlFor="emergencyAvailable">Emergency Available</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOutbreakDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveOutbreakAssignment}>
              <AlertTriangle className="h-4 w-4 mr-2" />
              Assign to Outbreak
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LabTechnicians;
