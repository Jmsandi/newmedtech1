import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Eye, Calendar, Activity, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface Treatment {
  id: string;
  patientName: string;
  patientId: string;
  condition: string;
  protocol: string;
  startDate: string;
  duration: string;
  status: 'Active' | 'Completed' | 'On Hold' | 'Discontinued';
  medications: string[];
  adherenceRate: number;
  nextReview: string;
  pharmacist: string;
  priority: 'High' | 'Medium' | 'Low';
  outcomes: {
    effectiveness: 'Excellent' | 'Good' | 'Fair' | 'Poor';
    sideEffects: 'None' | 'Mild' | 'Moderate' | 'Severe';
    patientSatisfaction: number;
  };
  notes: string;
}

const mockTreatments: Treatment[] = [
  {
    id: 'TRT-001',
    patientName: 'Sarah Johnson',
    patientId: 'PAT-001',
    condition: 'Type 2 Diabetes',
    protocol: 'Diabetes Management Protocol v2.1',
    startDate: '2024-01-15',
    duration: '6 months',
    status: 'Active',
    medications: ['Metformin 500mg', 'Glipizide 5mg', 'Insulin Glargine'],
    adherenceRate: 92,
    nextReview: '2024-02-15',
    pharmacist: 'Dr. Emily Chen',
    priority: 'High',
    outcomes: {
      effectiveness: 'Good',
      sideEffects: 'Mild',
      patientSatisfaction: 4.5
    },
    notes: 'Patient showing good glucose control. Minor GI side effects from Metformin.'
  },
  {
    id: 'TRT-002',
    patientName: 'Michael Brown',
    patientId: 'PAT-002',
    condition: 'Hypertension',
    protocol: 'Hypertension Management Protocol v1.8',
    startDate: '2023-11-20',
    duration: '12 months',
    status: 'Active',
    medications: ['Lisinopril 10mg', 'Amlodipine 5mg', 'Hydrochlorothiazide 25mg'],
    adherenceRate: 88,
    nextReview: '2024-02-20',
    pharmacist: 'Dr. James Wilson',
    priority: 'Medium',
    outcomes: {
      effectiveness: 'Excellent',
      sideEffects: 'None',
      patientSatisfaction: 4.8
    },
    notes: 'Blood pressure well controlled. Patient reports no side effects.'
  },
  {
    id: 'TRT-003',
    patientName: 'Lisa Davis',
    patientId: 'PAT-003',
    condition: 'Depression',
    protocol: 'Mental Health Medication Protocol v3.0',
    startDate: '2024-01-05',
    duration: '9 months',
    status: 'Active',
    medications: ['Sertraline 50mg', 'Bupropion XL 150mg'],
    adherenceRate: 76,
    nextReview: '2024-02-05',
    pharmacist: 'Dr. Sarah Martinez',
    priority: 'High',
    outcomes: {
      effectiveness: 'Fair',
      sideEffects: 'Moderate',
      patientSatisfaction: 3.2
    },
    notes: 'Patient experiencing some side effects. Considering dose adjustment.'
  },
  {
    id: 'TRT-004',
    patientName: 'Robert Wilson',
    patientId: 'PAT-004',
    condition: 'COPD',
    protocol: 'COPD Management Protocol v2.5',
    startDate: '2023-10-10',
    duration: '12 months',
    status: 'Completed',
    medications: ['Tiotropium', 'Albuterol', 'Prednisone'],
    adherenceRate: 94,
    nextReview: '2024-03-10',
    pharmacist: 'Dr. Michael Thompson',
    priority: 'Medium',
    outcomes: {
      effectiveness: 'Good',
      sideEffects: 'Mild',
      patientSatisfaction: 4.3
    },
    notes: 'Treatment completed successfully. Patient showing improved lung function.'
  },
  {
    id: 'TRT-005',
    patientName: 'Jennifer Lee',
    patientId: 'PAT-005',
    condition: 'Rheumatoid Arthritis',
    protocol: 'RA Biologic Therapy Protocol v1.2',
    startDate: '2024-01-08',
    duration: '18 months',
    status: 'On Hold',
    medications: ['Adalimumab', 'Methotrexate', 'Folic Acid'],
    adherenceRate: 85,
    nextReview: '2024-02-08',
    pharmacist: 'Dr. Emily Chen',
    priority: 'High',
    outcomes: {
      effectiveness: 'Good',
      sideEffects: 'Moderate',
      patientSatisfaction: 4.0
    },
    notes: 'Treatment on hold due to minor infection. Will resume after clearance.'
  }
];

const Treatments: React.FC = () => {
  const [treatments, setTreatments] = useState<Treatment[]>(mockTreatments);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const filteredTreatments = treatments.filter(treatment =>
    treatment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    treatment.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
    treatment.protocol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    treatment.pharmacist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <Activity className="h-4 w-4" />;
      case 'Completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'On Hold':
        return <AlertTriangle className="h-4 w-4" />;
      case 'Discontinued':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      case 'On Hold':
        return 'bg-yellow-100 text-yellow-800';
      case 'Discontinued':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEffectivenessColor = (effectiveness: string) => {
    switch (effectiveness) {
      case 'Excellent':
        return 'text-green-600';
      case 'Good':
        return 'text-blue-600';
      case 'Fair':
        return 'text-yellow-600';
      case 'Poor':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const totalTreatments = treatments.length;
  const activeTreatments = treatments.filter(t => t.status === 'Active').length;
  const avgAdherence = Math.round(treatments.reduce((sum, t) => sum + t.adherenceRate, 0) / treatments.length);
  const reviewsDue = treatments.filter(t => new Date(t.nextReview) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Treatments</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Treatment Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Treatment Plan</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="patient">Patient</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pat1">Sarah Johnson</SelectItem>
                    <SelectItem value="pat2">Michael Brown</SelectItem>
                    <SelectItem value="pat3">Lisa Davis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="condition">Condition</Label>
                <Input placeholder="Enter condition" />
              </div>
              <div>
                <Label htmlFor="protocol">Treatment Protocol</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select protocol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="diabetes">Diabetes Management Protocol</SelectItem>
                    <SelectItem value="hypertension">Hypertension Management Protocol</SelectItem>
                    <SelectItem value="mental">Mental Health Medication Protocol</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="duration">Duration</Label>
                <Input placeholder="e.g., 6 months" />
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="pharmacist">Assigned Pharmacist</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select pharmacist" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chen">Dr. Emily Chen</SelectItem>
                    <SelectItem value="wilson">Dr. James Wilson</SelectItem>
                    <SelectItem value="martinez">Dr. Sarah Martinez</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label htmlFor="notes">Treatment Notes</Label>
                <Textarea placeholder="Enter treatment notes and objectives" />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(false)}>
                Create Treatment Plan
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Treatments</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTreatments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Treatments</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTreatments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Adherence</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgAdherence}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reviews Due</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reviewsDue}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search treatments by patient, condition, protocol, or pharmacist..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Treatments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Treatment Plans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Patient</th>
                  <th className="text-left p-2">Condition</th>
                  <th className="text-left p-2">Protocol</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Priority</th>
                  <th className="text-left p-2">Adherence</th>
                  <th className="text-left p-2">Effectiveness</th>
                  <th className="text-left p-2">Next Review</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTreatments.map((treatment) => (
                  <tr key={treatment.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      <div>
                        <div className="font-medium">{treatment.patientName}</div>
                        <div className="text-sm text-gray-500">{treatment.patientId}</div>
                      </div>
                    </td>
                    <td className="p-2">{treatment.condition}</td>
                    <td className="p-2">
                      <div className="text-sm">{treatment.protocol}</div>
                    </td>
                    <td className="p-2">
                      <Badge className={`${getStatusColor(treatment.status)} flex items-center gap-1 w-fit`}>
                        {getStatusIcon(treatment.status)}
                        {treatment.status}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <Badge className={getPriorityColor(treatment.priority)}>
                        {treatment.priority}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${treatment.adherenceRate}%` }}
                          ></div>
                        </div>
                        <span className="text-sm">{treatment.adherenceRate}%</span>
                      </div>
                    </td>
                    <td className="p-2">
                      <span className={`font-medium ${getEffectivenessColor(treatment.outcomes.effectiveness)}`}>
                        {treatment.outcomes.effectiveness}
                      </span>
                    </td>
                    <td className="p-2">{new Date(treatment.nextReview).toLocaleDateString()}</td>
                    <td className="p-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedTreatment(treatment)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>Treatment Plan Details - {treatment.patientName}</DialogTitle>
                          </DialogHeader>
                          {selectedTreatment && (
                            <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <div>
                                  <h3 className="font-semibold mb-2">Treatment Information</h3>
                                  <div className="space-y-2 text-sm">
                                    <div><strong>Patient:</strong> {selectedTreatment.patientName} ({selectedTreatment.patientId})</div>
                                    <div><strong>Condition:</strong> {selectedTreatment.condition}</div>
                                    <div><strong>Protocol:</strong> {selectedTreatment.protocol}</div>
                                    <div><strong>Start Date:</strong> {new Date(selectedTreatment.startDate).toLocaleDateString()}</div>
                                    <div><strong>Duration:</strong> {selectedTreatment.duration}</div>
                                    <div><strong>Pharmacist:</strong> {selectedTreatment.pharmacist}</div>
                                    <div className="flex items-center gap-2">
                                      <strong>Status:</strong>
                                      <Badge className={getStatusColor(selectedTreatment.status)}>
                                        {selectedTreatment.status}
                                      </Badge>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <strong>Priority:</strong>
                                      <Badge className={getPriorityColor(selectedTreatment.priority)}>
                                        {selectedTreatment.priority}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <h3 className="font-semibold mb-2">Medications</h3>
                                  <div className="space-y-1">
                                    {selectedTreatment.medications.map((med, index) => (
                                      <Badge key={index} variant="outline" className="mr-2 mb-1">
                                        {med}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-4">
                                <div>
                                  <h3 className="font-semibold mb-2">Treatment Outcomes</h3>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <strong>Adherence Rate:</strong>
                                      <span>{selectedTreatment.adherenceRate}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <strong>Effectiveness:</strong>
                                      <span className={getEffectivenessColor(selectedTreatment.outcomes.effectiveness)}>
                                        {selectedTreatment.outcomes.effectiveness}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <strong>Side Effects:</strong>
                                      <span>{selectedTreatment.outcomes.sideEffects}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <strong>Patient Satisfaction:</strong>
                                      <span>{selectedTreatment.outcomes.patientSatisfaction}/5.0</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <strong>Next Review:</strong>
                                      <span>{new Date(selectedTreatment.nextReview).toLocaleDateString()}</span>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <h3 className="font-semibold mb-2">Clinical Notes</h3>
                                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                                    {selectedTreatment.notes}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Treatments; 