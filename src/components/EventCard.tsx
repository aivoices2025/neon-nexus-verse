
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, Video, Mic } from "lucide-react";
import { VREvent } from "@/hooks/useEvents";

interface EventCardProps {
  event: VREvent;
  onJoin: (event: VREvent) => void;
}

export const EventCard = ({ event, onJoin }: EventCardProps) => {
  // Format the date from the database format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Use placeholder image if none provided
  const imageUrl = event.image_url || '/placeholder.svg';

  return (
    <Card className="bg-card/50 border-border/30 hover:neon-glow transition-all duration-300 hover:scale-105 overflow-hidden group">
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={event.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        
        {event.is_live && (
          <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-500 animate-pulse">
            LIVE
          </Badge>
        )}
        
        {event.vr_enabled && (
          <Badge variant="outline" className="absolute top-3 right-3 border-cyan-400/50 text-cyan-400 bg-black/50">
            VR
          </Badge>
        )}
        
        <Badge 
          variant="secondary" 
          className="absolute bottom-3 left-3 bg-black/50 border-border/30"
        >
          {event.category}
        </Badge>
      </div>
      
      <CardHeader className="pb-3">
        <h4 className="font-bold text-lg leading-tight">{event.title}</h4>
        <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            {event.attendees.toLocaleString()}
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {formatDate(event.event_date)}
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            onClick={() => onJoin(event)}
            className={`flex-1 ${event.is_live ? 'neon-glow bg-primary hover:bg-primary/90' : 'bg-primary/80 hover:bg-primary'}`}
          >
            <Video className="w-4 h-4 mr-2" />
            {event.is_live ? 'Join Now' : 'Preview'}
          </Button>
          
          {event.is_live && (
            <Button size="sm" variant="outline" className="border-border/30">
              <Mic className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
