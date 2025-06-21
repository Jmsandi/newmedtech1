
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Search, PlusCircle, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data for health levels
const mockHealthLevels = [
  { id: 1, name: "Critical", description: "Patient requires immediate medical attention", color: "#FF0000", minValue: 0, maxValue: 20 },
  { id: 2, name: "Severe", description: "Patient requires urgent medical care", color: "#FFA500", minValue: 21, maxValue: 40 },
  { id: 3, name: "Moderate", description: "Patient requires regular monitoring", color: "#FFFF00", minValue: 41, maxValue: 60 },
  { id: 4, name: "Mild", description: "Patient condition is stable with minor issues", color: "#00FF00", minValue: 61, maxValue: 80 },
  { id: 5, name: "Normal", description: "Patient is in good health condition", color: "#008000", minValue: 81, maxValue: 100 }
];

// Mock data for health parameters
const mockHealthParameters = [
  { id: 1, name: "Blood Pressure", unit: "mmHg", normalRange: "90/60 - 120/80", criticalBelow: "90/60", criticalAbove: "140/90" },
  { id: 2, name: "Heart Rate", unit: "bpm", normalRange: "60-100", criticalBelow: "50", criticalAbove: "120" },
  { id: 3, name: "Body Temperature", unit: "°C", normalRange: "36.1-37.2", criticalBelow: "35", criticalAbove: "38.5" },
  { id: 4, name: "Respiratory Rate", unit: "breaths/min", normalRange: "12-20", criticalBelow: "8", criticalAbove: "25" },
  { id: 5, name: "Oxygen Saturation", unit: "%", normalRange: "95-100", criticalBelow: "90", criticalAbove: "N/A" }
];

interface HealthLevel {
  id: number;
  name: string;
  description: string;
  color: string;
  minValue: number;
  maxValue: number;
}

interface HealthParameter {
  id: number;
  name: string;
  unit: string;
  normalRange: string;
  criticalBelow: string;
  criticalAbove: string;
}

const HealthLevelAdmin = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("levels");
  const [healthLevels, setHealthLevels] = useState<HealthLevel[]>(mockHealthLevels);
  const [healthParameters, setHealthParameters] = useState<HealthParameter[]>(mockHealthParameters);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [currentHealthLevel, setCurrentHealthLevel] = useState<HealthLevel>({
    id: 0,
    name: "",
    description: "",
    color: "#000000",
    minValue: 0,
    maxValue: 100
  });

  const [currentHealthParameter, setCurrentHealthParameter] = useState<HealthParameter>({
    id: 0,
    name: "",
    unit: "",
    normalRange: "",
    criticalBelow: "",
    criticalAbove: ""
  });

  // Filter health levels or parameters based on search term
  const filteredHealthLevels = healthLevels.filter(level =>
    level.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    level.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredHealthParameters = healthParameters.filter(param =>
    param.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    param.unit.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Level Management Functions
  const handleAddLevel = () => {
    setIsEditMode(false);
    setCurrentHealthLevel({
      id: healthLevels.length > 0 ? Math.max(...healthLevels.map(level => level.id)) + 1 : 1,
      name: "",
      description: "",
      color: "#000000",
      minValue: 0,
      maxValue: 100
    });
    setIsDialogOpen(true);
  };

  const handleEditLevel = (level: HealthLevel) => {
    setIsEditMode(true);
    setCurrentHealthLevel({ ...level });
    setIsDialogOpen(true);
  };

  const handleDeleteLevel = (id: number) => {
    setHealthLevels(healthLevels.filter(level => level.id !== id));
    toast({
      title: "Health Level Removed",
      description: "The health level has been deleted successfully."
    });
  };

  const handleSaveLevel = () => {
    if (!currentHealthLevel.name || !currentHealthLevel.description) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (currentHealthLevel.minValue >= currentHealthLevel.maxValue) {
      toast({
        title: "Validation Error",
        description: "Maximum value must be greater than minimum value.",
        variant: "destructive"
      });
      return;
    }

    if (isEditMode) {
      setHealthLevels(
        healthLevels.map((level) =>
          level.id === currentHealthLevel.id ? currentHealthLevel : level
        )
      );
      toast({
        title: "Health Level Updated",
        description: "Health level has been updated successfully."
      });
    } else {
      setHealthLevels([...healthLevels, currentHealthLevel]);
      toast({
        title: "Health Level Added",
        description: "New health level has been added successfully."
      });
    }
    setIsDialogOpen(false);
  };

  // Parameter Management Functions
  const handleAddParameter = () => {
    setIsEditMode(false);
    setCurrentHealthParameter({
      id: healthParameters.length > 0 ? Math.max(...healthParameters.map(param => param.id)) + 1 : 1,
      name: "",
      unit: "",
      normalRange: "",
      criticalBelow: "",
      criticalAbove: ""
    });
    setIsDialogOpen(true);
  };

  const handleEditParameter = (parameter: HealthParameter) => {
    setIsEditMode(true);
    setCurrentHealthParameter({ ...parameter });
    setIsDialogOpen(true);
  };

  const handleDeleteParameter = (id: number) => {
    setHealthParameters(healthParameters.filter(param => param.id !== id));
    toast({
      title: "Health Parameter Removed",
      description: "The health parameter has been deleted successfully."
    });
  };

  const handleSaveParameter = () => {
    if (!currentHealthParameter.name || !currentHealthParameter.unit || !currentHealthParameter.normalRange) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (isEditMode) {
      setHealthParameters(
        healthParameters.map((param) =>
          param.id === currentHealthParameter.id ? currentHealthParameter : param
        )
      );
      toast({
        title: "Health Parameter Updated",
        description: "Health parameter has been updated successfully."
      });
    } else {
      setHealthParameters([...healthParameters, currentHealthParameter]);
      toast({
        title: "Health Parameter Added",
        description: "New health parameter has been added successfully."
      });
    }
    setIsDialogOpen(false);
  };

  const handleLevelInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentHealthLevel({
      ...currentHealthLevel,
      [name]: name === 'minValue' || name === 'maxValue' ? parseInt(value) || 0 : value
    });
  };

  const handleParameterInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentHealthParameter({
      ...currentHealthParameter,
      [name]: value
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Health Level Administration</h1>
          <p className="text-muted-foreground">
            Manage health levels and vital sign parameters for patient monitoring.
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="levels">Health Levels</TabsTrigger>
          <TabsTrigger value="parameters">Health Parameters</TabsTrigger>
        </TabsList>

        <TabsContent value="levels" className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search health levels..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={handleAddLevel} className="ml-4 bg-hospital-primary hover:bg-hospital-primary/90">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Level
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead>Range</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHealthLevels.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                      No health levels found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredHealthLevels.map((level) => (
                    <TableRow key={level.id}>
                      <TableCell>{level.id}</TableCell>
                      <TableCell className="font-medium">{level.name}</TableCell>
                      <TableCell>{level.description}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div 
                            className="h-5 w-5 rounded-full" 
                            style={{ backgroundColor: level.color }}
                          />
                          {level.color}
                        </div>
                      </TableCell>
                      <TableCell>{level.minValue} - {level.maxValue}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button size="sm" variant="ghost" onClick={() => handleEditLevel(level)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteLevel(level.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="parameters" className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search health parameters..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={handleAddParameter} className="ml-4 bg-hospital-primary hover:bg-hospital-primary/90">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Parameter
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Normal Range</TableHead>
                  <TableHead>Critical Below</TableHead>
                  <TableHead>Critical Above</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHealthParameters.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                      No health parameters found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredHealthParameters.map((param) => (
                    <TableRow key={param.id}>
                      <TableCell>{param.id}</TableCell>
                      <TableCell className="font-medium">{param.name}</TableCell>
                      <TableCell>{param.unit}</TableCell>
                      <TableCell>{param.normalRange}</TableCell>
                      <TableCell>{param.criticalBelow}</TableCell>
                      <TableCell>{param.criticalAbove}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button size="sm" variant="ghost" onClick={() => handleEditParameter(param)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteParameter(param.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Dialog - Health Levels */}
      {activeTab === 'levels' && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{isEditMode ? "Edit Health Level" : "Add New Health Level"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Level Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={currentHealthLevel.name}
                    onChange={handleLevelInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      id="color"
                      name="color"
                      type="color"
                      className="w-16 h-10 p-1"
                      value={currentHealthLevel.color}
                      onChange={handleLevelInputChange}
                    />
                    <Input
                      name="color"
                      value={currentHealthLevel.color}
                      onChange={handleLevelInputChange}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  value={currentHealthLevel.description}
                  onChange={handleLevelInputChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minValue">Minimum Value</Label>
                  <Input
                    id="minValue"
                    name="minValue"
                    type="number"
                    min="0"
                    max="100"
                    value={currentHealthLevel.minValue}
                    onChange={handleLevelInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxValue">Maximum Value</Label>
                  <Input
                    id="maxValue"
                    name="maxValue"
                    type="number"
                    min="0"
                    max="100"
                    value={currentHealthLevel.maxValue}
                    onChange={handleLevelInputChange}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveLevel} className="bg-hospital-primary hover:bg-hospital-primary/90">
                {isEditMode ? "Update" : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Add/Edit Dialog - Health Parameters */}
      {activeTab === 'parameters' && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{isEditMode ? "Edit Health Parameter" : "Add New Health Parameter"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Parameter Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={currentHealthParameter.name}
                    onChange={handleParameterInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Input
                    id="unit"
                    name="unit"
                    value={currentHealthParameter.unit}
                    onChange={handleParameterInputChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="normalRange">Normal Range</Label>
                <Input
                  id="normalRange"
                  name="normalRange"
                  value={currentHealthParameter.normalRange}
                  onChange={handleParameterInputChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="criticalBelow">Critical Below</Label>
                  <Input
                    id="criticalBelow"
                    name="criticalBelow"
                    value={currentHealthParameter.criticalBelow}
                    onChange={handleParameterInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="criticalAbove">Critical Above</Label>
                  <Input
                    id="criticalAbove"
                    name="criticalAbove"
                    value={currentHealthParameter.criticalAbove}
                    onChange={handleParameterInputChange}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveParameter} className="bg-hospital-primary hover:bg-hospital-primary/90">
                {isEditMode ? "Update" : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default HealthLevelAdmin;
