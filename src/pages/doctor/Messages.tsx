
import React from "react";
import { MessageCenter } from "@/components/messaging/MessageCenter";

const DoctorMessages: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1e293b]">Messages</h1>
      <MessageCenter />
    </div>
  );
};

export default DoctorMessages;
