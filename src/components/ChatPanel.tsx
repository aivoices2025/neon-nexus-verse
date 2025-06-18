
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Users, X } from "lucide-react";

interface ChatMessage {
  id: number;
  user: string;
  message: string;
  timestamp: string;
  isSystem?: boolean;
}

export const ChatPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isMuted, setIsMuted] = useState(true);
  
  const [messages] = useState<ChatMessage[]>([
    { id: 1, user: "System", message: "Welcome to the virtual space!", timestamp: "8:00 PM", isSystem: true },
    { id: 2, user: "CyberUser", message: "Amazing visuals! 🔥", timestamp: "8:01 PM" },
    { id: 3, user: "VRExplorer", message: "Can't wait for the main event", timestamp: "8:02 PM" },
    { id: 4, user: "NeonDreamer", message: "First time in VR and loving it!", timestamp: "8:03 PM" }
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      // In a real app, this would send the message to the backend
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <Button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 neon-glow-cyan z-40 bg-cyan-500 hover:bg-cyan-600"
        size="lg"
      >
        <Users className="w-5 h-5 mr-2" />
        Chat (24)
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-80 h-96 bg-card/95 border-border/30 z-40 flex flex-col backdrop-blur-xl">
      <CardHeader className="flex-row items-center justify-between py-3 border-b border-border/30">
        <CardTitle className="text-lg flex items-center">
          <Users className="w-5 h-5 mr-2 text-cyan-400" />
          Live Chat
          <Badge variant="outline" className="ml-2 border-cyan-400/50 text-cyan-400">
            24
          </Badge>
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="flex-1 p-0 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isSystem ? 'justify-center' : 'justify-start'}`}>
              {msg.isSystem ? (
                <div className="text-xs text-muted-foreground bg-muted/20 px-2 py-1 rounded">
                  {msg.message}
                </div>
              ) : (
                <div className="flex space-x-2 max-w-[90%]">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="text-xs">
                      {msg.user.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-medium text-primary">{msg.user}</span>
                      <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                    </div>
                    <div className="text-sm bg-muted/20 rounded px-2 py-1 mt-1">
                      {msg.message}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Input */}
        <div className="border-t border-border/30 p-3">
          <div className="flex space-x-2 mb-2">
            <Button
              variant={isMuted ? "outline" : "default"}
              size="sm"
              onClick={() => setIsMuted(!isMuted)}
              className={isMuted ? "border-border/30" : "neon-glow bg-primary"}
            >
              {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
          </div>
          <div className="flex space-x-2">
            <Input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="bg-muted/20 border-border/30 text-sm"
            />
            <Button size="sm" onClick={handleSendMessage} className="bg-primary hover:bg-primary/90">
              Send
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
