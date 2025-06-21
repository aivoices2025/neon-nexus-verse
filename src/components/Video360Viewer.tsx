
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Volume2, VolumeX, Maximize, X, Headphones } from "lucide-react";

interface Video360ViewerProps {
  event: any;
  onClose: () => void;
  isVRMode: boolean;
}

export const Video360Viewer = ({ event, onClose, isVRMode }: Video360ViewerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const aframeSceneRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAFrameMode, setIsAFrameMode] = useState(false);

  useEffect(() => {
    // Load A-Frame script dynamically
    const script = document.createElement('script');
    script.src = 'https://aframe.io/releases/1.4.0/aframe.min.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const getVideoSource = (url: string) => {
    // Handle YouTube URLs by converting to embed format
    if (url.includes('youtube.com/watch?v=') || url.includes('youtu.be/')) {
      const videoId = url.includes('youtube.com') 
        ? url.split('v=')[1]?.split('&')[0]
        : url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
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

  const enterVRMode = () => {
    setIsAFrameMode(true);
    // Create A-Frame scene for proper VR support
    const aframeScene = `
      <a-scene embedded style="height: 100vh; width: 100vw;" vr-mode-ui="enabled: true">
        <a-assets>
          <video id="vrVideo" crossorigin="anonymous" playsinline style="display: none">
            <source src="${event.video_url}" type="video/mp4">
          </video>
        </a-assets>
        
        <a-videosphere src="#vrVideo" rotation="0 180 0"></a-videosphere>
        
        <a-camera>
          <a-gui-flex-container 
            flex-direction="row" 
            justify-content="center" 
            align-content="center"
            component-padding="0.1" 
            opacity="0.7" 
            width="3.5" 
            height="0.5"
            position="0 -1.5 -3"
          >
            <a-gui-button 
              id="vrPlayBtn"
              width="0.8" 
              height="0.4"
              value="PLAY"
              font-color="#000000"
              base-color="#00ff00"
              hover-color="#00aa00"
            ></a-gui-button>
          </a-gui-flex-container>
        </a-camera>
        
        <a-light type="ambient" color="#404040"></a-light>
      </a-scene>
    `;
    
    if (aframeSceneRef.current) {
      aframeSceneRef.current.innerHTML = aframeScene;
    }
  };

  const exitVRMode = () => {
    setIsAFrameMode(false);
    if (aframeSceneRef.current) {
      aframeSceneRef.current.innerHTML = '';
    }
  };

  if (isAFrameMode) {
    return (
      <div className="fixed inset-0 bg-black z-50">
        <div ref={aframeSceneRef} className="w-full h-full"></div>
        
        {/* VR Exit Button */}
        <div className="absolute top-4 right-4 z-60">
          <Button
            onClick={exitVRMode}
            className="bg-red-500/80 hover:bg-red-500 border-red-400"
            size="sm"
          >
            <X className="w-4 h-4 mr-2" />
            Exit VR
          </Button>
        </div>
        
        {/* VR Instructions */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-60">
          <Card className="bg-black/80 border-cyan-400/50 backdrop-blur-md">
            <CardContent className="p-3 text-center">
              <p className="text-cyan-400 text-sm">
                Move your head to look around • Use VR controllers if available
              </p>
            </CardContent>
          </Card>
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
            <div className="flex items-center space-x-2 mt-2">
              <Badge className="bg-red-500 hover:bg-red-500 animate-pulse">
                360° LIVE
              </Badge>
              {event.has_360_video && (
                <Badge variant="outline" className="border-cyan-400/50 text-cyan-400">
                  VR Compatible
                </Badge>
              )}
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>
        
        <CardContent className="p-0 flex-1 relative">
          {/* 360° Video Player */}
          <div className="relative w-full h-96 bg-gradient-to-b from-purple-900/20 to-black">
            {event.video_url && event.video_url.includes('youtube.com') ? (
              // YouTube 360° embed
              <iframe
                src={`${getVideoSource(event.video_url)}?enablejsapi=1&controls=1&modestbranding=1`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              // Direct video file
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                poster="https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=1920&h=1080&fit=crop"
                onClick={togglePlay}
                controls
              >
                <source src={event.video_url || "/api/placeholder-360-video"} type="video/mp4" />
                Your browser does not support 360° video.
              </video>
            )}
            
            {/* Video Controls Overlay */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center justify-between bg-black/70 rounded-lg p-3 backdrop-blur-md">
                <div className="flex items-center space-x-3">
                  {!event.video_url?.includes('youtube.com') && (
                    <>
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
                    </>
                  )}
                  
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
                {event.video_url?.includes('youtube.com') 
                  ? "Use YouTube's VR controls • Click VR button for immersive mode"
                  : "Drag to look around • Click Enter VR for headset mode"
                }
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
            
            {event.has_360_video && (
              <div className="p-4 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-lg border border-purple-400/20">
                <h4 className="font-semibold text-purple-400 mb-2">VR Experience Ready</h4>
                <p className="text-sm text-muted-foreground">
                  This event features 360° video content optimized for VR headsets including Meta Quest, Pico, and other WebXR-compatible devices. 
                  Use the "Enter VR" button for the full immersive experience.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
