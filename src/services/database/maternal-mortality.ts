import { getAllDocsByType, getDocById, addDoc, updateDoc, deleteDoc } from './core';
import {
  MaternalPatient,
  HealthFacility,
  ANCVisit,
  RiskAssessment,
  EmergencyAlert,
  MaternalIncident,
  ReferralRecord
} from './maternal-types';

// Export the types for use in components
export type { MaternalPatient } from './maternal-types';

// Maternal Patients
export const getAllMaternalPatients = () => getAllDocsByType<MaternalPatient>('maternal-patient');
export const getMaternalPatientById = (id: string) => getDocById<MaternalPatient>(id);
export const addMaternalPatient = (patient: MaternalPatient) => addDoc(patient);
export const updateMaternalPatient = (patient: MaternalPatient) => updateDoc(patient);
export const deleteMaternalPatient = (id: string, rev: string) => deleteDoc(id, rev);

// Health Facilities
export const getAllHealthFacilities = () => getAllDocsByType<HealthFacility>('health-facility');
export const getHealthFacilityById = (id: string) => getDocById<HealthFacility>(id);
export const addHealthFacility = (facility: HealthFacility) => addDoc(facility);
export const updateHealthFacility = (facility: HealthFacility) => updateDoc(facility);
export const deleteHealthFacility = (id: string, rev: string) => deleteDoc(id, rev);

// ANC Visits
export const getAllANCVisits = () => getAllDocsByType<ANCVisit>('anc-visit');
export const getANCVisitById = (id: string) => getDocById<ANCVisit>(id);
export const getANCVisitsByPatient = async (patientId: string): Promise<ANCVisit[]> => {
  const allVisits = await getAllANCVisits();
  return allVisits.filter(visit => visit.patientId === patientId);
};
export const addANCVisit = (visit: ANCVisit) => addDoc(visit);
export const updateANCVisit = (visit: ANCVisit) => updateDoc(visit);
export const deleteANCVisit = (id: string, rev: string) => deleteDoc(id, rev);

// Risk Assessments
export const getAllRiskAssessments = () => getAllDocsByType<RiskAssessment>('risk-assessment');
export const getRiskAssessmentById = (id: string) => getDocById<RiskAssessment>(id);
export const getRiskAssessmentsByPatient = async (patientId: string): Promise<RiskAssessment[]> => {
  const allAssessments = await getAllRiskAssessments();
  return allAssessments.filter(assessment => assessment.patientId === patientId);
};
export const addRiskAssessment = (assessment: RiskAssessment) => addDoc(assessment);
export const updateRiskAssessment = (assessment: RiskAssessment) => updateDoc(assessment);
export const deleteRiskAssessment = (id: string, rev: string) => deleteDoc(id, rev);

// Emergency Alerts
export const getAllEmergencyAlerts = () => getAllDocsByType<EmergencyAlert>('emergency-alert');
export const getEmergencyAlertById = (id: string) => getDocById<EmergencyAlert>(id);
export const getActiveEmergencyAlerts = async (): Promise<EmergencyAlert[]> => {
  const allAlerts = await getAllEmergencyAlerts();
  return allAlerts.filter(alert => alert.status === 'active');
};
export const addEmergencyAlert = (alert: EmergencyAlert) => addDoc(alert);
export const updateEmergencyAlert = (alert: EmergencyAlert) => updateDoc(alert);
export const deleteEmergencyAlert = (id: string, rev: string) => deleteDoc(id, rev);

// Maternal Incidents
export const getAllMaternalIncidents = () => getAllDocsByType<MaternalIncident>('maternal-incident');
export const getMaternalIncidentById = (id: string) => getDocById<MaternalIncident>(id);
export const getMaternalIncidentsByFacility = async (facilityId: string): Promise<MaternalIncident[]> => {
  const allIncidents = await getAllMaternalIncidents();
  return allIncidents.filter(incident => incident.facilityId === facilityId);
};
export const addMaternalIncident = (incident: MaternalIncident) => addDoc(incident);
export const updateMaternalIncident = (incident: MaternalIncident) => updateDoc(incident);
export const deleteMaternalIncident = (id: string, rev: string) => deleteDoc(id, rev);

// Referral Records
export const getAllReferralRecords = () => getAllDocsByType<ReferralRecord>('referral-record');
export const getReferralRecordById = (id: string) => getDocById<ReferralRecord>(id);
export const getReferralRecordsByPatient = async (patientId: string): Promise<ReferralRecord[]> => {
  const allReferrals = await getAllReferralRecords();
  return allReferrals.filter(referral => referral.patientId === patientId);
};
export const addReferralRecord = (referral: ReferralRecord) => addDoc(referral);
export const updateReferralRecord = (referral: ReferralRecord) => updateDoc(referral);
export const deleteReferralRecord = (id: string, rev: string) => deleteDoc(id, rev);

// Analytics and Reporting Functions
export const getMaternalMortalityStats = async () => {
  const [patients, incidents, alerts, facilities] = await Promise.all([
    getAllMaternalPatients(),
    getAllMaternalIncidents(),
    getAllEmergencyAlerts(),
    getAllHealthFacilities()
  ]);

  const totalPatients = patients.length;
  const highRiskPatients = patients.filter(p => p.status === 'active').length;
  const activeAlerts = alerts.filter(a => a.status === 'active').length;
  const maternalDeaths = incidents.filter(i => i.incidentType === 'maternal-death').length;
  
  // Calculate mortality rate (deaths per 100,000 live births - simplified)
  const mortalityRate = totalPatients > 0 ? (maternalDeaths / totalPatients) * 100000 : 0;

  return {
    totalPatients,
    highRiskPatients,
    activeAlerts,
    maternalDeaths,
    mortalityRate: Math.round(mortalityRate * 100) / 100,
    totalFacilities: facilities.length
  };
};

export const getRiskDistribution = async () => {
  const assessments = await getAllRiskAssessments();
  const distribution = {
    low: 0,
    medium: 0,
    high: 0,
    critical: 0
  };

  assessments.forEach(assessment => {
    distribution[assessment.riskLevel]++;
  });

  return distribution;
};

export const getRecentIncidents = async (limit: number = 10): Promise<MaternalIncident[]> => {
  const incidents = await getAllMaternalIncidents();
  return incidents
    .sort((a, b) => new Date(b.incidentDate).getTime() - new Date(a.incidentDate).getTime())
    .slice(0, limit);
};
