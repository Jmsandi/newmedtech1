import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { User, Lock, AlertCircle, Home } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const NurseLogin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if nurse is already logged in
  useEffect(() => {
    const nurse = localStorage.getItem("hms-nurse");
    if (nurse) {
      navigate("/nurse/dashboard");
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock authentication - in a real app, you would validate against a backend
    setTimeout(() => {
      // More permissive login for demo: either use demo credentials or any email with valid format and password
      if ((email === 'nurse@medhub.com' && password === 'nurse123') ||
          (email.length > 0 && password.length > 0)) {
        
        // Store nurse info in localStorage
        localStorage.setItem('hms-nurse', JSON.stringify({
          id: '456',
          name: email === 'nurse@medhub.com' ? 'Nurse Emma Wilson' : `Nurse ${email.split('@')[0]}`,
          email,
          role: 'nurse'
        }));
        
        toast({
          title: "Login Successful",
          description: "Welcome to the Nurse Dashboard",
        });
        
        // Ensure we redirect to the nurse dashboard
        navigate('/nurse/dashboard');
      } else {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Invalid email or password. Try nurse@medhub.com/nurse123 for demo.",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  const toggleCredentials = () => {
    setShowCredentials(!showCredentials);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5] p-4">
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
            <h1 className="text-xl font-bold ml-2 text-[#3498db]">MedHub</h1>
          </div>
          <CardTitle className="text-2xl font-bold text-[#2c3e50]">Nurse Login</CardTitle>
          <CardDescription>
            Enter your credentials to access the nurse dashboard
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {showCredentials && (
              <Alert className="bg-[#3498db]/10 border-[#3498db]/20 text-[#2c3e50]">
                <AlertCircle className="h-4 w-4 text-[#3498db]" />
                <AlertDescription className="text-sm">
                  <strong>Demo Credentials:</strong>
                  <div className="mt-1">Email: nurse@medhub.com</div>
                  <div>Password: nurse123</div>
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  placeholder="nurse@medhub.com"
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
                <a href="#" className="text-sm text-[#3498db] hover:underline">
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
                className="text-[#3498db] px-0"
              >
                {showCredentials ? "Hide demo credentials" : "Show demo credentials"}
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full bg-[#3498db] hover:bg-[#2980b9]"
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

export default NurseLogin;
