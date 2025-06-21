
import React from "react";
import { MedicationAdmin } from "@/components/nurse/MedicationAdmin";

const NurseMedications: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#2c3e50]">Medication Administration</h1>
      <MedicationAdmin />
    </div>
  );
};

export default NurseMedications;
