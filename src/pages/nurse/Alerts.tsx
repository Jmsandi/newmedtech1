import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Bell, CheckCircle, Clock, X, Eye, Heart, Thermometer, Activity, Phone, MessageSquare, Search } from "lucide-react";

const Alerts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("active");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const alerts = [
    {
      id: "A001",
      patientName: "James Wilson",
      patientId: "P001",
      room: "101",
      type: "Vital Signs",
      priority: "High",
      message: "Blood pressure elevated: 180/95 mmHg",
      timestamp: "2024-01-15 15:30",
      status: "Active",
      category: "Cardiovascular",
      duration: "15 minutes",
      acknowledgedBy: null,
      source: "Monitoring System",
      icon: Heart,
      actionRequired: true
    },
    {
      id: "A002",
      patientName: "Maria Garcia",
      patientId: "P002",
      room: "205",
      type: "Lab Critical",
      priority: "Critical",
      message: "CRITICAL: Blood glucose 285 mg/dL - Immediate attention required",
      timestamp: "2024-01-15 10:15",
      status: "Active",
      category: "Laboratory",
      duration: "5 hours",
      acknowledgedBy: null,
      source: "Lab System",
      icon: AlertTriangle,
      actionRequired: true
    },
    {
      id: "A003",
      patientName: "Robert Chen",
      patientId: "P003",
      room: "302",
      type: "Medication",
      priority: "Medium",
      message: "Pain medication due in 15 minutes",
      timestamp: "2024-01-15 15:45",
      status: "Active",
      category: "Medication",
      duration: "Just now",
      acknowledgedBy: null,
      source: "MAR System",
      icon: Clock,
      actionRequired: false
    },
    {
      id: "A004",
      patientName: "Sarah Thompson",
      patientId: "P004",
      room: "108",
      type: "Temperature",
      priority: "High",
      message: "Fever spike: Temperature 102.8°F",
      timestamp: "2024-01-15 14:20",
      status: "Acknowledged",
      category: "Vital Signs",
      duration: "1 hour 10 minutes",
      acknowledgedBy: "Nurse Jennifer",
      acknowledgedAt: "2024-01-15 14:25",
      source: "Temperature Monitor",
      icon: Thermometer,
      actionRequired: true
    },
    {
      id: "A005",
      patientName: "David Brown",
      patientId: "P005",
      room: "210",
      type: "Fall Risk",
      priority: "Medium",
      message: "Patient attempting to get out of bed without assistance",
      timestamp: "2024-01-15 13:45",
      status: "Resolved",
      category: "Safety",
      duration: "2 hours",
      acknowledgedBy: "Nurse Amy",
      resolvedBy: "Nurse Amy",
      resolvedAt: "2024-01-15 14:00",
      source: "Bed Alarm",
      icon: Activity,
      actionRequired: false
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "High":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-red-100 text-red-800";
      case "Acknowledged":
        return "bg-yellow-100 text-yellow-800";
      case "Resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Cardiovascular":
        return "bg-red-50 text-red-700";
      case "Laboratory":
        return "bg-purple-50 text-purple-700";
      case "Medication":
        return "bg-blue-50 text-blue-700";
      case "Vital Signs":
        return "bg-orange-50 text-orange-700";
      case "Safety":
        return "bg-yellow-50 text-yellow-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  const getAlertIcon = (icon: any, priority: string) => {
    const IconComponent = icon;
    const iconClass = priority === "Critical" ? "h-5 w-5 text-red-600" : 
                     priority === "High" ? "h-5 w-5 text-orange-600" :
                     "h-5 w-5 text-yellow-600";
    return <IconComponent className={iconClass} />;
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.patientId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPriority = priorityFilter === "all" || alert.priority.toLowerCase() === priorityFilter;
    
    let matchesTab = true;
    if (activeTab === "active") matchesTab = alert.status === "Active";
    if (activeTab === "acknowledged") matchesTab = alert.status === "Acknowledged";
    if (activeTab === "resolved") matchesTab = alert.status === "Resolved";
    if (activeTab === "critical") matchesTab = alert.priority === "Critical";
    
    return matchesSearch && matchesPriority && matchesTab;
  });

  const handleAcknowledge = (alertId: string) => {
    console.log("Acknowledging alert:", alertId);
  };

  const handleResolve = (alertId: string) => {
    console.log("Resolving alert:", alertId);
  };

  const handleViewPatient = (patientId: string) => {
    console.log("Viewing patient:", patientId);
  };

  const handleContactPhysician = (alert: any) => {
    console.log("Contacting physician about:", alert.id);
  };

  const getDurationColor = (duration: string, priority: string) => {
    if (priority === "Critical") return "text-red-600 font-bold";
    if (duration.includes("hour")) return "text-orange-600";
    return "text-gray-600";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1e293b]">Patient Alerts</h1>
          <p className="text-gray-600">Monitor and manage patient alerts and notifications</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Bell className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button className="bg-[#3498db] hover:bg-[#2980b9]">
            <CheckCircle className="mr-2 h-4 w-4" />
            Acknowledge All
          </Button>
        </div>
      </div>

      {/* Alert Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Alerts</p>
                <h3 className="text-2xl font-bold text-red-600">
                  {alerts.filter(a => a.status === "Active").length}
                </h3>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Critical Alerts</p>
                <h3 className="text-2xl font-bold text-red-600">
                  {alerts.filter(a => a.priority === "Critical").length}
                </h3>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Acknowledged</p>
                <h3 className="text-2xl font-bold text-yellow-600">
                  {alerts.filter(a => a.status === "Acknowledged").length}
                </h3>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Eye className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Resolved Today</p>
                <h3 className="text-2xl font-bold text-green-600">
                  {alerts.filter(a => a.status === "Resolved").length}
                </h3>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by patient name, alert type, or message..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Alert Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="active">Active Alerts</TabsTrigger>
          <TabsTrigger value="acknowledged">Acknowledged</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
          <TabsTrigger value="critical">Critical Only</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <Card 
                key={alert.id} 
                className={`${alert.priority === "Critical" ? "border-red-300 bg-red-50/50" : 
                           alert.priority === "High" ? "border-orange-200 bg-orange-50/30" : ""}`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {getAlertIcon(alert.icon, alert.priority)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <CardTitle className="text-lg">{alert.type} Alert</CardTitle>
                          {alert.actionRequired && (
                            <Badge variant="outline" className="text-red-600 border-red-300">
                              Action Required
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="flex items-center gap-4">
                          <span>{alert.patientName}</span>
                          <span>•</span>
                          <span>Room {alert.room}</span>
                          <span>•</span>
                          <span>ID: {alert.patientId}</span>
                          <span>•</span>
                          <span className={getDurationColor(alert.duration, alert.priority)}>
                            {alert.duration} ago
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(alert.priority)}>
                        {alert.priority}
                      </Badge>
                      <Badge className={getStatusColor(alert.status)}>
                        {alert.status}
                      </Badge>
                      <Badge className={getCategoryColor(alert.category)}>
                        {alert.category}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Alert Message */}
                  <div className="mb-4">
                    <div className={`p-4 rounded-lg ${alert.priority === "Critical" ? "bg-red-100 border border-red-200" : 
                                                    alert.priority === "High" ? "bg-orange-100 border border-orange-200" :
                                                    "bg-gray-50 border border-gray-200"}`}>
                      <p className={`font-medium ${alert.priority === "Critical" ? "text-red-800" : 
                                                  alert.priority === "High" ? "text-orange-800" : 
                                                  "text-gray-800"}`}>
                        {alert.message}
                      </p>
                    </div>
                  </div>

                  {/* Alert Details */}
                  <div className="grid gap-4 md:grid-cols-2 text-sm text-gray-600 mb-4">
                    <div>
                      <p><strong>Triggered:</strong> {new Date(alert.timestamp).toLocaleString()}</p>
                      <p><strong>Source:</strong> {alert.source}</p>
                      {alert.acknowledgedBy && (
                        <p><strong>Acknowledged by:</strong> {alert.acknowledgedBy}</p>
                      )}
                    </div>
                    <div>
                      <p><strong>Duration:</strong> {alert.duration}</p>
                      {alert.acknowledgedAt && (
                        <p><strong>Acknowledged at:</strong> {new Date(alert.acknowledgedAt).toLocaleString()}</p>
                      )}
                      {alert.resolvedBy && (
                        <p><strong>Resolved by:</strong> {alert.resolvedBy}</p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-2 pt-4 border-t">
                    <Button variant="outline" size="sm" onClick={() => handleViewPatient(alert.patientId)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View Patient
                    </Button>
                    
                    {(alert.priority === "Critical" || alert.priority === "High") && alert.status === "Active" && (
                      <Button variant="outline" size="sm" onClick={() => handleContactPhysician(alert)}>
                        <Phone className="h-4 w-4 mr-1" />
                        Call Physician
                      </Button>
                    )}

                    {alert.status === "Active" && (
                      <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700" onClick={() => handleAcknowledge(alert.id)}>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Acknowledge
                      </Button>
                    )}

                    {alert.status === "Acknowledged" && (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleResolve(alert.id)}>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Resolve
                      </Button>
                    )}

                    {alert.status === "Active" && alert.priority !== "Critical" && (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleResolve(alert.id)}>
                        <X className="h-4 w-4 mr-1" />
                        Dismiss
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredAlerts.length === 0 && (
              <Card>
                <CardContent className="text-center py-10">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No alerts found</h3>
                  <p className="text-gray-600">No alerts match the current search and filter criteria.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Actions Sidebar */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common alert management actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <Bell className="mr-2 h-4 w-4" />
            Configure Alert Preferences
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <MessageSquare className="mr-2 h-4 w-4" />
            Send Alert Summary
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <CheckCircle className="mr-2 h-4 w-4" />
            Bulk Acknowledge
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Phone className="mr-2 h-4 w-4" />
            Emergency Contacts
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Alerts; 