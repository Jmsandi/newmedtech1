
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { NurseHeader } from "./NurseHeader";
import { NurseSidebar } from "./NurseSidebar";

// Check if nurse is authenticated
const useAuth = () => {
  const isAuthenticated = localStorage.getItem("hms-nurse") !== null;
  return { isAuthenticated };
};

export const NurseLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  
  // If not authenticated, redirect to login
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Access Denied",
        description: "Please login to access the nurse dashboard",
        variant: "destructive",
      });
      navigate("/nurse/login");
    }
  }, [isAuthenticated, navigate, toast]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (!isAuthenticated) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex">
      <NurseSidebar isOpen={sidebarOpen} />
      <div className={`flex flex-col flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <NurseHeader toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
