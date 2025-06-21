import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { PharmacySidebar } from "./PharmacySidebar";
import { PharmacyHeader } from "./PharmacyHeader";

export const PharmacyLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex">
      <PharmacySidebar isOpen={sidebarOpen} />
      <div className={`flex flex-col flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <PharmacyHeader toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}; 