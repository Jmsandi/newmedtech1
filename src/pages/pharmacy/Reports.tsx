import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Download, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  FileText,
  DollarSign,
  Package,
  Users,
  Activity,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface ReportData {
  id: string;
  title: string;
  type: 'Financial' | 'Inventory' | 'Clinical' | 'Compliance' | 'Patient';
  description: string;
  lastGenerated: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly';
  status: 'Ready' | 'Generating' | 'Error';
  size: string;
}

interface MetricCard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
  color: string;
}

const mockReports: ReportData[] = [
  {
    id: 'RPT-001',
    title: 'Monthly Prescription Revenue',
    type: 'Financial',
    description: 'Comprehensive revenue analysis including prescription sales, insurance reimbursements, and profit margins',
    lastGenerated: '2024-01-31',
    frequency: 'Monthly',
    status: 'Ready',
    size: '2.4 MB'
  },
  {
    id: 'RPT-002',
    title: 'Inventory Turnover Analysis',
    type: 'Inventory',
    description: 'Analysis of medication inventory turnover rates, slow-moving items, and stock optimization recommendations',
    lastGenerated: '2024-02-01',
    frequency: 'Weekly',
    status: 'Ready',
    size: '1.8 MB'
  },
  {
    id: 'RPT-003',
    title: 'Patient Adherence Report',
    type: 'Clinical',
    description: 'Patient medication adherence rates, therapy outcomes, and intervention recommendations',
    lastGenerated: '2024-01-30',
    frequency: 'Monthly',
    status: 'Ready',
    size: '3.1 MB'
  },
  {
    id: 'RPT-004',
    title: 'Regulatory Compliance Audit',
    type: 'Compliance',
    description: 'DEA compliance, controlled substance tracking, and regulatory requirement adherence',
    lastGenerated: '2024-01-29',
    frequency: 'Quarterly',
    status: 'Generating',
    size: '4.2 MB'
  },
  {
    id: 'RPT-005',
    title: 'Patient Demographics Analysis',
    type: 'Patient',
    description: 'Patient population analysis, medication usage patterns, and demographic trends',
    lastGenerated: '2024-01-28',
    frequency: 'Monthly',
    status: 'Ready',
    size: '1.9 MB'
  },
  {
    id: 'RPT-006',
    title: 'Drug Interaction Alerts',
    type: 'Clinical',
    description: 'Analysis of drug interaction alerts, clinical interventions, and patient safety metrics',
    lastGenerated: '2024-02-01',
    frequency: 'Weekly',
    status: 'Error',
    size: '0.8 MB'
  }
];

const mockMetrics: MetricCard[] = [
  {
    title: 'Total Revenue',
    value: '$284,750',
    change: '+12.5%',
    trend: 'up',
    icon: <DollarSign className="h-4 w-4" />,
    color: 'text-green-600'
  },
  {
    title: 'Prescriptions Filled',
    value: '2,847',
    change: '+8.3%',
    trend: 'up',
    icon: <FileText className="h-4 w-4" />,
    color: 'text-blue-600'
  },
  {
    title: 'Inventory Value',
    value: '$156,890',
    change: '-2.1%',
    trend: 'down',
    icon: <Package className="h-4 w-4" />,
    color: 'text-orange-600'
  },
  {
    title: 'Active Patients',
    value: '1,234',
    change: '+5.7%',
    trend: 'up',
    icon: <Users className="h-4 w-4" />,
    color: 'text-purple-600'
  },
  {
    title: 'Adherence Rate',
    value: '87.2%',
    change: '+3.1%',
    trend: 'up',
    icon: <Activity className="h-4 w-4" />,
    color: 'text-green-600'
  },
  {
    title: 'Safety Alerts',
    value: '23',
    change: '-15.2%',
    trend: 'down',
    icon: <AlertTriangle className="h-4 w-4" />,
    color: 'text-red-600'
  }
];

const Reports: React.FC = () => {
  const [reports, setReports] = useState<ReportData[]>(mockReports);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || report.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Ready':
        return <CheckCircle className="h-4 w-4" />;
      case 'Generating':
        return <Activity className="h-4 w-4" />;
      case 'Error':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ready':
        return 'bg-green-100 text-green-800';
      case 'Generating':
        return 'bg-blue-100 text-blue-800';
      case 'Error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Financial':
        return 'bg-green-100 text-green-800';
      case 'Inventory':
        return 'bg-blue-100 text-blue-800';
      case 'Clinical':
        return 'bg-purple-100 text-purple-800';
      case 'Compliance':
        return 'bg-orange-100 text-orange-800';
      case 'Patient':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4" />;
      case 'down':
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              Create Custom Report
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Custom Report</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="reportTitle">Report Title</Label>
                <Input placeholder="Enter report title" />
              </div>
              <div>
                <Label htmlFor="reportType">Report Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="financial">Financial</SelectItem>
                    <SelectItem value="inventory">Inventory</SelectItem>
                    <SelectItem value="clinical">Clinical</SelectItem>
                    <SelectItem value="compliance">Compliance</SelectItem>
                    <SelectItem value="patient">Patient</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="dateRange">Date Range</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last7">Last 7 days</SelectItem>
                    <SelectItem value="last30">Last 30 days</SelectItem>
                    <SelectItem value="last90">Last 90 days</SelectItem>
                    <SelectItem value="custom">Custom range</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="frequency">Frequency</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label htmlFor="metrics">Metrics to Include</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Revenue Analysis</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Prescription Volume</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Patient Demographics</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Inventory Turnover</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(false)}>
                Generate Report
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockMetrics.map((metric, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                  <div className={metric.color}>
                    {metric.icon}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    {getTrendIcon(metric.trend)}
                    <span className={`ml-1 ${metric.trend === 'up' ? 'text-green-600' : metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                      {metric.change} from last month
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Monthly Revenue Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                  <div className="text-center text-gray-500">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                    <p>Revenue chart would be displayed here</p>
                    <p className="text-sm">Integration with charting library needed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Prescription Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                  <div className="text-center text-gray-500">
                    <PieChart className="h-12 w-12 mx-auto mb-2" />
                    <p>Category distribution chart would be displayed here</p>
                    <p className="text-sm">Integration with charting library needed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          {/* Search and Filter */}
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Financial">Financial</SelectItem>
                <SelectItem value="Inventory">Inventory</SelectItem>
                <SelectItem value="Clinical">Clinical</SelectItem>
                <SelectItem value="Compliance">Compliance</SelectItem>
                <SelectItem value="Patient">Patient</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reports Table */}
          <Card>
            <CardHeader>
              <CardTitle>Available Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Report</th>
                      <th className="text-left p-2">Type</th>
                      <th className="text-left p-2">Last Generated</th>
                      <th className="text-left p-2">Frequency</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Size</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReports.map((report) => (
                      <tr key={report.id} className="border-b hover:bg-gray-50">
                        <td className="p-2">
                          <div>
                            <div className="font-medium">{report.title}</div>
                            <div className="text-sm text-gray-500">{report.description}</div>
                          </div>
                        </td>
                        <td className="p-2">
                          <Badge className={getTypeColor(report.type)}>
                            {report.type}
                          </Badge>
                        </td>
                        <td className="p-2">{new Date(report.lastGenerated).toLocaleDateString()}</td>
                        <td className="p-2">{report.frequency}</td>
                        <td className="p-2">
                          <Badge className={`${getStatusColor(report.status)} flex items-center gap-1 w-fit`}>
                            {getStatusIcon(report.status)}
                            {report.status}
                          </Badge>
                        </td>
                        <td className="p-2">{report.size}</td>
                        <td className="p-2">
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" disabled={report.status !== 'Ready'}>
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Calendar className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Prescribed Medications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Lisinopril 10mg', count: 245, percentage: 18.5 },
                    { name: 'Metformin 500mg', count: 198, percentage: 15.2 },
                    { name: 'Amlodipine 5mg', count: 167, percentage: 12.8 },
                    { name: 'Atorvastatin 20mg', count: 134, percentage: 10.3 },
                    { name: 'Omeprazole 20mg', count: 112, percentage: 8.6 }
                  ].map((med, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium">{med.name}</div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${med.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="ml-4 text-right">
                        <div className="font-medium">{med.count}</div>
                        <div className="text-sm text-gray-500">{med.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Patient Age Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { range: '65+ years', count: 456, percentage: 37.0 },
                    { range: '45-64 years', count: 389, percentage: 31.5 },
                    { range: '25-44 years', count: 267, percentage: 21.6 },
                    { range: '18-24 years', count: 89, percentage: 7.2 },
                    { range: 'Under 18', count: 33, percentage: 2.7 }
                  ].map((age, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium">{age.range}</div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className="bg-purple-600 h-2 rounded-full"
                            style={{ width: `${age.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="ml-4 text-right">
                        <div className="font-medium">{age.count}</div>
                        <div className="text-sm text-gray-500">{age.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports; 