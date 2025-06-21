
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  getAllOutbreakCases,
  addOutbreakCase,
  updateOutbreakCase,
  deleteOutbreakCase,
  OutbreakCase
} from "@/services/database/outbreak";

export const DataManagement = () => {
  const [cases, setCases] = useState<OutbreakCase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    patientName: "",
    age: "",
    gender: "male" as "male" | "female",
    location: "",
    symptoms: "",
    caseStatus: "suspected" as "suspected" | "confirmed" | "recovered" | "deceased",
    contactPhone: "",
    onsetDate: "",
    diagnosisDate: ""
  });

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    try {
      const casesData = await getAllOutbreakCases();
      setCases(casesData);
    } catch (error) {
      console.error('Error loading cases:', error);
      toast({
        title: "Error",
        description: "Failed to load cases data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      patientName: "",
      age: "",
      gender: "male",
      location: "",
      symptoms: "",
      caseStatus: "suspected",
      contactPhone: "",
      onsetDate: "",
      diagnosisDate: ""
    });
    setShowForm(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const caseData: Omit<OutbreakCase, '_id' | '_rev'> = {
        type: 'outbreak-case',
        patientName: formData.patientName,
        age: parseInt(formData.age),
        gender: formData.gender,
        location: formData.location,
        symptoms: formData.symptoms.split(',').map(s => s.trim()),
        caseStatus: formData.caseStatus,
        contactPhone: formData.contactPhone,
        onsetDate: formData.onsetDate,
        diagnosisDate: formData.diagnosisDate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (editingId) {
        const existingCase = cases.find(c => c._id === editingId);
        if (existingCase) {
          await updateOutbreakCase({ ...caseData, _id: editingId, _rev: existingCase._rev } as OutbreakCase);
          toast({
            title: "Success",
            description: "Case updated successfully"
          });
        }
      } else {
        await addOutbreakCase({ ...caseData, _id: `case-${Date.now()}` } as OutbreakCase);
        toast({
          title: "Success",
          description: "New case added successfully"
        });
      }

      resetForm();
      loadCases();
    } catch (error) {
      console.error('Error saving case:', error);
      toast({
        title: "Error",
        description: "Failed to save case",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (caseItem: OutbreakCase) => {
    setFormData({
      patientName: caseItem.patientName,
      age: caseItem.age.toString(),
      gender: caseItem.gender,
      location: caseItem.location,
      symptoms: caseItem.symptoms.join(', '),
      caseStatus: caseItem.caseStatus,
      contactPhone: caseItem.contactPhone,
      onsetDate: caseItem.onsetDate,
      diagnosisDate: caseItem.diagnosisDate || ""
    });
    setEditingId(caseItem._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string, rev?: string) => {
    if (!rev) return;
    try {
      await deleteOutbreakCase(id, rev);
      toast({
        title: "Success",
        description: "Case deleted successfully"
      });
      loadCases();
    } catch (error) {
      console.error('Error deleting case:', error);
      toast({
        title: "Error",
        description: "Failed to delete case",
        variant: "destructive"
      });
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'confirmed': return 'destructive';
      case 'suspected': return 'secondary';
      case 'recovered': return 'default';
      case 'deceased': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Case Data Management</h2>
        <Button onClick={() => setShowForm(true)} disabled={showForm}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Case
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Case' : 'Add New Case'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="patientName">Patient Name</Label>
                  <Input
                    id="patientName"
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={formData.gender} onValueChange={(value: "male" | "female") => setFormData({ ...formData, gender: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="caseStatus">Case Status</Label>
                  <Select value={formData.caseStatus} onValueChange={(value: any) => setFormData({ ...formData, caseStatus: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="suspected">Suspected</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="recovered">Recovered</SelectItem>
                      <SelectItem value="deceased">Deceased</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="onsetDate">Onset Date</Label>
                  <Input
                    id="onsetDate"
                    type="date"
                    value={formData.onsetDate}
                    onChange={(e) => setFormData({ ...formData, onsetDate: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="diagnosisDate">Diagnosis Date</Label>
                  <Input
                    id="diagnosisDate"
                    type="date"
                    value={formData.diagnosisDate}
                    onChange={(e) => setFormData({ ...formData, diagnosisDate: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="symptoms">Symptoms (comma separated)</Label>
                <Textarea
                  id="symptoms"
                  value={formData.symptoms}
                  onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                  placeholder="fever, cough, headache"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  {editingId ? 'Update' : 'Save'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Case Records</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>Loading cases...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Onset Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cases.map((caseItem) => (
                  <TableRow key={caseItem._id}>
                    <TableCell>{caseItem.patientName}</TableCell>
                    <TableCell>{caseItem.age}</TableCell>
                    <TableCell>{caseItem.location}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(caseItem.caseStatus)}>
                        {caseItem.caseStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(caseItem.onsetDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(caseItem)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(caseItem._id, caseItem._rev)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
