import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MessageSquare, AlertTriangle, CheckCircle, XCircle, Phone } from "lucide-react";

const commonSymptoms = [
  "Fever", "Cough", "Fatigue", "Headache", "Body aches", 
  "Sore throat", "Loss of taste/smell", "Shortness of breath",
  "Nausea", "Vomiting", "Diarrhea", "Chills"
];

const riskFactors = [
  "Age 65+", "Diabetes", "Heart disease", "Lung disease",
  "Immunocompromised", "Pregnancy", "Obesity"
];

export const SymptomChecker = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [selectedRiskFactors, setSelectedRiskFactors] = useState<string[]>([]);
  const [userAge, setUserAge] = useState("");
  const [riskLevel, setRiskLevel] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<string | null>(null);

  const handleSymptomChange = (symptom: string, checked: boolean) => {
    if (checked) {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    } else {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    }
  };

  const handleRiskFactorChange = (factor: string, checked: boolean) => {
    if (checked) {
      setSelectedRiskFactors([...selectedRiskFactors, factor]);
    } else {
      setSelectedRiskFactors(selectedRiskFactors.filter(f => f !== factor));
    }
  };

  const assessRisk = () => {
    let score = 0;
    
    // High-risk symptoms
    const highRiskSymptoms = ["Fever", "Cough", "Shortness of breath", "Loss of taste/smell"];
    score += selectedSymptoms.filter(s => highRiskSymptoms.includes(s)).length * 2;
    
    // Other symptoms
    score += selectedSymptoms.filter(s => !highRiskSymptoms.includes(s)).length;
    
    // Risk factors
    score += selectedRiskFactors.length * 1.5;
    
    // Age factor
    if (parseInt(userAge) >= 65) score += 2;
    else if (parseInt(userAge) >= 50) score += 1;

    let level: string;
    let rec: string;

    if (score >= 8) {
      level = "High";
      rec = "Seek immediate medical attention. Contact a healthcare provider or visit the nearest emergency room.";
    } else if (score >= 5) {
      level = "Moderate";
      rec = "Contact a healthcare provider for guidance. Consider getting tested and self-isolate until you receive further instructions.";
    } else if (score >= 2) {
      level = "Low";
      rec = "Monitor your symptoms. Consider self-isolation and contact a healthcare provider if symptoms worsen.";
    } else {
      level = "Very Low";
      rec = "Continue monitoring your health. Practice good hygiene and maintain social distancing.";
    }

    setRiskLevel(level);
    setRecommendation(rec);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "High": return "border-red-500 bg-red-50";
      case "Moderate": return "border-orange-500 bg-orange-50";
      case "Low": return "border-yellow-500 bg-yellow-50";
      case "Very Low": return "border-green-500 bg-green-50";
      default: return "border-gray-500 bg-gray-50";
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "High": return <XCircle className="h-5 w-5 text-red-600" />;
      case "Moderate": return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case "Low": return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case "Very Low": return <CheckCircle className="h-5 w-5 text-green-600" />;
      default: return null;
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Symptom Checker Form */}
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              <span>AI Symptom Checker</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={userAge}
                onChange={(e) => setUserAge(e.target.value)}
                placeholder="Enter your age"
                className="w-32"
              />
            </div>

            <div>
              <Label className="text-base font-medium">Current Symptoms</Label>
              <p className="text-sm text-gray-600 mb-3">Select all symptoms you're experiencing:</p>
              <div className="grid grid-cols-2 gap-2">
                {commonSymptoms.map((symptom) => (
                  <div key={symptom} className="flex items-center space-x-2">
                    <Checkbox
                      id={symptom}
                      checked={selectedSymptoms.includes(symptom)}
                      onCheckedChange={(checked) => handleSymptomChange(symptom, !!checked)}
                    />
                    <Label htmlFor={symptom} className="text-sm">{symptom}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-base font-medium">Risk Factors</Label>
              <p className="text-sm text-gray-600 mb-3">Select any that apply to you:</p>
              <div className="grid grid-cols-2 gap-2">
                {riskFactors.map((factor) => (
                  <div key={factor} className="flex items-center space-x-2">
                    <Checkbox
                      id={factor}
                      checked={selectedRiskFactors.includes(factor)}
                      onCheckedChange={(checked) => handleRiskFactorChange(factor, !!checked)}
                    />
                    <Label htmlFor={factor} className="text-sm">{factor}</Label>
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={assessRisk} className="w-full" size="lg">
              <MessageSquare className="h-4 w-4 mr-2" />
              Check My Risk Level
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Risk Assessment Results */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Risk Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            {riskLevel && recommendation ? (
              <div className="space-y-4">
                <Alert className={getRiskColor(riskLevel)}>
                  <div className="flex items-center space-x-2">
                    {getRiskIcon(riskLevel)}
                    <div>
                      <div className="font-medium">Risk Level: {riskLevel}</div>
                      <AlertDescription className="mt-2">
                        {recommendation}
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>

                <div className="space-y-2">
                  <h4 className="font-medium">Your Symptoms:</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedSymptoms.map((symptom) => (
                      <Badge key={symptom} variant="secondary" className="text-xs">
                        {symptom}
                      </Badge>
                    ))}
                  </div>
                </div>

                {selectedRiskFactors.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Risk Factors:</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedRiskFactors.map((factor) => (
                        <Badge key={factor} variant="outline" className="text-xs">
                          {factor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <Button variant="outline" className="w-full" size="sm">
                    <Phone className="h-4 w-4 mr-2" />
                    Contact Healthcare Provider
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Complete the symptom checker to see your risk assessment
              </p>
            )}
          </CardContent>
        </Card>

        {/* Emergency Contacts */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-sm">Emergency Contacts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm">
              <div className="font-medium">Emergency: 911</div>
              <div className="text-gray-600">Health Hotline: 1-800-CDC-INFO</div>
              <div className="text-gray-600">Local Health Dept: (555) 123-4567</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
