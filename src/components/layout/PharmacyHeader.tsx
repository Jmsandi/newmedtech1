import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Menu,
  Bell,
  User,
  Settings,
  LogOut,
  Home
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

interface PharmacyHeaderProps {
  toggleSidebar: () => void;
}

export const PharmacyHeader: React.FC<PharmacyHeaderProps> = ({ toggleSidebar }) => {
  const pharmacist = { name: "Pharmacist" };

  return (
    <header className="bg-white border-b border-[#e2e8f0] px-4 py-2 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <Menu size={20} />
        </Button>
        <div className="ml-4 text-lg font-medium hidden md:block text-[#1e293b]">Pharmacy Management System</div>
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
            <DropdownMenuItem>Low stock alert: Amoxicillin</DropdownMenuItem>
            <DropdownMenuItem>New prescription received</DropdownMenuItem>
            <DropdownMenuItem>Order delivery scheduled</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-[#3b82f6] text-white">
                  {pharmacist.name?.charAt(0) || "P"}
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:inline-block text-[#1e293b]">{pharmacist.name}</span>
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