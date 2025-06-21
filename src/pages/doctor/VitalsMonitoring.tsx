import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Heart, Thermometer, Droplets, Wind, Search, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";

const VitalsMonitoring: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("active");
  
  const patients = [
    {
      id: "P001",
      name: "James Wilson",
      room: "101",
      condition: "Hypertension",
      status: "Stable",
      lastUpdate: "2 min ago",
      vitals: {
        heartRate: { value: 88, unit: "BPM", status: "normal", trend: "stable" },
        bloodPressure: { systolic: 145, diastolic: 95, unit: "mmHg", status: "high", trend: "up" },
        temperature: { value: 98.4, unit: "°F", status: "normal", trend: "stable" },
        oxygenSat: { value: 98, unit: "%", status: "normal", trend: "stable" },
        respiratoryRate: { value: 16, unit: "/min", status: "normal", trend: "stable" }
      },
      alerts: ["Blood pressure elevated"]
    },
    {
      id: "P002",
      name: "Maria Garcia",
      room: "205",
      condition: "Type 2 Diabetes",
      status: "Monitoring",
      lastUpdate: "1 min ago",
      vitals: {
        heartRate: { value: 95, unit: "BPM", status: "normal", trend: "up" },
        bloodPressure: { systolic: 130, diastolic: 85, unit: "mmHg", status: "normal", trend: "stable" },
        temperature: { value: 98.6, unit: "°F", status: "normal", trend: "stable" },
        oxygenSat: { value: 95, unit: "%", status: "low", trend: "down" },
        respiratoryRate: { value: 18, unit: "/min", status: "normal", trend: "stable" }
      },
      alerts: ["Oxygen saturation dropping"]
    },
    {
      id: "P003",
      name: "Robert Chen",
      room: "302",
      condition: "Post-operative",
      status: "Critical",
      lastUpdate: "30 sec ago",
      vitals: {
        heartRate: { value: 120, unit: "BPM", status: "high", trend: "up" },
        bloodPressure: { systolic: 90, diastolic: 60, unit: "mmHg", status: "low", trend: "down" },
        temperature: { value: 99.8, unit: "°F", status: "high", trend: "up" },
        oxygenSat: { value: 92, unit: "%", status: "low", trend: "stable" },
        respiratoryRate: { value: 24, unit: "/min", status: "high", trend: "up" }
      },
      alerts: ["Tachycardia", "Hypotension", "Fever"]
    },
    {
      id: "P004",
      name: "Emma Johnson",
      room: "110",
      condition: "Prenatal care",
      status: "Stable",
      lastUpdate: "3 min ago",
      vitals: {
        heartRate: { value: 85, unit: "BPM", status: "normal", trend: "stable" },
        bloodPressure: { systolic: 118, diastolic: 75, unit: "mmHg", status: "normal", trend: "stable" },
        temperature: { value: 98.2, unit: "°F", status: "normal", trend: "stable" },
        oxygenSat: { value: 99, unit: "%", status: "normal", trend: "stable" },
        respiratoryRate: { value: 14, unit: "/min", status: "normal", trend: "stable" }
      },
      alerts: []
    },
    {
      id: "P005",
      name: "David Kim",
      room: "208",
      condition: "Asthma",
      status: "Monitoring",
      lastUpdate: "1 min ago",
      vitals: {
        heartRate: { value: 105, unit: "BPM", status: "high", trend: "stable" },
        bloodPressure: { systolic: 125, diastolic: 80, unit: "mmHg", status: "normal", trend: "stable" },
        temperature: { value: 98.8, unit: "°F", status: "normal", trend: "stable" },
        oxygenSat: { value: 94, unit: "%", status: "low", trend: "stable" },
        respiratoryRate: { value: 22, unit: "/min", status: "high", trend: "up" }
      },
      alerts: ["Oxygen saturation low", "Elevated respiratory rate"]
    }
  ];

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.condition.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "active") return matchesSearch && (patient.status === "Stable" || patient.status === "Monitoring");
    if (activeTab === "critical") return matchesSearch && patient.status === "Critical";
    if (activeTab === "alerts") return matchesSearch && patient.alerts.length > 0;
    if (activeTab === "all") return matchesSearch;
    
    return matchesSearch;
  });

  const getVitalStatus = (status: string) => {
    switch (status) {
      case "normal":
        return "text-green-600";
      case "high":
        return "text-red-600";
      case "low":
        return "text-orange-600";
      default:
        return "text-gray-600";
    }
  };

  const getVitalBadgeColor = (status: string) => {
    switch (status) {
      case "normal":
        return "bg-green-100 text-green-800";
      case "high":
        return "bg-red-100 text-red-800";
      case "low":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Stable":
        return "bg-green-100 text-green-800";
      case "Monitoring":
        return "bg-yellow-100 text-yellow-800";
      case "Critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3 w-3 text-red-500" />;
      case "down":
        return <TrendingDown className="h-3 w-3 text-blue-500" />;
      default:
        return <div className="h-3 w-3 bg-gray-400 rounded-full" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1e293b]">Vitals Monitoring</h1>
          <p className="text-gray-600">Real-time patient vital signs monitoring and alerts</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Activity className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          <Button className="bg-[#2563eb] hover:bg-[#1d4ed8]">
            <AlertTriangle className="mr-2 h-4 w-4" />
            View Alerts
          </Button>
        </div>
      </div>

      {/* Vitals Overview Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Patients Monitored</p>
                <h3 className="text-2xl font-bold text-[#1e293b]">{patients.length}</h3>
              </div>
              <div className="bg-[#3b82f6]/10 p-3 rounded-full">
                <Activity className="h-6 w-6 text-[#2563eb]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Critical Cases</p>
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
                <Heart className="h-6 w-6 text-orange-600" />
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
                <Activity className="h-6 w-6 text-green-600" />
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
                placeholder="Search by patient name, room, or condition..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patient Vitals Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="active">Active Monitoring</TabsTrigger>
          <TabsTrigger value="critical">Critical Cases</TabsTrigger>
          <TabsTrigger value="alerts">Patients with Alerts</TabsTrigger>
          <TabsTrigger value="all">All Patients</TabsTrigger>
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
                        <span>{patient.condition}</span>
                        <span>•</span>
                        <span>Updated {patient.lastUpdate}</span>
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(patient.status)}>
                        {patient.status}
                      </Badge>
                      {patient.alerts.length > 0 && (
                        <Badge className="bg-red-100 text-red-800">
                          {patient.alerts.length} Alert{patient.alerts.length > 1 ? 's' : ''}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Alerts */}
                  {patient.alerts.length > 0 && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <span className="text-sm font-medium text-red-800">Active Alerts</span>
                      </div>
                      <div className="space-y-1">
                        {patient.alerts.map((alert, index) => (
                          <div key={index} className="text-sm text-red-700">• {alert}</div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Vital Signs Grid */}
                  <div className="grid gap-4 md:grid-cols-5">
                    {/* Heart Rate */}
                    <div className="bg-white p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4 text-red-500" />
                          <span className="text-sm font-medium">Heart Rate</span>
                        </div>
                        {getTrendIcon(patient.vitals.heartRate.trend)}
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className={`text-xl font-bold ${getVitalStatus(patient.vitals.heartRate.status)}`}>
                          {patient.vitals.heartRate.value}
                        </span>
                        <span className="text-sm text-gray-500">{patient.vitals.heartRate.unit}</span>
                      </div>
                      <Badge className={`mt-2 ${getVitalBadgeColor(patient.vitals.heartRate.status)}`} size="sm">
                        {patient.vitals.heartRate.status}
                      </Badge>
                    </div>

                    {/* Blood Pressure */}
                    <div className="bg-white p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Droplets className="h-4 w-4 text-blue-500" />
                          <span className="text-sm font-medium">Blood Pressure</span>
                        </div>
                        {getTrendIcon(patient.vitals.bloodPressure.trend)}
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className={`text-xl font-bold ${getVitalStatus(patient.vitals.bloodPressure.status)}`}>
                          {patient.vitals.bloodPressure.systolic}/{patient.vitals.bloodPressure.diastolic}
                        </span>
                        <span className="text-sm text-gray-500">{patient.vitals.bloodPressure.unit}</span>
                      </div>
                      <Badge className={`mt-2 ${getVitalBadgeColor(patient.vitals.bloodPressure.status)}`} size="sm">
                        {patient.vitals.bloodPressure.status}
                      </Badge>
                    </div>

                    {/* Temperature */}
                    <div className="bg-white p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Thermometer className="h-4 w-4 text-orange-500" />
                          <span className="text-sm font-medium">Temperature</span>
                        </div>
                        {getTrendIcon(patient.vitals.temperature.trend)}
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className={`text-xl font-bold ${getVitalStatus(patient.vitals.temperature.status)}`}>
                          {patient.vitals.temperature.value}
                        </span>
                        <span className="text-sm text-gray-500">{patient.vitals.temperature.unit}</span>
                      </div>
                      <Badge className={`mt-2 ${getVitalBadgeColor(patient.vitals.temperature.status)}`} size="sm">
                        {patient.vitals.temperature.status}
                      </Badge>
                    </div>

                    {/* Oxygen Saturation */}
                    <div className="bg-white p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-green-500" />
                          <span className="text-sm font-medium">O2 Sat</span>
                        </div>
                        {getTrendIcon(patient.vitals.oxygenSat.trend)}
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className={`text-xl font-bold ${getVitalStatus(patient.vitals.oxygenSat.status)}`}>
                          {patient.vitals.oxygenSat.value}
                        </span>
                        <span className="text-sm text-gray-500">{patient.vitals.oxygenSat.unit}</span>
                      </div>
                      <Badge className={`mt-2 ${getVitalBadgeColor(patient.vitals.oxygenSat.status)}`} size="sm">
                        {patient.vitals.oxygenSat.status}
                      </Badge>
                    </div>

                    {/* Respiratory Rate */}
                    <div className="bg-white p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Wind className="h-4 w-4 text-purple-500" />
                          <span className="text-sm font-medium">Resp Rate</span>
                        </div>
                        {getTrendIcon(patient.vitals.respiratoryRate.trend)}
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className={`text-xl font-bold ${getVitalStatus(patient.vitals.respiratoryRate.status)}`}>
                          {patient.vitals.respiratoryRate.value}
                        </span>
                        <span className="text-sm text-gray-500">{patient.vitals.respiratoryRate.unit}</span>
                      </div>
                      <Badge className={`mt-2 ${getVitalBadgeColor(patient.vitals.respiratoryRate.status)}`} size="sm">
                        {patient.vitals.respiratoryRate.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t">
                    <Button variant="outline" size="sm">
                      View History
                    </Button>
                    <Button variant="outline" size="sm">
                      Set Alerts
                    </Button>
                    <Button variant="outline" size="sm">
                      Visit Patient
                    </Button>
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

export default VitalsMonitoring; 