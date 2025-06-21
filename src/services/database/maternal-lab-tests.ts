import { addDoc, getDoc, updateDoc, deleteDoc, getAllDocs } from './core';
import { 
  MaternalLabTest, 
  MaternalTestParameter, 
  MaternalLabRiskProfile, 
  MaternalLabAlert,
  MaternalLabTestConfig,
  MaternalPatient 
} from './maternal-types';

// Maternal-specific lab test configurations
export const maternalLabTestConfigs: MaternalLabTestConfig[] = [
  {
    category: 'prenatal-screening',
    tests: {
      firstTrimesterScreening: {
        name: 'First Trimester Screening',
        gestationalAgeRange: { min: 10, max: 14 },
        frequency: 'once',
        parameters: [
          {
            id: 'beta_hcg',
            name: 'Beta-hCG',
            unit: 'mIU/mL',
            referenceRange: 'Varies by gestational age',
            trimesterSpecificRange: {
              first: '10,000-200,000'
            },
            type: 'number'
          },
          {
            id: 'papp_a',
            name: 'PAPP-A',
            unit: 'mIU/L',
            referenceRange: '0.5-2.0 MoM',
            type: 'number'
          },
          {
            id: 'nt_measurement',
            name: 'Nuchal Translucency',
            unit: 'mm',
            referenceRange: '<3.5mm',
            type: 'number'
          }
        ],
        riskAssessmentRules: {
          beta_hcg: {
            criticalThresholds: { low: 5000, high: 300000 },
            riskFactors: ['chromosomal abnormalities', 'miscarriage risk']
          }
        }
      },
      glucoseToleranceTest: {
        name: 'Glucose Tolerance Test (GTT)',
        gestationalAgeRange: { min: 24, max: 28 },
        frequency: 'once',
        parameters: [
          {
            id: 'fasting_glucose',
            name: 'Fasting Glucose',
            unit: 'mg/dL',
            referenceRange: '<92',
            type: 'number'
          },
          {
            id: 'glucose_1hr',
            name: '1-Hour Glucose',
            unit: 'mg/dL',
            referenceRange: '<180',
            type: 'number'
          },
          {
            id: 'glucose_2hr',
            name: '2-Hour Glucose',
            unit: 'mg/dL',
            referenceRange: '<153',
            type: 'number'
          }
        ],
        riskAssessmentRules: {
          fasting_glucose: {
            criticalThresholds: { high: 92 },
            riskFactors: ['gestational diabetes', 'macrosomia', 'preterm birth']
          }
        }
      }
    }
  },
  {
    category: 'routine-monitoring',
    tests: {
      completeBloodCount: {
        name: 'Complete Blood Count (Maternal)',
        gestationalAgeRange: { min: 0, max: 42 },
        frequency: 'each-trimester',
        parameters: [
          {
            id: 'hemoglobin',
            name: 'Hemoglobin',
            unit: 'g/dL',
            referenceRange: 'Trimester-specific',
            trimesterSpecificRange: {
              first: '11.0-14.0',
              second: '10.5-14.0',
              third: '10.0-14.0'
            },
            type: 'number'
          },
          {
            id: 'hematocrit',
            name: 'Hematocrit',
            unit: '%',
            referenceRange: 'Trimester-specific',
            trimesterSpecificRange: {
              first: '33-41',
              second: '32-40',
              third: '30-39'
            },
            type: 'number'
          },
          {
            id: 'platelets',
            name: 'Platelet Count',
            unit: '10³/µL',
            referenceRange: '150-400',
            type: 'number'
          }
        ],
        riskAssessmentRules: {
          hemoglobin: {
            criticalThresholds: { low: 7.0, high: 16.0 },
            riskFactors: ['anemia', 'hemorrhage risk', 'poor fetal outcomes']
          },
          platelets: {
            criticalThresholds: { low: 100, high: 500 },
            riskFactors: ['bleeding disorders', 'preeclampsia', 'HELLP syndrome']
          }
        }
      },
      liverFunction: {
        name: 'Liver Function Tests (Maternal)',
        gestationalAgeRange: { min: 20, max: 42 },
        frequency: 'as-needed',
        parameters: [
          {
            id: 'alt',
            name: 'ALT',
            unit: 'U/L',
            referenceRange: '7-40',
            type: 'number'
          },
          {
            id: 'ast',
            name: 'AST',
            unit: 'U/L',
            referenceRange: '10-35',
            type: 'number'
          },
          {
            id: 'ldh',
            name: 'LDH',
            unit: 'U/L',
            referenceRange: '140-280',
            type: 'number'
          }
        ],
        riskAssessmentRules: {
          alt: {
            criticalThresholds: { high: 70 },
            riskFactors: ['preeclampsia', 'HELLP syndrome', 'acute fatty liver']
          }
        }
      }
    }
  },
  {
    category: 'risk-assessment',
    tests: {
      preeclampsiaScreening: {
        name: 'Preeclampsia Risk Assessment',
        gestationalAgeRange: { min: 20, max: 42 },
        frequency: 'as-needed',
        parameters: [
          {
            id: 'protein_creatinine_ratio',
            name: 'Protein/Creatinine Ratio',
            unit: 'mg/g',
            referenceRange: '<30',
            type: 'number'
          },
          {
            id: 'uric_acid',
            name: 'Uric Acid',
            unit: 'mg/dL',
            referenceRange: '2.5-6.0',
            type: 'number'
          },
          {
            id: 'sflt1_plgf_ratio',
            name: 'sFlt-1/PlGF Ratio',
            unit: '',
            referenceRange: '<38',
            type: 'number'
          }
        ],
        riskAssessmentRules: {
          protein_creatinine_ratio: {
            criticalThresholds: { high: 300 },
            riskFactors: ['preeclampsia', 'kidney dysfunction', 'maternal mortality']
          }
        }
      }
    }
  }
];

// CRUD Operations for Maternal Lab Tests
export const createMaternalLabTest = async (labTest: Omit<MaternalLabTest, '_id'>): Promise<string> => {
  const id = await addDoc(labTest);
  
  // After creating lab test, update risk profile
  await updateMaternalRiskProfile(labTest.maternalPatientId);
  
  // Check for critical values and create alerts if needed
  await checkForCriticalValues(id, labTest);
  
  return id;
};

export const getMaternalLabTest = async (id: string): Promise<MaternalLabTest | null> => {
  return await getDoc(id) as MaternalLabTest | null;
};

export const updateMaternalLabTest = async (id: string, updates: Partial<MaternalLabTest>): Promise<boolean> => {
  const success = await updateDoc(id, updates);
  
  if (success && updates.testParameters) {
    // Update risk profile when test results are updated
    const labTest = await getMaternalLabTest(id);
    if (labTest) {
      await updateMaternalRiskProfile(labTest.maternalPatientId);
      await checkForCriticalValues(id, labTest);
    }
  }
  
  return success;
};

export const deleteMaternalLabTest = async (id: string): Promise<boolean> => {
  return await deleteDoc(id);
};

export const getAllMaternalLabTests = async (): Promise<MaternalLabTest[]> => {
  const allDocs = await getAllDocs();
  return allDocs.filter(doc => doc.type === 'maternal-lab-test') as MaternalLabTest[];
};

export const getMaternalLabTestsByPatient = async (maternalPatientId: string): Promise<MaternalLabTest[]> => {
  const allTests = await getAllMaternalLabTests();
  return allTests.filter(test => test.maternalPatientId === maternalPatientId);
};

export const getMaternalLabTestsByCategory = async (category: string): Promise<MaternalLabTest[]> => {
  const allTests = await getAllMaternalLabTests();
  return allTests.filter(test => test.testCategory === category);
};

// Risk Assessment Functions
export const calculateMaternalRiskScore = (testParameters: MaternalTestParameter[], gestationalAge: number): number => {
  let riskScore = 0;
  let totalParameters = 0;

  testParameters.forEach(param => {
    totalParameters++;
    
    switch (param.riskImplication) {
      case 'critical':
        riskScore += 25;
        break;
      case 'high':
        riskScore += 15;
        break;
      case 'moderate':
        riskScore += 10;
        break;
      case 'low':
        riskScore += 5;
        break;
      default:
        riskScore += 0;
    }
  });

  // Adjust for gestational age (higher risk in later pregnancy)
  const gestationalAgeMultiplier = gestationalAge > 34 ? 1.2 : gestationalAge > 28 ? 1.1 : 1.0;
  
  const averageRisk = totalParameters > 0 ? (riskScore / totalParameters) * gestationalAgeMultiplier : 0;
  return Math.min(Math.round(averageRisk), 100);
};

export const assessMaternalRiskFactors = (testParameters: MaternalTestParameter[]): MaternalLabTest['maternalRiskFactors'] => {
  const riskFactors = {
    preeclampsia: false,
    gestationalDiabetes: false,
    anemia: false,
    infection: false,
    bloodDisorders: false,
    liverDysfunction: false,
    kidneyProblems: false
  };

  testParameters.forEach(param => {
    if (param.maternalRiskFlags.preeclampsiaRisk) riskFactors.preeclampsia = true;
    if (param.maternalRiskFlags.gestationalDiabetesRisk) riskFactors.gestationalDiabetes = true;
    if (param.maternalRiskFlags.anemiaRisk) riskFactors.anemia = true;
    if (param.maternalRiskFlags.infectionRisk) riskFactors.infection = true;
    if (param.maternalRiskFlags.hemorrhageRisk) riskFactors.bloodDisorders = true;
  });

  return riskFactors;
};

// Risk Profile Management
export const updateMaternalRiskProfile = async (maternalPatientId: string): Promise<void> => {
  const labTests = await getMaternalLabTestsByPatient(maternalPatientId);
  
  if (labTests.length === 0) return;

  // Get the most recent test for patient info
  const latestTest = labTests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  
  // Calculate aggregated risk scores
  const overallRiskScore = calculateAggregatedRiskScore(labTests);
  const riskCategories = calculateRiskCategories(labTests);
  
  const riskProfile: Omit<MaternalLabRiskProfile, '_id'> = {
    type: 'maternal-lab-risk-profile',
    maternalPatientId,
    patientName: latestTest.patientName,
    gestationalAge: latestTest.gestationalAge,
    overallRiskScore,
    riskLevel: getRiskLevel(overallRiskScore),
    riskCategories,
    recommendations: generateRecommendations(riskCategories, overallRiskScore),
    trendAnalysis: analyzeTrends(labTests),
    lastLabTestDate: latestTest.createdAt,
    nextRecommendedTestDate: calculateNextTestDate(latestTest.gestationalAge, riskCategories),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Check if profile exists and update or create
  const existingProfiles = await getAllDocs();
  const existingProfile = existingProfiles.find(
    doc => doc.type === 'maternal-lab-risk-profile' && doc.maternalPatientId === maternalPatientId
  );

  if (existingProfile) {
    await updateDoc(existingProfile._id, riskProfile);
  } else {
    await addDoc(riskProfile);
  }
};

const calculateAggregatedRiskScore = (labTests: MaternalLabTest[]): number => {
  if (labTests.length === 0) return 0;
  
  const totalScore = labTests.reduce((sum, test) => sum + test.riskScore, 0);
  return Math.round(totalScore / labTests.length);
};

const getRiskLevel = (score: number): 'low' | 'moderate' | 'high' | 'critical' => {
  if (score >= 75) return 'critical';
  if (score >= 50) return 'high';
  if (score >= 25) return 'moderate';
  return 'low';
};

const calculateRiskCategories = (labTests: MaternalLabTest[]) => {
  const categories = {
    preeclampsia: { score: 0, level: 'low' as const, contributingTests: [] as string[] },
    gestationalDiabetes: { score: 0, level: 'low' as const, contributingTests: [] as string[] },
    anemia: { score: 0, level: 'low' as const, contributingTests: [] as string[] },
    infection: { score: 0, level: 'low' as const, contributingTests: [] as string[] },
    hemorrhage: { score: 0, level: 'low' as const, contributingTests: [] as string[] }
  };

  labTests.forEach(test => {
    if (test.maternalRiskFactors.preeclampsia) {
      categories.preeclampsia.score += test.riskScore;
      categories.preeclampsia.contributingTests.push(test.testType);
    }
    if (test.maternalRiskFactors.gestationalDiabetes) {
      categories.gestationalDiabetes.score += test.riskScore;
      categories.gestationalDiabetes.contributingTests.push(test.testType);
    }
    if (test.maternalRiskFactors.anemia) {
      categories.anemia.score += test.riskScore;
      categories.anemia.contributingTests.push(test.testType);
    }
    if (test.maternalRiskFactors.infection) {
      categories.infection.score += test.riskScore;
      categories.infection.contributingTests.push(test.testType);
    }
    if (test.maternalRiskFactors.bloodDisorders) {
      categories.hemorrhage.score += test.riskScore;
      categories.hemorrhage.contributingTests.push(test.testType);
    }
  });

  // Calculate average scores and levels
  Object.keys(categories).forEach(key => {
    const category = categories[key as keyof typeof categories];
    if (category.contributingTests.length > 0) {
      category.score = Math.round(category.score / category.contributingTests.length);
      category.level = getRiskLevel(category.score);
    }
  });

  return categories;
};

const generateRecommendations = (riskCategories: any, overallRiskScore: number) => {
  const recommendations = {
    immediateActions: [] as string[],
    followUpTests: [] as string[],
    clinicalMonitoring: [] as string[],
    referrals: [] as string[]
  };

  if (overallRiskScore >= 75) {
    recommendations.immediateActions.push('Immediate obstetric consultation required');
    recommendations.referrals.push('Refer to maternal-fetal medicine specialist');
  }

  if (riskCategories.preeclampsia.level === 'high' || riskCategories.preeclampsia.level === 'critical') {
    recommendations.immediateActions.push('Monitor blood pressure closely');
    recommendations.followUpTests.push('Weekly protein/creatinine ratio');
    recommendations.clinicalMonitoring.push('Daily fetal monitoring');
  }

  if (riskCategories.gestationalDiabetes.level === 'high' || riskCategories.gestationalDiabetes.level === 'critical') {
    recommendations.followUpTests.push('Weekly glucose monitoring');
    recommendations.clinicalMonitoring.push('Fetal growth monitoring');
  }

  if (riskCategories.anemia.level === 'high' || riskCategories.anemia.level === 'critical') {
    recommendations.immediateActions.push('Iron supplementation');
    recommendations.followUpTests.push('Monthly CBC');
  }

  return recommendations;
};

const analyzeTrends = (labTests: MaternalLabTest[]) => {
  if (labTests.length < 2) {
    return {
      improving: false,
      stable: true,
      deteriorating: false,
      notes: 'Insufficient data for trend analysis'
    };
  }

  const sortedTests = labTests.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  const recentTests = sortedTests.slice(-3); // Last 3 tests
  
  const scores = recentTests.map(test => test.riskScore);
  const isImproving = scores.every((score, index) => index === 0 || score <= scores[index - 1]);
  const isDeteriorating = scores.every((score, index) => index === 0 || score >= scores[index - 1]);
  
  return {
    improving: isImproving && !isDeteriorating,
    stable: !isImproving && !isDeteriorating,
    deteriorating: isDeteriorating && !isImproving,
    notes: `Trend based on last ${recentTests.length} tests`
  };
};

const calculateNextTestDate = (gestationalAge: number, riskCategories: any): string => {
  let weeksToAdd = 4; // Default monthly

  // Adjust based on risk levels
  const highRiskCategories = Object.values(riskCategories).filter(
    (category: any) => category.level === 'high' || category.level === 'critical'
  );

  if (highRiskCategories.length > 0) {
    weeksToAdd = 1; // Weekly for high risk
  } else if (gestationalAge > 32) {
    weeksToAdd = 2; // Bi-weekly in third trimester
  }

  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + (weeksToAdd * 7));
  return nextDate.toISOString();
};

// Alert Management
export const checkForCriticalValues = async (labTestId: string, labTest: MaternalLabTest): Promise<void> => {
  const criticalParameters = labTest.testParameters.filter(
    param => param.status === 'Critical' || param.riskImplication === 'critical'
  );

  if (criticalParameters.length > 0 || labTest.riskLevel === 'critical') {
    await createMaternalLabAlert({
      type: 'maternal-lab-alert',
      maternalPatientId: labTest.maternalPatientId,
      patientName: labTest.patientName,
      labTestId,
      alertType: 'critical-value',
      severity: 'critical',
      title: `Critical Lab Values - ${labTest.testType}`,
      description: `Critical values detected in ${labTest.testType} for ${labTest.patientName}`,
      gestationalAge: labTest.gestationalAge,
      criticalParameters: criticalParameters.map(p => `${p.name}: ${p.value} ${p.unit}`),
      potentialComplications: generatePotentialComplications(labTest.maternalRiskFactors),
      immediateActions: labTest.recommendedActions,
      timeToAction: 30, // 30 minutes for critical values
      status: 'active',
      createdBy: 'System',
      createdAt: new Date().toISOString()
    });
  }
};

const generatePotentialComplications = (riskFactors: MaternalLabTest['maternalRiskFactors']): string[] => {
  const complications: string[] = [];
  
  if (riskFactors.preeclampsia) complications.push('Preeclampsia/Eclampsia', 'HELLP Syndrome');
  if (riskFactors.gestationalDiabetes) complications.push('Macrosomia', 'Preterm Birth');
  if (riskFactors.anemia) complications.push('Postpartum Hemorrhage', 'Poor Fetal Growth');
  if (riskFactors.infection) complications.push('Sepsis', 'Preterm Labor');
  if (riskFactors.bloodDisorders) complications.push('Bleeding Complications', 'DIC');
  if (riskFactors.liverDysfunction) complications.push('Acute Fatty Liver', 'Liver Failure');
  if (riskFactors.kidneyProblems) complications.push('Acute Kidney Injury', 'Chronic Hypertension');
  
  return complications;
};

export const createMaternalLabAlert = async (alert: Omit<MaternalLabAlert, '_id'>): Promise<string> => {
  return await addDoc(alert);
};

export const getMaternalLabAlerts = async (): Promise<MaternalLabAlert[]> => {
  const allDocs = await getAllDocs();
  return allDocs.filter(doc => doc.type === 'maternal-lab-alert') as MaternalLabAlert[];
};

export const getMaternalLabAlertsByPatient = async (maternalPatientId: string): Promise<MaternalLabAlert[]> => {
  const allAlerts = await getMaternalLabAlerts();
  return allAlerts.filter(alert => alert.maternalPatientId === maternalPatientId);
};

export const acknowledgeMaternalLabAlert = async (alertId: string, acknowledgedBy: string): Promise<boolean> => {
  return await updateDoc(alertId, {
    status: 'acknowledged',
    acknowledgedBy,
    acknowledgedAt: new Date().toISOString()
  });
};

export const resolveMaternalLabAlert = async (
  alertId: string, 
  resolvedBy: string, 
  actionsTaken: string[], 
  outcome: string
): Promise<boolean> => {
  return await updateDoc(alertId, {
    status: 'resolved',
    resolvedBy,
    actionsTaken,
    outcome,
    resolvedAt: new Date().toISOString()
  });
};

// Utility Functions
export const getMaternalLabRiskProfile = async (maternalPatientId: string): Promise<MaternalLabRiskProfile | null> => {
  const allDocs = await getAllDocs();
  const profile = allDocs.find(
    doc => doc.type === 'maternal-lab-risk-profile' && doc.maternalPatientId === maternalPatientId
  );
  return profile as MaternalLabRiskProfile | null;
};

export const generateMaternalLabReport = async (maternalPatientId: string) => {
  const [labTests, riskProfile, alerts] = await Promise.all([
    getMaternalLabTestsByPatient(maternalPatientId),
    getMaternalLabRiskProfile(maternalPatientId),
    getMaternalLabAlertsByPatient(maternalPatientId)
  ]);

  return {
    labTests,
    riskProfile,
    alerts,
    summary: {
      totalTests: labTests.length,
      criticalTests: labTests.filter(test => test.riskLevel === 'critical').length,
      activeAlerts: alerts.filter(alert => alert.status === 'active').length,
      lastTestDate: labTests.length > 0 ? labTests.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0].createdAt : null
    }
  };
}; 