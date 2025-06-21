import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Bell, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  Clock,
  User,
  Calendar,
  FileText,
  Settings,
  Filter,
  Mail,
  Trash2,
  Archive
} from "lucide-react";

interface Notification {
  id: string;
  type: "alert" | "message" | "appointment" | "system" | "reminder";
  priority: "high" | "medium" | "low";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  archived: boolean;
  sender?: string;
  category: string;
  actionRequired?: boolean;
  relatedData?: {
    patientId?: string;
    appointmentId?: string;
    documentId?: string;
  };
}

const mockNotifications: Notification[] = [
  {
    id: "N001",
    type: "alert",
    priority: "high",
    title: "Patient Check-in Alert",
    message: "Sarah Johnson has arrived early for her 9:00 AM appointment with Dr. Smith",
    timestamp: "2024-01-15T08:45:00",
    read: false,
    archived: false,
    sender: "Check-in System",
    category: "Patient Management",
    actionRequired: true,
    relatedData: { patientId: "PT001", appointmentId: "APT001" }
  },
  {
    id: "N002",
    type: "reminder",
    priority: "medium",
    title: "Insurance Verification Needed",
    message: "Michael Chen's insurance needs verification before tomorrow's appointment",
    timestamp: "2024-01-15T08:30:00",
    read: false,
    archived: false,
    sender: "Billing System",
    category: "Insurance",
    actionRequired: true,
    relatedData: { patientId: "PT002" }
  },
  {
    id: "N003",
    type: "message",
    priority: "medium",
    title: "Schedule Change Request",
    message: "Dr. Smith has requested to move his 2:00 PM appointment to 2:30 PM",
    timestamp: "2024-01-15T08:15:00",
    read: true,
    archived: false,
    sender: "Dr. Smith",
    category: "Scheduling",
    actionRequired: true,
    relatedData: { appointmentId: "APT002" }
  },
  {
    id: "N004",
    type: "appointment",
    priority: "low",
    title: "Appointment Confirmation",
    message: "Emma Davis has confirmed her appointment for tomorrow at 10:00 AM",
    timestamp: "2024-01-15T07:45:00",
    read: true,
    archived: false,
    sender: "Online Portal",
    category: "Scheduling",
    actionRequired: false,
    relatedData: { patientId: "PT003", appointmentId: "APT003" }
  },
  {
    id: "N005",
    type: "system",
    priority: "low",
    title: "System Maintenance Complete",
    message: "Scheduled maintenance of the appointment system has been completed successfully",
    timestamp: "2024-01-15T06:00:00",
    read: true,
    archived: false,
    sender: "IT Department",
    category: "System",
    actionRequired: false
  },
  {
    id: "N006",
    type: "alert",
    priority: "high",
    title: "Emergency Contact Update",
    message: "Robert Johnson's emergency contact information needs to be updated",
    timestamp: "2024-01-14T16:30:00",
    read: false,
    archived: false,
    sender: "Patient Records",
    category: "Patient Management",
    actionRequired: true,
    relatedData: { patientId: "PT004" }
  }
];

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "alert":
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case "message":
        return <FileText className="w-5 h-5 text-blue-600" />;
      case "appointment":
        return <Calendar className="w-5 h-5 text-green-600" />;
      case "system":
        return <Settings className="w-5 h-5 text-gray-600" />;
      case "reminder":
        return <Clock className="w-5 h-5 text-orange-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "alert":
        return "bg-red-50 text-red-700";
      case "message":
        return "bg-blue-50 text-blue-700";
      case "appointment":
        return "bg-green-50 text-green-700";
      case "system":
        return "bg-gray-50 text-gray-700";
      case "reminder":
        return "bg-orange-50 text-orange-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    switch (activeTab) {
      case "unread":
        return !notification.read;
      case "important":
        return notification.priority === "high" || notification.actionRequired;
      case "archived":
        return notification.archived;
      case "all":
      default:
        return !notification.archived;
    }
  });

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const handleMarkAsUnread = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: false } : n)
    );
  };

  const handleArchive = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, archived: true } : n)
    );
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const handleViewDetails = (notification: Notification) => {
    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }
    console.log("Viewing notification details:", notification);
  };

  const unreadCount = notifications.filter(n => !n.read && !n.archived).length;
  const importantCount = notifications.filter(n => 
    (n.priority === "high" || n.actionRequired) && !n.archived
  ).length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">Stay updated with important alerts and messages</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button onClick={handleMarkAllAsRead}>
            <CheckCircle className="w-4 h-4 mr-2" />
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Notification Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Unread</p>
                <h3 className="text-2xl font-bold text-blue-600">{unreadCount}</h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Bell className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Important</p>
                <h3 className="text-2xl font-bold text-red-600">{importantCount}</h3>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Action Required</p>
                <h3 className="text-2xl font-bold text-orange-600">
                  {notifications.filter(n => n.actionRequired && !n.archived).length}
                </h3>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Today</p>
                <h3 className="text-2xl font-bold text-green-600">
                  {notifications.filter(n => !n.archived).length}
                </h3>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Notifications</TabsTrigger>
          <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
          <TabsTrigger value="important">Important ({importantCount})</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <CardContent className="p-0">
              {filteredNotifications.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-6 hover:bg-gray-50 transition-colors cursor-pointer ${
                        !notification.read ? "bg-blue-50/30" : ""
                      }`}
                      onClick={() => handleViewDetails(notification)}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 mt-1">
                          {getTypeIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className={`text-lg font-semibold ${
                                  !notification.read ? "text-gray-900" : "text-gray-700"
                                }`}>
                                  {notification.title}
                                </h3>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                )}
                                {notification.actionRequired && (
                                  <Badge className="bg-orange-100 text-orange-800 text-xs">
                                    Action Required
                                  </Badge>
                                )}
                              </div>
                              <p className={`text-sm mb-2 ${
                                !notification.read ? "text-gray-900" : "text-gray-600"
                              }`}>
                                {notification.message}
                              </p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>From: {notification.sender}</span>
                                <span>•</span>
                                <span>Category: {notification.category}</span>
                                <span>•</span>
                                <span>{new Date(notification.timestamp).toLocaleString()}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3 ml-4">
                              <Badge className={getPriorityColor(notification.priority)}>
                                {notification.priority}
                              </Badge>
                              <Badge className={getTypeColor(notification.type)}>
                                {notification.type}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-end space-x-2 mt-4 pt-4 border-t border-gray-100">
                        {!notification.read ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsRead(notification.id);
                            }}
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Mark Read
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsUnread(notification.id);
                            }}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Mail className="w-3 h-3 mr-1" />
                            Mark Unread
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleArchive(notification.id);
                          }}
                        >
                          <Archive className="w-3 h-3 mr-1" />
                          Archive
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(notification.id);
                          }}
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {activeTab === "unread" && "No unread notifications"}
                    {activeTab === "important" && "No important notifications"}
                    {activeTab === "archived" && "No archived notifications"}
                    {activeTab === "all" && "No notifications"}
                  </h3>
                  <p className="text-gray-600">
                    {activeTab === "unread" && "All your notifications have been read."}
                    {activeTab === "important" && "No high priority or action-required notifications."}
                    {activeTab === "archived" && "No notifications have been archived yet."}
                    {activeTab === "all" && "You're all caught up! No notifications to display."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Email Notifications</h4>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Patient check-in alerts</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Appointment changes</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Insurance verification reminders</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">System maintenance notices</span>
                </label>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Browser Notifications</h4>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Emergency alerts</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">High priority messages</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">All new notifications</span>
                </label>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200">
            <Button>
              <Settings className="w-4 h-4 mr-2" />
              Save Preferences
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 