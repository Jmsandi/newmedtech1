
import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Appointment {
  id: number;
  patient: string;
  doctor: string;
  time: string;
  status: string;
}

interface RecentAppointmentsProps {
  appointments: Appointment[];
}

export const RecentAppointments: React.FC<RecentAppointmentsProps> = ({ appointments }) => {
  // Function to get the appropriate badge color based on status
  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "completed":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "in progress":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100";
      case "canceled":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case "waiting":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };
  
  // Function to get avatar initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="space-y-4">
      {appointments.length === 0 ? (
        <div className="text-center py-4 text-muted-foreground">
          No appointments scheduled for today.
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-hospital-primary text-white text-xs">
                    {getInitials(appointment.patient)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{appointment.patient}</p>
                  <p className="text-xs text-muted-foreground">
                    {appointment.doctor}, {appointment.time}
                  </p>
                </div>
              </div>
              <Badge
                variant="secondary"
                className={cn(
                  "rounded-full font-normal text-xs",
                  getStatusBadgeVariant(appointment.status)
                )}
              >
                {appointment.status}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
