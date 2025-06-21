import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Plus, 
  Eye, 
  Reply, 
  Forward, 
  Archive,
  Star,
  Clock,
  AlertTriangle,
  CheckCircle,
  User,
  UserCheck,
  Building,
  Stethoscope,
  MessageSquare,
  Send
} from 'lucide-react';

interface Message {
  id: string;
  subject: string;
  sender: string;
  senderType: 'Patient' | 'Doctor' | 'Insurance' | 'Staff' | 'Supplier';
  recipient: string;
  content: string;
  timestamp: string;
  status: 'Unread' | 'Read' | 'Replied' | 'Archived';
  priority: 'High' | 'Medium' | 'Low';
  category: 'Prescription' | 'Insurance' | 'Refill' | 'Question' | 'Complaint' | 'Order' | 'Clinical';
  attachments?: string[];
  isStarred: boolean;
}

const mockMessages: Message[] = [
  {
    id: 'MSG-001',
    subject: 'Prescription Refill Request - Metformin',
    sender: 'Sarah Johnson',
    senderType: 'Patient',
    recipient: 'Pharmacy Team',
    content: 'Hello, I need to refill my Metformin 500mg prescription. My prescription number is RX-12345. I have 2 refills remaining according to my bottle. Please let me know when it will be ready for pickup.',
    timestamp: '2024-02-01T10:30:00Z',
    status: 'Unread',
    priority: 'Medium',
    category: 'Refill',
    isStarred: false
  },
  {
    id: 'MSG-002',
    subject: 'Prior Authorization Required - Adalimumab',
    sender: 'Blue Cross Insurance',
    senderType: 'Insurance',
    recipient: 'Dr. Emily Chen',
    content: 'Prior authorization is required for patient Jennifer Lee (Member ID: BC123456) for Adalimumab injection. Please submit clinical documentation including diagnosis, previous treatments tried, and medical necessity within 5 business days.',
    timestamp: '2024-02-01T09:15:00Z',
    status: 'Read',
    priority: 'High',
    category: 'Insurance',
    attachments: ['PA_Form_Adalimumab.pdf'],
    isStarred: true
  },
  {
    id: 'MSG-003',
    subject: 'Drug Interaction Alert - Patient Michael Brown',
    sender: 'Clinical System',
    senderType: 'Staff',
    recipient: 'Dr. James Wilson',
    content: 'ALERT: Potential drug interaction detected for patient Michael Brown. New prescription for Warfarin may interact with existing Aspirin therapy. Please review and confirm dosing adjustments or alternative therapy.',
    timestamp: '2024-02-01T08:45:00Z',
    status: 'Replied',
    priority: 'High',
    category: 'Clinical',
    isStarred: true
  },
  {
    id: 'MSG-004',
    subject: 'Medication Consultation Request',
    sender: 'Dr. Robert Martinez',
    senderType: 'Doctor',
    recipient: 'Dr. Emily Chen',
    content: 'I have a patient with complex diabetes management. Could we schedule a consultation to discuss optimal insulin regimen? Patient has been struggling with glucose control despite current therapy.',
    timestamp: '2024-01-31T16:20:00Z',
    status: 'Read',
    priority: 'Medium',
    category: 'Clinical',
    isStarred: false
  },
  {
    id: 'MSG-005',
    subject: 'Inventory Order Confirmation',
    sender: 'MedSupply Corp',
    senderType: 'Supplier',
    recipient: 'Pharmacy Manager',
    content: 'Your order #ORD-2024-0156 has been confirmed and will ship on February 2nd. Expected delivery is February 4th. Order includes: Lisinopril 10mg (500 tablets), Metformin 500mg (1000 tablets), Amlodipine 5mg (300 tablets).',
    timestamp: '2024-01-31T14:10:00Z',
    status: 'Read',
    priority: 'Low',
    category: 'Order',
    isStarred: false
  },
  {
    id: 'MSG-006',
    subject: 'Complaint - Long Wait Time',
    sender: 'Lisa Davis',
    senderType: 'Patient',
    recipient: 'Pharmacy Manager',
    content: 'I waited over 45 minutes to pick up my prescription today. This is unacceptable and I expect better service. Please address this issue and let me know what steps you are taking to improve wait times.',
    timestamp: '2024-01-31T13:30:00Z',
    status: 'Unread',
    priority: 'High',
    category: 'Complaint',
    isStarred: false
  }
];

const Messages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isComposeDialogOpen, setIsComposeDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('inbox');

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || message.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || message.status === selectedStatus;
    
    if (activeTab === 'starred') {
      return matchesSearch && matchesCategory && matchesStatus && message.isStarred;
    }
    if (activeTab === 'archived') {
      return matchesSearch && matchesCategory && matchesStatus && message.status === 'Archived';
    }
    return matchesSearch && matchesCategory && matchesStatus && message.status !== 'Archived';
  });

  const getSenderIcon = (senderType: string) => {
    switch (senderType) {
      case 'Patient':
        return <User className="h-4 w-4" />;
      case 'Doctor':
        return <Stethoscope className="h-4 w-4" />;
      case 'Insurance':
        return <Building className="h-4 w-4" />;
      case 'Staff':
        return <UserCheck className="h-4 w-4" />;
      case 'Supplier':
        return <Building className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Unread':
        return <MessageSquare className="h-4 w-4" />;
      case 'Read':
        return <Eye className="h-4 w-4" />;
      case 'Replied':
        return <Reply className="h-4 w-4" />;
      case 'Archived':
        return <Archive className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Unread':
        return 'bg-blue-100 text-blue-800';
      case 'Read':
        return 'bg-gray-100 text-gray-800';
      case 'Replied':
        return 'bg-green-100 text-green-800';
      case 'Archived':
        return 'bg-yellow-100 text-yellow-800';
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Prescription':
        return 'bg-blue-100 text-blue-800';
      case 'Insurance':
        return 'bg-purple-100 text-purple-800';
      case 'Refill':
        return 'bg-green-100 text-green-800';
      case 'Question':
        return 'bg-orange-100 text-orange-800';
      case 'Complaint':
        return 'bg-red-100 text-red-800';
      case 'Order':
        return 'bg-indigo-100 text-indigo-800';
      case 'Clinical':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleStar = (messageId: string) => {
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, isStarred: !msg.isStarred } : msg
    ));
  };

  const markAsRead = (messageId: string) => {
    setMessages(messages.map(msg => 
      msg.id === messageId && msg.status === 'Unread' ? { ...msg, status: 'Read' } : msg
    ));
  };

  const unreadCount = messages.filter(m => m.status === 'Unread').length;
  const starredCount = messages.filter(m => m.isStarred).length;
  const archivedCount = messages.filter(m => m.status === 'Archived').length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Messages</h1>
        <Dialog open={isComposeDialogOpen} onOpenChange={setIsComposeDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Compose Message
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Compose New Message</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="recipient">Recipient</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipient" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="patient1">Sarah Johnson (Patient)</SelectItem>
                      <SelectItem value="doctor1">Dr. Robert Martinez</SelectItem>
                      <SelectItem value="insurance1">Blue Cross Insurance</SelectItem>
                      <SelectItem value="staff1">Pharmacy Team</SelectItem>
                    </SelectContent>
                  </Select>
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
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prescription">Prescription</SelectItem>
                    <SelectItem value="insurance">Insurance</SelectItem>
                    <SelectItem value="refill">Refill</SelectItem>
                    <SelectItem value="question">Question</SelectItem>
                    <SelectItem value="clinical">Clinical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input placeholder="Enter message subject" />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea placeholder="Enter your message" rows={6} />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setIsComposeDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsComposeDialogOpen(false)}>
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{messages.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Starred</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{starredCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Archived</CardTitle>
            <Archive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{archivedCount}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="inbox">
            Inbox {unreadCount > 0 && <Badge className="ml-2 bg-red-500">{unreadCount}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="starred">
            Starred {starredCount > 0 && <Badge className="ml-2">{starredCount}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="archived">
            Archived {archivedCount > 0 && <Badge className="ml-2">{archivedCount}</Badge>}
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {/* Search and Filters */}
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Prescription">Prescription</SelectItem>
                <SelectItem value="Insurance">Insurance</SelectItem>
                <SelectItem value="Refill">Refill</SelectItem>
                <SelectItem value="Question">Question</SelectItem>
                <SelectItem value="Complaint">Complaint</SelectItem>
                <SelectItem value="Order">Order</SelectItem>
                <SelectItem value="Clinical">Clinical</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Unread">Unread</SelectItem>
                <SelectItem value="Read">Read</SelectItem>
                <SelectItem value="Replied">Replied</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Messages Table */}
          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">From</th>
                      <th className="text-left p-2">Subject</th>
                      <th className="text-left p-2">Category</th>
                      <th className="text-left p-2">Priority</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Time</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMessages.map((message) => (
                      <tr 
                        key={message.id} 
                        className={`border-b hover:bg-gray-50 ${message.status === 'Unread' ? 'bg-blue-50' : ''}`}
                      >
                        <td className="p-2">
                          <div className="flex items-center space-x-2">
                            {getSenderIcon(message.senderType)}
                            <div>
                              <div className={`font-medium ${message.status === 'Unread' ? 'font-bold' : ''}`}>
                                {message.sender}
                              </div>
                              <div className="text-sm text-gray-500">{message.senderType}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-2">
                          <div className={`${message.status === 'Unread' ? 'font-bold' : ''}`}>
                            {message.subject}
                          </div>
                          {message.attachments && (
                            <div className="text-xs text-gray-500 mt-1">
                              📎 {message.attachments.length} attachment(s)
                            </div>
                          )}
                        </td>
                        <td className="p-2">
                          <Badge className={getCategoryColor(message.category)}>
                            {message.category}
                          </Badge>
                        </td>
                        <td className="p-2">
                          <Badge className={getPriorityColor(message.priority)}>
                            {message.priority}
                          </Badge>
                        </td>
                        <td className="p-2">
                          <Badge className={`${getStatusColor(message.status)} flex items-center gap-1 w-fit`}>
                            {getStatusIcon(message.status)}
                            {message.status}
                          </Badge>
                        </td>
                        <td className="p-2">
                          <div className="text-sm">
                            {new Date(message.timestamp).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="p-2">
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleStar(message.id)}
                              className={message.isStarred ? 'text-yellow-500' : ''}
                            >
                              <Star className={`h-4 w-4 ${message.isStarred ? 'fill-current' : ''}`} />
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedMessage(message);
                                    markAsRead(message.id);
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl">
                                <DialogHeader>
                                  <DialogTitle>{message.subject}</DialogTitle>
                                </DialogHeader>
                                {selectedMessage && (
                                  <div className="space-y-4">
                                    <div className="flex items-center justify-between border-b pb-4">
                                      <div className="flex items-center space-x-4">
                                        <div className="flex items-center space-x-2">
                                          {getSenderIcon(selectedMessage.senderType)}
                                          <div>
                                            <div className="font-medium">{selectedMessage.sender}</div>
                                            <div className="text-sm text-gray-500">{selectedMessage.senderType}</div>
                                          </div>
                                        </div>
                                        <div className="text-sm text-gray-500">
                                          to {selectedMessage.recipient}
                                        </div>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <Badge className={getCategoryColor(selectedMessage.category)}>
                                          {selectedMessage.category}
                                        </Badge>
                                        <Badge className={getPriorityColor(selectedMessage.priority)}>
                                          {selectedMessage.priority}
                                        </Badge>
                                        <div className="text-sm text-gray-500">
                                          {new Date(selectedMessage.timestamp).toLocaleString()}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="prose max-w-none">
                                      <p className="whitespace-pre-wrap">{selectedMessage.content}</p>
                                    </div>
                                    {selectedMessage.attachments && (
                                      <div>
                                        <h4 className="font-medium mb-2">Attachments:</h4>
                                        <div className="space-y-1">
                                          {selectedMessage.attachments.map((attachment, index) => (
                                            <div key={index} className="flex items-center space-x-2 text-sm">
                                              <span>📎</span>
                                              <span>{attachment}</span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                    <div className="flex space-x-2 pt-4 border-t">
                                      <Button>
                                        <Reply className="h-4 w-4 mr-2" />
                                        Reply
                                      </Button>
                                      <Button variant="outline">
                                        <Forward className="h-4 w-4 mr-2" />
                                        Forward
                                      </Button>
                                      <Button variant="outline">
                                        <Archive className="h-4 w-4 mr-2" />
                                        Archive
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
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
      </Tabs>
    </div>
  );
};

export default Messages; 