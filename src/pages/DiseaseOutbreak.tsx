import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  AlertTriangle, 
  Users, 
  MessageSquare, 
  MapPin, 
  Info, 
  Shield,
  TrendingUp,
  Bell,
  UserPlus,
  TestTube,
  Database,
  FileText,
  Activity,
  Search
} from "lucide-react";
import { CaseReporting } from "@/components/outbreak/CaseReporting";
import { SymptomChecker } from "@/components/outbreak/SymptomChecker";
import { ContactTracing } from "@/components/outbreak/ContactTracing";
import { OutbreakDashboard } from "@/components/outbreak/OutbreakDashboard";
import { PublicHealthInfo } from "@/components/outbreak/PublicHealthInfo";
import { VaccinationTracker } from "@/components/outbreak/VaccinationTracker";
import { PredictiveAnalytics } from "@/components/outbreak/PredictiveAnalytics";
import { DataManagement } from "@/components/outbreak/DataManagement";
import { NurseOutbreakManagement } from "@/components/outbreak/NurseOutbreakManagement";
import { LabTechOutbreakManagement } from "@/components/outbreak/LabTechOutbreakManagement";

const navigationItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: TrendingUp,
    description: "Overview and analytics"
  },
  {
    id: "nurses",
    label: "Nurses",
    icon: UserPlus,
    description: "Nurse assignments and management"
  },
  {
    id: "labtechs",
    label: "Lab Techs",
    icon: TestTube,
    description: "Lab technician coordination"
  },
  {
    id: "data",
    label: "Data",
    icon: Database,
    description: "Data management and analysis"
  },
  {
    id: "reporting",
    label: "Reporting",
    icon: FileText,
    description: "Case reporting and documentation"
  },
  {
    id: "symptoms",
    label: "Symptoms",
    icon: Activity,
    description: "Symptom tracking and analysis"
  },
  {
    id: "tracing",
    label: "Tracing",
    icon: Users,
    description: "Contact tracing operations"
  },
  {
    id: "maps",
    label: "Maps",
    icon: MapPin,
    description: "Geographic outbreak mapping"
  },
  {
    id: "info",
    label: "Info",
    icon: Info,
    description: "Public health information"
  },
  {
    id: "vaccination",
    label: "Vaccines",
    icon: Shield,
    description: "Vaccination tracking and management"
  }
];

const DiseaseOutbreak = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <OutbreakDashboard />
            <PredictiveAnalytics />
          </div>
        );
      case "nurses":
        return <NurseOutbreakManagement />;
      case "labtechs":
        return <LabTechOutbreakManagement />;
      case "data":
        return <DataManagement />;
      case "reporting":
        return <CaseReporting />;
      case "symptoms":
        return <SymptomChecker />;
      case "tracing":
        return <ContactTracing />;
      case "maps":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Outbreak Heatmap</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Interactive outbreak map will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        );
      case "info":
        return <PublicHealthInfo />;
      case "vaccination":
        return <VaccinationTracker />;
      default:
        return <OutbreakDashboard />;
    }
  };

  const activeItem = navigationItems.find(item => item.id === activeTab);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg border-r flex flex-col">
        {/* Sidebar Header */}
        <div className="p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Outbreak Control
              </h2>
              <p className="text-sm text-gray-600">
                Response Center
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-colors",
                  isActive
                    ? "bg-red-50 text-red-700 border border-red-200"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Icon className={cn(
                  "h-5 w-5",
                  isActive ? "text-red-600" : "text-gray-500"
                )} />
                <div className="flex-1">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {item.description}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t">
          <div className="flex items-center justify-between">
            <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
              System Active
            </div>
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {activeItem?.label || "Dashboard"}
                </h1>
                <p className="text-gray-600 mt-1">
                  {activeItem?.description || "Overview and analytics"}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                <Button variant="outline" size="sm">
                  <Bell className="h-4 w-4 mr-2" />
                  Alerts
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default DiseaseOutbreak;
