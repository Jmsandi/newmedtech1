import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { User, Lock, AlertCircle, Home } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const DoctorLogin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if doctor is already logged in
  useEffect(() => {
    const doctor = localStorage.getItem("hms-doctor");
    if (doctor) {
      navigate("/doctor/dashboard");
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock authentication - in a real app, you would validate against a backend
    setTimeout(() => {
      // More permissive login for demo: either use demo credentials or any email with valid format and password
      if ((email === 'doctor@medhub.com' && password === 'doctor123') ||
          (email.length > 0 && password.length > 0)) {
        
        // Store doctor info in localStorage
        localStorage.setItem('hms-doctor', JSON.stringify({
          id: '123',
          name: email === 'doctor@medhub.com' ? 'Dr. Sarah Johnson' : `Dr. ${email.split('@')[0]}`,
          email,
          role: 'doctor'
        }));
        
        toast({
          title: "Login Successful",
          description: "Welcome to the Doctor Dashboard",
        });
        
        // Ensure we redirect to the doctor dashboard
        navigate('/doctor/dashboard');
      } else {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Invalid email or password. Try doctor@medhub.com/doctor123 for demo.",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  const toggleCredentials = () => {
    setShowCredentials(!showCredentials);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f1f5f9] p-4">
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

      <Card className="w-full max-w-md shadow-lg border-[#e2e8f0]">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center mb-4">
            <img src="/logo.svg" alt="MedHub Logo" className="h-8 w-8" />
            <h1 className="text-xl font-bold ml-2 text-[#2563eb]">MedHub</h1>
          </div>
          <CardTitle className="text-2xl font-bold text-[#1e293b]">Doctor Login</CardTitle>
          <CardDescription>
            Enter your credentials to access the doctor dashboard
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {showCredentials && (
              <Alert className="bg-[#3b82f6]/10 border-[#3b82f6]/20 text-[#1e293b]">
                <AlertCircle className="h-4 w-4 text-[#3b82f6]" />
                <AlertDescription className="text-sm">
                  <strong>Demo Credentials:</strong>
                  <div className="mt-1">Email: doctor@medhub.com</div>
                  <div>Password: doctor123</div>
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  placeholder="doctor@medhub.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-sm text-[#2563eb] hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Button 
                type="button" 
                variant="link" 
                onClick={toggleCredentials}
                className="text-[#2563eb] px-0"
              >
                {showCredentials ? "Hide demo credentials" : "Show demo credentials"}
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full bg-[#2563eb] hover:bg-[#1d4ed8]"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default DoctorLogin;
