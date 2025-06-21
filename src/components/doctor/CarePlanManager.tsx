
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { patientService, CarePlan } from "@/services/patientService";
import { Plus, Edit, Trash2, FileText } from "lucide-react";

export const CarePlanManager: React.FC = () => {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<CarePlan | null>(null);
  const [formData, setFormData] = useState({
    patientId: "",
    diagnosis: "",
    goals: "",
    interventions: "",
    reviewDate: ""
  });

  const patients = [
    { id: "P-001", name: "James Wilson" },
    { id: "P-002", name: "Maria Garcia" },
    { id: "P-003", name: "Robert Chen" }
  ];

  const [carePlans, setCarePlans] = useState<CarePlan[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const doctorInfo = JSON.parse(localStorage.getItem("hms-doctor") || "{}");
    
    const planData = {
      patientId: formData.patientId,
      diagnosis: formData.diagnosis,
      goals: formData.goals.split('\n').filter(g => g.trim()),
      interventions: formData.interventions.split('\n').filter(i => i.trim()),
      createdBy: doctorInfo.name || "Dr. Smith",
      createdAt: new Date().toISOString(),
      status: "active" as const,
      reviewDate: formData.reviewDate
    };

    if (editingPlan) {
      const updated = patientService.updateCarePlan(editingPlan.id, planData);
      if (updated) {
        setCarePlans(prev => prev.map(cp => cp.id === editingPlan.id ? updated : cp));
        toast({
          title: "Care Plan Updated",
          description: "Care plan has been successfully updated"
        });
      }
    } else {
      const newPlan = patientService.addCarePlan(planData);
      setCarePlans(prev => [...prev, newPlan]);
      toast({
        title: "Care Plan Created",
        description: "New care plan has been successfully created"
      });
    }

    setFormData({
      patientId: "",
      diagnosis: "",
      goals: "",
      interventions: "",
      reviewDate: ""
    });
    setShowForm(false);
    setEditingPlan(null);
  };

  const handleEdit = (plan: CarePlan) => {
    setEditingPlan(plan);
    setFormData({
      patientId: plan.patientId,
      diagnosis: plan.diagnosis,
      goals: plan.goals.join('\n'),
      interventions: plan.interventions.join('\n'),
      reviewDate: plan.reviewDate
    });
    setShowForm(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "completed": return "bg-gray-100 text-gray-800";
      case "on-hold": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Care Plan Management</h2>
        <Button 
          onClick={() => {
            setShowForm(true);
            setEditingPlan(null);
            setFormData({
              patientId: "",
              diagnosis: "",
              goals: "",
              interventions: "",
              reviewDate: ""
            });
          }}
          className="bg-[#2563eb] hover:bg-[#1d4ed8]"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Care Plan
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingPlan ? "Edit Care Plan" : "Create New Care Plan"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="patient">Patient</Label>
                <Select 
                  value={formData.patientId} 
                  onValueChange={(value) => setFormData({...formData, patientId: value})}
                >
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

              <div>
                <Label htmlFor="diagnosis">Diagnosis</Label>
                <Input
                  id="diagnosis"
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
                  placeholder="Primary diagnosis"
                  required
                />
              </div>

              <div>
                <Label htmlFor="goals">Care Goals (one per line)</Label>
                <Textarea
                  id="goals"
                  value={formData.goals}
                  onChange={(e) => setFormData({...formData, goals: e.target.value})}
                  placeholder="Reduce blood pressure to 130/80&#10;Improve medication compliance&#10;Lifestyle modifications"
                  required
                />
              </div>

              <div>
                <Label htmlFor="interventions">Interventions (one per line)</Label>
                <Textarea
                  id="interventions"
                  value={formData.interventions}
                  onChange={(e) => setFormData({...formData, interventions: e.target.value})}
                  placeholder="Daily medication monitoring&#10;Weekly blood pressure checks&#10;Dietary consultation"
                  required
                />
              </div>

              <div>
                <Label htmlFor="reviewDate">Review Date</Label>
                <Input
                  id="reviewDate"
                  type="date"
                  value={formData.reviewDate}
                  onChange={(e) => setFormData({...formData, reviewDate: e.target.value})}
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-[#2563eb] hover:bg-[#1d4ed8]">
                  {editingPlan ? "Update Plan" : "Create Plan"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false);
                    setEditingPlan(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {carePlans.map((plan) => (
          <Card key={plan.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{plan.diagnosis}</CardTitle>
                  <p className="text-sm text-gray-600">
                    Patient: {patients.find(p => p.id === plan.patientId)?.name} ({plan.patientId})
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge className={getStatusColor(plan.status)}>
                    {plan.status}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(plan)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Goals:</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {plan.goals.map((goal, index) => (
                      <li key={index}>{goal}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Interventions:</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {plan.interventions.map((intervention, index) => (
                      <li key={index}>{intervention}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="text-sm text-gray-600">
                  <p>Created by: {plan.createdBy}</p>
                  <p>Review Date: {new Date(plan.reviewDate).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
