import { initializeDemoData } from './demo';
import { addDoc } from './core';
import db from './core';

// Import all module functions to re-export
import { getAllPatients, getPatientById } from './patients';
import { getAllNurses } from './nurses';
import { getAllAppointments, getAppointmentsByDate, getTodayAppointments } from './appointments';
import { getAllLabTests } from './lab-tests';
import { authenticateUser } from './auth';

// Add maternal mortality demo data
const initializeMaternalMortalityData = async () => {
  try {
    console.log('Initializing maternal mortality demo data...');
    
    // Sample Health Facility
    const sampleFacility = {
      _id: 'facility_001',
      type: 'health-facility' as const,
      name: 'Central Maternal Health Center',
      facilityType: 'referral-hospital' as const,
      location: {
        district: 'Central District',
        region: 'Capital Region',
        coordinates: {
          latitude: -1.2921,
          longitude: 36.8219
        }
      },
      services: {
        antenatalCare: true,
        delivery: true,
        emergencyObstetricCare: true,
        surgery: true,
        bloodTransfusion: true,
        icu: true
      },
      staff: {
        doctors: 8,
        nurses: 24,
        midwives: 12,
        specialists: 4
      },
      equipment: {
        ultrasound: true,
        operatingTheater: true,
        ambulance: true,
        oxygenSupply: true,
        bloodBank: true
      },
      contactNumber: '+254-700-123456',
      email: 'info@centralmhc.go.ke',
      operatingHours: '24/7',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Sample Maternal Patients
    const samplePatients = [
      {
        _id: 'maternal_patient_001',
        type: 'maternal-patient' as const,
        firstName: 'Sarah',
        lastName: 'Johnson',
        dateOfBirth: '1985-03-15',
        nationalId: '12345678',
        phoneNumber: '+1 (555) 123-4567',
        emergencyContact: 'John Johnson',
        emergencyPhone: '+1 (555) 123-4568',
        address: '123 Main St, Springfield, IL',
        district: 'Central District',
        village: 'Westlands',
        gestationalAge: 32,
        parity: 1,
        gravidity: 2,
        expectedDeliveryDate: '2025-08-15',
        currentPregnancyNumber: 2,
        previousComplications: ['Preeclampsia'],
        chronicDiseases: ['Hypertension'],
        allergies: [],
        currentMedications: ['Methyldopa 250mg'],
        bloodType: 'O+',
        education: 'tertiary' as const,
        occupation: 'Teacher',
        maritalStatus: 'married' as const,
        householdIncome: 'medium' as const,
        registeredBy: 'Dr. Mary Nurse',
        registrationDate: '2024-01-10',
        facilityId: 'facility_001',
        status: 'active' as const,
        createdAt: '2024-01-10T10:00:00Z',
        updatedAt: '2025-05-28T15:30:00Z'
      },
      {
        _id: 'maternal_patient_002',
        type: 'maternal-patient' as const,
        firstName: 'Maria',
        lastName: 'Rodriguez',
        dateOfBirth: '1990-07-22',
        nationalId: '87654321',
        phoneNumber: '+1 (555) 333-3333',
        emergencyContact: 'Carlos Rodriguez',
        emergencyPhone: '+1 (555) 444-4444',
        address: '456 Oak Avenue, Northern Region',
        district: 'Northern Region',
        village: 'Kileleshwa',
        gestationalAge: 28,
        parity: 0,
        gravidity: 1,
        expectedDeliveryDate: '2025-09-01',
        currentPregnancyNumber: 1,
        previousComplications: [],
        chronicDiseases: ['Diabetes Type 2'],
        allergies: ['Penicillin'],
        currentMedications: ['Insulin', 'Folic Acid'],
        bloodType: 'A+',
        education: 'secondary' as const,
        occupation: 'Shop Owner',
        maritalStatus: 'married' as const,
        householdIncome: 'low' as const,
        registeredBy: 'Nurse Jane Doe',
        registrationDate: '2024-01-15',
        facilityId: 'facility_001',
        status: 'active' as const,
        createdAt: '2024-01-15T14:00:00Z',
        updatedAt: '2024-01-25T09:45:00Z'
      },
      {
        _id: 'maternal_patient_003',
        type: 'maternal-patient' as const,
        firstName: 'Emma',
        lastName: 'Thompson',
        dateOfBirth: '1992-11-08',
        nationalId: '11223344',
        phoneNumber: '+1 (555) 555-5555',
        emergencyContact: 'David Thompson',
        emergencyPhone: '+1 (555) 555-5556',
        address: '789 Pine Street, Eastern District',
        district: 'Eastern District',
        village: 'Karen',
        gestationalAge: 24,
        parity: 2,
        gravidity: 3,
        expectedDeliveryDate: '2025-10-15',
        currentPregnancyNumber: 3,
        previousComplications: ['Gestational Diabetes'],
        chronicDiseases: [],
        allergies: ['Latex'],
        currentMedications: ['Prenatal vitamins', 'Iron supplements'],
        bloodType: 'B+',
        education: 'tertiary' as const,
        occupation: 'Nurse',
        maritalStatus: 'married' as const,
        householdIncome: 'high' as const,
        registeredBy: 'Dr. Sarah Wilson',
        registrationDate: '2024-02-01',
        facilityId: 'facility_001',
        status: 'active' as const,
        createdAt: '2024-02-01T08:00:00Z',
        updatedAt: '2024-02-15T11:20:00Z'
      },
      {
        _id: 'maternal_patient_004',
        type: 'maternal-patient' as const,
        firstName: 'Aisha',
        lastName: 'Patel',
        dateOfBirth: '1988-05-12',
        nationalId: '55667788',
        phoneNumber: '+1 (555) 777-7777',
        emergencyContact: 'Raj Patel',
        emergencyPhone: '+1 (555) 777-7778',
        address: '321 Elm Drive, Western Region',
        district: 'Western Region',
        village: 'Lavington',
        gestationalAge: 36,
        parity: 1,
        gravidity: 2,
        expectedDeliveryDate: '2025-07-20',
        currentPregnancyNumber: 2,
        previousComplications: [],
        chronicDiseases: ['Asthma'],
        allergies: ['Shellfish'],
        currentMedications: ['Albuterol inhaler', 'Prenatal vitamins'],
        bloodType: 'AB+',
        education: 'tertiary' as const,
        occupation: 'Software Engineer',
        maritalStatus: 'married' as const,
        householdIncome: 'high' as const,
        registeredBy: 'Dr. Michael Chen',
        registrationDate: '2024-01-20',
        facilityId: 'facility_001',
        status: 'active' as const,
        createdAt: '2024-01-20T09:30:00Z',
        updatedAt: '2024-02-10T14:15:00Z'
      },
      {
        _id: 'maternal_patient_005',
        type: 'maternal-patient' as const,
        firstName: 'Grace',
        lastName: 'Ochieng',
        dateOfBirth: '1995-09-25',
        nationalId: '99887766',
        phoneNumber: '+1 (555) 888-8888',
        emergencyContact: 'Peter Ochieng',
        emergencyPhone: '+1 (555) 888-8889',
        address: '654 Maple Lane, Southern District',
        district: 'Southern District',
        village: 'Langata',
        gestationalAge: 20,
        parity: 0,
        gravidity: 1,
        expectedDeliveryDate: '2025-11-30',
        currentPregnancyNumber: 1,
        previousComplications: [],
        chronicDiseases: [],
        allergies: [],
        currentMedications: ['Folic acid', 'Iron supplements'],
        bloodType: 'O-',
        education: 'secondary' as const,
        occupation: 'Student',
        maritalStatus: 'single' as const,
        householdIncome: 'low' as const,
        registeredBy: 'Nurse Patricia Wanjiku',
        registrationDate: '2024-02-10',
        facilityId: 'facility_001',
        status: 'active' as const,
        createdAt: '2024-02-10T13:45:00Z',
        updatedAt: '2024-02-20T10:30:00Z'
      }
    ];

    // Sample Emergency Alert
    const sampleAlert = {
      _id: 'alert_001',
      type: 'emergency-alert' as const,
      patientId: 'maternal_patient_001',
      facilityId: 'facility_001',
      alertType: 'high-risk' as const,
      severity: 'high' as const,
      title: 'High Blood Pressure Alert',
      description: 'Patient Sarah Johnson showing signs of severe preeclampsia - BP 160/110',
      status: 'active' as const,
      createdBy: 'Dr. Mary Nurse',
      createdAt: '2024-01-25T16:30:00Z'
    };

    await Promise.all([
      addDoc(sampleFacility),
      ...samplePatients.map(patient => addDoc(patient)),
      addDoc(sampleAlert)
    ]);

    console.log('Maternal mortality demo data initialized successfully');
  } catch (error) {
    console.error('Error initializing maternal mortality demo data:', error);
  }
};

// Update the main initialization function
export const initializeDatabase = async () => {
  try {
    // Check if database is already initialized
    const result = await db.allDocs();
    if (result.total_rows > 0) {
      console.log(`Database already initialized with ${result.total_rows} documents`);
      return;
    }

    console.log('Initializing database with demo data...');
    
    // Initialize all demo data
    await Promise.all([
      initializeDemoData(),
      initializeMaternalMortalityData()
    ]);
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Function to clear and reinitialize database with fresh data
export const clearAndReinitializeDatabase = async () => {
  try {
    console.log('Clearing existing database...');
    
    // Get all documents
    const result = await db.allDocs({ include_docs: true });
    
    // Delete all documents
    const docsToDelete = result.rows.map(row => ({
      _id: row.doc!._id,
      _rev: row.doc!._rev,
      _deleted: true
    }));
    
    if (docsToDelete.length > 0) {
      await db.bulkDocs(docsToDelete);
      console.log(`Deleted ${docsToDelete.length} existing documents`);
    }
    
    // Reinitialize with fresh data
    console.log('Reinitializing database with fresh demo data...');
    await Promise.all([
      initializeDemoData(),
      initializeMaternalMortalityData()
    ]);
    
    console.log('Database cleared and reinitialized successfully');
  } catch (error) {
    console.error('Error clearing and reinitializing database:', error);
  }
};

// Re-export all database functions
export * from './core';
export * from './types';
export * from './demo';
export * from './patients';
export * from './nurses';
export * from './appointments';
export * from './lab-tests';
export * from './auth';
export * from './doctors';
export * from './medications';
export * from './maternal-mortality';
export * from './maternal-lab-tests';
export * from './admin-services';
export * from './doctor-maternal';

// Export specific functions for backward compatibility
export {
  getAllPatients,
  getPatientById,
  getAllNurses,
  getAllAppointments,
  getAppointmentsByDate,
  getTodayAppointments,
  getAllLabTests,
  authenticateUser
};
