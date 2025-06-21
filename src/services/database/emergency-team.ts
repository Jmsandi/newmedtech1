import { getAllDocsByType, getDocById, addDoc, updateDoc, deleteDoc } from './core';
import {
  EmergencyTeam,
  EmergencyTeamMember,
  EmergencyTeamNurseAssignment,
  EmergencyTeamDoctorAssignment,
  EmergencyTeamOutbreakResponse,
  EmergencyTeamMaternalResponse,
  EmergencyTeamDeployment,
  EmergencyTeamTraining
} from './emergency-team-types';

// Emergency Team CRUD Operations
export const getAllEmergencyTeams = async (): Promise<EmergencyTeam[]> => {
  return getAllDocsByType('emergency-team');
};

export const getEmergencyTeamById = async (id: string): Promise<EmergencyTeam | null> => {
  return getDocById(id);
};

export const addEmergencyTeam = async (team: EmergencyTeam): Promise<string> => {
  return addDoc(team);
};

export const updateEmergencyTeam = async (team: EmergencyTeam): Promise<boolean> => {
  if (!team._id) return false;
  return updateDoc(team._id, team);
};

export const deleteEmergencyTeam = async (id: string, rev?: string): Promise<boolean> => {
  return deleteDoc(id, rev);
};

// Emergency Team - Nurse Assignment Operations
export const getAllEmergencyTeamNurseAssignments = async (): Promise<EmergencyTeamNurseAssignment[]> => {
  return getAllDocsByType('emergency-team-nurse-assignment');
};

export const getEmergencyTeamNurseAssignmentById = async (id: string): Promise<EmergencyTeamNurseAssignment | null> => {
  return getDocById(id);
};

export const addEmergencyTeamNurseAssignment = async (assignment: EmergencyTeamNurseAssignment): Promise<string> => {
  return addDoc(assignment);
};

export const updateEmergencyTeamNurseAssignment = async (assignment: EmergencyTeamNurseAssignment): Promise<boolean> => {
  if (!assignment._id) return false;
  return updateDoc(assignment._id, assignment);
};

export const deleteEmergencyTeamNurseAssignment = async (id: string, rev?: string): Promise<boolean> => {
  return deleteDoc(id, rev);
};

// Emergency Team - Doctor Assignment Operations
export const getAllEmergencyTeamDoctorAssignments = async (): Promise<EmergencyTeamDoctorAssignment[]> => {
  return getAllDocsByType('emergency-team-doctor-assignment');
};

export const getEmergencyTeamDoctorAssignmentById = async (id: string): Promise<EmergencyTeamDoctorAssignment | null> => {
  return getDocById(id);
};

export const addEmergencyTeamDoctorAssignment = async (assignment: EmergencyTeamDoctorAssignment): Promise<string> => {
  return addDoc(assignment);
};

export const updateEmergencyTeamDoctorAssignment = async (assignment: EmergencyTeamDoctorAssignment): Promise<boolean> => {
  if (!assignment._id) return false;
  return updateDoc(assignment._id, assignment);
};

export const deleteEmergencyTeamDoctorAssignment = async (id: string, rev?: string): Promise<boolean> => {
  return deleteDoc(id, rev);
};

// Emergency Team - Outbreak Response Operations
export const getAllEmergencyTeamOutbreakResponses = async (): Promise<EmergencyTeamOutbreakResponse[]> => {
  return getAllDocsByType('emergency-team-outbreak-response');
};

export const getEmergencyTeamOutbreakResponseById = async (id: string): Promise<EmergencyTeamOutbreakResponse | null> => {
  return getDocById(id);
};

export const addEmergencyTeamOutbreakResponse = async (response: EmergencyTeamOutbreakResponse): Promise<string> => {
  return addDoc(response);
};

export const updateEmergencyTeamOutbreakResponse = async (response: EmergencyTeamOutbreakResponse): Promise<boolean> => {
  if (!response._id) return false;
  return updateDoc(response._id, response);
};

export const deleteEmergencyTeamOutbreakResponse = async (id: string, rev?: string): Promise<boolean> => {
  return deleteDoc(id, rev);
};

// Emergency Team - Maternal Response Operations
export const getAllEmergencyTeamMaternalResponses = async (): Promise<EmergencyTeamMaternalResponse[]> => {
  return getAllDocsByType('emergency-team-maternal-response');
};

export const getEmergencyTeamMaternalResponseById = async (id: string): Promise<EmergencyTeamMaternalResponse | null> => {
  return getDocById(id);
};

export const addEmergencyTeamMaternalResponse = async (response: EmergencyTeamMaternalResponse): Promise<string> => {
  return addDoc(response);
};

export const updateEmergencyTeamMaternalResponse = async (response: EmergencyTeamMaternalResponse): Promise<boolean> => {
  if (!response._id) return false;
  return updateDoc(response._id, response);
};

export const deleteEmergencyTeamMaternalResponse = async (id: string, rev?: string): Promise<boolean> => {
  return deleteDoc(id, rev);
};

// Emergency Team Deployment Operations
export const getAllEmergencyTeamDeployments = async (): Promise<EmergencyTeamDeployment[]> => {
  return getAllDocsByType('emergency-team-deployment');
};

export const getEmergencyTeamDeploymentById = async (id: string): Promise<EmergencyTeamDeployment | null> => {
  return getDocById(id);
};

export const addEmergencyTeamDeployment = async (deployment: EmergencyTeamDeployment): Promise<string> => {
  return addDoc(deployment);
};

export const updateEmergencyTeamDeployment = async (deployment: EmergencyTeamDeployment): Promise<boolean> => {
  if (!deployment._id) return false;
  return updateDoc(deployment._id, deployment);
};

export const deleteEmergencyTeamDeployment = async (id: string, rev?: string): Promise<boolean> => {
  return deleteDoc(id, rev);
};

// Emergency Team Training Operations
export const getAllEmergencyTeamTrainings = async (): Promise<EmergencyTeamTraining[]> => {
  return getAllDocsByType('emergency-team-training');
};

export const getEmergencyTeamTrainingById = async (id: string): Promise<EmergencyTeamTraining | null> => {
  return getDocById(id);
};

export const addEmergencyTeamTraining = async (training: EmergencyTeamTraining): Promise<string> => {
  return addDoc(training);
};

export const updateEmergencyTeamTraining = async (training: EmergencyTeamTraining): Promise<boolean> => {
  if (!training._id) return false;
  return updateDoc(training._id, training);
};

export const deleteEmergencyTeamTraining = async (id: string, rev?: string): Promise<boolean> => {
  return deleteDoc(id, rev);
};

// Relationship Query Functions

// Get all nurses assigned to a specific emergency team
export const getNursesByEmergencyTeam = async (emergencyTeamId: string): Promise<EmergencyTeamNurseAssignment[]> => {
  const assignments = await getAllEmergencyTeamNurseAssignments();
  return assignments.filter(assignment => assignment.emergencyTeamId === emergencyTeamId && assignment.status === 'active');
};

// Get all doctors assigned to a specific emergency team
export const getDoctorsByEmergencyTeam = async (emergencyTeamId: string): Promise<EmergencyTeamDoctorAssignment[]> => {
  const assignments = await getAllEmergencyTeamDoctorAssignments();
  return assignments.filter(assignment => assignment.emergencyTeamId === emergencyTeamId && assignment.status === 'active');
};

// Get all emergency teams a nurse is assigned to
export const getEmergencyTeamsByNurse = async (nurseId: string): Promise<EmergencyTeamNurseAssignment[]> => {
  const assignments = await getAllEmergencyTeamNurseAssignments();
  return assignments.filter(assignment => assignment.nurseId === nurseId && assignment.status === 'active');
};

// Get all emergency teams a doctor is assigned to
export const getEmergencyTeamsByDoctor = async (doctorId: string): Promise<EmergencyTeamDoctorAssignment[]> => {
  const assignments = await getAllEmergencyTeamDoctorAssignments();
  return assignments.filter(assignment => assignment.doctorId === doctorId && assignment.status === 'active');
};

// Get all outbreak responses for a specific emergency team
export const getOutbreakResponsesByTeam = async (emergencyTeamId: string): Promise<EmergencyTeamOutbreakResponse[]> => {
  const responses = await getAllEmergencyTeamOutbreakResponses();
  return responses.filter(response => response.emergencyTeamId === emergencyTeamId);
};

// Get all maternal responses for a specific emergency team
export const getMaternalResponsesByTeam = async (emergencyTeamId: string): Promise<EmergencyTeamMaternalResponse[]> => {
  const responses = await getAllEmergencyTeamMaternalResponses();
  return responses.filter(response => response.emergencyTeamId === emergencyTeamId);
};

// Get all deployments for a specific emergency team
export const getDeploymentsByTeam = async (emergencyTeamId: string): Promise<EmergencyTeamDeployment[]> => {
  const deployments = await getAllEmergencyTeamDeployments();
  return deployments.filter(deployment => deployment.emergencyTeamId === emergencyTeamId);
};

// Get emergency team statistics
export const getEmergencyTeamStats = async () => {
  const [teams, nurseAssignments, doctorAssignments, outbreakResponses, maternalResponses, deployments] = await Promise.all([
    getAllEmergencyTeams(),
    getAllEmergencyTeamNurseAssignments(),
    getAllEmergencyTeamDoctorAssignments(),
    getAllEmergencyTeamOutbreakResponses(),
    getAllEmergencyTeamMaternalResponses(),
    getAllEmergencyTeamDeployments()
  ]);

  const activeTeams = teams.filter(team => team.status === 'active').length;
  const totalNurseAssignments = nurseAssignments.filter(assignment => assignment.status === 'active').length;
  const totalDoctorAssignments = doctorAssignments.filter(assignment => assignment.status === 'active').length;
  const totalOutbreakResponses = outbreakResponses.length;
  const totalMaternalResponses = maternalResponses.length;
  const totalDeployments = deployments.length;
  const activeDeployments = deployments.filter(deployment => deployment.teamStatus === 'on-scene' || deployment.teamStatus === 'en-route').length;

  // Calculate average response time
  const completedDeployments = deployments.filter(deployment => deployment.responseTime > 0);
  const averageResponseTime = completedDeployments.length > 0 
    ? completedDeployments.reduce((sum, deployment) => sum + deployment.responseTime, 0) / completedDeployments.length 
    : 0;

  return {
    totalTeams: teams.length,
    activeTeams,
    totalNurseAssignments,
    totalDoctorAssignments,
    totalOutbreakResponses,
    totalMaternalResponses,
    totalDeployments,
    activeDeployments,
    averageResponseTime: Math.round(averageResponseTime * 100) / 100
  };
};

// Get available emergency teams for deployment
export const getAvailableEmergencyTeams = async (): Promise<EmergencyTeam[]> => {
  const teams = await getAllEmergencyTeams();
  return teams.filter(team => 
    team.status === 'active' && 
    team.availability.currentStatus === 'available'
  );
};

// Get emergency teams by specialization
export const getEmergencyTeamsBySpecialization = async (specialization: string): Promise<EmergencyTeam[]> => {
  const teams = await getAllEmergencyTeams();
  return teams.filter(team => 
    team.specializations.includes(specialization) && 
    team.status === 'active'
  );
};

// Get emergency teams by type
export const getEmergencyTeamsByType = async (teamType: string): Promise<EmergencyTeam[]> => {
  const teams = await getAllEmergencyTeams();
  return teams.filter(team => team.teamType === teamType && team.status === 'active');
}; 