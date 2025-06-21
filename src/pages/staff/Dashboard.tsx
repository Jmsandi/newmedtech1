import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  ClipboardList, 
  Calendar, 
  Users, 
  FileText, 
  Clock, 
  ArrowRight, 
  Bell 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const StaffDashboard: React.FC = () => {
  const staffData = JSON.parse(localStorage.getItem("hms-staff") || '{"name":"Staff Member"}');
  
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
          <h1 className="text-2xl font-bold text-[#1e293b]">Welcome, {staffData.name}</h1>
          <p className="text-sm text-gray-500">{currentDate}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </Button>
          <Button className="bg-[#f97316] hover:bg-[#ea580c]" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6 flex flex-col items-center">
            <div className="rounded-full bg-[#f97316]/10 p-3 mb-4">
              <ClipboardList className="h-6 w-6 text-[#f97316]" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500">Tasks Completed</p>
              <h3 className="text-3xl font-bold text-[#1e293b]">8</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col items-center">
            <div className="rounded-full bg-[#22c55e]/10 p-3 mb-4">
              <Clock className="h-6 w-6 text-[#22c55e]" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500">Pending Tasks</p>
              <h3 className="text-3xl font-bold text-[#1e293b]">3</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col items-center">
            <div className="rounded-full bg-[#3b82f6]/10 p-3 mb-4">
              <Users className="h-6 w-6 text-[#3b82f6]" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500">Hours Worked</p>
              <h3 className="text-3xl font-bold text-[#1e293b]">6.5</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col items-center">
            <div className="rounded-full bg-[#dc2626]/10 p-3 mb-4">
              <Bell className="h-6 w-6 text-[#dc2626]" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500">Notifications</p>
              <h3 className="text-3xl font-bold text-[#1e293b]">2</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Tasks */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-xl text-[#1e293b]">Today's Tasks</CardTitle>
            <CardDescription>Your assigned tasks and their status</CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="text-[#f97316]">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Time</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Morning facility check</TableCell>
                <TableCell>
                  <Badge className="bg-[#dc2626]">High</Badge>
                </TableCell>
                <TableCell>
                  <Badge className="bg-[#22c55e]">Completed</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">08:00 AM</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">View</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Update patient files</TableCell>
                <TableCell>
                  <Badge className="bg-[#eab308]">Medium</Badge>
                </TableCell>
                <TableCell>
                  <Badge className="bg-[#22c55e]">Completed</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">10:00 AM</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">View</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Equipment maintenance</TableCell>
                <TableCell>
                  <Badge className="bg-[#dc2626]">High</Badge>
                </TableCell>
                <TableCell>
                  <Badge className="bg-[#3b82f6]">In Progress</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">02:00 PM</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">View</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">End-of-day cleanup</TableCell>
                <TableCell>
                  <Badge className="bg-[#eab308]">Medium</Badge>
                </TableCell>
                <TableCell>
                  <Badge className="bg-[#6b7280]">Pending</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">05:00 PM</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">View</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-xl text-[#1e293b]">Recent Activities</CardTitle>
            <CardDescription>Your latest work activities</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { time: '30 minutes ago', activity: 'Completed inventory check for Medical Supplies', type: 'Task Completed' },
              { time: '1 hour ago', activity: 'Updated patient registration forms', type: 'Documentation' },
              { time: '2 hours ago', activity: 'Submitted daily facility report', type: 'Report' },
              { time: '3 hours ago', activity: 'Attended team meeting', type: 'Meeting' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-2">
                <div>
                  <div className="text-sm font-medium">{item.activity}</div>
                  <div className="text-xs text-gray-500">{item.type} • {item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffDashboard; 