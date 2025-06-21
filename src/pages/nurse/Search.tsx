import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Users, FileText, Calendar, FlaskConical, Pill, Clock, Heart, AlertTriangle } from "lucide-react";

const NurseSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  const searchResults = [
    {
      id: "P001",
      type: "patient",
      title: "James Wilson",
      subtitle: "Patient ID: P001 • Room 101",
      description: "65 years old • Hypertension • Last vitals: 2 hours ago",
      timestamp: "Active patient",
      category: "Patients",
      priority: "normal",
      status: "Active"
    },
    {
      id: "M001",
      type: "medication",
      title: "Lisinopril 10mg",
      subtitle: "James Wilson • Room 101",
      description: "Due at 16:00 • Blood pressure medication",
      timestamp: "Due in 30 minutes",
      category: "Medications",
      priority: "high",
      status: "Due Soon"
    },
    {
      id: "L001",
      type: "lab",
      title: "Complete Blood Count",
      subtitle: "James Wilson • Lab ID: LAB001",
      description: "Completed 2024-01-15 12:30 • Mild anemia noted",
      timestamp: "3 hours ago",
      category: "Lab Results",
      priority: "normal",
      status: "Completed"
    },
    {
      id: "C001",
      type: "careplan",
      title: "Post-Operative Care Plan",
      subtitle: "Robert Chen • Room 302",
      description: "Pain management and mobility assessment",
      timestamp: "Updated 1 hour ago",
      category: "Care Plans",
      priority: "normal",
      status: "Active"
    },
    {
      id: "A001",
      type: "appointment",
      title: "Physical Therapy Session",
      subtitle: "Sarah Thompson • Room 108",
      description: "Scheduled for 2024-01-15 17:00",
      timestamp: "Today at 5:00 PM",
      category: "Appointments",
      priority: "normal",
      status: "Scheduled"
    },
    {
      id: "V001",
      type: "vitals",
      title: "Elevated Blood Pressure",
      subtitle: "James Wilson • Room 101",
      description: "180/95 mmHg recorded at 15:30",
      timestamp: "15 minutes ago",
      category: "Vital Signs",
      priority: "high",
      status: "Alert"
    },
    {
      id: "D001",
      type: "document",
      title: "Nursing Assessment Notes",
      subtitle: "Maria Garcia • Room 205",
      description: "Initial assessment completed - diabetes management",
      timestamp: "2 hours ago",
      category: "Documentation",
      priority: "normal",
      status: "Completed"
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "patient":
        return <Users className="h-5 w-5 text-blue-600" />;
      case "medication":
        return <Pill className="h-5 w-5 text-green-600" />;
      case "lab":
        return <FlaskConical className="h-5 w-5 text-purple-600" />;
      case "careplan":
        return <FileText className="h-5 w-5 text-orange-600" />;
      case "appointment":
        return <Calendar className="h-5 w-5 text-indigo-600" />;
      case "vitals":
        return <Heart className="h-5 w-5 text-red-600" />;
      case "document":
        return <FileText className="h-5 w-5 text-gray-600" />;
      default:
        return <Search className="h-5 w-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "normal":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Alert":
        return "bg-red-100 text-red-800";
      case "Due Soon":
        return "bg-orange-100 text-orange-800";
      case "Active":
        return "bg-green-100 text-green-800";
      case "Completed":
        return "bg-blue-100 text-blue-800";
      case "Scheduled":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredResults = searchResults.filter(result => {
    const matchesSearch = searchTerm === "" || 
      result.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = searchCategory === "all" || result.type === searchCategory;
    
    let matchesTab = true;
    if (activeTab === "patients") matchesTab = result.type === "patient";
    if (activeTab === "medications") matchesTab = result.type === "medication";
    if (activeTab === "labs") matchesTab = result.type === "lab";
    if (activeTab === "alerts") matchesTab = result.priority === "high" || result.status === "Alert";
    
    return matchesSearch && matchesCategory && matchesTab;
  });

  const handleViewItem = (item: any) => {
    console.log("Viewing item:", item.id, item.type);
  };

  const categoryStats = {
    patients: searchResults.filter(r => r.type === "patient").length,
    medications: searchResults.filter(r => r.type === "medication").length,
    labs: searchResults.filter(r => r.type === "lab").length,
    careplans: searchResults.filter(r => r.type === "careplan").length,
    vitals: searchResults.filter(r => r.type === "vitals").length,
    documents: searchResults.filter(r => r.type === "document").length,
    alerts: searchResults.filter(r => r.priority === "high" || r.status === "Alert").length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1e293b]">Search</h1>
          <p className="text-gray-600">Search across patients, medications, lab results, and more</p>
        </div>
      </div>

      {/* Search Interface */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search patients, medications, lab results, care plans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={searchCategory} onValueChange={setSearchCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="patient">Patients</SelectItem>
                <SelectItem value="medication">Medications</SelectItem>
                <SelectItem value="lab">Lab Results</SelectItem>
                <SelectItem value="careplan">Care Plans</SelectItem>
                <SelectItem value="vitals">Vital Signs</SelectItem>
                <SelectItem value="document">Documentation</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Results</p>
                <h3 className="text-2xl font-bold text-[#3498db]">{filteredResults.length}</h3>
              </div>
              <div className="bg-[#3498db]/10 p-3 rounded-full">
                <Search className="h-6 w-6 text-[#3498db]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">High Priority</p>
                <h3 className="text-2xl font-bold text-red-600">{categoryStats.alerts}</h3>
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
                <p className="text-sm font-medium text-gray-500">Active Patients</p>
                <h3 className="text-2xl font-bold text-green-600">{categoryStats.patients}</h3>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending Medications</p>
                <h3 className="text-2xl font-bold text-orange-600">{categoryStats.medications}</h3>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Pill className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Results */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Results</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="labs">Lab Results</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="space-y-4">
            {filteredResults.map((result) => (
              <Card key={result.id} className={`cursor-pointer hover:shadow-md transition-shadow ${
                result.priority === "high" ? "border-l-4 border-l-red-500" : ""
              }`} onClick={() => handleViewItem(result)}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      {getTypeIcon(result.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-[#1e293b] mb-1">{result.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{result.subtitle}</p>
                          <p className="text-sm text-gray-700 mb-3">{result.description}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock className="h-4 w-4" />
                            <span>{result.timestamp}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {result.priority === "high" && (
                            <Badge className={getPriorityColor(result.priority)}>
                              High Priority
                            </Badge>
                          )}
                          <Badge className={getStatusColor(result.status)}>
                            {result.status}
                          </Badge>
                          <Badge variant="outline">
                            {result.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredResults.length === 0 && (
              <Card>
                <CardContent className="text-center py-10">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                  <p className="text-gray-600">
                    {searchTerm ? `No results found for "${searchTerm}"` : "Enter a search term to find patients, medications, lab results, and more."}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Filters</CardTitle>
          <CardDescription>Common searches and filters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="justify-start" onClick={() => {setSearchTerm("high priority"); setActiveTab("alerts");}}>
              <AlertTriangle className="mr-2 h-4 w-4 text-red-600" />
              High Priority Items
            </Button>
            <Button variant="outline" className="justify-start" onClick={() => {setSearchTerm("due"); setActiveTab("medications");}}>
              <Pill className="mr-2 h-4 w-4 text-orange-600" />
              Due Medications
            </Button>
            <Button variant="outline" className="justify-start" onClick={() => {setSearchTerm("completed"); setActiveTab("labs");}}>
              <FlaskConical className="mr-2 h-4 w-4 text-green-600" />
              Recent Lab Results
            </Button>
            <Button variant="outline" className="justify-start" onClick={() => {setSearchTerm("active"); setActiveTab("patients");}}>
              <Users className="mr-2 h-4 w-4 text-blue-600" />
              Active Patients
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NurseSearch; 