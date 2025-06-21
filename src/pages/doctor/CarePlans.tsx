
import React from "react";
import { CarePlanManager } from "@/components/doctor/CarePlanManager";

const CarePlans: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1e293b]">Care Plans</h1>
      <CarePlanManager />
    </div>
  );
};

export default CarePlans;
