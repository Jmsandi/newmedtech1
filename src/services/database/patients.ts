
import { Patient } from './types';
import { getAllDocsByType, getDocById, addDoc, updateDoc, deleteDoc } from './core';

// Patient-specific functions
export const getAllPatients = async (): Promise<Patient[]> => {
  return getAllDocsByType<Patient>('patient');
};

export const getPatientById = async (id: string): Promise<Patient | null> => {
  return getDocById<Patient>(id);
};

export const addPatient = async (patient: Patient): Promise<boolean> => {
  return addDoc<Patient>(patient);
};

export const updatePatient = async (patient: Patient): Promise<boolean> => {
  return updateDoc<Patient>(patient);
};

export const deletePatient = async (id: string, rev: string): Promise<boolean> => {
  return deleteDoc(id, rev);
};

export const searchPatients = async (query: string): Promise<Patient[]> => {
  const patients = await getAllPatients();
  if (!query) return patients;
  
  const lowerQuery = query.toLowerCase();
  return patients.filter(patient => 
    patient.name.toLowerCase().includes(lowerQuery) || 
    patient.phone.includes(query) ||
    patient.condition.toLowerCase().includes(lowerQuery) ||
    patient._id.toLowerCase().includes(lowerQuery)
  );
};
