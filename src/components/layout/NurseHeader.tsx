
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Bell, LogOut, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface NurseHeaderProps {
  toggleSidebar: () => void;
}

export const NurseHeader: React.FC<NurseHeaderProps> = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nurseData, setNurseData] = useState<{ name: string }>({ name: "Nurse" });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Get nurse data from localStorage
    const nurseInfo = localStorage.getItem("hms-nurse");
    if (nurseInfo) {
      setNurseData(JSON.parse(nurseInfo));
    }

    return () => {
      clearInterval(timer);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("hms-nurse");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/nurse/login");
  };

  return (
    <header className="bg-[#2c3e50] text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="mr-4 text-white hover:bg-[#34495e]"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold">Nurse's Interface</h1>
        </div>

        <div className="flex items-center">
          <div className="mr-4 flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            <span className="text-sm hidden md:inline">
              {currentTime.toLocaleTimeString()}
            </span>
          </div>
          
          <Button variant="ghost" size="icon" className="mr-2 text-white hover:bg-[#34495e]">
            <Bell className="h-5 w-5" />
          </Button>
          
          <div className="hidden md:block mr-4">
            <span className="text-sm font-medium">{nurseData.name}</span>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="text-white hover:bg-[#34495e]"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
