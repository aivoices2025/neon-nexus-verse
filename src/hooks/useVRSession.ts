import { useState, useEffect, useCallback } from 'react';

interface VRSessionManager {
  isVRSupported: boolean;
  isVRActive: boolean;
  enterVR: () => Promise<void>;
  exitVR: () => Promise<void>;
  vrSession: XRSession | null;
}

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
          console.log('🥽 VR Support Check:', supported ? 'SUPPORTED' : 'NOT SUPPORTED');
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
    if (!isVRSupported || !navigator.xr) {
      alert('❌ VR not supported on this device or browser. Please use a Meta Quest 3S with a WebXR compatible browser.');
      return;
    }

    try {
      console.log('🚀 Starting VR session...');
      
      // Request VR session with all the features we need
      const session = await navigator.xr.requestSession('immersive-vr', {
        requiredFeatures: ['local-floor'],
        optionalFeatures: [
          'hand-tracking',
          'hit-test',
          'anchors',
          'plane-detection'
        ]
      });

      console.log('✅ VR Session started successfully!');
      
      // Set up session event handlers
      session.addEventListener('end', () => {
        console.log('🔚 VR session ended');
        setIsVRActive(false);
        setVRSession(null);
      });

      session.addEventListener('select', (event) => {
        console.log('🎯 VR controller trigger pressed');
        // Handle controller trigger events here
      });

      session.addEventListener('squeeze', (event) => {
        console.log('✊ VR controller grip pressed');
        // Handle controller grip events here
      });

      // Set up WebGL context for VR
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2', { xrCompatible: true });
      
      if (!gl) {
        throw new Error('WebGL2 not available');
      }

      // Make the WebGL context XR compatible
      await gl.makeXRCompatible();

      // Create XR WebGL layer
      const layer = new XRWebGLLayer(session, gl);
      session.updateRenderState({ baseLayer: layer });

      // Set up reference space
      const referenceSpace = await session.requestReferenceSpace('local-floor');

      // Start the render loop
      const render = (time: number, frame: XRFrame) => {
        if (session) {
          session.requestAnimationFrame(render);
          
          // Get viewer pose
          const pose = frame.getViewerPose(referenceSpace);
          if (pose) {
            // Render VR content here
            gl.clearColor(0.1, 0.1, 0.2, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            
            // Render for each eye
            for (const view of pose.views) {
              const viewport = layer.getViewport(view);
              gl.viewport(viewport.x, viewport.y, viewport.width, viewport.height);
              
              // Render 3D scene for this eye
              // This is where your Three.js scene would be rendered
            }
          }
        }
      };

      session.requestAnimationFrame(render);

      setVRSession(session);
      setIsVRActive(true);

      // Show success message
      console.log('🎉 Welcome to VR! Use your Meta Quest 3S controllers to interact.');

    } catch (error) {
      console.error('❌ Failed to start VR session:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('NotSupportedError')) {
          alert('🥽 VR mode requires a compatible headset. Please make sure your Meta Quest 3S is connected and WebXR is enabled.');
        } else if (error.message.includes('SecurityError')) {
          alert('🔒 VR requires HTTPS. Please access the site via HTTPS for VR functionality.');
        } else {
          alert(`❌ VR Error: ${error.message}`);
        }
      } else {
        alert('❌ Unknown VR error occurred. Please try again.');
      }
    }
  }, [isVRSupported]);

  const exitVR = useCallback(async () => {
    if (vrSession) {
      try {
        await vrSession.end();
        console.log('👋 VR session ended successfully');
      } catch (error) {
        console.error('Error ending VR session:', error);
      }
    }
  }, [vrSession]);

  return {
    isVRSupported,
    isVRActive,
    enterVR,
    exitVR,
    vrSession
  };
};

// VR Controller Input Manager
export const useVRControllers = (session: XRSession | null) => {
  const [controllers, setControllers] = useState<XRInputSource[]>([]);

  useEffect(() => {
    if (!session) return;

    const handleInputSourcesChange = () => {
      setControllers(Array.from(session.inputSources));
    };

    session.addEventListener('inputsourceschange', handleInputSourcesChange);
    handleInputSourcesChange(); // Initial check

    return () => {
      session.removeEventListener('inputsourceschange', handleInputSourcesChange);
    };
  }, [session]);

  return controllers;
};