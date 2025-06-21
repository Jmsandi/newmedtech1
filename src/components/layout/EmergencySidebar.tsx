import React from "react";
import { NavLink } from "react-router-dom";
import {
  BarChart3,
  AlertTriangle,
  Users,
  Truck,
  Radio,
  MapPin,
  FileText,
  Activity,
  Clock,
  Shield,
  Phone,
  Home,
  Zap,
  Heart,
  Award,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface EmergencySidebarProps {
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
            ? "bg-[#dc2626]/10 text-[#dc2626]"
            : "text-[#1e293b] hover:bg-[#dc2626]/10 hover:text-[#dc2626]"
        )
      }
    >
      {icon}
      {isOpen && <span>{label}</span>}
    </NavLink>
  );
};

export const EmergencySidebar: React.FC<EmergencySidebarProps> = ({ isOpen }) => {
  const handleLogout = () => {
    window.location.href = "/";
  };

  return (
    <aside
      className={cn(
        "bg-white border-r border-[#e2e8f0] h-screen transition-all duration-300 overflow-y-auto fixed left-0 top-0 z-10",
        isOpen ? "w-64" : "w-16"
      )}
    >
      <div className="p-4 flex items-center justify-center border-b border-[#e2e8f0]">
        <div className="p-2 bg-red-100 rounded-lg">
          <Shield className="h-6 w-6 text-red-600" />
        </div>
        {isOpen && (
          <h1 className="text-xl font-bold ml-2 text-[#dc2626]">Emergency Portal</h1>
        )}
      </div>
      
      <div className="py-4">
        <nav className="px-2 space-y-1">
          {/* Emergency Team Management Section */}
          <NavItem to="/emergency/dashboard" icon={<BarChart3 size={20} />} label="Dashboard" isOpen={isOpen} />
          <NavItem to="/emergency/teams" icon={<Shield size={20} />} label="Teams" isOpen={isOpen} />
          <NavItem to="/emergency/staff" icon={<Users size={20} />} label="Staff" isOpen={isOpen} />
          <NavItem to="/emergency/outbreak" icon={<AlertTriangle size={20} />} label="Outbreak" isOpen={isOpen} />
          <NavItem to="/emergency/maternal" icon={<Heart size={20} />} label="Maternal" isOpen={isOpen} />
          <NavItem to="/emergency/deployments" icon={<Truck size={20} />} label="Deployments" isOpen={isOpen} />
          <NavItem to="/emergency/training" icon={<Award size={20} />} label="Training" isOpen={isOpen} />
          <NavItem to="/emergency/analytics" icon={<TrendingUp size={20} />} label="Analytics" isOpen={isOpen} />
          
          {/* Divider */}
          {isOpen && <div className="border-t border-[#e2e8f0] my-2"></div>}
          
          {/* Emergency Operations Section */}
          <NavItem to="/emergency/incidents" icon={<AlertTriangle size={20} />} label="Active Incidents" isOpen={isOpen} />
          <NavItem to="/emergency/vehicles" icon={<Truck size={20} />} label="Vehicles & Equipment" isOpen={isOpen} />
          <NavItem to="/emergency/dispatch" icon={<Radio size={20} />} label="Dispatch Center" isOpen={isOpen} />
          <NavItem to="/emergency/locations" icon={<MapPin size={20} />} label="Emergency Locations" isOpen={isOpen} />
          <NavItem to="/emergency/protocols" icon={<FileText size={20} />} label="Response Protocols" isOpen={isOpen} />
          <NavItem to="/emergency/monitoring" icon={<Activity size={20} />} label="Real-time Monitoring" isOpen={isOpen} />
          <NavItem to="/emergency/response-times" icon={<Clock size={20} />} label="Response Times" isOpen={isOpen} />
          <NavItem to="/emergency/communications" icon={<Phone size={20} />} label="Communications" isOpen={isOpen} />
          <NavItem to="/emergency/alerts" icon={<Zap size={20} />} label="Alert System" isOpen={isOpen} />
        </nav>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#e2e8f0]">
        <Button
          variant="ghost"
          className={cn(
            "w-full flex items-center justify-center gap-2 text-[#1e293b] hover:bg-[#dc2626]/10 hover:text-[#dc2626]",
            !isOpen && "px-0"
          )}
          onClick={handleLogout}
        >
          <Home size={20} />
          {isOpen && <span>Back to Home</span>}
        </Button>
      </div>
    </aside>
  );
}; 