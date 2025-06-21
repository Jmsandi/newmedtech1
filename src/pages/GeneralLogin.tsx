import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Users, UserCheck, Stethoscope, Building2, ShieldCheck, Home, Heart, AlertTriangle, Pill, Shield, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserCredentials {
  username: string;
  password: string;
  role: 'super-admin' | 'facility-admin' | 'doctor' | 'nurse' | 'staff' | 'receptionist';
  name: string;
  facilityId?: string;
  facilityName?: string;
}

// Demo credentials for each user type
const demoCredentials: UserCredentials[] = [
  {
    username: "superadmin",
    password: "admin123",
    role: "super-admin",
    name: "Super Administrator",
  },
  {
    username: "fadmin",
    password: "facility123",
    role: "facility-admin",
    name: "Facility Administrator",
    facilityId: "fac_001",
    facilityName: "Central Medical Hospital",
  },
  {
    username: "doctor",
    password: "doctor123",
    role: "doctor",
    name: "Dr. Sarah Johnson",
    facilityId: "fac_001",
    facilityName: "Central Medical Hospital",
  },
  {
    username: "nurse",
    password: "nurse123",
    role: "nurse",
    name: "Nurse Mary Williams",
    facilityId: "fac_001",
    facilityName: "Central Medical Hospital",
  },
  {
    username: "staff",
    password: "staff123",
    role: "staff",
    name: "John Miller",
    facilityId: "fac_001",
    facilityName: "Central Medical Hospital",
  },
  {
    username: "receptionist",
    password: "reception123",
    role: "receptionist",
    name: "Jane Smith",
    facilityId: "fac_001",
    facilityName: "Central Medical Hospital",
  },
];

const GeneralLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  const [existingUser, setExistingUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is already logged in and show option to continue or logout
  React.useEffect(() => {
    const user = localStorage.getItem("hms-user");
    if (user) {
      try {
        const userData = JSON.parse(user);
        setExistingUser(userData);
      } catch (error) {
        // Clear invalid user data
        localStorage.removeItem("hms-user");
      }
    }
  }, []);

  const clearSession = () => {
    localStorage.removeItem("hms-user");
    setExistingUser(null);
    toast({
      title: "Session Cleared",
      description: "You can now login with a different account.",
    });
  };

  const continueAsExistingUser = () => {
    if (existingUser) {
      redirectToRoleDashboard(existingUser.role);
    }
  };

  const redirectToRoleDashboard = (role: string) => {
    const roleRoutes = {
      'super-admin': '/super-admin',
      'facility-admin': '/facility-admin',
      'doctor': '/doctor',
      'nurse': '/nurse',
      'staff': '/staff',
      'receptionist': '/receptionist',
    };
    
    const route = roleRoutes[role as keyof typeof roleRoutes];
    if (route) {
      navigate(route);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      // Find matching credentials
      const userCred = demoCredentials.find(
        cred => cred.username === username && cred.password === password
      );

      if (userCred) {
        // Store user info in localStorage
        const userData = {
          id: `user_${Date.now()}`,
          username: userCred.username,
          name: userCred.name,
          role: userCred.role,
          facilityId: userCred.facilityId,
          facilityName: userCred.facilityName,
          loginTime: new Date().toISOString(),
        };

        localStorage.setItem("hms-user", JSON.stringify(userData));
        
        toast({
          title: "Login Successful",
          description: `Welcome ${userCred.name}! Redirecting to your dashboard...`,
        });
        
        // Redirect based on role
        redirectToRoleDashboard(userCred.role);
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid username or password. Please check your credentials.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleDemoLogin = (credentials: UserCredentials) => {
    setUsername(credentials.username);
    setPassword(credentials.password);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super-admin':
        return <ShieldCheck className="h-4 w-4" />;
      case 'facility-admin':
        return <Building2 className="h-4 w-4" />;
      case 'doctor':
        return <Stethoscope className="h-4 w-4" />;
      case 'nurse':
        return <UserCheck className="h-4 w-4" />;
      case 'staff':
        return <Users className="h-4 w-4" />;
      case 'receptionist':
        return <User className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super-admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'facility-admin':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'doctor':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'nurse':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'staff':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'receptionist':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      {/* Home button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate("/")}
        className="fixed top-4 left-4 z-10 bg-white/90 backdrop-blur-sm hover:bg-white"
      >
        <Home className="h-4 w-4 mr-2" />
        Home
      </Button>

      <div className="w-full max-w-4xl">
        {/* Existing User Notification */}
        {existingUser && (
          <Card className="mb-4 border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    {getRoleIcon(existingUser.role)}
                  </div>
                  <div>
                    <p className="font-medium text-blue-900">{existingUser.name}</p>
                    <p className="text-sm text-blue-600 capitalize">{existingUser.role.replace('-', ' ')}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={continueAsExistingUser}
                    className="bg-blue-600 text-white hover:bg-blue-700 border-blue-600"
                  >
                    Continue
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearSession}
                    className="text-blue-600 border-blue-300 hover:bg-blue-100"
                  >
                    Logout
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Category Dropdowns Section */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* User Roles / Access Levels Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center space-y-2 bg-blue-50 hover:bg-blue-100 border-blue-200">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-800">User Roles / Access Levels</span>
                  <ChevronDown className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-xs text-blue-600">Select your role to login</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="start">
              <DropdownMenuItem onClick={() => navigate("/login")} className="flex items-center space-x-3 py-3">
                <ShieldCheck className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-medium">Admin Login</div>
                  <div className="text-xs text-gray-500">System administration</div>
                </div>
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => navigate("/doctor/login")} className="flex items-center space-x-3 py-3">
                <Stethoscope className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium">Doctor Login</div>
                  <div className="text-xs text-gray-500">Medical professionals</div>
                </div>
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => navigate("/nurse/login")} className="flex items-center space-x-3 py-3">
                <UserCheck className="h-5 w-5 text-purple-600" />
                <div>
                  <div className="font-medium">Nurse Login</div>
                  <div className="text-xs text-gray-500">Nursing staff</div>
                </div>
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => navigate("/labtech/login")} className="flex items-center space-x-3 py-3">
                <Building2 className="h-5 w-5 text-orange-600" />
                <div>
                  <div className="font-medium">Lab Tech Login</div>
                  <div className="text-xs text-gray-500">Laboratory technicians</div>
                </div>
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => navigate("/emergency-team")} className="flex items-center space-x-3 py-3">
                <Shield className="h-5 w-5 text-red-600" />
                <div>
                  <div className="font-medium">Emergency Team</div>
                  <div className="text-xs text-gray-500">Emergency response</div>
                </div>
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => navigate("/staff")} className="flex items-center space-x-3 py-3">
                <Users className="h-5 w-5 text-gray-600" />
                <div>
                  <div className="font-medium">Staff</div>
                  <div className="text-xs text-gray-500">General staff portal</div>
                </div>
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => navigate("/receptionist/login")} className="flex items-center space-x-3 py-3">
                <User className="h-5 w-5 text-indigo-600" />
                <div>
                  <div className="font-medium">Receptionist</div>
                  <div className="text-xs text-gray-500">Front desk operations</div>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* System Modules / Functional Areas Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center space-y-2 bg-green-50 hover:bg-green-100 border-green-200">
                <div className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-800">System Modules / Functional Areas</span>
                  <ChevronDown className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-xs text-green-600">Access specialized modules</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72" align="start">
              <DropdownMenuItem onClick={() => navigate("/maternal-mortality")} className="flex items-center space-x-3 py-3">
                <Heart className="h-5 w-5 text-pink-600" />
                <div>
                  <div className="font-medium">Maternal Mortality Control</div>
                  <div className="text-xs text-gray-500">Maternal health monitoring & prevention</div>
                </div>
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => navigate("/disease-outbreak")} className="flex items-center space-x-3 py-3">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <div>
                  <div className="font-medium">Disease Outbreak Control</div>
                  <div className="text-xs text-gray-500">Disease surveillance & response</div>
                </div>
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => navigate("/pharmacy")} className="flex items-center space-x-3 py-3">
                <Pill className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-medium">Pharmacy Management</div>
                  <div className="text-xs text-gray-500">Medication & inventory management</div>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Building2 className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">MedHub System</h1>
          <p className="text-gray-600 mt-2">Hospital Management Portal</p>
        </div>
        
        <Card className="shadow-xl max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-center">User Login</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              {showCredentials && (
                <Alert className="bg-blue-50 border-blue-200">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription>
                    <div className="space-y-3 mt-2">
                      <div className="text-sm font-semibold text-blue-800">Demo Accounts:</div>
                      {demoCredentials.map((cred, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className={getRoleColor(cred.role)}>
                              {getRoleIcon(cred.role)}
                              <span className="ml-1 capitalize">{cred.role.replace('-', ' ')}</span>
                            </Badge>
                            <div className="text-xs">
                              <div className="font-medium">{cred.name}</div>
                              <div className="text-gray-500">{cred.username}</div>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDemoLogin(cred)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Use
                          </Button>
                        </div>
                      ))}
                    </div>
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="flex items-center justify-center">
                <Button 
                  type="button" 
                  variant="link" 
                  onClick={() => setShowCredentials(!showCredentials)}
                  className="text-blue-600 px-0"
                >
                  {showCredentials ? "Hide demo accounts" : "Show demo accounts"}
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>System supports multiple user roles:</p>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
              <ShieldCheck className="h-3 w-3 mr-1" />
              Super Admin
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              <Building2 className="h-3 w-3 mr-1" />
              Facility Admin
            </Badge>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <Stethoscope className="h-3 w-3 mr-1" />
              Doctor
            </Badge>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              <UserCheck className="h-3 w-3 mr-1" />
              Nurse
            </Badge>
            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
              <Users className="h-3 w-3 mr-1" />
              Staff
            </Badge>
            <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
              <User className="h-3 w-3 mr-1" />
              Receptionist
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralLogin; 