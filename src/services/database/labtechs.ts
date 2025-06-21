import { getAllDocsByType, getDocById, addDoc, updateDoc, deleteDoc } from './core';

// Lab Technician interface
export interface LabTechnician {
  _id: string;
  _rev?: string;
  type: 'labtech';
  name: string;
  specialization: string;
  qualification: string;
  experience: string;
  contactNumber: string;
  email: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  
  // Additional professional details
  licenseNumber?: string;
  certifications: string[];
  department: string;
  shift: 'Morning' | 'Evening' | 'Night' | 'Rotating';
  
  // Skills and capabilities
  testingCapabilities: string[];
  equipmentProficiency: string[];
  specializedTraining: string[];
  
  // Performance metrics
  averageTestsPerDay: number;
  accuracyRate: number; // percentage
  averageProcessingTime: number; // minutes per test
  
  // Emergency and outbreak readiness
  emergencyAvailable: boolean;
  outbreakTrainingCompleted: boolean;
  biosafetyCertifications: string[];
  
  // Employment details
  hireDate: string;
  supervisorId?: string;
  supervisorName?: string;
  
  // Contact and personal information
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  
  createdAt: string;
  updatedAt: string;
}

// Lab Technician Workload interface
export interface LabTechWorkload {
  _id: string;
  _rev?: string;
  type: 'labtech-workload';
  
  labTechId: string;
  labTechName: string;
  date: string;
  shift: string;
  
  // Daily workload metrics
  assignedTests: number;
  completedTests: number;
  pendingTests: number;
  
  // Test breakdown by type
  testBreakdown: {
    testType: string;
    assigned: number;
    completed: number;
    averageTime: number; // minutes
  }[];
  
  // Quality metrics
  qualityControlPassed: number;
  qualityControlFailed: number;
  retestRequired: number;
  
  // Time tracking
  shiftStartTime: string;
  shiftEndTime: string;
  actualWorkTime: number; // minutes
  breakTime: number; // minutes
  
  // Performance indicators
  efficiency: number; // percentage
  accuracy: number; // percentage
  productivity: number; // tests per hour
  
  // Notes and observations
  notes?: string;
  supervisorComments?: string;
  
  createdAt: string;
  updatedAt: string;
}

// Lab Technician Schedule interface
export interface LabTechSchedule {
  _id: string;
  _rev?: string;
  type: 'labtech-schedule';
  
  labTechId: string;
  labTechName: string;
  weekStartDate: string;
  
  // Weekly schedule
  schedule: {
    day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
    shift: 'Morning' | 'Evening' | 'Night' | 'Off';
    startTime?: string;
    endTime?: string;
    isOnCall: boolean;
    specialAssignment?: string;
  }[];
  
  // Availability for emergencies
  emergencyAvailable: boolean;
  emergencyContactMethod: string[];
  
  // Leave and time off
  scheduledLeave: {
    startDate: string;
    endDate: string;
    type: 'Vacation' | 'Sick' | 'Personal' | 'Training';
    approved: boolean;
  }[];
  
  createdAt: string;
  updatedAt: string;
}

// CRUD Functions for Lab Technicians
export const getAllLabTechnicians = async (): Promise<LabTechnician[]> => {
  return getAllDocsByType<LabTechnician>('labtech');
};

export const getLabTechnicianById = async (id: string): Promise<LabTechnician | null> => {
  return getDocById<LabTechnician>(id);
};

export const addLabTechnician = async (labTech: LabTechnician): Promise<string> => {
  return addDoc<LabTechnician>(labTech);
};

export const updateLabTechnician = async (labTech: LabTechnician): Promise<boolean> => {
  if (!labTech._id) return false;
  return updateDoc(labTech._id, labTech);
};

export const deleteLabTechnician = async (id: string, rev?: string): Promise<boolean> => {
  return deleteDoc(id, rev);
};

// CRUD Functions for Lab Tech Workload
export const getAllLabTechWorkloads = async (): Promise<LabTechWorkload[]> => {
  return getAllDocsByType<LabTechWorkload>('labtech-workload');
};

export const getLabTechWorkloadById = async (id: string): Promise<LabTechWorkload | null> => {
  return getDocById<LabTechWorkload>(id);
};

export const addLabTechWorkload = async (workload: LabTechWorkload): Promise<string> => {
  return addDoc<LabTechWorkload>(workload);
};

export const updateLabTechWorkload = async (workload: LabTechWorkload): Promise<boolean> => {
  if (!workload._id) return false;
  return updateDoc(workload._id, workload);
};

export const deleteLabTechWorkload = async (id: string, rev?: string): Promise<boolean> => {
  return deleteDoc(id, rev);
};

// CRUD Functions for Lab Tech Schedule
export const getAllLabTechSchedules = async (): Promise<LabTechSchedule[]> => {
  return getAllDocsByType<LabTechSchedule>('labtech-schedule');
};

export const getLabTechScheduleById = async (id: string): Promise<LabTechSchedule | null> => {
  return getDocById<LabTechSchedule>(id);
};

export const addLabTechSchedule = async (schedule: LabTechSchedule): Promise<string> => {
  return addDoc<LabTechSchedule>(schedule);
};

export const updateLabTechSchedule = async (schedule: LabTechSchedule): Promise<boolean> => {
  if (!schedule._id) return false;
  return updateDoc(schedule._id, schedule);
};

export const deleteLabTechSchedule = async (id: string, rev?: string): Promise<boolean> => {
  return deleteDoc(id, rev);
};

// Query Functions

// Get lab technicians by specialization
export const getLabTechsBySpecialization = async (specialization: string): Promise<LabTechnician[]> => {
  const labTechs = await getAllLabTechnicians();
  return labTechs.filter(labTech => 
    labTech.specialization.toLowerCase().includes(specialization.toLowerCase()) &&
    labTech.status === 'Active'
  );
};

// Get lab technicians by status
export const getLabTechsByStatus = async (status: string): Promise<LabTechnician[]> => {
  const labTechs = await getAllLabTechnicians();
  return labTechs.filter(labTech => labTech.status === status);
};

// Get lab technicians available for emergency
export const getEmergencyAvailableLabTechs = async (): Promise<LabTechnician[]> => {
  const labTechs = await getAllLabTechnicians();
  return labTechs.filter(labTech => 
    labTech.emergencyAvailable && 
    labTech.status === 'Active'
  );
};

// Get lab technicians by testing capability
export const getLabTechsByTestingCapability = async (capability: string): Promise<LabTechnician[]> => {
  const labTechs = await getAllLabTechnicians();
  return labTechs.filter(labTech => 
    labTech.testingCapabilities.includes(capability) &&
    labTech.status === 'Active'
  );
};

// Get lab technician workload by date range
export const getLabTechWorkloadByDateRange = async (
  labTechId: string, 
  startDate: string, 
  endDate: string
): Promise<LabTechWorkload[]> => {
  const workloads = await getAllLabTechWorkloads();
  return workloads.filter(workload => {
    const workloadDate = new Date(workload.date);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return workload.labTechId === labTechId && 
           workloadDate >= start && 
           workloadDate <= end;
  });
};

// Get current week schedule for lab technician
export const getCurrentWeekSchedule = async (labTechId: string): Promise<LabTechSchedule | null> => {
  const schedules = await getAllLabTechSchedules();
  const currentWeekStart = getWeekStartDate(new Date());
  
  return schedules.find(schedule => 
    schedule.labTechId === labTechId && 
    schedule.weekStartDate === currentWeekStart.toISOString().split('T')[0]
  ) || null;
};

// Get lab technicians on duty for specific shift
export const getLabTechsOnDuty = async (date: string, shift: string): Promise<LabTechnician[]> => {
  const schedules = await getAllLabTechSchedules();
  const labTechs = await getAllLabTechnicians();
  
  const weekStart = getWeekStartDate(new Date(date));
  const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
  
  const onDutySchedules = schedules.filter(schedule => {
    const scheduleWeekStart = new Date(schedule.weekStartDate);
    return scheduleWeekStart.getTime() === weekStart.getTime() &&
           schedule.schedule.some(day => 
             day.day === dayOfWeek && day.shift === shift
           );
  });
  
  const onDutyLabTechIds = onDutySchedules.map(schedule => schedule.labTechId);
  
  return labTechs.filter(labTech => 
    onDutyLabTechIds.includes(labTech._id) && 
    labTech.status === 'Active'
  );
};

// Get lab technician performance metrics
export const getLabTechPerformanceMetrics = async (labTechId: string, days: number = 30) => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const workloads = await getLabTechWorkloadByDateRange(
    labTechId, 
    startDate.toISOString().split('T')[0], 
    endDate.toISOString().split('T')[0]
  );
  
  if (workloads.length === 0) {
    return {
      totalTestsCompleted: 0,
      averageTestsPerDay: 0,
      averageAccuracy: 0,
      averageEfficiency: 0,
      averageProductivity: 0,
      totalWorkDays: 0
    };
  }
  
  const totalTestsCompleted = workloads.reduce((sum, workload) => sum + workload.completedTests, 0);
  const averageAccuracy = workloads.reduce((sum, workload) => sum + workload.accuracy, 0) / workloads.length;
  const averageEfficiency = workloads.reduce((sum, workload) => sum + workload.efficiency, 0) / workloads.length;
  const averageProductivity = workloads.reduce((sum, workload) => sum + workload.productivity, 0) / workloads.length;
  
  return {
    totalTestsCompleted,
    averageTestsPerDay: totalTestsCompleted / workloads.length,
    averageAccuracy,
    averageEfficiency,
    averageProductivity,
    totalWorkDays: workloads.length
  };
};

// Get department statistics
export const getDepartmentStats = async (department: string) => {
  const labTechs = await getAllLabTechnicians();
  const departmentLabTechs = labTechs.filter(labTech => labTech.department === department);
  
  const activeCount = departmentLabTechs.filter(labTech => labTech.status === 'Active').length;
  const onLeaveCount = departmentLabTechs.filter(labTech => labTech.status === 'On Leave').length;
  const inactiveCount = departmentLabTechs.filter(labTech => labTech.status === 'Inactive').length;
  
  const emergencyAvailableCount = departmentLabTechs.filter(labTech => 
    labTech.emergencyAvailable && labTech.status === 'Active'
  ).length;
  
  const outbreakTrainedCount = departmentLabTechs.filter(labTech => 
    labTech.outbreakTrainingCompleted && labTech.status === 'Active'
  ).length;
  
  return {
    totalLabTechs: departmentLabTechs.length,
    activeCount,
    onLeaveCount,
    inactiveCount,
    emergencyAvailableCount,
    outbreakTrainedCount,
    averageExperience: departmentLabTechs.length > 0 
      ? departmentLabTechs.reduce((sum, labTech) => {
          const years = parseInt(labTech.experience.replace(/\D/g, '')) || 0;
          return sum + years;
        }, 0) / departmentLabTechs.length 
      : 0
  };
};

// Utility function to get week start date (Monday)
function getWeekStartDate(date: Date): Date {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(date.setDate(diff));
}

// Update lab technician performance metrics
export const updateLabTechPerformanceMetrics = async (
  labTechId: string, 
  metrics: {
    averageTestsPerDay?: number;
    accuracyRate?: number;
    averageProcessingTime?: number;
  }
): Promise<boolean> => {
  const labTech = await getLabTechnicianById(labTechId);
  if (!labTech) return false;
  
  if (metrics.averageTestsPerDay !== undefined) {
    labTech.averageTestsPerDay = metrics.averageTestsPerDay;
  }
  if (metrics.accuracyRate !== undefined) {
    labTech.accuracyRate = metrics.accuracyRate;
  }
  if (metrics.averageProcessingTime !== undefined) {
    labTech.averageProcessingTime = metrics.averageProcessingTime;
  }
  
  labTech.updatedAt = new Date().toISOString();
  
  return updateLabTechnician(labTech);
}; 