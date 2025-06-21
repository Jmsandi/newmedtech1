import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  ClipboardCheck, 
  TestTube, 
  FileText, 
  FileBarChart, 
  MessageSquare,
  Search,
  Clock,
  RefreshCw,
  AlertTriangle,
  Shield,
  Activity,
  Users,
  FlaskConical
} from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { 
  Line, 
  LineChart, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { useToast } from "@/hooks/use-toast";
import { 
  getAllLabTests, 
  getAllLabRequests,
  getLabStatistics
} from "@/services/database/lab-tests";
import {
  getOutbreakAssignmentsByLabTech,
  getLabTechOutbreakActivitiesByDateRange,
  getSamplesByLabTech,
  getLabTechOutbreakStats,
  LabTechOutbreakAssignment,
  LabTechOutbreakActivity,
  LabTechOutbreakSample
} from "@/services/database/outbreak";
import { clearAndReinitializeDatabase } from "@/services/database";
import { LabTest, LabRequest } from "@/services/database/types";

const DashboardStatCard = ({ title, value, icon: Icon, color, isLoading = false }) => (
  <Card>
    <CardContent className="p-6 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <h3 className="text-2xl font-bold mt-1">
          {isLoading ? "..." : value}
        </h3>
      </div>
      <div className={`p-3 rounded-full bg-${color}-100`}>
        <Icon className={`h-5 w-5 text-${color}-600`} />
      </div>
    </CardContent>
  </Card>
);

const Dashboard: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedContact, setSelectedContact] = useState(1);
  const [labTests, setLabTests] = useState<LabTest[]>([]);
  const [labRequests, setLabRequests] = useState<LabRequest[]>([]);
  const [statistics, setStatistics] = useState<any>(null);
  const [outbreakAssignments, setOutbreakAssignments] = useState<LabTechOutbreakAssignment[]>([]);
  const [outbreakActivities, setOutbreakActivities] = useState<LabTechOutbreakActivity[]>([]);
  const [outbreakSamples, setOutbreakSamples] = useState<LabTechOutbreakSample[]>([]);
  const [outbreakStats, setOutbreakStats] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isReloading, setIsReloading] = useState(false);

  // Mock current user ID - in a real app, this would come from authentication
  const currentLabTechId = "labtech-1"; // This should be dynamic based on logged-in user

  // Load data on component mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [tests, requests, stats] = await Promise.all([
        getAllLabTests(),
        getAllLabRequests(),
        getLabStatistics()
      ]);
      
      setLabTests(tests);
      setLabRequests(requests);
      setStatistics(stats);

      // Load outbreak-related data for current lab tech
      try {
        const [assignments, activities, samples, outbreakStatsData] = await Promise.all([
          getOutbreakAssignmentsByLabTech(currentLabTechId),
          getLabTechOutbreakActivitiesByDateRange(
            currentLabTechId, 
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
            new Date().toISOString().split('T')[0] // today
          ),
          getSamplesByLabTech(currentLabTechId),
          getLabTechOutbreakStats(currentLabTechId)
        ]);

        setOutbreakAssignments(assignments);
        setOutbreakActivities(activities);
        setOutbreakSamples(samples);
        setOutbreakStats(outbreakStatsData);
      } catch (outbreakError) {
        console.log('No outbreak data available or error loading outbreak data:', outbreakError);
        // Set empty arrays if outbreak data is not available
        setOutbreakAssignments([]);
        setOutbreakActivities([]);
        setOutbreakSamples([]);
        setOutbreakStats({});
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReloadDemoData = async () => {
    setIsReloading(true);
    try {
      await clearAndReinitializeDatabase();
      await loadDashboardData();
      toast({
        title: "Demo Data Reloaded",
        description: "Fresh demo data has been loaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reload demo data",
        variant: "destructive",
      });
    } finally {
      setIsReloading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Collected":
        return "bg-blue-100 text-blue-800";
      case "Processing":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "STAT":
        return "bg-red-100 text-red-800";
      case "Urgent":
        return "bg-orange-100 text-orange-800";
      case "High":
        return "bg-yellow-100 text-yellow-800";
      case "Routine":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getOutbreakStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "suspended":
        return "bg-yellow-100 text-yellow-800";
      case "transferred":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get recent tests for display
  const recentTests = labTests
    .sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime())
    .slice(0, 10);

  // Get pending requests
  const pendingRequests = labRequests.filter(req => req.status === 'Pending').slice(0, 5);

  // Get active outbreak assignments
  const activeOutbreakAssignments = outbreakAssignments.filter(assignment => assignment.assignmentStatus === 'active');

  // Get recent outbreak activities
  const recentOutbreakActivities = outbreakActivities
    .sort((a, b) => new Date(b.activityDate).getTime() - new Date(a.activityDate).getTime())
    .slice(0, 10);

  // Get pending outbreak samples
  const pendingOutbreakSamples = outbreakSamples.filter(sample => 
    sample.currentStatus === 'received' || sample.currentStatus === 'processing'
  ).slice(0, 5);

  // Sample message contacts (keeping this as static for now)
  const messageContacts = [
    { id: 1, name: "Dr. John Smith", role: "Cardiologist", online: true },
    { id: 2, name: "Dr. Sarah Wilson", role: "Internal Medicine", online: true },
    { id: 3, name: "Dr. Michael Chen", role: "Emergency Medicine", online: false },
    { id: 4, name: "Lab Supervisor", role: "Lab Manager", online: true },
    { id: 5, name: "Outbreak Coordinator", role: "Public Health", online: true },
  ];

  return (
    <div className="space-y-6">
      {/* Header with reload button */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Lab Technician Dashboard</h1>
          <p className="text-gray-600">
            Monitor regular lab operations and outbreak response activities
          </p>
        </div>
        <Button 
          onClick={handleReloadDemoData} 
          disabled={isReloading}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isReloading ? 'animate-spin' : ''}`} />
          {isReloading ? "Reloading..." : "Reload Demo Data"}
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <DashboardStatCard 
          title="Total Tests" 
          value={statistics?.totalTests || 0}
          icon={TestTube} 
          color="indigo"
          isLoading={isLoading}
        />
        <DashboardStatCard 
          title="Pending Tests" 
          value={statistics?.pendingTests || 0}
          icon={Clock} 
          color="amber"
          isLoading={isLoading}
        />
        <DashboardStatCard 
          title="Completed Tests" 
          value={statistics?.completedTests || 0}
          icon={ClipboardCheck} 
          color="green"
          isLoading={isLoading}
        />
        <DashboardStatCard 
          title="Critical Results" 
          value={statistics?.criticalResults || 0}
          icon={AlertTriangle} 
          color="red"
          isLoading={isLoading}
        />
        <DashboardStatCard 
          title="Outbreak Assignments" 
          value={activeOutbreakAssignments.length}
          icon={Shield} 
          color="purple"
          isLoading={isLoading}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 lg:w-[600px]">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="test-history" className="flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            <span className="hidden sm:inline">Recent Tests</span>
          </TabsTrigger>
          <TabsTrigger value="requests" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Pending Requests</span>
          </TabsTrigger>
          <TabsTrigger value="outbreak" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Outbreak</span>
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Messages</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <TestTube className="h-4 w-4 mr-2" />
                  Enter Test Results
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Search className="h-4 w-4 mr-2" />
                  Search Sample ID
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  View Test Requests
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <ClipboardCheck className="h-4 w-4 mr-2" />
                  Quality Control
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Today's Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Tests Completed</span>
                    <span className="font-medium">{statistics?.completedTests || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Tests Pending</span>
                    <span className="font-medium">{statistics?.pendingTests || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Critical Results</span>
                    <span className="font-medium text-red-600">{statistics?.criticalResults || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Abnormal Results</span>
                    <span className="font-medium text-orange-600">{statistics?.abnormalResults || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Need Review</span>
                    <span className="font-medium text-blue-600">{statistics?.testsRequiringReview || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Outbreak Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Active Assignments</span>
                    <span className="font-medium">{activeOutbreakAssignments.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Samples Processed</span>
                    <span className="font-medium">{outbreakStats.totalSamplesProcessed || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Tests Completed</span>
                    <span className="font-medium">{outbreakStats.totalTestsCompleted || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Critical Results</span>
                    <span className="font-medium text-red-600">{outbreakStats.totalCriticalResults || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Pending Samples</span>
                    <span className="font-medium text-blue-600">{pendingOutbreakSamples.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Test History Tab */}
        <TabsContent value="test-history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sample ID</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Test Type</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTests.map((test) => (
                      <TableRow key={test._id}>
                        <TableCell className="font-medium">
                          {test.sampleId || "N/A"}
                        </TableCell>
                        <TableCell>{test.patientName}</TableCell>
                        <TableCell>{test.testType}</TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(test.priority)}>
                            {test.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(test.status)}>
                            {test.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(test.requestDate)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pending Requests Tab */}
        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Lab Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Requested Tests</TableHead>
                      <TableHead>Requested By</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Request Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingRequests.map((request) => (
                      <TableRow key={request._id}>
                        <TableCell className="font-medium">
                          {request.patientName}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {request.requestedTests.slice(0, 2).map((test, index) => (
                              <div key={index} className="text-sm">
                                {test.testType}
                              </div>
                            ))}
                            {request.requestedTests.length > 2 && (
                              <div className="text-sm text-gray-500">
                                +{request.requestedTests.length - 2} more
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{request.requestedBy}</TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(
                            request.requestedTests.reduce((highest, test) => {
                              const priorities = ['Routine', 'High', 'Urgent', 'STAT'];
                              return priorities.indexOf(test.priority) > priorities.indexOf(highest) 
                                ? test.priority : highest;
                            }, 'Routine')
                          )}>
                            {request.requestedTests.reduce((highest, test) => {
                              const priorities = ['Routine', 'High', 'Urgent', 'STAT'];
                              return priorities.indexOf(test.priority) > priorities.indexOf(highest) 
                                ? test.priority : highest;
                            }, 'Routine')}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(request.requestDate)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Outbreak Tab */}
        <TabsContent value="outbreak" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>My Outbreak Assignments</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {activeOutbreakAssignments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No active outbreak assignments
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeOutbreakAssignments.map((assignment) => (
                      <div key={assignment._id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{assignment.outbreakType}</h4>
                            <p className="text-sm text-gray-600">{assignment.assignmentType.replace('-', ' ')}</p>
                            <p className="text-sm text-gray-500">Daily Capacity: {assignment.dailyTestingCapacity}</p>
                          </div>
                          <Badge className={
                            assignment.priority === 'critical' ? 'bg-red-100 text-red-800' :
                            assignment.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                            assignment.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }>
                            {assignment.priority}
                          </Badge>
                        </div>
                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                          <span>Samples: {assignment.samplesProcessed}</span>
                          <span>Tests: {assignment.testsCompleted}</span>
                          <span>Positive: {assignment.positiveResults}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FlaskConical className="h-5 w-5" />
                  <span>Pending Outbreak Samples</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pendingOutbreakSamples.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No pending outbreak samples
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingOutbreakSamples.map((sample) => (
                      <div key={sample._id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{sample.sampleId}</h4>
                            <p className="text-sm text-gray-600">{sample.sampleType}</p>
                            <p className="text-sm text-gray-500">
                              Received: {formatDate(sample.receivedDate)}
                            </p>
                          </div>
                          <Badge className={getStatusColor(sample.currentStatus)}>
                            {sample.currentStatus}
                          </Badge>
                        </div>
                        <div className="mt-2">
                          {sample.requestedTests.map((test, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{test.testType}</span>
                              <Badge variant="outline" className={
                                test.priority === 'critical' || test.priority === 'stat' ? 'text-red-600' :
                                test.priority === 'urgent' ? 'text-orange-600' : 'text-gray-600'
                              }>
                                {test.priority}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Recent Outbreak Activities</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentOutbreakActivities.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No recent outbreak activities
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Activity Type</TableHead>
                        <TableHead>Samples</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Outcome</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentOutbreakActivities.map((activity) => (
                        <TableRow key={activity._id}>
                          <TableCell>{formatDate(activity.activityDate)}</TableCell>
                          <TableCell>{activity.activityType.replace('-', ' ')}</TableCell>
                          <TableCell>{activity.samplesProcessed}</TableCell>
                          <TableCell>{activity.duration} min</TableCell>
                          <TableCell>
                            <Badge className={getOutbreakStatusColor(activity.outcome)}>
                              {activity.outcome}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Messages Tab */}
        <TabsContent value="messages" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Contacts</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {messageContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className={`p-3 cursor-pointer hover:bg-gray-50 ${
                        selectedContact === contact.id ? "bg-blue-50 border-r-2 border-blue-500" : ""
                      }`}
                      onClick={() => setSelectedContact(contact.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${contact.online ? "bg-green-500" : "bg-gray-300"}`} />
                        <div>
                          <p className="font-medium text-sm">{contact.name}</p>
                          <p className="text-xs text-gray-500">{contact.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>
                  {messageContacts.find(c => c.id === selectedContact)?.name || "Select a contact"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-64 border rounded-lg p-4 bg-gray-50">
                  <p className="text-gray-500 text-center mt-20">
                    Message history will appear here
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Input placeholder="Type your message..." className="flex-1" />
                  <Button>Send</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
