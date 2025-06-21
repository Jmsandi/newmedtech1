import { addDoc } from './core';
import { Patient, Nurse, Appointment, LabTest, LabRequest, User, Doctor, Medication, TestParameter } from './types';

export const initializeDemoData = async () => {
  try {
    console.log('Initializing comprehensive hospital demo data...');
    
    // Sample Users
    const sampleUsers: User[] = [
      {
        _id: 'user_admin',
        type: 'user',
        username: 'admin',
        password: 'admin123',
        role: 'admin',
        name: 'System Administrator'
      },
      {
        _id: 'user_doctor1',
        type: 'user',
        username: 'doctor1',
        password: 'doctor123',
        role: 'doctor',
        name: 'Dr. John Smith'
      },
      {
        _id: 'user_doctor2',
        type: 'user',
        username: 'doctor2',
        password: 'doctor123',
        role: 'doctor',
        name: 'Dr. Sarah Wilson'
      },
      {
        _id: 'user_nurse',
        type: 'user',
        username: 'nurse',
        password: 'nurse123',
        role: 'nurse',
        name: 'Nurse Mary Johnson'
      },
      {
        _id: 'user_labtech',
        type: 'user',
        username: 'labtech',
        password: 'lab123',
        role: 'labtech',
        name: 'Lab Technician Mike'
      }
    ];

    // Sample Patients
    const samplePatients: Patient[] = [
      {
        _id: 'patient_001',
        type: 'patient',
        name: 'Alice Johnson',
        age: 35,
        gender: 'Female',
        phone: '+1-555-0101',
        condition: 'Hypertension',
        email: 'alice.johnson@email.com',
        address: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        zipCode: '62701',
        createdAt: new Date().toISOString()
      },
      {
        _id: 'patient_002',
        type: 'patient',
        name: 'Bob Smith',
        age: 42,
        gender: 'Male',
        phone: '+1-555-0102',
        condition: 'Diabetes Type 2',
        email: 'bob.smith@email.com',
        address: '456 Oak Ave',
        city: 'Springfield',
        state: 'IL',
        zipCode: '62702',
        createdAt: new Date().toISOString()
      },
      {
        _id: 'patient_003',
        type: 'patient',
        name: 'Carol Davis',
        age: 28,
        gender: 'Female',
        phone: '+1-555-0103',
        condition: 'Anemia',
        email: 'carol.davis@email.com',
        address: '789 Pine St',
        city: 'Springfield',
        state: 'IL',
        zipCode: '62703',
        createdAt: new Date().toISOString()
      },
      {
        _id: 'patient_004',
        type: 'patient',
        name: 'David Wilson',
        age: 55,
        gender: 'Male',
        phone: '+1-555-0104',
        condition: 'Chest Pain',
        email: 'david.wilson@email.com',
        address: '321 Elm St',
        city: 'Springfield',
        state: 'IL',
        zipCode: '62704',
        createdAt: new Date().toISOString()
      },
      {
        _id: 'patient_005',
        type: 'patient',
        name: 'Emma Brown',
        age: 31,
        gender: 'Female',
        phone: '+1-555-0105',
        condition: 'Pregnancy - First Trimester',
        email: 'emma.brown@email.com',
        address: '654 Maple Ave',
        city: 'Springfield',
        state: 'IL',
        zipCode: '62705',
        createdAt: new Date().toISOString()
      }
    ];

    // Sample Doctors
    const sampleDoctors: Doctor[] = [
      {
        _id: 'doctor_001',
        type: 'doctor',
        name: 'Dr. Sarah Johnson',
        specialization: 'Obstetrics & Gynecology',
        contactNumber: '+1-555-0101',
        email: 'sarah.johnson@hospital.com',
        availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        experience: '12 years',
        
        // Maternal Health Specialization
        maternalHealthSpecialist: true,
        maternalHealthCertifications: [
          'Board Certified Obstetrician-Gynecologist',
          'Maternal-Fetal Medicine Fellowship',
          'Advanced Life Support in Obstetrics (ALSO)',
          'Neonatal Resuscitation Program (NRP)'
        ],
        maternalHealthExperience: 12,
        
        // Maternal Mortality Tracking Capabilities
        canManageMaternalCases: true,
        canPerformEmergencyObstetricCare: true,
        canPerformSurgery: true,
        
        // Performance Metrics
        maternalCasesHandled: 245,
        maternalSuccessRate: 98.5,
        emergencyResponseTime: 15, // minutes
        
        // Facility Assignment
        primaryFacilityId: 'facility_001',
        secondaryFacilities: ['facility_002'],
        
        // Emergency Availability
        emergencyAvailable: true,
        onCallSchedule: [
          { day: 'Monday', startTime: '08:00', endTime: '18:00' },
          { day: 'Tuesday', startTime: '08:00', endTime: '18:00' },
          { day: 'Wednesday', startTime: '08:00', endTime: '18:00' },
          { day: 'Thursday', startTime: '08:00', endTime: '18:00' },
          { day: 'Friday', startTime: '08:00', endTime: '18:00' },
          { day: 'Saturday', startTime: '09:00', endTime: '15:00' }
        ]
      },
      {
        _id: 'doctor_002',
        type: 'doctor',
        name: 'Dr. Michael Chen',
        specialization: 'Maternal-Fetal Medicine',
        contactNumber: '+1-555-0102',
        email: 'michael.chen@hospital.com',
        availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        experience: '15 years',
        
        // Maternal Health Specialization
        maternalHealthSpecialist: true,
        maternalHealthCertifications: [
          'Board Certified Obstetrician-Gynecologist',
          'Maternal-Fetal Medicine Subspecialty',
          'Fetal Echocardiography Certification',
          'Genetic Counseling Certification'
        ],
        maternalHealthExperience: 15,
        
        // Maternal Mortality Tracking Capabilities
        canManageMaternalCases: true,
        canPerformEmergencyObstetricCare: true,
        canPerformSurgery: true,
        
        // Performance Metrics
        maternalCasesHandled: 189,
        maternalSuccessRate: 99.2,
        emergencyResponseTime: 12, // minutes
        
        // Facility Assignment
        primaryFacilityId: 'facility_001',
        secondaryFacilities: ['facility_003'],
        
        // Emergency Availability
        emergencyAvailable: true,
        onCallSchedule: [
          { day: 'Tuesday', startTime: '18:00', endTime: '08:00' },
          { day: 'Thursday', startTime: '18:00', endTime: '08:00' },
          { day: 'Saturday', startTime: '15:00', endTime: '09:00' },
          { day: 'Sunday', startTime: '00:00', endTime: '23:59' }
        ]
      },
      {
        _id: 'doctor_003',
        type: 'doctor',
        name: 'Dr. Emily Rodriguez',
        specialization: 'Family Medicine',
        contactNumber: '+1-555-0103',
        email: 'emily.rodriguez@hospital.com',
        availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        experience: '8 years',
        
        // Maternal Health Specialization
        maternalHealthSpecialist: false,
        maternalHealthExperience: 3,
        
        // Maternal Mortality Tracking Capabilities
        canManageMaternalCases: false,
        canPerformEmergencyObstetricCare: false,
        canPerformSurgery: false,
        
        // Performance Metrics
        maternalCasesHandled: 45,
        maternalSuccessRate: 96.8,
        emergencyResponseTime: 25, // minutes
        
        // Facility Assignment
        primaryFacilityId: 'facility_002',
        
        // Emergency Availability
        emergencyAvailable: false
      }
    ];

    // Sample Nurses
    const sampleNurses: Nurse[] = [
      {
        _id: 'nurse_001',
        type: 'nurse',
        name: 'Mary Johnson',
        specialization: 'ICU',
        ward: 'ICU Ward',
        shift: 'Day',
        contactNumber: '+1-555-0301',
        experience: '5 years'
      },
      {
        _id: 'nurse_002',
        type: 'nurse',
        name: 'Lisa Brown',
        specialization: 'Emergency',
        ward: 'Emergency Ward',
        shift: 'Night',
        contactNumber: '+1-555-0302',
        experience: '7 years'
      }
    ];

    // Sample Lab Requests
    const sampleLabRequests: LabRequest[] = [
      {
        _id: 'labrequest_001',
        type: 'labRequest',
        patientId: 'patient_001',
        patientName: 'Alice Johnson',
        requestedTests: [
          {
            testType: 'Complete Blood Count (CBC)',
            testCategory: 'hematology',
            specificTest: 'cbc',
            priority: 'Routine'
          },
          {
            testType: 'Lipid Profile',
            testCategory: 'chemistry',
            specificTest: 'lipidProfile',
            priority: 'Routine'
          }
        ],
        requestedBy: 'Dr. John Smith',
        requestDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Pending',
        notes: 'Patient has family history of cardiovascular disease. Please check lipid levels.'
      },
      {
        _id: 'labrequest_002',
        type: 'labRequest',
        patientId: 'patient_002',
        patientName: 'Bob Smith',
        requestedTests: [
          {
            testType: 'Blood Glucose',
            testCategory: 'chemistry',
            specificTest: 'glucose',
            priority: 'High'
          },
          {
            testType: 'Kidney Function Tests (KFTs)',
            testCategory: 'chemistry',
            specificTest: 'kft',
            priority: 'High'
          }
        ],
        requestedBy: 'Dr. Sarah Wilson',
        requestDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Pending',
        notes: 'Diabetic patient for routine monitoring. Check for diabetic nephropathy.'
      },
      {
        _id: 'labrequest_003',
        type: 'labRequest',
        patientId: 'patient_004',
        patientName: 'David Wilson',
        requestedTests: [
          {
            testType: 'Inflammatory Markers',
            testCategory: 'serology',
            specificTest: 'inflammatory',
            priority: 'STAT'
          }
        ],
        requestedBy: 'Dr. Michael Chen',
        requestDate: new Date().toISOString(),
        status: 'Pending',
        notes: 'Emergency patient with chest pain. Rule out cardiac event.'
      }
    ];

    // Sample Lab Tests with various statuses for testing
    const sampleLabTests: LabTest[] = [
      {
        _id: 'lab_test_1',
        type: 'labTest',
        patientId: 'patient_001',
        patientName: 'Alice Johnson',
        testType: 'Complete Blood Count (CBC)',
        testCategory: 'hematology',
        specificTest: 'cbc',
        status: 'Collected',
        priority: 'Routine',
        requestDate: '2024-01-15T08:00:00Z',
        collectionDate: '2024-01-15T09:30:00Z',
        sampleId: 'LAB001',
        requestedBy: 'Dr. Sarah Wilson',
        testParameters: [],
        clinicalNotes: '',
        technician: '',
        reviewedBy: '',
        reviewDate: '',
        abnormalResults: false,
        criticalValues: false,
        requiresFollowUp: false
      },
      {
        _id: 'lab_test_2',
        type: 'labTest',
        patientId: 'patient_002',
        patientName: 'Bob Smith',
        testType: 'Blood Glucose',
        testCategory: 'chemistry',
        specificTest: 'glucose',
        status: 'Collected',
        priority: 'High',
        requestDate: '2024-01-15T10:00:00Z',
        collectionDate: '2024-01-15T11:00:00Z',
        sampleId: 'LAB002',
        requestedBy: 'Dr. Michael Chen',
        testParameters: [],
        clinicalNotes: '',
        technician: '',
        reviewedBy: '',
        reviewDate: '',
        abnormalResults: false,
        criticalValues: false,
        requiresFollowUp: false
      },
      {
        _id: 'lab_test_3',
        type: 'labTest',
        patientId: 'patient_004',
        patientName: 'David Wilson',
        testType: 'Malaria Parasite Test (MP)',
        testCategory: 'microbiology',
        specificTest: 'malaria',
        status: 'Collected',
        priority: 'STAT',
        requestDate: '2024-01-15T14:00:00Z',
        collectionDate: '2024-01-15T14:30:00Z',
        sampleId: 'LAB003',
        requestedBy: 'Dr. John Smith',
        testParameters: [],
        clinicalNotes: 'Patient presents with fever and chills',
        technician: '',
        reviewedBy: '',
        reviewDate: '',
        abnormalResults: false,
        criticalValues: false,
        requiresFollowUp: false
      },
      {
        _id: 'lab_test_4',
        type: 'labTest',
        patientId: 'patient_002',
        patientName: 'Bob Smith',
        testType: 'Lipid Profile',
        testCategory: 'chemistry',
        specificTest: 'lipidProfile',
        status: 'Collected',
        priority: 'Routine',
        requestDate: '2024-01-15T16:00:00Z',
        collectionDate: '2024-01-15T16:30:00Z',
        sampleId: 'LAB004',
        requestedBy: 'Dr. Sarah Wilson',
        testParameters: [],
        clinicalNotes: 'Routine health checkup',
        technician: '',
        reviewedBy: '',
        reviewDate: '',
        abnormalResults: false,
        criticalValues: false,
        requiresFollowUp: false
      },
      {
        _id: 'lab_test_5',
        type: 'labTest',
        patientId: 'patient_005',
        patientName: 'Emma Brown',
        testType: 'HIV Test',
        testCategory: 'serology',
        specificTest: 'hiv',
        status: 'Collected',
        priority: 'Urgent',
        requestDate: '2024-01-15T12:00:00Z',
        collectionDate: '2024-01-15T13:00:00Z',
        sampleId: 'LAB005',
        requestedBy: 'Dr. Michael Chen',
        testParameters: [],
        clinicalNotes: 'Pre-operative screening',
        technician: '',
        reviewedBy: '',
        reviewDate: '',
        abnormalResults: false,
        criticalValues: false,
        requiresFollowUp: false
      },
      {
        _id: 'lab_test_6',
        type: 'labTest',
        patientId: 'patient_003',
        patientName: 'Carol Davis',
        testType: 'Liver Function Tests (LFTs)',
        testCategory: 'chemistry',
        specificTest: 'lft',
        status: 'Completed',
        priority: 'High',
        requestDate: '2024-01-14T08:00:00Z',
        collectionDate: '2024-01-14T09:00:00Z',
        sampleId: 'LAB006',
        requestedBy: 'Dr. John Smith',
        testParameters: [
          { id: 'alt', name: 'ALT (SGPT)', value: '85', unit: 'U/L', referenceRange: '7-56', status: 'High', type: 'number' },
          { id: 'ast', name: 'AST (SGOT)', value: '92', unit: 'U/L', referenceRange: '10-40', status: 'High', type: 'number' },
          { id: 'alp', name: 'ALP', value: '120', unit: 'U/L', referenceRange: '44-147', status: 'Normal', type: 'number' },
          { id: 'bilirubin_total', name: 'Total Bilirubin', value: '2.1', unit: 'mg/dL', referenceRange: '0.3-1.2', status: 'High', type: 'number' },
          { id: 'bilirubin_direct', name: 'Direct Bilirubin', value: '1.2', unit: 'mg/dL', referenceRange: '0.0-0.3', status: 'High', type: 'number' }
        ],
        clinicalNotes: 'Elevated liver enzymes - recommend follow-up',
        technician: 'Lab Technician Mike',
        reviewedBy: '',
        reviewDate: '',
        abnormalResults: true,
        criticalValues: false,
        requiresFollowUp: true
      },
      {
        _id: 'lab_test_7',
        type: 'labTest',
        patientId: 'patient_004',
        patientName: 'David Wilson',
        testType: 'ESR (Erythrocyte Sedimentation Rate)',
        testCategory: 'hematology',
        specificTest: 'esr',
        status: 'Completed',
        priority: 'Routine',
        requestDate: '2024-01-14T10:00:00Z',
        collectionDate: '2024-01-14T11:00:00Z',
        sampleId: 'LAB007',
        requestedBy: 'Dr. Sarah Wilson',
        testParameters: [
          { id: 'esr', name: 'ESR', value: '45', unit: 'mm/hr', referenceRange: 'M: 0-15, F: 0-20', status: 'High', type: 'number' }
        ],
        clinicalNotes: 'Elevated ESR suggests inflammation',
        technician: 'Lab Technician Mike',
        reviewedBy: 'Dr. Sarah Wilson',
        reviewDate: '2024-01-14T15:00:00Z',
        abnormalResults: true,
        criticalValues: false,
        requiresFollowUp: true
      }
    ];

    // Sample Appointments
    const sampleAppointments: Appointment[] = [
      {
        _id: 'appointment_001',
        type: 'appointment',
        patientId: 'patient_001',
        patientName: 'Alice Johnson',
        date: new Date().toISOString().split('T')[0],
        time: '10:00',
        doctor: 'Dr. John Smith',
        appointmentType: 'Consultation',
        status: 'Scheduled'
      },
      {
        _id: 'appointment_002',
        type: 'appointment',
        patientId: 'patient_002',
        patientName: 'Bob Smith',
        date: new Date().toISOString().split('T')[0],
        time: '14:00',
        doctor: 'Dr. Sarah Wilson',
        appointmentType: 'Follow-up',
        status: 'Scheduled'
      }
    ];

    // Sample Medications
    const sampleMedications: Medication[] = [
      {
        _id: 'medication_001',
        type: 'medication',
        name: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        instructions: 'Take with food',
        patientId: 'patient_001',
        patientName: 'Alice Johnson',
        prescribedBy: 'Dr. John Smith',
        prescriptionDate: new Date().toISOString()
      },
      {
        _id: 'medication_002',
        type: 'medication',
        name: 'Metformin',
        dosage: '500mg',
        frequency: 'Twice daily',
        instructions: 'Take with meals',
        patientId: 'patient_002',
        patientName: 'Bob Smith',
        prescribedBy: 'Dr. Sarah Wilson',
        prescriptionDate: new Date().toISOString()
      },
      {
        _id: 'medication_003',
        type: 'medication',
        name: 'Iron Sulfate',
        dosage: '325mg',
        frequency: 'Three times daily',
        instructions: 'Take on empty stomach with vitamin C',
        patientId: 'patient_003',
        patientName: 'Carol Davis',
        prescribedBy: 'Dr. Sarah Wilson',
        prescriptionDate: new Date().toISOString()
      }
    ];

    // Sample Maternal Lab Tests
    const sampleMaternalLabTests = [
      {
        _id: 'maternal_lab_001',
        type: 'maternal-lab-test',
        maternalPatientId: 'maternal_patient_001',
        patientName: 'Sarah Johnson',
        gestationalAge: 32,
        testType: 'Complete Blood Count (Maternal)',
        testCategory: 'routine-monitoring',
        specificTest: 'completeBloodCount',
        sampleId: 'MAT123456',
        testParameters: [
          {
            id: 'hemoglobin',
            name: 'Hemoglobin',
            value: '9.5',
            unit: 'g/dL',
            referenceRange: 'Trimester-specific',
            trimesterSpecificRange: {
              first: '11.0-14.0',
              second: '10.5-14.0',
              third: '10.0-14.0'
            },
            status: 'Abnormal',
            riskImplication: 'high',
            maternalRiskFlags: {
              preeclampsiaRisk: false,
              gestationalDiabetesRisk: false,
              anemiaRisk: true,
              infectionRisk: false,
              hemorrhageRisk: true
            },
            type: 'number'
          },
          {
            id: 'platelets',
            name: 'Platelet Count',
            value: '120',
            unit: '10³/µL',
            referenceRange: '150-400',
            status: 'Abnormal',
            riskImplication: 'high',
            maternalRiskFlags: {
              preeclampsiaRisk: true,
              gestationalDiabetesRisk: false,
              anemiaRisk: false,
              infectionRisk: false,
              hemorrhageRisk: true
            },
            type: 'number'
          }
        ],
        maternalRiskFactors: {
          preeclampsia: true,
          gestationalDiabetes: false,
          anemia: true,
          infection: false,
          bloodDisorders: true,
          liverDysfunction: false,
          kidneyProblems: false
        },
        riskScore: 65,
        riskLevel: 'high',
        clinicalInterpretation: 'Abnormal findings: Hemoglobin (9.5 g/dL), Platelet Count (120 10³/µL). Risk factors identified: preeclampsia, anemia, bloodDisorders.',
        recommendedActions: [
          'Monitor blood pressure closely',
          'Iron supplementation',
          'Follow-up CBC in 2 weeks',
          'Consider obstetric consultation'
        ],
        urgentReferralRequired: false,
        requestDate: '2024-01-25T08:00:00Z',
        collectionDate: '2024-01-25T09:30:00Z',
        completionDate: '2024-01-25T14:00:00Z',
        status: 'Completed',
        requestedBy: 'Dr. Mary Nurse',
        technician: 'Lab Tech Sarah',
        reviewedBy: 'Dr. Michael Chen',
        reviewDate: '2024-01-25T15:00:00Z',
        requiresFollowUp: true,
        followUpDate: '2024-02-08T00:00:00Z',
        createdAt: '2024-01-25T08:00:00Z',
        updatedAt: '2024-01-25T15:00:00Z'
      },
      {
        _id: 'maternal_lab_002',
        type: 'maternal-lab-test',
        maternalPatientId: 'maternal_patient_002',
        patientName: 'Maria Rodriguez',
        gestationalAge: 28,
        testType: 'Glucose Tolerance Test (GTT)',
        testCategory: 'prenatal-screening',
        specificTest: 'glucoseToleranceTest',
        sampleId: 'MAT123457',
        testParameters: [
          {
            id: 'fasting_glucose',
            name: 'Fasting Glucose',
            value: '105',
            unit: 'mg/dL',
            referenceRange: '<92',
            status: 'Abnormal',
            riskImplication: 'high',
            maternalRiskFlags: {
              preeclampsiaRisk: false,
              gestationalDiabetesRisk: true,
              anemiaRisk: false,
              infectionRisk: false,
              hemorrhageRisk: false
            },
            type: 'number'
          },
          {
            id: 'glucose_1hr',
            name: '1-Hour Glucose',
            value: '195',
            unit: 'mg/dL',
            referenceRange: '<180',
            status: 'Abnormal',
            riskImplication: 'high',
            maternalRiskFlags: {
              preeclampsiaRisk: false,
              gestationalDiabetesRisk: true,
              anemiaRisk: false,
              infectionRisk: false,
              hemorrhageRisk: false
            },
            type: 'number'
          }
        ],
        maternalRiskFactors: {
          preeclampsia: false,
          gestationalDiabetes: true,
          anemia: false,
          infection: false,
          bloodDisorders: false,
          liverDysfunction: false,
          kidneyProblems: false
        },
        riskScore: 70,
        riskLevel: 'high',
        clinicalInterpretation: 'Abnormal findings: Fasting Glucose (105 mg/dL), 1-Hour Glucose (195 mg/dL). Risk factors identified: gestationalDiabetes.',
        recommendedActions: [
          'Dietary counseling',
          'Blood glucose monitoring',
          'Consider insulin therapy',
          'Endocrinology consultation'
        ],
        urgentReferralRequired: false,
        requestDate: '2024-01-28T08:00:00Z',
        collectionDate: '2024-01-28T08:30:00Z',
        completionDate: '2024-01-28T12:00:00Z',
        status: 'Completed',
        requestedBy: 'Dr. Sarah Wilson',
        technician: 'Lab Tech Maria',
        reviewedBy: 'Dr. Sarah Wilson',
        reviewDate: '2024-01-28T13:00:00Z',
        requiresFollowUp: true,
        followUpDate: '2024-02-11T00:00:00Z',
        createdAt: '2024-01-28T08:00:00Z',
        updatedAt: '2024-01-28T13:00:00Z'
      },
      {
        _id: 'maternal_lab_003',
        type: 'maternal-lab-test',
        maternalPatientId: 'maternal_patient_004',
        patientName: 'Aisha Patel',
        gestationalAge: 36,
        testType: 'Preeclampsia Risk Assessment',
        testCategory: 'risk-assessment',
        specificTest: 'preeclampsiaScreening',
        sampleId: 'MAT123458',
        testParameters: [
          {
            id: 'protein_creatinine_ratio',
            name: 'Protein/Creatinine Ratio',
            value: '350',
            unit: 'mg/g',
            referenceRange: '<30',
            status: 'Critical',
            riskImplication: 'critical',
            maternalRiskFlags: {
              preeclampsiaRisk: true,
              gestationalDiabetesRisk: false,
              anemiaRisk: false,
              infectionRisk: false,
              hemorrhageRisk: false
            },
            type: 'number'
          },
          {
            id: 'uric_acid',
            name: 'Uric Acid',
            value: '8.2',
            unit: 'mg/dL',
            referenceRange: '2.5-6.0',
            status: 'Abnormal',
            riskImplication: 'high',
            maternalRiskFlags: {
              preeclampsiaRisk: true,
              gestationalDiabetesRisk: false,
              anemiaRisk: false,
              infectionRisk: false,
              hemorrhageRisk: false
            },
            type: 'number'
          }
        ],
        maternalRiskFactors: {
          preeclampsia: true,
          gestationalDiabetes: false,
          anemia: false,
          infection: false,
          bloodDisorders: false,
          liverDysfunction: false,
          kidneyProblems: true
        },
        riskScore: 85,
        riskLevel: 'critical',
        clinicalInterpretation: 'Critical findings: Protein/Creatinine Ratio (350 mg/g), Uric Acid (8.2 mg/dL). Risk factors identified: preeclampsia, kidneyProblems.',
        recommendedActions: [
          'Immediate obstetric consultation required',
          'Consider hospital admission',
          'Monitor blood pressure closely',
          'Daily fetal monitoring',
          'Consider delivery planning'
        ],
        urgentReferralRequired: true,
        requestDate: '2024-02-01T10:00:00Z',
        collectionDate: '2024-02-01T10:30:00Z',
        completionDate: '2024-02-01T14:30:00Z',
        status: 'Critical-Alert',
        requestedBy: 'Dr. Michael Chen',
        technician: 'Lab Tech John',
        reviewedBy: 'Dr. Michael Chen',
        reviewDate: '2024-02-01T15:00:00Z',
        requiresFollowUp: true,
        followUpDate: '2024-02-03T00:00:00Z',
        createdAt: '2024-02-01T10:00:00Z',
        updatedAt: '2024-02-01T15:00:00Z'
      }
    ];

    // Sample Maternal Lab Risk Profiles
    const sampleMaternalRiskProfiles = [
      {
        _id: 'maternal_risk_profile_001',
        type: 'maternal-lab-risk-profile',
        maternalPatientId: 'maternal_patient_001',
        patientName: 'Sarah Johnson',
        gestationalAge: 32,
        overallRiskScore: 65,
        riskLevel: 'high',
        riskCategories: {
          preeclampsia: {
            score: 60,
            level: 'high',
            contributingTests: ['Complete Blood Count (Maternal)']
          },
          gestationalDiabetes: {
            score: 0,
            level: 'low',
            contributingTests: []
          },
          anemia: {
            score: 70,
            level: 'high',
            contributingTests: ['Complete Blood Count (Maternal)']
          },
          infection: {
            score: 0,
            level: 'low',
            contributingTests: []
          },
          hemorrhage: {
            score: 65,
            level: 'high',
            contributingTests: ['Complete Blood Count (Maternal)']
          }
        },
        recommendations: {
          immediateActions: ['Monitor blood pressure closely', 'Iron supplementation'],
          followUpTests: ['Weekly CBC', 'Blood pressure monitoring'],
          clinicalMonitoring: ['Daily fetal monitoring'],
          referrals: ['Hematology consultation']
        },
        trendAnalysis: {
          improving: false,
          stable: false,
          deteriorating: true,
          notes: 'Trend based on last 1 tests'
        },
        lastLabTestDate: '2024-01-25T08:00:00Z',
        nextRecommendedTestDate: '2024-02-01T00:00:00Z',
        createdAt: '2024-01-25T15:00:00Z',
        updatedAt: '2024-01-25T15:00:00Z'
      }
    ];

    // Sample Maternal Lab Alerts
    const sampleMaternalAlerts = [
      {
        _id: 'maternal_alert_001',
        type: 'maternal-lab-alert',
        maternalPatientId: 'maternal_patient_004',
        patientName: 'Aisha Patel',
        labTestId: 'maternal_lab_003',
        alertType: 'critical-value',
        severity: 'critical',
        title: 'Critical Lab Values - Preeclampsia Risk Assessment',
        description: 'Critical values detected in Preeclampsia Risk Assessment for Aisha Patel',
        gestationalAge: 36,
        criticalParameters: ['Protein/Creatinine Ratio: 350 mg/g'],
        potentialComplications: ['Preeclampsia/Eclampsia', 'HELLP Syndrome', 'Acute Kidney Injury', 'Chronic Hypertension'],
        immediateActions: [
          'Immediate obstetric consultation required',
          'Consider hospital admission',
          'Monitor blood pressure closely',
          'Daily fetal monitoring',
          'Consider delivery planning'
        ],
        timeToAction: 30,
        status: 'active',
        createdBy: 'System',
        createdAt: '2024-02-01T14:30:00Z'
      }
    ];

    // Sample Doctor-Maternal Assignments
    const sampleDoctorMaternalAssignments = [
      {
        _id: 'assignment_001',
        type: 'doctor-maternal-assignment',
        doctorId: 'doctor_001',
        doctorName: 'Dr. Sarah Johnson',
        maternalPatientId: 'patient_001',
        patientName: 'Maria Garcia',
        assignmentDate: '2024-01-15T08:00:00Z',
        assignmentType: 'primary',
        status: 'active',
        gestationalAgeAtAssignment: 28,
        riskLevel: 'high',
        specialCareRequired: ['Gestational diabetes monitoring', 'Preeclampsia screening'],
        carePlan: {
          visitFrequency: 'weekly',
          nextAppointment: '2024-01-22T10:00:00Z',
          specialInstructions: [
            'Monitor blood glucose levels daily',
            'Check blood pressure twice daily',
            'Fetal movement counting'
          ],
          monitoringRequirements: [
            'Blood pressure monitoring',
            'Fetal heart rate monitoring',
            'Glucose tolerance testing',
            'Protein in urine testing'
          ]
        },
        createdAt: '2024-01-15T08:00:00Z',
        updatedAt: '2024-01-20T14:30:00Z'
      },
      {
        _id: 'assignment_002',
        type: 'doctor-maternal-assignment',
        doctorId: 'doctor_002',
        doctorName: 'Dr. Michael Chen',
        maternalPatientId: 'patient_002',
        patientName: 'Jennifer Smith',
        assignmentDate: '2024-01-10T09:30:00Z',
        assignmentType: 'secondary',
        status: 'active',
        gestationalAgeAtAssignment: 35,
        riskLevel: 'critical',
        specialCareRequired: ['Severe preeclampsia management', 'Fetal growth restriction monitoring'],
        carePlan: {
          visitFrequency: 'bi-weekly',
          nextAppointment: '2024-01-25T14:00:00Z',
          specialInstructions: [
            'Bed rest prescribed',
            'Daily fetal kick counts',
            'Immediate reporting of symptoms'
          ],
          monitoringRequirements: [
            'Daily blood pressure monitoring',
            'Twice-weekly NST',
            'Weekly biophysical profile',
            'Laboratory monitoring'
          ]
        },
        deliveryDate: '2024-02-15T03:45:00Z',
        deliveryOutcome: 'cesarean',
        maternalOutcome: 'healthy',
        fetalOutcome: 'healthy',
        createdAt: '2024-01-10T09:30:00Z',
        updatedAt: '2024-02-15T08:00:00Z'
      },
      {
        _id: 'assignment_003',
        type: 'doctor-maternal-assignment',
        doctorId: 'doctor_001',
        doctorName: 'Dr. Sarah Johnson',
        maternalPatientId: 'patient_003',
        patientName: 'Aisha Patel',
        assignmentDate: '2024-01-18T11:15:00Z',
        assignmentType: 'primary',
        status: 'active',
        gestationalAgeAtAssignment: 32,
        riskLevel: 'medium',
        specialCareRequired: ['Routine prenatal care', 'Iron deficiency anemia management'],
        carePlan: {
          visitFrequency: 'bi-weekly',
          nextAppointment: '2024-01-30T09:00:00Z',
          specialInstructions: [
            'Iron supplementation',
            'Balanced nutrition counseling',
            'Regular exercise as tolerated'
          ],
          monitoringRequirements: [
            'Blood pressure monitoring',
            'Fetal heart rate monitoring',
            'Hemoglobin levels',
            'Fundal height measurement'
          ]
        },
        createdAt: '2024-01-18T11:15:00Z',
        updatedAt: '2024-01-20T16:45:00Z'
      }
    ];

    // Sample Maternal Health Consultations
    const sampleMaternalHealthConsultations = [
      {
        _id: 'consultation_001',
        type: 'maternal-health-consultation',
        consultingDoctorId: 'doctor_002',
        consultingDoctorName: 'Dr. Michael Chen',
        requestingDoctorId: 'doctor_003',
        requestingDoctorName: 'Dr. Emily Rodriguez',
        maternalPatientId: 'patient_001',
        patientName: 'Maria Garcia',
        gestationalAge: 29,
        consultationType: 'urgent',
        reasonForConsultation: 'Elevated blood pressure readings and protein in urine',
        clinicalFindings: 'BP 150/95, proteinuria 2+, mild facial edema, hyperreflexia',
        currentTreatment: 'Labetalol 200mg BID, bed rest, daily fetal kick counts',
        consultationDate: '2024-01-20T15:30:00Z',
        recommendations: [
          'Increase antihypertensive medication',
          'Initiate corticosteroids for fetal lung maturity',
          'Consider delivery planning at 34-36 weeks',
          'Twice weekly NST and BPP'
        ],
        treatmentPlan: 'Escalate to severe preeclampsia protocol, close monitoring, prepare for early delivery if condition worsens',
        followUpRequired: true,
        followUpDate: '2024-01-22T10:00:00Z',
        priority: 'high',
        responseTimeRequired: 2,
        actualResponseTime: 1.5,
        status: 'completed',
        createdAt: '2024-01-20T14:00:00Z',
        updatedAt: '2024-01-20T16:00:00Z'
      },
      {
        _id: 'consultation_002',
        type: 'maternal-health-consultation',
        consultingDoctorId: 'doctor_001',
        consultingDoctorName: 'Dr. Sarah Johnson',
        maternalPatientId: 'patient_002',
        patientName: 'Jennifer Smith',
        gestationalAge: 36,
        consultationType: 'emergency',
        reasonForConsultation: 'Severe headache, visual disturbances, epigastric pain',
        clinicalFindings: 'BP 180/110, severe proteinuria, hyperreflexia with clonus, altered mental status',
        currentTreatment: 'Magnesium sulfate infusion, antihypertensive therapy',
        consultationDate: '2024-01-21T02:15:00Z',
        recommendations: [
          'Immediate delivery indicated',
          'Continue magnesium sulfate',
          'Prepare for emergency cesarean section',
          'NICU team on standby'
        ],
        treatmentPlan: 'Emergency cesarean delivery, intensive monitoring, seizure prophylaxis',
        followUpRequired: true,
        priority: 'critical',
        responseTimeRequired: 0.5,
        actualResponseTime: 0.25,
        status: 'completed',
        createdAt: '2024-01-21T02:00:00Z',
        updatedAt: '2024-01-21T04:30:00Z'
      },
      {
        _id: 'consultation_003',
        type: 'maternal-health-consultation',
        consultingDoctorId: 'doctor_002',
        consultingDoctorName: 'Dr. Michael Chen',
        requestingDoctorId: 'doctor_001',
        requestingDoctorName: 'Dr. Sarah Johnson',
        maternalPatientId: 'patient_003',
        patientName: 'Aisha Patel',
        gestationalAge: 33,
        consultationType: 'second-opinion',
        reasonForConsultation: 'Fetal growth restriction, oligohydramnios',
        clinicalFindings: 'EFW <10th percentile, AFI 3.2, abnormal umbilical artery Doppler',
        currentTreatment: 'Increased surveillance, bed rest, nutritional counseling',
        consultationDate: '2024-01-19T14:00:00Z',
        recommendations: [
          'Weekly biophysical profiles',
          'Doppler studies twice weekly',
          'Consider delivery at 34-35 weeks',
          'Antenatal corticosteroids'
        ],
        treatmentPlan: 'Intensive fetal surveillance, prepare for preterm delivery if deterioration',
        followUpRequired: true,
        followUpDate: '2024-01-26T10:00:00Z',
        priority: 'medium',
        responseTimeRequired: 24,
        actualResponseTime: 18,
        status: 'in-progress',
        createdAt: '2024-01-19T10:00:00Z',
        updatedAt: '2024-01-19T16:30:00Z'
      }
    ];

    // Sample Doctor Maternal Performance Records
    const sampleDoctorMaternalPerformance = [
      {
        _id: 'performance_001',
        type: 'doctor-maternal-performance',
        doctorId: 'doctor_001',
        doctorName: 'Dr. Sarah Johnson',
        periodStart: '2024-01-01T00:00:00Z',
        periodEnd: '2024-01-31T23:59:59Z',
        totalCasesHandled: 23,
        highRiskCases: 8,
        emergencyCases: 3,
        successfulDeliveries: 21,
        maternalMortality: 0,
        maternalMorbidity: 2,
        neonatalMortality: 0,
        cesareanRate: 34.8,
        averageResponseTime: 15,
        emergencyResponseTime: 12,
        patientSatisfactionScore: 9.2,
        complicationRate: 8.7,
        referralAccuracy: 96.5,
        trainingCompleted: [
          'Advanced Cardiac Life Support (ACLS) Renewal',
          'Maternal Mental Health Workshop'
        ],
        certificationsMaintained: [
          'Board Certified Obstetrician-Gynecologist',
          'Maternal-Fetal Medicine Fellowship',
          'Advanced Life Support in Obstetrics (ALSO)',
          'Neonatal Resuscitation Program (NRP)'
        ],
        createdAt: '2024-02-01T08:00:00Z',
        updatedAt: '2024-02-01T08:00:00Z'
      },
      {
        _id: 'performance_002',
        type: 'doctor-maternal-performance',
        doctorId: 'doctor_002',
        doctorName: 'Dr. Michael Chen',
        periodStart: '2024-01-01T00:00:00Z',
        periodEnd: '2024-01-31T23:59:59Z',
        totalCasesHandled: 18,
        highRiskCases: 12,
        emergencyCases: 5,
        successfulDeliveries: 17,
        maternalMortality: 0,
        maternalMorbidity: 1,
        neonatalMortality: 1,
        cesareanRate: 44.4,
        averageResponseTime: 12,
        emergencyResponseTime: 8,
        patientSatisfactionScore: 9.5,
        complicationRate: 5.6,
        referralAccuracy: 98.2,
        trainingCompleted: [
          'Fetal Echocardiography Advanced Course',
          'Genetic Counseling Update'
        ],
        certificationsMaintained: [
          'Board Certified Obstetrician-Gynecologist',
          'Maternal-Fetal Medicine Subspecialty',
          'Fetal Echocardiography Certification',
          'Genetic Counseling Certification'
        ],
        createdAt: '2024-02-01T08:00:00Z',
        updatedAt: '2024-02-01T08:00:00Z'
      }
    ];

    // Add all demo data
    await Promise.all([
      ...sampleUsers.map(user => addDoc(user)),
      ...samplePatients.map(patient => addDoc(patient)),
      ...sampleDoctors.map(doctor => addDoc(doctor)),
      ...sampleNurses.map(nurse => addDoc(nurse)),
      ...sampleLabRequests.map(request => addDoc(request)),
      ...sampleLabTests.map(labTest => addDoc(labTest)),
      ...sampleAppointments.map(appointment => addDoc(appointment)),
      ...sampleMedications.map(medication => addDoc(medication)),
      ...sampleMaternalLabTests.map(maternalLabTest => addDoc(maternalLabTest)),
      ...sampleMaternalRiskProfiles.map(maternalRiskProfile => addDoc(maternalRiskProfile)),
      ...sampleMaternalAlerts.map(maternalAlert => addDoc(maternalAlert)),
      ...sampleDoctorMaternalAssignments.map(assignment => addDoc(assignment)),
      ...sampleMaternalHealthConsultations.map(consultation => addDoc(consultation)),
      ...sampleDoctorMaternalPerformance.map(performance => addDoc(performance))
    ]);

    console.log('Comprehensive hospital demo data initialized successfully');
    console.log('Lab Requests:', sampleLabRequests.length);
    console.log('Lab Tests:', sampleLabTests.length);
    console.log('Patients:', samplePatients.length);
    console.log('Doctors:', sampleDoctors.length);
  } catch (error) {
    console.error('Error initializing hospital demo data:', error);
  }
};
