import React from "react";
import { NavLink } from "react-router-dom";
import {
  BarChart3,
  FileText,
  Package,
  Users,
  ShoppingCart,
  Calendar,
  TestTube,
  Stethoscope,
  TrendingUp,
  MessageSquare,
  Activity,
  LogOut,
  Pill,
  Home
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PharmacySidebarProps {
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

export const PharmacySidebar: React.FC<PharmacySidebarProps> = ({ isOpen }) => {
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
        <div className="p-2 bg-blue-100 rounded-lg">
          <Pill className="h-6 w-6 text-blue-600" />
        </div>
        {isOpen && (
          <h1 className="text-xl font-bold ml-2 text-[#2563eb]">Pharmacy Portal</h1>
        )}
      </div>
      
      <div className="py-4">
        <nav className="px-2 space-y-1">
          <NavItem to="/pharmacy/dashboard" icon={<BarChart3 size={20} />} label="Dashboard" isOpen={isOpen} />
          <NavItem to="/pharmacy/prescriptions" icon={<FileText size={20} />} label="Prescriptions" isOpen={isOpen} />
          <NavItem to="/pharmacy/inventory" icon={<Package size={20} />} label="Inventory" isOpen={isOpen} />
          <NavItem to="/pharmacy/patients" icon={<Users size={20} />} label="Patients" isOpen={isOpen} />
          <NavItem to="/pharmacy/orders" icon={<ShoppingCart size={20} />} label="Orders" isOpen={isOpen} />
          <NavItem to="/pharmacy/careplans" icon={<Calendar size={20} />} label="Care Plans" isOpen={isOpen} />
          <NavItem to="/pharmacy/labresults" icon={<TestTube size={20} />} label="Lab Results" isOpen={isOpen} />
          <NavItem to="/pharmacy/treatments" icon={<Stethoscope size={20} />} label="Treatments" isOpen={isOpen} />
          <NavItem to="/pharmacy/reports" icon={<TrendingUp size={20} />} label="Reports" isOpen={isOpen} />
          <NavItem to="/pharmacy/messages" icon={<MessageSquare size={20} />} label="Messages" isOpen={isOpen} />
          <NavItem to="/pharmacy/management" icon={<Activity size={20} />} label="Management" isOpen={isOpen} />
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
          <Home size={20} />
          {isOpen && <span>Back to Home</span>}
        </Button>
      </div>
    </aside>
  );
}; 