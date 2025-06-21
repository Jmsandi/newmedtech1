
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Save, UserPlus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export const PatientRegistration = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Patient Registered",
      description: "Patient information has been successfully recorded.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            New Patient Registration
          </CardTitle>
          <CardDescription>
            Register a new pregnant patient for maternal health monitoring
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Personal Details</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input id="fullName" placeholder="Enter patient's full name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age *</Label>
                  <Input id="age" type="number" placeholder="Age in years" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="idNumber">ID Number</Label>
                  <Input id="idNumber" placeholder="National ID or passport number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="patient@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Emergency Contact</Label>
                  <Input id="emergencyContact" placeholder="Emergency contact number" />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Address Information</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Textarea id="address" placeholder="Enter full address" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district">District/Region</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select district" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="central">Central District</SelectItem>
                      <SelectItem value="northern">Northern Region</SelectItem>
                      <SelectItem value="eastern">Eastern Area</SelectItem>
                      <SelectItem value="western">Western Zone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Pregnancy Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Pregnancy Details</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="gestationalAge">Gestational Age (weeks)</Label>
                  <Input id="gestationalAge" type="number" placeholder="Weeks" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gravidity">Gravidity</Label>
                  <Input id="gravidity" type="number" placeholder="Number of pregnancies" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parity">Parity</Label>
                  <Input id="parity" type="number" placeholder="Number of births" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Last Menstrual Period (LMP)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : "Select LMP date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Medical History */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Medical History</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="chronicDiseases">Chronic Diseases</Label>
                  <Textarea id="chronicDiseases" placeholder="List any chronic conditions" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="previousComplications">Previous Pregnancy Complications</Label>
                  <Textarea id="previousComplications" placeholder="Previous complications or issues" />
                </div>
              </div>
            </div>

            {/* Socioeconomic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Socioeconomic Information</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="education">Education Level</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select education level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No formal education</SelectItem>
                      <SelectItem value="primary">Primary education</SelectItem>
                      <SelectItem value="secondary">Secondary education</SelectItem>
                      <SelectItem value="tertiary">Tertiary education</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input id="occupation" placeholder="Patient's occupation" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="income">Monthly Income Range</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select income range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Below $200</SelectItem>
                      <SelectItem value="medium">$200 - $500</SelectItem>
                      <SelectItem value="high">Above $500</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="insurance">Insurance Provider</Label>
                  <Input id="insurance" placeholder="Insurance company or coverage" />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline">Cancel</Button>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                Register Patient
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
