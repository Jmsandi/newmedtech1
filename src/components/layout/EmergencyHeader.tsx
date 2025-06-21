import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Menu,
  Bell,
  User,
  Settings,
  LogOut,
  Home,
  AlertTriangle
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

interface EmergencyHeaderProps {
  toggleSidebar: () => void;
}

export const EmergencyHeader: React.FC<EmergencyHeaderProps> = ({ toggleSidebar }) => {
  const emergencyManager = { name: "Emergency Manager" };

  return (
    <header className="bg-white border-b border-[#e2e8f0] px-4 py-2 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <Menu size={20} />
        </Button>
        <div className="ml-4 text-lg font-medium hidden md:block text-[#1e293b]">Emergency Team Management</div>
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
            <DropdownMenuLabel>Emergency Alerts</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Code Red: Multi-vehicle accident
            </DropdownMenuItem>
            <DropdownMenuItem>Team Alpha dispatched to location</DropdownMenuItem>
            <DropdownMenuItem>Equipment check scheduled</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-[#dc2626] text-white">
                  {emergencyManager.name?.charAt(0) || "E"}
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:inline-block text-[#1e293b]">{emergencyManager.name}</span>
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
              window.location.href = "/";
            }}>
              <Home className="mr-2 h-4 w-4" />
              <span>Back to Home</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}; 