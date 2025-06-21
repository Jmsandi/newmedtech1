import { LabTest, LabRequest, TestParameter } from './types';
import { getAllDocsByType, getDocById, addDoc, updateDoc, deleteDoc } from './core';

// Lab Test Functions
export const getAllLabTests = async (): Promise<LabTest[]> => {
  return getAllDocsByType<LabTest>('labTest');
};

export const getLabTestById = async (id: string): Promise<LabTest | null> => {
  return getDocById<LabTest>(id);
};

export const addLabTest = async (labTest: LabTest): Promise<boolean> => {
  return addDoc<LabTest>(labTest);
};

export const updateLabTest = async (labTest: LabTest): Promise<boolean> => {
  return updateDoc<LabTest>(labTest);
};

export const deleteLabTest = async (id: string, rev: string): Promise<boolean> => {
  return deleteDoc(id, rev);
};

export const getLabTestsByPatient = async (patientId: string): Promise<LabTest[]> => {
  const labTests = await getAllLabTests();
  return labTests.filter(test => test.patientId === patientId);
};

export const getLabTestsByStatus = async (status: string): Promise<LabTest[]> => {
  const labTests = await getAllLabTests();
  return labTests.filter(test => test.status === status);
};

export const getPendingLabTests = async (): Promise<LabTest[]> => {
  return getLabTestsByStatus('Pending');
};

export const getCompletedLabTests = async (): Promise<LabTest[]> => {
  return getLabTestsByStatus('Completed');
};

export const getLabTestsBySampleId = async (sampleId: string): Promise<LabTest | null> => {
  const labTests = await getAllLabTests();
  return labTests.find(test => test.sampleId === sampleId) || null;
};

export const getLabTestsByTechnician = async (technician: string): Promise<LabTest[]> => {
  const labTests = await getAllLabTests();
  return labTests.filter(test => test.technician === technician);
};

export const getCriticalLabTests = async (): Promise<LabTest[]> => {
  const labTests = await getAllLabTests();
  return labTests.filter(test => test.criticalValues === true);
};

export const getAbnormalLabTests = async (): Promise<LabTest[]> => {
  const labTests = await getAllLabTests();
  return labTests.filter(test => test.abnormalResults === true);
};

// Lab Request Functions
export const getAllLabRequests = async (): Promise<LabRequest[]> => {
  return getAllDocsByType<LabRequest>('labRequest');
};

export const getLabRequestById = async (id: string): Promise<LabRequest | null> => {
  return getDocById<LabRequest>(id);
};

export const addLabRequest = async (labRequest: LabRequest): Promise<boolean> => {
  return addDoc<LabRequest>(labRequest);
};

export const updateLabRequest = async (labRequest: LabRequest): Promise<boolean> => {
  return updateDoc<LabRequest>(labRequest);
};

export const deleteLabRequest = async (id: string, rev: string): Promise<boolean> => {
  return deleteDoc(id, rev);
};

export const getLabRequestsByPatient = async (patientId: string): Promise<LabRequest[]> => {
  const labRequests = await getAllLabRequests();
  return labRequests.filter(request => request.patientId === patientId);
};

export const getLabRequestsByDoctor = async (doctorName: string): Promise<LabRequest[]> => {
  const labRequests = await getAllLabRequests();
  return labRequests.filter(request => request.requestedBy === doctorName);
};

export const getPendingLabRequests = async (): Promise<LabRequest[]> => {
  const labRequests = await getAllLabRequests();
  return labRequests.filter(request => request.status === 'Pending');
};

// Relationship Functions
export const createLabTestFromRequest = async (
  requestId: string, 
  sampleId: string, 
  technician: string
): Promise<boolean> => {
  try {
    const request = await getLabRequestById(requestId);
    if (!request) return false;

    // Create individual lab tests for each requested test
    for (const requestedTest of request.requestedTests) {
      const labTest: LabTest = {
        _id: `labtest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'labTest',
        patientId: request.patientId,
        patientName: request.patientName,
        testType: requestedTest.testType,
        testCategory: requestedTest.testCategory,
        specificTest: requestedTest.specificTest,
        requestedBy: request.requestedBy,
        status: 'Collected',
        priority: requestedTest.priority,
        requestDate: request.requestDate,
        collectionDate: new Date().toISOString(),
        sampleId: sampleId,
        technician: technician,
        abnormalResults: false,
        criticalValues: false,
        requiresFollowUp: false,
        testParameters: []
      };

      await addLabTest(labTest);
    }

    // Update request status
    const updatedRequest = { ...request, status: 'Approved' as const, approvalDate: new Date().toISOString() };
    await updateLabRequest(updatedRequest);

    return true;
  } catch (error) {
    console.error('Error creating lab test from request:', error);
    return false;
  }
};

export const updateLabTestResults = async (
  testId: string,
  testParameters: TestParameter[],
  clinicalNotes: string,
  technician: string
): Promise<boolean> => {
  try {
    const labTest = await getLabTestById(testId);
    if (!labTest) return false;

    // Check for abnormal and critical values
    const abnormalResults = testParameters.some(param => 
      param.status === 'High' || param.status === 'Low' || param.status === 'Abnormal'
    );
    const criticalValues = testParameters.some(param => param.status === 'Critical');

    const updatedTest: LabTest = {
      ...labTest,
      testParameters,
      clinicalNotes,
      technician,
      status: 'Completed',
      completionDate: new Date().toISOString(),
      abnormalResults,
      criticalValues,
      requiresFollowUp: abnormalResults || criticalValues
    };

    return await updateLabTest(updatedTest);
  } catch (error) {
    console.error('Error updating lab test results:', error);
    return false;
  }
};

export const getLabTestsForDoctor = async (doctorName: string): Promise<LabTest[]> => {
  const labTests = await getAllLabTests();
  return labTests.filter(test => test.requestedBy === doctorName);
};

export const getLabTestsRequiringReview = async (): Promise<LabTest[]> => {
  const labTests = await getAllLabTests();
  return labTests.filter(test => 
    test.status === 'Completed' && 
    (test.abnormalResults || test.criticalValues) && 
    !test.reviewedBy
  );
};

export const reviewLabTest = async (
  testId: string, 
  reviewedBy: string, 
  additionalNotes?: string
): Promise<boolean> => {
  try {
    const labTest = await getLabTestById(testId);
    if (!labTest) return false;

    const updatedTest: LabTest = {
      ...labTest,
      reviewedBy,
      reviewDate: new Date().toISOString(),
      clinicalNotes: additionalNotes ? 
        `${labTest.clinicalNotes || ''}\n\nReview Notes: ${additionalNotes}` : 
        labTest.clinicalNotes
    };

    return await updateLabTest(updatedTest);
  } catch (error) {
    console.error('Error reviewing lab test:', error);
    return false;
  }
};

// Utility Functions
export const generateSampleId = (): string => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `S${timestamp}${random}`;
};

export const getLabStatistics = async () => {
  const labTests = await getAllLabTests();
  const labRequests = await getAllLabRequests();
  
  return {
    totalTests: labTests.length,
    pendingTests: labTests.filter(test => test.status === 'Pending').length,
    completedTests: labTests.filter(test => test.status === 'Completed').length,
    criticalResults: labTests.filter(test => test.criticalValues).length,
    abnormalResults: labTests.filter(test => test.abnormalResults).length,
    totalRequests: labRequests.length,
    pendingRequests: labRequests.filter(req => req.status === 'Pending').length,
    testsRequiringReview: labTests.filter(test => 
      test.status === 'Completed' && 
      (test.abnormalResults || test.criticalValues) && 
      !test.reviewedBy
    ).length
  };
};
