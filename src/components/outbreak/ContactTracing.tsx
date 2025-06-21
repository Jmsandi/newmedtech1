
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Phone, Mail, Calendar, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Contact {
  id: number;
  name: string;
  phone: string;
  email: string;
  relationshipType: string;
  lastContact: string;
  exposureRisk: string;
  notificationStatus: string;
}

export const ContactTracing = () => {
  const { toast } = useToast();
  const [selectedCase, setSelectedCase] = useState("");
  const [contactForm, setContactForm] = useState({
    name: "",
    phone: "",
    email: "",
    relationshipType: "",
    lastContact: "",
    exposureRisk: "",
    location: "",
    duration: ""
  });

  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: 1,
      name: "Alice Johnson",
      phone: "+1-555-0101",
      email: "alice@email.com",
      relationshipType: "Family",
      lastContact: "2024-01-18",
      exposureRisk: "High",
      notificationStatus: "Sent"
    },
    {
      id: 2,
      name: "Bob Smith",
      phone: "+1-555-0102",
      email: "bob@email.com",
      relationshipType: "Coworker",
      lastContact: "2024-01-17",
      exposureRisk: "Medium",
      notificationStatus: "Pending"
    }
  ]);

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newContact: Contact = {
      id: contacts.length + 1,
      name: contactForm.name,
      phone: contactForm.phone,
      email: contactForm.email,
      relationshipType: contactForm.relationshipType,
      lastContact: contactForm.lastContact,
      exposureRisk: contactForm.exposureRisk,
      notificationStatus: "Pending"
    };

    setContacts([...contacts, newContact]);
    setContactForm({
      name: "",
      phone: "",
      email: "",
      relationshipType: "",
      lastContact: "",
      exposureRisk: "",
      location: "",
      duration: ""
    });

    toast({
      title: "Contact Added",
      description: "Contact has been added to the tracing system.",
    });
  };

  const sendNotification = (contactId: number, method: 'sms' | 'email') => {
    setContacts(contacts.map(contact => 
      contact.id === contactId 
        ? { ...contact, notificationStatus: "Sent" }
        : contact
    ));

    toast({
      title: "Notification Sent",
      description: `${method.toUpperCase()} notification sent successfully.`,
    });
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-orange-100 text-orange-800";
      case "Low": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Sent": return "bg-green-100 text-green-800";
      case "Pending": return "bg-orange-100 text-orange-800";
      case "Failed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Add Contact Form */}
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5 text-blue-600" />
              <span>Add Contact</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddContact} className="space-y-4">
              <div>
                <Label htmlFor="caseSelect">Select Case</Label>
                <Select onValueChange={setSelectedCase}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose confirmed case" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="case1">John Doe - Case #001</SelectItem>
                    <SelectItem value="case2">Jane Smith - Case #002</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="contactName">Contact Name</Label>
                <Input
                  id="contactName"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="relationship">Relationship</Label>
                <Select onValueChange={(value) => setContactForm({...contactForm, relationshipType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Family">Family</SelectItem>
                    <SelectItem value="Coworker">Coworker</SelectItem>
                    <SelectItem value="Friend">Friend</SelectItem>
                    <SelectItem value="Healthcare">Healthcare Worker</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="lastContact">Last Contact Date</Label>
                <Input
                  id="lastContact"
                  type="date"
                  value={contactForm.lastContact}
                  onChange={(e) => setContactForm({...contactForm, lastContact: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="risk">Exposure Risk</Label>
                <Select onValueChange={(value) => setContactForm({...contactForm, exposureRisk: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Assess risk level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="location">Location of Contact</Label>
                <Input
                  id="location"
                  value={contactForm.location}
                  onChange={(e) => setContactForm({...contactForm, location: e.target.value})}
                  placeholder="Where did the contact occur?"
                />
              </div>

              <Button type="submit" className="w-full">
                Add Contact
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Contact List */}
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-green-600" />
              <span>Contact Tracking</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contacts.map((contact) => (
                <div key={contact.id} className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium">{contact.name}</h3>
                      <p className="text-sm text-gray-600">{contact.relationshipType}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Badge className={getRiskColor(contact.exposureRisk)}>
                        {contact.exposureRisk} Risk
                      </Badge>
                      <Badge className={getStatusColor(contact.notificationStatus)}>
                        {contact.notificationStatus}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center space-x-1">
                      <Phone className="h-3 w-3" />
                      <span>{contact.phone}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Mail className="h-3 w-3" />
                      <span>{contact.email}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>Last contact: {contact.lastContact}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => sendNotification(contact.id, 'sms')}
                      disabled={contact.notificationStatus === "Sent"}
                    >
                      <Phone className="h-3 w-3 mr-1" />
                      Send SMS
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => sendNotification(contact.id, 'email')}
                      disabled={contact.notificationStatus === "Sent"}
                    >
                      <Mail className="h-3 w-3 mr-1" />
                      Send Email
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
