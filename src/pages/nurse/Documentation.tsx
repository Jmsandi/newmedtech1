import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Search, Plus, Edit, Save, Clock, User, AlertTriangle, CheckCircle } from "lucide-react";

const Documentation: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("recent");
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [noteContent, setNoteContent] = useState("");
  
  const notes = [
    {
      id: "N001",
      patientName: "James Wilson",
      patientId: "P001",
      room: "101",
      type: "Progress Note",
      title: "Post-operative Assessment",
      content: "Patient recovering well from surgery. Vital signs stable. Pain management effective with current medication. Ambulating with assistance. No signs of infection at surgical site. Continue current care plan.",
      createdBy: "Nurse Jennifer",
      createdAt: "2024-01-15 14:30",
      lastModified: "2024-01-15 15:45",
      priority: "Normal",
      status: "Final",
      shift: "Day Shift"
    },
    {
      id: "N002",
      patientName: "Maria Garcia",
      patientId: "P002",
      room: "205",
      type: "Assessment Note",
      title: "Diabetic Management Review",
      content: "Blood glucose levels have been fluctuating. Patient reports dietary compliance issues. Discussed meal planning and carbohydrate counting. Insulin timing adjusted. Monitor closely for next 24 hours.",
      createdBy: "Nurse Amy",
      createdAt: "2024-01-15 12:15",
      lastModified: "2024-01-15 13:20",
      priority: "High",
      status: "Final",
      shift: "Day Shift"
    },
    {
      id: "N003",
      patientName: "Robert Chen",
      patientId: "P003",
      room: "302",
      type: "Incident Report",
      title: "Patient Fall - Minor",
      content: "Patient attempted to get out of bed unassisted at 0200. Fall occurred near bedside. No injuries sustained. Patient alert and oriented. Vital signs stable. Implemented fall precautions. Family notified.",
      createdBy: "Nurse Sarah",
      createdAt: "2024-01-15 02:15",
      lastModified: "2024-01-15 02:45",
      priority: "High",
      status: "Under Review",
      shift: "Night Shift"
    },
    {
      id: "N004",
      patientName: "Sarah Thompson",
      patientId: "P004",
      room: "108",
      type: "Care Plan Update",
      title: "Respiratory Status Improvement",
      content: "Patient showing significant improvement in respiratory status. Oxygen saturation maintaining >95% on room air. Breathing exercises effective. Plan to discontinue supplemental oxygen tomorrow if status remains stable.",
      createdBy: "Nurse Jennifer",
      createdAt: "2024-01-15 10:00",
      lastModified: "2024-01-15 10:30",
      priority: "Normal",
      status: "Draft",
      shift: "Day Shift"
    }
  ];

  const noteTemplates = [
    {
      type: "Progress Note",
      template: "Objective: \nAssessment: \nPlan: \nResponse to interventions: \nFollow-up needed: "
    },
    {
      type: "Assessment Note", 
      template: "Chief complaint: \nPhysical assessment: \nVital signs: \nPain assessment: \nPsychosocial assessment: \nPlan of care: "
    },
    {
      type: "Medication Note",
      template: "Medication administered: \nRoute: \nPatient response: \nSide effects noted: \nNext dose due: "
    },
    {
      type: "Incident Report",
      template: "Date/Time of incident: \nLocation: \nDescription of incident: \nInjuries sustained: \nWitnesses: \nActions taken: \nNotifications made: "
    }
  ];

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.patientId.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "recent") return matchesSearch;
    if (activeTab === "draft") return matchesSearch && note.status === "Draft";
    if (activeTab === "review") return matchesSearch && note.status === "Under Review";
    if (activeTab === "incident") return matchesSearch && note.type === "Incident Report";
    if (activeTab === "high-priority") return matchesSearch && note.priority === "High";
    
    return matchesSearch;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Progress Note":
        return "bg-blue-100 text-blue-800";
      case "Assessment Note":
        return "bg-green-100 text-green-800";
      case "Incident Report":
        return "bg-red-100 text-red-800";
      case "Care Plan Update":
        return "bg-purple-100 text-purple-800";
      case "Medication Note":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Final":
        return "bg-green-100 text-green-800";
      case "Draft":
        return "bg-yellow-100 text-yellow-800";
      case "Under Review":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Normal":
        return "bg-blue-100 text-blue-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleCreateNote = () => {
    setSelectedNote(null);
    setNoteContent("");
  };

  const handleEditNote = (note: any) => {
    setSelectedNote(note);
    setNoteContent(note.content);
  };

  const handleSaveNote = () => {
    // Handle saving note
    console.log("Saving note:", noteContent);
    setSelectedNote(null);
    setNoteContent("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1e293b]">Documentation & Notes</h1>
          <p className="text-gray-600">Manage patient documentation and nursing notes</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <CheckCircle className="mr-2 h-4 w-4" />
            Review Queue
          </Button>
          <Button className="bg-[#3498db] hover:bg-[#2980b9]" onClick={handleCreateNote}>
            <Plus className="mr-2 h-4 w-4" />
            New Note
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Notes Today</p>
                <h3 className="text-2xl font-bold text-[#3498db]">{notes.length}</h3>
              </div>
              <div className="bg-[#3498db]/10 p-3 rounded-full">
                <FileText className="h-6 w-6 text-[#3498db]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Draft Notes</p>
                <h3 className="text-2xl font-bold text-yellow-600">
                  {notes.filter(note => note.status === "Draft").length}
                </h3>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Edit className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Under Review</p>
                <h3 className="text-2xl font-bold text-orange-600">
                  {notes.filter(note => note.status === "Under Review").length}
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
                <p className="text-sm font-medium text-gray-500">Incident Reports</p>
                <h3 className="text-2xl font-bold text-red-600">
                  {notes.filter(note => note.type === "Incident Report").length}
                </h3>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Notes List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search and Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by patient name, note title, or type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documentation Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="draft">Drafts</TabsTrigger>
              <TabsTrigger value="review">Under Review</TabsTrigger>
              <TabsTrigger value="incident">Incidents</TabsTrigger>
              <TabsTrigger value="high-priority">High Priority</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              <div className="space-y-4">
                {filteredNotes.map((note) => (
                  <Card key={note.id} className={`${note.priority === "High" ? "border-red-200 bg-red-50/30" : ""}`}>
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{note.title}</CardTitle>
                          <CardDescription className="flex items-center gap-4 mt-1">
                            <span>{note.patientName}</span>
                            <span>•</span>
                            <span>ID: {note.patientId}</span>
                            <span>•</span>
                            <span>Room {note.room}</span>
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getTypeColor(note.type)}>
                            {note.type}
                          </Badge>
                          <Badge className={getPriorityColor(note.priority)}>
                            {note.priority}
                          </Badge>
                          <Badge className={getStatusColor(note.status)}>
                            {note.status}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <p className="text-sm text-gray-700 line-clamp-3">{note.content}</p>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2 text-sm text-gray-600">
                        <div>
                          <p><strong>Created by:</strong> {note.createdBy}</p>
                          <p><strong>Shift:</strong> {note.shift}</p>
                        </div>
                        <div>
                          <p><strong>Created:</strong> {new Date(note.createdAt).toLocaleString()}</p>
                          <p><strong>Modified:</strong> {new Date(note.lastModified).toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t">
                        <Button variant="outline" size="sm">
                          <User className="h-4 w-4 mr-1" />
                          View Patient
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEditNote(note)}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit Note
                        </Button>
                        {note.status === "Draft" && (
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Finalize
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {filteredNotes.length === 0 && (
                  <Card>
                    <CardContent className="text-center py-10">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No notes found</h3>
                      <p className="text-gray-600">No documentation matches the current search and filter criteria.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Note Editor/Templates */}
        <div className="space-y-6">
          {selectedNote || noteContent ? (
            // Note Editor
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Edit className="mr-2 h-5 w-5" />
                  {selectedNote ? "Edit Note" : "New Note"}
                </CardTitle>
                <CardDescription>
                  {selectedNote ? `Editing: ${selectedNote.title}` : "Create a new nursing note"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!selectedNote && (
                  <div className="grid gap-4">
                    <div>
                      <label className="text-sm font-medium">Patient</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select patient" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="P001">James Wilson - Room 101</SelectItem>
                          <SelectItem value="P002">Maria Garcia - Room 205</SelectItem>
                          <SelectItem value="P003">Robert Chen - Room 302</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Note Type</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select note type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="progress">Progress Note</SelectItem>
                          <SelectItem value="assessment">Assessment Note</SelectItem>
                          <SelectItem value="medication">Medication Note</SelectItem>
                          <SelectItem value="incident">Incident Report</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Title</label>
                      <Input placeholder="Enter note title" />
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="text-sm font-medium">Content</label>
                  <Textarea
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Enter note content..."
                    rows={8}
                    className="mt-1"
                  />
                </div>

                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" onClick={() => { setSelectedNote(null); setNoteContent(""); }}>
                    Cancel
                  </Button>
                  <Button variant="outline">
                    Save as Draft
                  </Button>
                  <Button onClick={handleSaveNote} className="bg-[#3498db] hover:bg-[#2980b9]">
                    <Save className="mr-2 h-4 w-4" />
                    Save & Finalize
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            // Note Templates
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Note Templates
                </CardTitle>
                <CardDescription>
                  Quick templates for common nursing documentation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {noteTemplates.map((template, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start text-left h-auto p-4"
                    onClick={() => setNoteContent(template.template)}
                  >
                    <div>
                      <div className="font-medium">{template.type}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        Quick template for {template.type.toLowerCase()}
                      </div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Clock className="mr-2 h-4 w-4" />
                View Note History
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Create Incident Report
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <CheckCircle className="mr-2 h-4 w-4" />
                Care Plan Update
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Progress Note
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Documentation; 