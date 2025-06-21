
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Plus, MapPin, Calendar, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const CaseReporting = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    patientName: "",
    age: "",
    gender: "",
    phoneNumber: "",
    address: "",
    symptoms: "",
    diagnosisDate: "",
    severity: "",
    testResult: "",
    reportedBy: ""
  });

  const [recentCases, setRecentCases] = useState([
    {
      id: 1,
      patientName: "John Doe",
      age: 34,
      symptoms: "Fever, Cough, Fatigue",
      severity: "Moderate",
      reportDate: "2024-01-20",
      status: "Confirmed"
    },
    {
      id: 2,
      patientName: "Jane Smith",
      age: 28,
      symptoms: "Headache, Fever",
      severity: "Mild",
      reportDate: "2024-01-19",
      status: "Suspected"
    }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newCase = {
      id: recentCases.length + 1,
      patientName: formData.patientName,
      age: parseInt(formData.age),
      symptoms: formData.symptoms,
      severity: formData.severity,
      reportDate: new Date().toISOString().split('T')[0],
      status: formData.testResult === "positive" ? "Confirmed" : "Suspected"
    };

    setRecentCases([newCase, ...recentCases]);
    setFormData({
      patientName: "",
      age: "",
      gender: "",
      phoneNumber: "",
      address: "",
      symptoms: "",
      diagnosisDate: "",
      severity: "",
      testResult: "",
      reportedBy: ""
    });

    toast({
      title: "Case Reported Successfully",
      description: "The case has been submitted to the surveillance system.",
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Mild": return "bg-yellow-100 text-yellow-800";
      case "Moderate": return "bg-orange-100 text-orange-800";
      case "Severe": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed": return "bg-red-100 text-red-800";
      case "Suspected": return "bg-yellow-100 text-yellow-800";
      case "Recovered": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Case Reporting Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span>Report New Case</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="patientName">Patient Name</Label>
                <Input
                  id="patientName"
                  value={formData.patientName}
                  onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select onValueChange={(value) => setFormData({...formData, gender: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address/Location</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="Street address or GPS coordinates"
                required
              />
            </div>

            <div>
              <Label htmlFor="symptoms">Symptoms</Label>
              <Textarea
                id="symptoms"
                value={formData.symptoms}
                onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
                placeholder="Describe symptoms observed..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="diagnosisDate">Diagnosis Date</Label>
                <Input
                  id="diagnosisDate"
                  type="date"
                  value={formData.diagnosisDate}
                  onChange={(e) => setFormData({...formData, diagnosisDate: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="severity">Severity</Label>
                <Select onValueChange={(value) => setFormData({...formData, severity: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mild">Mild</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="Severe">Severe</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="testResult">Test Result</Label>
                <Select onValueChange={(value) => setFormData({...formData, testResult: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select result" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="positive">Positive</SelectItem>
                    <SelectItem value="negative">Negative</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="reportedBy">Reported By</Label>
                <Input
                  id="reportedBy"
                  value={formData.reportedBy}
                  onChange={(e) => setFormData({...formData, reportedBy: e.target.value})}
                  placeholder="Healthcare worker name"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Submit Case Report
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Recent Cases */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Cases</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentCases.map((case_) => (
              <div key={case_.id} className="p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{case_.patientName}</span>
                    <span className="text-gray-500">({case_.age})</span>
                  </div>
                  <div className="flex space-x-2">
                    <Badge className={getSeverityColor(case_.severity)}>
                      {case_.severity}
                    </Badge>
                    <Badge className={getStatusColor(case_.status)}>
                      {case_.status}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{case_.symptoms}</p>
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="h-3 w-3 mr-1" />
                  {case_.reportDate}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
