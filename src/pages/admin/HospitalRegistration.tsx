import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Building2,
  Plus,
  MapPin,
  Phone,
  Mail,
  Trash2,
  Hospital,
  Building,
  Stethoscope,
  Users,
  Bed,
  Save,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createLocation } from '@/services/database/locations';
import { Location } from '@/services/database/types';

interface HospitalFormData {
  organizationName: string;
  organizationCode: string;
  headquarters: Partial<Location>;
  locations: Partial<Location>[];
}

const HospitalRegistration: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [hospitalData, setHospitalData] = useState<HospitalFormData>({
    organizationName: '',
    organizationCode: '',
    headquarters: {
      name: '',
      locationCode: '',
      locationType: 'main-hospital',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'United States'
      },
      contactInfo: {
        phone: '',
        email: '',
        website: '',
        emergencyPhone: ''
      },
      operatingHours: {
        monday: { open: '06:00', close: '22:00', isOpen: true },
        tuesday: { open: '06:00', close: '22:00', isOpen: true },
        wednesday: { open: '06:00', close: '22:00', isOpen: true },
        thursday: { open: '06:00', close: '22:00', isOpen: true },
        friday: { open: '06:00', close: '22:00', isOpen: true },
        saturday: { open: '08:00', close: '20:00', isOpen: true },
        sunday: { open: '08:00', close: '20:00', isOpen: true }
      },
      services: {
        emergency: true,
        outpatient: true,
        inpatient: true,
        surgery: true,
        icu: true,
        pediatrics: true,
        maternity: true,
        laboratory: true,
        pharmacy: true,
        radiology: true,
        cardiology: false,
        orthopedics: false,
        neurology: false,
        oncology: false,
        psychiatry: false,
        dermatology: false,
        ophthalmology: false,
        ent: false,
        dental: false,
        physiotherapy: false,
        dialysis: false,
        bloodBank: true
      },
      capacity: {
        totalBeds: 100,
        availableBeds: 100,
        icuBeds: 10,
        emergencyBeds: 15,
        operatingRooms: 5,
        outpatientRooms: 20
      },
      staffCount: {
        doctors: 25,
        nurses: 50,
        technicians: 15,
        administrators: 10,
        support: 20
      },
      equipment: {
        ctScan: true,
        mri: true,
        xRay: true,
        ultrasound: true,
        mammography: false,
        ecg: true,
        ventilators: 10,
        ambulances: 3
      },
      establishedDate: new Date().toISOString().split('T')[0],
      status: 'active'
    },
    locations: []
  });

  const addLocation = () => {
    setHospitalData(prev => ({
      ...prev,
      locations: [...prev.locations, {
        name: '',
        locationCode: '',
        locationType: 'clinic',
        address: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'United States'
        },
        contactInfo: {
          phone: '',
          email: ''
        },
        services: {
          emergency: false,
          outpatient: true,
          inpatient: false,
          surgery: false,
          icu: false,
          pediatrics: false,
          maternity: false,
          laboratory: false,
          pharmacy: false,
          radiology: false,
          cardiology: false,
          orthopedics: false,
          neurology: false,
          oncology: false,
          psychiatry: false,
          dermatology: false,
          ophthalmology: false,
          ent: false,
          dental: false,
          physiotherapy: false,
          dialysis: false,
          bloodBank: false
        },
        capacity: {
          totalBeds: 20,
          availableBeds: 20,
          icuBeds: 0,
          emergencyBeds: 2,
          operatingRooms: 1,
          outpatientRooms: 5
        },
        staffCount: {
          doctors: 5,
          nurses: 10,
          technicians: 3,
          administrators: 2,
          support: 5
        },
        equipment: {
          ctScan: false,
          mri: false,
          xRay: true,
          ultrasound: false,
          mammography: false,
          ecg: true,
          ventilators: 2,
          ambulances: 1
        },
        establishedDate: new Date().toISOString().split('T')[0],
        status: 'active'
      }]
    }));
  };

  const removeLocation = (index: number) => {
    setHospitalData(prev => ({
      ...prev,
      locations: prev.locations.filter((_, i) => i !== index)
    }));
  };

  const updateLocation = (index: number, field: string, value: any) => {
    setHospitalData(prev => ({
      ...prev,
      locations: prev.locations.map((loc, i) => 
        i === index ? { ...loc, [field]: value } : loc
      )
    }));
  };

  const updateNestedField = (target: 'headquarters' | number, path: string[], value: any) => {
    setHospitalData(prev => {
      const newData = { ...prev };
      
      if (target === 'headquarters') {
        let current = newData.headquarters as any;
        for (let i = 0; i < path.length - 1; i++) {
          current = current[path[i]];
        }
        current[path[path.length - 1]] = value;
      } else {
        let current = newData.locations[target] as any;
        for (let i = 0; i < path.length - 1; i++) {
          current = current[path[i]];
        }
        current[path[path.length - 1]] = value;
      }
      
      return newData;
    });
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Validate required fields
      if (!hospitalData.organizationName || !hospitalData.headquarters.name) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      // Create headquarters first
      const headquartersId = await createLocation({
        ...hospitalData.headquarters,
        name: hospitalData.headquarters.name || hospitalData.organizationName,
        type: 'location'
      } as Omit<Location, '_id'>);

      // Create other locations with headquarters as parent
      for (const location of hospitalData.locations) {
        if (location.name) {
          await createLocation({
            ...location,
            parentLocationId: headquartersId,
            type: 'location'
          } as Omit<Location, '_id'>);
        }
      }

      toast({
        title: "Success",
        description: `Hospital system "${hospitalData.organizationName}" registered successfully`,
      });

      navigate('/admin/locations');
    } catch (error) {
      console.error('Error registering hospital:', error);
      toast({
        title: "Error",
        description: "Failed to register hospital system",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getLocationTypeIcon = (type: string) => {
    switch (type) {
      case 'main-hospital': return <Hospital className="h-4 w-4" />;
      case 'clinic': return <Building className="h-4 w-4" />;
      case 'health-center': return <Building2 className="h-4 w-4" />;
      case 'specialty-center': return <Stethoscope className="h-4 w-4" />;
      default: return <Building className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => navigate('/admin/locations')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Locations
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-hospital-primary">Register Hospital System</h1>
          <p className="text-muted-foreground">Create a new hospital system with multiple locations and branches</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Organization Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hospital className="h-5 w-5" />
                Organization Information
              </CardTitle>
              <CardDescription>Basic information about the hospital system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Organization Name *</Label>
                  <Input
                    value={hospitalData.organizationName}
                    onChange={(e) => setHospitalData(prev => ({ ...prev, organizationName: e.target.value }))}
                    placeholder="e.g., Central Medical Group"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Organization Code *</Label>
                  <Input
                    value={hospitalData.organizationCode}
                    onChange={(e) => setHospitalData(prev => ({ ...prev, organizationCode: e.target.value }))}
                    placeholder="e.g., CMG"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Headquarters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Main Hospital / Headquarters
              </CardTitle>
              <CardDescription>Primary location that will serve as the headquarters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Hospital Name *</Label>
                  <Input
                    value={hospitalData.headquarters.name || ''}
                    onChange={(e) => updateNestedField('headquarters', ['name'], e.target.value)}
                    placeholder="Main Hospital Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Location Code *</Label>
                  <Input
                    value={hospitalData.headquarters.locationCode || ''}
                    onChange={(e) => updateNestedField('headquarters', ['locationCode'], e.target.value)}
                    placeholder="HQ001"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-4">
                <h4 className="font-medium">Address</h4>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    value={hospitalData.headquarters.address?.street || ''}
                    onChange={(e) => updateNestedField('headquarters', ['address', 'street'], e.target.value)}
                    placeholder="Street Address"
                  />
                  <Input
                    value={hospitalData.headquarters.address?.city || ''}
                    onChange={(e) => updateNestedField('headquarters', ['address', 'city'], e.target.value)}
                    placeholder="City"
                  />
                  <Input
                    value={hospitalData.headquarters.address?.state || ''}
                    onChange={(e) => updateNestedField('headquarters', ['address', 'state'], e.target.value)}
                    placeholder="State"
                  />
                  <Input
                    value={hospitalData.headquarters.address?.zipCode || ''}
                    onChange={(e) => updateNestedField('headquarters', ['address', 'zipCode'], e.target.value)}
                    placeholder="ZIP Code"
                  />
                </div>
              </div>

              {/* Contact */}
              <div className="space-y-4">
                <h4 className="font-medium">Contact Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    value={hospitalData.headquarters.contactInfo?.phone || ''}
                    onChange={(e) => updateNestedField('headquarters', ['contactInfo', 'phone'], e.target.value)}
                    placeholder="Phone Number"
                  />
                  <Input
                    value={hospitalData.headquarters.contactInfo?.email || ''}
                    onChange={(e) => updateNestedField('headquarters', ['contactInfo', 'email'], e.target.value)}
                    placeholder="Email Address"
                  />
                </div>
              </div>

              {/* Capacity */}
              <div className="space-y-4">
                <h4 className="font-medium">Capacity</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Total Beds</Label>
                    <Input
                      type="number"
                      value={hospitalData.headquarters.capacity?.totalBeds || 0}
                      onChange={(e) => updateNestedField('headquarters', ['capacity', 'totalBeds'], parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>ICU Beds</Label>
                    <Input
                      type="number"
                      value={hospitalData.headquarters.capacity?.icuBeds || 0}
                      onChange={(e) => updateNestedField('headquarters', ['capacity', 'icuBeds'], parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Operating Rooms</Label>
                    <Input
                      type="number"
                      value={hospitalData.headquarters.capacity?.operatingRooms || 0}
                      onChange={(e) => updateNestedField('headquarters', ['capacity', 'operatingRooms'], parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Locations */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Additional Locations
                  </CardTitle>
                  <CardDescription>Clinics, branches, and other facilities</CardDescription>
                </div>
                <Button onClick={addLocation} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Location
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {hospitalData.locations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No additional locations added yet</p>
                  <p className="text-sm">Click "Add Location" to create branches and clinics</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {hospitalData.locations.map((location, index) => (
                    <Card key={index} className="border-l-4 border-l-blue-500">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg flex items-center gap-2">
                            {getLocationTypeIcon(location.locationType || 'clinic')}
                            Location {index + 1}
                          </CardTitle>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeLocation(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Location Name *</Label>
                            <Input
                              value={location.name || ''}
                              onChange={(e) => updateLocation(index, 'name', e.target.value)}
                              placeholder="Branch/Clinic Name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Location Code *</Label>
                            <Input
                              value={location.locationCode || ''}
                              onChange={(e) => updateLocation(index, 'locationCode', e.target.value)}
                              placeholder="BR001"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Type</Label>
                            <Select
                              value={location.locationType}
                              onValueChange={(value) => updateLocation(index, 'locationType', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="clinic">Clinic</SelectItem>
                                <SelectItem value="health-center">Health Center</SelectItem>
                                <SelectItem value="specialty-center">Specialty Center</SelectItem>
                                <SelectItem value="branch">Branch Office</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            value={location.address?.street || ''}
                            onChange={(e) => updateNestedField(index, ['address', 'street'], e.target.value)}
                            placeholder="Street Address"
                          />
                          <Input
                            value={location.address?.city || ''}
                            onChange={(e) => updateNestedField(index, ['address', 'city'], e.target.value)}
                            placeholder="City"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            value={location.contactInfo?.phone || ''}
                            onChange={(e) => updateNestedField(index, ['contactInfo', 'phone'], e.target.value)}
                            placeholder="Phone Number"
                          />
                          <Input
                            value={location.contactInfo?.email || ''}
                            onChange={(e) => updateNestedField(index, ['contactInfo', 'email'], e.target.value)}
                            placeholder="Email Address"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Registration Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Organization:</span>
                  <span className="font-medium">{hospitalData.organizationName || 'Not set'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Main Hospital:</span>
                  <span className="font-medium">{hospitalData.headquarters.name || 'Not set'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Additional Locations:</span>
                  <span className="font-medium">{hospitalData.locations.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total Locations:</span>
                  <span className="font-medium">{hospitalData.locations.length + 1}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Capacity Summary</h4>
                <div className="flex justify-between text-sm">
                  <span>Total Beds:</span>
                  <span className="font-medium">
                    {(hospitalData.headquarters.capacity?.totalBeds || 0) + 
                     hospitalData.locations.reduce((sum, loc) => sum + (loc.capacity?.totalBeds || 0), 0)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>ICU Beds:</span>
                  <span className="font-medium">
                    {(hospitalData.headquarters.capacity?.icuBeds || 0) + 
                     hospitalData.locations.reduce((sum, loc) => sum + (loc.capacity?.icuBeds || 0), 0)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Operating Rooms:</span>
                  <span className="font-medium">
                    {(hospitalData.headquarters.capacity?.operatingRooms || 0) + 
                     hospitalData.locations.reduce((sum, loc) => sum + (loc.capacity?.operatingRooms || 0), 0)}
                  </span>
                </div>
              </div>

              <Separator />

              <Button 
                onClick={handleSubmit} 
                className="w-full" 
                disabled={isSubmitting || !hospitalData.organizationName || !hospitalData.headquarters.name}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Registering...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Register Hospital System
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HospitalRegistration; 