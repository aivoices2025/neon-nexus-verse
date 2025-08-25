import { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Users, 
  Video, 
  Gamepad2, 
  Brain, 
  Trophy,
  Zap,
  Globe,
  Headphones,
  Play
} from "lucide-react";
import { Mesh, Group } from "three";

interface LearningZone {
  id: string;
  name: string;
  description: string;
  color: string;
  position: [number, number, number];
  icon: any;
  students: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
}

const FloatingIsland = ({ zone, onClick }: { zone: LearningZone; onClick: () => void }) => {
  const meshRef = useRef<Mesh>(null);
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (meshRef.current && groupRef.current) {
      const time = state.clock.elapsedTime;
      meshRef.current.rotation.y = time * 0.2;
      groupRef.current.position.y = Math.sin(time * 2) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={zone.position} onClick={onClick}>
      {/* Main Island */}
      <mesh ref={meshRef}>
        <cylinderGeometry args={[2, 2.5, 0.5, 8]} />
        <meshStandardMaterial color={zone.color} emissive={zone.color} emissiveIntensity={0.2} />
      </mesh>
      
      {/* Floating Crystals */}
      <mesh position={[0, 1, 0]}>
        <octahedronGeometry args={[0.3]} />
        <meshBasicMaterial color={zone.color} transparent opacity={0.8} />
      </mesh>
      
      {/* Particle Ring */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const x = Math.cos(angle) * 3;
        const z = Math.sin(angle) * 3;
        return (
          <mesh key={i} position={[x, 0.5, z]}>
            <sphereGeometry args={[0.05]} />
            <meshBasicMaterial color={zone.color} />
          </mesh>
        );
      })}
    </group>
  );
};

const MetaverseScene = ({ zones, onZoneSelect }: { zones: LearningZone[]; onZoneSelect: (zone: LearningZone) => void }) => {
  return (
    <>
      {/* Central Hub Platform */}
      <mesh position={[0, -1, 0]}>
        <cylinderGeometry args={[8, 10, 1, 16]} />
        <meshStandardMaterial color="#1a1a2e" emissive="#7c3aed" emissiveIntensity={0.1} />
      </mesh>
      
      {/* Learning Zones */}
      {zones.map((zone) => (
        <FloatingIsland 
          key={zone.id} 
          zone={zone} 
          onClick={() => onZoneSelect(zone)} 
        />
      ))}
      
      {/* Ambient Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 10, 0]} intensity={1.5} color="#7c3aed" />
      <pointLight position={[-10, 5, 10]} intensity={1} color="#00ffff" />
      <pointLight position={[10, 5, 10]} intensity={1} color="#ff00ff" />
      
      {/* Floating Particles */}
      {Array.from({ length: 50 }).map((_, i) => (
        <mesh key={i} position={[
          (Math.random() - 0.5) * 40,
          Math.random() * 20 + 2,
          (Math.random() - 0.5) * 40
        ]}>
          <sphereGeometry args={[0.02]} />
          <meshBasicMaterial color="#ffffff" opacity={0.6} transparent />
        </mesh>
      ))}
    </>
  );
};

export const MetaverseHub = ({ user }: { user: any }) => {
  const [selectedZone, setSelectedZone] = useState<LearningZone | null>(null);
  const [activeTab, setActiveTab] = useState("explore");

  const learningZones: LearningZone[] = [
    {
      id: "programming",
      name: "Code Academy",
      description: "Learn programming in interactive 3D environments",
      color: "#00ffff",
      position: [-6, 2, -4],
      icon: BookOpen,
      students: 234,
      difficulty: "Beginner"
    },
    {
      id: "science",
      name: "Science Lab",
      description: "Conduct virtual experiments and explore physics",
      color: "#ff00ff",
      position: [6, 2, -4],
      icon: Brain,
      students: 156,
      difficulty: "Intermediate"
    },
    {
      id: "collaboration",
      name: "Team Space",
      description: "Collaborate on projects with peers worldwide",
      color: "#ffff00",
      position: [0, 3, -8],
      icon: Users,
      students: 89,
      difficulty: "Advanced"
    },
    {
      id: "gaming",
      name: "Game Studio",
      description: "Create and play educational games",
      color: "#ff6600",
      position: [-4, 2, 2],
      icon: Gamepad2,
      students: 312,
      difficulty: "Intermediate"
    },
    {
      id: "presentation",
      name: "Presentation Hall",
      description: "Present and attend lectures in VR",
      color: "#9900ff",
      position: [4, 2, 2],
      icon: Video,
      students: 178,
      difficulty: "Beginner"
    }
  ];

  const handleZoneSelect = (zone: LearningZone) => {
    setSelectedZone(zone);
  };

  const handleEnterZone = (zone: LearningZone) => {
    console.log(`Entering ${zone.name}...`);
    // Here you would navigate to the specific learning environment
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
          Learning Metaverse Hub
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Explore immersive learning environments designed for collaborative education
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="explore">
            <Globe className="w-4 h-4 mr-2" />
            Explore
          </TabsTrigger>
          <TabsTrigger value="my-progress">
            <Trophy className="w-4 h-4 mr-2" />
            My Progress
          </TabsTrigger>
          <TabsTrigger value="live-sessions">
            <Zap className="w-4 h-4 mr-2" />
            Live Sessions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="explore" className="space-y-6">
          {/* 3D Metaverse View */}
          <Card className="bg-card/50 border-border/30">
            <CardContent className="p-0">
              <div className="relative w-full h-96 rounded-lg overflow-hidden">
                <Canvas camera={{ position: [0, 8, 12], fov: 60 }}>
                  <MetaverseScene zones={learningZones} onZoneSelect={handleZoneSelect} />
                </Canvas>
                
                <div className="absolute top-4 left-4 space-y-2">
                  <Badge variant="outline" className="border-cyan-400/50 text-cyan-400">
                    3D Learning Hub
                  </Badge>
                  <div className="text-sm text-white bg-black/50 rounded px-2 py-1">
                    Click on floating islands to explore
                  </div>
                </div>
                
                <div className="absolute bottom-4 right-4">
                  <Button size="sm" className="neon-glow">
                    <Headphones className="w-4 h-4 mr-2" />
                    Enter VR Mode
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Learning Zones Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learningZones.map((zone) => {
              const Icon = zone.icon;
              return (
                <Card key={zone.id} className="bg-card/50 border-border/30 hover:border-primary/50 transition-all cursor-pointer group">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-12 h-12 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${zone.color}20`, border: `1px solid ${zone.color}50` }}
                        >
                          <Icon className="w-6 h-6" style={{ color: zone.color }} />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{zone.name}</CardTitle>
                          <Badge variant="outline" className="text-xs">
                            {zone.difficulty}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{zone.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {zone.students}
                        </span>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => handleEnterZone(zone)}
                        className="group-hover:neon-glow"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Enter
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="my-progress" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-card/50 border-border/30">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">VR Explorer</span>
                    <Badge className="bg-yellow-500">Earned</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Code Master</span>
                    <Badge variant="outline">In Progress</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Team Player</span>
                    <Badge className="bg-green-500">Earned</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/30">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-purple-500" />
                  Learning Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Hours Learned</span>
                      <span>24/50</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '48%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Courses Completed</span>
                      <span>3/8</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-cyan-500 h-2 rounded-full" style={{ width: '37.5%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/30">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-green-500" />
                  Social Learning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Study Groups</span>
                    <span className="text-green-500 font-semibold">5</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Mentoring Sessions</span>
                    <span className="text-blue-500 font-semibold">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Peer Reviews</span>
                    <span className="text-purple-500 font-semibold">8</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="live-sessions" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-card/50 border-border/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Advanced React Patterns</CardTitle>
                  <Badge className="bg-red-500 animate-pulse">LIVE</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Deep dive into advanced React patterns with live coding examples
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm">
                    <Users className="w-4 h-4" />
                    <span>45 participants</span>
                  </div>
                  <Button size="sm" className="neon-glow">
                    Join Session
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>VR Physics Lab</CardTitle>
                  <Badge variant="outline">Starting in 15min</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Interactive physics experiments in virtual reality
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm">
                    <Users className="w-4 h-4" />
                    <span>23 registered</span>
                  </div>
                  <Button size="sm" variant="outline">
                    Set Reminder
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Selected Zone Modal */}
      {selectedZone && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl bg-card/95 border-border/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${selectedZone.color}20`, border: `1px solid ${selectedZone.color}50` }}
                  >
                    <selectedZone.icon className="w-6 h-6" style={{ color: selectedZone.color }} />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{selectedZone.name}</CardTitle>
                    <Badge variant="outline">{selectedZone.difficulty}</Badge>
                  </div>
                </div>
                <Button variant="ghost" onClick={() => setSelectedZone(null)}>
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg text-muted-foreground">{selectedZone.description}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{selectedZone.students}</div>
                  <div className="text-sm text-muted-foreground">Active Learners</div>
                </div>
                <div className="text-center p-4 bg-green-500/10 rounded-lg">
                  <div className="text-2xl font-bold text-green-400">4.8★</div>
                  <div className="text-sm text-muted-foreground">Rating</div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Button 
                  className="flex-1 neon-glow" 
                  onClick={() => handleEnterZone(selectedZone)}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Enter Learning Zone
                </Button>
                <Button variant="outline" className="flex-1">
                  <Headphones className="w-4 h-4 mr-2" />
                  Enter in VR
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};