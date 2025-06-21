
import { Medication } from './types';
import { getAllDocsByType, getDocById, addDoc, updateDoc, deleteDoc } from './core';

// Medication-specific functions
export const getAllMedications = async (): Promise<Medication[]> => {
  return getAllDocsByType<Medication>('medication');
};

export const getMedicationById = async (id: string): Promise<Medication | null> => {
  return getDocById<Medication>(id);
};

export const addMedication = async (medication: Medication): Promise<boolean> => {
  return addDoc<Medication>(medication);
};

export const updateMedication = async (medication: Medication): Promise<boolean> => {
  return updateDoc<Medication>(medication);
};

export const deleteMedication = async (id: string, rev: string): Promise<boolean> => {
  return deleteDoc(id, rev);
};

export const getMedicationsByPatient = async (patientId: string): Promise<Medication[]> => {
  const medications = await getAllMedications();
  return medications.filter(medication => medication.patientId === patientId);
};
