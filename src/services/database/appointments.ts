
import { Appointment } from './types';
import { getAllDocsByType, getDocById, addDoc, updateDoc, deleteDoc } from './core';

// Appointment-specific functions
export const getAllAppointments = async (): Promise<Appointment[]> => {
  return getAllDocsByType<Appointment>('appointment');
};

export const getAppointmentById = async (id: string): Promise<Appointment | null> => {
  return getDocById<Appointment>(id);
};

export const addAppointment = async (appointment: Appointment): Promise<boolean> => {
  return addDoc<Appointment>(appointment);
};

export const updateAppointment = async (appointment: Appointment): Promise<boolean> => {
  return updateDoc<Appointment>(appointment);
};

export const deleteAppointment = async (id: string, rev: string): Promise<boolean> => {
  return deleteDoc(id, rev);
};

export const getAppointmentsByDate = async (date: string): Promise<Appointment[]> => {
  const allAppointments = await getAllAppointments();
  return allAppointments.filter(appointment => appointment.date === date);
};

export const getAppointmentsByPatient = async (patientId: string): Promise<Appointment[]> => {
  const allAppointments = await getAllAppointments();
  return allAppointments.filter(appointment => appointment.patientId === patientId);
};

export const getAppointmentsByDoctor = async (doctor: string): Promise<Appointment[]> => {
  const allAppointments = await getAllAppointments();
  return allAppointments.filter(appointment => appointment.doctor === doctor);
};

export const getTodayAppointments = async (): Promise<Appointment[]> => {
  const today = new Date().toISOString().split('T')[0];
  return getAppointmentsByDate(today);
};
