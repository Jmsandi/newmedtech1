
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, TrendingUp, Users, Bell, Eye, Filter } from "lucide-react";

export const RiskAnalysis = () => {
  const riskFactors = [
    { factor: "Age > 35 years", weight: 15, present: true },
    { factor: "Previous C-section", weight: 20, present: true },
    { factor: "High blood pressure", weight: 25, present: false },
    { factor: "Diabetes", weight: 30, present: false },
    { factor: "Multiple pregnancies", weight: 35, present: true },
  ];

  const highRiskPatients = [
    {
      id: "MP-2024-001",
      name: "Sarah Johnson",
      age: 38,
      gestationalAge: 32,
      riskScore: 85,
      primaryRisk: "Advanced maternal age + Previous complications",
      lastVisit: "2024-01-15",
      nextDue: "2024-01-29"
    },
    {
      id: "MP-2024-002", 
      name: "Maria Rodriguez",
      age: 29,
      gestationalAge: 28,
      riskScore: 78,
      primaryRisk: "Gestational diabetes + Hypertension",
      lastVisit: "2024-01-14",
      nextDue: "2024-01-28"
    },
    {
      id: "MP-2024-003",
      name: "Jennifer Chen",
      age: 35,
      gestationalAge: 36,
      riskScore: 72,
      primaryRisk: "Multiple pregnancy (twins)",
      lastVisit: "2024-01-16",
      nextDue: "2024-01-23"
    }
  ];

  const getRiskLevel = (score: number) => {
    if (score >= 80) return { level: "Critical", color: "destructive" };
    if (score >= 60) return { level: "High", color: "destructive" };
    if (score >= 40) return { level: "Medium", color: "outline" };
    return { level: "Low", color: "secondary" };
  };

  return (
    <div className="space-y-6">
      {/* Risk Scoring System */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Automated Risk Scoring System
          </CardTitle>
          <CardDescription>
            Machine learning-based risk assessment for early intervention
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h4 className="font-semibold">Risk Factor Weights</h4>
            <div className="space-y-3">
              {riskFactors.map((factor, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${factor.present ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                    <span className="font-medium">{factor.factor}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">Weight: {factor.weight}%</span>
                    <Badge variant={factor.present ? "destructive" : "secondary"}>
                      {factor.present ? "Present" : "Absent"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* High Risk Patients */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                High Risk Patients
              </CardTitle>
              <CardDescription>
                Patients requiring immediate attention and monitoring
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Bell className="mr-2 h-4 w-4" />
                Send Alerts
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {highRiskPatients.map((patient) => {
              const risk = getRiskLevel(patient.riskScore);
              return (
                <div key={patient.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{patient.name}</h4>
                      <p className="text-sm text-muted-foreground">Patient ID: {patient.id}</p>
                    </div>
                    <Badge variant={risk.color as any}>{risk.level} Risk</Badge>
                  </div>
                  
                  <div className="grid gap-2 md:grid-cols-2">
                    <div>
                      <span className="text-sm font-medium">Age: </span>
                      <span className="text-sm">{patient.age} years</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Gestational Age: </span>
                      <span className="text-sm">{patient.gestationalAge} weeks</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Last Visit: </span>
                      <span className="text-sm">{patient.lastVisit}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Next Due: </span>
                      <span className="text-sm text-orange-600">{patient.nextDue}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Risk Score</span>
                      <span className="font-medium">{patient.riskScore}%</span>
                    </div>
                    <Progress value={patient.riskScore} className="h-2" />
                  </div>

                  <div>
                    <p className="text-sm font-medium">Primary Risk Factors:</p>
                    <p className="text-sm text-muted-foreground">{patient.primaryRisk}</p>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                    <Button size="sm">
                      <Bell className="mr-2 h-4 w-4" />
                      Send Alert
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Risk Trends */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Critical Risk Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">12</div>
            <p className="text-xs text-muted-foreground">+3 from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">28</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Successful Interventions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">156</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
