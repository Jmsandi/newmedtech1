import * as React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Beaker,
  ClipboardCheck,
  FileBarChart,
  FileText,
  Home,
  MessageSquare,
  TestTube,
  Search,
  Microscope,
  CheckSquare,
  Heart
} from "lucide-react";

interface LabTechSidebarProps {
  isOpen: boolean;
}

export function LabTechSidebar({ isOpen }: LabTechSidebarProps) {
  // Navigation items for the lab technician
  const mainNavItems = [
    { name: "Dashboard", icon: Home, path: "/labtech/dashboard" },
    { name: "Test Requests", icon: ClipboardCheck, path: "/labtech/test-requests" },
    { name: "Sample Tracking", icon: Search, path: "/labtech/sample-tracking" },
  ];
  
  const managementNavItems = [
    { name: "Result Entry", icon: Microscope, path: "/labtech/result-entry" },
    { name: "Maternal Lab Tests", icon: Heart, path: "/labtech/maternal-lab-tests" },
    { name: "Verification", icon: CheckSquare, path: "/labtech/verification" },
    { name: "Reports", icon: FileBarChart, path: "/labtech/reports" },
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
          <Beaker className="h-6 w-6 text-indigo-600" />
          {isOpen && <span className="font-semibold text-indigo-700">MedTech Care Lab</span>}
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
                      ? "bg-indigo-50 text-indigo-700 font-medium"
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
                      ? "bg-indigo-50 text-indigo-700 font-medium"
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
              <div className="h-8 w-8 rounded-full bg-indigo-700 text-white grid place-items-center font-semibold">
                LT
              </div>
              <div className="grid gap-0.5">
                <p className="text-sm font-medium">Lab Technician</p>
                <p className="text-xs text-gray-500">MedTech Care Lab</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
