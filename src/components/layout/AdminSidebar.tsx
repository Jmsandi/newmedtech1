import React from "react";
import { NavLink } from "react-router-dom";
import {
  User,
  Users,
  Calendar,
  Settings,
  Home,
  LogOut,
  UserRound,
  FileText,
  Activity,
  FlaskRound,
  TestTube,
  Pill,
  Building2,
  Hospital
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface AdminSidebarProps {
  isOpen: boolean;
}

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isOpen: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, isOpen }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
          isActive
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
        )
      }
    >
      {icon}
      {isOpen && <span>{label}</span>}
    </NavLink>
  );
};

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen }) => {
  const handleLogout = () => {
    localStorage.removeItem("hms-user");
    window.location.href = "/login";
  };

  return (
    <aside
      className={cn(
        "bg-sidebar border-r border-sidebar-border h-screen transition-all duration-300 overflow-y-auto fixed left-0 top-0 z-10",
        isOpen ? "w-64" : "w-16"
      )}
    >
      <div className="p-4 flex items-center justify-center border-b border-sidebar-border">
        <img src="/logo.svg" alt="MedHub Logo" className="h-6 w-6" />
        {isOpen && (
          <h1 className="text-xl font-bold ml-2 text-hospital-primary">MedHub</h1>
        )}
      </div>
      
      <div className="py-4">
        <nav className="px-2 space-y-1">
          <NavItem to="/admin/dashboard" icon={<Home size={20} />} label="Dashboard" isOpen={isOpen} />
          <NavItem to="/admin/patients" icon={<Users size={20} />} label="Patients" isOpen={isOpen} />
          <NavItem to="/admin/doctors" icon={<User size={20} />} label="Doctors" isOpen={isOpen} />
          <NavItem to="/admin/nurses" icon={<UserRound size={20} />} label="Nurses" isOpen={isOpen} />
          <NavItem to="/admin/staff" icon={<Users size={20} />} label="Staff" isOpen={isOpen} />
          <NavItem to="/admin/appointments" icon={<Calendar size={20} />} label="Appointments" isOpen={isOpen} />
          <NavItem to="/admin/careplans" icon={<FileText size={20} />} label="Care Plans" isOpen={isOpen} />
          <NavItem to="/admin/health-admin" icon={<Activity size={20} />} label="Health Admin" isOpen={isOpen} />
          <NavItem to="/admin/laboratory" icon={<FlaskRound size={20} />} label="Laboratory" isOpen={isOpen} />
          <NavItem to="/admin/lab-technicians" icon={<TestTube size={20} />} label="Lab Technicians" isOpen={isOpen} />
          <NavItem to="/admin/locations" icon={<Building2 size={20} />} label="Locations" isOpen={isOpen} />
          <NavItem to="/admin/hospital-registration" icon={<Hospital size={20} />} label="Register Hospital" isOpen={isOpen} />
          <NavItem to="/admin/settings" icon={<Settings size={20} />} label="Settings" isOpen={isOpen} />
        </nav>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className={cn(
            "w-full flex items-center justify-center gap-2 text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
            !isOpen && "px-0"
          )}
          onClick={handleLogout}
        >
          <LogOut size={20} />
          {isOpen && <span>Logout</span>}
        </Button>
      </div>
    </aside>
  );
};
