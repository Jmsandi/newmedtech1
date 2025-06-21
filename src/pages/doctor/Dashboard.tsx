
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Users, 
  Calendar, 
  FileText, 
  ClipboardList, 
  FlaskRound, 
  ArrowRight, 
  Bell 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const DoctorDashboard: React.FC = () => {
  const doctorData = JSON.parse(localStorage.getItem("hms-doctor") || '{"name":"Dr. Smith"}');
  
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1e293b]">Welcome, {doctorData.name}</h1>
          <p className="text-sm text-gray-500">{currentDate}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Bell className="mr-2 h-4 w-4" />
            Alerts
          </Button>
          <Button className="bg-[#2563eb] hover:bg-[#1d4ed8]" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6 flex flex-col items-center">
            <div className="rounded-full bg-[#3b82f6]/10 p-3 mb-4">
              <Users className="h-6 w-6 text-[#2563eb]" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500">Total Patients</p>
              <h3 className="text-3xl font-bold text-[#1e293b]">24</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col items-center">
            <div className="rounded-full bg-[#22c55e]/10 p-3 mb-4">
              <Calendar className="h-6 w-6 text-[#22c55e]" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500">Appointments Today</p>
              <h3 className="text-3xl font-bold text-[#1e293b]">8</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col items-center">
            <div className="rounded-full bg-[#eab308]/10 p-3 mb-4">
              <FileText className="h-6 w-6 text-[#eab308]" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500">Care Plans</p>
              <h3 className="text-3xl font-bold text-[#1e293b]">16</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col items-center">
            <div className="rounded-full bg-[#dc2626]/10 p-3 mb-4">
              <FlaskRound className="h-6 w-6 text-[#dc2626]" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500">Pending Lab Results</p>
              <h3 className="text-3xl font-bold text-[#1e293b]">5</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Patients */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-xl text-[#1e293b]">Current Patients</CardTitle>
            <CardDescription>Your assigned patients requiring attention</CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="text-[#2563eb]">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">James Wilson</TableCell>
                <TableCell>Hypertension</TableCell>
                <TableCell>
                  <Badge className="bg-[#eab308]">Monitoring</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">3 hours ago</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">View</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Maria Garcia</TableCell>
                <TableCell>Diabetes Type 2</TableCell>
                <TableCell>
                  <Badge className="bg-[#22c55e]">Stable</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">1 day ago</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">View</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Robert Chen</TableCell>
                <TableCell>Post-op Recovery</TableCell>
                <TableCell>
                  <Badge className="bg-[#dc2626]">Critical</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">30 minutes ago</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">View</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Emma Johnson</TableCell>
                <TableCell>Pregnancy (28 weeks)</TableCell>
                <TableCell>
                  <Badge className="bg-[#22c55e]">Stable</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">2 days ago</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">View</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">David Kim</TableCell>
                <TableCell>Asthma</TableCell>
                <TableCell>
                  <Badge className="bg-[#eab308]">Monitoring</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">5 hours ago</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">View</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Today's Schedule */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-xl text-[#1e293b]">Today's Schedule</CardTitle>
            <CardDescription>Your appointments for today</CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="text-[#2563eb]">
            Full Schedule
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { time: '09:00 AM', patient: 'James Wilson', type: 'Follow-up', status: 'Upcoming' },
              { time: '10:30 AM', patient: 'Emma Johnson', type: 'Prenatal Checkup', status: 'Upcoming' },
              { time: '11:30 AM', patient: 'Robert Chen', type: 'Post-op Review', status: 'Urgent' },
              { time: '02:00 PM', patient: 'Maria Garcia', type: 'Diabetes Management', status: 'Upcoming' },
              { time: '03:30 PM', patient: 'David Kim', type: 'Asthma Review', status: 'Upcoming' }
            ].map((appointment, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-[#e2e8f0] bg-white">
                <div className="flex items-center gap-4">
                  <div className="text-center w-20">
                    <span className="text-sm font-semibold text-[#2563eb]">{appointment.time}</span>
                  </div>
                  <div>
                    <p className="font-medium text-[#1e293b]">{appointment.patient}</p>
                    <p className="text-sm text-gray-500">{appointment.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={appointment.status === 'Urgent' ? "bg-[#dc2626]" : "bg-[#3b82f6]"}>
                    {appointment.status}
                  </Badge>
                  <Button variant="outline" size="sm">Details</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorDashboard;
