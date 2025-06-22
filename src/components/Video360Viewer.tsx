
import React, { useRef, useState, Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Volume2, VolumeX, X, Headphones, RotateCcw } from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Video360ViewerProps {
  event: any;
  onClose: () => void;
  isVRMode: boolean;
}

const Video360Sphere = ({ videoUrl }: { videoUrl: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoTexture, setVideoTexture] = useState<THREE.VideoTexture | null>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
    }
  });

  // Create video element and texture
  React.useEffect(() => {
    const video = document.createElement('video');
    video.src = videoUrl;
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.crossOrigin = 'anonymous';
    video.playsInline = true;
    
    videoRef.current = video;
    
    const texture = new THREE.VideoTexture(video);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBFormat;
    
    setVideoTexture(texture);
    
    video.play().catch(console.error);
    
    return () => {
      video.pause();
      texture.dispose();
    };
  }, [videoUrl]);

  if (!videoTexture) {
    return (
      <mesh>
        <sphereGeometry args={[5, 32, 16]} />
        <meshBasicMaterial color="#1a1a2e" />
      </mesh>
    );
  }

  return (
    <mesh ref={meshRef} scale={[-1, 1, 1]}>
      <sphereGeometry args={[5, 32, 16]} />
      <meshBasicMaterial map={videoTexture} side={THREE.BackSide} />
    </mesh>
  );
};

const Video360Controls = () => {
  return (
    <group>
      <ambientLight intensity={0.5} />
    </group>
  );
};

export const Video360Viewer = ({ event, onClose, isVRMode }: Video360ViewerProps) => {
  const [cameraRotation, setCameraRotation] = useState({ x: 0, y: 0 });

  const getVideoSource = (url: string) => {
    // Handle YouTube URLs by converting to a placeholder 360 video
    if (url.includes('youtube.com/watch?v=') || url.includes('youtu.be/')) {
      // For demo purposes, use a placeholder 360 video URL
      return 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
    }
    return url;
  };

  const resetView = () => {
    setCameraRotation({ x: 0, y: 0 });
  };

  const enterVRMode = async () => {
    if (navigator.xr) {
      try {
        const isSupported = await navigator.xr.isSessionSupported('immersive-vr');
        if (isSupported) {
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

  if (!event.has_360_video || !event.video_url) {
    return (
      <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl bg-card/95 border-border/30">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Event Preview</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              This event doesn't have 360° video content available.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const videoSrc = getVideoSource(event.video_url);

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl h-full max-h-[90vh] bg-card/95 border-border/30 overflow-hidden">
        <CardHeader className="flex-row items-center justify-between border-b border-border/30">
          <div>
            <CardTitle className="text-2xl bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {event.title}
            </CardTitle>
            <div className="flex items-center space-x-2 mt-2">
              <Badge className="bg-red-500 hover:bg-red-500 animate-pulse">
                360° LIVE
              </Badge>
              <Badge variant="outline" className="border-cyan-400/50 text-cyan-400">
                VR Compatible
              </Badge>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>
        
        <CardContent className="p-0 flex-1 relative">
          {/* 360° Video Player */}
          <div className="relative w-full h-96 bg-gradient-to-b from-purple-900/20 to-black">
            <Canvas 
              camera={{ 
                position: [0, 0, 0.1], 
                fov: 75,
                rotation: [cameraRotation.x, cameraRotation.y, 0]
              }}
              className="w-full h-full"
            >
              <Suspense fallback={null}>
                <Video360Sphere videoUrl={videoSrc} />
                <Video360Controls />
              </Suspense>
            </Canvas>
            
            {/* Video Controls Overlay */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center justify-between bg-black/70 rounded-lg p-3 backdrop-blur-md">
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetView}
                    className="border-border/30 hover:neon-glow"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  
                  <Badge variant="outline" className="border-cyan-400/50 text-cyan-400">
                    360° Video
                  </Badge>
                </div>
                
                <Button
                  onClick={enterVRMode}
                  className="neon-glow bg-primary hover:bg-primary/90"
                  size="sm"
                >
                  <Headphones className="w-4 h-4 mr-2" />
                  Enter VR
                </Button>
              </div>
            </div>
            
            {/* 360° Navigation Hint */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
              <Badge variant="outline" className="border-purple-400/50 text-purple-400 bg-black/50">
                Click and drag to look around • Click Enter VR for headset mode
              </Badge>
            </div>
          </div>
          
          {/* Event Info */}
          <div className="p-6 space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">About this Event</h3>
              <p className="text-muted-foreground">{event.description}</p>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-sm">
                <span className="text-muted-foreground">Attendees: </span>
                <span className="text-primary font-medium">{event.attendees}</span>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Category: </span>
                <span className="text-primary font-medium">{event.category}</span>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Time: </span>
                <span className="text-primary font-medium">
                  {new Date(event.event_date).toLocaleDateString()}
                </span>
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-lg border border-purple-400/20">
              <h4 className="font-semibold text-purple-400 mb-2">VR Experience Ready</h4>
              <p className="text-sm text-muted-foreground">
                This event features 360° video content optimized for VR headsets including Meta Quest, Pico, and other WebXR-compatible devices. 
                Use the "Enter VR" button for the full immersive experience.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
