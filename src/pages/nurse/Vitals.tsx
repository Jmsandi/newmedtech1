import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Activity, Heart, Thermometer, Droplets, Wind, Search, Save, Plus, Clock, TrendingUp, TrendingDown, Minus } from "lucide-react";

const Vitals: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("entry");
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  
  const [vitalsForm, setVitalsForm] = useState({
    heartRate: "",
    systolic: "",
    diastolic: "",
    temperature: "",
    oxygenSaturation: "",
    respiratoryRate: "",
    weight: "",
    height: "",
    painLevel: "",
    notes: ""
  });

  const patients = [
    {
      id: "P001",
      name: "James Wilson",
      room: "101",
      age: 65,
      condition: "Hypertension",
      lastVitals: "2 hours ago",
      status: "Stable"
    },
    {
      id: "P002", 
      name: "Maria Garcia",
      room: "205",
      age: 42,
      condition: "Type 2 Diabetes",
      lastVitals: "1 hour ago", 
      status: "Monitoring"
    },
    {
      id: "P003",
      name: "Robert Chen", 
      room: "302",
      age: 28,
      condition: "Post-operative",
      lastVitals: "30 min ago",
      status: "Stable"
    }
  ];

  const recentVitals = [
    {
      id: "V001",
      patientName: "James Wilson",
      patientId: "P001",
      room: "101",
      timestamp: "2024-01-15 14:30",
      heartRate: 78,
      bloodPressure: "145/92",
      temperature: 98.6,
      oxygenSaturation: 98,
      respiratoryRate: 16,
      painLevel: 2,
      recordedBy: "Nurse Jennifer",
      notes: "Patient reports feeling well. Slight elevation in BP, monitoring closely."
    },
    {
      id: "V002",
      patientName: "Maria Garcia",
      patientId: "P002", 
      room: "205",
      timestamp: "2024-01-15 15:00",
      heartRate: 110,
      bloodPressure: "160/95",
      temperature: 101.2,
      oxygenSaturation: 94,
      respiratoryRate: 22,
      painLevel: 4,
      recordedBy: "Nurse Amy",
      notes: "Fever present. Tachycardia noted. Patient complaining of fatigue."
    },
    {
      id: "V003",
      patientName: "Robert Chen",
      patientId: "P003",
      room: "302", 
      timestamp: "2024-01-15 15:15",
      heartRate: 85,
      bloodPressure: "120/80",
      temperature: 99.1,
      oxygenSaturation: 99,
      respiratoryRate: 14,
      painLevel: 3,
      recordedBy: "Nurse Jennifer",
      notes: "Post-op recovery progressing well. Pain well controlled."
    }
  ];

  const vitalRanges = {
    heartRate: { min: 60, max: 100, unit: "bpm" },
    systolic: { min: 90, max: 140, unit: "mmHg" },
    diastolic: { min: 60, max: 90, unit: "mmHg" },
    temperature: { min: 97.0, max: 99.5, unit: "°F" },
    oxygenSaturation: { min: 95, max: 100, unit: "%" },
    respiratoryRate: { min: 12, max: 20, unit: "rpm" }
  };

  const getVitalStatus = (value: number, range: any) => {
    if (value < range.min || value > range.max) {
      return "abnormal";
    }
    return "normal";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "text-green-600";
      case "abnormal":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusBadge = (status: string) => {
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

  const handleFormChange = (field: string, value: string) => {
    setVitalsForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveVitals = () => {
    if (!selectedPatient) return;
    
    // Handle saving vitals
    console.log("Saving vitals for", selectedPatient.name, vitalsForm);
    
    // Reset form
    setVitalsForm({
      heartRate: "",
      systolic: "",
      diastolic: "",
      temperature: "",
      oxygenSaturation: "",
      respiratoryRate: "",
      weight: "",
      height: "",
      painLevel: "",
      notes: ""
    });
    setSelectedPatient(null);
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1e293b]">Vital Signs</h1>
          <p className="text-gray-600">Record and monitor patient vital signs</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Activity className="mr-2 h-4 w-4" />
            Vital Trends
          </Button>
          <Button className="bg-[#3498db] hover:bg-[#2980b9]">
            <Plus className="mr-2 h-4 w-4" />
            Quick Entry
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Vitals Due</p>
                <h3 className="text-2xl font-bold text-yellow-600">5</h3>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Abnormal Values</p>
                <h3 className="text-2xl font-bold text-red-600">2</h3>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Recorded Today</p>
                <h3 className="text-2xl font-bold text-[#3498db]">{recentVitals.length}</h3>
              </div>
              <div className="bg-[#3498db]/10 p-3 rounded-full">
                <Heart className="h-6 w-6 text-[#3498db]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Critical Alerts</p>
                <h3 className="text-2xl font-bold text-orange-600">1</h3>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Activity className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="entry">Vital Signs Entry</TabsTrigger>
          <TabsTrigger value="recent">Recent Vitals</TabsTrigger>
          <TabsTrigger value="trends">Trends & Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="entry" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Patient Selection */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Search className="mr-2 h-5 w-5" />
                    Select Patient
                  </CardTitle>
                  <CardDescription>
                    Choose a patient to record vital signs
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search patients..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>

                  <div className="space-y-2">
                    {filteredPatients.map((patient) => (
                      <div
                        key={patient.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedPatient?.id === patient.id
                            ? "border-[#3498db] bg-[#3498db]/5"
                            : "hover:bg-gray-50"
                        }`}
                        onClick={() => setSelectedPatient(patient)}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium">{patient.name}</h4>
                            <p className="text-sm text-gray-600">Room {patient.room}</p>
                            <p className="text-sm text-gray-600">{patient.condition}</p>
                          </div>
                          <Badge className={getStatusBadge(patient.status)}>
                            {patient.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Last vitals: {patient.lastVitals}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Vitals Entry Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="mr-2 h-5 w-5" />
                    {selectedPatient ? `Record Vitals - ${selectedPatient.name}` : "Select Patient to Record Vitals"}
                  </CardTitle>
                  {selectedPatient && (
                    <CardDescription>
                      Room {selectedPatient.room} • {selectedPatient.condition}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  {selectedPatient ? (
                    <div className="space-y-6">
                      {/* Primary Vitals */}
                      <div>
                        <h4 className="font-medium mb-4 text-[#1e293b]">Primary Vital Signs</h4>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                            <Input
                              id="heartRate"
                              type="number"
                              value={vitalsForm.heartRate}
                              onChange={(e) => handleFormChange("heartRate", e.target.value)}
                              placeholder="60-100"
                            />
                            <p className="text-xs text-gray-500">Normal: 60-100 bpm</p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="temperature">Temperature (°F)</Label>
                            <Input
                              id="temperature"
                              type="number"
                              step="0.1"
                              value={vitalsForm.temperature}
                              onChange={(e) => handleFormChange("temperature", e.target.value)}
                              placeholder="97.0-99.5"
                            />
                            <p className="text-xs text-gray-500">Normal: 97.0-99.5°F</p>
                          </div>

                          <div className="space-y-2">
                            <Label>Blood Pressure (mmHg)</Label>
                            <div className="flex gap-2">
                              <Input
                                type="number"
                                value={vitalsForm.systolic}
                                onChange={(e) => handleFormChange("systolic", e.target.value)}
                                placeholder="Systolic"
                              />
                              <span className="self-center">/</span>
                              <Input
                                type="number"
                                value={vitalsForm.diastolic}
                                onChange={(e) => handleFormChange("diastolic", e.target.value)}
                                placeholder="Diastolic"
                              />
                            </div>
                            <p className="text-xs text-gray-500">Normal: 90-140 / 60-90 mmHg</p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="oxygenSaturation">Oxygen Saturation (%)</Label>
                            <Input
                              id="oxygenSaturation"
                              type="number"
                              value={vitalsForm.oxygenSaturation}
                              onChange={(e) => handleFormChange("oxygenSaturation", e.target.value)}
                              placeholder="95-100"
                            />
                            <p className="text-xs text-gray-500">Normal: 95-100%</p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="respiratoryRate">Respiratory Rate (rpm)</Label>
                            <Input
                              id="respiratoryRate"
                              type="number"
                              value={vitalsForm.respiratoryRate}
                              onChange={(e) => handleFormChange("respiratoryRate", e.target.value)}
                              placeholder="12-20"
                            />
                            <p className="text-xs text-gray-500">Normal: 12-20 rpm</p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="painLevel">Pain Level (0-10)</Label>
                            <Input
                              id="painLevel"
                              type="number"
                              min="0"
                              max="10"
                              value={vitalsForm.painLevel}
                              onChange={(e) => handleFormChange("painLevel", e.target.value)}
                              placeholder="0-10"
                            />
                            <p className="text-xs text-gray-500">0 = No pain, 10 = Severe pain</p>
                          </div>
                        </div>
                      </div>

                      {/* Additional Measurements */}
                      <div>
                        <h4 className="font-medium mb-4 text-[#1e293b]">Additional Measurements</h4>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="weight">Weight (lbs)</Label>
                            <Input
                              id="weight"
                              type="number"
                              value={vitalsForm.weight}
                              onChange={(e) => handleFormChange("weight", e.target.value)}
                              placeholder="Weight in pounds"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="height">Height (inches)</Label>
                            <Input
                              id="height"
                              type="number"
                              value={vitalsForm.height}
                              onChange={(e) => handleFormChange("height", e.target.value)}
                              placeholder="Height in inches"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Notes */}
                      <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                          id="notes"
                          value={vitalsForm.notes}
                          onChange={(e) => handleFormChange("notes", e.target.value)}
                          placeholder="Additional observations or notes..."
                          rows={3}
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-end gap-3 pt-4 border-t">
                        <Button variant="outline" onClick={() => setSelectedPatient(null)}>
                          Cancel
                        </Button>
                        <Button onClick={handleSaveVitals} className="bg-[#3498db] hover:bg-[#2980b9]">
                          <Save className="mr-2 h-4 w-4" />
                          Save Vitals
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Patient</h3>
                      <p className="text-gray-600">Choose a patient from the list to record their vital signs.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="recent" className="mt-6">
          <div className="space-y-4">
            {recentVitals.map((vital) => (
              <Card key={vital.id}>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{vital.patientName}</CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-1">
                        <span>Room {vital.room}</span>
                        <span>•</span>
                        <span>{new Date(vital.timestamp).toLocaleString()}</span>
                        <span>•</span>
                        <span>Recorded by {vital.recordedBy}</span>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-6">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Heart className={`h-5 w-5 mx-auto mb-1 ${getStatusColor(getVitalStatus(vital.heartRate, vitalRanges.heartRate))}`} />
                      <div className={`text-lg font-bold ${getStatusColor(getVitalStatus(vital.heartRate, vitalRanges.heartRate))}`}>
                        {vital.heartRate}
                      </div>
                      <div className="text-xs text-gray-600">HR (bpm)</div>
                    </div>

                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Activity className={`h-5 w-5 mx-auto mb-1 ${getStatusColor(getVitalStatus(parseInt(vital.bloodPressure.split('/')[0]), vitalRanges.systolic))}`} />
                      <div className={`text-lg font-bold ${getStatusColor(getVitalStatus(parseInt(vital.bloodPressure.split('/')[0]), vitalRanges.systolic))}`}>
                        {vital.bloodPressure}
                      </div>
                      <div className="text-xs text-gray-600">BP (mmHg)</div>
                    </div>

                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Thermometer className={`h-5 w-5 mx-auto mb-1 ${getStatusColor(getVitalStatus(vital.temperature, vitalRanges.temperature))}`} />
                      <div className={`text-lg font-bold ${getStatusColor(getVitalStatus(vital.temperature, vitalRanges.temperature))}`}>
                        {vital.temperature}°F
                      </div>
                      <div className="text-xs text-gray-600">Temp</div>
                    </div>

                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Droplets className={`h-5 w-5 mx-auto mb-1 ${getStatusColor(getVitalStatus(vital.oxygenSaturation, vitalRanges.oxygenSaturation))}`} />
                      <div className={`text-lg font-bold ${getStatusColor(getVitalStatus(vital.oxygenSaturation, vitalRanges.oxygenSaturation))}`}>
                        {vital.oxygenSaturation}%
                      </div>
                      <div className="text-xs text-gray-600">SpO2</div>
                    </div>

                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Wind className={`h-5 w-5 mx-auto mb-1 ${getStatusColor(getVitalStatus(vital.respiratoryRate, vitalRanges.respiratoryRate))}`} />
                      <div className={`text-lg font-bold ${getStatusColor(getVitalStatus(vital.respiratoryRate, vitalRanges.respiratoryRate))}`}>
                        {vital.respiratoryRate}
                      </div>
                      <div className="text-xs text-gray-600">RR (rpm)</div>
                    </div>

                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className={`text-lg font-bold ${vital.painLevel > 5 ? 'text-red-600' : vital.painLevel > 3 ? 'text-yellow-600' : 'text-green-600'}`}>
                        {vital.painLevel}/10
                      </div>
                      <div className="text-xs text-gray-600">Pain</div>
                    </div>
                  </div>

                  {vital.notes && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{vital.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="mt-6">
          <Card>
            <CardContent className="text-center py-20">
              <Activity className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">Vital Signs Trends</h3>
              <p className="text-gray-600">Trend analysis and charts would be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Vitals;
