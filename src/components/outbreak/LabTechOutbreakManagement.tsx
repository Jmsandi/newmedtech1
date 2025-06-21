import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Users, 
  Activity, 
  TestTube, 
  Clock,
  MapPin,
  Phone,
  Award,
  AlertTriangle,
  CheckCircle,
  UserPlus,
  Microscope,
  FlaskConical
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  getAllLabTechOutbreakAssignments,
  addLabTechOutbreakAssignment,
  updateLabTechOutbreakAssignment,
  deleteLabTechOutbreakAssignment,
  getAllLabTechOutbreakActivities,
  addLabTechOutbreakActivity,
  getAllOutbreakLabTestingTeams,
  addOutbreakLabTestingTeam,
  getLabTechOutbreakStats,
  getLabTechsInOutbreakControl,
  getLabTechsByOutbreakType,
  LabTechOutbreakAssignment,
  LabTechOutbreakActivity,
  OutbreakLabTestingTeam
} from "@/services/database/outbreak";
import { getAllLabTechnicians, LabTechnician } from "@/services/database/labtechs";

export const LabTechOutbreakManagement = () => {
  const [assignments, setAssignments] = useState<LabTechOutbreakAssignment[]>([]);
  const [activities, setActivities] = useState<LabTechOutbreakActivity[]>([]);
  const [teams, setTeams] = useState<OutbreakLabTestingTeam[]>([]);
  const [labTechs, setLabTechs] = useState<LabTechnician[]>([]);
  const [stats, setStats] = useState({
    totalLabTechsAssigned: 0,
    totalSamplesProcessed: 0,
    totalTestsCompleted: 0,
    totalPositiveResults: 0,
    totalCriticalResults: 0,
    recentActivities: 0,
    averageProcessingTime: 0,
    averageTurnaroundTime: 0,
    pendingSamples: 0,
    completedSamples: 0,
    criticalSamples: 0
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [showAssignmentDialog, setShowAssignmentDialog] = useState(false);
  const [showActivityDialog, setShowActivityDialog] = useState(false);
  const [showTeamDialog, setShowTeamDialog] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<LabTechOutbreakAssignment | null>(null);
  const [activeTab, setActiveTab] = useState("assignments");
  
  const { toast } = useToast();

  const [assignmentForm, setAssignmentForm] = useState({
    labTechId: "",
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
    outbreakTestingTrainingCompleted: false,
    biosafetyCertifications: ""
  });

  const [activityForm, setActivityForm] = useState({
    labTechId: "",
    assignmentId: "",
    activityType: "sample-processing" as const,
    activityDescription: "",
    samplesReceived: "",
    samplesProcessed: "",
    startTime: "",
    endTime: "",
    outcome: "completed" as const,
    notes: ""
  });

  const [teamForm, setTeamForm] = useState({
    teamName: "",
    teamCode: "",
    outbreakType: "",
    teamLeaderId: "",
    laboratoryLocation: "",
    targetTestingVolume: "",
    equipmentInventory: "",
    selectedLabTechs: [] as string[]
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [assignmentsData, activitiesData, teamsData, labTechsData, statsData] = await Promise.all([
        getAllLabTechOutbreakAssignments(),
        getAllLabTechOutbreakActivities(),
        getAllOutbreakLabTestingTeams(),
        getAllLabTechnicians(),
        getLabTechOutbreakStats()
      ]);

      setAssignments(assignmentsData);
      setActivities(activitiesData);
      setTeams(teamsData);
      setLabTechs(labTechsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load lab tech outbreak management data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAssignment = async () => {
    try {
      const selectedLabTech = labTechs.find(lt => lt._id === assignmentForm.labTechId);
      if (!selectedLabTech) {
        toast({
          title: "Error",
          description: "Please select a lab technician",
          variant: "destructive"
        });
        return;
      }

      const assignment: LabTechOutbreakAssignment = {
        _id: editingAssignment?._id || `labtech-outbreak-${Date.now()}`,
        type: 'labtech-outbreak-assignment',
        labTechId: assignmentForm.labTechId,
        labTechName: selectedLabTech.name,
        labTechSpecialization: selectedLabTech.specialization,
        labTechQualification: selectedLabTech.qualification,
        labTechContactNumber: selectedLabTech.contactNumber,
        labTechEmail: selectedLabTech.email,
        assignmentDate: new Date().toISOString().split('T')[0],
        assignmentType: assignmentForm.assignmentType,
        assignmentStatus: 'active',
        outbreakType: assignmentForm.outbreakType,
        priority: assignmentForm.priority,
        testingCapabilities: assignmentForm.testingCapabilities.split(',').map(s => s.trim()),
        assignedTestTypes: assignmentForm.testingCapabilities.split(',').map(s => s.trim()),
        dailyTestingCapacity: parseInt(assignmentForm.dailyTestingCapacity) || 0,
        specializedEquipment: [],
        sampleCollectionSites: [],
        sampleProcessingLocation: assignmentForm.sampleProcessingLocation,
        sampleStorageCapacity: 100,
        samplesProcessed: 0,
        testsCompleted: 0,
        positiveResults: 0,
        criticalResultsReported: 0,
        averageProcessingTime: 0,
        workSchedule: {
          days: assignmentForm.workDays,
          startTime: assignmentForm.startTime,
          endTime: assignmentForm.endTime,
          isOnCall: assignmentForm.isOnCall,
          emergencyAvailable: assignmentForm.emergencyAvailable
        },
        outbreakTestingTrainingCompleted: assignmentForm.outbreakTestingTrainingCompleted,
        biosafetyCertifications: assignmentForm.biosafetyCertifications.split(',').map(s => s.trim()),
        emergencyProtocolsTraining: false,
        qualityControlMetrics: {
          accuracy: 95,
          turnaroundTime: 4,
          errorRate: 2,
          calibrationStatus: 'current'
        },
        reportingStructure: "Lab Supervisor",
        reportingFrequency: 'daily',
        communicationChannels: ['email', 'phone'],
        escalationProtocol: ['supervisor', 'department-head'],
        createdAt: editingAssignment?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (editingAssignment) {
        await updateLabTechOutbreakAssignment(assignment);
        toast({
          title: "Assignment Updated",
          description: "Lab technician outbreak assignment has been updated successfully"
        });
      } else {
        await addLabTechOutbreakAssignment(assignment);
        toast({
          title: "Assignment Created",
          description: "Lab technician outbreak assignment has been created successfully"
        });
      }

      setShowAssignmentDialog(false);
      setEditingAssignment(null);
      resetAssignmentForm();
      await loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save assignment",
        variant: "destructive"
      });
    }
  };

  const resetAssignmentForm = () => {
    setAssignmentForm({
      labTechId: "",
      assignmentType: "sample-testing",
      outbreakType: "",
      priority: "medium",
      testingCapabilities: "",
      dailyTestingCapacity: "",
      sampleProcessingLocation: "",
      workDays: [],
      startTime: "",
      endTime: "",
      isOnCall: false,
      emergencyAvailable: false,
      outbreakTestingTrainingCompleted: false,
      biosafetyCertifications: ""
    });
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'suspended': return 'bg-yellow-100 text-yellow-800';
      case 'transferred': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header with Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TestTube className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.totalLabTechsAssigned}</p>
                <p className="text-sm text-gray-600">Lab Techs Assigned</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FlaskConical className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{stats.totalSamplesProcessed}</p>
                <p className="text-sm text-gray-600">Samples Processed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Microscope className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{stats.totalTestsCompleted}</p>
                <p className="text-sm text-gray-600">Tests Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{stats.criticalSamples}</p>
                <p className="text-sm text-gray-600">Critical Samples</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="assignments">Lab Tech Assignments</TabsTrigger>
          <TabsTrigger value="activities">Testing Activities</TabsTrigger>
          <TabsTrigger value="teams">Testing Teams</TabsTrigger>
        </TabsList>

        <TabsContent value="assignments" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <UserPlus className="h-5 w-5" />
                    <span>Lab Technician Outbreak Assignments</span>
                  </CardTitle>
                  <CardDescription>
                    Manage lab technician assignments to outbreak testing activities
                  </CardDescription>
                </div>
                <Dialog open={showAssignmentDialog} onOpenChange={setShowAssignmentDialog}>
                  <DialogTrigger asChild>
                    <Button onClick={() => {
                      setEditingAssignment(null);
                      resetAssignmentForm();
                    }}>
                      <Plus className="h-4 w-4 mr-2" />
                      New Assignment
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingAssignment ? 'Edit' : 'Create'} Lab Tech Assignment
                      </DialogTitle>
                      <DialogDescription>
                        Assign a lab technician to outbreak testing activities
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="labTech">Lab Technician</Label>
                          <Select onValueChange={(value) => setAssignmentForm({...assignmentForm, labTechId: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select lab technician" />
                            </SelectTrigger>
                            <SelectContent>
                              {labTechs.filter(lt => lt.status === 'Active').map((labTech) => (
                                <SelectItem key={labTech._id} value={labTech._id}>
                                  {labTech.name} - {labTech.specialization}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="assignmentType">Assignment Type</Label>
                          <Select onValueChange={(value) => setAssignmentForm({...assignmentForm, assignmentType: value as any})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select assignment type" />
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
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="outbreakType">Outbreak Type</Label>
                          <Input
                            id="outbreakType"
                            value={assignmentForm.outbreakType}
                            onChange={(e) => setAssignmentForm({...assignmentForm, outbreakType: e.target.value})}
                            placeholder="COVID-19, Influenza, etc."
                          />
                        </div>
                        <div>
                          <Label htmlFor="priority">Priority</Label>
                          <Select onValueChange={(value) => setAssignmentForm({...assignmentForm, priority: value as any})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
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
                      
                      <div>
                        <Label htmlFor="testingCapabilities">Testing Capabilities (comma separated)</Label>
                        <Input
                          id="testingCapabilities"
                          value={assignmentForm.testingCapabilities}
                          onChange={(e) => setAssignmentForm({...assignmentForm, testingCapabilities: e.target.value})}
                          placeholder="PCR, Antigen, Serology, Culture"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="dailyCapacity">Daily Testing Capacity</Label>
                          <Input
                            id="dailyCapacity"
                            type="number"
                            value={assignmentForm.dailyTestingCapacity}
                            onChange={(e) => setAssignmentForm({...assignmentForm, dailyTestingCapacity: e.target.value})}
                            placeholder="50"
                          />
                        </div>
                        <div>
                          <Label htmlFor="processingLocation">Sample Processing Location</Label>
                          <Input
                            id="processingLocation"
                            value={assignmentForm.sampleProcessingLocation}
                            onChange={(e) => setAssignmentForm({...assignmentForm, sampleProcessingLocation: e.target.value})}
                            placeholder="Main Lab, Building A"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="startTime">Start Time</Label>
                          <Input
                            id="startTime"
                            type="time"
                            value={assignmentForm.startTime}
                            onChange={(e) => setAssignmentForm({...assignmentForm, startTime: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="endTime">End Time</Label>
                          <Input
                            id="endTime"
                            type="time"
                            value={assignmentForm.endTime}
                            onChange={(e) => setAssignmentForm({...assignmentForm, endTime: e.target.value})}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="biosafetyCertifications">Biosafety Certifications (comma separated)</Label>
                        <Input
                          id="biosafetyCertifications"
                          value={assignmentForm.biosafetyCertifications}
                          onChange={(e) => setAssignmentForm({...assignmentForm, biosafetyCertifications: e.target.value})}
                          placeholder="BSL-2, BSL-3, Pathogen Handling"
                        />
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="isOnCall"
                            checked={assignmentForm.isOnCall}
                            onCheckedChange={(checked) => setAssignmentForm({...assignmentForm, isOnCall: !!checked})}
                          />
                          <Label htmlFor="isOnCall">On Call</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="emergencyAvailable"
                            checked={assignmentForm.emergencyAvailable}
                            onCheckedChange={(checked) => setAssignmentForm({...assignmentForm, emergencyAvailable: !!checked})}
                          />
                          <Label htmlFor="emergencyAvailable">Emergency Available</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="outbreakTraining"
                            checked={assignmentForm.outbreakTestingTrainingCompleted}
                            onCheckedChange={(checked) => setAssignmentForm({...assignmentForm, outbreakTestingTrainingCompleted: !!checked})}
                          />
                          <Label htmlFor="outbreakTraining">Outbreak Training Completed</Label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setShowAssignmentDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveAssignment}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Assignment
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lab Technician</TableHead>
                    <TableHead>Assignment Type</TableHead>
                    <TableHead>Outbreak Type</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Testing Capacity</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignments.map((assignment) => (
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
                        <Badge className={getPriorityBadgeColor(assignment.priority)}>
                          {assignment.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(assignment.assignmentStatus)}>
                          {assignment.assignmentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>{assignment.dailyTestingCapacity}/day</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Lab Technician Testing Activities</span>
              </CardTitle>
              <CardDescription>
                Track and monitor lab technician testing activities and performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                Testing activities tracking will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teams" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Outbreak Lab Testing Teams</span>
              </CardTitle>
              <CardDescription>
                Manage specialized lab testing teams for outbreak response
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                Lab testing teams management will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 