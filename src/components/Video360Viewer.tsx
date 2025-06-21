
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Volume2, VolumeX, X, Headphones, RotateCcw } from "lucide-react";

interface Video360ViewerProps {
  event: any;
  onClose: () => void;
  isVRMode: boolean;
}

export const Video360Viewer = ({ event, onClose, isVRMode }: Video360ViewerProps) => {
  const aframeContainerRef = useRef<HTMLDivElement>(null);
  const [isAFrameLoaded, setIsAFrameLoaded] = useState(false);
  const [isVRActive, setIsVRActive] = useState(false);

  useEffect(() => {
    // Load A-Frame script dynamically
    if (!document.querySelector('script[src*="aframe"]')) {
      const script = document.createElement('script');
      script.src = 'https://aframe.io/releases/1.4.0/aframe.min.js';
      script.async = true;
      script.onload = () => {
        console.log('A-Frame loaded successfully');
        setIsAFrameLoaded(true);
      };
      document.head.appendChild(script);
    } else {
      setIsAFrameLoaded(true);
    }

    return () => {
      // Clean up A-Frame scene when component unmounts
      if (aframeContainerRef.current) {
        aframeContainerRef.current.innerHTML = '';
      }
    };
  }, []);

  useEffect(() => {
    if (isAFrameLoaded && aframeContainerRef.current && event.has_360_video && event.video_url) {
      createAFrameScene();
    }
  }, [isAFrameLoaded, event]);

  const getVideoSource = (url: string) => {
    // Handle YouTube URLs by converting to embed format
    if (url.includes('youtube.com/watch?v=') || url.includes('youtu.be/')) {
      const videoId = url.includes('youtube.com') 
        ? url.split('v=')[1]?.split('&')[0]
        : url.split('youtu.be/')[1]?.split('?')[0];
      // For A-Frame, we need a direct video file, so we'll use a placeholder 360 video
      return 'https://ucarecdn.com/fadab25d-0b3a-45f7-8ef5-85318393d0ee/';
    }
    return url;
  };

  const createAFrameScene = () => {
    if (!aframeContainerRef.current) return;

    const videoSrc = getVideoSource(event.video_url);
    
    const aframeHTML = `
      <a-scene 
        embedded 
        style="height: 500px; width: 100%;" 
        vr-mode-ui="enabled: true"
        background="color: #000"
      >
        <a-assets>
          <video 
            id="vrVideo" 
            autoplay 
            loop 
            crossorigin="anonymous"
            src="${videoSrc}"
            muted
          ></video>
        </a-assets>
        
        <a-videosphere 
          src="#vrVideo" 
          rotation="0 180 0"
        ></a-videosphere>
        
        <a-camera 
          look-controls="enabled: true"
          wasd-controls="enabled: false"
          position="0 0 0"
        >
          <a-cursor
            position="0 0 -1"
            geometry="primitive: ring; radiusInner: 0.02; radiusOuter: 0.03"
            material="color: white; shader: flat"
          ></a-cursor>
        </a-camera>
        
        <a-light type="ambient" color="#404040"></a-light>
      </a-scene>
    `;
    
    aframeContainerRef.current.innerHTML = aframeHTML;
  };

  const enterVRMode = () => {
    const aframeScene = aframeContainerRef.current?.querySelector('a-scene') as any;
    if (aframeScene && aframeScene.enterVR) {
      aframeScene.enterVR();
      setIsVRActive(true);
    }
  };

  const resetView = () => {
    const camera = aframeContainerRef.current?.querySelector('a-camera') as any;
    if (camera) {
      camera.setAttribute('rotation', '0 0 0');
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
            {!isAFrameLoaded ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading VR Player...</p>
                </div>
              </div>
            ) : (
              <div ref={aframeContainerRef} className="w-full h-full" />
            )}
            
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
                  disabled={!isAFrameLoaded}
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
