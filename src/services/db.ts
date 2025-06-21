
// This file is being replaced by the new database module structure
// Import and re-export from the new structure for backward compatibility
import { initializeDatabase, getAllPatients, getAllNurses, getAllAppointments, getAllLabTests,
  getPatientById, getAppointmentsByDate, getTodayAppointments, authenticateUser } from './database';

export {
  initializeDatabase,
  getAllPatients,
  getAllNurses,
  getAllAppointments,
  getAllLabTests,
  getPatientById,
  getAppointmentsByDate,
  getTodayAppointments,
  authenticateUser
};

// Re-export types for backward compatibility
export type { Patient, Nurse, Appointment, LabTest, User } from './database';

// Notice: This file is deprecated and will be removed in a future version.
// Please import directly from the database module instead.
