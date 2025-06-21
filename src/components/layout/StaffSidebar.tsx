import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  Calendar,
  ClipboardList,
  FileText,
  Users,
  Bell,
  Clock
} from "lucide-react";

const sidebarItems = [
  { icon: Home, label: "Dashboard", href: "/staff/dashboard" },
  { icon: Calendar, label: "Schedule", href: "/staff/schedule" },
  { icon: ClipboardList, label: "Tasks", href: "/staff/tasks" },
  { icon: FileText, label: "Reports", href: "/staff/reports" },
  { icon: Users, label: "Directory", href: "/staff/directory" },
  { icon: Bell, label: "Notifications", href: "/staff/notifications" },
];

interface StaffSidebarProps {
  isOpen: boolean;
}

export const StaffSidebar: React.FC<StaffSidebarProps> = ({ isOpen }) => {
  const location = useLocation();
  
  // Get staff data from localStorage
  const staffInfoString = localStorage.getItem("hms-staff");
  const staffInfo = staffInfoString ? JSON.parse(staffInfoString) : { name: "Staff Member" };

  return (
    <div
      className={cn(
        "bg-white border-r border-gray-200 h-screen transition-all duration-300 overflow-hidden fixed left-0 top-0 z-10 shadow-lg",
        isOpen ? "w-64" : "w-20"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-center">
            {isOpen ? (
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-[#f97316] flex items-center justify-center text-white font-bold text-lg mx-auto mb-2">
                  {staffInfo.name.charAt(0)}
                </div>
                <h2 className="text-lg font-semibold text-[#1e293b] truncate">{staffInfo.name}</h2>
                <p className="text-sm text-gray-500">Staff Member</p>
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#f97316] flex items-center justify-center text-white font-bold">
                {staffInfo.name.charAt(0)}
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="space-y-1 px-3">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center py-2.5 px-3 rounded-lg text-gray-600 transition-all duration-200 group",
                  location.pathname === item.href
                    ? "bg-[#f97316]/10 text-[#f97316] font-medium shadow-sm"
                    : "hover:bg-gray-50 hover:text-[#1e293b]",
                  !isOpen && "justify-center"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5 flex-shrink-0",
                  !isOpen ? "mx-auto" : "mr-3",
                  location.pathname === item.href ? "text-[#f97316]" : "text-gray-500 group-hover:text-[#1e293b]"
                )} />
                {isOpen && (
                  <span className="text-sm font-medium truncate">{item.label}</span>
                )}
              </Link>
            ))}
          </div>
        </nav>
        
        {/* Footer */}
        <div className="p-3 border-t border-gray-100">
          <div className={cn(
            "flex items-center py-2 px-3 bg-[#f8f9fa] rounded-lg text-gray-600",
            !isOpen && "justify-center"
          )}>
            <Clock className={cn("h-4 w-4 text-[#f97316]", !isOpen ? "mx-auto" : "mr-3")} />
            {isOpen && <span className="text-xs font-medium">Shift: 8:00 AM - 4:00 PM</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffSidebar; 