import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { WorkingVRButton } from './WorkingVRButton';

// VR Scene Content Component
const VRSceneContent = ({ children }: { children: React.ReactNode }) => {
  const { gl, camera } = useThree();
  const [isInVR, setIsInVR] = useState(false);
  
  useEffect(() => {
    // Enable XR on the renderer
    gl.xr.enabled = true;
    console.log('🥽 XR enabled on renderer');
    
    // Listen for XR session events
    const handleSessionStart = () => {
      console.log('✅ XR Session started - entering VR world');
      setIsInVR(true);
    };
    
    const handleSessionEnd = () => {
      console.log('🚪 XR Session ended - back to desktop');
      setIsInVR(false);
    };
    
    gl.xr.addEventListener('sessionstart', handleSessionStart);
    gl.xr.addEventListener('sessionend', handleSessionEnd);
    
    return () => {
      gl.xr.removeEventListener('sessionstart', handleSessionStart);
      gl.xr.removeEventListener('sessionend', handleSessionEnd);
    };
  }, [gl]);
  
  // Add camera positioning for VR
  useEffect(() => {
    if (isInVR) {
      // In VR, the headset controls the camera
      console.log('📷 VR camera control activated');
    } else {
      // Desktop mode - manual camera control
      camera.position.set(0, 3, 8);
      camera.lookAt(0, 0, 0);
    }
  }, [isInVR, camera]);
  
  return (
    <>
      {children}
      {/* VR Status Indicator */}
      {isInVR && (
        <mesh position={[0, 5, -2]}>
          <planeGeometry args={[2, 0.5]} />
          <meshBasicMaterial color="#00ff00" />
        </mesh>
      )}
    </>
  );
};

interface VRCanvasProps {
  children: React.ReactNode;
  className?: string;
  onVRStateChange?: (isVRActive: boolean) => void;
}

export const VRCanvas = ({ children, className = '', onVRStateChange }: VRCanvasProps) => {
  const [isVRActive, setIsVRActive] = useState(false);
  
  const handleVRStateChange = useCallback((vrActive: boolean) => {
    console.log('🔄 VR State changed:', vrActive);
    setIsVRActive(vrActive);
    onVRStateChange?.(vrActive);
  }, [onVRStateChange]);
  
  return (
    <div className={`relative ${className}`} style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [0, 3, 8], fov: 60 }}
        onCreated={({ gl }) => {
          console.log('🎨 VR Canvas created');
          // Store reference for VR button access
          (window as any).__vrCanvas = { gl };
        }}
        style={{ 
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          width: '100%',
          height: '100%'
        }}
      >
        <VRSceneContent>
          {children}
        </VRSceneContent>
      </Canvas>
      
      {/* VR Control Button */}
      <div className="absolute bottom-4 right-4">
        <WorkingVRButton 
          size="lg"
          className="shadow-2xl bg-purple-600 hover:bg-purple-700"
          onVRStateChange={handleVRStateChange}
        />
      </div>
      
      {/* VR Status Display */}
      {isVRActive && (
        <div className="absolute top-4 left-4 bg-green-600/90 text-white px-4 py-2 rounded-lg backdrop-blur-md">
          <p className="text-sm font-bold flex items-center">
            🔴 VR MODE ACTIVE
          </p>
          <p className="text-xs">
            Look around with your headset!
          </p>
        </div>
      )}
      
      {!isVRActive && (
        <div className="absolute bottom-4 left-4 bg-black/70 rounded-lg p-3 backdrop-blur-md">
          <p className="text-white text-sm font-semibold mb-1">
            🥽 Meta Quest 3S Ready
          </p>
          <p className="text-white text-xs">
            Click "Enter VR" to start immersive experience
          </p>
        </div>
      )}
    </div>
  );
};