
import { useState, useEffect, createContext, useContext } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";

interface AuthUser extends User {
  username?: string;
  avatar?: string;
  joinedEvents?: string[];
  provider?: string;
  isNewUser?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (updates: { username?: string; avatar?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const createOrUpdateProfile = async (userId: string, userData: any, isNewUser: boolean = false) => {
    try {
      // Extract username from various sources
      let username = userData.user_metadata?.username || 
                    userData.user_metadata?.name || 
                    userData.user_metadata?.full_name ||
                    userData.email?.split('@')[0] || 
                    'User';

      // Extract avatar from various sources
      let avatar = userData.user_metadata?.avatar_url ||
                  userData.user_metadata?.picture ||
                  `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face`;

      // Get provider info
      const provider = userData.app_metadata?.provider || 'email';

      console.log('Creating/updating profile for user:', {
        userId,
        username,
        provider,
        isNewUser
      });

      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (existingProfile) {
        // Update existing profile
        const { error } = await supabase
          .from('profiles')
          .update({
            username: existingProfile.username || username,
            avatar_url: existingProfile.avatar_url || avatar,
            last_login: new Date().toISOString(),
          })
          .eq('id', userId);

        if (error) {
          console.error('Error updating profile:', error);
        }

        return {
          username: existingProfile.username || username,
          avatar: existingProfile.avatar_url || avatar,
          provider,
          isNewUser: false
        };
      } else {
        // Create new profile
        const { error } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            username,
            avatar_url: avatar,
            created_at: new Date().toISOString(),
            last_login: new Date().toISOString(),
          });

        if (error) {
          console.error('Error creating profile:', error);
        }

        return {
          username,
          avatar,
          provider,
          isNewUser: true
        };
      }
    } catch (error) {
      console.error('Error in createOrUpdateProfile:', error);
      return {
        username: userData.email?.split('@')[0] || 'User',
        avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face`,
        provider: 'email',
        isNewUser: false
      };
    }
  };

  useEffect(() => {
    console.log("AuthProvider: Setting up Supabase auth listener...");
    
    // Get initial session first
    const getInitialSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log("Initial session check:", session?.user?.email, error);
      
      if (session?.user) {
        const profileData = await createOrUpdateProfile(session.user.id, session.user);
        
        const authUser: AuthUser = {
          ...session.user,
          username: profileData.username,
          avatar: profileData.avatar,
          provider: profileData.provider,
          isNewUser: profileData.isNewUser,
          joinedEvents: []
        };
        setUser(authUser);
        setSession(session);
      } else {
        setUser(null);
        setSession(null);
      }
      
      setIsLoading(false);
    };

    getInitialSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
        
        if (session?.user) {
          const profileData = await createOrUpdateProfile(session.user.id, session.user);
          
          // Check if this is a new user based on profile data
          const isNewUser = profileData.isNewUser || false;
          
          const authUser: AuthUser = {
            ...session.user,
            username: profileData.username,
            avatar: profileData.avatar,
            provider: profileData.provider,
            isNewUser: isNewUser,
            joinedEvents: []
          };
          setUser(authUser);
        } else {
          setUser(null);
        }
        
        setSession(session);
        setIsLoading(false);
      }
    );

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
      // Don't set loading to false here - let the auth state change handler do it
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

  const updateProfile = async (updates: { username?: string; avatar?: string }) => {
    if (!user) {
      return { success: false, error: "No user logged in" };
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: updates.username,
          avatar_url: updates.avatar,
        })
        .eq('id', user.id);

      if (error) {
        console.error("Profile update error:", error);
        return { success: false, error: error.message };
      }

      // Update local user state
      setUser({
        ...user,
        username: updates.username || user.username,
        avatar: updates.avatar || user.avatar,
      });

      return { success: true };
    } catch (error) {
      console.error("Profile update exception:", error);
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
    <AuthContext.Provider value={{ user, session, login, signup, updateProfile, logout, isLoading }}>
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
