import { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Mesh, Group, Vector3 } from 'three';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Share, 
  Presentation, 
  BookOpen,
  Palette,
  Hand,
  MousePointer,
  Volume2,
  Settings
} from 'lucide-react';

interface VRClassroomProps {
  user: any;
  isVRMode: boolean;
}

// VR Whiteboard Component
const VRWhiteboard = ({ position, rotation }: { position: [number, number, number], rotation: [number, number, number] }) => {
  const boardRef = useRef<Mesh>(null);
  const [drawings, setDrawings] = useState<any[]>([]);

  return (
    <group position={position} rotation={rotation}>
      {/* Whiteboard Surface */}
      <mesh ref={boardRef}>
        <planeGeometry args={[4, 2.5]} />
        <meshStandardMaterial 
          color="#f8f9fa" 
          transparent 
          opacity={0.95}
        />
      </mesh>
      
      {/* Whiteboard Frame */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[4.2, 2.7]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
      
      {/* Drawing Surface Overlay */}
      <mesh position={[0, 0, 0.001]}>
        <planeGeometry args={[3.8, 2.3]} />
        <meshBasicMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.1}
        />
      </mesh>
    </group>
  );
};

// VR Student Desk Component
const VRStudentDesk = ({ position, studentName, isActive }: { 
  position: [number, number, number], 
  studentName: string,
  isActive: boolean 
}) => {
  const deskRef = useRef<Group>(null);
  
  useFrame((state) => {
    if (deskRef.current && isActive) {
      deskRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.02;
    }
  });

  return (
    <group ref={deskRef} position={position}>
      {/* Desk */}
      <mesh position={[0, -0.4, 0]}>
        <boxGeometry args={[0.8, 0.05, 0.6]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      
      {/* Chair */}
      <mesh position={[0, -0.6, 0.2]}>
        <boxGeometry args={[0.4, 0.4, 0.05]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      
      {/* Student Avatar */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.15]} />
        <meshStandardMaterial 
          color={isActive ? "#00ff00" : "#7c3aed"} 
          emissive={isActive ? "#00ff00" : "#000000"}
          emissiveIntensity={isActive ? 0.2 : 0}
        />
      </mesh>
      
      {/* Student Name Tag */}
      <mesh position={[0, 0.3, 0]}>
        <planeGeometry args={[0.6, 0.1]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
      </mesh>
    </group>
  );
};

// Teacher's Podium Component
const TeacherPodium = ({ position }: { position: [number, number, number] }) => {
  return (
    <group position={position}>
      {/* Podium Base */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 1]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
      
      {/* Podium Top */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.45, 0.45, 0.1]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      
      {/* Control Panel */}
      <mesh position={[0, 0.1, 0.3]}>
        <boxGeometry args={[0.3, 0.05, 0.2]} />
        <meshStandardMaterial color="#333" emissive="#7c3aed" emissiveIntensity={0.1} />
      </mesh>
    </group>
  );
};

// VR Classroom Scene
const VRClassroomScene = ({ students, isTeacherView }: { students: any[], isTeacherView: boolean }) => {
  const { camera } = useThree();
  
  // Classroom layout
  const studentPositions = [
    [-2, 1, 2], [0, 1, 2], [2, 1, 2],
    [-2, 1, 4], [0, 1, 4], [2, 1, 4],
    [-3, 1, 6], [-1, 1, 6], [1, 1, 6], [3, 1, 6]
  ];

  return (
    <>
      {/* Classroom Floor */}
      <mesh position={[0, -1, 0]} receiveShadow>
        <boxGeometry args={[12, 0.1, 10]} />
        <meshStandardMaterial color="#2a2a3e" />
      </mesh>
      
      {/* Classroom Walls */}
      <mesh position={[0, 2, -5]}>
        <boxGeometry args={[12, 6, 0.2]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
      
      <mesh position={[-6, 2, 0]}>
        <boxGeometry args={[0.2, 6, 10]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
      
      <mesh position={[6, 2, 0]}>
        <boxGeometry args={[0.2, 6, 10]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>

      {/* Main Whiteboard */}
      <VRWhiteboard 
        position={[0, 1.5, -4.8]} 
        rotation={[0, 0, 0]} 
      />
      
      {/* Side Whiteboards */}
      <VRWhiteboard 
        position={[-5.8, 1.5, -2]} 
        rotation={[0, Math.PI / 2, 0]} 
      />
      
      <VRWhiteboard 
        position={[5.8, 1.5, -2]} 
        rotation={[0, -Math.PI / 2, 0]} 
      />

      {/* Teacher's Podium */}
      <TeacherPodium position={[0, 0.5, -2]} />

      {/* Student Desks */}
      {studentPositions.map((pos, index) => {
        const student = students[index];
        return (
          <VRStudentDesk
            key={index}
            position={pos as [number, number, number]}
            studentName={student ? student.name : `Student ${index + 1}`}
            isActive={student ? student.isActive : false}
          />
        );
      })}

      {/* Floating Information Panels */}
      <mesh position={[-4, 3, -2]}>
        <planeGeometry args={[2, 1]} />
        <meshBasicMaterial color="#7c3aed" transparent opacity={0.7} />
      </mesh>
      
      <mesh position={[4, 3, -2]}>
        <planeGeometry args={[2, 1]} />
        <meshBasicMaterial color="#00ffff" transparent opacity={0.7} />
      </mesh>

      {/* Classroom Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[0, 8, 2]} 
        intensity={1.5} 
        color="#ffffff"
        castShadow
      />
      <pointLight position={[0, 4, -4]} intensity={1.2} color="#7c3aed" />
      <pointLight position={[-4, 3, 0]} intensity={0.8} color="#00ffff" />
      <pointLight position={[4, 3, 0]} intensity={0.8} color="#ff00ff" />
      
      {/* Spotlight on teacher area */}
      <spotLight
        position={[0, 6, 0]}
        angle={Math.PI / 6}
        penumbra={0.2}
        intensity={2}
        color="#ffffff"
        target-position={[0, 0, -2]}
      />
    </>
  );
};

export const VRClassroom = ({ user, isVRMode }: VRClassroomProps) => {
  const [isTeaching, setIsTeaching] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [currentTool, setCurrentTool] = useState<'pointer' | 'pen' | 'eraser'>('pointer');
  const [classroomMode, setClassroomMode] = useState<'lecture' | 'discussion' | 'workshop'>('lecture');
  const [connectedStudents, setConnectedStudents] = useState(7);

  // Mock student data
  const students = [
    { name: "Alex Chen", isActive: true },
    { name: "Maria Garcia", isActive: true },
    { name: "David Kim", isActive: false },
    { name: "Sarah Wilson", isActive: true },
    { name: "Ahmed Hassan", isActive: true },
    { name: "Emma Thompson", isActive: false },
    { name: "Carlos Rodriguez", isActive: true },
    { name: "Priya Patel", isActive: true },
    { name: "Jonas Mueller", isActive: false },
    { name: "Lisa Chang", isActive: true }
  ];

  const toggleTeaching = () => {
    setIsTeaching(!isTeaching);
    if (!isTeaching) {
      setMicEnabled(true);
      console.log("🎓 Started teaching session in VR classroom");
    } else {
      console.log("📚 Ended teaching session");
    }
  };

  return (
    <div className="space-y-6">
      {/* VR Classroom Controls */}
      <Card className="bg-card/50 border-border/30 neon-glow backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-purple-400" />
            <span>🎓 VR Classroom Studio</span>
            {isTeaching && (
              <Badge variant="outline" className="border-red-500/50 text-red-400 animate-pulse">
                🔴 LIVE TEACHING
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Teaching Controls */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              onClick={toggleTeaching}
              className={isTeaching ? "neon-glow bg-red-600 hover:bg-red-700" : "neon-glow bg-green-600 hover:bg-green-700"}
              size="lg"
            >
              {isTeaching ? "End Class" : "Start Teaching"}
            </Button>
            
            <Button
              variant={micEnabled ? "default" : "outline"}
              onClick={() => setMicEnabled(!micEnabled)}
              className={micEnabled ? "neon-glow" : "border-border/30"}
            >
              {micEnabled ? <Mic className="w-4 h-4 mr-2" /> : <MicOff className="w-4 h-4 mr-2" />}
              {micEnabled ? "Mute" : "Unmute"}
            </Button>
            
            <Button
              variant={cameraEnabled ? "default" : "outline"}
              onClick={() => setCameraEnabled(!cameraEnabled)}
              className={cameraEnabled ? "neon-glow" : "border-border/30"}
            >
              {cameraEnabled ? <Video className="w-4 h-4 mr-2" /> : <VideoOff className="w-4 h-4 mr-2" />}
              {cameraEnabled ? "Stop Video" : "Start Video"}
            </Button>
            
            <Button variant="outline" className="border-border/30">
              <Share className="w-4 h-4 mr-2" />
              Share Screen
            </Button>
          </div>

          {/* VR Teaching Tools */}
          <Tabs value={currentTool} onValueChange={(value) => setCurrentTool(value as any)}>
            <TabsList className="grid w-full grid-cols-3 bg-card/50">
              <TabsTrigger value="pointer" className="data-[state=active]:neon-glow">
                <MousePointer className="w-4 h-4 mr-2" />
                Pointer
              </TabsTrigger>
              <TabsTrigger value="pen" className="data-[state=active]:neon-glow">
                <Palette className="w-4 h-4 mr-2" />
                Draw
              </TabsTrigger>
              <TabsTrigger value="eraser" className="data-[state=active]:neon-glow">
                <Hand className="w-4 h-4 mr-2" />
                Eraser
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="pointer" className="mt-4">
              <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg">
                <h4 className="font-semibold text-blue-400 mb-2">🖱️ VR Pointer Mode</h4>
                <p className="text-sm text-muted-foreground">
                  Use your Meta Quest 3S controllers to point at objects, highlight content, and navigate the classroom.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="pen" className="mt-4">
              <div className="p-4 bg-gradient-to-r from-green-500/10 to-cyan-500/10 rounded-lg">
                <h4 className="font-semibold text-green-400 mb-2">✍️ VR Drawing Mode</h4>
                <p className="text-sm text-muted-foreground">
                  Draw on whiteboards in 3D space using your controllers. Students can see your drawings in real-time.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="eraser" className="mt-4">
              <div className="p-4 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-lg">
                <h4 className="font-semibold text-red-400 mb-2">🧽 VR Eraser Mode</h4>
                <p className="text-sm text-muted-foreground">
                  Clear whiteboard content by pointing and using the trigger button on your controllers.
                </p>
              </div>
            </TabsContent>
          </Tabs>

          {/* Classroom Status */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 bg-card/30 rounded-lg border border-border/20">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <span className="font-medium">Students</span>
              </div>
              <p className="text-2xl font-bold text-cyan-400">{connectedStudents}</p>
              <p className="text-xs text-muted-foreground">Connected in VR</p>
            </div>
            
            <div className="p-3 bg-card/30 rounded-lg border border-border/20">
              <div className="flex items-center space-x-2">
                <Presentation className="w-4 h-4 text-green-400" />
                <span className="font-medium">Mode</span>
              </div>
              <p className="text-lg font-bold text-green-400 capitalize">{classroomMode}</p>
              <p className="text-xs text-muted-foreground">Teaching Style</p>
            </div>
            
            <div className="p-3 bg-card/30 rounded-lg border border-border/20">
              <div className="flex items-center space-x-2">
                <Volume2 className="w-4 h-4 text-purple-400" />
                <span className="font-medium">Audio</span>
              </div>
              <p className="text-lg font-bold text-purple-400">Spatial 3D</p>
              <p className="text-xs text-muted-foreground">VR Audio Active</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* VR Classroom 3D View */}
      <Card className="bg-card/50 border-border/30">
        <CardContent className="p-0">
          <div className={`relative w-full ${isVRMode ? 'h-screen' : 'h-96'} rounded-lg overflow-hidden`}>
            <Canvas 
              camera={{ 
                position: isVRMode ? [0, 1.6, 3] : [0, 3, 8], 
                fov: 60 
              }}
              shadows
            >
              <VRClassroomScene 
                students={students} 
                isTeacherView={true} 
              />
            </Canvas>
            
            {/* VR Classroom Overlay */}
            <div className="absolute top-4 left-4 space-y-2">
              <Badge variant="outline" className="border-purple-400/50 text-purple-400">
                🎓 VR Classroom
              </Badge>
              <div className="text-sm text-white bg-black/50 rounded px-2 py-1">
                {isVRMode ? "VR Teaching Mode Active" : "3D Classroom Preview"}
              </div>
            </div>
            
            {/* Student List Overlay */}
            <div className="absolute bottom-4 right-4 bg-black/70 rounded-lg p-3 backdrop-blur-md max-w-xs">
              <h4 className="font-semibold text-white mb-2">👥 Active Students</h4>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {students.filter(s => s.isActive).map((student, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-white">{student.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Teaching Status */}
            {isTeaching && (
              <div className="absolute top-4 right-4 bg-red-600/90 text-white px-4 py-2 rounded-lg backdrop-blur-md animate-pulse">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
                  <span className="font-bold">🔴 LIVE TEACHING</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* VR Classroom Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
          <CardContent className="p-4">
            <h3 className="font-semibold text-purple-400 mb-2">🖼️ 3D Whiteboards</h3>
            <p className="text-sm text-muted-foreground">
              Draw and write in 3D space. Students see your content from their perspective in real-time.
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20">
          <CardContent className="p-4">
            <h3 className="font-semibold text-cyan-400 mb-2">🌐 Global Classroom</h3>
            <p className="text-sm text-muted-foreground">
              Teach students from anywhere in the world in the same virtual space.
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
          <CardContent className="p-4">
            <h3 className="font-semibold text-green-400 mb-2">🎮 Interactive Learning</h3>
            <p className="text-sm text-muted-foreground">
              Students can raise hands, ask questions, and interact with 3D objects using VR controllers.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};