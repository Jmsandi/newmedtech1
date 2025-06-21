import { getAllDocsByType, getDocCount, addDoc, updateDoc, deleteDoc, searchDocs } from './core';
import { Patient, Doctor, Nurse, Appointment, LabTest, User } from './types';

// Admin Dashboard Statistics
export const getAdminDashboardStats = async () => {
  try {
    const [patientCount, doctorCount, nurseCount, appointmentCount, todayAppointments] = await Promise.all([
      getDocCount('patient'),
      getDocCount('doctor'), 
      getDocCount('nurse'),
      getDocCount('appointment'),
      getTodayAppointmentsCount()
    ]);

    return {
      totalPatients: patientCount,
      totalDoctors: doctorCount,
      totalNurses: nurseCount,
      totalAppointments: appointmentCount,
      todayAppointments: todayAppointments,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error getting admin dashboard stats:', error);
    return {
      totalPatients: 0,
      totalDoctors: 0,
      totalNurses: 0,
      totalAppointments: 0,
      todayAppointments: 0,
      lastUpdated: new Date().toISOString()
    };
  }
};

// Get today's appointments count
const getTodayAppointmentsCount = async (): Promise<number> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const appointments = await getAllDocsByType<Appointment>('appointment');
    return appointments.filter(apt => apt.date === today).length;
  } catch (error) {
    console.error('Error getting today appointments count:', error);
    return 0;
  }
};

// Patient Management
export const getAllPatientsForAdmin = async (): Promise<Patient[]> => {
  return await getAllDocsByType<Patient>('patient');
};

export const searchPatientsAdmin = async (searchTerm: string): Promise<Patient[]> => {
  try {
    const allPatients = await getAllDocsByType<Patient>('patient');
    return allPatients.filter(patient => 
      patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.condition?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone?.includes(searchTerm)
    );
  } catch (error) {
    console.error('Error searching patients:', error);
    return [];
  }
};

export const addPatientAdmin = async (patientData: Omit<Patient, '_id' | 'type'>): Promise<boolean> => {
  const patient: Patient = {
    _id: `patient_${Date.now()}`,
    type: 'patient',
    ...patientData,
    createdAt: new Date().toISOString()
  };
  return await addDoc(patient);
};

export const updatePatientAdmin = async (patient: Patient): Promise<boolean> => {
  return await updateDoc(patient);
};

export const deletePatientAdmin = async (patientId: string): Promise<boolean> => {
  return await deleteDoc(patientId);
};

// Doctor Management
export const getAllDoctorsForAdmin = async (): Promise<Doctor[]> => {
  return await getAllDocsByType<Doctor>('doctor');
};

export const searchDoctorsAdmin = async (searchTerm: string): Promise<Doctor[]> => {
  try {
    const allDoctors = await getAllDocsByType<Doctor>('doctor');
    return allDoctors.filter(doctor => 
      doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  } catch (error) {
    console.error('Error searching doctors:', error);
    return [];
  }
};

export const addDoctorAdmin = async (doctorData: Omit<Doctor, '_id' | 'type'>): Promise<boolean> => {
  const doctor: Doctor = {
    _id: `doctor_${Date.now()}`,
    type: 'doctor',
    ...doctorData
  };
  return await addDoc(doctor);
};

export const updateDoctorAdmin = async (doctor: Doctor): Promise<boolean> => {
  return await updateDoc(doctor);
};

export const deleteDoctorAdmin = async (doctorId: string): Promise<boolean> => {
  return await deleteDoc(doctorId);
};

// Nurse Management  
export const getAllNursesForAdmin = async (): Promise<Nurse[]> => {
  return await getAllDocsByType<Nurse>('nurse');
};

export const searchNursesAdmin = async (searchTerm: string): Promise<Nurse[]> => {
  try {
    const allNurses = await getAllDocsByType<Nurse>('nurse');
    return allNurses.filter(nurse => 
      nurse.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nurse.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nurse.ward?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  } catch (error) {
    console.error('Error searching nurses:', error);
    return [];
  }
};

export const addNurseAdmin = async (nurseData: Omit<Nurse, '_id' | 'type'>): Promise<boolean> => {
  const nurse: Nurse = {
    _id: `nurse_${Date.now()}`,
    type: 'nurse',
    ...nurseData
  };
  return await addDoc(nurse);
};

export const updateNurseAdmin = async (nurse: Nurse): Promise<boolean> => {
  return await updateDoc(nurse);
};

export const deleteNurseAdmin = async (nurseId: string): Promise<boolean> => {
  return await deleteDoc(nurseId);
};

// Appointment Management
export const getAllAppointmentsForAdmin = async (): Promise<Appointment[]> => {
  return await getAllDocsByType<Appointment>('appointment');
};

export const getTodayAppointmentsAdmin = async (): Promise<Appointment[]> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const appointments = await getAllDocsByType<Appointment>('appointment');
    return appointments.filter(apt => apt.date === today);
  } catch (error) {
    console.error('Error getting today appointments:', error);
    return [];
  }
};

export const getAppointmentsByDateRangeAdmin = async (startDate: string, endDate: string): Promise<Appointment[]> => {
  try {
    const appointments = await getAllDocsByType<Appointment>('appointment');
    return appointments.filter(apt => 
      apt.date >= startDate && apt.date <= endDate
    );
  } catch (error) {
    console.error('Error getting appointments by date range:', error);
    return [];
  }
};

// Chart data for admin dashboard
export const getPatientTrendDataAdmin = async () => {
  try {
    const appointments = await getAllDocsByType<Appointment>('appointment');
    const patients = await getAllDocsByType<Patient>('patient');
    
    // Generate monthly data for the last 6 months
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const currentMonth = new Date().getMonth();
    
    return months.map((month, index) => {
      // Simulate data based on current patients and appointments
      // In a real app, you'd filter by actual dates
      const basePatients = Math.floor(patients.length / 6);
      const baseAppointments = Math.floor(appointments.length / 6);
      
      return {
        month,
        inPatients: basePatients + Math.floor(Math.random() * 20),
        outPatients: baseAppointments + Math.floor(Math.random() * 30)
      };
    });
  } catch (error) {
    console.error('Error getting patient trend data:', error);
    return [];
  }
};

// User Management
export const getAllUsersForAdmin = async (): Promise<User[]> => {
  return await getAllDocsByType<User>('user');
};

export const addUserAdmin = async (userData: Omit<User, '_id' | 'type'>): Promise<boolean> => {
  const user: User = {
    _id: `user_${Date.now()}`,
    type: 'user',
    ...userData
  };
  return await addDoc(user);
};

export const updateUserAdmin = async (user: User): Promise<boolean> => {
  return await updateDoc(user);
};

export const deleteUserAdmin = async (userId: string): Promise<boolean> => {
  return await deleteDoc(userId);
}; 