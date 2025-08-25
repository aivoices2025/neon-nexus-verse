import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Star, 
  Users, 
  Play,
  Lock,
  Trophy,
  Target,
  Zap,
  Brain
} from "lucide-react";

interface LearningModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  completed: boolean;
  locked: boolean;
  type: "video" | "interactive" | "vr" | "quiz" | "project";
  progress: number;
  rating: number;
  enrolledStudents: number;
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  category: string;
  totalModules: number;
  completedModules: number;
  estimatedTime: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  modules: LearningModule[];
}

export const LearningPath = ({ user }: { user: any }) => {
  const [selectedPath, setSelectedPath] = useState<string>("web-dev");
  const [activeModule, setActiveModule] = useState<LearningModule | null>(null);

  const learningPaths: LearningPath[] = [
    {
      id: "web-dev",
      title: "Full-Stack Web Development",
      description: "Master modern web development from frontend to backend in immersive VR environments",
      category: "Programming",
      totalModules: 12,
      completedModules: 4,
      estimatedTime: "8 weeks",
      difficulty: "Intermediate",
      modules: [
        {
          id: "html-basics",
          title: "HTML Fundamentals in VR",
          description: "Learn HTML structure by building 3D web pages in virtual space",
          duration: "2 hours",
          difficulty: "Beginner",
          completed: true,
          locked: false,
          type: "vr",
          progress: 100,
          rating: 4.8,
          enrolledStudents: 1234
        },
        {
          id: "css-styling",
          title: "CSS Styling Workshop",
          description: "Interactive CSS playground with real-time visual feedback",
          duration: "3 hours",
          difficulty: "Beginner",
          completed: true,
          locked: false,
          type: "interactive",
          progress: 100,
          rating: 4.7,
          enrolledStudents: 1156
        },
        {
          id: "js-fundamentals",
          title: "JavaScript Fundamentals",
          description: "Learn JavaScript through gamified coding challenges",
          duration: "4 hours",
          difficulty: "Intermediate",
          completed: true,
          locked: false,
          type: "interactive",
          progress: 100,
          rating: 4.9,
          enrolledStudents: 1089
        },
        {
          id: "react-intro",
          title: "React Components in 3D",
          description: "Visualize React component trees in immersive 3D space",
          duration: "5 hours",
          difficulty: "Intermediate",
          completed: true,
          locked: false,
          type: "vr",
          progress: 100,
          rating: 4.8,
          enrolledStudents: 987
        },
        {
          id: "state-management",
          title: "State Management Patterns",
          description: "Interactive exploration of Redux and Context API",
          duration: "3 hours",
          difficulty: "Intermediate",
          completed: false,
          locked: false,
          type: "interactive",
          progress: 65,
          rating: 4.6,
          enrolledStudents: 876
        },
        {
          id: "backend-apis",
          title: "Building REST APIs",
          description: "Create and test APIs in collaborative virtual environment",
          duration: "4 hours",
          difficulty: "Intermediate",
          completed: false,
          locked: false,
          type: "project",
          progress: 0,
          rating: 4.7,
          enrolledStudents: 654
        },
        {
          id: "database-design",
          title: "Database Design Workshop",
          description: "Design databases using 3D entity relationship diagrams",
          duration: "3 hours",
          difficulty: "Advanced",
          completed: false,
          locked: true,
          type: "vr",
          progress: 0,
          rating: 4.8,
          enrolledStudents: 543
        }
      ]
    },
    {
      id: "data-science",
      title: "Data Science & AI",
      description: "Explore data visualization and machine learning in immersive environments",
      category: "Data Science",
      totalModules: 10,
      completedModules: 2,
      estimatedTime: "10 weeks",
      difficulty: "Advanced",
      modules: [
        {
          id: "python-basics",
          title: "Python for Data Science",
          description: "Learn Python syntax through interactive coding environments",
          duration: "4 hours",
          difficulty: "Beginner",
          completed: true,
          locked: false,
          type: "interactive",
          progress: 100,
          rating: 4.9,
          enrolledStudents: 2134
        },
        {
          id: "data-viz",
          title: "3D Data Visualization",
          description: "Create stunning 3D data visualizations in VR space",
          duration: "5 hours",
          difficulty: "Intermediate",
          completed: true,
          locked: false,
          type: "vr",
          progress: 100,
          rating: 4.8,
          enrolledStudents: 1876
        }
      ]
    }
  ];

  const currentPath = learningPaths.find(path => path.id === selectedPath) || learningPaths[0];
  const progressPercentage = (currentPath.completedModules / currentPath.totalModules) * 100;

  const getModuleIcon = (type: string) => {
    switch (type) {
      case "vr": return "🥽";
      case "interactive": return "🎮";
      case "video": return "📹";
      case "quiz": return "❓";
      case "project": return "🛠️";
      default: return "📚";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "text-green-400 border-green-400/50";
      case "Intermediate": return "text-yellow-400 border-yellow-400/50";
      case "Advanced": return "text-red-400 border-red-400/50";
      default: return "text-gray-400 border-gray-400/50";
    }
  };

  const handleModuleClick = (module: LearningModule) => {
    if (!module.locked) {
      setActiveModule(module);
    }
  };

  const handleStartModule = (module: LearningModule) => {
    console.log(`Starting module: ${module.title}`);
    // Here you would navigate to the actual learning module
    setActiveModule(null);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
          Personalized Learning Paths
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Structured learning journeys with VR experiences, interactive labs, and collaborative projects
        </p>
      </div>

      <Tabs value={selectedPath} onValueChange={setSelectedPath} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="web-dev">
            <BookOpen className="w-4 h-4 mr-2" />
            Web Development
          </TabsTrigger>
          <TabsTrigger value="data-science">
            <Brain className="w-4 h-4 mr-2" />
            Data Science & AI
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedPath} className="space-y-6">
          {/* Path Overview */}
          <Card className="bg-card/50 border-border/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2">{currentPath.title}</CardTitle>
                  <p className="text-muted-foreground">{currentPath.description}</p>
                </div>
                <Badge variant="outline" className={getDifficultyColor(currentPath.difficulty)}>
                  {currentPath.difficulty}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{currentPath.completedModules}/{currentPath.totalModules}</div>
                  <div className="text-sm text-muted-foreground">Modules Completed</div>
                </div>
                <div className="text-center p-4 bg-cyan-500/10 rounded-lg">
                  <div className="text-2xl font-bold text-cyan-400">{currentPath.estimatedTime}</div>
                  <div className="text-sm text-muted-foreground">Estimated Time</div>
                </div>
                <div className="text-center p-4 bg-green-500/10 rounded-lg">
                  <div className="text-2xl font-bold text-green-400">{Math.round(progressPercentage)}%</div>
                  <div className="text-sm text-muted-foreground">Progress</div>
                </div>
                <div className="text-center p-4 bg-purple-500/10 rounded-lg">
                  <div className="text-2xl font-bold text-purple-400">{currentPath.category}</div>
                  <div className="text-sm text-muted-foreground">Category</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Overall Progress</span>
                  <span>{Math.round(progressPercentage)}%</span>
                </div>
                <Progress value={progressPercentage} className="h-3" />
              </div>
            </CardContent>
          </Card>

          {/* Learning Modules */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold flex items-center">
              <Target className="w-6 h-6 mr-2 text-primary" />
              Learning Modules
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              {currentPath.modules.map((module, index) => (
                <Card 
                  key={module.id} 
                  className={`bg-card/50 border-border/30 transition-all cursor-pointer ${
                    module.locked 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:border-primary/50 hover:shadow-lg'
                  }`}
                  onClick={() => handleModuleClick(module)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      {/* Module Number & Status */}
                      <div className="flex-shrink-0">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                          module.completed 
                            ? 'bg-green-500 text-white' 
                            : module.locked 
                              ? 'bg-gray-600 text-gray-400'
                              : 'bg-primary text-white'
                        }`}>
                          {module.completed ? (
                            <CheckCircle className="w-6 h-6" />
                          ) : module.locked ? (
                            <Lock className="w-6 h-6" />
                          ) : (
                            index + 1
                          )}
                        </div>
                      </div>

                      {/* Module Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="text-lg font-semibold truncate">{module.title}</h4>
                          <span className="text-xl">{getModuleIcon(module.type)}</span>
                          <Badge variant="outline" className={getDifficultyColor(module.difficulty)}>
                            {module.difficulty}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm mb-2">{module.description}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {module.duration}
                          </span>
                          <span className="flex items-center">
                            <Star className="w-4 h-4 mr-1 text-yellow-400" />
                            {module.rating}
                          </span>
                          <span className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {module.enrolledStudents.toLocaleString()}
                          </span>
                        </div>

                        {/* Progress Bar for In-Progress Modules */}
                        {!module.completed && !module.locked && module.progress > 0 && (
                          <div className="mt-3">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Progress</span>
                              <span>{module.progress}%</span>
                            </div>
                            <Progress value={module.progress} className="h-2" />
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <div className="flex-shrink-0">
                        {module.completed ? (
                          <Button variant="outline" size="sm">
                            <Trophy className="w-4 h-4 mr-2" />
                            Review
                          </Button>
                        ) : module.locked ? (
                          <Button variant="ghost" size="sm" disabled>
                            <Lock className="w-4 h-4 mr-2" />
                            Locked
                          </Button>
                        ) : (
                          <Button size="sm" className="neon-glow">
                            <Play className="w-4 h-4 mr-2" />
                            {module.progress > 0 ? 'Continue' : 'Start'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Achievements & Milestones */}
          <Card className="bg-card/50 border-border/30">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                Path Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                  <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                  <h4 className="font-semibold">First Steps</h4>
                  <p className="text-sm text-muted-foreground">Complete your first module</p>
                  <Badge className="mt-2 bg-yellow-500">Earned</Badge>
                </div>
                <div className="text-center p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <Zap className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                  <h4 className="font-semibold">Quick Learner</h4>
                  <p className="text-sm text-muted-foreground">Complete 3 modules in a week</p>
                  <Badge className="mt-2 bg-purple-500">Earned</Badge>
                </div>
                <div className="text-center p-4 bg-gray-500/10 rounded-lg border border-gray-500/20">
                  <Star className="w-8 h-8 mx-auto mb-2 text-gray-500" />
                  <h4 className="font-semibold">Path Master</h4>
                  <p className="text-sm text-muted-foreground">Complete entire learning path</p>
                  <Badge variant="outline" className="mt-2">Locked</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Module Detail Modal */}
      {activeModule && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl bg-card/95 border-border/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getModuleIcon(activeModule.type)}</span>
                  <div>
                    <CardTitle className="text-xl">{activeModule.title}</CardTitle>
                    <Badge variant="outline" className={getDifficultyColor(activeModule.difficulty)}>
                      {activeModule.difficulty}
                    </Badge>
                  </div>
                </div>
                <Button variant="ghost" onClick={() => setActiveModule(null)}>
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg text-muted-foreground">{activeModule.description}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <Clock className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <div className="font-semibold">{activeModule.duration}</div>
                  <div className="text-sm text-muted-foreground">Duration</div>
                </div>
                <div className="text-center p-4 bg-yellow-500/10 rounded-lg">
                  <Star className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
                  <div className="font-semibold">{activeModule.rating}★</div>
                  <div className="text-sm text-muted-foreground">Rating</div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Button 
                  className="flex-1 neon-glow" 
                  onClick={() => handleStartModule(activeModule)}
                >
                  <Play className="w-4 h-4 mr-2" />
                  {activeModule.progress > 0 ? 'Continue Learning' : 'Start Module'}
                </Button>
                <Button variant="outline" className="flex-1">
                  <Users className="w-4 h-4 mr-2" />
                  Join Study Group
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};