
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { LabTechSidebar } from "./LabTechSidebar";
import { LabTechHeader } from "./LabTechHeader";
import { useToast } from "@/hooks/use-toast";

// Check if lab technician is authenticated
const useAuth = () => {
  // Check if there's a lab technician in localStorage
  const isAuthenticated = localStorage.getItem("hms-labtech") !== null;
  return { isAuthenticated };
};

export const LabTechLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  
  // If not authenticated, redirect to lab technician login
  React.useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Access Denied",
        description: "Please login to access the lab technician dashboard",
        variant: "destructive",
      });
      navigate("/labtech/login");
    }
  }, [isAuthenticated, navigate, toast]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (!isAuthenticated) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex">
      <LabTechSidebar isOpen={sidebarOpen} />
      <div className={`flex flex-col flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-[70px]'}`}>
        <LabTechHeader toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
