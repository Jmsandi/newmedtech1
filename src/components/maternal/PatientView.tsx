import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  Droplet, 
  ArrowLeft,
  Edit,
  ChevronDown,
  TrendingUp
} from "lucide-react";
import { getAllMaternalPatients, type MaternalPatient } from "@/services/database/maternal-mortality";

interface TestDataPoint {
  week: number;
  value: number;
}

interface TestInfo {
  name: string;
  unit: string;
  currentLevel: number;
  normalRange: string;
  status: 'normal' | 'high' | 'low';
  data: TestDataPoint[];
}

export const PatientView = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<MaternalPatient | null>(null);
  const [selectedTest, setSelectedTest] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  // Mock test data for different test types
  const testData: Record<string, TestInfo> = {
    'hcg-levels': {
      name: 'HCG Levels',
      unit: 'mIU/mL',
      currentLevel: 8200,
      normalRange: '2,700-78,100',
      status: 'normal',
      data: [
        { week: 4, value: 0 },
        { week: 5, value: 750 },
        { week: 6, value: 1200 },
        { week: 8, value: 7500 },
        { week: 10, value: 14000 },
        { week: 12, value: 22000 },
        { week: 16, value: 18000 },
        { week: 20, value: 11500 },
        { week: 24, value: 8200 }
      ]
    },
    'blood-pressure': {
      name: 'Blood Pressure (Systolic)',
      unit: 'mmHg',
      currentLevel: 118,
      normalRange: '90-140',
      status: 'normal',
      data: [
        { week: 8, value: 115 },
        { week: 12, value: 120 },
        { week: 16, value: 125 },
        { week: 20, value: 122 },
        { week: 24, value: 118 }
      ]
    },
    'hemoglobin': {
      name: 'Hemoglobin',
      unit: 'g/dL',
      currentLevel: 11.2,
      normalRange: '11.0-15.0',
      status: 'normal',
      data: [
        { week: 8, value: 12.5 },
        { week: 12, value: 11.8 },
        { week: 16, value: 11.5 },
        { week: 20, value: 11.3 },
        { week: 24, value: 11.2 }
      ]
    },
    'glucose': {
      name: 'Glucose Level',
      unit: 'mg/dL',
      currentLevel: 95,
      normalRange: '70-140',
      status: 'normal',
      data: [
        { week: 8, value: 88 },
        { week: 12, value: 92 },
        { week: 16, value: 94 },
        { week: 20, value: 96 },
        { week: 24, value: 95 }
      ]
    },
    'blood': {
      name: 'Blood Test (WBC Count)',
      unit: '×10³/μL',
      currentLevel: 8.5,
      normalRange: '4.0-11.0',
      status: 'normal',
      data: [
        { week: 8, value: 7.2 },
        { week: 12, value: 7.8 },
        { week: 16, value: 8.1 },
        { week: 20, value: 8.4 },
        { week: 24, value: 8.5 }
      ]
    },
    'heartRate': {
      name: 'Heart Rate',
      unit: 'bpm',
      currentLevel: 85,
      normalRange: '60-100',
      status: 'normal',
      data: [
        { week: 8, value: 78 },
        { week: 12, value: 82 },
        { week: 16, value: 84 },
        { week: 20, value: 86 },
        { week: 24, value: 85 }
      ]
    },
    'urine': {
      name: 'Urine Protein',
      unit: 'mg/dL',
      currentLevel: 15,
      normalRange: '0-30',
      status: 'normal',
      data: [
        { week: 8, value: 8 },
        { week: 12, value: 12 },
        { week: 16, value: 14 },
        { week: 20, value: 16 },
        { week: 24, value: 15 }
      ]
    }
  };

  // Mock patient data for immediate testing
  const mockPatients: MaternalPatient[] = [
    {
      _id: 'mock_patient_001',
      type: 'maternal-patient',
      firstName: 'Sarah',
      lastName: 'Johnson',
      dateOfBirth: '1985-03-15',
      nationalId: '001',
      phoneNumber: '+1 (555) 123-4567',
      emergencyContact: 'John Johnson',
      emergencyPhone: '+1 (555) 123-4568',
      address: '123 Main St, Springfield, IL',
      district: 'Central District',
      village: 'Westlands',
      gestationalAge: 24,
      parity: 1,
      gravidity: 2,
      expectedDeliveryDate: '2025-03-15',
      currentPregnancyNumber: 2,
      previousComplications: ['Preeclampsia'],
      chronicDiseases: ['Hypertension'],
      allergies: [],
      currentMedications: ['Methyldopa 250mg'],
      bloodType: 'O+',
      education: 'tertiary',
      occupation: 'Teacher',
      maritalStatus: 'married',
      householdIncome: 'medium',
      registeredBy: 'Dr. Mary Nurse',
      registrationDate: '2024-01-10',
      facilityId: 'facility_001',
      status: 'active',
      createdAt: '2024-01-10T10:00:00Z',
      updatedAt: '2025-06-18T15:30:00Z'
    },
    {
      _id: 'mock_patient_002',
      type: 'maternal-patient',
      firstName: 'Maria',
      lastName: 'Rodriguez',
      dateOfBirth: '1990-07-22',
      nationalId: '002',
      phoneNumber: '+1 (555) 333-3333',
      emergencyContact: 'Carlos Rodriguez',
      emergencyPhone: '+1 (555) 444-4444',
      address: '456 Oak Avenue, Northern Region',
      district: 'Northern Region',
      village: 'Kileleshwa',
      gestationalAge: 28,
      parity: 0,
      gravidity: 1,
      expectedDeliveryDate: '2025-09-01',
      currentPregnancyNumber: 1,
      previousComplications: [],
      chronicDiseases: ['Diabetes Type 2'],
      allergies: ['Penicillin'],
      currentMedications: ['Insulin', 'Folic Acid'],
      bloodType: 'A+',
      education: 'secondary',
      occupation: 'Shop Owner',
      maritalStatus: 'married',
      householdIncome: 'low',
      registeredBy: 'Nurse Jane Doe',
      registrationDate: '2024-01-15',
      facilityId: 'facility_001',
      status: 'active',
      createdAt: '2024-01-15T14:00:00Z',
      updatedAt: '2024-01-25T09:45:00Z'
    },
    {
      _id: 'mock_patient_003',
      type: 'maternal-patient',
      firstName: 'Emma',
      lastName: 'Thompson',
      dateOfBirth: '1992-11-08',
      nationalId: '003',
      phoneNumber: '+1 (555) 555-5555',
      emergencyContact: 'David Thompson',
      emergencyPhone: '+1 (555) 555-5556',
      address: '789 Pine Street, Eastern District',
      district: 'Eastern District',
      village: 'Karen',
      gestationalAge: 24,
      parity: 2,
      gravidity: 3,
      expectedDeliveryDate: '2025-10-15',
      currentPregnancyNumber: 3,
      previousComplications: ['Gestational Diabetes'],
      chronicDiseases: [],
      allergies: ['Latex'],
      currentMedications: ['Prenatal vitamins', 'Iron supplements'],
      bloodType: 'B+',
      education: 'tertiary',
      occupation: 'Nurse',
      maritalStatus: 'married',
      householdIncome: 'high',
      registeredBy: 'Dr. Sarah Wilson',
      registrationDate: '2024-02-01',
      facilityId: 'facility_001',
      status: 'active',
      createdAt: '2024-02-01T08:00:00Z',
      updatedAt: '2024-02-15T11:20:00Z'
    },
    {
      _id: 'mock_patient_004',
      type: 'maternal-patient',
      firstName: 'Aisha',
      lastName: 'Patel',
      dateOfBirth: '1988-05-12',
      nationalId: '004',
      phoneNumber: '+1 (555) 777-7777',
      emergencyContact: 'Raj Patel',
      emergencyPhone: '+1 (555) 777-7778',
      address: '321 Elm Drive, Western Region',
      district: 'Western Region',
      village: 'Lavington',
      gestationalAge: 36,
      parity: 1,
      gravidity: 2,
      expectedDeliveryDate: '2025-07-20',
      currentPregnancyNumber: 2,
      previousComplications: [],
      chronicDiseases: ['Asthma'],
      allergies: ['Shellfish'],
      currentMedications: ['Albuterol inhaler', 'Prenatal vitamins'],
      bloodType: 'AB+',
      education: 'tertiary',
      occupation: 'Software Engineer',
      maritalStatus: 'married',
      householdIncome: 'high',
      registeredBy: 'Dr. Michael Chen',
      registrationDate: '2024-01-20',
      facilityId: 'facility_001',
      status: 'active',
      createdAt: '2024-01-20T09:30:00Z',
      updatedAt: '2024-02-10T14:15:00Z'
    },
    {
      _id: 'mock_patient_005',
      type: 'maternal-patient',
      firstName: 'Grace',
      lastName: 'Ochieng',
      dateOfBirth: '1995-09-25',
      nationalId: '005',
      phoneNumber: '+1 (555) 888-8888',
      emergencyContact: 'Peter Ochieng',
      emergencyPhone: '+1 (555) 888-8889',
      address: '654 Maple Lane, Southern District',
      district: 'Southern District',
      village: 'Langata',
      gestationalAge: 20,
      parity: 0,
      gravidity: 1,
      expectedDeliveryDate: '2025-11-30',
      currentPregnancyNumber: 1,
      previousComplications: [],
      chronicDiseases: [],
      allergies: [],
      currentMedications: ['Folic acid', 'Iron supplements'],
      bloodType: 'O-',
      education: 'secondary',
      occupation: 'Student',
      maritalStatus: 'single',
      householdIncome: 'low',
      registeredBy: 'Nurse Patricia Wanjiku',
      registrationDate: '2024-02-10',
      facilityId: 'facility_001',
      status: 'active',
      createdAt: '2024-02-10T13:45:00Z',
      updatedAt: '2024-02-20T10:30:00Z'
    }
  ];

  useEffect(() => {
    // Find patient in mock data
    const foundPatient = mockPatients.find(p => p._id === patientId);
    setPatient(foundPatient || null);
    setIsLoading(false);
  }, [patientId]);

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleBack = () => {
    navigate('/maternal/patient-management');
  };

  const handleEdit = () => {
    navigate(`/maternal/patient-edit/${patientId}`);
  };

  const handleTestSelect = (testValue: string) => {
    setSelectedTest(testValue);
  };

  // Simple SVG Line Chart Component
  const LineChart = ({ data, testInfo }: { data: TestDataPoint[], testInfo: TestInfo }) => {
    const width = 800;
    const height = 400;
    const padding = 60;
    
    const maxValue = Math.max(...data.map(d => d.value)) * 1.1;
    const minValue = 0;
    const maxWeek = Math.max(...data.map(d => d.week));
    const minWeek = Math.min(...data.map(d => d.week));
    
    const xScale = (week: number) => ((week - minWeek) / (maxWeek - minWeek)) * (width - 2 * padding) + padding;
    const yScale = (value: number) => height - padding - ((value - minValue) / (maxValue - minValue)) * (height - 2 * padding);
    
    const pathData = data.map((point, index) => {
      const x = xScale(point.week);
      const y = yScale(point.value);
      return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    }).join(' ');

    return (
      <div className="w-full">
        <svg width="100%" height="400" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width={width} height={height} fill="url(#grid)" opacity="0.5"/>
          
          {/* Y-axis labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const value = minValue + (maxValue - minValue) * ratio;
            const y = yScale(value);
            return (
              <g key={ratio}>
                <text x={padding - 10} y={y + 5} textAnchor="end" className="text-sm fill-gray-500">
                  {value.toLocaleString()}
                </text>
                <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#e5e7eb" strokeWidth="1"/>
              </g>
            );
          })}
          
          {/* X-axis labels */}
          {data.map((point) => {
            const x = xScale(point.week);
            return (
              <text key={point.week} x={x} y={height - padding + 20} textAnchor="middle" className="text-sm fill-gray-500">
                {point.week}
              </text>
            );
          })}
          
          {/* X-axis title */}
          <text x={width / 2} y={height - 10} textAnchor="middle" className="text-sm fill-gray-600 font-medium">
            Weeks
          </text>
          
          {/* Y-axis title */}
          <text x={20} y={height / 2} textAnchor="middle" transform={`rotate(-90, 20, ${height / 2})`} className="text-sm fill-gray-600 font-medium">
            {testInfo.name} ({testInfo.unit})
          </text>
          
          {/* Line */}
          <path d={pathData} fill="none" stroke="url(#gradient)" strokeWidth="3"/>
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ec4899"/>
              <stop offset="100%" stopColor="#8b5cf6"/>
            </linearGradient>
          </defs>
          
          {/* Data points */}
          {data.map((point) => (
            <circle
              key={point.week}
              cx={xScale(point.week)}
              cy={yScale(point.value)}
              r="6"
              fill="#8b5cf6"
              stroke="white"
              strokeWidth="2"
            />
          ))}
        </svg>
        
        {/* Legend */}
        <div className="flex items-center justify-center mt-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-gradient-to-r from-pink-500 to-purple-600"></div>
            <span className="text-sm text-purple-600">value</span>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <div className="p-6">Loading patient data...</div>;
  }

  if (!patient) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Patient Not Found</h2>
          <Button onClick={handleBack}>Back to Patient Management</Button>
        </div>
      </div>
    );
  }

  const age = calculateAge(patient.dateOfBirth);
  const dueDate = new Date(patient.expectedDeliveryDate).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  const lastVisit = new Date(patient.updatedAt).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Generate email from name for display
  const email = `${patient.firstName.toLowerCase()}.${patient.lastName.toLowerCase()}@email.com`;
  
  const currentTestInfo = selectedTest ? testData[selectedTest] : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="sm" onClick={handleBack} className="text-gray-600">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button variant="outline" onClick={handleEdit} className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit Patient
            </Button>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Maternal Health Monitor</h1>
            <p className="text-gray-600 text-lg">Comprehensive pregnancy health tracking</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        
        {/* Patient Information Card */}
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <User className="h-5 w-5 text-pink-500" />
              Patient Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Basic Info Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-pink-500" />
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-semibold text-gray-900">{patient.firstName} {patient.lastName}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-semibold text-gray-900">{patient.phoneNumber}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Age | Due Date</p>
                    <p className="font-semibold text-gray-900">{age} years | {dueDate}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-semibold text-gray-900">{email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-pink-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Current Week</p>
                <p className="text-2xl font-bold text-pink-600">{patient.gestationalAge} weeks</p>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Blood Type</p>
                <p className="text-2xl font-bold text-purple-600">{patient.bloodType}</p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Last Visit</p>
                <p className="text-xl font-bold text-blue-600">{lastVisit}</p>
              </div>
            </div>
            
          </CardContent>
        </Card>

        {/* Select Maternal Test Section */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Select Maternal Test</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedTest} onValueChange={handleTestSelect}>
              <SelectTrigger className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white border-0 h-12">
                <SelectValue placeholder="Select a test type" />
                <ChevronDown className="h-4 w-4 ml-2" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hcg-levels">HCG Levels</SelectItem>
                <SelectItem value="blood-pressure">Blood Pressure</SelectItem>
                <SelectItem value="hemoglobin">Hemoglobin</SelectItem>
                <SelectItem value="glucose">Glucose Level</SelectItem>
                <SelectItem value="blood">Blood Test</SelectItem>
                <SelectItem value="heartRate">Heart Rate</SelectItem>
                <SelectItem value="urine">Urine Test</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Test Results Chart */}
        {currentTestInfo && (
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <TrendingUp className="h-5 w-5" />
                {currentTestInfo.name} Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <LineChart data={currentTestInfo.data} testInfo={currentTestInfo} />
                
                {/* Current Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Current Level:</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {currentTestInfo.currentLevel.toLocaleString()} {currentTestInfo.unit} 
                      <span className="text-sm text-gray-500 ml-2">
                        (Normal range: {currentTestInfo.normalRange})
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Status:</p>
                    <Badge 
                      variant={currentTestInfo.status === 'normal' ? 'default' : 'destructive'}
                      className={currentTestInfo.status === 'normal' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {currentTestInfo.status === 'normal' ? 'Within Normal Range' : 
                       currentTestInfo.status === 'high' ? 'Above Normal Range' : 'Below Normal Range'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}; 
