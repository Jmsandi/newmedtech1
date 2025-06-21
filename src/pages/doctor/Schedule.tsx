import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Plus, ChevronLeft, ChevronRight } from "lucide-react";

const Schedule: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("week");
  
  const appointments = [
    {
      id: "A001",
      patientName: "James Wilson",
      patientId: "P001",
      time: "09:00",
      duration: 30,
      type: "Follow-up",
      status: "Confirmed",
      date: "2024-01-15"
    },
    {
      id: "A002",
      patientName: "Emma Johnson",
      patientId: "P004",
      time: "10:30",
      duration: 45,
      type: "Prenatal Checkup",
      status: "Confirmed",
      date: "2024-01-15"
    },
    {
      id: "A003",
      patientName: "Robert Chen",
      patientId: "P003",
      time: "11:30",
      duration: 30,
      type: "Post-op Review",
      status: "Urgent",
      date: "2024-01-15"
    },
    {
      id: "A004",
      patientName: "Maria Garcia",
      patientId: "P002",
      time: "14:00",
      duration: 30,
      type: "Diabetes Management",
      status: "Confirmed",
      date: "2024-01-15"
    },
    {
      id: "A005",
      patientName: "David Kim",
      patientId: "P005",
      time: "15:30",
      duration: 30,
      type: "Asthma Review",
      status: "Pending",
      date: "2024-01-15"
    }
  ];

  const timeSlots = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30"
  ];

  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Urgent":
        return "bg-red-100 text-red-800";
      case "Cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Follow-up":
        return "bg-blue-100 text-blue-800";
      case "Prenatal Checkup":
        return "bg-purple-100 text-purple-800";
      case "Post-op Review":
        return "bg-orange-100 text-orange-800";
      case "Emergency":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1e293b]">Schedule</h1>
          <p className="text-gray-600">Manage your appointments and availability</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Today
          </Button>
          <Button className="bg-[#2563eb] hover:bg-[#1d4ed8]">
            <Plus className="mr-2 h-4 w-4" />
            New Appointment
          </Button>
        </div>
      </div>

      {/* View Mode Selector */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "day" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("day")}
              >
                Day
              </Button>
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

      {/* Today's Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            Today's Schedule
          </CardTitle>
          <CardDescription>
            Your appointments for {formatDate(new Date())}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-4 rounded-lg border border-[#e2e8f0] bg-white hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="text-center w-16">
                    <div className="text-sm font-semibold text-[#2563eb]">{appointment.time}</div>
                    <div className="text-xs text-gray-500">{appointment.duration}min</div>
                  </div>
                  <div className="bg-[#3b82f6]/10 p-2 rounded-full">
                    <User className="h-4 w-4 text-[#2563eb]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#1e293b]">{appointment.patientName}</p>
                    <p className="text-sm text-gray-500">ID: {appointment.patientId}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={getTypeColor(appointment.type)}>
                    {appointment.type}
                  </Badge>
                  <Badge className={getStatusColor(appointment.status)}>
                    {appointment.status}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="sm">
                      Reschedule
                    </Button>
                    <Button variant="ghost" size="sm">
                      Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Calendar View */}
      {viewMode === "week" && (
        <Card>
          <CardHeader>
            <CardTitle>Weekly Calendar</CardTitle>
            <CardDescription>
              Week view of your schedule
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-6 gap-4">
              <div className="font-medium text-center py-2">Time</div>
              {weekDays.map((day) => (
                <div key={day} className="font-medium text-center py-2 border-b">
                  {day}
                </div>
              ))}
              
              {timeSlots.map((time) => (
                <React.Fragment key={time}>
                  <div className="text-center py-3 text-sm text-gray-500 border-r">
                    {time}
                  </div>
                  {weekDays.map((day) => (
                    <div key={`${day}-${time}`} className="border border-gray-200 min-h-[60px] p-1">
                      {/* Appointment blocks would go here */}
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Today's Appointments</p>
                <h3 className="text-2xl font-bold text-[#1e293b]">{appointments.length}</h3>
              </div>
              <div className="bg-[#3b82f6]/10 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-[#2563eb]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending Confirmations</p>
                <h3 className="text-2xl font-bold text-[#1e293b]">
                  {appointments.filter(a => a.status === "Pending").length}
                </h3>
              </div>
              <div className="bg-[#eab308]/10 p-3 rounded-full">
                <Clock className="h-6 w-6 text-[#eab308]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Urgent Cases</p>
                <h3 className="text-2xl font-bold text-[#1e293b]">
                  {appointments.filter(a => a.status === "Urgent").length}
                </h3>
              </div>
              <div className="bg-[#dc2626]/10 p-3 rounded-full">
                <User className="h-6 w-6 text-[#dc2626]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Schedule; 