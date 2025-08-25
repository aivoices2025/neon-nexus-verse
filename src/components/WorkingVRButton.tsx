import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Headphones } from 'lucide-react';

interface WorkingVRButtonProps {
  onVRStateChange?: (isVRActive: boolean) => void;
  className?: string;
  size?: 'sm' | 'lg';
}

export const WorkingVRButton = ({ onVRStateChange, className = '', size = 'lg' }: WorkingVRButtonProps) => {
  const [isVRSupported, setIsVRSupported] = useState(false);
  const [isVRActive, setIsVRActive] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkVRSupport();
  }, []);

  const checkVRSupport = async () => {
    console.log('🔍 Checking VR support...');
    setIsChecking(true);
    
    try {
      if ('xr' in navigator && navigator.xr) {
        const supported = await navigator.xr.isSessionSupported('immersive-vr');
        setIsVRSupported(supported);
        console.log('🥽 VR Support Result:', supported ? '✅ SUPPORTED' : '❌ NOT SUPPORTED');
      } else {
        console.log('❌ WebXR not available in this browser');
        setIsVRSupported(false);
      }
    } catch (error) {
      console.error('VR support check failed:', error);
      setIsVRSupported(false);
    }
    
    setIsChecking(false);
  };

  const handleVRClick = async () => {
    console.log('🎯 Working VR Button clicked!', { 
      isVRSupported, 
      isVRActive, 
      hasXR: 'xr' in navigator 
    });

    if (!isVRSupported) {
      alert('🥽 VR Not Available\\n\\nTo use VR:\\n• Use Meta Quest 3S browser\\n• Open this site in VR browser\\n• Make sure WebXR is enabled\\n• Try Chrome or Edge with VR headset');
      return;
    }

    if (isVRActive) {
      // Exit VR mode
      console.log('🚪 Exiting VR...');
      setIsVRActive(false);
      onVRStateChange?.(false);
      
      // Exit fullscreen if active
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
      return;
    }

    try {
      console.log('🚀 Attempting to enter VR...');

      // Step 1: Try React Three Fiber XR approach
      const canvas = document.querySelector('canvas');
      if (canvas) {
        console.log('🎨 Canvas found, attempting VR session...');
        
        // Try to get the Three.js WebGL context
        const vrCanvas = (window as any).__vrCanvas;
        if (vrCanvas && vrCanvas.gl) {
          console.log('🔗 Found VR Canvas context, requesting session...');
          
          try {
            const session = await navigator.xr!.requestSession('immersive-vr', {
              requiredFeatures: ['local-floor'],
              optionalFeatures: ['hand-tracking', 'bounded-floor']
            });
            
            // Connect to Three.js renderer
            await vrCanvas.gl.xr.setSession(session);
            console.log('✅ VR Session connected to Three.js!');
            
            setIsVRActive(true);
            onVRStateChange?.(true);
            
            session.addEventListener('end', () => {
              console.log('🔚 VR session ended');
              setIsVRActive(false);
              onVRStateChange?.(false);
            });
            
            return;
          } catch (sessionError) {
            console.error('❌ VR Canvas session failed:', sessionError);
          }
        }


        // Method 3: Fullscreen approach
        console.log('📱 Trying fullscreen approach...');
        try {
          await canvas.requestFullscreen();
          console.log('✅ Fullscreen activated');
          
          setIsVRActive(true);
          onVRStateChange?.(true);
          
          // Show VR instructions
          setTimeout(() => {
            alert('🥽 VR Mode Activated!\\n\\n📱 Meta Quest 3S Instructions:\\n1. Put on your headset\\n2. Look for VR icon in browser\\n3. Click VR icon to enter VR\\n4. Use controllers to interact\\n\\n🎮 Controls:\\n• Trigger: Select/Click\\n• Grip: Grab objects\\n• Joystick: Move around');
          }, 1000);
          
        } catch (fullscreenError) {
          console.error('❌ Fullscreen failed:', fullscreenError);
          throw fullscreenError;
        }
      } else {
        throw new Error('No canvas element found');
      }

    } catch (error) {
      console.error('❌ VR activation completely failed:', error);
      
      // Show helpful error message
      let errorMessage = '❌ VR Activation Failed\\n\\n';
      
      if (error instanceof Error) {
        if (error.message.includes('NotSupportedError')) {
          errorMessage += '• VR headset not detected\\n• Make sure Meta Quest 3S is connected\\n• Try using Meta Quest browser\\n• Check headset settings';
        } else if (error.message.includes('SecurityError')) {
          errorMessage += '• Security error - HTTPS required\\n• Try refreshing the page\\n• Check browser permissions\\n• Enable WebXR in browser settings';
        } else if (error.message.includes('NotAllowedError')) {
          errorMessage += '• VR permission denied\\n• Allow VR access in browser\\n• Check browser settings\\n• Try different browser';
        } else if (error.message.includes('canvas')) {
          errorMessage += '• 3D canvas not ready\\n• Try refreshing page\\n• Wait for page to fully load\\n• Check browser compatibility';
        } else {
          errorMessage += `• Error: ${error.message}\\n• Try refreshing page\\n• Check browser console\\n• Ensure Meta Quest 3S is connected`;
        }
      } else {
        errorMessage += '• Unknown error occurred\\n• Try refreshing the page\\n• Check Meta Quest 3S connection\\n• Use Meta Quest browser';
      }
      
      alert(errorMessage);
    }
  };

  const getButtonText = () => {
    if (isChecking) return 'Checking VR...';
    if (!isVRSupported) return 'VR Not Available';
    if (isVRActive) return 'Exit VR Mode';
    return 'Enter VR Mode';
  };

  const getButtonVariant = () => {
    if (!isVRSupported) return 'outline';
    if (isVRActive) return 'destructive';
    return 'default';
  };

  const getButtonIcon = () => {
    if (isVRActive) return '🔴';
    if (isVRSupported) return '🥽';
    return '⚠️';
  };

  return (
    <Button
      onClick={handleVRClick}
      disabled={isChecking}
      variant={getButtonVariant() as any}
      size={size}
      className={`${className} ${isVRActive ? 'animate-pulse bg-red-600 hover:bg-red-700' : ''} ${!isVRSupported ? 'opacity-60' : 'hover:scale-105'} transition-all duration-300 font-bold shadow-lg`}
    >
      <Headphones className="w-4 h-4 mr-2" />
      {getButtonText()}
      <span className="ml-2 text-lg">
        {getButtonIcon()}
      </span>
    </Button>
  );
};