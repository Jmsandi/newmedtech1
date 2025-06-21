
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Hospital, User, Bell, Lock } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const Settings = () => {
  const { toast } = useToast();
  const [hospitalSettings, setHospitalSettings] = useState({
    name: "MedHub General Hospital",
    address: "123 Healthcare Avenue, Medical District",
    phone: "(555) 123-4567",
    email: "info@medhub.com",
    website: "www.medhub.com",
    description: "A state-of-the-art healthcare facility providing comprehensive medical services.",
  });

  const [userSettings, setUserSettings] = useState({
    name: "Admin User",
    email: "admin@medhub.com",
    role: "Administrator",
    password: "********",
    newPassword: "",
    confirmPassword: "",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    appNotifications: true,
    appointmentReminders: true,
    systemUpdates: false,
    marketingEmails: false,
  });

  const handleHospitalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setHospitalSettings({
      ...hospitalSettings,
      [name]: value,
    });
  };

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserSettings({
      ...userSettings,
      [name]: value,
    });
  };

  const handleNotificationToggle = (setting: string) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting as keyof typeof notificationSettings],
    });
  };

  const saveHospitalSettings = () => {
    toast({
      title: "Hospital Settings Saved",
      description: "Your hospital information has been updated successfully.",
    });
  };

  const saveUserSettings = () => {
    if (userSettings.newPassword && userSettings.newPassword !== userSettings.confirmPassword) {
      toast({
        title: "Password Error",
        description: "New passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "User Settings Saved",
      description: "Your user information has been updated successfully.",
    });

    // Reset password fields after save
    setUserSettings({
      ...userSettings,
      newPassword: "",
      confirmPassword: "",
    });
  };

  const saveNotificationSettings = () => {
    toast({
      title: "Notification Settings Saved",
      description: "Your notification preferences have been updated.",
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      <p className="text-muted-foreground">
        Manage system settings, user preferences, and hospital configuration.
      </p>

      <Tabs defaultValue="hospital" className="space-y-4">
        <TabsList>
          <TabsTrigger value="hospital" className="flex items-center gap-2">
            <Hospital className="h-4 w-4" />
            Hospital
          </TabsTrigger>
          <TabsTrigger value="user" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            User
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
        </TabsList>
        
        {/* Hospital Settings */}
        <TabsContent value="hospital">
          <Card>
            <CardHeader>
              <CardTitle>Hospital Information</CardTitle>
              <CardDescription>
                Update your hospital details and configurations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hospitalName">Hospital Name</Label>
                  <Input
                    id="hospitalName"
                    name="name"
                    value={hospitalSettings.name}
                    onChange={handleHospitalChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hospitalPhone">Phone Number</Label>
                  <Input
                    id="hospitalPhone"
                    name="phone"
                    value={hospitalSettings.phone}
                    onChange={handleHospitalChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="hospitalAddress">Address</Label>
                <Input
                  id="hospitalAddress"
                  name="address"
                  value={hospitalSettings.address}
                  onChange={handleHospitalChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hospitalEmail">Email</Label>
                  <Input
                    id="hospitalEmail"
                    name="email"
                    type="email"
                    value={hospitalSettings.email}
                    onChange={handleHospitalChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hospitalWebsite">Website</Label>
                  <Input
                    id="hospitalWebsite"
                    name="website"
                    value={hospitalSettings.website}
                    onChange={handleHospitalChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="hospitalDescription">Description</Label>
                <Textarea
                  id="hospitalDescription"
                  name="description"
                  value={hospitalSettings.description}
                  onChange={handleHospitalChange}
                  rows={3}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto bg-hospital-primary hover:bg-hospital-primary/90" onClick={saveHospitalSettings}>
                Save Hospital Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* User Settings */}
        <TabsContent value="user">
          <Card>
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
              <CardDescription>
                Update your user information and password.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="userName">Full Name</Label>
                  <Input
                    id="userName"
                    name="name"
                    value={userSettings.name}
                    onChange={handleUserChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="userRole">Role</Label>
                  <Input
                    id="userRole"
                    name="role"
                    value={userSettings.role}
                    disabled
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="userEmail">Email</Label>
                <Input
                  id="userEmail"
                  name="email"
                  type="email"
                  value={userSettings.email}
                  onChange={handleUserChange}
                />
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center mb-4">
                  <Lock className="mr-2 h-4 w-4" />
                  <h3 className="font-medium">Change Password</h3>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      name="password"
                      type="password"
                      value={userSettings.password}
                      onChange={handleUserChange}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={userSettings.newPassword}
                        onChange={handleUserChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={userSettings.confirmPassword}
                        onChange={handleUserChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto bg-hospital-primary hover:bg-hospital-primary/90" onClick={saveUserSettings}>
                Save User Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how and when you receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <h3 className="font-medium">Email Notifications</h3>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch 
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={() => handleNotificationToggle('emailNotifications')}
                />
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <h3 className="font-medium">App Notifications</h3>
                  <p className="text-sm text-muted-foreground">Receive notifications within the application</p>
                </div>
                <Switch 
                  checked={notificationSettings.appNotifications}
                  onCheckedChange={() => handleNotificationToggle('appNotifications')}
                />
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <h3 className="font-medium">Appointment Reminders</h3>
                  <p className="text-sm text-muted-foreground">Get reminders about upcoming appointments</p>
                </div>
                <Switch 
                  checked={notificationSettings.appointmentReminders}
                  onCheckedChange={() => handleNotificationToggle('appointmentReminders')}
                />
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <h3 className="font-medium">System Updates</h3>
                  <p className="text-sm text-muted-foreground">Be notified about system updates and maintenance</p>
                </div>
                <Switch 
                  checked={notificationSettings.systemUpdates}
                  onCheckedChange={() => handleNotificationToggle('systemUpdates')}
                />
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <h3 className="font-medium">Marketing Emails</h3>
                  <p className="text-sm text-muted-foreground">Receive news and promotional content</p>
                </div>
                <Switch 
                  checked={notificationSettings.marketingEmails}
                  onCheckedChange={() => handleNotificationToggle('marketingEmails')}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto bg-hospital-primary hover:bg-hospital-primary/90" onClick={saveNotificationSettings}>
                Save Notification Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
