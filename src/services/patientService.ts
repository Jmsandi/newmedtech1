
export interface VitalSigns {
  id: string;
  patientId: string;
  heartRate: number;
  bloodPressure: string;
  temperature: number;
  respiratoryRate: number;
  oxygenSaturation: number;
  timestamp: string;
  recordedBy: string;
}

export interface PatientNote {
  id: string;
  patientId: string;
  content: string;
  author: string;
  timestamp: string;
  type: 'general' | 'medication' | 'care' | 'observation';
}

export interface Medication {
  id: string;
  patientId: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  instructions: string;
  prescribedBy: string;
  administeredBy?: string;
  administeredAt?: string;
}

export interface CarePlan {
  id: string;
  patientId: string;
  diagnosis: string;
  goals: string[];
  interventions: string[];
  createdBy: string;
  createdAt: string;
  status: 'active' | 'completed' | 'on-hold';
  reviewDate: string;
}

// Mock data storage (in a real app, this would be a database)
let vitals: VitalSigns[] = [];
let notes: PatientNote[] = [];
let medications: Medication[] = [];
let carePlans: CarePlan[] = [];

export const patientService = {
  // Vitals management
  addVitals: (vital: Omit<VitalSigns, 'id'>) => {
    const newVital = { ...vital, id: Date.now().toString() };
    vitals.push(newVital);
    return newVital;
  },

  getVitalsByPatient: (patientId: string) => {
    return vitals.filter(v => v.patientId === patientId);
  },

  // Notes management
  addNote: (note: Omit<PatientNote, 'id'>) => {
    const newNote = { ...note, id: Date.now().toString() };
    notes.push(newNote);
    return newNote;
  },

  getNotesByPatient: (patientId: string) => {
    return notes.filter(n => n.patientId === patientId);
  },

  // Medication management
  addMedication: (medication: Omit<Medication, 'id'>) => {
    const newMedication = { ...medication, id: Date.now().toString() };
    medications.push(newMedication);
    return newMedication;
  },

  getMedicationsByPatient: (patientId: string) => {
    return medications.filter(m => m.patientId === patientId);
  },

  administerMedication: (medicationId: string, administeredBy: string) => {
    const medication = medications.find(m => m.id === medicationId);
    if (medication) {
      medication.administeredBy = administeredBy;
      medication.administeredAt = new Date().toISOString();
    }
    return medication;
  },

  // Care plans management
  addCarePlan: (plan: Omit<CarePlan, 'id'>) => {
    const newPlan = { ...plan, id: Date.now().toString() };
    carePlans.push(newPlan);
    return newPlan;
  },

  getCarePlansByPatient: (patientId: string) => {
    return carePlans.filter(cp => cp.patientId === patientId);
  },

  updateCarePlan: (planId: string, updates: Partial<CarePlan>) => {
    const planIndex = carePlans.findIndex(cp => cp.id === planId);
    if (planIndex !== -1) {
      carePlans[planIndex] = { ...carePlans[planIndex], ...updates };
      return carePlans[planIndex];
    }
    return null;
  }
};
