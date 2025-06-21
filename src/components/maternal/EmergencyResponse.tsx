
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Ambulance, Phone, MapPin, Clock, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const EmergencyResponse = () => {
  const [newIncident, setNewIncident] = useState(false);
  const { toast } = useToast();

  const activeEmergencies = [
    {
      id: "EMG-2024-001",
      patientName: "Sarah Johnson",
      patientId: "MP-2024-001",
      type: "Severe Preeclampsia",
      severity: "Critical",
      location: "Rural Health Center - North District",
      reportedAt: "2024-01-20 14:30",
      status: "Ambulance Dispatched",
      eta: "25 minutes",
      reportedBy: "Dr. Mary Wilson"
    },
    {
      id: "EMG-2024-002",
      patientName: "Maria Rodriguez",
      patientId: "MP-2024-002",
      type: "Postpartum Hemorrhage",
      severity: "High",
      location: "Community Clinic - East Ward",
      reportedAt: "2024-01-20 15:45",
      status: "In Transit",
      eta: "10 minutes",
      reportedBy: "Nurse Jennifer Adams"
    }
  ];

  const recentIncidents = [
    {
      id: "EMG-2024-003",
      patientName: "Jennifer Chen",
      type: "Emergency C-Section",
      outcome: "Successful",
      resolvedAt: "2024-01-20 12:00",
      responseTime: "18 minutes"
    },
    {
      id: "EMG-2024-004",
      patientName: "Lisa Brown",
      type: "Placental Abruption",
      outcome: "Referred to Level 3",
      resolvedAt: "2024-01-20 09:30",
      responseTime: "22 minutes"
    }
  ];

  const handleReportIncident = () => {
    toast({
      title: "Emergency Reported",
      description: "Emergency response team has been notified.",
    });
    setNewIncident(false);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical": return "destructive";
      case "High": return "destructive";
      case "Medium": return "outline";
      default: return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Button 
          className="h-20 text-white bg-red-600 hover:bg-red-700"
          onClick={() => setNewIncident(true)}
        >
          <div className="text-center">
            <AlertTriangle className="h-6 w-6 mx-auto mb-1" />
            <div>Report Emergency</div>
          </div>
        </Button>
        
        <Button variant="outline" className="h-20">
          <div className="text-center">
            <Ambulance className="h-6 w-6 mx-auto mb-1" />
            <div>Request Ambulance</div>
          </div>
        </Button>

        <Button variant="outline" className="h-20">
          <div className="text-center">
            <Phone className="h-6 w-6 mx-auto mb-1" />
            <div>Emergency Hotline</div>
          </div>
        </Button>
      </div>

      {/* New Incident Report Form */}
      {newIncident && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Report New Emergency
            </CardTitle>
            <CardDescription>
              Immediately report maternal health emergencies for rapid response
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Patient ID *</label>
                  <Input placeholder="Enter patient ID" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Emergency Type *</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select emergency type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="preeclampsia">Severe Preeclampsia</SelectItem>
                      <SelectItem value="hemorrhage">Postpartum Hemorrhage</SelectItem>
                      <SelectItem value="labor">Obstructed Labor</SelectItem>
                      <SelectItem value="sepsis">Sepsis</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Severity Level *</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Reporting Facility</label>
                  <Input placeholder="Current facility name" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea placeholder="Describe the emergency situation, symptoms, and interventions attempted" />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setNewIncident(false)}>
                  Cancel
                </Button>
                <Button className="bg-red-600 hover:bg-red-700" onClick={handleReportIncident}>
                  Report Emergency
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Emergencies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Active Emergencies
          </CardTitle>
          <CardDescription>
            Current emergency cases requiring immediate attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeEmergencies.map((emergency) => (
              <div key={emergency.id} className="border border-red-200 rounded-lg p-4 bg-red-50">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-red-900">{emergency.patientName}</h4>
                    <p className="text-sm text-red-700">ID: {emergency.patientId}</p>
                  </div>
                  <Badge variant={getSeverityColor(emergency.severity) as any}>
                    {emergency.severity}
                  </Badge>
                </div>

                <div className="grid gap-2 md:grid-cols-2 mb-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium">{emergency.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-red-500" />
                    <span className="text-sm">{emergency.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-red-500" />
                    <span className="text-sm">Reported: {emergency.reportedAt}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Ambulance className="h-4 w-4 text-red-500" />
                    <span className="text-sm">{emergency.status} - ETA: {emergency.eta}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-red-700">Reported by: {emergency.reportedBy}</span>
                  <div className="space-x-2">
                    <Button size="sm" variant="outline">Update Status</Button>
                    <Button size="sm">Contact Team</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Incidents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Recent Incidents
          </CardTitle>
          <CardDescription>
            Recently resolved emergency cases and their outcomes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentIncidents.map((incident) => (
              <div key={incident.id} className="border rounded-lg p-3 bg-green-50">
                <div className="flex justify-between items-center">
                  <div>
                    <h5 className="font-medium">{incident.patientName}</h5>
                    <p className="text-sm text-muted-foreground">{incident.type}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary">{incident.outcome}</Badge>
                    <p className="text-sm text-muted-foreground mt-1">
                      Response time: {incident.responseTime}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
