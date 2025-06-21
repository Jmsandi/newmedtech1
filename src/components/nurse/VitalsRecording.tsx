
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { patientService } from "@/services/patientService";
import { Activity, Heart, Thermometer, Gauge } from "lucide-react";

interface VitalsRecordingProps {
  patientId?: string;
  onComplete?: () => void;
}

export const VitalsRecording: React.FC<VitalsRecordingProps> = ({ patientId, onComplete }) => {
  const { toast } = useToast();
  const [selectedPatient, setSelectedPatient] = useState(patientId || "");
  const [vitals, setVitals] = useState({
    heartRate: "",
    bloodPressure: "",
    temperature: "",
    respiratoryRate: "",
    oxygenSaturation: ""
  });

  const patients = [
    { id: "P-001", name: "James Wilson" },
    { id: "P-002", name: "Maria Garcia" },
    { id: "P-003", name: "Robert Chen" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPatient) {
      toast({
        title: "Error",
        description: "Please select a patient",
        variant: "destructive"
      });
      return;
    }

    const nurseInfo = JSON.parse(localStorage.getItem("hms-nurse") || "{}");
    
    patientService.addVitals({
      patientId: selectedPatient,
      heartRate: parseInt(vitals.heartRate),
      bloodPressure: vitals.bloodPressure,
      temperature: parseFloat(vitals.temperature),
      respiratoryRate: parseInt(vitals.respiratoryRate),
      oxygenSaturation: parseInt(vitals.oxygenSaturation),
      timestamp: new Date().toISOString(),
      recordedBy: nurseInfo.name || "Nurse"
    });

    toast({
      title: "Vitals Recorded",
      description: "Patient vitals have been successfully recorded"
    });

    setVitals({
      heartRate: "",
      bloodPressure: "",
      temperature: "",
      respiratoryRate: "",
      oxygenSaturation: ""
    });

    onComplete?.();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Record Vital Signs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="patient">Patient</Label>
            <Select value={selectedPatient} onValueChange={setSelectedPatient}>
              <SelectTrigger>
                <SelectValue placeholder="Select patient" />
              </SelectTrigger>
              <SelectContent>
                {patients.map(patient => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.name} ({patient.id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="heartRate" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Heart Rate (bpm)
              </Label>
              <Input
                id="heartRate"
                type="number"
                value={vitals.heartRate}
                onChange={(e) => setVitals({...vitals, heartRate: e.target.value})}
                placeholder="72"
                required
              />
            </div>

            <div>
              <Label htmlFor="bloodPressure">Blood Pressure (mmHg)</Label>
              <Input
                id="bloodPressure"
                value={vitals.bloodPressure}
                onChange={(e) => setVitals({...vitals, bloodPressure: e.target.value})}
                placeholder="120/80"
                required
              />
            </div>

            <div>
              <Label htmlFor="temperature" className="flex items-center gap-2">
                <Thermometer className="h-4 w-4" />
                Temperature (°F)
              </Label>
              <Input
                id="temperature"
                type="number"
                step="0.1"
                value={vitals.temperature}
                onChange={(e) => setVitals({...vitals, temperature: e.target.value})}
                placeholder="98.6"
                required
              />
            </div>

            <div>
              <Label htmlFor="respiratoryRate">Respiratory Rate (per min)</Label>
              <Input
                id="respiratoryRate"
                type="number"
                value={vitals.respiratoryRate}
                onChange={(e) => setVitals({...vitals, respiratoryRate: e.target.value})}
                placeholder="16"
                required
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="oxygenSaturation" className="flex items-center gap-2">
                <Gauge className="h-4 w-4" />
                Oxygen Saturation (%)
              </Label>
              <Input
                id="oxygenSaturation"
                type="number"
                min="0"
                max="100"
                value={vitals.oxygenSaturation}
                onChange={(e) => setVitals({...vitals, oxygenSaturation: e.target.value})}
                placeholder="98"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full bg-[#3498db] hover:bg-[#2980b9]">
            Record Vitals
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
