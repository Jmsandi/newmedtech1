
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Clock, Loader2, Search, TestTube } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Sample tracking data
const sampleData = [
  {
    id: "S-45678",
    collectionTime: "2025-05-03 08:15 AM",
    patientName: "John Smith",
    testType: "Complete Blood Count",
    location: "Reception",
    status: "Collected",
  },
  {
    id: "S-45679",
    collectionTime: "2025-05-03 09:20 AM",
    patientName: "Maria Garcia",
    testType: "Lipid Panel",
    location: "Lab Room 2",
    status: "In Progress",
  },
  {
    id: "S-45680",
    collectionTime: "2025-05-03 07:45 AM",
    patientName: "Robert Johnson",
    testType: "COVID-19 PCR",
    location: "Sample Storage",
    status: "Awaiting Analysis",
  },
  {
    id: "S-45681",
    collectionTime: "2025-05-03 10:30 AM",
    patientName: "Emily Williams",
    testType: "Urinalysis",
    location: "Lab Room 1",
    status: "In Progress",
  },
  {
    id: "S-45682",
    collectionTime: "2025-05-03 11:05 AM",
    patientName: "Michael Brown",
    testType: "Comprehensive Metabolic Panel",
    location: "Reception",
    status: "Collected",
  },
];

const SampleTracking: React.FC = () => {
  const { toast } = useToast();
  const [searchId, setSearchId] = React.useState("");
  const [isSearching, setIsSearching] = React.useState(false);
  const [displayedSamples, setDisplayedSamples] = React.useState(sampleData);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchId.trim()) {
      setDisplayedSamples(sampleData);
      return;
    }
    
    setIsSearching(true);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      const filtered = sampleData.filter(sample => 
        sample.id.toLowerCase().includes(searchId.toLowerCase()));
      
      setDisplayedSamples(filtered);
      setIsSearching(false);
      
      if (filtered.length === 0) {
        toast({
          title: "No samples found",
          description: `No samples matching ID "${searchId}" were found.`,
          variant: "destructive",
        });
      }
    }, 500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Collected": return "secondary";
      case "In Progress": return "default";
      case "Awaiting Analysis": return "outline";
      case "Completed": return "secondary";
      default: return "outline";
    }
  };

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sample Tracking</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5 text-indigo-600" />
            Track Sample
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
              <Input 
                className="pl-9"
                placeholder="Enter sample ID..."
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
              />
            </div>
            <Button 
              type="submit" 
              className="bg-indigo-600 hover:bg-indigo-700"
              disabled={isSearching}
            >
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Track
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Active Samples</span>
            <Badge className="bg-indigo-600">{displayedSamples.length} Samples</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sample ID</TableHead>
                  <TableHead>Collection Time</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Test Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedSamples.map((sample) => (
                  <TableRow key={sample.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{sample.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gray-400" />
                        {sample.collectionTime}
                      </div>
                    </TableCell>
                    <TableCell>{sample.patientName}</TableCell>
                    <TableCell>{sample.testType}</TableCell>
                    <TableCell>{sample.location}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(sample.status)}>
                        {sample.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => toast({
                            title: "Sample Details",
                            description: `Viewing details for sample ${sample.id}`
                          })}
                        >
                          Details
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => toast({
                            title: "Sample Updated",
                            description: `Location updated for sample ${sample.id}`
                          })}
                        >
                          Update
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {displayedSamples.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      No samples found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SampleTracking;
