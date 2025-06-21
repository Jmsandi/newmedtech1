
import { useState, useEffect } from "react";
import { authenticateUser, User } from "../services/db";
import { useToast } from "./use-toast";

export const useAuth = (role: string) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem(`hms-${role}`);
      
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser) as User;
          setCurrentUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Error parsing stored user data:", error);
          localStorage.removeItem(`hms-${role}`);
          setIsAuthenticated(false);
        }
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, [role]);

  const login = async (username: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      const user = await authenticateUser(username, password);
      
      if (user && user.role === role) {
        localStorage.setItem(`hms-${role}`, JSON.stringify(user));
        setCurrentUser(user);
        setIsAuthenticated(true);
        
        toast({
          title: "Login Successful",
          description: `Welcome back, ${user.name}!`,
        });
        
        return true;
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid username or password",
          variant: "destructive",
        });
        
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      
      toast({
        title: "Login Error",
        description: "An error occurred during login",
        variant: "destructive",
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(`hms-${role}`);
    setCurrentUser(null);
    setIsAuthenticated(false);
    
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
  };

  return {
    isAuthenticated,
    currentUser,
    login,
    logout,
    loading,
  };
};
