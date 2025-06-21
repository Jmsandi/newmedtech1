// Maternal Mortality specific database types
export interface MaternalPatient {
  _id: string;
  _rev?: string;
  type: 'maternal-patient';
  // Personal Information
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationalId: string;
  phoneNumber: string;
  emergencyContact: string;
  emergencyPhone: string;
  address: string;
  district: string;
  village: string;
  
  // Pregnancy Information
  gestationalAge: number; // weeks
  parity: number; // number of previous births
  gravidity: number; // number of pregnancies
  expectedDeliveryDate: string;
  currentPregnancyNumber: number;
  
  // Medical History
  previousComplications: string[];
  chronicDiseases: string[];
  allergies: string[];
  currentMedications: string[];
  bloodType: string;
  
  // Socioeconomic Data
  education: 'none' | 'primary' | 'secondary' | 'tertiary';
  occupation: string;
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  householdIncome: 'low' | 'medium' | 'high';
  
  // Registration Info
  registeredBy: string;
  registrationDate: string;
  facilityId: string;
  status: 'active' | 'delivered' | 'referred' | 'deceased';
  
  createdAt: string;
  updatedAt: string;
}

export interface HealthFacility {
  _id: string;
  _rev?: string;
  type: 'health-facility';
  name: string;
  facilityType: 'clinic' | 'health-center' | 'district-hospital' | 'referral-hospital';
  location: {
    district: string;
    region: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  
  // Available Services
  services: {
    antenatalCare: boolean;
    delivery: boolean;
    emergencyObstetricCare: boolean;
    surgery: boolean;
    bloodTransfusion: boolean;
    icu: boolean;
  };
  
  // Staff Information
  staff: {
    doctors: number;
    nurses: number;
    midwives: number;
    specialists: number;
  };
  
  // Equipment Status
  equipment: {
    ultrasound: boolean;
    operatingTheater: boolean;
    ambulance: boolean;
    oxygenSupply: boolean;
    bloodBank: boolean;
  };
  
  contactNumber: string;
  email?: string;
  operatingHours: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface ANCVisit {
  _id: string;
  _rev?: string;
  type: 'anc-visit';
  patientId: string;
  facilityId: string;
  visitNumber: number;
  visitDate: string;
  gestationalAge: number;
  
  // Vitals
  vitals: {
    weight: number;
    bloodPressure: {
      systolic: number;
      diastolic: number;
    };
    hemoglobin: number;
    temperature: number;
    heartRate: number;
  };
  
  // Examinations
  examinations: {
    fundalHeight: number;
    fetalHeartRate: number;
    presentation: string;
    edema: boolean;
    proteinuria: boolean;
  };
  
  // Risk Factors Detected
  riskFactors: string[];
  complications: string[];
  
  // Medications Prescribed
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }>;
  
  // Next Appointment
  nextAppointment: string;
  
  // Provider Information
  attendedBy: string;
  notes: string;
  
  createdAt: string;
}

export interface RiskAssessment {
  _id: string;
  _rev?: string;
  type: 'risk-assessment';
  patientId: string;
  assessmentDate: string;
  
  // Risk Score (0-100)
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  
  // Risk Factors
  riskFactors: Array<{
    factor: string;
    weight: number;
    present: boolean;
    severity?: 'mild' | 'moderate' | 'severe';
  }>;
  
  // Recommendations
  recommendations: string[];
  interventionsRequired: string[];
  
  // Follow-up
  nextAssessmentDate: string;
  urgentReferralRequired: boolean;
  
  assessedBy: string;
  createdAt: string;
}

export interface EmergencyAlert {
  _id: string;
  _rev?: string;
  type: 'emergency-alert';
  patientId: string;
  facilityId: string;
  alertType: 'complication' | 'missed-visit' | 'high-risk' | 'emergency';
  severity: 'low' | 'medium' | 'high' | 'critical';
  
  title: string;
  description: string;
  
  // Alert Status
  status: 'active' | 'acknowledged' | 'resolved' | 'escalated';
  createdBy: string;
  acknowledgedBy?: string;
  resolvedBy?: string;
  
  // Response Information
  responseTime?: number; // minutes
  interventionTaken?: string;
  outcome?: string;
  
  createdAt: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
}

export interface MaternalIncident {
  _id: string;
  _rev?: string;
  type: 'maternal-incident';
  patientId: string;
  facilityId: string;
  
  // Incident Details
  incidentType: 'complication' | 'near-miss' | 'maternal-death';
  incidentDate: string;
  gestationalAge: number;
  
  // Clinical Information
  primaryCause: string;
  contributingFactors: string[];
  symptomsPresented: string[];
  
  // Response
  interventionsTried: string[];
  timeToIntervention: number; // minutes
  referralMade: boolean;
  referralFacility?: string;
  
  // Outcome
  outcome: 'recovered' | 'referred' | 'complicated' | 'death';
  
  // Investigation
  preventable: boolean;
  lessonsLearned: string[];
  recommendedActions: string[];
  
  reportedBy: string;
  investigatedBy?: string;
  
  createdAt: string;
  investigatedAt?: string;
}

export interface ReferralRecord {
  _id: string;
  _rev?: string;
  type: 'referral-record';
  patientId: string;
  fromFacility: string;
  toFacility: string;
  
  // Referral Information
  referralDate: string;
  referralReason: string;
  urgency: 'routine' | 'urgent' | 'emergency';
  
  // Clinical Information
  clinicalSummary: string;
  vitalsAtReferral: {
    bloodPressure: string;
    pulse: number;
    temperature: number;
    consciousness: string;
  };
  
  // Transport
  transportMode: 'ambulance' | 'private' | 'public';
  accompaniedBy: string;
  estimatedArrivalTime: string;
  
  // Status
  status: 'pending' | 'in-transit' | 'arrived' | 'completed' | 'cancelled';
  
  // Feedback
  receivingFacilityNotes?: string;
  outcome?: string;
  
  referredBy: string;
  receivedBy?: string;
  
  createdAt: string;
  arrivedAt?: string;
  completedAt?: string;
}

// Maternal Lab Test interfaces - linking lab tests to maternal mortality tracking
export interface MaternalLabTest {
  _id: string;
  _rev?: string;
  type: 'maternal-lab-test';
  
  // Patient Information
  maternalPatientId: string;
  patientName: string;
  gestationalAge: number;
  
  // Lab Test Details
  testType: string;
  testCategory: 'prenatal-screening' | 'routine-monitoring' | 'risk-assessment' | 'emergency-diagnostic';
  specificTest: string;
  sampleId: string;
  
  // Test Parameters with Maternal-Specific Reference Ranges
  testParameters: MaternalTestParameter[];
  
  // Maternal Risk Assessment
  maternalRiskFactors: {
    preeclampsia: boolean;
    gestationalDiabetes: boolean;
    anemia: boolean;
    infection: boolean;
    bloodDisorders: boolean;
    liverDysfunction: boolean;
    kidneyProblems: boolean;
  };
  
  // Risk Scoring
  riskScore: number; // 0-100
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  
  // Clinical Significance
  clinicalInterpretation: string;
  recommendedActions: string[];
  urgentReferralRequired: boolean;
  
  // Timing and Status
  requestDate: string;
  collectionDate: string;
  completionDate?: string;
  status: 'Pending' | 'Collected' | 'Processing' | 'Completed' | 'Critical-Alert';
  
  // Healthcare Providers
  requestedBy: string;
  technician?: string;
  reviewedBy?: string;
  reviewDate?: string;
  
  // Follow-up
  requiresFollowUp: boolean;
  followUpDate?: string;
  followUpNotes?: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface MaternalTestParameter {
  id: string;
  name: string;
  value: string;
  unit: string;
  
  // Gestational Age-Specific Reference Ranges
  referenceRange: string;
  trimesterSpecificRange?: {
    first?: string;
    second?: string;
    third?: string;
  };
  
  // Status and Risk Assessment
  status: 'Normal' | 'Borderline' | 'Abnormal' | 'Critical';
  riskImplication: 'none' | 'low' | 'moderate' | 'high' | 'critical';
  
  // Maternal-Specific Flags
  maternalRiskFlags: {
    preeclampsiaRisk: boolean;
    gestationalDiabetesRisk: boolean;
    anemiaRisk: boolean;
    infectionRisk: boolean;
    hemorrhageRisk: boolean;
  };
  
  type: 'number' | 'text' | 'select';
  options?: string[];
}

// Maternal Lab Risk Profile - aggregated risk assessment from multiple lab tests
export interface MaternalLabRiskProfile {
  _id: string;
  _rev?: string;
  type: 'maternal-lab-risk-profile';
  
  maternalPatientId: string;
  patientName: string;
  gestationalAge: number;
  
  // Aggregated Risk Scores from Lab Tests
  overallRiskScore: number; // 0-100
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  
  // Specific Risk Categories
  riskCategories: {
    preeclampsia: {
      score: number;
      level: 'low' | 'moderate' | 'high' | 'critical';
      contributingTests: string[];
    };
    gestationalDiabetes: {
      score: number;
      level: 'low' | 'moderate' | 'high' | 'critical';
      contributingTests: string[];
    };
    anemia: {
      score: number;
      level: 'low' | 'moderate' | 'high' | 'critical';
      contributingTests: string[];
    };
    infection: {
      score: number;
      level: 'low' | 'moderate' | 'high' | 'critical';
      contributingTests: string[];
    };
    hemorrhage: {
      score: number;
      level: 'low' | 'moderate' | 'high' | 'critical';
      contributingTests: string[];
    };
  };
  
  // Lab-Based Recommendations
  recommendations: {
    immediateActions: string[];
    followUpTests: string[];
    clinicalMonitoring: string[];
    referrals: string[];
  };
  
  // Trend Analysis
  trendAnalysis: {
    improving: boolean;
    stable: boolean;
    deteriorating: boolean;
    notes: string;
  };
  
  // Last Updated
  lastLabTestDate: string;
  nextRecommendedTestDate: string;
  
  createdAt: string;
  updatedAt: string;
}

// Maternal Mortality Lab Alert - critical lab values that require immediate attention
export interface MaternalLabAlert {
  _id: string;
  _rev?: string;
  type: 'maternal-lab-alert';
  
  maternalPatientId: string;
  patientName: string;
  labTestId: string;
  
  // Alert Details
  alertType: 'critical-value' | 'trend-deterioration' | 'missed-test' | 'risk-escalation';
  severity: 'medium' | 'high' | 'critical';
  
  title: string;
  description: string;
  
  // Clinical Context
  gestationalAge: number;
  criticalParameters: string[];
  potentialComplications: string[];
  
  // Recommended Actions
  immediateActions: string[];
  timeToAction: number; // minutes
  
  // Status and Response
  status: 'active' | 'acknowledged' | 'resolved';
  createdBy: string;
  acknowledgedBy?: string;
  resolvedBy?: string;
  
  responseTime?: number; // minutes
  actionsTaken?: string[];
  outcome?: string;
  
  createdAt: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
}

// Maternal Lab Test Categories and Configurations
export interface MaternalLabTestConfig {
  category: string;
  tests: {
    [key: string]: {
      name: string;
      gestationalAgeRange: {
        min: number;
        max: number;
      };
      frequency: 'once' | 'each-trimester' | 'monthly' | 'weekly' | 'as-needed';
      parameters: Omit<MaternalTestParameter, 'value' | 'status' | 'riskImplication' | 'maternalRiskFlags'>[];
      riskAssessmentRules: {
        [parameterName: string]: {
          criticalThresholds: {
            high?: number;
            low?: number;
          };
          riskFactors: string[];
        };
      };
    };
  };
}
