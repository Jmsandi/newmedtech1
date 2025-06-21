
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { ReceptionistSidebar } from "./ReceptionistSidebar";
import { ReceptionistHeader } from "./ReceptionistHeader";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export const ReceptionistLayout: React.FC = () => {
  const { isAuthenticated, loading } = useAuth("receptionist");
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  
  // If not authenticated, redirect to login
  React.useEffect(() => {
    if (!loading && !isAuthenticated) {
      toast({
        title: "Access Denied",
        description: "Please login to access the reception system",
        variant: "destructive",
      });
      navigate("/receptionist/login");
    }
  }, [isAuthenticated, navigate, toast, loading]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="min-h-screen bg-background flex">
      <ReceptionistSidebar isOpen={sidebarOpen} />
      <div className={`flex flex-col flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-[70px]'}`}>
        <ReceptionistHeader toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
