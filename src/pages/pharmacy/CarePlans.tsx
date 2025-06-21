import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, Calendar, Users, Eye, TrendingUp, AlertTriangle, CheckCircle, Clock, Heart
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Mock data for care plans
const mockCarePlans = [
  { 
    id: 1, 
    patientName: "John Doe", 
    patientId: "P001", 
    condition: "Type 2 Diabetes", 
    planType: "Medication Management", 
    status: "Active", 
    startDate: "2025-01-15", 
    nextReview: "2025-05-15", 
    pharmacist: "Dr. Emily Chen",
    priority: "High",
    adherenceRate: 92,
    goals: [
      "Maintain HbA1c below 7%",
      "Monitor blood glucose daily",
      "Medication adherence >90%"
    ],
    medications: [
      { name: "Metformin 850mg", frequency: "Twice daily", adherence: 95 },
      { name: "Insulin Glargine", frequency: "Once daily", adherence: 88 },
      { name: "Lisinopril 10mg", frequency: "Once daily", adherence: 92 }
    ],
    recentOutcomes: [
      { date: "2025-04-28", metric: "HbA1c", value: "7.2%", target: "<7%" },
      { date: "2025-04-25", metric: "Blood Pressure", value: "125/82", target: "<130/80" }
    ]
  },
  { 
    id: 2, 
    patientName: "Jane Smith", 
    patientId: "P002", 
    condition: "Hypertension", 
    planType: "Blood Pressure Management", 
    status: "Active", 
    startDate: "2025-02-01", 
    nextReview: "2025-05-01", 
    pharmacist: "Dr. James Wilson",
    priority: "Medium",
    adherenceRate: 88,
    goals: [
      "Maintain BP below 130/80 mmHg",
      "Regular BP monitoring",
      "Lifestyle modifications"
    ],
    medications: [
      { name: "Lisinopril 10mg", frequency: "Once daily", adherence: 90 },
      { name: "Amlodipine 5mg", frequency: "Once daily", adherence: 85 }
    ],
    recentOutcomes: [
      { date: "2025-04-30", metric: "Blood Pressure", value: "125/82", target: "<130/80" },
      { date: "2025-04-25", metric: "Weight", value: "68kg", target: "65-70kg" }
    ]
  },
  { 
    id: 3, 
    patientName: "Bob Johnson", 
    patientId: "P003", 
    condition: "High Cholesterol", 
    planType: "Lipid Management", 
    status: "Under Review", 
    startDate: "2025-01-10", 
    nextReview: "2025-05-10", 
    pharmacist: "Dr. Sarah Martinez",
    priority: "Medium",
    adherenceRate: 76,
    goals: [
      "LDL cholesterol <100 mg/dL",
      "Improve medication adherence",
      "Dietary counseling"
    ],
    medications: [
      { name: "Atorvastatin 20mg", frequency: "Once daily", adherence: 78 },
      { name: "Ezetimibe 10mg", frequency: "Once daily", adherence: 74 }
    ],
    recentOutcomes: [
      { date: "2025-04-25", metric: "LDL Cholesterol", value: "145 mg/dL", target: "<100 mg/dL" },
      { date: "2025-04-20", metric: "Total Cholesterol", value: "220 mg/dL", target: "<200 mg/dL" }
    ]
  },
  { 
    id: 4, 
    patientName: "Mary Williams", 
    patientId: "P004", 
    condition: "Asthma", 
    planType: "Respiratory Management", 
    status: "Active", 
    startDate: "2025-03-01", 
    nextReview: "2025-06-01", 
    pharmacist: "Dr. Michael Thompson",
    priority: "High",
    adherenceRate: 85,
    goals: [
      "Improve peak flow readings",
      "Reduce rescue inhaler use",
      "Proper inhaler technique"
    ],
    medications: [
      { name: "Salbutamol 100mcg", frequency: "As needed", adherence: 90 },
      { name: "Budesonide 200mcg", frequency: "Twice daily", adherence: 80 }
    ],
    recentOutcomes: [
      { date: "2025-05-01", metric: "Peak Flow", value: "380 L/min", target: ">400 L/min" },
      { date: "2025-04-28", metric: "Rescue Inhaler Use", value: "3 times/week", target: "<2 times/week" }
    ]
  },
  { 
    id: 5, 
    patientName: "James Brown", 
    patientId: "P005", 
    condition: "Depression", 
    planType: "Mental Health Support", 
    status: "Completed", 
    startDate: "2024-12-01", 
    nextReview: "2025-03-01", 
    pharmacist: "Dr. Emily Chen",
    priority: "High",
    adherenceRate: 94,
    goals: [
      "Mood stabilization",
      "Medication adherence",
      "Regular monitoring"
    ],
    medications: [
      { name: "Sertraline 50mg", frequency: "Once daily", adherence: 96 },
      { name: "Bupropion XL 150mg", frequency: "Once daily", adherence: 92 }
    ],
    recentOutcomes: [
      { date: "2025-02-28", metric: "PHQ-9 Score", value: "8", target: "<10" },
      { date: "2025-02-25", metric: "Side Effects", value: "Minimal", target: "None to Mild" }
    ]
  }
];

const CarePlans = () => {
  const [carePlans, setCarePlans] = useState(mockCarePlans);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredPlans = carePlans.filter(plan =>
    plan.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.planType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'under review':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'discontinued':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'under review':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'discontinued':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const handleViewPlan = (plan: any) => {
    setSelectedPlan(plan);
    setIsDialogOpen(true);
  };

  const totalPlans = carePlans.length;
  const activePlans = carePlans.filter(p => p.status === "Active").length;
  const avgAdherence = Math.round(carePlans.reduce((sum, plan) => sum + plan.adherenceRate, 0) / carePlans.length);
  const reviewsDue = carePlans.filter(p => new Date(p.nextReview) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Care Plans</h1>
          <p className="text-gray-600">Monitor patient care plans and medication adherence</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Care Plans</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPlans}</div>
            <p className="text-xs text-muted-foreground">All care plans</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Plans</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activePlans}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Adherence</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{avgAdherence}%</div>
            <p className="text-xs text-muted-foreground">Medication adherence</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reviews Due</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{reviewsDue}</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
      </div>

      {/* Care Plans Table */}
      <Card>
        <CardHeader>
          <CardTitle>Patient Care Plans</CardTitle>
          <CardDescription>Comprehensive medication management and patient care coordination</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search care plans by patient, condition, or plan type..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Plan Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Adherence</TableHead>
                  <TableHead>Next Review</TableHead>
                  <TableHead>Pharmacist</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{plan.patientName}</p>
                        <p className="text-sm text-muted-foreground">{plan.patientId}</p>
                      </div>
                    </TableCell>
                    <TableCell>{plan.condition}</TableCell>
                    <TableCell>{plan.planType}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(plan.status)}
                        <Badge className={getStatusColor(plan.status)}>
                          {plan.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(plan.priority)}>
                        {plan.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${plan.adherenceRate}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{plan.adherenceRate}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{plan.nextReview}</TableCell>
                    <TableCell>{plan.pharmacist}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewPlan(plan)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Care Plan Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-6xl">
          <DialogHeader>
            <DialogTitle>Care Plan Details - {selectedPlan?.patientName}</DialogTitle>
            <DialogDescription>
              Comprehensive care plan information and medication management
            </DialogDescription>
          </DialogHeader>
          
          {selectedPlan && (
            <div className="grid gap-6 py-4">
              {/* Plan Overview */}
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Plan Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium">Patient:</span>
                      <span>{selectedPlan.patientName} ({selectedPlan.patientId})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Condition:</span>
                      <span>{selectedPlan.condition}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Plan Type:</span>
                      <span>{selectedPlan.planType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Start Date:</span>
                      <span>{selectedPlan.startDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Next Review:</span>
                      <span>{selectedPlan.nextReview}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Pharmacist:</span>
                      <span>{selectedPlan.pharmacist}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Status:</span>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(selectedPlan.status)}
                        <Badge className={getStatusColor(selectedPlan.status)}>
                          {selectedPlan.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Priority:</span>
                      <Badge className={getPriorityColor(selectedPlan.priority)}>
                        {selectedPlan.priority}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Care Goals</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedPlan.goals.map((goal: string, index: number) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Heart className="h-4 w-4 text-blue-600" />
                          <span className="text-sm">{goal}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Medications */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Current Medications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedPlan.medications.map((med: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{med.name}</p>
                          <p className="text-sm text-muted-foreground">{med.frequency}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${med.adherence}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{med.adherence}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Outcomes */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Outcomes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedPlan.recentOutcomes.map((outcome: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{outcome.metric}</p>
                          <p className="text-sm text-muted-foreground">{outcome.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{outcome.value}</p>
                          <p className="text-sm text-muted-foreground">Target: {outcome.target}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CarePlans; 