import React from "react";
import { NavLink } from "react-router-dom";
import {
  User,
  Users,
  Calendar,
  FileText,
  Home,
  LogOut,
  ClipboardList,
  Activity,
  FlaskRound,
  MessageSquare,
  Bell,
  Clock,
  Pill,
  Heart,
  Baby
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface DoctorSidebarProps {
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
            ? "bg-[#3b82f6]/10 text-[#2563eb]"
            : "text-[#1e293b] hover:bg-[#3b82f6]/10 hover:text-[#2563eb]"
        )
      }
    >
      {icon}
      {isOpen && <span>{label}</span>}
    </NavLink>
  );
};

export const DoctorSidebar: React.FC<DoctorSidebarProps> = ({ isOpen }) => {
  const handleLogout = () => {
    localStorage.removeItem("hms-doctor");
    window.location.href = "/doctor/login";
  };

  return (
    <aside
      className={cn(
        "bg-white border-r border-[#e2e8f0] h-screen transition-all duration-300 overflow-y-auto fixed left-0 top-0 z-10",
        isOpen ? "w-64" : "w-16"
      )}
    >
      <div className="p-4 flex items-center justify-center border-b border-[#e2e8f0]">
        <img src="/logo.svg" alt="MedHub Logo" className="h-6 w-6" />
        {isOpen && (
          <h1 className="text-xl font-bold ml-2 text-[#2563eb]">Doctor Portal</h1>
        )}
      </div>
      
      <div className="py-4">
        <nav className="px-2 space-y-1">
          <NavItem to="/doctor/dashboard" icon={<Home size={20} />} label="Dashboard" isOpen={isOpen} />
          <NavItem to="/doctor/patients" icon={<Users size={20} />} label="Current Patients" isOpen={isOpen} />
          <NavItem to="/doctor/careplans" icon={<ClipboardList size={20} />} label="Care Plans" isOpen={isOpen} />
          <NavItem to="/doctor/history" icon={<Activity size={20} />} label="Treatment History" isOpen={isOpen} />
          <NavItem to="/doctor/prescriptions" icon={<Pill size={20} />} label="Prescriptions" isOpen={isOpen} />
          <NavItem to="/doctor/lab-results" icon={<FlaskRound size={20} />} label="Lab Results" isOpen={isOpen} />
          <NavItem to="/doctor/records" icon={<FileText size={20} />} label="Patient Records" isOpen={isOpen} />
          <NavItem to="/doctor/schedule" icon={<Calendar size={20} />} label="Schedule" isOpen={isOpen} />
          <NavItem to="/doctor/management" icon={<Users size={20} />} label="Patient Management" isOpen={isOpen} />
          <NavItem to="/doctor/messaging" icon={<MessageSquare size={20} />} label="Messaging" isOpen={isOpen} />
          <NavItem to="/doctor/emergency" icon={<Bell size={20} />} label="Emergency Center" isOpen={isOpen} />
          <NavItem to="/doctor/vitals" icon={<Heart size={20} />} label="Vitals Monitoring" isOpen={isOpen} />
          <NavItem to="/doctor/maternal-health" icon={<Baby size={20} />} label="Maternal Health" isOpen={isOpen} />
        </nav>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#e2e8f0]">
        <Button
          variant="ghost"
          className={cn(
            "w-full flex items-center justify-center gap-2 text-[#1e293b] hover:bg-[#3b82f6]/10 hover:text-[#2563eb]",
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
