
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Bell, FileText, Send, ExternalLink, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const healthGuidelines = [
  {
    id: 1,
    title: "Prevention Guidelines",
    content: "Wash hands frequently, wear masks in public, maintain social distancing of 6 feet.",
    category: "Prevention",
    lastUpdated: "2024-01-20"
  },
  {
    id: 2,
    title: "Isolation Protocols",
    content: "Confirmed cases should isolate for 10 days from symptom onset or positive test.",
    category: "Isolation",
    lastUpdated: "2024-01-19"
  },
  {
    id: 3,
    title: "Testing Recommendations",
    content: "Get tested if you have symptoms or have been exposed to a confirmed case.",
    category: "Testing",
    lastUpdated: "2024-01-18"
  }
];

const faqs = [
  {
    question: "How long should I isolate if I test positive?",
    answer: "You should isolate for at least 10 days from symptom onset or positive test, and until fever-free for 24 hours."
  },
  {
    question: "What are the most common symptoms?",
    answer: "The most common symptoms include fever, cough, fatigue, headache, and body aches."
  },
  {
    question: "When should I seek emergency medical care?",
    answer: "Seek emergency care if you have difficulty breathing, persistent chest pain, confusion, or bluish lips or face."
  }
];

export const PublicHealthInfo = () => {
  const { toast } = useToast();
  const [smsNumber, setSmsNumber] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const sendSMSAlert = () => {
    if (!smsNumber || !alertMessage) {
      toast({
        title: "Error",
        description: "Please enter both phone number and message.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Alert Sent",
      description: `SMS alert sent to ${smsNumber}`,
    });

    setSmsNumber("");
    setAlertMessage("");
  };

  const categories = ["All", "Prevention", "Isolation", "Testing", "Treatment"];
  const filteredGuidelines = selectedCategory === "All" 
    ? healthGuidelines 
    : healthGuidelines.filter(g => g.category === selectedCategory);

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Health Guidelines */}
      <div className="md:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Info className="h-5 w-5 text-blue-600" />
              <span>Health Guidelines</span>
            </CardTitle>
            <div className="flex space-x-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredGuidelines.map((guideline) => (
                <div key={guideline.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{guideline.title}</h3>
                    <Badge variant="secondary">{guideline.category}</Badge>
                  </div>
                  <p className="text-gray-600 mb-2">{guideline.content}</p>
                  <p className="text-xs text-gray-500">
                    Last updated: {guideline.lastUpdated}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-green-600" />
              <span>Frequently Asked Questions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">{faq.question}</h4>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Emergency Information */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Emergency Contacts:</strong><br />
            Emergency Services: 911<br />
            Health Department: (555) 123-4567<br />
            CDC Hotline: 1-800-CDC-INFO
          </AlertDescription>
        </Alert>
      </div>

      {/* SMS Alert System */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-orange-600" />
              <span>Send SMS Alert</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Phone Number</label>
              <Input
                value={smsNumber}
                onChange={(e) => setSmsNumber(e.target.value)}
                placeholder="+1-555-0123"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Alert Message</label>
              <Textarea
                value={alertMessage}
                onChange={(e) => setAlertMessage(e.target.value)}
                placeholder="Enter alert message..."
                rows={4}
              />
            </div>
            <Button onClick={sendSMSAlert} className="w-full">
              <Send className="h-4 w-4 mr-2" />
              Send Alert
            </Button>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-sm">Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              CDC Guidelines
            </Button>
            <Button variant="outline" className="w-full justify-start" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              WHO Resources
            </Button>
            <Button variant="outline" className="w-full justify-start" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              Local Health Dept
            </Button>
          </CardContent>
        </Card>

        {/* Recent Updates */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-sm">Recent Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="p-2 bg-blue-50 rounded border-l-4 border-blue-400">
                <p className="font-medium">New testing site opened</p>
                <p className="text-xs text-gray-600">2 hours ago</p>
              </div>
              <div className="p-2 bg-green-50 rounded border-l-4 border-green-400">
                <p className="font-medium">Updated isolation guidelines</p>
                <p className="text-xs text-gray-600">1 day ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
