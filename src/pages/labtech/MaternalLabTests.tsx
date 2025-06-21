import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Heart, 
  Search, 
  TestTube, 
  AlertTriangle,
  Baby,
  Activity,
  TrendingUp,
  TrendingDown,
  Save,
  RotateCcw,
  Clock,
  User,
  Calendar
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  createMaternalLabTest,
  updateMaternalLabTest,
  getMaternalLabTestsByPatient,
  maternalLabTestConfigs,
  calculateMaternalRiskScore,
  assessMaternalRiskFactors,
  getMaternalLabRiskProfile,
  getMaternalLabAlertsByPatient
} from "@/services/database/maternal-lab-tests";
import { getAllMaternalPatients } from "@/services/database/maternal-mortality";
import { 
  MaternalPatient, 
  MaternalLabTest, 
  MaternalTestParameter,
  MaternalLabRiskProfile,
  MaternalLabAlert
} from "@/services/database/maternal-types";

const MaternalLabTests: React.FC = () => {
  const { toast } = useToast();
  const [selectedPatient, setSelectedPatient] = useState<MaternalPatient | null>(null);
  const [maternalPatients, setMaternalPatients] = useState<MaternalPatient[]>([]);
  const [selectedTestConfig, setSelectedTestConfig] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [testParameters, setTestParameters] = useState<MaternalTestParameter[]>([]);
  const [clinicalNotes, setClinicalNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [riskProfile, setRiskProfile] = useState<MaternalLabRiskProfile | null>(null);
  const [alerts, setAlerts] = useState<MaternalLabAlert[]>([]);
  const [patientLabTests, setPatientLabTests] = useState<MaternalLabTest[]>([]);

  useEffect(() => {
    loadMaternalPatients();
  }, []);

  useEffect(() => {
    if (selectedPatient) {
      loadPatientData();
    }
  }, [selectedPatient]);

  const loadMaternalPatients = async () => {
    try {
      const patients = await getAllMaternalPatients();
      setMaternalPatients(patients);
    } catch (error) {
      console.error('Error loading maternal patients:', error);
    }
  };

  const loadPatientData = async () => {
    if (!selectedPatient) return;
    
    try {
      const [labTests, profile, patientAlerts] = await Promise.all([
        getMaternalLabTestsByPatient(selectedPatient._id),
        getMaternalLabRiskProfile(selectedPatient._id),
        getMaternalLabAlertsByPatient(selectedPatient._id)
      ]);
      
      setPatientLabTests(labTests);
      setRiskProfile(profile);
      setAlerts(patientAlerts.filter(alert => alert.status === 'active'));
    } catch (error) {
      console.error('Error loading patient data:', error);
    }
  };

  const handleTestConfigChange = (configKey: string) => {
    setSelectedTestConfig(configKey);
    
    // Find the test configuration
    const [category, testKey] = configKey.split('.');
    const categoryConfig = maternalLabTestConfigs.find(c => c.category === category);
    const testConfig = categoryConfig?.tests[testKey];
    
    if (testConfig) {
      setSelectedCategory(category);
      
      // Initialize test parameters with maternal-specific structure
      const initialParameters: MaternalTestParameter[] = testConfig.parameters.map(param => ({
        ...param,
        value: "",
        status: "Normal",
        riskImplication: "none",
        maternalRiskFlags: {
          preeclampsiaRisk: false,
          gestationalDiabetesRisk: false,
          anemiaRisk: false,
          infectionRisk: false,
          hemorrhageRisk: false
        }
      }));
      
      setTestParameters(initialParameters);
    }
  };

  const handleParameterChange = (id: string, value: string) => {
    setTestParameters(prev => prev.map(param => {
      if (param.id === id) {
        const updatedParam = { ...param, value };
        
        // Determine status and risk implications based on value
        const { status, riskImplication, maternalRiskFlags } = assessParameterRisk(updatedParam, selectedPatient?.gestationalAge || 0);
        
        return {
          ...updatedParam,
          status,
          riskImplication,
          maternalRiskFlags
        };
      }
      return param;
    }));
  };

  const assessParameterRisk = (param: MaternalTestParameter, gestationalAge: number) => {
    const numValue = parseFloat(param.value);
    let status: MaternalTestParameter['status'] = 'Normal';
    let riskImplication: MaternalTestParameter['riskImplication'] = 'none';
    let maternalRiskFlags = {
      preeclampsiaRisk: false,
      gestationalDiabetesRisk: false,
      anemiaRisk: false,
      infectionRisk: false,
      hemorrhageRisk: false
    };

    if (param.type === 'number' && !isNaN(numValue)) {
      // Assess based on parameter type and gestational age
      switch (param.id) {
        case 'hemoglobin':
          const trimester = gestationalAge <= 12 ? 'first' : gestationalAge <= 28 ? 'second' : 'third';
          const hbRange = param.trimesterSpecificRange?.[trimester]?.split('-').map(v => parseFloat(v));
          if (hbRange && hbRange.length === 2) {
            if (numValue < hbRange[0]) {
              status = numValue < 7 ? 'Critical' : 'Abnormal';
              riskImplication = numValue < 7 ? 'critical' : 'high';
              maternalRiskFlags.anemiaRisk = true;
              maternalRiskFlags.hemorrhageRisk = true;
            } else if (numValue > hbRange[1]) {
              status = 'Abnormal';
              riskImplication = 'moderate';
            }
          }
          break;
          
        case 'platelets':
          if (numValue < 100) {
            status = 'Critical';
            riskImplication = 'critical';
            maternalRiskFlags.hemorrhageRisk = true;
            maternalRiskFlags.preeclampsiaRisk = true;
          } else if (numValue < 150) {
            status = 'Abnormal';
            riskImplication = 'high';
            maternalRiskFlags.hemorrhageRisk = true;
          }
          break;
          
        case 'fasting_glucose':
          if (numValue >= 92) {
            status = numValue >= 126 ? 'Critical' : 'Abnormal';
            riskImplication = numValue >= 126 ? 'critical' : 'high';
            maternalRiskFlags.gestationalDiabetesRisk = true;
          }
          break;
          
        case 'protein_creatinine_ratio':
          if (numValue >= 300) {
            status = 'Critical';
            riskImplication = 'critical';
            maternalRiskFlags.preeclampsiaRisk = true;
          } else if (numValue >= 30) {
            status = 'Abnormal';
            riskImplication = 'high';
            maternalRiskFlags.preeclampsiaRisk = true;
          }
          break;
          
        case 'alt':
        case 'ast':
          if (numValue > 70) {
            status = 'Critical';
            riskImplication = 'critical';
            maternalRiskFlags.preeclampsiaRisk = true;
          } else if (numValue > 40) {
            status = 'Abnormal';
            riskImplication = 'high';
          }
          break;
      }
    }

    return { status, riskImplication, maternalRiskFlags };
  };

  const handleSaveResults = async () => {
    if (!selectedPatient || !selectedTestConfig) {
      toast({
        title: "Error",
        description: "Please select a patient and test type",
        variant: "destructive",
      });
      return;
    }

    const requiredParameters = testParameters.filter(param => param.value === "");
    if (requiredParameters.length > 0) {
      toast({
        title: "Missing Values",
        description: "Please enter values for all test parameters",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const [category, testKey] = selectedTestConfig.split('.');
      const categoryConfig = maternalLabTestConfigs.find(c => c.category === category);
      const testConfig = categoryConfig?.tests[testKey];
      
      if (!testConfig) {
        throw new Error('Test configuration not found');
      }

      // Calculate risk score and assess risk factors
      const riskScore = calculateMaternalRiskScore(testParameters, selectedPatient.gestationalAge);
      const maternalRiskFactors = assessMaternalRiskFactors(testParameters);
      
      // Determine risk level
      const riskLevel = riskScore >= 75 ? 'critical' : riskScore >= 50 ? 'high' : riskScore >= 25 ? 'moderate' : 'low';
      
      // Generate recommendations based on risk factors
      const recommendedActions = generateRecommendations(maternalRiskFactors, riskLevel);
      
      const maternalLabTest: Omit<MaternalLabTest, '_id'> = {
        type: 'maternal-lab-test',
        maternalPatientId: selectedPatient._id,
        patientName: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
        gestationalAge: selectedPatient.gestationalAge,
        testType: testConfig.name,
        testCategory: category as any,
        specificTest: testKey,
        sampleId: generateSampleId(),
        testParameters,
        maternalRiskFactors,
        riskScore,
        riskLevel,
        clinicalInterpretation: generateClinicalInterpretation(testParameters, maternalRiskFactors),
        recommendedActions,
        urgentReferralRequired: riskLevel === 'critical',
        requestDate: new Date().toISOString(),
        collectionDate: new Date().toISOString(),
        status: riskLevel === 'critical' ? 'Critical-Alert' : 'Completed',
        requestedBy: 'Maternal Health Team',
        technician: 'Lab Technician',
        requiresFollowUp: riskLevel === 'high' || riskLevel === 'critical',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await createMaternalLabTest(maternalLabTest);

      toast({
        title: "Results Saved",
        description: `Maternal lab test results saved successfully${riskLevel === 'critical' ? ' - Critical alert generated' : ''}`,
        variant: riskLevel === 'critical' ? 'destructive' : 'default'
      });

      // Reset form and reload data
      resetForm();
      await loadPatientData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save test results",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateSampleId = (): string => {
    const prefix = 'MAT';
    const timestamp = Date.now().toString().slice(-6);
    return `${prefix}${timestamp}`;
  };

  const generateRecommendations = (riskFactors: any, riskLevel: string): string[] => {
    const recommendations: string[] = [];
    
    if (riskLevel === 'critical') {
      recommendations.push('Immediate obstetric consultation required');
      recommendations.push('Consider hospital admission');
    }
    
    if (riskFactors.preeclampsia) {
      recommendations.push('Monitor blood pressure closely');
      recommendations.push('Consider antihypertensive therapy');
      recommendations.push('Fetal monitoring required');
    }
    
    if (riskFactors.gestationalDiabetes) {
      recommendations.push('Dietary counseling');
      recommendations.push('Blood glucose monitoring');
      recommendations.push('Consider insulin therapy');
    }
    
    if (riskFactors.anemia) {
      recommendations.push('Iron supplementation');
      recommendations.push('Nutritional counseling');
      recommendations.push('Follow-up CBC in 4 weeks');
    }
    
    return recommendations;
  };

  const generateClinicalInterpretation = (parameters: MaternalTestParameter[], riskFactors: any): string => {
    const abnormalParams = parameters.filter(p => p.status !== 'Normal');
    
    if (abnormalParams.length === 0) {
      return 'All parameters within normal limits for gestational age.';
    }
    
    let interpretation = 'Abnormal findings: ';
    interpretation += abnormalParams.map(p => `${p.name} (${p.value} ${p.unit})`).join(', ');
    
    const risks = Object.entries(riskFactors).filter(([_, value]) => value).map(([key, _]) => key);
    if (risks.length > 0) {
      interpretation += `. Risk factors identified: ${risks.join(', ')}.`;
    }
    
    return interpretation;
  };

  const resetForm = () => {
    setSelectedTestConfig("");
    setSelectedCategory("");
    setTestParameters([]);
    setClinicalNotes("");
  };

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'moderate': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Critical': return 'bg-red-500';
      case 'Abnormal': return 'bg-orange-500';
      case 'Borderline': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Heart className="h-6 w-6 text-red-500" />
          Maternal Lab Tests & Risk Assessment
        </h1>
      </div>

      {/* Patient Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Select Maternal Patient
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="patient">Patient</Label>
              <Select value={selectedPatient?._id || ""} onValueChange={(value) => {
                const patient = maternalPatients.find(p => p._id === value);
                setSelectedPatient(patient || null);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select maternal patient..." />
                </SelectTrigger>
                <SelectContent>
                  {maternalPatients.map((patient) => (
                    <SelectItem key={patient._id} value={patient._id}>
                      {patient.firstName} {patient.lastName} - {patient.gestationalAge}w
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedPatient && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Baby className="h-4 w-4" />
                  <span className="text-sm">Gestational Age: {selectedPatient.gestationalAge} weeks</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">EDD: {new Date(selectedPatient.expectedDeliveryDate).toLocaleDateString()}</span>
                </div>
                {riskProfile && (
                  <div className="flex items-center gap-2">
                    <Badge className={getRiskBadgeColor(riskProfile.riskLevel)}>
                      Risk Level: {riskProfile.riskLevel.toUpperCase()}
                    </Badge>
                    <span className="text-sm">Score: {riskProfile.overallRiskScore}/100</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Active Alerts */}
      {alerts.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <AlertDescription>
            <strong>Active Alerts ({alerts.length}):</strong>
            <ul className="mt-2 space-y-1">
              {alerts.map((alert) => (
                <li key={alert._id} className="text-sm">
                  • {alert.title} - {alert.description}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {selectedPatient && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Test Entry Panel */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5" />
                Enter Maternal Lab Test Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Test Selection */}
                <div>
                  <Label htmlFor="testType">Test Type</Label>
                  <Select value={selectedTestConfig} onValueChange={handleTestConfigChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select maternal lab test..." />
                    </SelectTrigger>
                    <SelectContent>
                      {maternalLabTestConfigs.map((category) => (
                        <React.Fragment key={category.category}>
                          <SelectItem value="" disabled className="font-semibold">
                            {category.category.replace('-', ' ').toUpperCase()}
                          </SelectItem>
                          {Object.entries(category.tests).map(([testKey, test]) => (
                            <SelectItem key={`${category.category}.${testKey}`} value={`${category.category}.${testKey}`}>
                              {test.name}
                            </SelectItem>
                          ))}
                        </React.Fragment>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Test Parameters */}
                {testParameters.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-medium text-lg">Test Parameters</h3>
                    <div className="rounded-md border p-4 space-y-4">
                      {testParameters.map((param) => (
                        <div key={param.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                          <div className="md:col-span-2">
                            <Label htmlFor={param.id}>{param.name}</Label>
                          </div>
                          <div className="relative md:col-span-1">
                            <Input
                              id={param.id}
                              type={param.type}
                              value={param.value}
                              onChange={(e) => handleParameterChange(param.id, e.target.value)}
                              placeholder="Enter value"
                            />
                            {param.unit && (
                              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <span className="text-sm text-gray-500">{param.unit}</span>
                              </div>
                            )}
                          </div>
                          <div className="md:col-span-2 flex items-center gap-2">
                            <div className="text-sm text-gray-500">
                              <p>Range: {param.referenceRange}</p>
                              {param.trimesterSpecificRange && selectedPatient && (
                                <p className="text-xs">
                                  Current: {
                                    selectedPatient.gestationalAge <= 12 ? param.trimesterSpecificRange.first :
                                    selectedPatient.gestationalAge <= 28 ? param.trimesterSpecificRange.second :
                                    param.trimesterSpecificRange.third
                                  }
                                </p>
                              )}
                            </div>
                            {param.value && (
                              <div className="flex flex-col gap-1">
                                <Badge className={`text-xs ${getStatusBadgeColor(param.status)}`}>
                                  {param.status}
                                </Badge>
                                {param.riskImplication !== 'none' && (
                                  <Badge variant="outline" className="text-xs">
                                    {param.riskImplication} risk
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Clinical Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Clinical Notes & Observations</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add any additional notes, observations, or comments about the test results..."
                    value={clinicalNotes}
                    onChange={(e) => setClinicalNotes(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={resetForm}
                    className="flex items-center gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset
                  </Button>
                  <Button 
                    onClick={handleSaveResults} 
                    disabled={isLoading || testParameters.length === 0}
                    className="bg-red-600 hover:bg-red-700 flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {isLoading ? "Saving..." : "Save Results"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Profile & History Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Risk Profile & History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Current Risk Profile */}
                {riskProfile && (
                  <div className="space-y-3">
                    <h4 className="font-medium">Current Risk Assessment</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Overall Risk:</span>
                        <Badge className={getRiskBadgeColor(riskProfile.riskLevel)}>
                          {riskProfile.riskLevel.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Risk Score:</span>
                        <span className="font-medium">{riskProfile.overallRiskScore}/100</span>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium">Risk Categories:</h5>
                      {Object.entries(riskProfile.riskCategories).map(([category, data]) => (
                        data.score > 0 && (
                          <div key={category} className="flex justify-between items-center text-sm">
                            <span className="capitalize">{category}:</span>
                            <Badge variant="outline" className={`text-xs ${getRiskBadgeColor(data.level)}`}>
                              {data.level}
                            </Badge>
                          </div>
                        )
                      ))}
                    </div>
                    
                    {riskProfile.recommendations.immediateActions.length > 0 && (
                      <>
                        <Separator />
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium text-red-600">Immediate Actions:</h5>
                          <ul className="text-xs space-y-1">
                            {riskProfile.recommendations.immediateActions.map((action, index) => (
                              <li key={index} className="flex items-start gap-1">
                                <span>•</span>
                                <span>{action}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    )}
                  </div>
                )}

                <Separator />

                {/* Recent Lab Tests */}
                <div className="space-y-3">
                  <h4 className="font-medium">Recent Tests ({patientLabTests.length})</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {patientLabTests.slice(0, 5).map((test) => (
                      <div key={test._id} className="p-2 border rounded text-sm">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{test.testType}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(test.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge className={`text-xs ${getRiskBadgeColor(test.riskLevel)}`}>
                            {test.riskLevel}
                          </Badge>
                        </div>
                        {test.urgentReferralRequired && (
                          <p className="text-xs text-red-600 mt-1">⚠️ Urgent referral required</p>
                        )}
                      </div>
                    ))}
                    {patientLabTests.length === 0 && (
                      <p className="text-center text-gray-500 py-4 text-sm">No previous tests</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MaternalLabTests; 