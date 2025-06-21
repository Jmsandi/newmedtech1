import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Baby, 
  Users, 
  MessageSquare, 
  TrendingUp, 
  AlertTriangle, 
  Calendar, 
  Clock,
  Heart,
  Activity,
  Phone,
  Plus,
  Eye,
  FileText,
  Bell
} from 'lucide-react';
import { 
  getDoctorMaternalDashboard,
  assignDoctorToMaternalPatient,
  createMaternalHealthConsultation,
  updateMaternalHealthConsultation,
  DoctorMaternalAssignment,
  MaternalHealthConsultation
} from '@/services/database/doctor-maternal';
import { getAllMaternalPatients, MaternalPatient } from '@/services/database/maternal-mortality';

interface DoctorMaternalHealthProps {
  doctorId: string;
  doctorName: string;
}

interface DashboardData {
  totalActivePatients: number;
  highRiskPatients: number;
  pendingConsultations: number;
  upcomingAppointments: number;
  assignments: DoctorMaternalAssignment[];
  consultations: MaternalHealthConsultation[];
  performance: any;
  alerts: Array<{
    type: string;
    message: string;
    patientId: string;
  }>;
}

const DoctorMaternalHealth: React.FC<DoctorMaternalHealthProps> = ({ doctorId, doctorName }) => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [availablePatients, setAvailablePatients] = useState<MaternalPatient[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [assignmentType, setAssignmentType] = useState<'primary' | 'secondary' | 'emergency' | 'consultation'>('primary');
  const [consultationForm, setConsultationForm] = useState({
    patientId: '',
    consultationType: 'routine' as 'routine' | 'urgent' | 'emergency' | 'second-opinion',
    reasonForConsultation: '',
    clinicalFindings: '',
    currentTreatment: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical'
  });

  useEffect(() => {
    loadDashboardData();
    loadAvailablePatients();
  }, [doctorId]);

  const loadDashboardData = async () => {
    try {
      const data = await getDoctorMaternalDashboard(doctorId);
      setDashboardData(data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAvailablePatients = async () => {
    try {
      const patients = await getAllMaternalPatients();
      setAvailablePatients(patients.filter(p => p.status === 'active'));
    } catch (error) {
      console.error('Error loading patients:', error);
    }
  };

  const handleAssignPatient = async () => {
    if (!selectedPatient) return;
    
    try {
      await assignDoctorToMaternalPatient(doctorId, selectedPatient, assignmentType);
      await loadDashboardData();
      setSelectedPatient('');
    } catch (error) {
      console.error('Error assigning patient:', error);
    }
  };

  const handleCreateConsultation = async () => {
    if (!consultationForm.patientId || !consultationForm.reasonForConsultation) return;

    try {
      const patient = availablePatients.find(p => p._id === consultationForm.patientId);
      if (!patient) return;

      const consultation = {
        type: 'maternal-health-consultation' as const,
        consultingDoctorId: doctorId,
        consultingDoctorName: doctorName,
        maternalPatientId: consultationForm.patientId,
        patientName: `${patient.firstName} ${patient.lastName}`,
        gestationalAge: patient.gestationalAge,
        consultationType: consultationForm.consultationType,
        reasonForConsultation: consultationForm.reasonForConsultation,
        clinicalFindings: consultationForm.clinicalFindings,
        currentTreatment: consultationForm.currentTreatment,
        consultationDate: new Date().toISOString(),
        recommendations: [],
        treatmentPlan: '',
        followUpRequired: false,
        priority: consultationForm.priority,
        responseTimeRequired: consultationForm.priority === 'critical' ? 1 : 
                             consultationForm.priority === 'high' ? 2 : 
                             consultationForm.priority === 'medium' ? 8 : 24,
        status: 'requested' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await createMaternalHealthConsultation(consultation);
      await loadDashboardData();
      setConsultationForm({
        patientId: '',
        consultationType: 'routine',
        reasonForConsultation: '',
        clinicalFindings: '',
        currentTreatment: '',
        priority: 'medium'
      });
    } catch (error) {
      console.error('Error creating consultation:', error);
    }
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading maternal health dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Maternal Health Management</h1>
          <p className="text-gray-600">Comprehensive maternal care and monitoring</p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Assign Patient
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign Maternal Patient</DialogTitle>
                <DialogDescription>
                  Assign a maternal patient to your care
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="patient">Select Patient</Label>
                  <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {availablePatients.map((patient) => (
                        <SelectItem key={patient._id} value={patient._id}>
                          {patient.firstName} {patient.lastName} - {patient.gestationalAge} weeks
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="assignmentType">Assignment Type</Label>
                  <Select value={assignmentType} onValueChange={(value: any) => setAssignmentType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="primary">Primary Care</SelectItem>
                      <SelectItem value="secondary">Secondary Care</SelectItem>
                      <SelectItem value="emergency">Emergency Care</SelectItem>
                      <SelectItem value="consultation">Consultation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAssignPatient} className="w-full">
                  Assign Patient
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                Request Consultation
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Request Maternal Health Consultation</DialogTitle>
                <DialogDescription>
                  Request consultation from a maternal health specialist
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="consultationPatient">Patient</Label>
                  <Select value={consultationForm.patientId} onValueChange={(value) => 
                    setConsultationForm(prev => ({ ...prev, patientId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {availablePatients.map((patient) => (
                        <SelectItem key={patient._id} value={patient._id}>
                          {patient.firstName} {patient.lastName} - {patient.gestationalAge} weeks
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="consultationType">Consultation Type</Label>
                    <Select value={consultationForm.consultationType} onValueChange={(value: any) => 
                      setConsultationForm(prev => ({ ...prev, consultationType: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="routine">Routine</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                        <SelectItem value="second-opinion">Second Opinion</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={consultationForm.priority} onValueChange={(value: any) => 
                      setConsultationForm(prev => ({ ...prev, priority: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="reason">Reason for Consultation</Label>
                  <Textarea
                    value={consultationForm.reasonForConsultation}
                    onChange={(e) => setConsultationForm(prev => ({ ...prev, reasonForConsultation: e.target.value }))}
                    placeholder="Describe the reason for consultation..."
                  />
                </div>
                <div>
                  <Label htmlFor="findings">Clinical Findings</Label>
                  <Textarea
                    value={consultationForm.clinicalFindings}
                    onChange={(e) => setConsultationForm(prev => ({ ...prev, clinicalFindings: e.target.value }))}
                    placeholder="Current clinical findings..."
                  />
                </div>
                <div>
                  <Label htmlFor="treatment">Current Treatment</Label>
                  <Textarea
                    value={consultationForm.currentTreatment}
                    onChange={(e) => setConsultationForm(prev => ({ ...prev, currentTreatment: e.target.value }))}
                    placeholder="Current treatment plan..."
                  />
                </div>
                <Button onClick={handleCreateConsultation} className="w-full">
                  Request Consultation
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Dashboard Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.totalActivePatients || 0}</div>
            <p className="text-xs text-muted-foreground">Currently under care</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk Cases</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{dashboardData?.highRiskPatients || 0}</div>
            <p className="text-xs text-muted-foreground">Requiring close monitoring</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Consultations</CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{dashboardData?.pendingConsultations || 0}</div>
            <p className="text-xs text-muted-foreground">Awaiting response</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{dashboardData?.upcomingAppointments || 0}</div>
            <p className="text-xs text-muted-foreground">Next 24 hours</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {dashboardData?.alerts && dashboardData.alerts.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Bell className="h-5 w-5 text-red-500" />
            Active Alerts
          </h3>
          {dashboardData.alerts.map((alert, index) => (
            <Alert key={index} className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>
                {alert.type === 'high-risk-patient' ? 'High Risk Patient' : 'Upcoming Appointment'}
              </AlertTitle>
              <AlertDescription>{alert.message}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="patients" className="space-y-4">
        <TabsList>
          <TabsTrigger value="patients">My Patients</TabsTrigger>
          <TabsTrigger value="consultations">Consultations</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="patients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assigned Maternal Patients</CardTitle>
              <CardDescription>Patients currently under your maternal health care</CardDescription>
            </CardHeader>
            <CardContent>
              {dashboardData?.assignments && dashboardData.assignments.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.assignments.map((assignment) => (
                    <div key={assignment._id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{assignment.patientName}</h4>
                          <p className="text-sm text-gray-600">
                            {assignment.gestationalAgeAtAssignment} weeks gestation • {assignment.assignmentType} care
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getRiskLevelColor(assignment.riskLevel)}>
                            {assignment.riskLevel} risk
                          </Badge>
                          <Badge variant="outline">{assignment.status}</Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p><strong>Next Appointment:</strong> {new Date(assignment.carePlan.nextAppointment).toLocaleDateString()}</p>
                          <p><strong>Visit Frequency:</strong> {assignment.carePlan.visitFrequency}</p>
                        </div>
                        <div>
                          <p><strong>Special Care:</strong> {assignment.specialCareRequired.join(', ') || 'None'}</p>
                          <p><strong>Assigned:</strong> {new Date(assignment.assignmentDate).toLocaleDateString()}</p>
                        </div>
                      </div>

                      {assignment.carePlan.specialInstructions.length > 0 && (
                        <div>
                          <p className="text-sm font-medium">Special Instructions:</p>
                          <ul className="text-sm text-gray-600 list-disc list-inside">
                            {assignment.carePlan.specialInstructions.map((instruction, idx) => (
                              <li key={idx}>{instruction}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        <Button size="sm" variant="outline">
                          <FileText className="h-4 w-4 mr-1" />
                          Care Plan
                        </Button>
                        <Button size="sm" variant="outline">
                          <Phone className="h-4 w-4 mr-1" />
                          Contact
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Baby className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No patients currently assigned</p>
                  <p className="text-sm">Use the "Assign Patient" button to add patients to your care</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consultations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Consultations</CardTitle>
              <CardDescription>Maternal health consultations and referrals</CardDescription>
            </CardHeader>
            <CardContent>
              {dashboardData?.consultations && dashboardData.consultations.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.consultations.map((consultation) => (
                    <div key={consultation._id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{consultation.patientName}</h4>
                          <p className="text-sm text-gray-600">
                            {consultation.gestationalAge} weeks • {consultation.consultationType}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getPriorityColor(consultation.priority)}`}></div>
                          <Badge variant="outline">{consultation.status}</Badge>
                        </div>
                      </div>
                      
                      <div className="text-sm">
                        <p><strong>Reason:</strong> {consultation.reasonForConsultation}</p>
                        {consultation.clinicalFindings && (
                          <p><strong>Findings:</strong> {consultation.clinicalFindings}</p>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Requested: {new Date(consultation.createdAt).toLocaleDateString()}</span>
                        <span>Response time: {consultation.responseTimeRequired}h required</span>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        {consultation.status === 'requested' && (
                          <Button size="sm">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Respond
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No recent consultations</p>
                  <p className="text-sm">Consultation requests will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cases This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{dashboardData?.performance?.totalCasesHandled || 0}</div>
                <p className="text-sm text-gray-600">Total cases handled</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {dashboardData?.performance?.patientSatisfactionScore || 0}%
                </div>
                <p className="text-sm text-gray-600">Patient satisfaction</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {dashboardData?.performance?.averageResponseTime || 0}min
                </div>
                <p className="text-sm text-gray-600">Average response</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Your maternal health care performance overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">{dashboardData?.performance?.successfulDeliveries || 0}</div>
                    <div className="text-sm text-gray-600">Successful Deliveries</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{dashboardData?.performance?.highRiskCases || 0}</div>
                    <div className="text-sm text-gray-600">High Risk Cases</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{dashboardData?.performance?.emergencyCases || 0}</div>
                    <div className="text-sm text-gray-600">Emergency Cases</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{dashboardData?.performance?.complicationRate || 0}%</div>
                    <div className="text-sm text-gray-600">Complication Rate</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DoctorMaternalHealth; 