
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Search } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

const Appointments: React.FC = () => {
  const { toast } = useToast();
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  
  // Mock data for appointments
  const allAppointments = [
    { id: 1, patientName: "John Smith", date: "2025-05-03", time: "09:00 AM", doctor: "Dr. Amanda Chen", type: "General Checkup", status: "confirmed" },
    { id: 2, patientName: "Sara Johnson", date: "2025-05-03", time: "10:15 AM", doctor: "Dr. Robert Wilson", type: "Follow-up", status: "confirmed" },
    { id: 3, patientName: "Michael Brown", date: "2025-05-03", time: "11:30 AM", doctor: "Dr. Amanda Chen", type: "Consultation", status: "confirmed" },
    { id: 4, patientName: "Emily Davis", date: "2025-05-03", time: "01:45 PM", doctor: "Dr. James Miller", type: "Vaccination", status: "confirmed" },
    { id: 5, patientName: "David Wilson", date: "2025-05-03", time: "03:00 PM", doctor: "Dr. Robert Wilson", type: "Routine Checkup", status: "confirmed" },
    { id: 6, patientName: "Linda Martinez", date: "2025-05-04", time: "09:30 AM", doctor: "Dr. James Miller", type: "General Checkup", status: "confirmed" },
    { id: 7, patientName: "Robert Johnson", date: "2025-05-04", time: "11:00 AM", doctor: "Dr. Amanda Chen", type: "Follow-up", status: "confirmed" },
    { id: 8, patientName: "Susan Lee", date: "2025-05-04", time: "02:15 PM", doctor: "Dr. Robert Wilson", type: "Consultation", status: "confirmed" },
  ];
  
  // Doctor schedule mockup data
  const doctorSchedules = [
    { id: 1, name: "Dr. Amanda Chen", department: "General Medicine", availability: [9, 10, 11, 14, 15, 16] },
    { id: 2, name: "Dr. Robert Wilson", department: "Cardiology", availability: [9, 10, 13, 14, 15] },
    { id: 3, name: "Dr. James Miller", department: "Pediatrics", availability: [11, 12, 13, 14] },
  ];

  // Filter appointments for today
  const todayAppointments = allAppointments.filter(appointment => appointment.date === format(new Date(), "yyyy-MM-dd"));
  
  // Filter appointments for selected date
  const selectedDateAppointments = date 
    ? allAppointments.filter(appointment => appointment.date === format(date, "yyyy-MM-dd"))
    : [];

  const handleCheckIn = (id: number) => {
    toast({
      title: "Patient Checked In",
      description: `Appointment #${id} has been marked as checked in.`,
    });
  };

  const handleReschedule = (id: number) => {
    toast({
      title: "Reschedule Requested",
      description: `Appointment #${id} is ready to be rescheduled.`,
    });
  };

  const handleCancel = (id: number) => {
    toast({
      title: "Appointment Cancelled",
      description: `Appointment #${id} has been cancelled.`,
    });
  };

  const statusColors: Record<string, string> = {
    confirmed: "bg-green-100 text-green-800",
    "checked-in": "bg-blue-100 text-blue-800",
    completed: "bg-purple-100 text-purple-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Appointment Management</h1>
        <p className="text-muted-foreground">Schedule and manage patient appointments</p>
      </div>

      <Tabs defaultValue="view">
        <TabsList>
          <TabsTrigger value="view">View Appointments</TabsTrigger>
          <TabsTrigger value="schedule">Schedule Appointment</TabsTrigger>
        </TabsList>
        
        <TabsContent value="view" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Appointments Calendar</CardTitle>
                  <CardDescription>View and manage scheduled appointments</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <div className="flex items-center gap-2 flex-1">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search patient name..." className="w-full" />
                </div>
                <Select>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Filter by doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Doctors</SelectItem>
                    <SelectItem value="amanda-chen">Dr. Amanda Chen</SelectItem>
                    <SelectItem value="robert-wilson">Dr. Robert Wilson</SelectItem>
                    <SelectItem value="james-miller">Dr. James Miller</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {selectedDateAppointments.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient Name</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedDateAppointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell>{appointment.patientName}</TableCell>
                        <TableCell>{appointment.time}</TableCell>
                        <TableCell>{appointment.doctor}</TableCell>
                        <TableCell>{appointment.type}</TableCell>
                        <TableCell>
                          <Badge className={statusColors[appointment.status]}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleCheckIn(appointment.id)}>
                              Check In
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleReschedule(appointment.id)}>
                              Reschedule
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-500" onClick={() => handleCancel(appointment.id)}>
                              Cancel
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No appointments scheduled for this date.</p>
                  <Button className="mt-4">Schedule New Appointment</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Schedule New Appointment</CardTitle>
              <CardDescription>Create a new appointment for a patient</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Patient</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a patient" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="john-smith">John Smith</SelectItem>
                        <SelectItem value="sara-johnson">Sara Johnson</SelectItem>
                        <SelectItem value="michael-brown">Michael Brown</SelectItem>
                        <SelectItem value="emily-davis">Emily Davis</SelectItem>
                        <SelectItem value="new">+ New Patient</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Appointment Type</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Checkup</SelectItem>
                        <SelectItem value="follow-up">Follow-up</SelectItem>
                        <SelectItem value="consultation">Consultation</SelectItem>
                        <SelectItem value="vaccination">Vaccination</SelectItem>
                        <SelectItem value="routine">Routine Checkup</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Doctor</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select doctor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="amanda-chen">Dr. Amanda Chen (General Medicine)</SelectItem>
                        <SelectItem value="robert-wilson">Dr. Robert Wilson (Cardiology)</SelectItem>
                        <SelectItem value="james-miller">Dr. James Miller (Pediatrics)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Available Time Slots</label>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    <Button variant="outline" className="text-sm">9:00 AM</Button>
                    <Button variant="outline" className="text-sm">9:30 AM</Button>
                    <Button variant="outline" className="text-sm">10:00 AM</Button>
                    <Button variant="outline" className="text-sm">10:30 AM</Button>
                    <Button variant="outline" className="text-sm">11:00 AM</Button>
                    <Button variant="outline" className="text-sm">11:30 AM</Button>
                    <Button variant="outline" className="text-sm">1:00 PM</Button>
                    <Button variant="outline" className="text-sm">1:30 PM</Button>
                    <Button variant="outline" className="text-sm">2:00 PM</Button>
                    <Button variant="outline" className="text-sm">2:30 PM</Button>
                    <Button variant="outline" className="text-sm">3:00 PM</Button>
                    <Button variant="outline" className="text-sm">3:30 PM</Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Notes</label>
                  <Input placeholder="Add any additional notes about this appointment" />
                </div>
                
                <div className="flex justify-end pt-4">
                  <Button>Schedule Appointment</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Appointments;
