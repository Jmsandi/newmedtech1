
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, Bell, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LabTechHeaderProps {
  toggleSidebar: () => void;
}

export const LabTechHeader: React.FC<LabTechHeaderProps> = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Get lab technician info from localStorage
  const labTechInfo = React.useMemo(() => {
    const data = localStorage.getItem("hms-labtech");
    return data ? JSON.parse(data) : { name: "Lab Technician" };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("hms-labtech");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
    navigate("/labtech/login");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-4 sm:px-6 shadow-sm">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>
      <div className="flex-1">
        <h1 className="text-lg font-semibold text-gray-800">MedTech Care Lab Dashboard</h1>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          <span className="sr-only">Notifications</span>
        </Button>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
        <div className="hidden md:flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-indigo-600 text-white grid place-items-center font-semibold">
            {labTechInfo.name.charAt(0)}
          </div>
          <span className="text-sm font-medium">
            {labTechInfo.name}
          </span>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          <span className="sr-only">Logout</span>
        </Button>
      </div>
    </header>
  );
};
