
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Eye, Edit, UserPlus, Activity, FileText, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const NursePatients: React.FC = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWard, setSelectedWard] = useState("all");

  const patients = [
    {
      id: 1,
      name: "James Wilson",
      patientId: "P-001",
      age: 48,
      gender: "Male",
      room: "201A",
      ward: "General",
      condition: "Hypertension",
      admissionDate: "2025-01-15",
      status: "Stable",
      lastVitals: "2 hours ago",
      assignedDoctor: "Dr. Smith",
      alerts: ["Medication due"],
      recentNotes: "Patient responding well to treatment"
    },
    {
      id: 2,
      name: "Maria Garcia",
      patientId: "P-002",
      age: 62,
      gender: "Female",
      room: "203B",
      ward: "ICU",
      condition: "Diabetes complications",
      admissionDate: "2025-01-10",
      status: "Critical",
      lastVitals: "30 minutes ago",
      assignedDoctor: "Dr. Johnson",
      alerts: ["Blood glucose check", "Insulin due"],
      recentNotes: "Glucose levels improving, continue monitoring"
    },
    {
      id: 3,
      name: "Robert Chen",
      patientId: "P-003",
      age: 54,
      gender: "Male",
      room: "105C",
      ward: "Surgery",
      condition: "Post-operative recovery",
      admissionDate: "2025-01-12",
      status: "Recovering",
      lastVitals: "1 hour ago",
      assignedDoctor: "Dr. Williams",
      alerts: ["Wound check"],
      recentNotes: "Surgical site healing well, pain managed"
    }
  ];

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         patient.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         patient.condition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesWard = selectedWard === "all" || patient.ward.toLowerCase() === selectedWard;
    return matchesSearch && matchesWard;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "stable": return "bg-green-100 text-green-800";
      case "critical": return "bg-red-100 text-red-800";
      case "recovering": return "bg-blue-100 text-blue-800";
      case "monitoring": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleTaskComplete = (patientId: string, task: string) => {
    toast({
      title: "Task Completed",
      description: `${task} completed for patient ${patientId}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-[#2c3e50]">Patient Management</h1>
        <div className="flex gap-2">
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input 
              placeholder="Search patients..." 
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={selectedWard} onValueChange={setSelectedWard}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Wards</SelectItem>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="icu">ICU</SelectItem>
              <SelectItem value="surgery">Surgery</SelectItem>
              <SelectItem value="pediatric">Pediatric</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-[#3498db] hover:bg-[#2980b9]">
            <UserPlus className="h-4 w-4 mr-2" />
            Register Patient
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredPatients.map((patient) => (
          <Card key={patient.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {patient.name}
                    <Badge variant="outline">{patient.patientId}</Badge>
                  </CardTitle>
                  <CardDescription>
                    {patient.age} years • {patient.gender} • Room {patient.room} ({patient.ward})
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(patient.status)}>
                  {patient.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Medical Information</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div><strong>Condition:</strong> {patient.condition}</div>
                    <div><strong>Admitted:</strong> {patient.admissionDate}</div>
                    <div><strong>Doctor:</strong> {patient.assignedDoctor}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Vitals & Monitoring</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Last vitals: {patient.lastVitals}
                    </div>
                    <Button size="sm" variant="outline" className="mt-2">
                      <Activity className="h-3 w-3 mr-1" />
                      Record Vitals
                    </Button>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Active Alerts</h4>
                  <div className="space-y-1">
                    {patient.alerts.map((alert, index) => (
                      <div key={index} className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded flex justify-between items-center">
                        {alert}
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-4 w-4 p-0 text-orange-800"
                          onClick={() => handleTaskComplete(patient.patientId, alert)}
                        >
                          ✓
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Actions</h4>
                  <div className="flex flex-col gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      View Details
                    </Button>
                    <Button size="sm" className="bg-[#3498db] hover:bg-[#2980b9]">
                      <FileText className="h-3 w-3 mr-1" />
                      Add Notes
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-3 w-3 mr-1" />
                      Update Care
                    </Button>
                  </div>
                </div>
              </div>
              
              {patient.recentNotes && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <h5 className="text-sm font-medium mb-1">Recent Notes:</h5>
                  <p className="text-sm text-gray-600">{patient.recentNotes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">No patients match your search criteria</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NursePatients;
