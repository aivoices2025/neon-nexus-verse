import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Headphones, Hand, Gamepad2, Eye, Volume2, Settings } from 'lucide-react';
import { WorkingVRButton } from './WorkingVRButton';
import { useVRSession } from '@/hooks/useVRSession';

interface MetaQuestControlsProps {
  isVRMode: boolean;
  onToggleVR: () => void;
  onSettingsChange?: (setting: string, value: boolean) => void;
}

export const MetaQuestControls = ({ isVRMode, onToggleVR, onSettingsChange }: MetaQuestControlsProps) => {
  const { isVRSupported } = useVRSession();
  const [handTrackingEnabled, setHandTrackingEnabled] = useState(false);
  const [spatialAudioEnabled, setSpatialAudioEnabled] = useState(true);
  const [passthrough, setPassthrough] = useState(false);
  const [controllerHaptics, setControllerHaptics] = useState(true);

  useEffect(() => {
    // VR support is already detected by the useVRSession hook
    if (isVRSupported) {
      console.log('🥽 Meta Quest 3S VR features detected by MetaQuestControls!');
    }
  }, [isVRSupported]);

  const handleSettingChange = (setting: string, value: boolean) => {
    switch (setting) {
      case 'handTracking':
        setHandTrackingEnabled(value);
        break;
      case 'spatialAudio':
        setSpatialAudioEnabled(value);
        break;
      case 'passthrough':
        setPassthrough(value);
        break;
      case 'haptics':
        setControllerHaptics(value);
        break;
    }
    onSettingsChange?.(setting, value);
  };

  return (
    <Card className="bg-card/50 border-border/30 neon-glow backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2">
          <Headphones className="w-5 h-5 text-purple-400" />
          <span>🥽 Meta Quest 3S Controls</span>
          {isVRSupported && (
            <Badge variant="outline" className="border-green-500/50 text-green-400">
              VR Ready
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* VR Mode Toggle */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-lg border border-purple-500/20">
          <div className="flex items-center space-x-3">
            <Eye className="w-5 h-5 text-cyan-400" />
            <div>
              <p className="font-semibold">VR Mode</p>
              <p className="text-sm text-muted-foreground">
                {isVRMode ? "Immersive VR Active" : "Desktop Mode"}
              </p>
            </div>
          </div>
          <WorkingVRButton 
            size="lg"
            className="neon-glow"
            onVRStateChange={(vrActive) => {
              console.log('✅ Meta Quest VR State changed:', vrActive);
              onSettingsChange?.('vrMode', vrActive);
            }}
          />
        </div>

        {/* Controller Options */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Gamepad2 className="w-5 h-5 mr-2 text-purple-400" />
            Controller Settings
          </h3>
          
          <div className="grid grid-cols-1 gap-4">
            {/* Hand Tracking */}
            <div className="flex items-center justify-between p-3 bg-card/30 rounded-lg border border-border/20">
              <div className="flex items-center space-x-3">
                <Hand className="w-4 h-4 text-cyan-400" />
                <div>
                  <p className="font-medium">Hand Tracking</p>
                  <p className="text-xs text-muted-foreground">Use your hands instead of controllers</p>
                </div>
              </div>
              <Switch
                checked={handTrackingEnabled}
                onCheckedChange={(value) => handleSettingChange('handTracking', value)}
              />
            </div>

            {/* Spatial Audio */}
            <div className="flex items-center justify-between p-3 bg-card/30 rounded-lg border border-border/20">
              <div className="flex items-center space-x-3">
                <Volume2 className="w-4 h-4 text-green-400" />
                <div>
                  <p className="font-medium">Spatial Audio</p>
                  <p className="text-xs text-muted-foreground">3D positioned sound</p>
                </div>
              </div>
              <Switch
                checked={spatialAudioEnabled}
                onCheckedChange={(value) => handleSettingChange('spatialAudio', value)}
              />
            </div>

            {/* Passthrough */}
            <div className="flex items-center justify-between p-3 bg-card/30 rounded-lg border border-border/20">
              <div className="flex items-center space-x-3">
                <Eye className="w-4 h-4 text-yellow-400" />
                <div>
                  <p className="font-medium">Passthrough</p>
                  <p className="text-xs text-muted-foreground">See real world while in VR</p>
                </div>
              </div>
              <Switch
                checked={passthrough}
                onCheckedChange={(value) => handleSettingChange('passthrough', value)}
              />
            </div>

            {/* Controller Haptics */}
            <div className="flex items-center justify-between p-3 bg-card/30 rounded-lg border border-border/20">
              <div className="flex items-center space-x-3">
                <Settings className="w-4 h-4 text-orange-400" />
                <div>
                  <p className="font-medium">Controller Haptics</p>
                  <p className="text-xs text-muted-foreground">Vibration feedback</p>
                </div>
              </div>
              <Switch
                checked={controllerHaptics}
                onCheckedChange={(value) => handleSettingChange('haptics', value)}
              />
            </div>
          </div>
        </div>

        {/* VR Tips */}
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-4 border border-blue-500/20">
          <h4 className="font-semibold mb-2 text-blue-400">🎮 Meta Quest 3S Tips:</h4>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• Use trigger to interact with objects</li>
            <li>• Joystick to move around the virtual space</li>
            <li>• A/X buttons for menu navigation</li>
            <li>• Grip buttons to grab and hold items</li>
            <li>• Look around naturally with head movement</li>
          </ul>
        </div>

        {/* Connection Status */}
        <div className="text-center p-3 bg-card/20 rounded-lg border border-border/10">
          <div className="flex items-center justify-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isVRSupported ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <p className="text-sm">
              {isVRSupported ? (
                <span className="text-green-400">Meta Quest 3S Connected & Ready</span>
              ) : (
                <span className="text-yellow-400">VR Headset Not Detected</span>
              )}
            </p>
          </div>
          {!isVRSupported && (
            <p className="text-xs text-muted-foreground mt-1">
              Connect your Meta Quest 3S and refresh the page
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};