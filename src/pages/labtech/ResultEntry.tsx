import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { 
  Microscope, 
  Search, 
  TestTube, 
  Droplets, 
  Dna, 
  Heart, 
  Brain, 
  Bug, 
  Plus, 
  Trash2, 
  UserCheck,
  Save,
  RotateCcw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  getLabTestsBySampleId, 
  updateLabTestResults, 
  generateSampleId,
  getAllLabTests,
  getLabTestsByStatus,
  reviewLabTest
} from "@/services/database/lab-tests";
import { getAllDoctors } from "@/services/database/doctors";
import { LabTest, TestParameter, Doctor } from "@/services/database/types";

interface TestCategory {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  tests: {
    [key: string]: {
      name: string;
      parameters: Omit<TestParameter, 'value' | 'status'>[];
    };
  };
}

interface TestResult {
  labTest: LabTest;
  testParameters: TestParameter[];
  notes: string;
  assignedDoctor?: string;
  isCompleted: boolean;
}

const testCategories: TestCategory[] = [
  {
    id: "hematology",
    name: "Hematology Tests",
    icon: Droplets,
    color: "red",
    tests: {
      cbc: {
        name: "Complete Blood Count (CBC)",
        parameters: [
          { id: "hb", name: "Hemoglobin (Hb)", unit: "g/dL", referenceRange: "M: 13.5-17.5, F: 12.0-15.5", type: "number" },
          { id: "hct", name: "Hematocrit (HCT)", unit: "%", referenceRange: "M: 38.8-50.0, F: 34.9-44.5", type: "number" },
          { id: "wbc", name: "White Blood Cell Count (WBC)", unit: "10³/µL", referenceRange: "4.5-11.0", type: "number" },
          { id: "platelets", name: "Platelet Count", unit: "10³/µL", referenceRange: "150-450", type: "number" },
          { id: "rbc", name: "Red Blood Cell Count", unit: "10⁶/µL", referenceRange: "M: 4.5-5.9, F: 4.1-5.1", type: "number" },
        ]
      },
      esr: {
        name: "ESR (Erythrocyte Sedimentation Rate)",
        parameters: [
          { id: "esr", name: "ESR", unit: "mm/hr", referenceRange: "M: 0-15, F: 0-20", type: "number" },
        ]
      },
      bloodFilm: {
        name: "Blood Film (Peripheral Blood Smear)",
        parameters: [
          { id: "morphology", name: "RBC Morphology", unit: "", referenceRange: "Normal", type: "text" },
          { id: "parasites", name: "Parasites", unit: "", referenceRange: "None seen", type: "select", options: ["None seen", "Malaria parasites present", "Other parasites"] },
        ]
      }
    }
  },
  {
    id: "chemistry",
    name: "Clinical Chemistry",
    icon: TestTube,
    color: "blue",
    tests: {
      glucose: {
        name: "Blood Glucose",
        parameters: [
          { id: "fasting", name: "Fasting Glucose", unit: "mg/dL", referenceRange: "70-100", type: "number" },
          { id: "random", name: "Random Glucose", unit: "mg/dL", referenceRange: "<140", type: "number" },
        ]
      },
      lipidProfile: {
        name: "Lipid Profile",
        parameters: [
          { id: "cholesterol", name: "Total Cholesterol", unit: "mg/dL", referenceRange: "<200", type: "number" },
          { id: "hdl", name: "HDL Cholesterol", unit: "mg/dL", referenceRange: "M: >40, F: >50", type: "number" },
          { id: "ldl", name: "LDL Cholesterol", unit: "mg/dL", referenceRange: "<100", type: "number" },
          { id: "triglycerides", name: "Triglycerides", unit: "mg/dL", referenceRange: "<150", type: "number" },
        ]
      },
      lft: {
        name: "Liver Function Tests (LFTs)",
        parameters: [
          { id: "alt", name: "ALT (SGPT)", unit: "U/L", referenceRange: "7-56", type: "number" },
          { id: "ast", name: "AST (SGOT)", unit: "U/L", referenceRange: "10-40", type: "number" },
          { id: "alp", name: "ALP", unit: "U/L", referenceRange: "44-147", type: "number" },
          { id: "bilirubin_total", name: "Total Bilirubin", unit: "mg/dL", referenceRange: "0.3-1.2", type: "number" },
          { id: "bilirubin_direct", name: "Direct Bilirubin", unit: "mg/dL", referenceRange: "0.0-0.3", type: "number" },
        ]
      },
      kft: {
        name: "Kidney Function Tests (KFTs)",
        parameters: [
          { id: "urea", name: "Urea", unit: "mg/dL", referenceRange: "7-20", type: "number" },
          { id: "creatinine", name: "Creatinine", unit: "mg/dL", referenceRange: "M: 0.7-1.3, F: 0.6-1.1", type: "number" },
          { id: "uric_acid", name: "Uric Acid", unit: "mg/dL", referenceRange: "M: 3.4-7.0, F: 2.4-6.0", type: "number" },
        ]
      },
      electrolytes: {
        name: "Electrolytes",
        parameters: [
          { id: "sodium", name: "Sodium (Na⁺)", unit: "mEq/L", referenceRange: "136-145", type: "number" },
          { id: "potassium", name: "Potassium (K⁺)", unit: "mEq/L", referenceRange: "3.5-5.1", type: "number" },
          { id: "chloride", name: "Chloride (Cl⁻)", unit: "mEq/L", referenceRange: "98-107", type: "number" },
          { id: "bicarbonate", name: "Bicarbonate (HCO₃⁻)", unit: "mEq/L", referenceRange: "22-28", type: "number" },
        ]
      },
      proteins: {
        name: "Protein Studies",
        parameters: [
          { id: "total_protein", name: "Total Protein", unit: "g/dL", referenceRange: "6.0-8.3", type: "number" },
          { id: "albumin", name: "Albumin", unit: "g/dL", referenceRange: "3.5-5.0", type: "number" },
          { id: "globulin", name: "Globulin", unit: "g/dL", referenceRange: "2.3-3.4", type: "number" },
        ]
      },
      minerals: {
        name: "Minerals",
        parameters: [
          { id: "calcium", name: "Calcium", unit: "mg/dL", referenceRange: "8.5-10.5", type: "number" },
          { id: "phosphorus", name: "Phosphorus", unit: "mg/dL", referenceRange: "2.5-4.5", type: "number" },
        ]
      }
    }
  },
  {
    id: "microbiology",
    name: "Microbiology",
    icon: Bug,
    color: "green",
    tests: {
      malaria: {
        name: "Malaria Parasite Test (MP)",
        parameters: [
          { id: "mp_result", name: "Malaria Parasite", unit: "", referenceRange: "Negative", type: "select", options: ["Negative", "P. falciparum", "P. vivax", "P. malariae", "P. ovale", "Mixed infection"] },
          { id: "parasitemia", name: "Parasitemia", unit: "%", referenceRange: "0", type: "number" },
        ]
      },
      typhoid: {
        name: "Typhoid Test (Widal Test)",
        parameters: [
          { id: "to", name: "Salmonella Typhi O", unit: "", referenceRange: "<1:80", type: "text" },
          { id: "th", name: "Salmonella Typhi H", unit: "", referenceRange: "<1:80", type: "text" },
          { id: "ao", name: "Salmonella Paratyphi A O", unit: "", referenceRange: "<1:80", type: "text" },
          { id: "ah", name: "Salmonella Paratyphi A H", unit: "", referenceRange: "<1:80", type: "text" },
        ]
      },
      cultures: {
        name: "Culture Tests",
        parameters: [
          { id: "organism", name: "Organism Isolated", unit: "", referenceRange: "No growth", type: "text" },
          { id: "sensitivity", name: "Antibiotic Sensitivity", unit: "", referenceRange: "N/A", type: "text" },
          { id: "colony_count", name: "Colony Count", unit: "CFU/mL", referenceRange: "<10⁵", type: "number" },
        ]
      },
      tb: {
        name: "Tuberculosis Tests",
        parameters: [
          { id: "afb", name: "AFB Stain", unit: "", referenceRange: "Negative", type: "select", options: ["Negative", "1+", "2+", "3+", "4+"] },
          { id: "genexpert", name: "GeneXpert MTB/RIF", unit: "", referenceRange: "Not detected", type: "select", options: ["Not detected", "MTB detected (RIF sensitive)", "MTB detected (RIF resistant)", "MTB detected (RIF indeterminate)"] },
        ]
      }
    }
  },
  {
    id: "serology",
    name: "Serology/Immunology",
    icon: Heart,
    color: "purple",
    tests: {
      hiv: {
        name: "HIV Test",
        parameters: [
          { id: "hiv_result", name: "HIV 1/2 Antibodies", unit: "", referenceRange: "Non-reactive", type: "select", options: ["Non-reactive", "Reactive", "Indeterminate"] },
        ]
      },
      hepatitis: {
        name: "Hepatitis Panel",
        parameters: [
          { id: "hbsag", name: "HBsAg", unit: "", referenceRange: "Non-reactive", type: "select", options: ["Non-reactive", "Reactive"] },
          { id: "hcv", name: "HCV Antibodies", unit: "", referenceRange: "Non-reactive", type: "select", options: ["Non-reactive", "Reactive"] },
        ]
      },
      syphilis: {
        name: "Syphilis Test",
        parameters: [
          { id: "vdrl", name: "VDRL/RPR", unit: "", referenceRange: "Non-reactive", type: "select", options: ["Non-reactive", "Reactive"] },
          { id: "titer", name: "Titer (if reactive)", unit: "", referenceRange: "N/A", type: "text" },
        ]
      },
      inflammatory: {
        name: "Inflammatory Markers",
        parameters: [
          { id: "crp", name: "C-Reactive Protein (CRP)", unit: "mg/L", referenceRange: "<3.0", type: "number" },
          { id: "rf", name: "Rheumatoid Factor (RF)", unit: "IU/mL", referenceRange: "<20", type: "number" },
          { id: "aso", name: "ASO Titer", unit: "IU/mL", referenceRange: "<200", type: "number" },
        ]
      }
    }
  },
  {
    id: "urinalysis",
    name: "Urinalysis",
    icon: Droplets,
    color: "yellow",
    tests: {
      routine: {
        name: "Routine Urine Test",
        parameters: [
          { id: "color", name: "Color", unit: "", referenceRange: "Pale yellow", type: "select", options: ["Pale yellow", "Yellow", "Dark yellow", "Amber", "Red", "Brown", "Clear"] },
          { id: "appearance", name: "Appearance", unit: "", referenceRange: "Clear", type: "select", options: ["Clear", "Slightly turbid", "Turbid", "Cloudy"] },
          { id: "specific_gravity", name: "Specific Gravity", unit: "", referenceRange: "1.003-1.030", type: "number" },
          { id: "ph", name: "pH", unit: "", referenceRange: "4.6-8.0", type: "number" },
          { id: "protein", name: "Protein", unit: "", referenceRange: "Negative", type: "select", options: ["Negative", "Trace", "1+", "2+", "3+", "4+"] },
          { id: "glucose", name: "Glucose", unit: "", referenceRange: "Negative", type: "select", options: ["Negative", "Trace", "1+", "2+", "3+", "4+"] },
          { id: "ketones", name: "Ketones", unit: "", referenceRange: "Negative", type: "select", options: ["Negative", "Trace", "Small", "Moderate", "Large"] },
          { id: "blood", name: "Blood", unit: "", referenceRange: "Negative", type: "select", options: ["Negative", "Trace", "1+", "2+", "3+"] },
          { id: "wbc_urine", name: "WBC", unit: "/hpf", referenceRange: "0-5", type: "number" },
          { id: "rbc_urine", name: "RBC", unit: "/hpf", referenceRange: "0-2", type: "number" },
          { id: "epithelial", name: "Epithelial Cells", unit: "/hpf", referenceRange: "Few", type: "text" },
          { id: "bacteria", name: "Bacteria", unit: "", referenceRange: "Few", type: "select", options: ["None", "Few", "Moderate", "Many"] },
        ]
      }
    }
  },
  {
    id: "stool",
    name: "Stool Analysis",
    icon: TestTube,
    color: "brown",
    tests: {
      routine: {
        name: "Routine Stool Analysis",
        parameters: [
          { id: "consistency", name: "Consistency", unit: "", referenceRange: "Formed", type: "select", options: ["Formed", "Semi-formed", "Loose", "Watery"] },
          { id: "color_stool", name: "Color", unit: "", referenceRange: "Brown", type: "select", options: ["Brown", "Yellow", "Green", "Black", "Red", "Clay-colored"] },
          { id: "ova", name: "Ova", unit: "", referenceRange: "None seen", type: "text" },
          { id: "parasites_stool", name: "Parasites", unit: "", referenceRange: "None seen", type: "text" },
          { id: "occult_blood", name: "Occult Blood", unit: "", referenceRange: "Negative", type: "select", options: ["Negative", "Positive"] },
          { id: "reducing_substances", name: "Reducing Substances", unit: "", referenceRange: "Negative", type: "select", options: ["Negative", "Positive"] },
          { id: "stool_ph", name: "pH", unit: "", referenceRange: "6.0-7.5", type: "number" },
        ]
      }
    }
  },
  {
    id: "hormones",
    name: "Hormone & Endocrine Tests",
    icon: Brain,
    color: "pink",
    tests: {
      thyroid: {
        name: "Thyroid Profile",
        parameters: [
          { id: "tsh", name: "TSH", unit: "mIU/L", referenceRange: "0.27-4.20", type: "number" },
          { id: "t3", name: "T3", unit: "ng/dL", referenceRange: "80-200", type: "number" },
          { id: "t4", name: "T4", unit: "µg/dL", referenceRange: "5.1-14.1", type: "number" },
        ]
      },
      pregnancy: {
        name: "Pregnancy Test",
        parameters: [
          { id: "beta_hcg", name: "Beta-hCG", unit: "mIU/mL", referenceRange: "Non-pregnant: <5", type: "number" },
        ]
      },
      reproductive: {
        name: "Reproductive Hormones",
        parameters: [
          { id: "testosterone", name: "Testosterone", unit: "ng/dL", referenceRange: "M: 300-1000, F: 15-70", type: "number" },
          { id: "estrogen", name: "Estrogen", unit: "pg/mL", referenceRange: "Varies by cycle", type: "number" },
          { id: "progesterone", name: "Progesterone", unit: "ng/mL", referenceRange: "Varies by cycle", type: "number" },
        ]
      },
      metabolic: {
        name: "Metabolic Hormones",
        parameters: [
          { id: "cortisol", name: "Cortisol", unit: "µg/dL", referenceRange: "6.2-19.4", type: "number" },
          { id: "insulin", name: "Insulin", unit: "µIU/mL", referenceRange: "2.6-24.9", type: "number" },
        ]
      }
    }
  },
  {
    id: "molecular",
    name: "Molecular & Genetic Tests",
    icon: Dna,
    color: "indigo",
    tests: {
      pcr: {
        name: "PCR Tests",
        parameters: [
          { id: "covid_pcr", name: "COVID-19 PCR", unit: "", referenceRange: "Not detected", type: "select", options: ["Not detected", "Detected"] },
          { id: "hiv_viral_load", name: "HIV Viral Load", unit: "copies/mL", referenceRange: "Undetectable", type: "number" },
        ]
      }
    }
  },
  {
    id: "others",
    name: "Other Tests",
    icon: TestTube,
    color: "gray",
    tests: {
      covid: {
        name: "COVID-19 Tests",
        parameters: [
          { id: "covid_antigen", name: "COVID-19 Antigen", unit: "", referenceRange: "Negative", type: "select", options: ["Negative", "Positive"] },
        ]
      },
      dengue: {
        name: "Dengue Tests",
        parameters: [
          { id: "dengue_ns1", name: "Dengue NS1", unit: "", referenceRange: "Negative", type: "select", options: ["Negative", "Positive"] },
          { id: "dengue_igm", name: "Dengue IgM", unit: "", referenceRange: "Negative", type: "select", options: ["Negative", "Positive"] },
          { id: "dengue_igg", name: "Dengue IgG", unit: "", referenceRange: "Negative", type: "select", options: ["Negative", "Positive"] },
        ]
      },
      sickle: {
        name: "Sickle Cell Screening",
        parameters: [
          { id: "sickle_test", name: "Sickle Cell Test", unit: "", referenceRange: "Negative", type: "select", options: ["Negative", "Positive", "Trait"] },
        ]
      }
    }
  }
];

const ResultEntry: React.FC = () => {
  const { toast } = useToast();
  const [sampleId, setSampleId] = useState("");
  const [currentLabTest, setCurrentLabTest] = useState<LabTest | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("hematology");
  const [selectedTest, setSelectedTest] = useState("cbc");
  const [notes, setNotes] = useState("");
  const [testParameters, setTestParameters] = useState<TestParameter[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [batchResults, setBatchResults] = useState<TestResult[]>([]);
  const [pendingTests, setPendingTests] = useState<LabTest[]>([]);

  // Load doctors and pending tests on component mount
  useEffect(() => {
    loadDoctors();
    loadPendingTests();
  }, []);

  const loadDoctors = async () => {
    try {
      const doctorsList = await getAllDoctors();
      setDoctors(doctorsList);
    } catch (error) {
      console.error('Error loading doctors:', error);
    }
  };

  const loadPendingTests = async () => {
    try {
      const tests = await getLabTestsByStatus('Collected');
      setPendingTests(tests);
    } catch (error) {
      console.error('Error loading pending tests:', error);
    }
  };

  // Helper function to determine parameter status based on value and reference range
  const determineParameterStatus = (value: string, referenceRange: string, type: string): TestParameter['status'] => {
    if (!value || value.trim() === '') return 'Normal';
    
    if (type === 'select') {
      // For select types, check if the value indicates abnormality
      const lowerValue = value.toLowerCase();
      if (lowerValue.includes('positive') || lowerValue.includes('reactive') || 
          lowerValue.includes('detected') || lowerValue.includes('present') ||
          lowerValue.includes('falciparum') || lowerValue.includes('vivax') ||
          lowerValue.includes('resistant')) {
        return 'Critical';
      }
      return 'Normal';
    }
    
    if (type === 'number') {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) return 'Normal';
      
      // Parse reference range
      const rangeMatch = referenceRange.match(/(\d+\.?\d*)-(\d+\.?\d*)/);
      if (rangeMatch) {
        const min = parseFloat(rangeMatch[1]);
        const max = parseFloat(rangeMatch[2]);
        
        if (numValue < min * 0.5 || numValue > max * 2) return 'Critical';
        if (numValue < min || numValue > max) return numValue < min ? 'Low' : 'High';
        return 'Normal';
      }
      
      // Handle single threshold (e.g., "<100")
      const thresholdMatch = referenceRange.match(/[<>](\d+\.?\d*)/);
      if (thresholdMatch) {
        const threshold = parseFloat(thresholdMatch[1]);
        const isLessThan = referenceRange.includes('<');
        
        if (isLessThan) {
          if (numValue >= threshold * 2) return 'Critical';
          if (numValue >= threshold) return 'High';
        } else {
          if (numValue <= threshold * 0.5) return 'Critical';
          if (numValue <= threshold) return 'Low';
        }
        return 'Normal';
      }
    }
    
    return 'Normal';
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sampleId.trim()) return;

    setIsLoading(true);
    try {
      const labTest = await getLabTestsBySampleId(sampleId);
      if (labTest) {
        setCurrentLabTest(labTest);
        
        // Find the test category and specific test
        const category = testCategories.find(cat => cat.id === labTest.testCategory);
        const test = category?.tests[labTest.specificTest];
        
        if (test) {
          setSelectedCategory(labTest.testCategory);
          setSelectedTest(labTest.specificTest);
          
          // Initialize test parameters
          const initialParameters = test.parameters.map(param => ({
            ...param,
            value: "",
            status: "Normal" as TestParameter['status']
          }));
          setTestParameters(initialParameters);
          
          // Set the requesting doctor as default
          const requestingDoctor = doctors.find(doc => doc.name === labTest.requestedBy);
          if (requestingDoctor) {
            setSelectedDoctor(requestingDoctor._id);
          }
        }
      } else {
        toast({
          title: "Sample Not Found",
          description: `No lab test found for sample ID: ${sampleId}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search for sample",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleParameterChange = (id: string, value: string) => {
    setTestParameters(prev => prev.map(param => {
      if (param.id === id) {
        const status = determineParameterStatus(value, param.referenceRange, param.type);
        return { ...param, value, status };
      }
      return param;
    }));
  };

  const handleSaveResults = async () => {
    if (!currentLabTest) {
      toast({
        title: "Error",
        description: "No lab test selected",
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
      const success = await updateLabTestResults(
        currentLabTest._id,
        testParameters,
        notes,
        "Lab Technician Mike" // In a real app, this would be the logged-in user
      );

      if (success) {
        // If doctor is assigned and results are abnormal/critical, notify doctor
        if (selectedDoctor) {
          const hasAbnormalResults = testParameters.some(param => 
            param.status === 'High' || param.status === 'Low' || 
            param.status === 'Critical' || param.status === 'Abnormal'
          );
          
          if (hasAbnormalResults) {
            const doctor = doctors.find(d => d._id === selectedDoctor);
            await reviewLabTest(currentLabTest._id, doctor?.name || "Assigned Doctor", 
              `Results assigned to ${doctor?.name} for review due to abnormal values.`);
          }
        }

        toast({
          title: "Results Saved",
          description: `Test results for sample ${sampleId} have been saved successfully${selectedDoctor ? ' and assigned to doctor' : ''}`,
        });

        // Add to batch if in batch mode
        if (isBatchMode) {
          const newResult: TestResult = {
            labTest: currentLabTest,
            testParameters: [...testParameters],
            notes,
            assignedDoctor: selectedDoctor,
            isCompleted: true
          };
          setBatchResults(prev => [...prev, newResult]);
        }

        // Reset form
        resetForm();
        await loadPendingTests(); // Refresh pending tests
      } else {
        toast({
          title: "Error",
          description: "Failed to save test results",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while saving results",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSampleId("");
    setCurrentLabTest(null);
    setNotes("");
    setTestParameters([]);
    setSelectedDoctor("");
  };

  const handleBatchSave = async () => {
    if (batchResults.length === 0) {
      toast({
        title: "No Results",
        description: "No results to save in batch",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      let successCount = 0;
      for (const result of batchResults) {
        if (!result.isCompleted) {
          const success = await updateLabTestResults(
            result.labTest._id,
            result.testParameters,
            result.notes,
            "Lab Technician Mike"
          );
          if (success) successCount++;
        }
      }

      toast({
        title: "Batch Save Complete",
        description: `Successfully saved ${successCount} test results`,
      });

      setBatchResults([]);
      setIsBatchMode(false);
      await loadPendingTests();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save batch results",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickSelect = (test: LabTest) => {
    setSampleId(test.sampleId || "");
    setCurrentLabTest(test);
    
    // Find the test category and specific test
    const category = testCategories.find(cat => cat.id === test.testCategory);
    const testConfig = category?.tests[test.specificTest];
    
    if (testConfig) {
      setSelectedCategory(test.testCategory);
      setSelectedTest(test.specificTest);
      
      // Initialize test parameters
      const initialParameters = testConfig.parameters.map(param => ({
        ...param,
        value: "",
        status: "Normal" as TestParameter['status']
      }));
      setTestParameters(initialParameters);
      
      // Set the requesting doctor as default
      const requestingDoctor = doctors.find(doc => doc.name === test.requestedBy);
      if (requestingDoctor) {
        setSelectedDoctor(requestingDoctor._id);
      }
    }
  };

  const currentCategory = testCategories.find(cat => cat.id === selectedCategory);
  const currentTest = currentCategory?.tests[selectedTest];

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Laboratory Result Entry</h1>
        <div className="flex gap-2">
          <Button 
            variant={isBatchMode ? "default" : "outline"} 
            onClick={() => setIsBatchMode(!isBatchMode)}
            className="flex items-center gap-2"
          >
            <TestTube className="h-4 w-4" />
            {isBatchMode ? "Exit Batch Mode" : "Batch Mode"}
          </Button>
          {isBatchMode && batchResults.length > 0 && (
            <Button onClick={handleBatchSave} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Batch ({batchResults.length})
            </Button>
          )}
        </div>
      </div>

      {/* Batch Mode Summary */}
      {isBatchMode && batchResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              Batch Results Summary ({batchResults.length} tests)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {batchResults.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <span className="font-medium">{result.labTest.sampleId}</span> - 
                    <span className="ml-2">{result.labTest.patientName}</span> - 
                    <span className="ml-2">{result.labTest.testType}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {result.assignedDoctor && (
                      <Badge variant="outline">
                        {doctors.find(d => d._id === result.assignedDoctor)?.name}
                      </Badge>
                    )}
                    <Badge className="bg-green-500">Completed</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Select Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Pending Tests ({pendingTests.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {pendingTests.map((test) => (
                <div 
                  key={test._id}
                  className="p-3 border rounded cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleQuickSelect(test)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm">{test.sampleId}</p>
                      <p className="text-xs text-gray-500">{test.patientName}</p>
                      <p className="text-xs text-gray-500">{test.testType}</p>
                    </div>
                    <Badge className={`text-xs ${
                      test.priority === 'STAT' ? 'bg-red-500' :
                      test.priority === 'Urgent' ? 'bg-orange-500' :
                      test.priority === 'High' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}>
                      {test.priority}
                    </Badge>
                  </div>
                </div>
              ))}
              {pendingTests.length === 0 && (
                <p className="text-center text-gray-500 py-4">No pending tests</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Main Entry Panel */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Microscope className="h-5 w-5 text-indigo-600" />
              Enter Test Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!currentLabTest ? (
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sampleId">Sample ID</Label>
                  <div className="flex">
                    <div className="relative flex-grow">
                      <Search className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
                      <Input 
                        id="sampleId" 
                        className="pl-9" 
                        placeholder="Enter sample ID or select from pending tests"
                        value={sampleId}
                        onChange={(e) => setSampleId(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <Button type="submit" className="ml-2 bg-indigo-600 hover:bg-indigo-700" disabled={isLoading}>
                      {isLoading ? "Searching..." : "Search"}
                    </Button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Sample ID: <span className="text-indigo-600">{sampleId}</span></p>
                    <p className="text-sm text-gray-500">Patient: {currentLabTest.patientName} ({currentLabTest.patientId})</p>
                    <p className="text-sm text-gray-500">Test Type: {currentTest?.name}</p>
                    <p className="text-sm text-gray-500">Requested by: {currentLabTest.requestedBy}</p>
                    <p className="text-sm text-gray-500">Priority: 
                      <Badge className={`ml-2 ${
                        currentLabTest.priority === 'STAT' ? 'bg-red-500' :
                        currentLabTest.priority === 'Urgent' ? 'bg-orange-500' :
                        currentLabTest.priority === 'High' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}>
                        {currentLabTest.priority}
                      </Badge>
                    </p>
                  </div>
                  <Badge className="bg-green-500">Ready for Results</Badge>
                </div>

                {/* Doctor Assignment */}
                <div className="space-y-2">
                  <Label htmlFor="assignDoctor" className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4" />
                    Assign to Doctor (Optional)
                  </Label>
                  <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select doctor for result review..." />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map((doctor) => (
                        <SelectItem key={doctor._id} value={doctor._id}>
                          {doctor.name} - {doctor.specialization}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedDoctor && (
                    <p className="text-xs text-gray-500">
                      Results will be assigned to the selected doctor for review
                    </p>
                  )}
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="font-medium text-lg flex items-center gap-2">
                    {currentCategory && React.createElement(currentCategory.icon, { className: "h-5 w-5" })}
                    Test Parameters - {currentTest?.name}
                  </h3>
                  <div className="rounded-md border p-4 space-y-4">
                    {testParameters.map((param) => (
                      <div key={param.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                        <div className="md:col-span-2">
                          <Label htmlFor={param.id}>{param.name}</Label>
                        </div>
                        <div className="relative md:col-span-1">
                          {param.type === 'select' ? (
                            <Select value={param.value} onValueChange={(value) => handleParameterChange(param.id, value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>
                              <SelectContent>
                                {param.options?.map((option) => (
                                  <SelectItem key={option} value={option}>
                                    {option}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <Input
                              id={param.id}
                              type={param.type}
                              value={param.value}
                              onChange={(e) => handleParameterChange(param.id, e.target.value)}
                              placeholder="Enter value"
                            />
                          )}
                          {param.unit && (
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <span className="text-sm text-gray-500">{param.unit}</span>
                            </div>
                          )}
                        </div>
                        <div className="md:col-span-2 flex items-center gap-2">
                          <p className="text-sm text-gray-500">
                            Reference Range: <span className="font-medium">{param.referenceRange}</span>
                          </p>
                          {param.value && (
                            <Badge className={`text-xs ${
                              param.status === 'Critical' ? 'bg-red-500' :
                              param.status === 'High' || param.status === 'Low' ? 'bg-orange-500' :
                              param.status === 'Abnormal' ? 'bg-yellow-500' : 'bg-green-500'
                            }`}>
                              {param.status}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Clinical Notes & Observations</Label>
                    <Textarea
                      id="notes"
                      placeholder="Add any additional notes, observations, or comments about the test results..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                  
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
                      disabled={isLoading}
                      className="bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {isLoading ? "Saving..." : "Save Results"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResultEntry;
