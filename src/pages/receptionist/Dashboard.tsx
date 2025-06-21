
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Users, CheckSquare, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { getAllPatients, getTodayAppointments, getAllAppointments, Patient, Appointment } from "@/services/db";

const Dashboard: React.FC = () => {
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [recentRegistrations, setRecentRegistrations] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    checkedIn: 0,
    newRegistrations: 0,
    missed: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Get today's appointments
        const appointments = await getTodayAppointments();
        setTodayAppointments(appointments);
        
        // Get all appointments for stats
        const allAppointments = await getAllAppointments();
        const today = new Date().toISOString().split('T')[0];
        const todayAppointmentsCount = allAppointments.filter(a => a.date === today).length;
        const checkedInCount = allAppointments.filter(a => a.date === today && a.status === 'checked-in').length;
        const missedCount = allAppointments.filter(a => a.date === today && a.status === 'missed').length;
        
        // Get recent patient registrations
        const patients = await getAllPatients();
        // Sort by creation date (newest first) and take first 3
        const sortedPatients = patients.sort((a, b) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }).slice(0, 3);
        
        setRecentRegistrations(sortedPatients);
        setStats({
          totalAppointments: todayAppointmentsCount,
          checkedIn: checkedInCount,
          newRegistrations: sortedPatients.length,
          missed: missedCount
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    "checked-in": "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    missed: "bg-red-100 text-red-800",
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-gray-500">Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Reception Dashboard</h1>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span className="text-sm text-muted-foreground">
            {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.totalAppointments}</div>
              <Calendar className="h-6 w-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Checked In</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.checkedIn}</div>
              <CheckSquare className="h-6 w-6 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">New Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.newRegistrations}</div>
              <Users className="h-6 w-6 text-indigo-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Missed Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.missed}</div>
              <X className="h-6 w-6 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Today's Appointments</CardTitle>
            <CardDescription>View and manage patient appointments for today</CardDescription>
          </CardHeader>
          <CardContent>
            {todayAppointments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No appointments scheduled for today.</p>
                <Button variant="outline" className="mt-4">Schedule New Appointment</Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {todayAppointments.map((appointment) => (
                    <TableRow key={appointment._id}>
                      <TableCell>{appointment.patientName}</TableCell>
                      <TableCell>{appointment.time}</TableCell>
                      <TableCell>{appointment.doctor}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[appointment.status]}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {appointment.status === "confirmed" && (
                          <Button size="sm" variant="outline">Check In</Button>
                        )}
                        {appointment.status === "checked-in" && (
                          <Button size="sm" variant="outline">Assign</Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Patient Registrations</CardTitle>
            <CardDescription>New patients registered in the system</CardDescription>
          </CardHeader>
          <CardContent>
            {recentRegistrations.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No recent registrations found.</p>
                <Button variant="outline" className="mt-4">Register New Patient</Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Registration Date</TableHead>
                    <TableHead>Contact Info</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentRegistrations.map((patient) => (
                    <TableRow key={patient._id}>
                      <TableCell>{patient._id.replace('patient_', '')}</TableCell>
                      <TableCell>{patient.name}</TableCell>
                      <TableCell>{new Date(patient.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>{patient.phone}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            <div className="mt-4">
              <Button variant="outline" className="w-full">View All Registrations</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
