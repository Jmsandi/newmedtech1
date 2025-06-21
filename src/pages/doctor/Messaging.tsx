import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Send, Search, Plus, Phone, Video, Paperclip, User } from "lucide-react";

const Messaging: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<string | null>("1");
  const [newMessage, setNewMessage] = useState("");
  
  const conversations = [
    {
      id: "1",
      name: "James Wilson",
      type: "Patient",
      lastMessage: "Thank you for the prescription adjustment. I'm feeling much better.",
      timestamp: "10:30 AM",
      unread: 0,
      status: "online",
      avatar: "JW"
    },
    {
      id: "2",
      name: "Dr. Emily Chen",
      type: "Colleague",
      lastMessage: "Can you review the lab results for patient P003?",
      timestamp: "9:15 AM",
      unread: 2,
      status: "away",
      avatar: "EC"
    },
    {
      id: "3",
      name: "Maria Garcia",
      type: "Patient",
      lastMessage: "I have some questions about my diabetes management plan.",
      timestamp: "Yesterday",
      unread: 1,
      status: "offline",
      avatar: "MG"
    },
    {
      id: "4",
      name: "Nurse Jennifer",
      type: "Staff",
      lastMessage: "Patient in room 302 needs attention.",
      timestamp: "Yesterday",
      unread: 0,
      status: "online",
      avatar: "NJ"
    },
    {
      id: "5",
      name: "Emma Johnson",
      type: "Patient",
      lastMessage: "When should I schedule my next prenatal appointment?",
      timestamp: "2 days ago",
      unread: 0,
      status: "offline",
      avatar: "EJ"
    }
  ];

  const messages = [
    {
      id: "1",
      sender: "James Wilson",
      content: "Hello Dr. Johnson, I wanted to follow up on my blood pressure medication.",
      timestamp: "9:00 AM",
      isFromMe: false
    },
    {
      id: "2",
      sender: "Dr. Sarah Johnson",
      content: "Hi James! How have you been feeling since we adjusted your dosage last week?",
      timestamp: "9:05 AM",
      isFromMe: true
    },
    {
      id: "3",
      sender: "James Wilson",
      content: "Much better actually. The dizziness has completely gone away and my readings have been more stable.",
      timestamp: "9:10 AM",
      isFromMe: false
    },
    {
      id: "4",
      sender: "Dr. Sarah Johnson",
      content: "That's excellent news! Please continue with the current dosage and let me know if you experience any new symptoms.",
      timestamp: "9:15 AM",
      isFromMe: true
    },
    {
      id: "5",
      sender: "James Wilson",
      content: "Thank you for the prescription adjustment. I'm feeling much better.",
      timestamp: "10:30 AM",
      isFromMe: false
    }
  ];

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      case "offline":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Patient":
        return "bg-blue-100 text-blue-800";
      case "Colleague":
        return "bg-purple-100 text-purple-800";
      case "Staff":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Here you would add the message to the conversation
      setNewMessage("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1e293b]">Messages</h1>
          <p className="text-gray-600">Communicate with patients, colleagues, and staff</p>
        </div>
        <Button className="bg-[#2563eb] hover:bg-[#1d4ed8]">
          <Plus className="mr-2 h-4 w-4" />
          New Message
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <MessageSquare className="mr-2 h-5 w-5" />
              Conversations
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 border-l-4 transition-colors ${
                    selectedConversation === conversation.id
                      ? "bg-blue-50 border-l-blue-500"
                      : "border-l-transparent"
                  }`}
                  onClick={() => setSelectedConversation(conversation.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-[#3b82f6] flex items-center justify-center text-white text-sm font-medium">
                          {conversation.avatar}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(conversation.status)}`}></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm truncate">{conversation.name}</p>
                          <Badge className={`text-xs ${getTypeColor(conversation.type)}`}>
                            {conversation.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                      {conversation.unread > 0 && (
                        <span className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                          {conversation.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Interface */}
        <Card className="lg:col-span-2 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#3b82f6] flex items-center justify-center text-white text-sm font-medium">
                      JW
                    </div>
                    <div>
                      <h3 className="font-medium">James Wilson</h3>
                      <p className="text-sm text-gray-600">Patient • Online</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Video className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isFromMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.isFromMe
                          ? "bg-[#2563eb] text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.isFromMe ? "text-blue-100" : "text-gray-500"
                        }`}
                      >
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex items-end gap-2">
                  <Button variant="outline" size="sm">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Textarea
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 min-h-[40px] max-h-[120px] resize-none"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button 
                    onClick={handleSendMessage}
                    className="bg-[#2563eb] hover:bg-[#1d4ed8]"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No conversation selected</h3>
                <p className="text-gray-600">Choose a conversation from the list to start messaging</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Messaging; 