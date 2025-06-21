
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Menu,
  Bell,
  User,
  Settings,
  LogOut
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface DoctorHeaderProps {
  toggleSidebar: () => void;
}

export const DoctorHeader: React.FC<DoctorHeaderProps> = ({ toggleSidebar }) => {
  const doctor = JSON.parse(localStorage.getItem("hms-doctor") || '{"name":"Dr. Smith"}');

  return (
    <header className="bg-white border-b border-[#e2e8f0] px-4 py-2 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <Menu size={20} />
        </Button>
        <div className="ml-4 text-lg font-medium hidden md:block text-[#1e293b]">Doctor Dashboard</div>
      </div>
      
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#dc2626] rounded-full"></span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>New patient assigned</DropdownMenuItem>
            <DropdownMenuItem>Urgent lab results available</DropdownMenuItem>
            <DropdownMenuItem>Care plan update required</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-[#3b82f6] text-white">
                  {doctor.name?.charAt(0) || "D"}
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:inline-block text-[#1e293b]">{doctor.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => {
              localStorage.removeItem("hms-doctor");
              window.location.href = "/doctor/login";
            }}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
