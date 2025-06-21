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
  Shield, 
  Clock,
  MapPin,
  Phone,
  Award,
  AlertTriangle,
  CheckCircle,
  UserPlus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  getAllNurseOutbreakAssignments,
  addNurseOutbreakAssignment,
  updateNurseOutbreakAssignment,
  deleteNurseOutbreakAssignment,
  getAllNurseOutbreakActivities,
  addNurseOutbreakActivity,
  getAllOutbreakControlTeams,
  addOutbreakControlTeam,
  getOutbreakControlStats,
  getNursesInOutbreakControl,
  getNursesByOutbreakType,
  NurseOutbreakAssignment,
  NurseOutbreakActivity,
  OutbreakControlTeam
} from "@/services/database/outbreak";
import { getAllNurses, Nurse } from "@/services/database/nurses";

export const NurseOutbreakManagement = () => {
  const [assignments, setAssignments] = useState<NurseOutbreakAssignment[]>([]);
  const [activities, setActivities] = useState<NurseOutbreakActivity[]>([]);
  const [teams, setTeams] = useState<OutbreakControlTeam[]>([]);
  const [nurses, setNurses] = useState<Nurse[]>([]);
  const [stats, setStats] = useState({
    totalNursesAssigned: 0,
    totalCasesManaged: 0,
    totalContactsTraced: 0,
    totalVaccinations: 0,
    totalTeams: 0,
    activeTeams: 0,
    recentActivities: 0,
    averageResponseTime: 0
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [showAssignmentDialog, setShowAssignmentDialog] = useState(false);
  const [showActivityDialog, setShowActivityDialog] = useState(false);
  const [showTeamDialog, setShowTeamDialog] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<NurseOutbreakAssignment | null>(null);
  const [activeTab, setActiveTab] = useState("assignments");
  
  const { toast } = useToast();

  const [assignmentForm, setAssignmentForm] = useState({
    nurseId: "",
    assignmentType: "case-management" as const,
    outbreakType: "",
    responsibilities: "",
    coverageArea: "",
    workDays: [] as string[],
    startTime: "",
    endTime: "",
    isOnCall: false,
    outbreakTrainingCompleted: false,
    certifications: ""
  });

  const [activityForm, setActivityForm] = useState({
    nurseId: "",
    assignmentId: "",
    activityType: "case-visit" as const,
    activityDescription: "",
    location: "",
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
    coverageAreas: "",
    targetPopulation: "",
    estimatedCases: "",
    equipment: "",
    selectedNurses: [] as string[]
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [assignmentsData, activitiesData, teamsData, nursesData, statsData] = await Promise.all([
        getAllNurseOutbreakAssignments(),
        getAllNurseOutbreakActivities(),
        getAllOutbreakControlTeams(),
        getAllNurses(),
        getOutbreakControlStats()
      ]);

      setAssignments(assignmentsData);
      setActivities(activitiesData);
      setTeams(teamsData);
      setNurses(nursesData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load outbreak management data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAssignment = async () => {
    try {
      const selectedNurse = nurses.find(n => n._id === assignmentForm.nurseId);
      if (!selectedNurse) {
        toast({
          title: "Error",
          description: "Please select a nurse",
          variant: "destructive"
        });
        return;
      }

      const assignmentData: NurseOutbreakAssignment = {
        _id: editingAssignment?._id || `nurse-outbreak-${Date.now()}`,
        _rev: editingAssignment?._rev,
        type: 'nurse-outbreak-assignment',
        nurseId: assignmentForm.nurseId,
        nurseName: selectedNurse.name,
        nurseSpecialization: selectedNurse.specialization,
        nurseWard: selectedNurse.ward,
        nurseContactNumber: selectedNurse.contactNumber,
        assignmentDate: new Date().toISOString().split('T')[0],
        assignmentType: assignmentForm.assignmentType,
        assignmentStatus: 'active',
        responsibilities: assignmentForm.responsibilities.split(',').map(r => r.trim()),
        specializedTasks: [],
        outbreakType: assignmentForm.outbreakType,
        assignedCases: [],
        assignedContacts: [],
        coverageArea: assignmentForm.coverageArea,
        casesManaged: 0,
        contactsTraced: 0,
        vaccinationsAdministered: 0,
        educationSessionsConducted: 0,
        workSchedule: {
          days: assignmentForm.workDays,
          startTime: assignmentForm.startTime,
          endTime: assignmentForm.endTime,
          isOnCall: assignmentForm.isOnCall
        },
        outbreakTrainingCompleted: assignmentForm.outbreakTrainingCompleted,
        certifications: assignmentForm.certifications.split(',').map(c => c.trim()),
        createdAt: editingAssignment?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (editingAssignment) {
        await updateNurseOutbreakAssignment(assignmentData);
        toast({
          title: "Success",
          description: "Assignment updated successfully"
        });
      } else {
        await addNurseOutbreakAssignment(assignmentData);
        toast({
          title: "Success",
          description: "Nurse assigned to outbreak control successfully"
        });
      }

      setShowAssignmentDialog(false);
      resetAssignmentForm();
      loadData();
    } catch (error) {
      console.error('Error saving assignment:', error);
      toast({
        title: "Error",
        description: "Failed to save assignment",
        variant: "destructive"
      });
    }
  };

  const handleSaveActivity = async () => {
    try {
      const selectedNurse = nurses.find(n => n._id === activityForm.nurseId);
      if (!selectedNurse) {
        toast({
          title: "Error",
          description: "Please select a nurse",
          variant: "destructive"
        });
        return;
      }

      const activityData: NurseOutbreakActivity = {
        _id: `nurse-activity-${Date.now()}`,
        type: 'nurse-outbreak-activity',
        nurseId: activityForm.nurseId,
        nurseName: selectedNurse.name,
        assignmentId: activityForm.assignmentId,
        activityDate: new Date().toISOString().split('T')[0],
        activityType: activityForm.activityType,
        activityDescription: activityForm.activityDescription,
        location: activityForm.location,
        startTime: activityForm.startTime,
        endTime: activityForm.endTime,
        duration: 0, // Calculate based on start/end time
        relatedCaseIds: [],
        relatedContactIds: [],
        outcome: activityForm.outcome,
        results: [],
        followUpRequired: false,
        notes: activityForm.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await addNurseOutbreakActivity(activityData);
      toast({
        title: "Success",
        description: "Activity logged successfully"
      });

      setShowActivityDialog(false);
      resetActivityForm();
      loadData();
    } catch (error) {
      console.error('Error saving activity:', error);
      toast({
        title: "Error",
        description: "Failed to log activity",
        variant: "destructive"
      });
    }
  };

  const handleSaveTeam = async () => {
    try {
      const teamLeader = nurses.find(n => n._id === teamForm.teamLeaderId);
      if (!teamLeader) {
        toast({
          title: "Error",
          description: "Please select a team leader",
          variant: "destructive"
        });
        return;
      }

      const teamData: OutbreakControlTeam = {
        _id: `outbreak-team-${Date.now()}`,
        type: 'outbreak-control-team',
        teamName: teamForm.teamName,
        teamCode: teamForm.teamCode,
        outbreakType: teamForm.outbreakType,
        teamStatus: 'active',
        teamLeaderId: teamForm.teamLeaderId,
        teamLeaderName: teamLeader.name,
        teamLeaderRole: 'nurse',
        assignedNurses: teamForm.selectedNurses.map(nurseId => {
          const nurse = nurses.find(n => n._id === nurseId);
          return {
            nurseId,
            nurseName: nurse?.name || '',
            role: 'case-manager' as const,
            assignmentDate: new Date().toISOString().split('T')[0]
          };
        }),
        coverageAreas: teamForm.coverageAreas.split(',').map(a => a.trim()),
        targetPopulation: parseInt(teamForm.targetPopulation) || 0,
        estimatedCases: parseInt(teamForm.estimatedCases) || 0,
        equipment: teamForm.equipment.split(',').map(e => e.trim()),
        vehicles: [],
        supplies: [],
        totalCasesManaged: 0,
        totalContactsTraced: 0,
        totalVaccinationsGiven: 0,
        responseTime: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await addOutbreakControlTeam(teamData);
      toast({
        title: "Success",
        description: "Outbreak control team created successfully"
      });

      setShowTeamDialog(false);
      resetTeamForm();
      loadData();
    } catch (error) {
      console.error('Error saving team:', error);
      toast({
        title: "Error",
        description: "Failed to create team",
        variant: "destructive"
      });
    }
  };

  const resetAssignmentForm = () => {
    setAssignmentForm({
      nurseId: "",
      assignmentType: "case-management",
      outbreakType: "",
      responsibilities: "",
      coverageArea: "",
      workDays: [],
      startTime: "",
      endTime: "",
      isOnCall: false,
      outbreakTrainingCompleted: false,
      certifications: ""
    });
    setEditingAssignment(null);
  };

  const resetActivityForm = () => {
    setActivityForm({
      nurseId: "",
      assignmentId: "",
      activityType: "case-visit",
      activityDescription: "",
      location: "",
      startTime: "",
      endTime: "",
      outcome: "completed",
      notes: ""
    });
  };

  const resetTeamForm = () => {
    setTeamForm({
      teamName: "",
      teamCode: "",
      outbreakType: "",
      teamLeaderId: "",
      coverageAreas: "",
      targetPopulation: "",
      estimatedCases: "",
      equipment: "",
      selectedNurses: []
    });
  };

  const handleEditAssignment = (assignment: NurseOutbreakAssignment) => {
    setEditingAssignment(assignment);
    setAssignmentForm({
      nurseId: assignment.nurseId,
      assignmentType: assignment.assignmentType,
      outbreakType: assignment.outbreakType || "",
      responsibilities: assignment.responsibilities.join(', '),
      coverageArea: assignment.coverageArea,
      workDays: assignment.workSchedule.days,
      startTime: assignment.workSchedule.startTime,
      endTime: assignment.workSchedule.endTime,
      isOnCall: assignment.workSchedule.isOnCall,
      outbreakTrainingCompleted: assignment.outbreakTrainingCompleted,
      certifications: assignment.certifications.join(', ')
    });
    setShowAssignmentDialog(true);
  };

  const handleDeleteAssignment = async (id: string, rev?: string) => {
    try {
      await deleteNurseOutbreakAssignment(id, rev);
      toast({
        title: "Success",
        description: "Assignment deleted successfully"
      });
      loadData();
    } catch (error) {
      console.error('Error deleting assignment:', error);
      toast({
        title: "Error",
        description: "Failed to delete assignment",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      completed: "bg-blue-100 text-blue-800",
      suspended: "bg-yellow-100 text-yellow-800",
      transferred: "bg-purple-100 text-purple-800"
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getAssignmentTypeBadge = (type: string) => {
    const colors = {
      "case-management": "bg-blue-100 text-blue-800",
      "contact-tracing": "bg-green-100 text-green-800",
      "vaccination": "bg-purple-100 text-purple-800",
      "surveillance": "bg-orange-100 text-orange-800",
      "education": "bg-yellow-100 text-yellow-800",
      "emergency-response": "bg-red-100 text-red-800"
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Nurses Assigned</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalNursesAssigned}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cases Managed</p>
                <p className="text-2xl font-bold text-green-600">{stats.totalCasesManaged}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Contacts Traced</p>
                <p className="text-2xl font-bold text-orange-600">{stats.totalContactsTraced}</p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <MapPin className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Vaccinations</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalVaccinations}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="assignments">Nurse Assignments</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="teams">Control Teams</TabsTrigger>
        </TabsList>

        <TabsContent value="assignments" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <UserPlus className="h-5 w-5" />
                    <span>Nurse Outbreak Assignments</span>
                  </CardTitle>
                  <CardDescription>
                    Manage nurse assignments to outbreak control activities
                  </CardDescription>
                </div>
                <Dialog open={showAssignmentDialog} onOpenChange={setShowAssignmentDialog}>
                  <DialogTrigger asChild>
                    <Button onClick={resetAssignmentForm}>
                      <Plus className="h-4 w-4 mr-2" />
                      Assign Nurse
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {editingAssignment ? 'Edit Assignment' : 'Assign Nurse to Outbreak Control'}
                      </DialogTitle>
                      <DialogDescription>
                        Configure nurse assignment details for outbreak control activities
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="nurse">Nurse</Label>
                          <Select value={assignmentForm.nurseId} onValueChange={(value) => setAssignmentForm({...assignmentForm, nurseId: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select nurse" />
                            </SelectTrigger>
                            <SelectContent>
                              {nurses.map((nurse) => (
                                <SelectItem key={nurse._id} value={nurse._id}>
                                  {nurse.name} - {nurse.specialization}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="assignmentType">Assignment Type</Label>
                          <Select value={assignmentForm.assignmentType} onValueChange={(value: any) => setAssignmentForm({...assignmentForm, assignmentType: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="case-management">Case Management</SelectItem>
                              <SelectItem value="contact-tracing">Contact Tracing</SelectItem>
                              <SelectItem value="vaccination">Vaccination</SelectItem>
                              <SelectItem value="surveillance">Surveillance</SelectItem>
                              <SelectItem value="education">Education</SelectItem>
                              <SelectItem value="emergency-response">Emergency Response</SelectItem>
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
                          <Label htmlFor="coverageArea">Coverage Area</Label>
                          <Input
                            id="coverageArea"
                            value={assignmentForm.coverageArea}
                            onChange={(e) => setAssignmentForm({...assignmentForm, coverageArea: e.target.value})}
                            placeholder="District, facility, etc."
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="responsibilities">Responsibilities (comma separated)</Label>
                        <Textarea
                          id="responsibilities"
                          value={assignmentForm.responsibilities}
                          onChange={(e) => setAssignmentForm({...assignmentForm, responsibilities: e.target.value})}
                          placeholder="Patient monitoring, contact tracing, vaccination administration"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
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
                        <div className="flex items-center space-x-2 pt-6">
                          <Checkbox
                            id="isOnCall"
                            checked={assignmentForm.isOnCall}
                            onCheckedChange={(checked) => setAssignmentForm({...assignmentForm, isOnCall: !!checked})}
                          />
                          <Label htmlFor="isOnCall">On Call</Label>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="outbreakTrainingCompleted"
                          checked={assignmentForm.outbreakTrainingCompleted}
                          onCheckedChange={(checked) => setAssignmentForm({...assignmentForm, outbreakTrainingCompleted: !!checked})}
                        />
                        <Label htmlFor="outbreakTrainingCompleted">Outbreak Training Completed</Label>
                      </div>
                      <div>
                        <Label htmlFor="certifications">Certifications (comma separated)</Label>
                        <Input
                          id="certifications"
                          value={assignmentForm.certifications}
                          onChange={(e) => setAssignmentForm({...assignmentForm, certifications: e.target.value})}
                          placeholder="Infection Control, Emergency Response, etc."
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleSaveAssignment}>
                          <Save className="h-4 w-4 mr-2" />
                          {editingAssignment ? 'Update' : 'Assign'}
                        </Button>
                        <Button variant="outline" onClick={() => setShowAssignmentDialog(false)}>
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nurse</TableHead>
                    <TableHead>Assignment Type</TableHead>
                    <TableHead>Outbreak Type</TableHead>
                    <TableHead>Coverage Area</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignments.map((assignment) => (
                    <TableRow key={assignment._id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{assignment.nurseName}</div>
                          <div className="text-sm text-gray-500">{assignment.nurseSpecialization}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getAssignmentTypeBadge(assignment.assignmentType)}>
                          {assignment.assignmentType.replace('-', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>{assignment.outbreakType || 'General'}</TableCell>
                      <TableCell>{assignment.coverageArea}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(assignment.assignmentStatus)}>
                          {assignment.assignmentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>Cases: {assignment.casesManaged}</div>
                          <div>Contacts: {assignment.contactsTraced}</div>
                          <div>Vaccinations: {assignment.vaccinationsAdministered}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditAssignment(assignment)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteAssignment(assignment._id, assignment._rev)}
                          >
                            <Trash2 className="h-4 w-4" />
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
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5" />
                    <span>Nurse Activities</span>
                  </CardTitle>
                  <CardDescription>
                    Track and log nurse activities in outbreak control
                  </CardDescription>
                </div>
                <Dialog open={showActivityDialog} onOpenChange={setShowActivityDialog}>
                  <DialogTrigger asChild>
                    <Button onClick={resetActivityForm}>
                      <Plus className="h-4 w-4 mr-2" />
                      Log Activity
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Log Nurse Activity</DialogTitle>
                      <DialogDescription>
                        Record nurse activity in outbreak control operations
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="activityNurse">Nurse</Label>
                          <Select value={activityForm.nurseId} onValueChange={(value) => setActivityForm({...activityForm, nurseId: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select nurse" />
                            </SelectTrigger>
                            <SelectContent>
                              {nurses.map((nurse) => (
                                <SelectItem key={nurse._id} value={nurse._id}>
                                  {nurse.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="activityType">Activity Type</Label>
                          <Select value={activityForm.activityType} onValueChange={(value: any) => setActivityForm({...activityForm, activityType: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="case-visit">Case Visit</SelectItem>
                              <SelectItem value="contact-tracing">Contact Tracing</SelectItem>
                              <SelectItem value="vaccination">Vaccination</SelectItem>
                              <SelectItem value="sample-collection">Sample Collection</SelectItem>
                              <SelectItem value="education">Education</SelectItem>
                              <SelectItem value="reporting">Reporting</SelectItem>
                              <SelectItem value="emergency-response">Emergency Response</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="activityDescription">Description</Label>
                        <Textarea
                          id="activityDescription"
                          value={activityForm.activityDescription}
                          onChange={(e) => setActivityForm({...activityForm, activityDescription: e.target.value})}
                          placeholder="Describe the activity performed"
                        />
                      </div>
                      <div>
                        <Label htmlFor="activityLocation">Location</Label>
                        <Input
                          id="activityLocation"
                          value={activityForm.location}
                          onChange={(e) => setActivityForm({...activityForm, location: e.target.value})}
                          placeholder="Location where activity was performed"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="activityStartTime">Start Time</Label>
                          <Input
                            id="activityStartTime"
                            type="time"
                            value={activityForm.startTime}
                            onChange={(e) => setActivityForm({...activityForm, startTime: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="activityEndTime">End Time</Label>
                          <Input
                            id="activityEndTime"
                            type="time"
                            value={activityForm.endTime}
                            onChange={(e) => setActivityForm({...activityForm, endTime: e.target.value})}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="activityOutcome">Outcome</Label>
                        <Select value={activityForm.outcome} onValueChange={(value: any) => setActivityForm({...activityForm, outcome: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="partial">Partial</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                            <SelectItem value="referred">Referred</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="activityNotes">Notes</Label>
                        <Textarea
                          id="activityNotes"
                          value={activityForm.notes}
                          onChange={(e) => setActivityForm({...activityForm, notes: e.target.value})}
                          placeholder="Additional notes or observations"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleSaveActivity}>
                          <Save className="h-4 w-4 mr-2" />
                          Log Activity
                        </Button>
                        <Button variant="outline" onClick={() => setShowActivityDialog(false)}>
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Nurse</TableHead>
                    <TableHead>Activity Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Outcome</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activities.slice(0, 10).map((activity) => (
                    <TableRow key={activity._id}>
                      <TableCell>{activity.activityDate}</TableCell>
                      <TableCell>{activity.nurseName}</TableCell>
                      <TableCell>
                        <Badge className={getAssignmentTypeBadge(activity.activityType)}>
                          {activity.activityType.replace('-', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>{activity.location}</TableCell>
                      <TableCell>{activity.duration} min</TableCell>
                      <TableCell>
                        <Badge className={activity.outcome === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                          {activity.outcome}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teams" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Outbreak Control Teams</span>
                  </CardTitle>
                  <CardDescription>
                    Manage outbreak control teams and their nurse assignments
                  </CardDescription>
                </div>
                <Dialog open={showTeamDialog} onOpenChange={setShowTeamDialog}>
                  <DialogTrigger asChild>
                    <Button onClick={resetTeamForm}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Team
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create Outbreak Control Team</DialogTitle>
                      <DialogDescription>
                        Set up a new outbreak control team with assigned nurses
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="teamName">Team Name</Label>
                          <Input
                            id="teamName"
                            value={teamForm.teamName}
                            onChange={(e) => setTeamForm({...teamForm, teamName: e.target.value})}
                            placeholder="COVID Response Team Alpha"
                          />
                        </div>
                        <div>
                          <Label htmlFor="teamCode">Team Code</Label>
                          <Input
                            id="teamCode"
                            value={teamForm.teamCode}
                            onChange={(e) => setTeamForm({...teamForm, teamCode: e.target.value})}
                            placeholder="CRT-001"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="teamOutbreakType">Outbreak Type</Label>
                          <Input
                            id="teamOutbreakType"
                            value={teamForm.outbreakType}
                            onChange={(e) => setTeamForm({...teamForm, outbreakType: e.target.value})}
                            placeholder="COVID-19, Influenza, etc."
                          />
                        </div>
                        <div>
                          <Label htmlFor="teamLeader">Team Leader</Label>
                          <Select value={teamForm.teamLeaderId} onValueChange={(value) => setTeamForm({...teamForm, teamLeaderId: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select team leader" />
                            </SelectTrigger>
                            <SelectContent>
                              {nurses.map((nurse) => (
                                <SelectItem key={nurse._id} value={nurse._id}>
                                  {nurse.name} - {nurse.specialization}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="teamCoverageAreas">Coverage Areas (comma separated)</Label>
                        <Input
                          id="teamCoverageAreas"
                          value={teamForm.coverageAreas}
                          onChange={(e) => setTeamForm({...teamForm, coverageAreas: e.target.value})}
                          placeholder="District A, District B, Central Hospital"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="targetPopulation">Target Population</Label>
                          <Input
                            id="targetPopulation"
                            type="number"
                            value={teamForm.targetPopulation}
                            onChange={(e) => setTeamForm({...teamForm, targetPopulation: e.target.value})}
                            placeholder="50000"
                          />
                        </div>
                        <div>
                          <Label htmlFor="estimatedCases">Estimated Cases</Label>
                          <Input
                            id="estimatedCases"
                            type="number"
                            value={teamForm.estimatedCases}
                            onChange={(e) => setTeamForm({...teamForm, estimatedCases: e.target.value})}
                            placeholder="100"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="teamEquipment">Equipment (comma separated)</Label>
                        <Textarea
                          id="teamEquipment"
                          value={teamForm.equipment}
                          onChange={(e) => setTeamForm({...teamForm, equipment: e.target.value})}
                          placeholder="PPE kits, testing supplies, vaccination equipment"
                        />
                      </div>
                      <div>
                        <Label>Assign Nurses</Label>
                        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded p-2">
                          {nurses.map((nurse) => (
                            <div key={nurse._id} className="flex items-center space-x-2">
                              <Checkbox
                                id={`nurse-${nurse._id}`}
                                checked={teamForm.selectedNurses.includes(nurse._id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setTeamForm({
                                      ...teamForm,
                                      selectedNurses: [...teamForm.selectedNurses, nurse._id]
                                    });
                                  } else {
                                    setTeamForm({
                                      ...teamForm,
                                      selectedNurses: teamForm.selectedNurses.filter(id => id !== nurse._id)
                                    });
                                  }
                                }}
                              />
                              <Label htmlFor={`nurse-${nurse._id}`} className="text-sm">
                                {nurse.name} - {nurse.specialization}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleSaveTeam}>
                          <Save className="h-4 w-4 mr-2" />
                          Create Team
                        </Button>
                        <Button variant="outline" onClick={() => setShowTeamDialog(false)}>
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {teams.map((team) => (
                  <Card key={team._id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{team.teamName}</h3>
                          <p className="text-sm text-gray-600">Code: {team.teamCode} | Type: {team.outbreakType}</p>
                        </div>
                        <Badge className={getStatusBadge(team.teamStatus)}>
                          {team.teamStatus}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Team Leader</h4>
                          <p className="text-sm">{team.teamLeaderName}</p>
                          <p className="text-xs text-gray-500">{team.teamLeaderRole}</p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Coverage Areas</h4>
                          <div className="flex flex-wrap gap-1">
                            {team.coverageAreas.map((area, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {area}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Performance</h4>
                          <div className="text-sm space-y-1">
                            <div>Cases: {team.totalCasesManaged}</div>
                            <div>Contacts: {team.totalContactsTraced}</div>
                            <div>Vaccinations: {team.totalVaccinationsGiven}</div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Assigned Nurses ({team.assignedNurses.length})</h4>
                        <div className="flex flex-wrap gap-2">
                          {team.assignedNurses.map((nurse, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {nurse.nurseName} ({nurse.role})
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 