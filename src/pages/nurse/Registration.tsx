import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCheck, User, MapPin, Phone, Calendar, FileText, Save, Search } from "lucide-react";

const Registration: React.FC = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [searchTerm, setSearchTerm] = useState("");
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    emergencyContact: "",
    emergencyPhone: "",
    insurance: "",
    policyNumber: "",
    primaryPhysician: "",
    allergies: "",
    medications: "",
    medicalHistory: "",
    reasonForAdmission: "",
    symptoms: ""
  });

  const recentRegistrations = [
    {
      id: "R001",
      name: "John Smith",
      age: 35,
      gender: "Male",
      registeredBy: "Nurse Jennifer",
      timestamp: "10:30 AM",
      status: "Completed",
      roomAssigned: "205"
    },
    {
      id: "R002",
      name: "Mary Johnson",
      age: 42,
      gender: "Female", 
      registeredBy: "Nurse Amy",
      timestamp: "9:45 AM",
      status: "In Progress",
      roomAssigned: "Pending"
    },
    {
      id: "R003",
      name: "Robert Davis",
      age: 28,
      gender: "Male",
      registeredBy: "Nurse Jennifer",
      timestamp: "8:20 AM",
      status: "Completed",
      roomAssigned: "312"
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log("Registering patient:", formData);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1e293b]">Patient Registration</h1>
          <p className="text-gray-600">Register new patients and manage admissions</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Search className="mr-2 h-4 w-4" />
            Find Patient
          </Button>
          <Button className="bg-[#3498db] hover:bg-[#2980b9]">
            <UserCheck className="mr-2 h-4 w-4" />
            Quick Registration
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Registration Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserCheck className="mr-2 h-5 w-5" />
                New Patient Registration
              </CardTitle>
              <CardDescription>
                Complete patient information for admission
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="personal">Personal Info</TabsTrigger>
                  <TabsTrigger value="contact">Contact</TabsTrigger>
                  <TabsTrigger value="insurance">Insurance</TabsTrigger>
                  <TabsTrigger value="medical">Medical Info</TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="space-y-4 mt-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        placeholder="Enter first name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        placeholder="Enter last name"
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender *</Label>
                      <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
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
                  </div>
                </TabsContent>

                <TabsContent value="contact" className="space-y-4 mt-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="patient@email.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      placeholder="Street address"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        placeholder="City"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => handleInputChange("state", e.target.value)}
                        placeholder="State"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP Code *</Label>
                      <Input
                        id="zipCode"
                        value={formData.zipCode}
                        onChange={(e) => handleInputChange("zipCode", e.target.value)}
                        placeholder="12345"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContact">Emergency Contact *</Label>
                      <Input
                        id="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                        placeholder="Contact name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyPhone">Emergency Phone *</Label>
                      <Input
                        id="emergencyPhone"
                        value={formData.emergencyPhone}
                        onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="insurance" className="space-y-4 mt-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="insurance">Insurance Provider</Label>
                      <Select value={formData.insurance} onValueChange={(value) => handleInputChange("insurance", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select insurance" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="aetna">Aetna</SelectItem>
                          <SelectItem value="bluecross">Blue Cross Blue Shield</SelectItem>
                          <SelectItem value="cigna">Cigna</SelectItem>
                          <SelectItem value="medicare">Medicare</SelectItem>
                          <SelectItem value="medicaid">Medicaid</SelectItem>
                          <SelectItem value="uninsured">Uninsured/Self-Pay</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="policyNumber">Policy Number</Label>
                      <Input
                        id="policyNumber"
                        value={formData.policyNumber}
                        onChange={(e) => handleInputChange("policyNumber", e.target.value)}
                        placeholder="Policy number"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="primaryPhysician">Primary Physician</Label>
                    <Select value={formData.primaryPhysician} onValueChange={(value) => handleInputChange("primaryPhysician", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select primary physician" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dr-johnson">Dr. Sarah Johnson</SelectItem>
                        <SelectItem value="dr-chen">Dr. Michael Chen</SelectItem>
                        <SelectItem value="dr-davis">Dr. Emily Davis</SelectItem>
                        <SelectItem value="dr-wilson">Dr. Robert Wilson</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value="medical" className="space-y-4 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="reasonForAdmission">Reason for Admission *</Label>
                    <Textarea
                      id="reasonForAdmission"
                      value={formData.reasonForAdmission}
                      onChange={(e) => handleInputChange("reasonForAdmission", e.target.value)}
                      placeholder="Describe the reason for patient admission"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="symptoms">Current Symptoms</Label>
                    <Textarea
                      id="symptoms"
                      value={formData.symptoms}
                      onChange={(e) => handleInputChange("symptoms", e.target.value)}
                      placeholder="List current symptoms"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="allergies">Known Allergies</Label>
                    <Textarea
                      id="allergies"
                      value={formData.allergies}
                      onChange={(e) => handleInputChange("allergies", e.target.value)}
                      placeholder="List any known allergies"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medications">Current Medications</Label>
                    <Textarea
                      id="medications"
                      value={formData.medications}
                      onChange={(e) => handleInputChange("medications", e.target.value)}
                      placeholder="List current medications"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medicalHistory">Medical History</Label>
                    <Textarea
                      id="medicalHistory"
                      value={formData.medicalHistory}
                      onChange={(e) => handleInputChange("medicalHistory", e.target.value)}
                      placeholder="Brief medical history"
                      rows={3}
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleSubmit} className="bg-[#3498db] hover:bg-[#2980b9]">
                  <Save className="mr-2 h-4 w-4" />
                  Register Patient
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Registrations */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Recent Registrations
              </CardTitle>
              <CardDescription>
                Today's patient registrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentRegistrations.map((registration) => (
                  <div key={registration.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-[#1e293b]">{registration.name}</h4>
                        <p className="text-sm text-gray-600">
                          {registration.age}y • {registration.gender}
                        </p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(registration.status)}`}>
                        {registration.status}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Registered by: {registration.registeredBy}</p>
                      <p>Time: {registration.timestamp}</p>
                      <p>Room: {registration.roomAssigned}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <User className="mr-2 h-4 w-4" />
                Find Existing Patient
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Appointment
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MapPin className="mr-2 h-4 w-4" />
                Room Assignment
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Phone className="mr-2 h-4 w-4" />
                Emergency Contact
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Registration; 