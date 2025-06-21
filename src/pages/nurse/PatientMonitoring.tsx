import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Heart, Thermometer, Droplets, Wind, Search, AlertTriangle, TrendingUp, TrendingDown, Minus } from "lucide-react";

const PatientMonitoring: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  const patients = [
    {
      id: "P001",
      name: "James Wilson",
      room: "101",
      age: 65,
      condition: "Hypertension",
      status: "Stable",
      priority: "Medium",
      vitals: {
        heartRate: { value: 78, unit: "bpm", status: "Normal", trend: "stable", lastUpdated: "10:30 AM" },
        bloodPressure: { value: "145/92", unit: "mmHg", status: "High", trend: "up", lastUpdated: "10:30 AM" },
        temperature: { value: 98.6, unit: "°F", status: "Normal", trend: "stable", lastUpdated: "10:15 AM" },
        oxygen: { value: 98, unit: "%", status: "Normal", trend: "stable", lastUpdated: "10:30 AM" },
        respiratory: { value: 16, unit: "rpm", status: "Normal", trend: "stable", lastUpdated: "10:30 AM" }
      },
      alerts: ["Blood pressure elevated"],
      lastAssessment: "09:00 AM"
    },
    {
      id: "P002",
      name: "Maria Garcia",
      room: "205",
      age: 42,
      condition: "Type 2 Diabetes",
      status: "Critical",
      priority: "High",
      vitals: {
        heartRate: { value: 110, unit: "bpm", status: "High", trend: "up", lastUpdated: "10:25 AM" },
        bloodPressure: { value: "160/95", unit: "mmHg", status: "High", trend: "up", lastUpdated: "10:25 AM" },
        temperature: { value: 101.2, unit: "°F", status: "High", trend: "up", lastUpdated: "10:20 AM" },
        oxygen: { value: 94, unit: "%", status: "Low", trend: "down", lastUpdated: "10:25 AM" },
        respiratory: { value: 22, unit: "rpm", status: "High", trend: "up", lastUpdated: "10:25 AM" }
      },
      alerts: ["Fever", "Tachycardia", "Low oxygen saturation"],
      lastAssessment: "10:00 AM"
    },
    {
      id: "P003",
      name: "Robert Chen",
      room: "302",
      age: 28,
      condition: "Post-operative",
      status: "Stable",
      priority: "Medium",
      vitals: {
        heartRate: { value: 85, unit: "bpm", status: "Normal", trend: "stable", lastUpdated: "10:20 AM" },
        bloodPressure: { value: "120/80", unit: "mmHg", status: "Normal", trend: "stable", lastUpdated: "10:20 AM" },
        temperature: { value: 99.1, unit: "°F", status: "Normal", trend: "down", lastUpdated: "10:10 AM" },
        oxygen: { value: 99, unit: "%", status: "Normal", trend: "stable", lastUpdated: "10:20 AM" },
        respiratory: { value: 14, unit: "rpm", status: "Normal", trend: "stable", lastUpdated: "10:20 AM" }
      },
      alerts: [],
      lastAssessment: "08:30 AM"
    }
  ];

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.condition.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "critical") return matchesSearch && patient.status === "Critical";
    if (activeTab === "alerts") return matchesSearch && patient.alerts.length > 0;
    if (activeTab === "stable") return matchesSearch && patient.status === "Stable";
    if (activeTab === "all") return matchesSearch;
    
    return matchesSearch;
  });

  const getVitalStatus = (status: string) => {
    switch (status) {
      case "Normal":
        return "text-green-600";
      case "High":
        return "text-red-600";
      case "Low":
        return "text-orange-600";
      default:
        return "text-gray-600";
    }
  };

  const getVitalBackground = (status: string) => {
    switch (status) {
      case "Normal":
        return "bg-green-50 border-green-200";
      case "High":
        return "bg-red-50 border-red-200";
      case "Low":
        return "bg-orange-50 border-orange-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3 w-3 text-red-500" />;
      case "down":
        return <TrendingDown className="h-3 w-3 text-blue-500" />;
      case "stable":
        return <Minus className="h-3 w-3 text-gray-500" />;
      default:
        return <Minus className="h-3 w-3 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Critical":
        return "bg-red-100 text-red-800";
      case "Stable":
        return "bg-green-100 text-green-800";
      case "Monitoring":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1e293b]">Patient Monitoring</h1>
          <p className="text-gray-600">Monitor patient vital signs and status</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Activity className="mr-2 h-4 w-4" />
            Vital Signs Chart
          </Button>
          <Button className="bg-[#3498db] hover:bg-[#2980b9]">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Emergency Alert
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Patients</p>
                <h3 className="text-2xl font-bold text-[#3498db]">{patients.length}</h3>
              </div>
              <div className="bg-[#3498db]/10 p-3 rounded-full">
                <Activity className="h-6 w-6 text-[#3498db]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Critical Status</p>
                <h3 className="text-2xl font-bold text-red-600">
                  {patients.filter(p => p.status === "Critical").length}
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
                <p className="text-sm font-medium text-gray-500">Active Alerts</p>
                <h3 className="text-2xl font-bold text-orange-600">
                  {patients.reduce((total, p) => total + p.alerts.length, 0)}
                </h3>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Stable Patients</p>
                <h3 className="text-2xl font-bold text-green-600">
                  {patients.filter(p => p.status === "Stable").length}
                </h3>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Heart className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by patient name, room, or condition..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patient Monitoring Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Patients</TabsTrigger>
          <TabsTrigger value="critical">Critical</TabsTrigger>
          <TabsTrigger value="alerts">With Alerts</TabsTrigger>
          <TabsTrigger value="stable">Stable</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="space-y-4">
            {filteredPatients.map((patient) => (
              <Card key={patient.id} className={`${patient.status === "Critical" ? "border-red-200 bg-red-50/30" : ""}`}>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{patient.name}</CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-1">
                        <span>Room {patient.room}</span>
                        <span>•</span>
                        <span>Age {patient.age}</span>
                        <span>•</span>
                        <span>{patient.condition}</span>
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(patient.priority)}>
                        {patient.priority} Priority
                      </Badge>
                      <Badge className={getStatusColor(patient.status)}>
                        {patient.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Alerts */}
                  {patient.alerts.length > 0 && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        <h4 className="font-medium text-red-800">Active Alerts</h4>
                      </div>
                      <div className="space-y-1">
                        {patient.alerts.map((alert, index) => (
                          <div key={index} className="text-sm text-red-700">• {alert}</div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Vital Signs */}
                  <div className="grid gap-4 md:grid-cols-5">
                    <Card className={`p-4 ${getVitalBackground(patient.vitals.heartRate.status)}`}>
                      <div className="flex items-center justify-between mb-2">
                        <Heart className={`h-5 w-5 ${getVitalStatus(patient.vitals.heartRate.status)}`} />
                        {getTrendIcon(patient.vitals.heartRate.trend)}
                      </div>
                      <div className={`text-2xl font-bold ${getVitalStatus(patient.vitals.heartRate.status)}`}>
                        {patient.vitals.heartRate.value}
                      </div>
                      <div className="text-xs text-gray-600">
                        {patient.vitals.heartRate.unit}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {patient.vitals.heartRate.lastUpdated}
                      </div>
                    </Card>

                    <Card className={`p-4 ${getVitalBackground(patient.vitals.bloodPressure.status)}`}>
                      <div className="flex items-center justify-between mb-2">
                        <Activity className={`h-5 w-5 ${getVitalStatus(patient.vitals.bloodPressure.status)}`} />
                        {getTrendIcon(patient.vitals.bloodPressure.trend)}
                      </div>
                      <div className={`text-lg font-bold ${getVitalStatus(patient.vitals.bloodPressure.status)}`}>
                        {patient.vitals.bloodPressure.value}
                      </div>
                      <div className="text-xs text-gray-600">
                        {patient.vitals.bloodPressure.unit}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {patient.vitals.bloodPressure.lastUpdated}
                      </div>
                    </Card>

                    <Card className={`p-4 ${getVitalBackground(patient.vitals.temperature.status)}`}>
                      <div className="flex items-center justify-between mb-2">
                        <Thermometer className={`h-5 w-5 ${getVitalStatus(patient.vitals.temperature.status)}`} />
                        {getTrendIcon(patient.vitals.temperature.trend)}
                      </div>
                      <div className={`text-2xl font-bold ${getVitalStatus(patient.vitals.temperature.status)}`}>
                        {patient.vitals.temperature.value}
                      </div>
                      <div className="text-xs text-gray-600">
                        {patient.vitals.temperature.unit}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {patient.vitals.temperature.lastUpdated}
                      </div>
                    </Card>

                    <Card className={`p-4 ${getVitalBackground(patient.vitals.oxygen.status)}`}>
                      <div className="flex items-center justify-between mb-2">
                        <Droplets className={`h-5 w-5 ${getVitalStatus(patient.vitals.oxygen.status)}`} />
                        {getTrendIcon(patient.vitals.oxygen.trend)}
                      </div>
                      <div className={`text-2xl font-bold ${getVitalStatus(patient.vitals.oxygen.status)}`}>
                        {patient.vitals.oxygen.value}
                      </div>
                      <div className="text-xs text-gray-600">
                        {patient.vitals.oxygen.unit}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {patient.vitals.oxygen.lastUpdated}
                      </div>
                    </Card>

                    <Card className={`p-4 ${getVitalBackground(patient.vitals.respiratory.status)}`}>
                      <div className="flex items-center justify-between mb-2">
                        <Wind className={`h-5 w-5 ${getVitalStatus(patient.vitals.respiratory.status)}`} />
                        {getTrendIcon(patient.vitals.respiratory.trend)}
                      </div>
                      <div className={`text-2xl font-bold ${getVitalStatus(patient.vitals.respiratory.status)}`}>
                        {patient.vitals.respiratory.value}
                      </div>
                      <div className="text-xs text-gray-600">
                        {patient.vitals.respiratory.unit}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {patient.vitals.respiratory.lastUpdated}
                      </div>
                    </Card>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between mt-6 pt-4 border-t">
                    <div className="text-sm text-gray-600">
                      <span><strong>Last Assessment:</strong> {patient.lastAssessment}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        View Chart
                      </Button>
                      <Button variant="outline" size="sm">
                        Add Vitals
                      </Button>
                      <Button variant="outline" size="sm">
                        Assessment
                      </Button>
                      {patient.status === "Critical" && (
                        <Button size="sm" className="bg-red-600 hover:bg-red-700">
                          Emergency Response
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredPatients.length === 0 && (
              <Card>
                <CardContent className="text-center py-10">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
                  <p className="text-gray-600">No patients match the current search and filter criteria.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientMonitoring; 