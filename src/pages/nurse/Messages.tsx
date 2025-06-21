import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Send, Phone, Video, Search, Plus, Clock, CheckCircle, AlertTriangle, Users } from "lucide-react";

const Messages: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("conversations");
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [newMessage, setNewMessage] = useState("");

  const conversations = [
    {
      id: "C001",
      type: "direct",
      participant: {
        name: "Dr. Smith",
        role: "Physician",
        avatar: "/avatars/dr-smith.jpg",
        status: "online",
        department: "Cardiology"
      },
      lastMessage: "Patient in Room 101 needs immediate attention for BP monitoring",
      timestamp: "2024-01-15 15:45",
      unread: 2,
      priority: "high",
      subject: "Patient Alert - Room 101"
    },
    {
      id: "C002",
      type: "direct",
      participant: {
        name: "Nurse Amy",
        role: "Registered Nurse",
        avatar: "/avatars/nurse-amy.jpg",
        status: "busy",
        department: "ICU"
      },
      lastMessage: "Can you cover my patient in 205 during lunch break?",
      timestamp: "2024-01-15 14:30",
      unread: 0,
      priority: "normal",
      subject: "Shift Coverage Request"
    },
    {
      id: "C003",
      type: "group",
      participant: {
        name: "Floor 2 Nursing Team",
        role: "Nursing Team",
        avatar: "/avatars/team.jpg",
        status: "group",
        department: "Medical Floor 2",
        memberCount: 8
      },
      lastMessage: "Jennifer: Medication cart restocking completed",
      timestamp: "2024-01-15 13:15",
      unread: 1,
      priority: "normal",
      subject: "Daily Updates"
    },
    {
      id: "C004",
      type: "direct",
      participant: {
        name: "Dr. Johnson",
        role: "Emergency Medicine",
        avatar: "/avatars/dr-johnson.jpg",
        status: "away",
        department: "Emergency Department"
      },
      lastMessage: "Lab results for patient Garcia are critical - glucose 285",
      timestamp: "2024-01-15 10:20",
      unread: 0,
      priority: "critical",
      subject: "CRITICAL: Lab Results Alert"
    },
    {
      id: "C005",
      type: "direct",
      participant: {
        name: "Nurse Manager",
        role: "Nurse Manager",
        avatar: "/avatars/manager.jpg",
        status: "online",
        department: "Administration"
      },
      lastMessage: "Schedule change approved for next week",
      timestamp: "2024-01-15 09:00",
      unread: 0,
      priority: "normal",
      subject: "Schedule Update"
    }
  ];

  const messages = [
    {
      id: "M001",
      conversationId: "C001",
      sender: "Dr. Smith",
      content: "Patient in Room 101 needs immediate attention for BP monitoring",
      timestamp: "2024-01-15 15:45",
      type: "text",
      priority: "high"
    },
    {
      id: "M002",
      conversationId: "C001",
      sender: "Me",
      content: "On my way to Room 101 now. Will monitor and update you in 15 minutes.",
      timestamp: "2024-01-15 15:46",
      type: "text"
    },
    {
      id: "M003",
      conversationId: "C001",
      sender: "Dr. Smith",
      content: "Thank you. Please also check if patient has taken morning medications.",
      timestamp: "2024-01-15 15:47",
      type: "text"
    }
  ];

  const announcements = [
    {
      id: "A001",
      title: "Mandatory Safety Training",
      content: "All nursing staff must complete fire safety training by end of week. Register in portal.",
      author: "Safety Department",
      timestamp: "2024-01-15 08:00",
      priority: "high",
      category: "Training"
    },
    {
      id: "A002",
      title: "New Protocol: Medication Administration",
      content: "Updated MAR procedures effective immediately. See attached guidelines.",
      author: "Pharmacy Department",
      timestamp: "2024-01-14 16:00",
      priority: "critical",
      category: "Protocol"
    },
    {
      id: "A003",
      title: "Equipment Maintenance",
      content: "Vital signs monitors on Floor 2 will be serviced tomorrow 6-8 AM.",
      author: "Biomedical Engineering",
      timestamp: "2024-01-14 14:00",
      priority: "normal",
      category: "Maintenance"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-400";
      case "busy":
        return "bg-red-400";
      case "away":
        return "bg-yellow-400";
      default:
        return "bg-gray-400";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "normal":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "high":
        return <Clock className="h-4 w-4 text-orange-600" />;
      default:
        return null;
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    console.log("Sending message:", newMessage, "to:", selectedConversation.participant.name);
    setNewMessage("");
  };

  const handleSelectConversation = (conversation: any) => {
    setSelectedConversation(conversation);
  };

  const handleCall = (participant: any) => {
    console.log("Calling:", participant.name);
  };

  const handleVideoCall = (participant: any) => {
    console.log("Starting video call with:", participant.name);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1e293b]">Messages</h1>
          <p className="text-gray-600">Communicate with healthcare team members</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Users className="mr-2 h-4 w-4" />
            Directory
          </Button>
          <Button className="bg-[#3498db] hover:bg-[#2980b9]">
            <Plus className="mr-2 h-4 w-4" />
            New Message
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Unread Messages</p>
                <h3 className="text-2xl font-bold text-[#3498db]">
                  {conversations.reduce((acc, conv) => acc + conv.unread, 0)}
                </h3>
              </div>
              <div className="bg-[#3498db]/10 p-3 rounded-full">
                <MessageSquare className="h-6 w-6 text-[#3498db]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">High Priority</p>
                <h3 className="text-2xl font-bold text-orange-600">
                  {conversations.filter(c => c.priority === "high" || c.priority === "critical").length}
                </h3>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Conversations</p>
                <h3 className="text-2xl font-bold text-green-600">{conversations.length}</h3>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Online Contacts</p>
                <h3 className="text-2xl font-bold text-green-600">
                  {conversations.filter(c => c.participant.status === "online").length}
                </h3>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="conversations">Conversations</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="directory">Team Directory</TabsTrigger>
        </TabsList>

        <TabsContent value="conversations" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Conversations List */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Conversations</CardTitle>
                  <CardDescription>Recent messages and active chats</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search conversations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>

                  <div className="space-y-2">
                    {filteredConversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedConversation?.id === conversation.id
                            ? "border-[#3498db] bg-[#3498db]/5"
                            : "hover:bg-gray-50"
                        }`}
                        onClick={() => handleSelectConversation(conversation)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={conversation.participant.avatar} />
                              <AvatarFallback>
                                {conversation.participant.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            {conversation.participant.status !== "group" && (
                              <div className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white ${getStatusColor(conversation.participant.status)}`} />
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium truncate">{conversation.participant.name}</h4>
                              <div className="flex items-center gap-1">
                                {getPriorityIcon(conversation.priority)}
                                {conversation.unread > 0 && (
                                  <Badge className="bg-[#3498db] text-white text-xs">
                                    {conversation.unread}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 truncate">{conversation.participant.role}</p>
                            <p className="text-sm text-gray-500 truncate mt-1">{conversation.lastMessage}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(conversation.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chat Interface */}
            <div className="lg:col-span-2">
              <Card>
                {selectedConversation ? (
                  <>
                    <CardHeader className="border-b">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={selectedConversation.participant.avatar} />
                              <AvatarFallback>
                                {selectedConversation.participant.name.split(' ').map((n: string) => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            {selectedConversation.participant.status !== "group" && (
                              <div className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white ${getStatusColor(selectedConversation.participant.status)}`} />
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium">{selectedConversation.participant.name}</h3>
                            <p className="text-sm text-gray-600">
                              {selectedConversation.participant.role} • {selectedConversation.participant.department}
                              {selectedConversation.type === "group" && (
                                <span> • {selectedConversation.participant.memberCount} members</span>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getPriorityColor(selectedConversation.priority)}>
                            {selectedConversation.priority}
                          </Badge>
                          {selectedConversation.type === "direct" && (
                            <>
                              <Button variant="outline" size="sm" onClick={() => handleCall(selectedConversation.participant)}>
                                <Phone className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleVideoCall(selectedConversation.participant)}>
                                <Video className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-0">
                      {/* Messages Area */}
                      <div className="h-96 overflow-y-auto p-4 space-y-4">
                        {messages
                          .filter(msg => msg.conversationId === selectedConversation.id)
                          .map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${message.sender === "Me" ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`max-w-xs px-4 py-2 rounded-lg ${
                                  message.sender === "Me"
                                    ? "bg-[#3498db] text-white"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                <p className="text-sm">{message.content}</p>
                                <p className={`text-xs mt-1 ${
                                  message.sender === "Me" ? "text-blue-100" : "text-gray-500"
                                }`}>
                                  {new Date(message.timestamp).toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          ))
                        }
                      </div>

                      {/* Message Input */}
                      <div className="border-t p-4">
                        <div className="flex items-end gap-2">
                          <Textarea
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                            rows={2}
                            className="flex-1 resize-none"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                              }
                            }}
                          />
                          <Button 
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim()}
                            className="bg-[#3498db] hover:bg-[#2980b9]"
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </>
                ) : (
                  <CardContent className="text-center py-20">
                    <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">Select a Conversation</h3>
                    <p className="text-gray-600">Choose a conversation from the list to start messaging.</p>
                  </CardContent>
                )}
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="announcements" className="mt-6">
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <Card key={announcement.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {announcement.title}
                        {getPriorityIcon(announcement.priority)}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-1">
                        <span>By {announcement.author}</span>
                        <span>•</span>
                        <span>{new Date(announcement.timestamp).toLocaleString()}</span>
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(announcement.priority)}>
                        {announcement.priority}
                      </Badge>
                      <Badge variant="outline">
                        {announcement.category}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{announcement.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="directory" className="mt-6">
          <Card>
            <CardContent className="text-center py-20">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">Team Directory</h3>
              <p className="text-gray-600">Contact directory would be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Messages;
