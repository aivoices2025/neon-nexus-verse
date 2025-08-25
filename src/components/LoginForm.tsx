
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { Video, Headphones, Eye, EyeOff, Sparkles, Zap, Users, Globe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoadingSocial, setIsLoadingSocial] = useState<string | null>(null);
  
  const { login, signup, isLoading } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("LoginForm: handleLogin called with email:", email);
    setError("");
    setSuccess("");
    
    const result = await login(email, password);
    if (!result.success) {
      if (result.error?.includes("Email not confirmed")) {
        setError("Please check your email and click the confirmation link before logging in.");
      } else if (result.error?.includes("Invalid login credentials")) {
        setError("Invalid email or password. Please check your credentials and try again.");
      } else {
        setError(result.error || "Login failed. Please try again.");
      }
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("LoginForm: handleSignup called with username:", username, "email:", email);
    setError("");
    setSuccess("");
    
    if (!username || !email || !password) {
      setError("Please fill in all fields");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    
    const result = await signup(username, email, password);
    if (result.success) {
      setSuccess("🎉 Account created! Welcome to the VR Learning Metaverse!");
      // Clear form
      setUsername("");
      setEmail("");
      setPassword("");
    } else {
      setError(result.error || "Signup failed. Please try again.");
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    setIsLoadingSocial(provider);
    setError("");
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        console.error(`${provider} login error:`, error);
        setError(`${provider} login failed: ${error.message}`);
      }
    } catch (err) {
      console.error(`${provider} login exception:`, err);
      setError(`${provider} login failed. Please try again.`);
    } finally {
      setIsLoadingSocial(null);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-background cyber-grid flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        {/* Animated Header */}
        <div className="text-center space-y-4 animate-in fade-in duration-1000">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="relative">
              <Headphones className="w-10 h-10 text-primary animate-pulse" />
              <Sparkles className="w-4 h-4 text-cyan-400 absolute -top-1 -right-1 animate-bounce" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Neon Nexus
            </h1>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              🚀 VR Learning Metaverse
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Join thousands of learners in immersive 3D environments. Learn coding, science, and more in virtual reality!
            </p>
          </div>
        </div>

        {/* Social Login Options */}
        <Card className="bg-card/50 border-border/30 neon-glow backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-lg">
              🌟 Quick Access
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Google Login */}
            <Button
              onClick={() => handleSocialLogin('google')}
              disabled={isLoadingSocial === 'google' || isLoading}
              className="w-full h-12 bg-white hover:bg-gray-100 text-black border border-gray-300 neon-glow-cyan"
              variant="outline"
            >
              {isLoadingSocial === 'google' ? (
                <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              {isLoadingSocial === 'google' ? 'Connecting...' : 'Continue with Google'}
            </Button>

            {/* Facebook Login */}
            <Button
              onClick={() => handleSocialLogin('facebook')}
              disabled={isLoadingSocial === 'facebook' || isLoading}
              className="w-full h-12 bg-[#1877F2] hover:bg-[#166FE5] text-white neon-glow"
            >
              {isLoadingSocial === 'facebook' ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              )}
              {isLoadingSocial === 'facebook' ? 'Connecting...' : 'Continue with Facebook'}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email Login/Signup Form */}
        <Card className="bg-card/50 border-border/30 neon-glow backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center">📧 Email Access</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-card/50 border border-border/30">
                <TabsTrigger value="login" className="data-[state=active]:neon-glow">Login</TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:neon-glow">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4 mt-6">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-card/50 border-border/30 h-11 focus:neon-glow"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-card/50 border-border/30 h-11 pr-10 focus:neon-glow"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                      <p className="text-red-400 text-sm">❌ {error}</p>
                    </div>
                  )}
                  
                  {success && (
                    <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                      <p className="text-green-400 text-sm">{success}</p>
                    </div>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full h-12 neon-glow bg-primary hover:bg-primary/90 text-lg font-semibold"
                    disabled={isLoading || isLoadingSocial !== null}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Entering VR Space...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5 mr-2" />
                        Enter VR Learning Space
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4 mt-6">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-username" className="text-sm font-medium">Username</Label>
                    <Input
                      id="signup-username"
                      type="text"
                      placeholder="Choose your VR identity"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="bg-card/50 border-border/30 h-11 focus:neon-glow"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-sm font-medium">Email Address</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-card/50 border-border/30 h-11 focus:neon-glow"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-sm font-medium">Password</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a secure password (6+ characters)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-card/50 border-border/30 h-11 pr-10 focus:neon-glow"
                        required
                        minLength={6}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                      <p className="text-red-400 text-sm">❌ {error}</p>
                    </div>
                  )}
                  
                  {success && (
                    <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                      <p className="text-green-400 text-sm">{success}</p>
                    </div>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full h-12 neon-glow bg-primary hover:bg-primary/90 text-lg font-semibold"
                    disabled={isLoading || isLoadingSocial !== null}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <Users className="w-5 h-5 mr-2" />
                        Join VR Learning Community
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="bg-card/30 border-border/30 p-3 text-center hover:neon-glow transition-all duration-300">
            <Video className="w-6 h-6 mx-auto mb-2 text-cyan-400" />
            <p className="text-xs text-muted-foreground font-medium">360° Immersive</p>
          </Card>
          <Card className="bg-card/30 border-border/30 p-3 text-center hover:neon-glow transition-all duration-300">
            <Headphones className="w-6 h-6 mx-auto mb-2 text-purple-400" />
            <p className="text-xs text-muted-foreground font-medium">VR Compatible</p>
          </Card>
          <Card className="bg-card/30 border-border/30 p-3 text-center hover:neon-glow transition-all duration-300">
            <Globe className="w-6 h-6 mx-auto mb-2 text-green-400" />
            <p className="text-xs text-muted-foreground font-medium">Global Community</p>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground space-y-1">
          <p>🌟 Join thousands of learners worldwide</p>
          <p>Compatible with all major VR headsets and desktop browsers</p>
        </div>
      </div>
    </div>
  );
};
