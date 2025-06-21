import { Doctor } from './types';
import { getAllDocsByType, getDocById, addDoc, updateDoc, deleteDoc } from './core';

// Doctor-specific functions
export const getAllDoctors = async (): Promise<Doctor[]> => {
  return getAllDocsByType<Doctor>('doctor');
};

export const getDoctorById = async (id: string): Promise<Doctor | null> => {
  return getDocById<Doctor>(id);
};

export const addDoctor = async (doctor: Doctor): Promise<string> => {
  return addDoc<Doctor>(doctor);
};

export const updateDoctor = async (id: string, updates: Partial<Doctor>): Promise<boolean> => {
  return updateDoc(id, updates);
};

export const deleteDoctor = async (id: string, rev: string): Promise<boolean> => {
  return deleteDoc(id, rev);
};

export const getDoctorsBySpecialization = async (specialization: string): Promise<Doctor[]> => {
  const doctors = await getAllDoctors();
  return doctors.filter(doctor => doctor.specialization === specialization);
};
