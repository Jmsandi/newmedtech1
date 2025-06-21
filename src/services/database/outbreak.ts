import { getAllDocsByType, getDocById, addDoc, updateDoc, deleteDoc } from './core';

// Outbreak-specific types
export interface OutbreakCase {
  _id: string;
  _rev?: string;
  type: 'outbreak-case';
  patientName: string;
  age: number;
  gender: 'male' | 'female';
  symptoms: string[];
  onsetDate: string;
  diagnosisDate?: string;
  location: string;
  caseStatus: 'suspected' | 'confirmed' | 'recovered' | 'deceased';
  contactPhone: string;
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  name: string;
  relationship: string;
  contactNumber: string;
  lastContactDate: string;
  notified: boolean;
  tested: boolean;
}

export interface TestResult {
  testType: string;
  result: 'positive' | 'negative' | 'pending';
  testDate: string;
  labName: string;
}

export interface VaccinationRecord {
  _id: string;
  type: 'vaccination-record';
  patientName: string;
  patientId: string;
  vaccineType: string;
  doseNumber: number;
  vaccinationDate: string;
  vaccinationSite: string;
  batchNumber: string;
  nextDueDate?: string;
  sideEffects?: string[];
  createdAt: string;
}

// Nurse - Disease Outbreak Control Center Relationship
export interface NurseOutbreakAssignment {
  _id: string;
  _rev?: string;
  type: 'nurse-outbreak-assignment';
  
  // Nurse Information
  nurseId: string;
  nurseName: string;
  nurseSpecialization: string;
  nurseWard: string;
  nurseContactNumber: string;
  
  // Outbreak Control Assignment
  assignmentDate: string;
  assignmentType: 'case-management' | 'contact-tracing' | 'vaccination' | 'surveillance' | 'education' | 'emergency-response';
  assignmentStatus: 'active' | 'completed' | 'suspended' | 'transferred';
  
  // Responsibilities
  responsibilities: string[];
  specializedTasks: string[];
  
  // Assignment Details
  outbreakType?: string; // COVID-19, Influenza, etc.
  assignedCases: string[]; // Array of outbreak case IDs
  assignedContacts: string[]; // Array of contact IDs for tracing
  coverageArea: string; // Geographic area or facility
  
  // Performance Metrics
  casesManaged: number;
  contactsTraced: number;
  vaccinationsAdministered: number;
  educationSessionsConducted: number;
  
  // Schedule and Availability
  workSchedule: {
    days: string[];
    startTime: string;
    endTime: string;
    isOnCall: boolean;
  };
  
  // Training and Certification
  outbreakTrainingCompleted: boolean;
  certifications: string[];
  lastTrainingDate?: string;
  
  // Supervisor Information
  supervisorId?: string;
  supervisorName?: string;
  
  createdAt: string;
  updatedAt: string;
}

// Nurse Outbreak Activity Log
export interface NurseOutbreakActivity {
  _id: string;
  _rev?: string;
  type: 'nurse-outbreak-activity';
  
  // Nurse and Assignment Reference
  nurseId: string;
  nurseName: string;
  assignmentId: string;
  
  // Activity Details
  activityDate: string;
  activityType: 'case-visit' | 'contact-tracing' | 'vaccination' | 'sample-collection' | 'education' | 'reporting' | 'emergency-response';
  activityDescription: string;
  
  // Location and Duration
  location: string;
  startTime: string;
  endTime: string;
  duration: number; // minutes
  
  // Related Cases/Contacts
  relatedCaseIds: string[];
  relatedContactIds: string[];
  
  // Outcomes and Results
  outcome: 'completed' | 'partial' | 'cancelled' | 'referred';
  results: string[];
  followUpRequired: boolean;
  followUpDate?: string;
  
  // Documentation
  notes: string;
  attachments?: string[];
  
  createdAt: string;
  updatedAt: string;
}

// Disease Outbreak Control Center Team
export interface OutbreakControlTeam {
  _id: string;
  _rev?: string;
  type: 'outbreak-control-team';
  
  // Team Information
  teamName: string;
  teamCode: string;
  outbreakType: string;
  teamStatus: 'active' | 'standby' | 'deployed' | 'disbanded';
  
  // Team Composition
  teamLeaderId: string;
  teamLeaderName: string;
  teamLeaderRole: 'doctor' | 'nurse' | 'epidemiologist';
  
  // Assigned Nurses
  assignedNurses: {
    nurseId: string;
    nurseName: string;
    role: 'case-manager' | 'contact-tracer' | 'vaccinator' | 'educator' | 'coordinator';
    assignmentDate: string;
  }[];
  
  // Coverage and Scope
  coverageAreas: string[];
  targetPopulation: number;
  estimatedCases: number;
  
  // Resources
  equipment: string[];
  vehicles: string[];
  supplies: string[];
  
  // Performance Metrics
  totalCasesManaged: number;
  totalContactsTraced: number;
  totalVaccinationsGiven: number;
  responseTime: number; // average in hours
  
  createdAt: string;
  updatedAt: string;
}

// Lab Technician - Disease Outbreak Control Center Relationship
export interface LabTechOutbreakAssignment {
  _id: string;
  _rev?: string;
  type: 'labtech-outbreak-assignment';
  
  // Lab Technician Information
  labTechId: string;
  labTechName: string;
  labTechSpecialization: string;
  labTechQualification: string;
  labTechContactNumber: string;
  labTechEmail: string;
  
  // Outbreak Control Assignment
  assignmentDate: string;
  assignmentType: 'sample-testing' | 'diagnostic-support' | 'surveillance-testing' | 'contact-screening' | 'vaccine-testing' | 'research-support';
  assignmentStatus: 'active' | 'completed' | 'suspended' | 'transferred';
  
  // Outbreak Details
  outbreakType: string; // COVID-19, Influenza, Ebola, etc.
  outbreakId?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  
  // Testing Responsibilities
  testingCapabilities: string[]; // PCR, Antigen, Serology, Culture, etc.
  assignedTestTypes: string[];
  dailyTestingCapacity: number;
  specializedEquipment: string[];
  
  // Sample Management
  sampleCollectionSites: string[];
  sampleProcessingLocation: string;
  sampleStorageCapacity: number;
  
  // Performance Metrics
  samplesProcessed: number;
  testsCompleted: number;
  positiveResults: number;
  criticalResultsReported: number;
  averageProcessingTime: number; // hours
  
  // Schedule and Availability
  workSchedule: {
    days: string[];
    startTime: string;
    endTime: string;
    isOnCall: boolean;
    emergencyAvailable: boolean;
  };
  
  // Training and Certification
  outbreakTestingTrainingCompleted: boolean;
  biosafetyCertifications: string[];
  lastTrainingDate?: string;
  emergencyProtocolsTraining: boolean;
  
  // Quality Control
  qualityControlMetrics: {
    accuracy: number; // percentage
    turnaroundTime: number; // hours
    errorRate: number; // percentage
    calibrationStatus: 'current' | 'due' | 'overdue';
  };
  
  // Supervisor Information
  supervisorId?: string;
  supervisorName?: string;
  reportingStructure: string;
  
  // Communication and Reporting
  reportingFrequency: 'hourly' | 'daily' | 'weekly';
  communicationChannels: string[];
  escalationProtocol: string[];
  
  createdAt: string;
  updatedAt: string;
}

// Lab Technician Outbreak Testing Activity
export interface LabTechOutbreakActivity {
  _id: string;
  _rev?: string;
  type: 'labtech-outbreak-activity';
  
  // Lab Technician and Assignment Reference
  labTechId: string;
  labTechName: string;
  assignmentId: string;
  
  // Activity Details
  activityDate: string;
  activityType: 'sample-processing' | 'test-execution' | 'result-reporting' | 'quality-control' | 'equipment-maintenance' | 'emergency-testing';
  activityDescription: string;
  
  // Testing Information
  samplesReceived: number;
  samplesProcessed: number;
  testsPerformed: {
    testType: string;
    quantity: number;
    results: {
      positive: number;
      negative: number;
      inconclusive: number;
      pending: number;
    };
  }[];
  
  // Time Tracking
  startTime: string;
  endTime: string;
  duration: number; // minutes
  processingTime: number; // average per sample in minutes
  
  // Quality Metrics
  qualityControlPassed: boolean;
  calibrationChecked: boolean;
  equipmentStatus: 'operational' | 'maintenance-required' | 'out-of-service';
  
  // Critical Results
  criticalResultsFound: number;
  criticalResultsReported: number;
  emergencyNotificationsSent: string[];
  
  // Outcomes and Results
  outcome: 'completed' | 'partial' | 'delayed' | 'equipment-failure' | 'sample-issues';
  resultsDelivered: boolean;
  deliveryTime: string;
  followUpRequired: boolean;
  followUpDate?: string;
  
  // Documentation
  notes: string;
  attachments?: string[];
  batchNumbers: string[];
  
  // Related Cases/Samples
  relatedCaseIds: string[];
  sampleIds: string[];
  
  createdAt: string;
  updatedAt: string;
}

// Outbreak Laboratory Testing Team
export interface OutbreakLabTestingTeam {
  _id: string;
  _rev?: string;
  type: 'outbreak-lab-testing-team';
  
  // Team Information
  teamName: string;
  teamCode: string;
  outbreakType: string;
  teamStatus: 'active' | 'standby' | 'deployed' | 'disbanded';
  
  // Team Leadership
  teamLeaderId: string;
  teamLeaderName: string;
  teamLeaderRole: 'senior-labtech' | 'lab-supervisor' | 'pathologist';
  
  // Assigned Lab Technicians
  assignedLabTechs: {
    labTechId: string;
    labTechName: string;
    specialization: string;
    role: 'sample-processor' | 'test-executor' | 'quality-controller' | 'result-reporter' | 'coordinator';
    assignmentDate: string;
    shiftSchedule: string;
  }[];
  
  // Testing Capabilities
  testingCapabilities: {
    testType: string;
    dailyCapacity: number;
    equipment: string[];
    certificationRequired: boolean;
  }[];
  
  // Laboratory Resources
  laboratoryLocation: string;
  equipmentInventory: string[];
  reagentSupplies: string[];
  safetyEquipment: string[];
  
  // Coverage and Scope
  coverageAreas: string[];
  sampleCollectionPoints: string[];
  targetTestingVolume: number;
  
  // Performance Metrics
  totalSamplesProcessed: number;
  totalTestsCompleted: number;
  averageTurnaroundTime: number; // hours
  accuracyRate: number; // percentage
  criticalResultsReported: number;
  
  // Quality Assurance
  qualityControlProtocols: string[];
  certificationStatus: 'current' | 'pending' | 'expired';
  lastAuditDate?: string;
  auditResults?: string;
  
  // Emergency Response
  emergencyResponseCapability: boolean;
  emergencyContactProtocol: string[];
  escalationProcedures: string[];
  
  createdAt: string;
  updatedAt: string;
}

// Lab Technician Outbreak Sample Tracking
export interface LabTechOutbreakSample {
  _id: string;
  _rev?: string;
  type: 'labtech-outbreak-sample';
  
  // Sample Information
  sampleId: string;
  sampleType: 'nasopharyngeal' | 'blood' | 'saliva' | 'urine' | 'stool' | 'tissue' | 'other';
  collectionDate: string;
  collectionTime: string;
  collectionSite: string;
  
  // Patient/Case Information
  caseId?: string;
  patientId?: string;
  patientName?: string;
  contactId?: string; // for contact tracing samples
  
  // Lab Technician Assignment
  assignedLabTechId: string;
  assignedLabTechName: string;
  assignmentDate: string;
  
  // Processing Information
  receivedDate: string;
  receivedTime: string;
  processingStarted?: string;
  processingCompleted?: string;
  
  // Test Details
  requestedTests: {
    testType: string;
    priority: 'routine' | 'urgent' | 'stat' | 'critical';
    status: 'pending' | 'in-progress' | 'completed' | 'failed';
    result?: 'positive' | 'negative' | 'inconclusive' | 'invalid';
    resultDate?: string;
    resultTime?: string;
  }[];
  
  // Quality Control
  sampleQuality: 'adequate' | 'suboptimal' | 'inadequate' | 'contaminated';
  storageConditions: string;
  chainOfCustody: {
    handoverDate: string;
    handoverTime: string;
    fromPerson: string;
    toPerson: string;
    notes?: string;
  }[];
  
  // Results and Reporting
  finalResults: {
    testType: string;
    result: string;
    interpretation: string;
    criticalValue: boolean;
    reportedDate: string;
    reportedTime: string;
    reportedTo: string[];
  }[];
  
  // Status Tracking
  currentStatus: 'received' | 'processing' | 'completed' | 'reported' | 'archived';
  turnaroundTime?: number; // hours from receipt to reporting
  
  // Notes and Documentation
  notes: string;
  attachments?: string[];
  
  createdAt: string;
  updatedAt: string;
}

// Outbreak case functions
export const getAllOutbreakCases = async (): Promise<OutbreakCase[]> => {
  return getAllDocsByType<OutbreakCase>('outbreak-case');
};

export const getOutbreakCaseById = async (id: string): Promise<OutbreakCase | null> => {
  return getDocById<OutbreakCase>(id);
};

export const addOutbreakCase = async (outbreakCase: OutbreakCase): Promise<string> => {
  return addDoc<OutbreakCase>(outbreakCase);
};

export const updateOutbreakCase = async (outbreakCase: OutbreakCase): Promise<boolean> => {
  if (!outbreakCase._id) return false;
  return updateDoc(outbreakCase._id, outbreakCase);
};

export const deleteOutbreakCase = async (id: string, rev?: string): Promise<boolean> => {
  return deleteDoc(id, rev);
};

// Vaccination record functions
export const getAllVaccinationRecords = async (): Promise<VaccinationRecord[]> => {
  return getAllDocsByType<VaccinationRecord>('vaccination-record');
};

export const addVaccinationRecord = async (record: VaccinationRecord): Promise<string> => {
  return addDoc<VaccinationRecord>(record);
};

export const getVaccinationsByPatient = async (patientId: string): Promise<VaccinationRecord[]> => {
  const records = await getAllVaccinationRecords();
  return records.filter(record => record.patientId === patientId);
};

// Nurse-Outbreak Assignment Functions
export const getAllNurseOutbreakAssignments = async (): Promise<NurseOutbreakAssignment[]> => {
  return getAllDocsByType<NurseOutbreakAssignment>('nurse-outbreak-assignment');
};

export const getNurseOutbreakAssignmentById = async (id: string): Promise<NurseOutbreakAssignment | null> => {
  return getDocById<NurseOutbreakAssignment>(id);
};

export const addNurseOutbreakAssignment = async (assignment: NurseOutbreakAssignment): Promise<string> => {
  return addDoc<NurseOutbreakAssignment>(assignment);
};

export const updateNurseOutbreakAssignment = async (assignment: NurseOutbreakAssignment): Promise<boolean> => {
  if (!assignment._id) return false;
  return updateDoc(assignment._id, assignment);
};

export const deleteNurseOutbreakAssignment = async (id: string, rev?: string): Promise<boolean> => {
  return deleteDoc(id, rev);
};

// Nurse Outbreak Activity Functions
export const getAllNurseOutbreakActivities = async (): Promise<NurseOutbreakActivity[]> => {
  return getAllDocsByType<NurseOutbreakActivity>('nurse-outbreak-activity');
};

export const getNurseOutbreakActivityById = async (id: string): Promise<NurseOutbreakActivity | null> => {
  return getDocById<NurseOutbreakActivity>(id);
};

export const addNurseOutbreakActivity = async (activity: NurseOutbreakActivity): Promise<string> => {
  return addDoc<NurseOutbreakActivity>(activity);
};

export const updateNurseOutbreakActivity = async (activity: NurseOutbreakActivity): Promise<boolean> => {
  if (!activity._id) return false;
  return updateDoc(activity._id, activity);
};

export const deleteNurseOutbreakActivity = async (id: string, rev?: string): Promise<boolean> => {
  return deleteDoc(id, rev);
};

// Outbreak Control Team Functions
export const getAllOutbreakControlTeams = async (): Promise<OutbreakControlTeam[]> => {
  return getAllDocsByType<OutbreakControlTeam>('outbreak-control-team');
};

export const getOutbreakControlTeamById = async (id: string): Promise<OutbreakControlTeam | null> => {
  return getDocById<OutbreakControlTeam>(id);
};

export const addOutbreakControlTeam = async (team: OutbreakControlTeam): Promise<string> => {
  return addDoc<OutbreakControlTeam>(team);
};

export const updateOutbreakControlTeam = async (team: OutbreakControlTeam): Promise<boolean> => {
  if (!team._id) return false;
  return updateDoc(team._id, team);
};

export const deleteOutbreakControlTeam = async (id: string, rev?: string): Promise<boolean> => {
  return deleteDoc(id, rev);
};

// Relationship Query Functions

// Get all outbreak assignments for a specific nurse
export const getOutbreakAssignmentsByNurse = async (nurseId: string): Promise<NurseOutbreakAssignment[]> => {
  const assignments = await getAllNurseOutbreakAssignments();
  return assignments.filter(assignment => assignment.nurseId === nurseId);
};

// Get all nurses assigned to outbreak control activities
export const getNursesInOutbreakControl = async (): Promise<NurseOutbreakAssignment[]> => {
  const assignments = await getAllNurseOutbreakAssignments();
  return assignments.filter(assignment => assignment.assignmentStatus === 'active');
};

// Get nurses by outbreak type
export const getNursesByOutbreakType = async (outbreakType: string): Promise<NurseOutbreakAssignment[]> => {
  const assignments = await getAllNurseOutbreakAssignments();
  return assignments.filter(assignment => 
    assignment.outbreakType === outbreakType && 
    assignment.assignmentStatus === 'active'
  );
};

// Get nurse activities by date range
export const getNurseOutbreakActivitiesByDateRange = async (
  nurseId: string, 
  startDate: string, 
  endDate: string
): Promise<NurseOutbreakActivity[]> => {
  const activities = await getAllNurseOutbreakActivities();
  return activities.filter(activity => 
    activity.nurseId === nurseId &&
    activity.activityDate >= startDate &&
    activity.activityDate <= endDate
  );
};

// Get outbreak control statistics
export const getOutbreakControlStats = async () => {
  const [assignments, activities, teams] = await Promise.all([
    getAllNurseOutbreakAssignments(),
    getAllNurseOutbreakActivities(),
    getAllOutbreakControlTeams()
  ]);

  const activeAssignments = assignments.filter(assignment => assignment.assignmentStatus === 'active');
  const totalCasesManaged = activeAssignments.reduce((sum, assignment) => sum + assignment.casesManaged, 0);
  const totalContactsTraced = activeAssignments.reduce((sum, assignment) => sum + assignment.contactsTraced, 0);
  const totalVaccinations = activeAssignments.reduce((sum, assignment) => sum + assignment.vaccinationsAdministered, 0);
  
  const recentActivities = activities.filter(activity => {
    const activityDate = new Date(activity.activityDate);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return activityDate >= weekAgo;
  });

  return {
    totalNursesAssigned: activeAssignments.length,
    totalCasesManaged,
    totalContactsTraced,
    totalVaccinations,
    totalTeams: teams.length,
    activeTeams: teams.filter(team => team.teamStatus === 'active').length,
    recentActivities: recentActivities.length,
    averageResponseTime: teams.length > 0 
      ? teams.reduce((sum, team) => sum + team.responseTime, 0) / teams.length 
      : 0
  };
};

// Get nurses available for outbreak assignment
export const getAvailableNursesForOutbreak = async (): Promise<NurseOutbreakAssignment[]> => {
  const assignments = await getAllNurseOutbreakAssignments();
  return assignments.filter(assignment => 
    assignment.assignmentStatus === 'active' && 
    assignment.workSchedule.isOnCall
  );
};

// Get outbreak team by nurse
export const getOutbreakTeamByNurse = async (nurseId: string): Promise<OutbreakControlTeam[]> => {
  const teams = await getAllOutbreakControlTeams();
  return teams.filter(team => 
    team.assignedNurses.some(nurse => nurse.nurseId === nurseId) &&
    team.teamStatus === 'active'
  );
};

// Lab Technician - Outbreak Assignment Functions
export const getAllLabTechOutbreakAssignments = async (): Promise<LabTechOutbreakAssignment[]> => {
  return getAllDocsByType<LabTechOutbreakAssignment>('labtech-outbreak-assignment');
};

export const getLabTechOutbreakAssignmentById = async (id: string): Promise<LabTechOutbreakAssignment | null> => {
  return getDocById<LabTechOutbreakAssignment>(id);
};

export const addLabTechOutbreakAssignment = async (assignment: LabTechOutbreakAssignment): Promise<string> => {
  return addDoc<LabTechOutbreakAssignment>(assignment);
};

export const updateLabTechOutbreakAssignment = async (assignment: LabTechOutbreakAssignment): Promise<boolean> => {
  if (!assignment._id) return false;
  return updateDoc(assignment._id, assignment);
};

export const deleteLabTechOutbreakAssignment = async (id: string, rev?: string): Promise<boolean> => {
  return deleteDoc(id, rev);
};

// Lab Technician Outbreak Activity Functions
export const getAllLabTechOutbreakActivities = async (): Promise<LabTechOutbreakActivity[]> => {
  return getAllDocsByType<LabTechOutbreakActivity>('labtech-outbreak-activity');
};

export const getLabTechOutbreakActivityById = async (id: string): Promise<LabTechOutbreakActivity | null> => {
  return getDocById<LabTechOutbreakActivity>(id);
};

export const addLabTechOutbreakActivity = async (activity: LabTechOutbreakActivity): Promise<string> => {
  return addDoc<LabTechOutbreakActivity>(activity);
};

export const updateLabTechOutbreakActivity = async (activity: LabTechOutbreakActivity): Promise<boolean> => {
  if (!activity._id) return false;
  return updateDoc(activity._id, activity);
};

export const deleteLabTechOutbreakActivity = async (id: string, rev?: string): Promise<boolean> => {
  return deleteDoc(id, rev);
};

// Outbreak Lab Testing Team Functions
export const getAllOutbreakLabTestingTeams = async (): Promise<OutbreakLabTestingTeam[]> => {
  return getAllDocsByType<OutbreakLabTestingTeam>('outbreak-lab-testing-team');
};

export const getOutbreakLabTestingTeamById = async (id: string): Promise<OutbreakLabTestingTeam | null> => {
  return getDocById<OutbreakLabTestingTeam>(id);
};

export const addOutbreakLabTestingTeam = async (team: OutbreakLabTestingTeam): Promise<string> => {
  return addDoc<OutbreakLabTestingTeam>(team);
};

export const updateOutbreakLabTestingTeam = async (team: OutbreakLabTestingTeam): Promise<boolean> => {
  if (!team._id) return false;
  return updateDoc(team._id, team);
};

export const deleteOutbreakLabTestingTeam = async (id: string, rev?: string): Promise<boolean> => {
  return deleteDoc(id, rev);
};

// Lab Technician Outbreak Sample Functions
export const getAllLabTechOutbreakSamples = async (): Promise<LabTechOutbreakSample[]> => {
  return getAllDocsByType<LabTechOutbreakSample>('labtech-outbreak-sample');
};

export const getLabTechOutbreakSampleById = async (id: string): Promise<LabTechOutbreakSample | null> => {
  return getDocById<LabTechOutbreakSample>(id);
};

export const addLabTechOutbreakSample = async (sample: LabTechOutbreakSample): Promise<string> => {
  return addDoc<LabTechOutbreakSample>(sample);
};

export const updateLabTechOutbreakSample = async (sample: LabTechOutbreakSample): Promise<boolean> => {
  if (!sample._id) return false;
  return updateDoc(sample._id, sample);
};

export const deleteLabTechOutbreakSample = async (id: string, rev?: string): Promise<boolean> => {
  return deleteDoc(id, rev);
};

// Relationship Query Functions for Lab Technicians

// Get all outbreak assignments for a specific lab technician
export const getOutbreakAssignmentsByLabTech = async (labTechId: string): Promise<LabTechOutbreakAssignment[]> => {
  const assignments = await getAllLabTechOutbreakAssignments();
  return assignments.filter(assignment => assignment.labTechId === labTechId);
};

// Get all lab technicians assigned to outbreak control activities
export const getLabTechsInOutbreakControl = async (): Promise<LabTechOutbreakAssignment[]> => {
  const assignments = await getAllLabTechOutbreakAssignments();
  return assignments.filter(assignment => assignment.assignmentStatus === 'active');
};

// Get lab technicians by outbreak type
export const getLabTechsByOutbreakType = async (outbreakType: string): Promise<LabTechOutbreakAssignment[]> => {
  const assignments = await getAllLabTechOutbreakAssignments();
  return assignments.filter(assignment => 
    assignment.outbreakType === outbreakType && 
    assignment.assignmentStatus === 'active'
  );
};

// Get lab technician outbreak activities by date range
export const getLabTechOutbreakActivitiesByDateRange = async (
  labTechId: string, 
  startDate: string, 
  endDate: string
): Promise<LabTechOutbreakActivity[]> => {
  const activities = await getAllLabTechOutbreakActivities();
  return activities.filter(activity => {
    const activityDate = new Date(activity.activityDate);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return activity.labTechId === labTechId && 
           activityDate >= start && 
           activityDate <= end;
  });
};

// Get samples assigned to a specific lab technician
export const getSamplesByLabTech = async (labTechId: string): Promise<LabTechOutbreakSample[]> => {
  const samples = await getAllLabTechOutbreakSamples();
  return samples.filter(sample => sample.assignedLabTechId === labTechId);
};

// Get samples by status
export const getSamplesByStatus = async (status: string): Promise<LabTechOutbreakSample[]> => {
  const samples = await getAllLabTechOutbreakSamples();
  return samples.filter(sample => sample.currentStatus === status);
};

// Get critical samples requiring immediate attention
export const getCriticalSamples = async (): Promise<LabTechOutbreakSample[]> => {
  const samples = await getAllLabTechOutbreakSamples();
  return samples.filter(sample => 
    sample.requestedTests.some(test => test.priority === 'critical' || test.priority === 'stat') ||
    sample.finalResults.some(result => result.criticalValue)
  );
};

// Get lab technician performance metrics
export const getLabTechOutbreakStats = async (labTechId?: string) => {
  const [assignments, activities, samples] = await Promise.all([
    getAllLabTechOutbreakAssignments(),
    getAllLabTechOutbreakActivities(),
    getAllLabTechOutbreakSamples()
  ]);

  const filteredAssignments = labTechId 
    ? assignments.filter(assignment => assignment.labTechId === labTechId)
    : assignments.filter(assignment => assignment.assignmentStatus === 'active');

  const filteredActivities = labTechId
    ? activities.filter(activity => activity.labTechId === labTechId)
    : activities;

  const filteredSamples = labTechId
    ? samples.filter(sample => sample.assignedLabTechId === labTechId)
    : samples;

  const totalSamplesProcessed = filteredAssignments.reduce((sum, assignment) => sum + assignment.samplesProcessed, 0);
  const totalTestsCompleted = filteredAssignments.reduce((sum, assignment) => sum + assignment.testsCompleted, 0);
  const totalPositiveResults = filteredAssignments.reduce((sum, assignment) => sum + assignment.positiveResults, 0);
  const totalCriticalResults = filteredAssignments.reduce((sum, assignment) => sum + assignment.criticalResultsReported, 0);

  const recentActivities = filteredActivities.filter(activity => {
    const activityDate = new Date(activity.activityDate);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return activityDate >= weekAgo;
  });

  const averageProcessingTime = filteredAssignments.length > 0 
    ? filteredAssignments.reduce((sum, assignment) => sum + assignment.averageProcessingTime, 0) / filteredAssignments.length 
    : 0;

  const completedSamples = filteredSamples.filter(sample => sample.currentStatus === 'completed' || sample.currentStatus === 'reported');
  const averageTurnaroundTime = completedSamples.length > 0
    ? completedSamples.reduce((sum, sample) => sum + (sample.turnaroundTime || 0), 0) / completedSamples.length
    : 0;

  return {
    totalLabTechsAssigned: filteredAssignments.length,
    totalSamplesProcessed,
    totalTestsCompleted,
    totalPositiveResults,
    totalCriticalResults,
    recentActivities: recentActivities.length,
    averageProcessingTime,
    averageTurnaroundTime,
    pendingSamples: filteredSamples.filter(sample => sample.currentStatus === 'received' || sample.currentStatus === 'processing').length,
    completedSamples: completedSamples.length,
    criticalSamples: filteredSamples.filter(sample => 
      sample.finalResults.some(result => result.criticalValue)
    ).length
  };
};

// Get available lab technicians for outbreak assignment
export const getAvailableLabTechsForOutbreak = async (): Promise<LabTechOutbreakAssignment[]> => {
  const assignments = await getAllLabTechOutbreakAssignments();
  return assignments.filter(assignment => 
    assignment.assignmentStatus === 'active' && 
    assignment.workSchedule.emergencyAvailable
  );
};

// Get outbreak lab testing team by lab technician
export const getOutbreakLabTeamByLabTech = async (labTechId: string): Promise<OutbreakLabTestingTeam[]> => {
  const teams = await getAllOutbreakLabTestingTeams();
  return teams.filter(team => 
    team.assignedLabTechs.some(labTech => labTech.labTechId === labTechId) &&
    team.teamStatus === 'active'
  );
};

// Get lab technicians by testing capability
export const getLabTechsByTestingCapability = async (testType: string): Promise<LabTechOutbreakAssignment[]> => {
  const assignments = await getAllLabTechOutbreakAssignments();
  return assignments.filter(assignment => 
    assignment.testingCapabilities.includes(testType) &&
    assignment.assignmentStatus === 'active'
  );
};

// Get samples requiring urgent processing
export const getUrgentSamples = async (): Promise<LabTechOutbreakSample[]> => {
  const samples = await getAllLabTechOutbreakSamples();
  return samples.filter(sample => 
    sample.requestedTests.some(test => test.priority === 'urgent' || test.priority === 'stat') &&
    (sample.currentStatus === 'received' || sample.currentStatus === 'processing')
  );
};

// Update lab technician assignment performance metrics
export const updateLabTechPerformanceMetrics = async (
  labTechId: string, 
  metrics: {
    samplesProcessed?: number;
    testsCompleted?: number;
    positiveResults?: number;
    criticalResultsReported?: number;
    averageProcessingTime?: number;
  }
): Promise<boolean> => {
  const assignments = await getOutbreakAssignmentsByLabTech(labTechId);
  if (assignments.length === 0) return false;

  const assignment = assignments[0]; // Get the most recent active assignment
  
  // Update metrics
  if (metrics.samplesProcessed !== undefined) {
    assignment.samplesProcessed += metrics.samplesProcessed;
  }
  if (metrics.testsCompleted !== undefined) {
    assignment.testsCompleted += metrics.testsCompleted;
  }
  if (metrics.positiveResults !== undefined) {
    assignment.positiveResults += metrics.positiveResults;
  }
  if (metrics.criticalResultsReported !== undefined) {
    assignment.criticalResultsReported += metrics.criticalResultsReported;
  }
  if (metrics.averageProcessingTime !== undefined) {
    assignment.averageProcessingTime = metrics.averageProcessingTime;
  }

  assignment.updatedAt = new Date().toISOString();
  
  return updateLabTechOutbreakAssignment(assignment);
};
