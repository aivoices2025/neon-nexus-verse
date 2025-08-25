import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { 
  Sparkles, 
  Headphones, 
  Globe, 
  Users, 
  Brain, 
  Code, 
  Atom,
  CheckCircle,
  ArrowRight
} from "lucide-react";

interface WelcomeOnboardingProps {
  onComplete: () => void;
}

export const WelcomeOnboarding = ({ onComplete }: WelcomeOnboardingProps) => {
  const { user, updateProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState({
    username: user?.username || "",
    interests: [] as string[],
    experience: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const interests = [
    { id: "coding", label: "💻 Programming", icon: Code },
    { id: "data-science", label: "📊 Data Science", icon: Brain },
    { id: "ai-ml", label: "🤖 AI/Machine Learning", icon: Brain },
    { id: "science", label: "🔬 Science", icon: Atom },
    { id: "languages", label: "🌍 Languages", icon: Globe },
    { id: "design", label: "🎨 Design", icon: Sparkles },
  ];

  const experienceLevels = [
    { id: "beginner", label: "🌱 Beginner", desc: "Just getting started" },
    { id: "intermediate", label: "🚀 Intermediate", desc: "Some experience" },
    { id: "advanced", label: "⭐ Advanced", desc: "Expert level" },
  ];

  const toggleInterest = (interestId: string) => {
    setProfileData(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
    }));
  };

  const handleComplete = async () => {
    setIsUpdating(true);
    
    // Update profile with username
    if (profileData.username !== user?.username) {
      await updateProfile({ username: profileData.username });
    }
    
    // TODO: Save interests and experience to user profile
    // This would typically be saved to a user_preferences table
    
    setIsUpdating(false);
    onComplete();
  };

  const stepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full mx-auto flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                🎉 Welcome to Neon Nexus!
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                You've just joined the future of education! Let's personalize your VR learning experience.
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Card className="bg-card/30 border-border/30 p-4 text-center">
                  <Headphones className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                  <p className="text-sm font-medium">VR Compatible</p>
                </Card>
                <Card className="bg-card/30 border-border/30 p-4 text-center">
                  <Users className="w-8 h-8 mx-auto mb-2 text-cyan-400" />
                  <p className="text-sm font-medium">Collaborative</p>
                </Card>
                <Card className="bg-card/30 border-border/30 p-4 text-center">
                  <Globe className="w-8 h-8 mx-auto mb-2 text-green-400" />
                  <p className="text-sm font-medium">Global Community</p>
                </Card>
              </div>
            </div>

            <div className="space-y-4">
              <Label htmlFor="username">Customize your username</Label>
              <Input
                id="username"
                value={profileData.username}
                onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                placeholder="Enter your preferred username"
                className="bg-card/50 border-border/30 h-12 text-lg"
              />
              <p className="text-sm text-muted-foreground">
                This is how you'll appear to other learners in the metaverse
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold">🎯 What interests you?</h2>
              <p className="text-muted-foreground">
                Select your learning interests to get personalized recommendations
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {interests.map((interest) => {
                const Icon = interest.icon;
                const isSelected = profileData.interests.includes(interest.id);
                
                return (
                  <Button
                    key={interest.id}
                    variant={isSelected ? "default" : "outline"}
                    className={`h-16 text-left justify-start ${
                      isSelected 
                        ? "neon-glow bg-primary text-primary-foreground" 
                        : "bg-card/50 border-border/30 hover:neon-glow"
                    }`}
                    onClick={() => toggleInterest(interest.id)}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    <span className="text-sm font-medium">{interest.label}</span>
                    {isSelected && <CheckCircle className="w-4 h-4 ml-auto" />}
                  </Button>
                );
              })}
            </div>

            <p className="text-sm text-muted-foreground text-center">
              Selected: {profileData.interests.length} interests
            </p>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold">🎓 Your experience level</h2>
              <p className="text-muted-foreground">
                Help us tailor the difficulty of your learning path
              </p>
            </div>

            <div className="space-y-3">
              {experienceLevels.map((level) => (
                <Button
                  key={level.id}
                  variant={profileData.experience === level.id ? "default" : "outline"}
                  className={`w-full h-20 text-left justify-start ${
                    profileData.experience === level.id
                      ? "neon-glow bg-primary text-primary-foreground"
                      : "bg-card/50 border-border/30 hover:neon-glow"
                  }`}
                  onClick={() => setProfileData(prev => ({ ...prev, experience: level.id }))}
                >
                  <div className="flex flex-col items-start">
                    <span className="text-lg font-medium">{level.label}</span>
                    <span className="text-sm opacity-75">{level.desc}</span>
                  </div>
                  {profileData.experience === level.id && (
                    <CheckCircle className="w-5 h-5 ml-auto" />
                  )}
                </Button>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-500 rounded-full mx-auto flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold">🚀 All set!</h2>
              <p className="text-muted-foreground">
                Your personalized VR learning experience is ready
              </p>
            </div>

            <Card className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-primary/20">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Your Profile Summary:</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Username:</span>
                    <Badge variant="outline">{profileData.username}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Interests:</span>
                    <span className="text-sm">{profileData.interests.length} selected</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Experience:</span>
                    <Badge variant="outline">
                      {experienceLevels.find(l => l.id === profileData.experience)?.label}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                🎮 Ready to explore the metaverse? Let's begin your journey!
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background cyber-grid flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="bg-card/50 border-border/30 neon-glow backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="flex justify-center space-x-2 mb-4">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`w-3 h-3 rounded-full ${
                    step <= currentStep
                      ? "bg-primary"
                      : "bg-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <CardTitle className="text-sm text-muted-foreground">
              Step {currentStep} of 4
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {stepContent()}

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
                className="bg-card/50 border-border/30"
              >
                Previous
              </Button>

              {currentStep < 4 ? (
                <Button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={
                    (currentStep === 1 && !profileData.username.trim()) ||
                    (currentStep === 3 && !profileData.experience)
                  }
                  className="neon-glow bg-primary hover:bg-primary/90"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleComplete}
                  disabled={isUpdating}
                  className="neon-glow bg-primary hover:bg-primary/90"
                >
                  {isUpdating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Setting up...
                    </>
                  ) : (
                    <>
                      🚀 Enter the Metaverse
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};