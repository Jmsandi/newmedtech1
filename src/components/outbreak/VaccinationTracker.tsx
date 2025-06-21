
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, Calendar, MapPin, Package, Plus, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VaccinationSite {
  id: number;
  name: string;
  location: string;
  vaccineTypes: string[];
  availability: number;
  capacity: number;
  nextAvailable: string;
  status: string;
}

interface ResourceStock {
  id: number;
  item: string;
  currentStock: number;
  minRequired: number;
  lastUpdated: string;
  status: string;
}

export const VaccinationTracker = () => {
  const { toast } = useToast();
  const [bookingForm, setBookingForm] = useState({
    name: "",
    age: "",
    phone: "",
    preferredDate: "",
    vaccinationType: "",
    siteId: ""
  });

  const [sites] = useState<VaccinationSite[]>([
    {
      id: 1,
      name: "Central Health Center",
      location: "Downtown",
      vaccineTypes: ["Pfizer", "Moderna"],
      availability: 45,
      capacity: 100,
      nextAvailable: "2024-01-22",
      status: "Available"
    },
    {
      id: 2,
      name: "Community Hospital",
      location: "North District",
      vaccineTypes: ["Johnson & Johnson", "Pfizer"],
      availability: 12,
      capacity: 80,
      nextAvailable: "2024-01-25",
      status: "Limited"
    },
    {
      id: 3,
      name: "Mobile Clinic Unit",
      location: "Rural Areas",
      vaccineTypes: ["Moderna"],
      availability: 0,
      capacity: 50,
      nextAvailable: "2024-01-28",
      status: "Full"
    }
  ]);

  const [resources] = useState<ResourceStock[]>([
    {
      id: 1,
      item: "Pfizer Vaccines",
      currentStock: 450,
      minRequired: 200,
      lastUpdated: "2024-01-20",
      status: "Good"
    },
    {
      id: 2,
      item: "Moderna Vaccines",
      currentStock: 180,
      minRequired: 200,
      lastUpdated: "2024-01-20",
      status: "Low"
    },
    {
      id: 3,
      item: "N95 Masks",
      currentStock: 850,
      minRequired: 500,
      lastUpdated: "2024-01-19",
      status: "Good"
    },
    {
      id: 4,
      item: "Syringes",
      currentStock: 95,
      minRequired: 300,
      lastUpdated: "2024-01-20",
      status: "Critical"
    },
    {
      id: 5,
      item: "Test Kits",
      currentStock: 320,
      minRequired: 250,
      lastUpdated: "2024-01-19",
      status: "Good"
    }
  ]);

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Appointment Booked",
      description: "Your vaccination appointment has been scheduled successfully.",
    });
    setBookingForm({
      name: "",
      age: "",
      phone: "",
      preferredDate: "",
      vaccinationType: "",
      siteId: ""
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available": return "bg-green-100 text-green-800";
      case "Limited": return "bg-yellow-100 text-yellow-800";
      case "Full": return "bg-red-100 text-red-800";
      case "Good": return "bg-green-100 text-green-800";
      case "Low": return "bg-yellow-100 text-yellow-800";
      case "Critical": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStockPercentage = (current: number, min: number) => {
    return Math.min((current / min) * 100, 100);
  };

  return (
    <div className="space-y-6">
      {/* Vaccination Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vaccinated</CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">12,458</div>
            <p className="text-xs text-muted-foreground">
              +234 this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Appointments Today</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">87</div>
            <p className="text-xs text-muted-foreground">
              92% completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sites</CardTitle>
            <MapPin className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">3</div>
            <p className="text-xs text-muted-foreground">
              2 with availability
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vaccine Stock</CardTitle>
            <Package className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">630</div>
            <p className="text-xs text-muted-foreground">
              Doses available
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Booking Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <span>Book Vaccination Appointment</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleBooking} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={bookingForm.name}
                    onChange={(e) => setBookingForm({...bookingForm, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={bookingForm.age}
                    onChange={(e) => setBookingForm({...bookingForm, age: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={bookingForm.phone}
                  onChange={(e) => setBookingForm({...bookingForm, phone: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="site">Vaccination Site</Label>
                <Select onValueChange={(value) => setBookingForm({...bookingForm, siteId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vaccination site" />
                  </SelectTrigger>
                  <SelectContent>
                    {sites.map((site) => (
                      <SelectItem key={site.id} value={site.id.toString()}>
                        {site.name} - {site.location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="vaccineType">Preferred Vaccine</Label>
                <Select onValueChange={(value) => setBookingForm({...bookingForm, vaccinationType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vaccine type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pfizer">Pfizer</SelectItem>
                    <SelectItem value="moderna">Moderna</SelectItem>
                    <SelectItem value="johnson">Johnson & Johnson</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="preferredDate">Preferred Date</Label>
                <Input
                  id="preferredDate"
                  type="date"
                  value={bookingForm.preferredDate}
                  onChange={(e) => setBookingForm({...bookingForm, preferredDate: e.target.value})}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Book Appointment
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Vaccination Sites */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-purple-600" />
              <span>Vaccination Sites</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sites.map((site) => (
                <div key={site.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">{site.name}</h3>
                      <p className="text-sm text-gray-600">{site.location}</p>
                    </div>
                    <Badge className={getStatusColor(site.status)}>
                      {site.status}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Availability</span>
                      <span>{site.availability}/{site.capacity}</span>
                    </div>
                    <Progress value={(site.availability / site.capacity) * 100} />
                  </div>

                  <div className="mt-2 flex flex-wrap gap-1">
                    {site.vaccineTypes.map((vaccine) => (
                      <Badge key={vaccine} variant="outline" className="text-xs">
                        {vaccine}
                      </Badge>
                    ))}
                  </div>

                  <p className="text-xs text-gray-500 mt-2">
                    Next available: {site.nextAvailable}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resource Tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5 text-orange-600" />
            <span>Resource Stock Levels</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {resources.map((resource) => (
              <div key={resource.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{resource.item}</h3>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(resource.status)}>
                      {resource.status}
                    </Badge>
                    {resource.status === "Critical" && (
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current Stock</span>
                    <span>{resource.currentStock} units</span>
                  </div>
                  <Progress 
                    value={getStockPercentage(resource.currentStock, resource.minRequired)} 
                    className={resource.status === "Critical" ? "bg-red-100" : ""}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Min required: {resource.minRequired}</span>
                    <span>Updated: {resource.lastUpdated}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
