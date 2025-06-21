import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardList, Search, Edit, Plus, CheckCircle, Clock, AlertTriangle, User } from "lucide-react";

const CarePlans: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("active");
  
  const carePlans = [
    {
      id: "CP001",
      patientName: "James Wilson",
      patientId: "P001",
      room: "101",
      condition: "Hypertension",
      priority: "Medium",
      lastUpdated: "2024-01-15",
      updatedBy: "Nurse Jennifer",
      status: "Active",
      goals: [
        "Maintain BP below 140/90",
        "Medication compliance",
        "Lifestyle modifications"
      ],
      interventions: [
        "Monitor vital signs q4h",
        "Administer antihypertensive medication",
        "Patient education on diet",
        "Exercise counseling"
      ],
      outcomes: [
        "BP reading within target range",
        "Patient verbalizes understanding of diet restrictions",
        "No adverse medication reactions"
      ],
      nextReview: "2024-01-18"
    },
    {
      id: "CP002",
      patientName: "Maria Garcia",
      patientId: "P002",
      room: "205",
      condition: "Type 2 Diabetes",
      priority: "High",
      lastUpdated: "2024-01-14",
      updatedBy: "Nurse Amy",
      status: "Active",
      goals: [
        "Maintain blood glucose 80-180 mg/dL",
        "Prevent complications",
        "Self-care independence"
      ],
      interventions: [
        "Blood glucose monitoring q6h",
        "Insulin administration per protocol",
        "Diabetic diet education",
        "Foot care assessment"
      ],
      outcomes: [
        "Blood glucose levels stable",
        "Patient demonstrates proper insulin technique",
        "No signs of diabetic complications"
      ],
      nextReview: "2024-01-17"
    },
    {
      id: "CP003",
      patientName: "Robert Chen",
      patientId: "P003",
      room: "302",
      condition: "Post-operative care",
      priority: "High",
      lastUpdated: "2024-01-13",
      updatedBy: "Nurse Jennifer",
      status: "Active",
      goals: [
        "Wound healing without infection",
        "Pain management < 4/10",
        "Return to baseline mobility"
      ],
      interventions: [
        "Wound assessment and dressing change daily",
        "Pain assessment q4h",
        "Early mobilization",
        "Deep breathing exercises"
      ],
      outcomes: [
        "Wound healing appropriately",
        "Pain controlled with medication",
        "Patient ambulatory with assistance"
      ],
      nextReview: "2024-01-16"
    }
  ];

  const filteredCarePlans = carePlans.filter(plan => {
    const matchesSearch = plan.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.patientId.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "active") return matchesSearch && plan.status === "Active";
    if (activeTab === "high-priority") return matchesSearch && plan.priority === "High";
    if (activeTab === "due-review") {
      const nextReview = new Date(plan.nextReview);
      const today = new Date();
      const threeDaysFromNow = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
      return matchesSearch && nextReview <= threeDaysFromNow;
    }
    if (activeTab === "all") return matchesSearch;
    
    return matchesSearch;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Completed":
        return "bg-blue-100 text-blue-800";
      case "On Hold":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isReviewDue = (nextReview: string) => {
    const reviewDate = new Date(nextReview);
    const today = new Date();
    return reviewDate <= today;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1e293b]">Care Plans</h1>
          <p className="text-gray-600">Manage and update patient care plans</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <CheckCircle className="mr-2 h-4 w-4" />
            Complete Assessment
          </Button>
          <Button className="bg-[#3498db] hover:bg-[#2980b9]">
            <Plus className="mr-2 h-4 w-4" />
            New Care Plan
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Care Plans</p>
                <h3 className="text-2xl font-bold text-[#3498db]">
                  {carePlans.filter(plan => plan.status === "Active").length}
                </h3>
              </div>
              <div className="bg-[#3498db]/10 p-3 rounded-full">
                <ClipboardList className="h-6 w-6 text-[#3498db]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">High Priority</p>
                <h3 className="text-2xl font-bold text-red-600">
                  {carePlans.filter(plan => plan.priority === "High").length}
                </h3>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Due for Review</p>
                <h3 className="text-2xl font-bold text-orange-600">
                  {carePlans.filter(plan => isReviewDue(plan.nextReview)).length}
                </h3>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Updated Today</p>
                <h3 className="text-2xl font-bold text-green-600">
                  {carePlans.filter(plan => plan.lastUpdated === "2024-01-15").length}
                </h3>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by patient name, condition, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Care Plans Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="active">Active Plans</TabsTrigger>
          <TabsTrigger value="high-priority">High Priority</TabsTrigger>
          <TabsTrigger value="due-review">Due for Review</TabsTrigger>
          <TabsTrigger value="all">All Plans</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="space-y-4">
            {filteredCarePlans.map((plan) => (
              <Card key={plan.id} className={`${plan.priority === "High" ? "border-red-200 bg-red-50/30" : ""}`}>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{plan.patientName}</CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-1">
                        <span>ID: {plan.patientId}</span>
                        <span>•</span>
                        <span>Room {plan.room}</span>
                        <span>•</span>
                        <span>{plan.condition}</span>
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(plan.priority)}>
                        {plan.priority} Priority
                      </Badge>
                      <Badge className={getStatusColor(plan.status)}>
                        {plan.status}
                      </Badge>
                      {isReviewDue(plan.nextReview) && (
                        <Badge className="bg-orange-100 text-orange-800">
                          Review Due
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    {/* Goals */}
                    <div>
                      <h4 className="font-medium mb-3 text-[#1e293b]">Care Goals</h4>
                      <div className="space-y-2">
                        {plan.goals.map((goal, index) => (
                          <div key={index} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{goal}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Interventions */}
                    <div>
                      <h4 className="font-medium mb-3 text-[#1e293b]">Nursing Interventions</h4>
                      <div className="space-y-2">
                        {plan.interventions.map((intervention, index) => (
                          <div key={index} className="flex items-start gap-2 text-sm">
                            <div className="w-2 h-2 bg-[#3498db] rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700">{intervention}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Expected Outcomes */}
                    <div>
                      <h4 className="font-medium mb-3 text-[#1e293b]">Expected Outcomes</h4>
                      <div className="space-y-2">
                        {plan.outcomes.map((outcome, index) => (
                          <div key={index} className="flex items-start gap-2 text-sm">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700">{outcome}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Plan Details */}
                  <div className="grid gap-4 md:grid-cols-2 mt-6 pt-4 border-t">
                    <div className="text-sm text-gray-600">
                      <p><strong>Last Updated:</strong> {new Date(plan.lastUpdated).toLocaleDateString()}</p>
                      <p><strong>Updated By:</strong> {plan.updatedBy}</p>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p><strong>Next Review:</strong> {new Date(plan.nextReview).toLocaleDateString()}</p>
                      <p><strong>Plan ID:</strong> {plan.id}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t">
                    <Button variant="outline" size="sm">
                      <User className="h-4 w-4 mr-1" />
                      View Patient
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Update Plan
                    </Button>
                    <Button variant="outline" size="sm">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Mark Complete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredCarePlans.length === 0 && (
              <Card>
                <CardContent className="text-center py-10">
                  <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No care plans found</h3>
                  <p className="text-gray-600">No care plans match the current search and filter criteria.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CarePlans; 