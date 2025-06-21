import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Mock data for vitals
const vitalsData = [
  { time: "08:00", heartRate: 72, bloodPressure: 120, temperature: 98.6 },
  { time: "10:00", heartRate: 75, bloodPressure: 122, temperature: 98.8 },
  { time: "12:00", heartRate: 70, bloodPressure: 118, temperature: 98.7 },
  { time: "14:00", heartRate: 73, bloodPressure: 121, temperature: 98.9 },
];

const NurseDashboard: React.FC = () => {
  const [patientNotes, setPatientNotes] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleNotesSave = () => {
    alert("Notes saved: " + patientNotes);
    // In a real app, you would save this to a database
  };

  const handleCompleteTask = (taskId: string) => {
    console.log(`Task ${taskId} completed`);
    // In a real app, you would mark the task as complete in a database
  };

  const handleAdministerMed = (medId: string) => {
    console.log(`Medication ${medId} administered`);
    // In a real app, you would record this in a database
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#2c3e50]">Nurse Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Patient Care Tasks Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-[#2c3e50]">Patient Care Tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="h-3 w-3 rounded-full bg-[#ff4444] mr-2"></span>
                <span>Check vitals - Room 201</span>
              </div>
              <Button 
                size="sm" 
                className="bg-[#3498db] hover:bg-[#2980b9]"
                onClick={() => handleCompleteTask("task-1")}
              >
                Complete
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="h-3 w-3 rounded-full bg-[#2ecc71] mr-2"></span>
                <span>Medication - Room 202</span>
              </div>
              <Button 
                size="sm" 
                className="bg-[#3498db] hover:bg-[#2980b9]"
                onClick={() => handleCompleteTask("task-2")}
              >
                Complete
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Medication Schedule Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-[#2c3e50]">Medication Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">09:00 - Patient 201</div>
                <div className="text-sm text-gray-500">Amoxicillin</div>
              </div>
              <Button 
                size="sm" 
                className="bg-[#3498db] hover:bg-[#2980b9]"
                onClick={() => handleAdministerMed("med-1")}
              >
                Administer
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">10:00 - Patient 202</div>
                <div className="text-sm text-gray-500">Ibuprofen</div>
              </div>
              <Button 
                size="sm" 
                className="bg-[#3498db] hover:bg-[#2980b9]"
                onClick={() => handleAdministerMed("med-2")}
              >
                Administer
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Patient Vitals Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-[#2c3e50]">Patient Vitals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={vitalsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="heartRate" stroke="#3498db" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="bloodPressure" stroke="#2ecc71" />
                  <Line type="monotone" dataKey="temperature" stroke="#e74c3c" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Care Plans Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-[#2c3e50]">Care Plans</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Patient 201 - Post-surgery care</span>
              <Button 
                size="sm" 
                className="bg-[#3498db] hover:bg-[#2980b9]"
              >
                View
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <span>Patient 202 - Respiratory therapy</span>
              <Button 
                size="sm" 
                className="bg-[#3498db] hover:bg-[#2980b9]"
              >
                View
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Shift Schedule Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-[#2c3e50]">Shift Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center">
              <div className="flex-1">
                <div className="font-medium">Current:</div>
                <div>7:00 AM - 3:00 PM</div>
              </div>
              <span className="h-3 w-3 rounded-full bg-[#2ecc71]"></span>
            </div>
            
            <div className="pt-2 border-t border-gray-100">
              <div className="font-medium">Next:</div>
              <div>7:00 AM - 3:00 PM (Tomorrow)</div>
            </div>
          </CardContent>
        </Card>

        {/* Patient Notes Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-[#2c3e50]">Patient Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Add patient notes here..."
              value={patientNotes}
              onChange={(e) => setPatientNotes(e.target.value)}
              className="min-h-[120px]"
            />
            <Button 
              className="w-full bg-[#3498db] hover:bg-[#2980b9]"
              onClick={handleNotesSave}
            >
              Save Notes
            </Button>
          </CardContent>
        </Card>

        {/* Patient Search Card */}
        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg text-[#2c3e50]">Patient Search</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input 
                placeholder="Enter patient name or ID" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button className="bg-[#3498db] hover:bg-[#2980b9]">Search</Button>
            </div>
          </CardContent>
        </Card>

        {/* Patient Management Section */}
        <Card className="col-span-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg text-[#2c3e50]">Patient Management</CardTitle>
            <div className="flex gap-2">
              <Button className="bg-[#3498db] hover:bg-[#2980b9]">Register New Patient</Button>
              <div className="flex gap-2">
                <Input placeholder="Search patient..." className="w-[200px]" />
                <Button className="bg-[#3498db] hover:bg-[#2980b9]">Search</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium">Patient ID</th>
                    <th className="text-left py-3 px-4 font-medium">Name</th>
                    <th className="text-left py-3 px-4 font-medium">Age</th>
                    <th className="text-left py-3 px-4 font-medium">Room</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-right py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4">P-001</td>
                    <td className="py-3 px-4">John Smith</td>
                    <td className="py-3 px-4">45</td>
                    <td className="py-3 px-4">201</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <span className="h-2 w-2 rounded-full bg-[#2ecc71] mr-2"></span>
                        Stable
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <Button size="sm" variant="outline">View</Button>
                        <Button size="sm" className="bg-[#3498db] hover:bg-[#2980b9]">Edit</Button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">P-002</td>
                    <td className="py-3 px-4">Mary Johnson</td>
                    <td className="py-3 px-4">62</td>
                    <td className="py-3 px-4">202</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <span className="h-2 w-2 rounded-full bg-[#ff4444] mr-2"></span>
                        Critical
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <Button size="sm" variant="outline">View</Button>
                        <Button size="sm" className="bg-[#3498db] hover:bg-[#2980b9]">Edit</Button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NurseDashboard;
