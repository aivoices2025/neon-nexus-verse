import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Whiteboard } from "./Whiteboard";
import { 
  Users, 
  BookOpen, 
  Video, 
  MessageSquare, 
  Settings,
  ChevronRight,
  GraduationCap,
  Clock,
  Presentation
} from "lucide-react";
import { toast } from "sonner";

export const Classroom = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<"whiteboard" | "materials" | "students" | "chat">("whiteboard");
  const [studentsOnline, setStudentsOnline] = useState(12);
  const [lessonTitle, setLessonTitle] = useState("Introduction to VR Development");

  useEffect(() => {
    toast.success(`Welcome to the classroom, ${user?.username || 'Teacher'}!`);
  }, [user]);

  const sidebarItems = [
    { id: "whiteboard", label: "Whiteboard", icon: Presentation, active: true },
    { id: "materials", label: "Course Materials", icon: BookOpen, active: false },
    { id: "students", label: "Students", icon: Users, active: false },
    { id: "chat", label: "Class Chat", icon: MessageSquare, active: false },
  ];

  return (
    <div className="min-h-screen bg-background cyber-grid">
      <div className="container mx-auto px-4 py-8 pt-20">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Virtual Classroom
                </h1>
                <p className="text-muted-foreground">{lessonTitle}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="border-green-500/50 text-green-400 flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Live Session
              </Badge>
              <Badge variant="outline" className="border-cyan-400/50 text-cyan-400">
                <Users className="w-3 h-3 mr-1" />
                {studentsOnline} Students
              </Badge>
              <Badge variant="outline" className="border-purple-400/50 text-purple-400">
                <Clock className="w-3 h-3 mr-1" />
                45:30
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-card/50 border-border/30">
              <CardHeader>
                <CardTitle className="text-lg">Classroom Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <Button
                      key={item.id}
                      variant={isActive ? "default" : "ghost"}
                      className={`w-full justify-start ${isActive ? 'neon-glow' : ''}`}
                      onClick={() => setActiveSection(item.id as any)}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {item.label}
                      {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                    </Button>
                  );
                })}
                
                <Separator className="my-4" />
                
                {/* Quick Actions */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Quick Actions</p>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Video className="w-4 h-4 mr-2" />
                    Screen Share
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Student Activity */}
            <Card className="bg-card/50 border-border/30 mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-muted-foreground">Alex joined the class</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-muted-foreground">Sarah raised hand</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-muted-foreground">Mike submitted quiz</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeSection === "whiteboard" && (
              <div>
                <Whiteboard className="w-full" />
              </div>
            )}

            {activeSection === "materials" && (
              <Card className="bg-card/50 border-border/30">
                <CardHeader>
                  <CardTitle>Course Materials</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-border/30 rounded-lg hover:border-primary/50 transition-colors cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <BookOpen className="w-8 h-8 text-primary" />
                        <div>
                          <h3 className="font-semibold">Lesson 1: VR Basics</h3>
                          <p className="text-sm text-muted-foreground">Introduction to Virtual Reality</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border border-border/30 rounded-lg hover:border-primary/50 transition-colors cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <Video className="w-8 h-8 text-cyan-400" />
                        <div>
                          <h3 className="font-semibold">Video Tutorial</h3>
                          <p className="text-sm text-muted-foreground">Setting up VR environment</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === "students" && (
              <Card className="bg-card/50 border-border/30">
                <CardHeader>
                  <CardTitle>Students in Class</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 12 }, (_, i) => (
                      <div key={i} className="flex items-center space-x-3 p-3 border border-border/30 rounded-lg">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          {String.fromCharCode(65 + i)}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">Student {i + 1}</p>
                          <p className="text-xs text-muted-foreground">Online</p>
                        </div>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === "chat" && (
              <Card className="bg-card/50 border-border/30">
                <CardHeader>
                  <CardTitle>Class Chat</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-4 h-96 overflow-y-auto">
                    <div className="flex space-x-2">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex-shrink-0"></div>
                      <div>
                        <p className="text-sm font-medium">Sarah</p>
                        <p className="text-sm text-muted-foreground">This whiteboard feature is amazing!</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex-shrink-0"></div>
                      <div>
                        <p className="text-sm font-medium">Alex</p>
                        <p className="text-sm text-muted-foreground">Can you explain the VR concepts again?</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <input 
                      className="flex-1 px-3 py-2 bg-background border border-border/30 rounded-lg"
                      placeholder="Type your message..."
                    />
                    <Button>Send</Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};