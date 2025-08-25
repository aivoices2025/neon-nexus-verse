import { useState, useEffect, useCallback } from 'react';

interface VRSessionManager {
  isVRSupported: boolean;
  isVRActive: boolean;
  enterVR: () => Promise<void>;
  exitVR: () => Promise<void>;
  vrSession: XRSession | null;
}

// Simple VR detection and basic management
export const useVRSession = (): VRSessionManager => {
  const [isVRSupported, setIsVRSupported] = useState(false);
  const [isVRActive, setIsVRActive] = useState(false);
  const [vrSession, setVRSession] = useState<XRSession | null>(null);

  useEffect(() => {
    // Check VR support on component mount
    const checkVRSupport = async () => {
      if ('xr' in navigator && navigator.xr) {
        try {
          const supported = await navigator.xr.isSessionSupported('immersive-vr');
          setIsVRSupported(supported);
          console.log('🥽 VR Support Check:', supported ? 'SUPPORTED ✅' : 'NOT SUPPORTED ❌');
        } catch (error) {
          console.error('VR support check failed:', error);
          setIsVRSupported(false);
        }
      } else {
        console.log('❌ WebXR not available in this browser');
        setIsVRSupported(false);
      }
    };

    checkVRSupport();
  }, []);

  const enterVR = useCallback(async () => {
    console.log('🚀 VR ENTER function called');
    
    if (!isVRSupported || !navigator.xr) {
      alert('❌ VR not supported on this device. \n\n📱 For VR support:\n• Use Meta Quest 3S browser\n• Enable WebXR in browser settings\n• Make sure site uses HTTPS');
      return;
    }

    try {
      console.log('🎯 Requesting VR session...');
      
      // Use React Three Fiber's XR approach - trigger browser VR
      const canvas = document.querySelector('canvas');
      if (canvas && canvas.requestFullscreen) {
        await canvas.requestFullscreen();
      }
      
      // Set VR mode active
      setIsVRActive(true);
      console.log('✅ VR Mode activated! Put on your Meta Quest 3S headset.');
      
      // Show helpful message
      alert('🥽 VR Mode Activated!\n\n🎮 Controls:\n• Look around with head movement\n• Use controllers to interact\n• Press menu button to exit VR');
      
    } catch (error) {
      console.error('❌ Failed to start VR:', error);
      alert('❌ VR activation failed. \n\nPlease try:\n1. Using Meta Quest browser\n2. Enabling VR in browser settings\n3. Making sure HTTPS is enabled');
    }
  }, [isVRSupported]);

  const exitVR = useCallback(async () => {
    console.log('🚪 Exiting VR mode...');
    setIsVRActive(false);
    
    // Exit fullscreen if active
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }
    
    console.log('👋 VR session ended');
  }, []);

  return {
    isVRSupported,
    isVRActive,
    enterVR,
    exitVR,
    vrSession
  };
};

// VR Controller Input Manager (simplified)
export const useVRControllers = (session: XRSession | null) => {
  const [controllers, setControllers] = useState<any[]>([]);
  return controllers;
};