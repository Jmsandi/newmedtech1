import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search as SearchIcon, 
  User, 
  Calendar,
  FileText,
  Phone,
  Mail,
  MapPin,
  Clock,
  Filter,
  ExternalLink
} from "lucide-react";

interface SearchResult {
  id: string;
  type: "patient" | "appointment" | "document";
  title: string;
  subtitle: string;
  description: string;
  metadata: Record<string, any>;
  relevance: number;
}

const mockSearchResults: SearchResult[] = [
  {
    id: "PT001",
    type: "patient",
    title: "Sarah Johnson",
    subtitle: "Patient ID: PT001",
    description: "Age 39, Female • Insurance: Blue Cross Blue Shield • Last visit: Jan 15, 2024",
    metadata: {
      phone: "+1 (555) 123-4567",
      email: "sarah.johnson@email.com",
      address: "123 Main St, Springfield, IL 62701",
      status: "Active",
      nextAppointment: "2024-02-10T09:00:00"
    },
    relevance: 95
  },
  {
    id: "APT001",
    type: "appointment",
    title: "General Consultation",
    subtitle: "Dr. Smith • Feb 10, 2024 at 9:00 AM",
    description: "Sarah Johnson • Room 101 • Internal Medicine",
    metadata: {
      patientName: "Sarah Johnson",
      doctor: "Dr. Smith",
      department: "Internal Medicine",
      status: "Scheduled",
      room: "101"
    },
    relevance: 90
  },
  {
    id: "PT002",
    type: "patient",
    title: "Michael Chen",
    subtitle: "Patient ID: PT002",
    description: "Age 32, Male • Insurance: Aetna • Last visit: Jan 20, 2024",
    metadata: {
      phone: "+1 (555) 234-5678",
      email: "michael.chen@email.com",
      address: "456 Oak Ave, Springfield, IL 62702",
      status: "Active"
    },
    relevance: 85
  },
  {
    id: "DOC001",
    type: "document",
    title: "Insurance Verification Form",
    subtitle: "Sarah Johnson • Completed Jan 15, 2024",
    description: "Insurance verification completed for Blue Cross Blue Shield",
    metadata: {
      patientName: "Sarah Johnson",
      documentType: "Insurance Form",
      status: "Completed",
      completedDate: "2024-01-15"
    },
    relevance: 80
  }
];

const quickSearchSuggestions = [
  "Sarah Johnson",
  "Appointment today",
  "Dr. Smith schedule",
  "Room 101",
  "Insurance verification",
  "New patient registration"
];

export default function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const filtered = mockSearchResults.filter(result =>
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.subtitle.toLowerCase().includes(query.toLowerCase()) ||
        result.description.toLowerCase().includes(query.toLowerCase())
      ).sort((a, b) => b.relevance - a.relevance);
      
      setSearchResults(filtered);
      setIsSearching(false);
    }, 500);
  };

  const filteredResults = searchResults.filter(result => {
    if (activeTab === "all") return true;
    return result.type === activeTab;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "patient":
        return <User className="w-5 h-5 text-blue-600" />;
      case "appointment":
        return <Calendar className="w-5 h-5 text-green-600" />;
      case "document":
        return <FileText className="w-5 h-5 text-purple-600" />;
      default:
        return <SearchIcon className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "patient":
        return "bg-blue-100 text-blue-800";
      case "appointment":
        return "bg-green-100 text-green-800";
      case "document":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleQuickSearch = (suggestion: string) => {
    setSearchTerm(suggestion);
    handleSearch(suggestion);
  };

  const handleViewResult = (result: SearchResult) => {
    console.log("Viewing result:", result);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quick Search</h1>
          <p className="text-gray-600">Find patients, appointments, and information quickly</p>
        </div>
      </div>

      {/* Search Interface */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Main Search Bar */}
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search for patients, appointments, documents..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (e.target.value.length > 2) {
                    handleSearch(e.target.value);
                  } else {
                    setSearchResults([]);
                  }
                }}
                className="pl-11 text-lg py-3"
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                </div>
              )}
            </div>

            {/* Quick Search Suggestions */}
            {!searchTerm && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Quick searches:</p>
                <div className="flex flex-wrap gap-2">
                  {quickSearchSuggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickSearch(suggestion)}
                      className="text-sm"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Search Results ({searchResults.length})</CardTitle>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All ({searchResults.length})</TabsTrigger>
                <TabsTrigger value="patient">
                  Patients ({searchResults.filter(r => r.type === "patient").length})
                </TabsTrigger>
                <TabsTrigger value="appointment">
                  Appointments ({searchResults.filter(r => r.type === "appointment").length})
                </TabsTrigger>
                <TabsTrigger value="document">
                  Documents ({searchResults.filter(r => r.type === "document").length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-6">
                <div className="space-y-4">
                  {filteredResults.map((result) => (
                    <div
                      key={result.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleViewResult(result)}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 mt-1">
                          {getTypeIcon(result.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {result.title}
                              </h3>
                              <p className="text-sm text-gray-600 mb-2">{result.subtitle}</p>
                              <p className="text-gray-700">{result.description}</p>
                              
                              {/* Type-specific metadata */}
                              {result.type === "patient" && (
                                <div className="mt-3 space-y-1">
                                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                                    <div className="flex items-center space-x-1">
                                      <Phone className="w-3 h-3" />
                                      <span>{result.metadata.phone}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <Mail className="w-3 h-3" />
                                      <span>{result.metadata.email}</span>
                                    </div>
                                  </div>
                                  {result.metadata.nextAppointment && (
                                    <div className="flex items-center space-x-1 text-sm text-blue-600">
                                      <Calendar className="w-3 h-3" />
                                      <span>
                                        Next: {new Date(result.metadata.nextAppointment).toLocaleDateString()}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}

                              {result.type === "appointment" && (
                                <div className="mt-3 space-y-1">
                                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                                    <div className="flex items-center space-x-1">
                                      <User className="w-3 h-3" />
                                      <span>{result.metadata.patientName}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <MapPin className="w-3 h-3" />
                                      <span>Room {result.metadata.room}</span>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {result.type === "document" && (
                                <div className="mt-3">
                                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                                    <div className="flex items-center space-x-1">
                                      <Clock className="w-3 h-3" />
                                      <span>
                                        Completed: {new Date(result.metadata.completedDate).toLocaleDateString()}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center space-x-3">
                              <Badge className={getTypeColor(result.type)}>
                                {result.type}
                              </Badge>
                              <div className="text-right">
                                <div className="text-sm text-gray-500">
                                  Relevance: {result.relevance}%
                                </div>
                              </div>
                              <ExternalLink className="w-4 h-4 text-gray-400" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {searchTerm && searchResults.length === 0 && !isSearching && (
        <Card>
          <CardContent className="text-center py-20">
            <SearchIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600">
              No results found for "{searchTerm}". Try different keywords or check the spelling.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Search Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Search Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Patient Search</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Search by name, ID, or phone</li>
                <li>• Use partial names (e.g., "John")</li>
                <li>• Include insurance provider</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Appointment Search</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Search by doctor name</li>
                <li>• Use date ranges</li>
                <li>• Include department or room</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">General Tips</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Use quotation marks for exact phrases</li>
                <li>• Separate terms with spaces</li>
                <li>• Try alternative spellings</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 