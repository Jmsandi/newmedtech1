
import { Nurse } from './types';
import { getAllDocsByType, getDocById, addDoc, updateDoc, deleteDoc } from './core';

// Nurse-specific functions
export const getAllNurses = async (): Promise<Nurse[]> => {
  return getAllDocsByType<Nurse>('nurse');
};

export const getNurseById = async (id: string): Promise<Nurse | null> => {
  return getDocById<Nurse>(id);
};

export const addNurse = async (nurse: Nurse): Promise<boolean> => {
  return addDoc<Nurse>(nurse);
};

export const updateNurse = async (nurse: Nurse): Promise<boolean> => {
  return updateDoc<Nurse>(nurse);
};

export const deleteNurse = async (id: string, rev: string): Promise<boolean> => {
  return deleteDoc(id, rev);
};

export const getNursesByWard = async (ward: string): Promise<Nurse[]> => {
  const nurses = await getAllNurses();
  return nurses.filter(nurse => nurse.ward === ward);
};

export const getNursesByShift = async (shift: string): Promise<Nurse[]> => {
  const nurses = await getAllNurses();
  return nurses.filter(nurse => nurse.shift === shift);
};
