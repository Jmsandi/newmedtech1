
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { patientService, Medication } from "@/services/patientService";
import { Pill, Clock, User, CheckCircle } from "lucide-react";

export const MedicationAdmin: React.FC = () => {
  const { toast } = useToast();
  const [medications, setMedications] = useState<Medication[]>([]);

  useEffect(() => {
    // Load medications for all patients (in real app, filter by nurse's assigned patients)
    const allMeds = [
      patientService.addMedication({
        patientId: "P-001",
        name: "Lisinopril",
        dosage: "10mg",
        frequency: "Once daily",
        startDate: "2025-01-15",
        instructions: "Take with food in the morning",
        prescribedBy: "Dr. Smith"
      }),
      patientService.addMedication({
        patientId: "P-002", 
        name: "Metformin",
        dosage: "500mg",
        frequency: "Twice daily",
        startDate: "2025-01-10",
        instructions: "Take with meals",
        prescribedBy: "Dr. Johnson"
      })
    ];
    setMedications(allMeds);
  }, []);

  const handleAdminister = (medication: Medication) => {
    const nurseInfo = JSON.parse(localStorage.getItem("hms-nurse") || "{}");
    
    patientService.administerMedication(medication.id, nurseInfo.name || "Nurse");
    
    setMedications(prev => 
      prev.map(med => 
        med.id === medication.id 
          ? { ...med, administeredBy: nurseInfo.name, administeredAt: new Date().toISOString() }
          : med
      )
    );

    toast({
      title: "Medication Administered",
      description: `${medication.name} administered to patient ${medication.patientId}`
    });
  };

  const isAdministered = (medication: Medication) => {
    return medication.administeredBy && medication.administeredAt;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pill className="h-5 w-5" />
          Medication Administration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {medications.map((medication) => (
            <div 
              key={medication.id}
              className="p-4 border rounded-lg space-y-2"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{medication.name}</h4>
                  <p className="text-sm text-gray-600">Patient: {medication.patientId}</p>
                </div>
                <Badge variant={isAdministered(medication) ? "default" : "secondary"}>
                  {isAdministered(medication) ? "Administered" : "Pending"}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-medium">Dosage:</span> {medication.dosage}
                </div>
                <div>
                  <span className="font-medium">Frequency:</span> {medication.frequency}
                </div>
              </div>
              
              <p className="text-sm text-gray-600">{medication.instructions}</p>
              
              {isAdministered(medication) ? (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  Administered by {medication.administeredBy} at {new Date(medication.administeredAt!).toLocaleString()}
                </div>
              ) : (
                <Button 
                  onClick={() => handleAdminister(medication)}
                  className="w-full bg-[#3498db] hover:bg-[#2980b9]"
                >
                  Administer Medication
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
