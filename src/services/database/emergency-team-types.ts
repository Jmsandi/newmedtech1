// Emergency Team specific database types and relationships

export interface EmergencyTeam {
  _id: string;
  _rev?: string;
  type: 'emergency-team';
  
  // Team Information
  teamName: string;
  teamCode: string; // Unique identifier for the team
  teamType: 'medical' | 'surgical' | 'maternal' | 'outbreak' | 'general' | 'trauma';
  status: 'active' | 'inactive' | 'deployed' | 'standby';
  
  // Team Composition
  teamLeaderId: string;
  teamLeaderName: string;
  teamLeaderRole: 'doctor' | 'nurse' | 'specialist';
  
  // Team Members
  doctors: EmergencyTeamMember[];
  nurses: EmergencyTeamMember[];
  specialists: EmergencyTeamMember[];
  
  // Specializations
  specializations: string[];
  capabilities: string[];
  
  // Availability
  availability: {
    schedule: 'on-call' | '24/7' | 'scheduled' | 'emergency-only';
    currentStatus: 'available' | 'busy' | 'deployed' | 'off-duty';
    responseTime: number; // minutes
  };
  
  // Equipment and Resources
  equipment: string[];
  vehicles: string[];
  
  // Contact Information
  primaryContact: string;
  emergencyContact: string;
  communicationChannel: string;
  
  // Performance Metrics
  totalDeployments: number;
  successfulInterventions: number;
  averageResponseTime: number; // minutes
  
  createdAt: string;
  updatedAt: string;
}

export interface EmergencyTeamMember {
  memberId: string;
  memberName: string;
  role: 'doctor' | 'nurse' | 'specialist' | 'paramedic' | 'technician';
  specialization: string;
  experience: number; // years
  certifications: string[];
  contactNumber: string;
  availability: 'available' | 'busy' | 'off-duty';
  joinedTeamDate: string;
}

// Emergency Team - Nurse Relationship
export interface EmergencyTeamNurseAssignment {
  _id: string;
  _rev?: string;
  type: 'emergency-team-nurse-assignment';
  
  emergencyTeamId: string;
  emergencyTeamName: string;
  nurseId: string;
  nurseName: string;
  
  // Assignment Details
  assignmentDate: string;
  assignmentType: 'permanent' | 'temporary' | 'on-call' | 'rotation';
  role: 'team-member' | 'team-lead' | 'specialist' | 'coordinator';
  
  // Responsibilities
  responsibilities: string[];
  specializations: string[];
  
  // Availability
  schedule: {
    days: string[];
    startTime: string;
    endTime: string;
  };
  
  // Performance
  deploymentsParticipated: number;
  performanceRating: number; // 1-10
  
  status: 'active' | 'inactive' | 'suspended';
  
  createdAt: string;
  updatedAt: string;
}

// Emergency Team - Doctor Relationship
export interface EmergencyTeamDoctorAssignment {
  _id: string;
  _rev?: string;
  type: 'emergency-team-doctor-assignment';
  
  emergencyTeamId: string;
  emergencyTeamName: string;
  doctorId: string;
  doctorName: string;
  
  // Assignment Details
  assignmentDate: string;
  assignmentType: 'permanent' | 'temporary' | 'on-call' | 'rotation';
  role: 'team-leader' | 'team-member' | 'specialist' | 'consultant';
  
  // Medical Specializations
  medicalSpecializations: string[];
  emergencySpecializations: string[];
  
  // Leadership
  isTeamLeader: boolean;
  canMakeDecisions: boolean;
  
  // Availability
  schedule: {
    days: string[];
    startTime: string;
    endTime: string;
  };
  
  // Performance
  deploymentsLed: number;
  deploymentsParticipated: number;
  successRate: number; // percentage
  
  status: 'active' | 'inactive' | 'suspended';
  
  createdAt: string;
  updatedAt: string;
}

// Emergency Team - Disease Outbreak Response
export interface EmergencyTeamOutbreakResponse {
  _id: string;
  _rev?: string;
  type: 'emergency-team-outbreak-response';
  
  emergencyTeamId: string;
  emergencyTeamName: string;
  outbreakId: string;
  outbreakType: string;
  
  // Response Details
  responseDate: string;
  responseType: 'investigation' | 'containment' | 'treatment' | 'prevention' | 'evacuation';
  priority: 'low' | 'medium' | 'high' | 'critical';
  
  // Deployment Information
  deploymentLocation: string;
  estimatedDuration: number; // hours
  actualDuration?: number; // hours
  
  // Team Composition for Response
  deployedMembers: {
    doctors: string[];
    nurses: string[];
    specialists: string[];
  };
  
  // Resources Deployed
  equipmentDeployed: string[];
  vehiclesUsed: string[];
  
  // Response Activities
  activitiesPerformed: string[];
  casesHandled: number;
  samplesCollected: number;
  contactsTraced: number;
  
  // Outcomes
  responseStatus: 'ongoing' | 'completed' | 'suspended' | 'escalated';
  effectivenessRating: number; // 1-10
  lessonsLearned: string[];
  
  // Follow-up
  followUpRequired: boolean;
  followUpDate?: string;
  followUpActions?: string[];
  
  createdAt: string;
  updatedAt: string;
}

// Emergency Team - Maternal Mortality Response
export interface EmergencyTeamMaternalResponse {
  _id: string;
  _rev?: string;
  type: 'emergency-team-maternal-response';
  
  emergencyTeamId: string;
  emergencyTeamName: string;
  maternalPatientId: string;
  maternalPatientName: string;
  
  // Emergency Details
  emergencyType: 'obstetric-emergency' | 'postpartum-hemorrhage' | 'eclampsia' | 'sepsis' | 'cardiac-arrest';
  emergencyDate: string;
  gestationalAge: number;
  
  // Response Details
  alertReceived: string;
  teamDispatched: string;
  teamArrived: string;
  responseTime: number; // minutes
  
  // Team Composition
  respondingMembers: {
    obstetrician?: string;
    anesthesiologist?: string;
    nurses: string[];
    midwife?: string;
    pediatrician?: string;
  };
  
  // Interventions
  interventionsPerformed: string[];
  medicationsAdministered: string[];
  proceduresPerformed: string[];
  
  // Outcomes
  maternalOutcome: 'stable' | 'critical' | 'transferred' | 'deceased';
  fetalOutcome?: 'stable' | 'distressed' | 'delivered' | 'deceased';
  
  // Transfer Information
  transferRequired: boolean;
  transferFacility?: string;
  transferTime?: string;
  
  // Quality Metrics
  responseEffectiveness: number; // 1-10
  teamCoordination: number; // 1-10
  communicationQuality: number; // 1-10
  
  // Follow-up
  followUpCare: string[];
  debriefingCompleted: boolean;
  improvementRecommendations: string[];
  
  createdAt: string;
  updatedAt: string;
}

// Emergency Team Deployment
export interface EmergencyTeamDeployment {
  _id: string;
  _rev?: string;
  type: 'emergency-team-deployment';
  
  emergencyTeamId: string;
  emergencyTeamName: string;
  
  // Deployment Details
  deploymentType: 'outbreak-response' | 'maternal-emergency' | 'disaster-response' | 'medical-emergency';
  deploymentDate: string;
  deploymentLocation: string;
  
  // Request Information
  requestedBy: string;
  requestPriority: 'low' | 'medium' | 'high' | 'critical';
  requestDescription: string;
  
  // Team Response
  teamStatus: 'dispatched' | 'en-route' | 'on-scene' | 'completed' | 'cancelled';
  dispatchTime: string;
  arrivalTime?: string;
  completionTime?: string;
  
  // Deployed Resources
  deployedMembers: EmergencyTeamMember[];
  equipmentDeployed: string[];
  vehiclesUsed: string[];
  
  // Activities and Outcomes
  activitiesPerformed: string[];
  patientsHandled: number;
  casesResolved: number;
  
  // Performance Metrics
  responseTime: number; // minutes
  deploymentDuration: number; // hours
  effectivenessRating: number; // 1-10
  
  // Documentation
  incidentReport: string;
  mediaDocumentation: string[];
  
  createdAt: string;
  updatedAt: string;
}

// Emergency Team Training and Certification
export interface EmergencyTeamTraining {
  _id: string;
  _rev?: string;
  type: 'emergency-team-training';
  
  emergencyTeamId: string;
  emergencyTeamName: string;
  
  // Training Details
  trainingType: 'drill' | 'certification' | 'workshop' | 'simulation' | 'continuing-education';
  trainingTitle: string;
  trainingDescription: string;
  
  // Schedule
  trainingDate: string;
  duration: number; // hours
  location: string;
  
  // Participants
  participants: {
    memberId: string;
    memberName: string;
    role: string;
    attendanceStatus: 'attended' | 'absent' | 'partial';
    performanceScore?: number; // 1-100
  }[];
  
  // Training Content
  topics: string[];
  skills: string[];
  certifications: string[];
  
  // Outcomes
  overallPerformance: number; // 1-10
  areasForImprovement: string[];
  recommendedFollowUp: string[];
  
  // Instructor Information
  instructorName: string;
  instructorCredentials: string;
  
  createdAt: string;
  updatedAt: string;
} 