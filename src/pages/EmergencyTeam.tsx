import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Users, 
  Activity, 
  AlertTriangle, 
  Heart, 
  TrendingUp,
  UserPlus,
  Settings,
  MapPin,
  Clock,
  Phone,
  Stethoscope,
  Truck,
  Award
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getEmergencyTeamStats } from "@/services/database/emergency-team";

// Import existing components
import { EmergencyTeamDashboard } from "@/components/emergency-team/EmergencyTeamDashboard";

const EmergencyTeam = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalTeams: 0,
    activeTeams: 0,
    totalNurseAssignments: 0,
    totalDoctorAssignments: 0,
    totalOutbreakResponses: 0,
    totalMaternalResponses: 0,
    totalDeployments: 0,
    activeDeployments: 0,
    averageResponseTime: 0
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const emergencyStats = await getEmergencyTeamStats();
        setStats(emergencyStats);
      } catch (error) {
        console.error('Error loading emergency team stats:', error);
        toast({
          title: "Error",
          description: "Failed to load emergency team statistics",
          variant: "destructive"
        });
      }
    };

    loadStats();
  }, [toast]);

  const refreshStats = async () => {
    try {
      const emergencyStats = await getEmergencyTeamStats();
      setStats(emergencyStats);
    } catch (error) {
      console.error('Error refreshing stats:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Shield className="h-8 w-8 text-red-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Emergency Team Management
                  </h1>
                  <p className="text-gray-600">
                    Coordinate emergency response teams for outbreak control and maternal health emergencies
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.activeTeams}</div>
                    <div className="text-gray-500">Active Teams</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats.activeDeployments}</div>
                    <div className="text-gray-500">Active Deployments</div>
                  </div>
                </div>
                <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  System Active
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Teams</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalTeams}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Staff Assigned</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalNurseAssignments + stats.totalDoctorAssignments}
                  </p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <UserPlus className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Responses</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalOutbreakResponses + stats.totalMaternalResponses}
                  </p>
                </div>
                <div className="p-2 bg-red-100 rounded-lg">
                  <Activity className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.averageResponseTime}m</p>
                </div>
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Content */}
        <div className="space-y-6">
          <EmergencyTeamDashboard stats={stats} onRefresh={refreshStats} />
        </div>
      </div>
    </div>
  );
};

export default EmergencyTeam; 