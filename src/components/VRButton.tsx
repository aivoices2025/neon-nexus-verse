import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Headphones } from 'lucide-react';

interface VRButtonProps {
  onVRStateChange?: (isVRActive: boolean) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const VRButton = ({ onVRStateChange, className = '', size = 'lg' }: VRButtonProps) => {
  const [isVRSupported, setIsVRSupported] = useState(false);
  const [isVRActive, setIsVRActive] = useState(false);
  const [isCheckingVR, setIsCheckingVR] = useState(true);

  useEffect(() => {
    checkVRSupport();
  }, []);

  const checkVRSupport = async () => {
    setIsCheckingVR(true);
    
    if ('xr' in navigator && navigator.xr) {
      try {
        const supported = await navigator.xr.isSessionSupported('immersive-vr');
        setIsVRSupported(supported);
        console.log('🥽 VR Support:', supported ? 'AVAILABLE ✅' : 'NOT AVAILABLE ❌');
      } catch (error) {
        console.error('VR support check failed:', error);
        setIsVRSupported(false);
      }
    } else {
      console.log('❌ WebXR not available in this browser');
      setIsVRSupported(false);
    }
    
    setIsCheckingVR(false);
  };

  const handleVRClick = async () => {
    console.log('🎯 VR Button clicked!', { isVRSupported, isVRActive });

    if (!isVRSupported) {
      alert('🥽 VR Not Available\n\nTo use VR:\n• Use Meta Quest 3S browser\n• Enable WebXR in settings\n• Make sure site uses HTTPS\n• Try Chrome or Edge on desktop');
      return;
    }

    if (isVRActive) {
      // Exit VR
      setIsVRActive(false);
      onVRStateChange?.(false);
      console.log('🚪 Exiting VR mode');
      return;
    }

    try {
      console.log('🚀 Attempting to enter VR...');

      // Method 1: Try to trigger browser's native VR
      const canvas = document.querySelector('canvas');
      if (canvas) {
        // Look for WebXR button in the canvas
        const vrButton = document.querySelector('[data-xr]') || 
                        document.querySelector('.xr-button') ||
                        document.querySelector('[aria-label*="VR"]');
        
        if (vrButton) {
          console.log('🎮 Found native VR button, clicking...');
          (vrButton as HTMLElement).click();
        } else {
          console.log('🔍 No native VR button found, trying manual approach...');
          
          // Method 2: Manual WebXR session request
          if (navigator.xr) {
            try {
              const session = await navigator.xr.requestSession('immersive-vr');
              console.log('✅ VR session started!');
              setIsVRActive(true);
              onVRStateChange?.(true);
              
              session.addEventListener('end', () => {
                console.log('🔚 VR session ended');
                setIsVRActive(false);
                onVRStateChange?.(false);
              });
              
            } catch (vrError) {
              console.error('VR session failed:', vrError);
              throw vrError;
            }
          }
        }
      } else {
        console.log('📦 No canvas found, creating VR experience...');
        
        // Method 3: Show VR instructions
        alert('🥽 VR Ready!\n\n📱 Meta Quest 3S Instructions:\n1. Put on your headset\n2. Open browser in VR\n3. Look for VR icon in browser\n4. Click to enter VR mode\n\n🖥️ Desktop: Use Chrome/Edge with VR headset connected');
        
        setIsVRActive(true);
        onVRStateChange?.(true);
      }

    } catch (error) {
      console.error('❌ VR activation failed:', error);
      
      let errorMessage = '❌ VR Failed\n\n';
      
      if (error instanceof Error) {
        if (error.message.includes('NotSupportedError')) {
          errorMessage += '• VR headset not detected\n• Try Meta Quest browser\n• Enable WebXR in settings';
        } else if (error.message.includes('SecurityError')) {
          errorMessage += '• HTTPS required for VR\n• Check site security\n• Try different browser';
        } else if (error.message.includes('NotAllowedError')) {
          errorMessage += '• VR permission denied\n• Check browser settings\n• Allow VR access';
        } else {
          errorMessage += `• ${error.message}\n• Try refreshing page\n• Check VR headset connection`;
        }
      } else {
        errorMessage += '• Unknown error occurred\n• Try refreshing page\n• Check browser console';
      }
      
      alert(errorMessage);
    }
  };

  const getButtonText = () => {
    if (isCheckingVR) return 'Checking VR...';
    if (!isVRSupported) return 'VR Not Available';
    if (isVRActive) return 'Exit VR';
    return 'Enter VR';
  };

  const getButtonVariant = () => {
    if (!isVRSupported) return 'outline';
    if (isVRActive) return 'destructive';
    return 'default';
  };

  return (
    <Button
      onClick={handleVRClick}
      disabled={isCheckingVR}
      variant={getButtonVariant() as any}
      size={size}
      className={`${className} ${isVRActive ? 'animate-pulse' : ''} ${!isVRSupported ? 'opacity-50' : ''}`}
    >
      <Headphones className="w-4 h-4 mr-2" />
      {getButtonText()}
      {isVRSupported && !isCheckingVR && (
        <span className="ml-2">
          {isVRActive ? '🔴' : '🥽'}
        </span>
      )}
    </Button>
  );
};