import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, User, MapPin, ChevronLeft, ChevronRight, Plus } from "lucide-react";

const Schedules: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"week" | "month">("week");
  
  const shifts = [
    {
      id: "S001",
      date: "2024-01-15",
      startTime: "07:00",
      endTime: "15:00",
      type: "Day Shift",
      status: "Active",
      ward: "ICU",
      patientsAssigned: 8,
      break: "12:00 - 12:30"
    },
    {
      id: "S002",
      date: "2024-01-16",
      startTime: "07:00",
      endTime: "15:00",
      type: "Day Shift",
      status: "Scheduled",
      ward: "General Ward",
      patientsAssigned: 12,
      break: "12:00 - 12:30"
    },
    {
      id: "S003",
      date: "2024-01-17",
      startTime: "15:00",
      endTime: "23:00",
      type: "Evening Shift",
      status: "Scheduled",
      ward: "Emergency",
      patientsAssigned: 6,
      break: "19:00 - 19:30"
    }
  ];

  const patientAssignments = [
    {
      id: "P001",
      name: "James Wilson",
      room: "101",
      condition: "Hypertension",
      priority: "Medium",
      tasks: ["Vitals q4h", "Medication", "Mobility"],
      timeSlots: ["08:00", "12:00", "16:00"]
    },
    {
      id: "P002",
      name: "Maria Garcia",
      room: "205",
      condition: "Diabetes",
      priority: "High",
      tasks: ["Blood glucose", "Insulin", "Diet monitoring"],
      timeSlots: ["08:00", "11:00", "14:00", "17:00"]
    },
    {
      id: "P003",
      name: "Robert Chen",
      room: "302",
      condition: "Post-op",
      priority: "High",
      tasks: ["Pain assessment", "Wound care", "Drain monitoring"],
      timeSlots: ["08:00", "10:00", "14:00", "18:00"]
    }
  ];

  const weeklyOverview = [
    { day: "Monday", date: "15", shift: "Day", hours: "8h", status: "Active" },
    { day: "Tuesday", date: "16", shift: "Day", hours: "8h", status: "Scheduled" },
    { day: "Wednesday", date: "17", shift: "Evening", hours: "8h", status: "Scheduled" },
    { day: "Thursday", date: "18", shift: "Off", hours: "0h", status: "Off" },
    { day: "Friday", date: "19", shift: "Day", hours: "8h", status: "Scheduled" },
    { day: "Saturday", date: "20", shift: "Night", hours: "12h", status: "Scheduled" },
    { day: "Sunday", date: "21", shift: "Off", hours: "0h", status: "Off" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Scheduled":
        return "bg-blue-100 text-blue-800";
      case "Off":
        return "bg-gray-100 text-gray-800";
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

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1e293b]">My Schedule</h1>
          <p className="text-gray-600">View your work schedule and patient assignments</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Request Time Off
          </Button>
          <Button className="bg-[#3498db] hover:bg-[#2980b9]">
            <Plus className="mr-2 h-4 w-4" />
            Swap Shift
          </Button>
        </div>
      </div>

      {/* Current Shift Info */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg text-green-800">Current Shift</CardTitle>
              <CardDescription className="flex items-center gap-4 mt-1">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  7:00 AM - 3:00 PM
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  ICU Ward
                </span>
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  8 Patients Assigned
                </span>
              </CardDescription>
            </div>
            <Badge className="bg-green-100 text-green-800">
              Active
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-[#3498db]">5h 20m</div>
              <div className="text-sm text-gray-600">Remaining</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">12:00</div>
              <div className="text-sm text-gray-600">Break Time</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">6</div>
              <div className="text-sm text-gray-600">Tasks Pending</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Schedule Overview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Navigation */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === "week" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("week")}
                  >
                    Week
                  </Button>
                  <Button
                    variant={viewMode === "month" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("month")}
                  >
                    Month
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => navigateWeek('prev')}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium min-w-[200px] text-center">
                    {formatDate(currentDate)}
                  </span>
                  <Button variant="outline" size="sm" onClick={() => navigateWeek('next')}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Weekly Schedule
              </CardTitle>
              <CardDescription>
                Your shifts for this week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {weeklyOverview.map((day, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-[#3498db]">{day.date}</div>
                        <div className="text-sm text-gray-600">{day.day}</div>
                      </div>
                      <div>
                        <div className="font-medium">{day.shift} Shift</div>
                        <div className="text-sm text-gray-600">{day.hours}</div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(day.status)}>
                      {day.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Patient Assignments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Today's Patient Assignments
              </CardTitle>
              <CardDescription>
                Patients assigned to your care today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patientAssignments.map((patient) => (
                  <div key={patient.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-[#1e293b]">{patient.name}</h4>
                        <p className="text-sm text-gray-600">Room {patient.room} • {patient.condition}</p>
                      </div>
                      <Badge className={getPriorityColor(patient.priority)}>
                        {patient.priority} Priority
                      </Badge>
                    </div>
                    
                    <div className="grid gap-3 md:grid-cols-2">
                      <div>
                        <h5 className="text-sm font-medium mb-2">Care Tasks</h5>
                        <div className="space-y-1">
                          {patient.tasks.map((task, index) => (
                            <div key={index} className="text-sm text-gray-600">• {task}</div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium mb-2">Scheduled Times</h5>
                        <div className="flex gap-2 flex-wrap">
                          {patient.timeSlots.map((time, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                              {time}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>This Week</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Hours</span>
                <span className="font-bold text-[#3498db]">40h</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Shifts</span>
                <span className="font-bold">5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Days Off</span>
                <span className="font-bold">2</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Overtime</span>
                <span className="font-bold text-orange-600">0h</span>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Shifts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Upcoming Shifts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {shifts.filter(shift => shift.status === "Scheduled").map((shift) => (
                  <div key={shift.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">{shift.type}</div>
                      <Badge className={getStatusColor(shift.status)} size="sm">
                        {shift.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>{new Date(shift.date).toLocaleDateString()}</p>
                      <p>{shift.startTime} - {shift.endTime}</p>
                      <p>{shift.ward} Ward</p>
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
                <Calendar className="mr-2 h-4 w-4" />
                View Full Calendar
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Clock className="mr-2 h-4 w-4" />
                Clock In/Out
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <User className="mr-2 h-4 w-4" />
                Patient Handoff
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Schedules; 