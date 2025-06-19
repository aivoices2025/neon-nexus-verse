
import { useState, useEffect, createContext, useContext } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";

interface AuthUser extends User {
  username?: string;
  avatar?: string;
  joinedEvents?: string[];
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("AuthProvider: Setting up Supabase auth listener...");
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
        setSession(session);
        
        if (session?.user) {
          // Fetch user profile data from the profiles table
          const { data: profile } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', session.user.id)
            .single();
          
          const authUser: AuthUser = {
            ...session.user,
            username: profile?.username || session.user.email?.split('@')[0] || 'User',
            avatar: profile?.avatar_url || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face`,
            joinedEvents: []
          };
          setUser(authUser);
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session?.user?.email);
      // The auth state change listener will handle the user setup
    });

    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    console.log("Login attempt with email:", email);
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error.message);
        setIsLoading(false);
        return { success: false, error: error.message };
      }

      console.log("Login successful:", data.user?.email);
      return { success: true };
    } catch (error) {
      console.error("Login exception:", error);
      setIsLoading(false);
      return { success: false, error: "An unexpected error occurred" };
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    console.log("Signup attempt with username:", username, "email:", email);
    setIsLoading(true);
    
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            username: username,
          }
        }
      });

      if (error) {
        console.error("Signup error:", error.message);
        setIsLoading(false);
        return { success: false, error: error.message };
      }

      console.log("Signup successful:", data.user?.email);
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      console.error("Signup exception:", error);
      setIsLoading(false);
      return { success: false, error: "An unexpected error occurred" };
    }
  };

  const logout = async () => {
    console.log("Logout: Clearing user session...");
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    console.log("Logout: Complete");
  };

  console.log("AuthProvider render - user:", user?.email, "isLoading:", isLoading);

  return (
    <AuthContext.Provider value={{ user, session, login, signup, logout, isLoading }}>
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
