import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Clock, Phone, MapPin, User, Activity, Heart, Thermometer } from "lucide-react";

const EmergencyCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState("active");
  
  const emergencies = [
    {
      id: "E001",
      patientName: "Robert Chen",
      patientId: "P003",
      severity: "Critical",
      condition: "Cardiac Arrest",
      location: "Room 302",
      timeReported: "11:30 AM",
      reportedBy: "Nurse Jennifer",
      status: "In Progress",
      vitals: {
        heartRate: "0 BPM",
        bloodPressure: "0/0",
        temperature: "97.8°F",
        oxygenSat: "85%"
      },
      notes: "Patient collapsed during routine checkup. CPR initiated immediately."
    },
    {
      id: "E002", 
      patientName: "David Kim",
      patientId: "P005",
      severity: "High",
      condition: "Severe Asthma Attack",
      location: "Emergency Ward",
      timeReported: "10:45 AM",
      reportedBy: "Dr. Emergency Team",
      status: "Stabilizing",
      vitals: {
        heartRate: "120 BPM",
        bloodPressure: "140/90",
        temperature: "99.1°F",
        oxygenSat: "88%"
      },
      notes: "Patient presented with severe breathing difficulties. Administered bronchodilators."
    },
    {
      id: "E003",
      patientName: "Maria Garcia",
      patientId: "P002",
      severity: "Medium",
      condition: "Diabetic Emergency",
      location: "Room 205",
      timeReported: "9:20 AM",
      reportedBy: "Nurse Amy",
      status: "Stable",
      vitals: {
        heartRate: "95 BPM",
        bloodPressure: "130/85",
        temperature: "98.6°F",
        oxygenSat: "95%"
      },
      notes: "Blood glucose level critically low. IV glucose administered."
    },
    {
      id: "E004",
      patientName: "James Wilson",
      patientId: "P001",
      severity: "Low",
      condition: "Hypertensive Crisis",
      location: "Room 101",
      timeReported: "8:30 AM",
      reportedBy: "Dr. Sarah Johnson",
      status: "Resolved",
      vitals: {
        heartRate: "88 BPM",
        bloodPressure: "145/95",
        temperature: "98.4°F",
        oxygenSat: "98%"
      },
      notes: "Blood pressure spike controlled with medication adjustment."
    }
  ];

  const filteredEmergencies = emergencies.filter(emergency => {
    if (activeTab === "active") return emergency.status === "In Progress" || emergency.status === "Stabilizing";
    if (activeTab === "critical") return emergency.severity === "Critical";
    if (activeTab === "resolved") return emergency.status === "Resolved" || emergency.status === "Stable";
    if (activeTab === "all") return true;
    return true;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-500 text-white animate-pulse";
      case "High":
        return "bg-orange-500 text-white";
      case "Medium":
        return "bg-yellow-500 text-white";
      case "Low":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "bg-red-100 text-red-800";
      case "Stabilizing":
        return "bg-yellow-100 text-yellow-800";
      case "Stable":
        return "bg-green-100 text-green-800";
      case "Resolved":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getVitalsStatus = (vital: string, value: string) => {
    // Simple logic to determine if vitals are concerning
    if (vital === "heartRate") {
      const rate = parseInt(value);
      if (rate === 0 || rate > 120 || rate < 60) return "text-red-600";
      return "text-green-600";
    }
    if (vital === "oxygenSat") {
      const sat = parseInt(value);
      if (sat < 90) return "text-red-600";
      if (sat < 95) return "text-yellow-600";
      return "text-green-600";
    }
    return "text-gray-600";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1e293b] flex items-center">
            <AlertTriangle className="mr-2 h-6 w-6 text-red-500" />
            Emergency Center
          </h1>
          <p className="text-gray-600">Monitor and manage emergency cases and urgent situations</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="text-red-600 border-red-600">
            <Phone className="mr-2 h-4 w-4" />
            Emergency Services
          </Button>
          <Button className="bg-red-600 hover:bg-red-700">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Report Emergency
          </Button>
        </div>
      </div>

      {/* Emergency Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Emergencies</p>
                <h3 className="text-2xl font-bold text-red-600">
                  {emergencies.filter(e => e.status === "In Progress" || e.status === "Stabilizing").length}
                </h3>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Critical Cases</p>
                <h3 className="text-2xl font-bold text-orange-600">
                  {emergencies.filter(e => e.severity === "Critical").length}
                </h3>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Heart className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Response Time Avg</p>
                <h3 className="text-2xl font-bold text-yellow-600">3.2 min</h3>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Resolved Today</p>
                <h3 className="text-2xl font-bold text-green-600">
                  {emergencies.filter(e => e.status === "Resolved").length}
                </h3>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Emergency Cases Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="active" className="text-red-600">
            Active Emergencies
          </TabsTrigger>
          <TabsTrigger value="critical">Critical Cases</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
          <TabsTrigger value="all">All Cases</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="space-y-4">
            {filteredEmergencies.map((emergency) => (
              <Card key={emergency.id} className="border-l-4 border-l-red-500">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="bg-red-100 p-3 rounded-full">
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {emergency.condition}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-4 mt-1">
                          <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {emergency.patientName} (ID: {emergency.patientId})
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {emergency.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {emergency.timeReported}
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getSeverityColor(emergency.severity)}>
                        {emergency.severity}
                      </Badge>
                      <Badge className={getStatusColor(emergency.status)}>
                        {emergency.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    {/* Vitals */}
                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <Activity className="h-4 w-4 mr-1" />
                        Current Vitals
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Heart Rate:</span>
                          <span className={getVitalsStatus("heartRate", emergency.vitals.heartRate)}>
                            {emergency.vitals.heartRate}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Blood Pressure:</span>
                          <span className="text-gray-600">{emergency.vitals.bloodPressure}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Temperature:</span>
                          <span className="text-gray-600">{emergency.vitals.temperature}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Oxygen Sat:</span>
                          <span className={getVitalsStatus("oxygenSat", emergency.vitals.oxygenSat)}>
                            {emergency.vitals.oxygenSat}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="md:col-span-2">
                      <h4 className="font-medium mb-2">Emergency Notes</h4>
                      <p className="text-sm text-gray-600 mb-3">{emergency.notes}</p>
                      <p className="text-xs text-gray-500">
                        Reported by: {emergency.reportedBy} at {emergency.timeReported}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t">
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4 mr-1" />
                      Call Team
                    </Button>
                    <Button variant="outline" size="sm">
                      View Patient
                    </Button>
                    <Button variant="outline" size="sm">
                      Update Status
                    </Button>
                    {emergency.status === "In Progress" && (
                      <Button size="sm" className="bg-red-600 hover:bg-red-700">
                        Respond Now
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredEmergencies.length === 0 && (
              <Card>
                <CardContent className="text-center py-10">
                  <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No emergencies found</h3>
                  <p className="text-gray-600">
                    {activeTab === "active" ? "No active emergencies at the moment." : 
                     activeTab === "critical" ? "No critical cases currently." :
                     "No emergency cases match the current filter."}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmergencyCenter; 