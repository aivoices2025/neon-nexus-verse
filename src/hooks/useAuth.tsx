
import { useState, useEffect, createContext, useContext } from "react";

interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  joinedEvents: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("AuthProvider: Checking for existing session...");
    // Check for existing session
    const savedUser = localStorage.getItem("vrapp_user");
    if (savedUser) {
      console.log("AuthProvider: Found saved user:", savedUser);
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        console.log("AuthProvider: Successfully loaded user:", parsedUser);
      } catch (error) {
        console.error("AuthProvider: Error parsing saved user:", error);
        localStorage.removeItem("vrapp_user");
      }
    } else {
      console.log("AuthProvider: No saved user found");
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log("Login attempt with email:", email);
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication - in real app this would validate against backend
      if (email && password) {
        console.log("Login: Creating mock user...");
        const mockUser: User = {
          id: "user_" + Date.now(),
          username: email.split("@")[0],
          email,
          avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face`,
          joinedEvents: []
        };
        
        console.log("Login: Setting user state:", mockUser);
        setUser(mockUser);
        
        console.log("Login: Saving user to localStorage...");
        localStorage.setItem("vrapp_user", JSON.stringify(mockUser));
        
        setIsLoading(false);
        console.log("Login: Success!");
        return true;
      }
      
      console.log("Login: Failed - missing email or password");
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error("Login: Error occurred:", error);
      setIsLoading(false);
      return false;
    }
  };

  const signup = async (username: string, email: string, password: string): Promise<boolean> => {
    console.log("Signup attempt with username:", username, "email:", email);
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (username && email && password) {
        console.log("Signup: Creating mock user...");
        const mockUser: User = {
          id: "user_" + Date.now(),
          username,
          email,
          avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face`,
          joinedEvents: []
        };
        
        console.log("Signup: Setting user state:", mockUser);
        setUser(mockUser);
        
        console.log("Signup: Saving user to localStorage...");
        localStorage.setItem("vrapp_user", JSON.stringify(mockUser));
        
        setIsLoading(false);
        console.log("Signup: Success!");
        return true;
      }
      
      console.log("Signup: Failed - missing required fields");
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error("Signup: Error occurred:", error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    console.log("Logout: Clearing user session...");
    setUser(null);
    localStorage.removeItem("vrapp_user");
    console.log("Logout: Complete");
  };

  console.log("AuthProvider render - user:", user, "isLoading:", isLoading);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
