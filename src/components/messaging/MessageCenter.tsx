
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Send, User, Clock } from "lucide-react";

interface Message {
  id: string;
  from: string;
  to: string;
  subject: string;
  content: string;
  timestamp: string;
  read: boolean;
  urgent: boolean;
}

export const MessageCenter: React.FC = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [showCompose, setShowCompose] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [newMessage, setNewMessage] = useState({
    to: "",
    subject: "",
    content: "",
    urgent: false
  });

  const staff = [
    { id: "dr-smith", name: "Dr. Smith", role: "Doctor" },
    { id: "nurse-jones", name: "Nurse Jones", role: "Nurse" },
    { id: "tech-davis", name: "Tech Davis", role: "Lab Tech" },
    { id: "admin-brown", name: "Admin Brown", role: "Admin" }
  ];

  useEffect(() => {
    // Load sample messages
    const sampleMessages: Message[] = [
      {
        id: "1",
        from: "Dr. Smith",
        to: "Nurse Jones",
        subject: "Patient Update - Room 201",
        content: "Please check on patient in room 201. Vital signs need monitoring every 2 hours.",
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        read: false,
        urgent: true
      },
      {
        id: "2",
        from: "Lab Tech",
        to: "Dr. Smith",
        subject: "Lab Results Available",
        content: "Blood work results for patient P-002 are ready for review.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        read: true,
        urgent: false
      }
    ];
    setMessages(sampleMessages);
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    const currentUser = JSON.parse(localStorage.getItem("hms-nurse") || localStorage.getItem("hms-doctor") || "{}");
    
    const message: Message = {
      id: Date.now().toString(),
      from: currentUser.name || "User",
      to: newMessage.to,
      subject: newMessage.subject,
      content: newMessage.content,
      timestamp: new Date().toISOString(),
      read: false,
      urgent: newMessage.urgent
    };

    setMessages(prev => [message, ...prev]);
    
    toast({
      title: "Message Sent",
      description: `Message sent to ${newMessage.to}`
    });

    setNewMessage({
      to: "",
      subject: "",
      content: "",
      urgent: false
    });
    setShowCompose(false);
  };

  const markAsRead = (messageId: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, read: true } : msg
      )
    );
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Message Center</h2>
        <Button 
          onClick={() => setShowCompose(true)}
          className="bg-[#3498db] hover:bg-[#2980b9]"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Compose
        </Button>
      </div>

      {showCompose && (
        <Card>
          <CardHeader>
            <CardTitle>Compose Message</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div>
                <Select 
                  value={newMessage.to} 
                  onValueChange={(value) => setNewMessage({...newMessage, to: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select recipient" />
                  </SelectTrigger>
                  <SelectContent>
                    {staff.map(person => (
                      <SelectItem key={person.id} value={person.name}>
                        {person.name} ({person.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Input
                placeholder="Subject"
                value={newMessage.subject}
                onChange={(e) => setNewMessage({...newMessage, subject: e.target.value})}
                required
              />

              <Textarea
                placeholder="Message content"
                value={newMessage.content}
                onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
                required
              />

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="urgent"
                  checked={newMessage.urgent}
                  onChange={(e) => setNewMessage({...newMessage, urgent: e.target.checked})}
                />
                <label htmlFor="urgent" className="text-sm">Mark as urgent</label>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-[#3498db] hover:bg-[#2980b9]">
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowCompose(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Inbox</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    !message.read ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"
                  } ${selectedMessage?.id === message.id ? "bg-blue-100" : ""}`}
                  onClick={() => {
                    setSelectedMessage(message);
                    markAsRead(message.id);
                  }}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span className="font-medium text-sm">{message.from}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {message.urgent && (
                        <Badge className="bg-red-100 text-red-800 text-xs">Urgent</Badge>
                      )}
                      <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                    </div>
                  </div>
                  <h4 className={`text-sm ${!message.read ? "font-semibold" : ""}`}>
                    {message.subject}
                  </h4>
                  <p className="text-xs text-gray-600 truncate">{message.content}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Message Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedMessage ? (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">{selectedMessage.subject}</h3>
                      <p className="text-sm text-gray-600">From: {selectedMessage.from}</p>
                      <p className="text-sm text-gray-600">To: {selectedMessage.to}</p>
                    </div>
                    {selectedMessage.urgent && (
                      <Badge className="bg-red-100 text-red-800">Urgent</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                    <Clock className="h-3 w-3" />
                    {new Date(selectedMessage.timestamp).toLocaleString()}
                  </div>
                </div>
                <div className="border-t pt-3">
                  <p className="whitespace-pre-wrap">{selectedMessage.content}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setNewMessage({
                      to: selectedMessage.from,
                      subject: `Re: ${selectedMessage.subject}`,
                      content: "",
                      urgent: false
                    });
                    setShowCompose(true);
                  }}
                >
                  Reply
                </Button>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Select a message to view details</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
