
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { DoctorSidebar } from "./DoctorSidebar";
import { DoctorHeader } from "./DoctorHeader";
import { useToast } from "@/hooks/use-toast";

// Check if doctor is authenticated
const useAuth = () => {
  // Check if there's a doctor in localStorage
  const isAuthenticated = localStorage.getItem("hms-doctor") !== null;
  return { isAuthenticated };
};

export const DoctorLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  
  // If not authenticated, redirect to doctor login
  React.useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Access Denied",
        description: "Please login to access the doctor dashboard",
        variant: "destructive",
      });
      navigate("/doctor/login");
    }
  }, [isAuthenticated, navigate, toast]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (!isAuthenticated) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex">
      <DoctorSidebar isOpen={sidebarOpen} />
      <div className={`flex flex-col flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <DoctorHeader toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
