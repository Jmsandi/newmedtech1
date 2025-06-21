
import * as React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  Calendar,
  Users,
  ClipboardCheck,
  Search,
  Bell,
  UserPlus,
  DollarSign,
  Clock
} from "lucide-react";

interface ReceptionistSidebarProps {
  isOpen: boolean;
}

export function ReceptionistSidebar({ isOpen }: ReceptionistSidebarProps) {
  // Navigation items for the receptionist
  const mainNavItems = [
    { name: "Dashboard", icon: Home, path: "/receptionist/dashboard" },
    { name: "Appointments", icon: Calendar, path: "/receptionist/appointments" },
    { name: "Patients", icon: Users, path: "/receptionist/patients" },
    { name: "Check-in", icon: ClipboardCheck, path: "/receptionist/check-in" },
  ];
  
  const managementNavItems = [
    { name: "Patient Registration", icon: UserPlus, path: "/receptionist/registration" },
    { name: "Quick Search", icon: Search, path: "/receptionist/search" },
    { name: "Notifications", icon: Bell, path: "/receptionist/notifications" },
    { name: "Billing", icon: DollarSign, path: "/receptionist/billing" },
  ];

  return (
    <aside
      className={cn(
        "bg-white border-r border-gray-200 transition-all duration-300 ease-in-out fixed left-0 top-0 z-20 flex flex-col h-screen",
        isOpen ? "w-64" : "w-[70px]"
      )}
    >
      <div className="flex h-16 items-center border-b border-gray-200 px-4">
        <div className={cn("flex items-center gap-2", !isOpen && "justify-center")}>
          <Calendar className="h-6 w-6 text-blue-600" />
          {isOpen && <span className="font-semibold text-blue-700">MedHub Reception</span>}
        </div>
      </div>
      <nav className="flex-1 overflow-auto py-4">
        <ul className="grid gap-1 px-2">
          <li className="px-3 py-2">
            {isOpen && <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Main Menu</p>}
          </li>
          {mainNavItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-700 hover:bg-gray-100",
                    !isOpen && "justify-center px-0"
                  )
                }
              >
                <item.icon className="h-5 w-5" />
                {isOpen && <span>{item.name}</span>}
              </NavLink>
            </li>
          ))}
          
          <li className="mt-6 px-3 py-2">
            {isOpen && <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Management</p>}
          </li>
          
          {managementNavItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-700 hover:bg-gray-100",
                    !isOpen && "justify-center px-0"
                  )
                }
              >
                <item.icon className="h-5 w-5" />
                {isOpen && <span>{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="border-t border-gray-200 p-4">
        {isOpen && (
          <div className="grid gap-1">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-blue-700 text-white grid place-items-center font-semibold">
                RT
              </div>
              <div className="grid gap-0.5">
                <p className="text-sm font-medium">Receptionist</p>
                <p className="text-xs text-gray-500">Emma Thompson</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
