import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, AlertTriangle, TrendingUp, MapPin, Plus, Activity, Heart, Calendar, ArrowLeft, User, BarChart3, Database, UserPlus, Shield, AlertCircle, PieChart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PatientRegistration } from "@/components/maternal/PatientRegistration";
import { RiskAnalysis } from "@/components/maternal/RiskAnalysis";
import { EmergencyResponse } from "@/components/maternal/EmergencyResponse";
import { Analytics } from "@/components/maternal/Analytics";
import { PatientManagement } from "@/components/maternal/PatientManagement";
import { getMaternalMortalityStats } from "@/services/database/maternal-mortality";
import { clearAndReinitializeDatabase } from "@/services/database";
import { DataManagement } from "@/components/maternal/DataManagement";
import { cn } from "@/lib/utils";

const MaternalMortality = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [selectedPatientId, setSelectedPatientId] = useState<string | undefined>(undefined);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPatients: 0,
    highRiskPatients: 0,
    activeAlerts: 0,
    mortalityRate: 0
  });

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "patient-management", label: "Patient Management", icon: Users },
    { id: "data", label: "Data", icon: Database },
    { id: "registration", label: "Registration", icon: UserPlus },
    { id: "risk-analysis", label: "Risk Analysis", icon: Shield },
    { id: "emergency", label: "Emergency Response", icon: AlertCircle },
    { id: "analytics", label: "Analytics", icon: PieChart },
  ];

  useEffect(() => {
    const loadStats = async () => {
      try {
        const mortalityStats = await getMaternalMortalityStats();
        setStats({
          totalPatients: mortalityStats.totalPatients,
          highRiskPatients: mortalityStats.highRiskPatients,
          activeAlerts: mortalityStats.activeAlerts,
          mortalityRate: mortalityStats.mortalityRate
        });
      } catch (error) {
        console.error('Error loading maternal mortality stats:', error);
      }
    };

    loadStats();
  }, []);

  const handleViewPatient = (patientId: string) => {
    setSelectedPatientId(patientId);
    setActiveSection("patient-management");
  };

  const handleRefreshData = async () => {
    try {
      await clearAndReinitializeDatabase();
      // Reload stats after refresh
      const mortalityStats = await getMaternalMortalityStats();
      setStats({
        totalPatients: mortalityStats.totalPatients,
        highRiskPatients: mortalityStats.highRiskPatients,
        activeAlerts: mortalityStats.activeAlerts,
        mortalityRate: mortalityStats.mortalityRate
      });
      console.log('Database refreshed with new sample data');
    } catch (error) {
      console.error('Error refreshing database:', error);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-4">
            {/* Quick Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalPatients.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    Active registrations
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">High Risk Cases</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-500">{stats.highRiskPatients}</div>
                  <p className="text-xs text-muted-foreground">
                    Requires immediate attention
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Emergency Alerts</CardTitle>
                  <Activity className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-500">{stats.activeAlerts}</div>
                  <p className="text-xs text-muted-foreground">
                    Active emergencies
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Mortality Rate</CardTitle>
                  <Heart className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">{stats.mortalityRate}%</div>
                  <p className="text-xs text-muted-foreground">
                    Per 100,000 births
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Risk Clusters
                  </CardTitle>
                  <CardDescription>
                    Geographic distribution of high-risk areas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Central District</span>
                      <Badge variant="destructive">High Risk</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Northern Region</span>
                      <Badge variant="outline">Medium Risk</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Eastern Area</span>
                      <Badge variant="secondary">Low Risk</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Recent Activities
                  </CardTitle>
                  <CardDescription>
                    Latest updates and interventions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <div className="text-sm">
                        <p className="font-medium">Emergency referral completed</p>
                        <p className="text-muted-foreground">Patient ID: MP-2024-001</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <div className="text-sm">
                        <p className="font-medium">High-risk pregnancy detected</p>
                        <p className="text-muted-foreground">ANC visit flagged for review</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="text-sm">
                        <p className="font-medium">Successful delivery recorded</p>
                        <p className="text-muted-foreground">Mother and baby healthy</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case "patient-management":
        return <PatientManagement selectedPatientId={selectedPatientId} />;
      case "data":
        return <DataManagement onViewPatient={handleViewPatient} />;
      case "registration":
        return <PatientRegistration />;
      case "risk-analysis":
        return <RiskAnalysis />;
      case "emergency":
        return <EmergencyResponse />;
      case "analytics":
        return <Analytics />;
      default:
        return <div>Section not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => navigate("/admin/dashboard")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Admin
              </Button>
              <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                  <Heart className="h-8 w-8 text-red-500" />
                  Maternal Mortality Prevention
                </h1>
                <p className="text-muted-foreground">
                  Comprehensive system for tracking, preventing, and responding to maternal health risks
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Registration
              </Button>
              <Button variant="outline" onClick={handleRefreshData}>
                Refresh Sample Data
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout with Sidebar */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r min-h-[calc(100vh-80px)]">
          <div className="p-4">
            <nav className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={cn(
                      "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors",
                      activeSection === item.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-gray-100 text-gray-700"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default MaternalMortality;
