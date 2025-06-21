import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Home } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const LabTechLogin: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "labtech@example.com",
      password: "password123",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // For demo purposes, hardcode validation
    if (values.email === "labtech@example.com" && values.password === "password123") {
      // Set authenticated state in localStorage
      localStorage.setItem("hms-labtech", JSON.stringify({
        id: "lt001",
        name: "Sarah Johnson",
        role: "Lab Technician",
        email: values.email
      }));
      
      toast({
        title: "Login Successful",
        description: "Welcome to the MedTech Care Lab Dashboard",
      });
      
      // Navigate to lab technician dashboard
      navigate("/labtech/dashboard");
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
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
        <div className="flex justify-center mb-6">
          <div className="flex items-center">
            <img src="/logo.svg" alt="MedHub Logo" className="h-12 w-12" />
            <h1 className="text-2xl font-bold ml-2 text-indigo-600">MedHub</h1>
          </div>
        </div>
        
        <p className="text-center text-gray-600 mb-8">Laboratory Management System</p>
        
        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Lab Technician Login</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the laboratory system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="labtech@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
                  Sign In
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col justify-center gap-2">
            <p className="text-sm text-center text-muted-foreground">
              Demo credentials are pre-filled for testing
            </p>
            <p className="text-xs text-center text-gray-400">
              © 2025 MedTech Care Lab. All rights reserved.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LabTechLogin;
