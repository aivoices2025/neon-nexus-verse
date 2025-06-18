
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Video, User, LogOut, Headphones } from "lucide-react";

interface VRNavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
  isVRMode: boolean;
  onToggleVR: () => void;
  user: any;
  onLogout: () => void;
}

export const VRNavigation = ({ 
  currentView, 
  onViewChange, 
  isVRMode, 
  onToggleVR, 
  user, 
  onLogout 
}: VRNavigationProps) => {
  return (
    <Card className="fixed top-4 left-4 z-50 bg-card/95 border-border/30 backdrop-blur-xl">
      <CardContent className="p-4">
        <div className="flex items-center space-x-2">
          <Button
            variant={currentView === "dashboard" ? "default" : "outline"}
            size="sm"
            onClick={() => onViewChange("dashboard")}
            className="border-border/30"
          >
            <Home className="w-4 h-4" />
          </Button>
          
          <Button
            variant={currentView === "events" ? "default" : "outline"}
            size="sm"
            onClick={() => onViewChange("events")}
            className="border-border/30"
          >
            <Video className="w-4 h-4" />
          </Button>
          
          <Button
            variant={currentView === "profile" ? "default" : "outline"}
            size="sm"
            onClick={() => onViewChange("profile")}
            className="border-border/30"
          >
            <User className="w-4 h-4" />
          </Button>
          
          <div className="w-px h-6 bg-border/30 mx-2"></div>
          
          <Button
            variant={isVRMode ? "default" : "outline"}
            size="sm"
            onClick={onToggleVR}
            className={isVRMode ? "neon-glow bg-primary" : "border-border/30"}
          >
            <Headphones className="w-4 h-4" />
          </Button>
          
          {user && (
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="border-border/30"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
