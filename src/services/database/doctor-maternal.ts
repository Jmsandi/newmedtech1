import { addDoc, getDoc, updateDoc, deleteDoc, getAllDocs } from './core';
import { getAllDoctors, getDoctorById } from './doctors';
import { getAllMaternalPatients, getMaternalPatientById } from './maternal-mortality';
import { 
  Doctor, 
  MaternalPatient, 
  ANCVisit, 
  RiskAssessment, 
  EmergencyAlert, 
  MaternalIncident,
  ReferralRecord 
} from './types';

// Doctor-Maternal Patient Assignment
export interface DoctorMaternalAssignment {
  _id: string;
  _rev?: string;
  type: 'doctor-maternal-assignment';
  doctorId: string;
  doctorName: string;
  maternalPatientId: string;
  patientName: string;
  assignmentDate: string;
  assignmentType: 'primary' | 'secondary' | 'emergency' | 'consultation';
  status: 'active' | 'completed' | 'transferred' | 'inactive';
  
  // Assignment Details
  gestationalAgeAtAssignment: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  specialCareRequired: string[];
  
  // Care Plan
  carePlan: {
    visitFrequency: 'weekly' | 'bi-weekly' | 'monthly';
    nextAppointment: string;
    specialInstructions: string[];
    monitoringRequirements: string[];
  };
  
  // Outcomes
  deliveryDate?: string;
  deliveryOutcome?: 'normal' | 'cesarean' | 'assisted' | 'complicated';
  maternalOutcome?: 'healthy' | 'complications' | 'critical' | 'deceased';
  fetalOutcome?: 'healthy' | 'complications' | 'stillbirth' | 'neonatal-death';
  
  createdAt: string;
  updatedAt: string;
}

// Doctor Maternal Health Performance
export interface DoctorMaternalPerformance {
  _id: string;
  _rev?: string;
  type: 'doctor-maternal-performance';
  doctorId: string;
  doctorName: string;
  
  // Performance Period
  periodStart: string;
  periodEnd: string;
  
  // Case Statistics
  totalCasesHandled: number;
  highRiskCases: number;
  emergencyCases: number;
  successfulDeliveries: number;
  
  // Outcomes
  maternalMortality: number;
  maternalMorbidity: number;
  neonatalMortality: number;
  cesareanRate: number;
  
  // Response Times
  averageResponseTime: number; // minutes
  emergencyResponseTime: number; // minutes
  
  // Quality Metrics
  patientSatisfactionScore: number; // 1-10
  complicationRate: number; // percentage
  referralAccuracy: number; // percentage
  
  // Continuous Improvement
  trainingCompleted: string[];
  certificationsMaintained: string[];
  
  createdAt: string;
  updatedAt: string;
}

// Maternal Health Consultation
export interface MaternalHealthConsultation {
  _id: string;
  _rev?: string;
  type: 'maternal-health-consultation';
  
  // Consultation Details
  consultingDoctorId: string;
  consultingDoctorName: string;
  requestingDoctorId?: string;
  requestingDoctorName?: string;
  
  // Patient Information
  maternalPatientId: string;
  patientName: string;
  gestationalAge: number;
  
  // Consultation Request
  consultationType: 'routine' | 'urgent' | 'emergency' | 'second-opinion';
  reasonForConsultation: string;
  clinicalFindings: string;
  currentTreatment: string;
  
  // Consultation Response
  consultationDate: string;
  recommendations: string[];
  treatmentPlan: string;
  followUpRequired: boolean;
  followUpDate?: string;
  
  // Urgency and Priority
  priority: 'low' | 'medium' | 'high' | 'critical';
  responseTimeRequired: number; // hours
  actualResponseTime?: number; // hours
  
  status: 'requested' | 'in-progress' | 'completed' | 'cancelled';
  
  createdAt: string;
  updatedAt: string;
}

// CRUD Operations for Doctor-Maternal Assignments
export const createDoctorMaternalAssignment = async (assignment: Omit<DoctorMaternalAssignment, '_id'>): Promise<string> => {
  return await addDoc(assignment);
};

export const getDoctorMaternalAssignment = async (id: string): Promise<DoctorMaternalAssignment | null> => {
  return await getDoc(id) as DoctorMaternalAssignment | null;
};

export const updateDoctorMaternalAssignment = async (id: string, updates: Partial<DoctorMaternalAssignment>): Promise<boolean> => {
  return await updateDoc(id, updates);
};

export const deleteDoctorMaternalAssignment = async (id: string): Promise<boolean> => {
  return await deleteDoc(id);
};

// Get assignments by doctor
export const getDoctorMaternalAssignments = async (doctorId: string): Promise<DoctorMaternalAssignment[]> => {
  const allDocs = await getAllDocs();
  return allDocs.filter(doc => 
    doc.type === 'doctor-maternal-assignment' && 
    doc.doctorId === doctorId
  ) as DoctorMaternalAssignment[];
};

// Get assignments by patient
export const getPatientDoctorAssignments = async (maternalPatientId: string): Promise<DoctorMaternalAssignment[]> => {
  const allDocs = await getAllDocs();
  return allDocs.filter(doc => 
    doc.type === 'doctor-maternal-assignment' && 
    doc.maternalPatientId === maternalPatientId
  ) as DoctorMaternalAssignment[];
};

// Get active assignments for a doctor
export const getActiveDoctorMaternalAssignments = async (doctorId: string): Promise<DoctorMaternalAssignment[]> => {
  const assignments = await getDoctorMaternalAssignments(doctorId);
  return assignments.filter(assignment => assignment.status === 'active');
};

// Maternal Health Specialist Functions
export const getMaternalHealthSpecialists = async (): Promise<Doctor[]> => {
  const doctors = await getAllDoctors();
  return doctors.filter(doctor => doctor.maternalHealthSpecialist === true);
};

export const getAvailableMaternalSpecialists = async (): Promise<Doctor[]> => {
  const specialists = await getMaternalHealthSpecialists();
  return specialists.filter(doctor => doctor.emergencyAvailable === true);
};

export const assignDoctorToMaternalPatient = async (
  doctorId: string, 
  maternalPatientId: string, 
  assignmentType: DoctorMaternalAssignment['assignmentType'] = 'primary'
): Promise<string> => {
  const doctor = await getDoctorById(doctorId);
  const patient = await getMaternalPatientById(maternalPatientId);
  
  if (!doctor || !patient) {
    throw new Error('Doctor or patient not found');
  }

  // Check if doctor is qualified for maternal health
  if (!doctor.maternalHealthSpecialist && assignmentType !== 'consultation') {
    throw new Error('Doctor is not qualified for maternal health cases');
  }

  const assignment: Omit<DoctorMaternalAssignment, '_id'> = {
    type: 'doctor-maternal-assignment',
    doctorId,
    doctorName: doctor.name,
    maternalPatientId,
    patientName: `${patient.firstName} ${patient.lastName}`,
    assignmentDate: new Date().toISOString(),
    assignmentType,
    status: 'active',
    gestationalAgeAtAssignment: patient.gestationalAge,
    riskLevel: 'medium', // This should be calculated based on patient risk assessment
    specialCareRequired: [],
    carePlan: {
      visitFrequency: patient.gestationalAge > 32 ? 'weekly' : 'bi-weekly',
      nextAppointment: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
      specialInstructions: [],
      monitoringRequirements: ['Blood pressure monitoring', 'Fetal heart rate monitoring']
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  return await createDoctorMaternalAssignment(assignment);
};

// Consultation Management
export const createMaternalHealthConsultation = async (consultation: Omit<MaternalHealthConsultation, '_id'>): Promise<string> => {
  return await addDoc(consultation);
};

export const getMaternalHealthConsultation = async (id: string): Promise<MaternalHealthConsultation | null> => {
  return await getDoc(id) as MaternalHealthConsultation | null;
};

export const updateMaternalHealthConsultation = async (id: string, updates: Partial<MaternalHealthConsultation>): Promise<boolean> => {
  return await updateDoc(id, updates);
};

export const getDoctorConsultations = async (doctorId: string): Promise<MaternalHealthConsultation[]> => {
  const allDocs = await getAllDocs();
  return allDocs.filter(doc => 
    doc.type === 'maternal-health-consultation' && 
    (doc.consultingDoctorId === doctorId || doc.requestingDoctorId === doctorId)
  ) as MaternalHealthConsultation[];
};

export const getPendingConsultations = async (doctorId: string): Promise<MaternalHealthConsultation[]> => {
  const consultations = await getDoctorConsultations(doctorId);
  return consultations.filter(consultation => 
    consultation.status === 'requested' && 
    consultation.consultingDoctorId === doctorId
  );
};

// Performance Tracking
export const createDoctorMaternalPerformance = async (performance: Omit<DoctorMaternalPerformance, '_id'>): Promise<string> => {
  return await addDoc(performance);
};

export const getDoctorMaternalPerformance = async (doctorId: string, periodStart: string, periodEnd: string): Promise<DoctorMaternalPerformance | null> => {
  const allDocs = await getAllDocs();
  const performance = allDocs.find(doc => 
    doc.type === 'doctor-maternal-performance' && 
    doc.doctorId === doctorId &&
    doc.periodStart === periodStart &&
    doc.periodEnd === periodEnd
  );
  return performance as DoctorMaternalPerformance | null;
};

export const calculateDoctorMaternalPerformance = async (doctorId: string, periodStart: string, periodEnd: string): Promise<DoctorMaternalPerformance> => {
  const assignments = await getDoctorMaternalAssignments(doctorId);
  const doctor = await getDoctorById(doctorId);
  
  if (!doctor) {
    throw new Error('Doctor not found');
  }

  // Filter assignments within the period
  const periodAssignments = assignments.filter(assignment => {
    const assignmentDate = new Date(assignment.assignmentDate);
    return assignmentDate >= new Date(periodStart) && assignmentDate <= new Date(periodEnd);
  });

  // Calculate metrics
  const totalCases = periodAssignments.length;
  const highRiskCases = periodAssignments.filter(a => a.riskLevel === 'high' || a.riskLevel === 'critical').length;
  const emergencyCases = periodAssignments.filter(a => a.assignmentType === 'emergency').length;
  const completedCases = periodAssignments.filter(a => a.status === 'completed');
  const successfulDeliveries = completedCases.filter(a => a.maternalOutcome === 'healthy').length;
  const maternalDeaths = completedCases.filter(a => a.maternalOutcome === 'deceased').length;
  const cesareanDeliveries = completedCases.filter(a => a.deliveryOutcome === 'cesarean').length;

  const performance: Omit<DoctorMaternalPerformance, '_id'> = {
    type: 'doctor-maternal-performance',
    doctorId,
    doctorName: doctor.name,
    periodStart,
    periodEnd,
    totalCasesHandled: totalCases,
    highRiskCases,
    emergencyCases,
    successfulDeliveries,
    maternalMortality: maternalDeaths,
    maternalMorbidity: completedCases.filter(a => a.maternalOutcome === 'complications').length,
    neonatalMortality: completedCases.filter(a => a.fetalOutcome === 'neonatal-death').length,
    cesareanRate: completedCases.length > 0 ? (cesareanDeliveries / completedCases.length) * 100 : 0,
    averageResponseTime: doctor.emergencyResponseTime || 0,
    emergencyResponseTime: doctor.emergencyResponseTime || 0,
    patientSatisfactionScore: 8.5, // This would come from patient feedback
    complicationRate: completedCases.length > 0 ? ((completedCases.filter(a => a.maternalOutcome === 'complications').length / completedCases.length) * 100) : 0,
    referralAccuracy: 95, // This would be calculated from referral outcomes
    trainingCompleted: doctor.maternalHealthCertifications || [],
    certificationsMaintained: doctor.maternalHealthCertifications || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  return performance as DoctorMaternalPerformance;
};

// Emergency Response Functions
export const findNearestMaternalSpecialist = async (facilityId: string): Promise<Doctor[]> => {
  const specialists = await getAvailableMaternalSpecialists();
  
  // Filter by facility assignment (primary or secondary)
  const nearbySpecialists = specialists.filter(doctor => 
    doctor.primaryFacilityId === facilityId || 
    doctor.secondaryFacilities?.includes(facilityId)
  );
  
  // Sort by experience and availability
  return nearbySpecialists.sort((a, b) => {
    const aExperience = a.maternalHealthExperience || 0;
    const bExperience = b.maternalHealthExperience || 0;
    return bExperience - aExperience;
  });
};

export const requestEmergencyMaternalConsultation = async (
  maternalPatientId: string,
  requestingDoctorId: string,
  reasonForConsultation: string,
  clinicalFindings: string
): Promise<string> => {
  const patient = await getMaternalPatientById(maternalPatientId);
  const requestingDoctor = await getDoctorById(requestingDoctorId);
  
  if (!patient || !requestingDoctor) {
    throw new Error('Patient or requesting doctor not found');
  }

  // Find available maternal specialist
  const specialists = await findNearestMaternalSpecialist(patient.facilityId);
  
  if (specialists.length === 0) {
    throw new Error('No maternal health specialists available');
  }

  const consultingSpecialist = specialists[0];

  const consultation: Omit<MaternalHealthConsultation, '_id'> = {
    type: 'maternal-health-consultation',
    consultingDoctorId: consultingSpecialist._id,
    consultingDoctorName: consultingSpecialist.name,
    requestingDoctorId,
    requestingDoctorName: requestingDoctor.name,
    maternalPatientId,
    patientName: `${patient.firstName} ${patient.lastName}`,
    gestationalAge: patient.gestationalAge,
    consultationType: 'emergency',
    reasonForConsultation,
    clinicalFindings,
    currentTreatment: '',
    consultationDate: new Date().toISOString(),
    recommendations: [],
    treatmentPlan: '',
    followUpRequired: true,
    priority: 'critical',
    responseTimeRequired: 1, // 1 hour for emergency
    status: 'requested',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  return await createMaternalHealthConsultation(consultation);
};

// Dashboard and Reporting Functions
export const getDoctorMaternalDashboard = async (doctorId: string) => {
  const [assignments, consultations, performance] = await Promise.all([
    getActiveDoctorMaternalAssignments(doctorId),
    getDoctorConsultations(doctorId),
    getDoctorMaternalPerformance(doctorId, 
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
      new Date().toISOString()
    )
  ]);

  const pendingConsultations = consultations.filter(c => c.status === 'requested');
  const highRiskPatients = assignments.filter(a => a.riskLevel === 'high' || a.riskLevel === 'critical');
  const upcomingAppointments = assignments.filter(a => {
    const nextAppt = new Date(a.carePlan.nextAppointment);
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    return nextAppt <= tomorrow;
  });

  return {
    totalActivePatients: assignments.length,
    highRiskPatients: highRiskPatients.length,
    pendingConsultations: pendingConsultations.length,
    upcomingAppointments: upcomingAppointments.length,
    assignments,
    consultations: pendingConsultations,
    performance,
    alerts: [
      ...highRiskPatients.map(a => ({
        type: 'high-risk-patient',
        message: `High risk patient: ${a.patientName}`,
        patientId: a.maternalPatientId
      })),
      ...upcomingAppointments.map(a => ({
        type: 'upcoming-appointment',
        message: `Upcoming appointment: ${a.patientName}`,
        patientId: a.maternalPatientId
      }))
    ]
  };
};

export const getMaternalHealthSystemOverview = async () => {
  const [doctors, assignments, consultations] = await Promise.all([
    getMaternalHealthSpecialists(),
    getAllDocs().then(docs => docs.filter(doc => doc.type === 'doctor-maternal-assignment')),
    getAllDocs().then(docs => docs.filter(doc => doc.type === 'maternal-health-consultation'))
  ]);

  const activeAssignments = assignments.filter((a: any) => a.status === 'active');
  const pendingConsultations = consultations.filter((c: any) => c.status === 'requested');
  const emergencyConsultations = consultations.filter((c: any) => c.consultationType === 'emergency');

  return {
    totalMaternalSpecialists: doctors.length,
    availableSpecialists: doctors.filter(d => d.emergencyAvailable).length,
    totalActivePatients: activeAssignments.length,
    pendingConsultations: pendingConsultations.length,
    emergencyConsultations: emergencyConsultations.length,
    systemLoad: activeAssignments.length / doctors.length, // patients per doctor
    specialists: doctors,
    recentActivity: [
      ...assignments.slice(-5).map((a: any) => ({
        type: 'assignment',
        message: `${a.doctorName} assigned to ${a.patientName}`,
        timestamp: a.createdAt
      })),
      ...consultations.slice(-5).map((c: any) => ({
        type: 'consultation',
        message: `Consultation requested for ${c.patientName}`,
        timestamp: c.createdAt
      }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10)
  };
}; 