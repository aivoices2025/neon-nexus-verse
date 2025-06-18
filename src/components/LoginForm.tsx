
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { Video, Headphones } from "lucide-react";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  
  const { login, signup, isLoading } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("LoginForm: handleLogin called with email:", email);
    setError("");
    
    try {
      const success = await login(email, password);
      console.log("LoginForm: Login result:", success);
      if (!success) {
        setError("Invalid credentials. Try any email/password combination.");
      }
    } catch (error) {
      console.error("LoginForm: Login error:", error);
      setError("Login failed. Please try again.");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("LoginForm: handleSignup called with username:", username, "email:", email);
    setError("");
    
    if (!username || !email || !password) {
      setError("Please fill in all fields");
      return;
    }
    
    try {
      const success = await signup(username, email, password);
      console.log("LoginForm: Signup result:", success);
      if (!success) {
        setError("Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("LoginForm: Signup error:", error);
      setError("Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background cyber-grid flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Headphones className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              MetaVerse Live
            </h1>
          </div>
          <p className="text-muted-foreground">
            Enter the future of virtual events
          </p>
        </div>

        {/* Login/Signup Form */}
        <Card className="bg-card/50 border-border/30 neon-glow">
          <CardHeader>
            <CardTitle className="text-center">Welcome to VR Events</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-card/50 border border-border/30">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4 mt-6">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-card/50 border-border/30"
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
                      className="bg-card/50 border-border/30"
                      required
                    />
                  </div>
                  
                  {error && (
                    <p className="text-red-400 text-sm">{error}</p>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full neon-glow bg-primary hover:bg-primary/90"
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging in..." : "Login to VR Space"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4 mt-6">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-username">Username</Label>
                    <Input
                      id="signup-username"
                      type="text"
                      placeholder="Choose a username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="bg-card/50 border-border/30"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-card/50 border-border/30"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-card/50 border-border/30"
                      required
                    />
                  </div>
                  
                  {error && (
                    <p className="text-red-400 text-sm">{error}</p>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full neon-glow bg-primary hover:bg-primary/90"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Join VR Community"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            
            {/* Demo Info */}
            <div className="mt-6 p-4 bg-muted/20 rounded-lg border border-border/30">
              <p className="text-xs text-muted-foreground text-center">
                Demo Mode: Use any email/password to login
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-card/30 border-border/30 p-4 text-center">
            <Video className="w-6 h-6 mx-auto mb-2 text-cyan-400" />
            <p className="text-xs text-muted-foreground">360° Video Events</p>
          </Card>
          <Card className="bg-card/30 border-border/30 p-4 text-center">
            <Headphones className="w-6 h-6 mx-auto mb-2 text-purple-400" />
            <p className="text-xs text-muted-foreground">VR Headset Ready</p>
          </Card>
        </div>
      </div>
    </div>
  );
};
