import React from "react";
import { Outlet } from "react-router-dom";

export const MaternalLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Outlet />
    </div>
  );
}; 