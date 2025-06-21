import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, Users, Truck, Clock, Shield, Activity, MapPin, Radio
} from "lucide-react";

// Mock data for emergency dashboard metrics
const emergencyMetrics = {
  activeIncidents: 3,
  availableTeams: 8,
  vehiclesDeployed: 5,
  averageResponseTime: 4.2,
  totalTeamMembers: 45,
  equipmentReady: 92
};

// Mock data for active incidents
const activeIncidents = [
  { id: "INC001", type: "Medical Emergency", location: "Downtown Hospital", priority: "High", team: "Alpha Team", status: "En Route", time: "14:23" },
  { id: "INC002", type: "Fire Emergency", location: "Industrial District", priority: "Critical", team: "Bravo Team", status: "On Scene", time: "14:15" },
  { id: "INC003", type: "Traffic Accident", location: "Highway 101", priority: "Medium", team: "Charlie Team", status: "Responding", time: "14:30" }
];

// Mock data for emergency teams
const emergencyTeams = [
  { id: "TEAM001", name: "Alpha Team", status: "Deployed", location: "Downtown Hospital", members: 4, vehicle: "AMB-001" },
  { id: "TEAM002", name: "Bravo Team", status: "On Scene", location: "Industrial District", members: 6, vehicle: "FIRE-001" },
  { id: "TEAM003", name: "Charlie Team", status: "En Route", location: "Highway 101", members: 3, vehicle: "RES-001" },
  { id: "TEAM004", name: "Delta Team", status: "Available", location: "Station 1", members: 5, vehicle: "AMB-002" },
  { id: "TEAM005", name: "Echo Team", status: "Available", location: "Station 2", members: 4, vehicle: "FIRE-002" }
];

const EmergencyDashboard = () => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available': case 'ready':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'deployed': case 'en route': case 'responding':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'on scene': case 'active':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'critical': case 'high':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'medium':
        return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Emergency Command Center</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Incidents</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{emergencyMetrics.activeIncidents}</div>
            <p className="text-xs text-muted-foreground">Requires immediate attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Teams</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{emergencyMetrics.availableTeams}</div>
            <p className="text-xs text-muted-foreground">Ready for deployment</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vehicles Deployed</CardTitle>
            <Truck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{emergencyMetrics.vehiclesDeployed}</div>
            <p className="text-xs text-muted-foreground">Currently in field</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{emergencyMetrics.averageResponseTime} min</div>
            <p className="text-xs text-muted-foreground">-0.3 min from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{emergencyMetrics.totalTeamMembers}</div>
            <p className="text-xs text-muted-foreground">Total personnel</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equipment Ready</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{emergencyMetrics.equipmentReady}%</div>
            <p className="text-xs text-muted-foreground">Operational status</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-red-600" />
              Active Incidents
            </CardTitle>
            <CardDescription>Real-time incident monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeIncidents.map((incident) => (
                <div key={incident.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium">{incident.type}</p>
                      <Badge className={getPriorityColor(incident.priority)}>
                        {incident.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <MapPin className="mr-1 h-3 w-3" />
                      {incident.location}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-sm text-blue-600">{incident.team}</p>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(incident.status)}>
                          {incident.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{incident.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5 text-blue-600" />
              Emergency Teams Status
            </CardTitle>
            <CardDescription>Current team deployment status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {emergencyTeams.map((team) => (
                <div key={team.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium">{team.name}</p>
                      <Badge className={getStatusColor(team.status)}>
                        {team.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <MapPin className="mr-1 h-3 w-3" />
                      {team.location}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-muted-foreground">
                          {team.members} members
                        </span>
                        <span className="text-sm text-blue-600 flex items-center">
                          <Truck className="mr-1 h-3 w-3" />
                          {team.vehicle}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmergencyDashboard; 