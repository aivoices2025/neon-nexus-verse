
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Video, Users, Mic, MicOff, Camera, CameraOff } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

interface VRPreviewProps {
  event: any;
  onClose: () => void;
}

const VirtualStage = () => {
  return (
    <>
      {/* Stage */}
      <mesh position={[0, -2, 0]} receiveShadow>
        <boxGeometry args={[10, 0.5, 6]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
      
      {/* Neon lights */}
      <mesh position={[-3, 2, -2]}>
        <sphereGeometry args={[0.2]} />
        <meshBasicMaterial color="#ff00ff" />
      </mesh>
      <mesh position={[3, 2, -2]}>
        <sphereGeometry args={[0.2]} />
        <meshBasicMaterial color="#00ffff" />
      </mesh>
      <mesh position={[0, 3, -2]}>
        <sphereGeometry args={[0.2]} />
        <meshBasicMaterial color="#ff00ff" />
      </mesh>
      
      {/* Ambient lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 10, 0]} intensity={1} color="#ff00ff" />
      <pointLight position={[-5, 5, 5]} intensity={0.8} color="#00ffff" />
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#ff00ff" />
    </>
  );
};

export const VRPreview = ({ event, onClose }: VRPreviewProps) => {
  const [micEnabled, setMicEnabled] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [vrMode, setVrMode] = useState(false);

  const handleEnterVR = async () => {
    if (navigator.xr) {
      try {
        const isSupported = await navigator.xr.isSessionSupported('immersive-vr');
        if (isSupported) {
          setVrMode(true);
          // In a real app, this would initialize WebXR session
          console.log("VR session would start here");
        } else {
          alert("VR not supported on this device");
        }
      } catch (error) {
        console.error("VR check failed:", error);
        alert("VR not available");
      }
    } else {
      alert("WebXR not supported in this browser");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl h-full max-h-[90vh] bg-card/95 border-border/30 overflow-hidden">
        <CardHeader className="flex-row items-center justify-between border-b border-border/30">
          <div>
            <CardTitle className="text-2xl bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {event.title}
            </CardTitle>
            <div className="flex items-center space-x-4 mt-2">
              <Badge className="bg-green-500 hover:bg-green-500">
                <Users className="w-3 h-3 mr-1" />
                {event.attendees} attending
              </Badge>
              {event.isLive && (
                <Badge className="bg-red-500 hover:bg-red-500 animate-pulse">
                  LIVE
                </Badge>
              )}
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>
        
        <CardContent className="p-0 flex-1 flex flex-col">
          {/* 3D Preview */}
          <div className="flex-1 relative">
            <Canvas 
              camera={{ position: [0, 2, 8], fov: 60 }}
              className="bg-gradient-to-b from-purple-900/20 to-black"
            >
              <VirtualStage />
              <OrbitControls enablePan={false} maxDistance={15} minDistance={3} />
            </Canvas>
            
            {/* Overlay UI */}
            <div className="absolute top-4 left-4 space-y-2">
              <Badge variant="outline" className="border-cyan-400/50 text-cyan-400">
                3D Preview
              </Badge>
              <div className="text-sm text-muted-foreground bg-black/50 rounded px-2 py-1">
                Click and drag to explore
              </div>
            </div>
            
            {/* Virtual Stage Text Overlay */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <h3 className="text-2xl font-bold text-white text-center bg-black/50 px-6 py-3 rounded">
                Virtual Stage
              </h3>
            </div>
          </div>
          
          {/* Controls */}
          <div className="border-t border-border/30 p-4 bg-card/50">
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <Button
                  variant={micEnabled ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMicEnabled(!micEnabled)}
                  className={micEnabled ? "neon-glow" : "border-border/30"}
                >
                  {micEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </Button>
                <Button
                  variant={cameraEnabled ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCameraEnabled(!cameraEnabled)}
                  className={cameraEnabled ? "neon-glow" : "border-border/30"}
                >
                  {cameraEnabled ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
                </Button>
              </div>
              
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => console.log("Joining desktop mode")}
                  className="border-border/30"
                >
                  <Video className="w-4 h-4 mr-2" />
                  Join (Desktop)
                </Button>
                <Button 
                  onClick={handleEnterVR}
                  className="neon-glow bg-primary hover:bg-primary/90"
                >
                  <Video className="w-4 h-4 mr-2" />
                  Enter VR
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
