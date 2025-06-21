// Define interfaces for our database documents
export interface Patient {
  _id: string;
  _rev?: string;
  type: 'patient';
  name: string;
  age: number;
  gender: string;
  phone: string;
  condition: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  medicalHistory?: string;
  // Multi-location support
  registeredLocationId: string;
  currentLocationId?: string;
  locationHistory?: LocationTransfer[];
  createdAt: string;
}

// Multi-location support interfaces
export interface Location {
  _id: string;
  _rev?: string;
  type: 'location';
  name: string;
  locationCode: string; // Unique identifier
  locationType: 'main-hospital' | 'clinic' | 'health-center' | 'specialty-center' | 'branch';
  parentLocationId?: string; // For hierarchical structure
  
  // Contact Information
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  contactInfo: {
    phone: string;
    email: string;
    website?: string;
    emergencyPhone?: string;
  };
  
  // Operational Information
  operatingHours: {
    [key: string]: {
      open: string;
      close: string;
      isOpen: boolean;
    };
  };
  
  // Services and Capabilities
  services: {
    emergency: boolean;
    outpatient: boolean;
    inpatient: boolean;
    surgery: boolean;
    icu: boolean;
    pediatrics: boolean;
    maternity: boolean;
    laboratory: boolean;
    pharmacy: boolean;
    radiology: boolean;
    cardiology: boolean;
    orthopedics: boolean;
    neurology: boolean;
    oncology: boolean;
    psychiatry: boolean;
    dermatology: boolean;
    ophthalmology: boolean;
    ent: boolean;
    dental: boolean;
    physiotherapy: boolean;
    dialysis: boolean;
    bloodBank: boolean;
  };
  
  // Capacity Information
  capacity: {
    totalBeds: number;
    availableBeds: number;
    icuBeds: number;
    emergencyBeds: number;
    operatingRooms: number;
    outpatientRooms: number;
  };
  
  // Staff Information
  staffCount: {
    doctors: number;
    nurses: number;
    technicians: number;
    administrators: number;
    support: number;
  };
  
  // Equipment and Resources
  equipment: {
    ctScan: boolean;
    mri: boolean;
    xRay: boolean;
    ultrasound: boolean;
    mammography: boolean;
    ecg: boolean;
    ventilators: number;
    ambulances: number;
  };
  
  // Administrative Information
  managerId?: string; // Location manager
  establishedDate: string;
  licenseNumber?: string;
  accreditation?: string[];
  status: 'active' | 'inactive' | 'under-construction' | 'temporarily-closed';
  
  createdAt: string;
  updatedAt: string;
}

export interface LocationTransfer {
  _id: string;
  _rev?: string;
  type: 'location-transfer';
  patientId: string;
  fromLocationId: string;
  toLocationId: string;
  transferDate: string;
  transferReason: string;
  transferType: 'emergency' | 'routine' | 'specialty-care' | 'capacity';
  requestedBy: string;
  approvedBy?: string;
  transportMethod: 'ambulance' | 'private' | 'public' | 'air-transport';
  medicalEscort: boolean;
  status: 'pending' | 'approved' | 'in-transit' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  completedAt?: string;
}

export interface MultiLocationUser {
  _id: string;
  _rev?: string;
  type: 'multi-location-user';
  userId: string;
  primaryLocationId: string;
  accessibleLocations: string[]; // Array of location IDs user can access
  permissions: {
    [locationId: string]: {
      canRead: boolean;
      canWrite: boolean;
      canDelete: boolean;
      canManage: boolean;
      canTransfer: boolean;
      departments?: string[];
    };
  };
  role: 'super-admin' | 'location-admin' | 'doctor' | 'nurse' | 'technician' | 'staff';
  createdAt: string;
  updatedAt: string;
}

export interface LocationSettings {
  _id: string;
  _rev?: string;
  type: 'location-settings';
  locationId: string;
  
  // Centralized Settings
  organizationName: string;
  locationName: string;
  timezone: string;
  currency: string;
  language: string;
  
  // Operational Settings
  workingHours: {
    [key: string]: {
      start: string;
      end: string;
      breaks?: { start: string; end: string }[];
    };
  };
  
  // Integration Settings
  integrations: {
    emr: boolean;
    billing: boolean;
    laboratory: boolean;
    pharmacy: boolean;
    radiology: boolean;
  };
  
  // Notification Settings
  notifications: {
    emergencyAlerts: boolean;
    transferRequests: boolean;
    capacityWarnings: boolean;
    staffAlerts: boolean;
    systemUpdates: boolean;
  };
  
  // Security Settings
  security: {
    requireTwoFactor: boolean;
    sessionTimeout: number; // minutes
    allowRemoteAccess: boolean;
    ipWhitelist?: string[];
  };
  
  createdAt: string;
  updatedAt: string;
}

export interface Nurse {
  _id: string;
  _rev?: string;
  type: 'nurse';
  name: string;
  specialization: string;
  ward: string;
  shift: string;
  contactNumber: string;
  experience: string;
  // Multi-location support
  assignedLocationId: string;
  accessibleLocations?: string[];
}

export interface Appointment {
  _id: string;
  _rev?: string;
  type: 'appointment';
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  doctor: string;
  appointmentType: string;
  status: string;
  notes?: string;
  // Multi-location support
  locationId: string;
}

// Enhanced Lab Test interfaces
export interface TestParameter {
  id: string;
  name: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: 'Normal' | 'High' | 'Low' | 'Critical' | 'Abnormal';
  type: 'number' | 'text' | 'select';
  options?: string[];
}

export interface LabTest {
  _id: string;
  _rev?: string;
  type: 'labTest';
  patientId: string;
  patientName: string;
  testType: string;
  testCategory: string;
  specificTest: string;
  requestedBy: string;
  status: 'Pending' | 'Collected' | 'Processing' | 'Completed' | 'Cancelled';
  priority: 'Routine' | 'Urgent' | 'STAT' | 'High';
  requestDate: string;
  collectionDate?: string;
  completionDate?: string;
  sampleId?: string;
  
  // Test Results
  testParameters?: TestParameter[];
  clinicalNotes?: string;
  technician?: string;
  reviewedBy?: string;
  reviewDate?: string;
  
  // Flags and Alerts
  abnormalResults: boolean;
  criticalValues: boolean;
  requiresFollowUp: boolean;
  
  // Legacy fields for backward compatibility
  result?: string;
  resultDetails?: string;
  
  // Multi-location support
  locationId: string;
  labLocationId?: string; // Location where test is performed (may be different)
}

export interface LabRequest {
  _id: string;
  _rev?: string;
  type: 'labRequest';
  patientId: string;
  patientName: string;
  requestedTests: {
    testType: string;
    testCategory: string;
    specificTest: string;
    priority: 'Routine' | 'Urgent' | 'STAT' | 'High';
  }[];
  requestedBy: string;
  requestDate: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Completed';
  notes?: string;
  approvedBy?: string;
  approvalDate?: string;
  // Multi-location support
  requestingLocationId: string;
  labLocationId?: string;
}

export interface User {
  _id: string;
  _rev?: string;
  type: 'user';
  username: string;
  password: string;
  role: 'admin' | 'doctor' | 'nurse' | 'receptionist' | 'labtech';
  name: string;
  // Multi-location support
  primaryLocationId?: string;
  accessibleLocations?: string[];
}

export interface Doctor {
  _id: string;
  _rev?: string;
  type: 'doctor';
  name: string;
  specialization: string;
  contactNumber: string;
  email: string;
  availability?: string[];
  experience?: string;
  
  // Maternal Health Specialization
  maternalHealthSpecialist?: boolean;
  maternalHealthCertifications?: string[];
  maternalHealthExperience?: number; // years
  
  // Maternal Mortality Tracking Capabilities
  canManageMaternalCases?: boolean;
  canPerformEmergencyObstetricCare?: boolean;
  canPerformSurgery?: boolean;
  
  // Performance Metrics for Maternal Health
  maternalCasesHandled?: number;
  maternalSuccessRate?: number; // percentage
  emergencyResponseTime?: number; // average minutes
  
  // Facility Assignment
  primaryFacilityId?: string;
  secondaryFacilities?: string[];
  
  // Availability for Maternal Emergencies
  emergencyAvailable?: boolean;
  onCallSchedule?: {
    day: string;
    startTime: string;
    endTime: string;
  }[];
  
  // Multi-location support
  primaryLocationId: string;
  workingLocations: string[]; // Array of location IDs where doctor works
  locationSchedule?: {
    [locationId: string]: {
      days: string[];
      hours: { start: string; end: string };
    };
  };
}

export interface Medication {
  _id: string;
  _rev?: string;
  type: 'medication';
  name: string;
  dosage: string;
  frequency: string;
  instructions: string;
  patientId?: string;
  patientName?: string;
  prescribedBy?: string;
  prescriptionDate?: string;
  // Multi-location support
  prescribedAtLocationId?: string;
  dispensedAtLocationId?: string;
}

// Export maternal mortality types
export * from './maternal-types';
