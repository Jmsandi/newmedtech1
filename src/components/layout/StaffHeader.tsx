import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Bell, LogOut, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface StaffHeaderProps {
  toggleSidebar: () => void;
}

export const StaffHeader: React.FC<StaffHeaderProps> = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [staffData, setStaffData] = useState<{ name: string }>({ name: "Staff Member" });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Get staff data from localStorage
    const staffInfo = localStorage.getItem("hms-staff");
    if (staffInfo) {
      setStaffData(JSON.parse(staffInfo));
    }

    return () => {
      clearInterval(timer);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("hms-staff");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/login");
  };

  return (
    <header className="bg-[#f97316] text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="mr-4 text-white hover:bg-[#ea580c]"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold">Staff Portal</h1>
        </div>

        <div className="flex items-center">
          <div className="mr-4 flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            <span className="text-sm hidden md:inline">
              {currentTime.toLocaleTimeString()}
            </span>
          </div>
          
          <Button variant="ghost" size="icon" className="mr-2 text-white hover:bg-[#ea580c]">
            <Bell className="h-5 w-5" />
          </Button>
          
          <div className="hidden md:block mr-4">
            <span className="text-sm font-medium">{staffData.name}</span>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="text-white hover:bg-[#ea580c]"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default StaffHeader; 