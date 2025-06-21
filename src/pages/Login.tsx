import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Home } from "lucide-react";
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

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if already logged in
  React.useEffect(() => {
    const user = localStorage.getItem("hms-user");
    if (user) {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // For demo purposes, we'll just check if the username and password match the credentials 
    // or use fallback for easier login
    setTimeout(() => {
      if ((username === "admin" && password === "admin") || 
          (username.length > 0 && password.length > 0)) {
        // Store user info in localStorage
        localStorage.setItem(
          "hms-user",
          JSON.stringify({ 
            id: 1, 
            name: username === "admin" ? "Admin User" : username, 
            email: username === "admin" ? "admin@medhub.com" : `${username}@medhub.com`, 
            role: "administrator" 
          })
        );
        
        toast({
          title: "Login Successful",
          description: "Welcome to MedHub Management System",
        });
        
        navigate("/admin/dashboard");
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid username or password. Try admin/admin for demo.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  const toggleCredentials = () => {
    setShowCredentials(!showCredentials);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-hospital-light to-background p-4">
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

      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center">
            <img src="/logo.svg" alt="MedHub Logo" className="h-8 w-8" />
            <h1 className="text-3xl font-bold ml-2 text-hospital-primary">MedHub</h1>
          </div>
          <p className="text-muted-foreground mt-2">Hospital Management System</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Administrator Login</CardTitle>
            <CardDescription>
              Enter your credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              {showCredentials && (
                <Alert className="bg-hospital-primary/10 border-hospital-primary/20">
                  <AlertCircle className="h-4 w-4 text-hospital-primary" />
                  <AlertDescription className="text-sm">
                    <strong>Demo Credentials:</strong>
                    <div className="mt-1">Username: admin</div>
                    <div>Password: admin</div>
                  </AlertDescription>
                </Alert>
              )}
            
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
              <div className="flex items-center justify-center">
                <Button 
                  type="button" 
                  variant="link" 
                  onClick={toggleCredentials}
                  className="text-hospital-primary px-0"
                >
                  {showCredentials ? "Hide demo credentials" : "Show demo credentials"}
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-hospital-primary hover:bg-hospital-primary/90"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
