
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Volume2, VolumeX, Maximize, X } from "lucide-react";

interface Video360ViewerProps {
  event: any;
  onClose: () => void;
  isVRMode: boolean;
}

export const Video360Viewer = ({ event, onClose, isVRMode }: Video360ViewerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    // Initialize 360° video controls
    if (videoRef.current) {
      videoRef.current.addEventListener('loadedmetadata', () => {
        console.log("360° video loaded");
      });
    }

    // WebXR integration
    if (isVRMode && 'xr' in navigator) {
      initializeWebXR();
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };
  }, [isVRMode]);

  const initializeWebXR = async () => {
    try {
      if (navigator.xr) {
        const isSupported = await navigator.xr.isSessionSupported('immersive-vr');
        if (isSupported) {
          console.log("WebXR VR session supported");
          // In a real implementation, this would start WebXR session
        }
      }
    } catch (error) {
      console.error("WebXR initialization failed:", error);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen && videoRef.current) {
      videoRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  if (isVRMode) {
    return (
      <div className="fixed inset-0 bg-black z-50">
        <div 
          className="w-full h-full relative"
          style={{
            background: "radial-gradient(circle, #1a1a2e 0%, #000000 100%)"
          }}
        >
          {/* VR 360° Video Container */}
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            style={{
              transform: "perspective(1000px) rotateY(0deg)",
              filter: "brightness(1.2) contrast(1.1)"
            }}
            poster="https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=1920&h=1080&fit=crop"
            autoPlay
            loop
            muted={isMuted}
          >
            <source src="/api/placeholder-360-video" type="video/mp4" />
            Your browser does not support 360° video.
          </video>
          
          {/* VR UI Overlay */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <Card className="bg-black/70 border-purple-500/50 backdrop-blur-md">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={togglePlay}
                    className="border-purple-400/50 text-purple-400 hover:bg-purple-400/20"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleMute}
                    className="border-purple-400/50 text-purple-400 hover:bg-purple-400/20"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                  
                  <Badge className="bg-red-500/20 text-red-400 border-red-400/50">
                    LIVE VR
                  </Badge>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onClose}
                    className="border-red-400/50 text-red-400 hover:bg-red-400/20"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* VR Instructions */}
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
            <Card className="bg-black/70 border-cyan-400/50 backdrop-blur-md">
              <CardContent className="p-3 text-center">
                <p className="text-cyan-400 text-sm">
                  Move your head to look around • Use VR controllers to interact
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl h-full max-h-[90vh] bg-card/95 border-border/30 overflow-hidden">
        <CardHeader className="flex-row items-center justify-between border-b border-border/30">
          <div>
            <CardTitle className="text-2xl bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {event.title}
            </CardTitle>
            <Badge className="bg-red-500 hover:bg-red-500 animate-pulse mt-2">
              360° LIVE
            </Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>
        
        <CardContent className="p-0 flex-1 relative">
          {/* 360° Video Player */}
          <div className="relative w-full h-96 bg-gradient-to-b from-purple-900/20 to-black">
            <video
              ref={videoRef}
              className="w-full h-full object-cover rounded-lg"
              poster="https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=1920&h=1080&fit=crop"
              onClick={togglePlay}
            >
              <source src="/api/placeholder-360-video" type="video/mp4" />
              Your browser does not support 360° video.
            </video>
            
            {/* Video Controls Overlay */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center justify-between bg-black/70 rounded-lg p-3 backdrop-blur-md">
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={togglePlay}
                    className="border-border/30 hover:neon-glow"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleMute}
                    className="border-border/30 hover:neon-glow"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                  
                  <Badge variant="outline" className="border-cyan-400/50 text-cyan-400">
                    360° Video
                  </Badge>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleFullscreen}
                  className="border-border/30 hover:neon-glow"
                >
                  <Maximize className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* 360° Navigation Hint */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
              <Badge variant="outline" className="border-purple-400/50 text-purple-400 bg-black/50">
                Drag to look around • Click for VR mode
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
                <span className="text-primary font-medium">{event.date}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
