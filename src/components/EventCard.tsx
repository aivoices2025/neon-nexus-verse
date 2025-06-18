
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, Video, Mic } from "lucide-react";

interface Event {
  id: number;
  title: string;
  description: string;
  category: string;
  attendees: number;
  date: string;
  image: string;
  isLive: boolean;
  vrEnabled: boolean;
}

interface EventCardProps {
  event: Event;
  onJoin: (event: Event) => void;
}

export const EventCard = ({ event, onJoin }: EventCardProps) => {
  return (
    <Card className="bg-card/50 border-border/30 hover:neon-glow transition-all duration-300 hover:scale-105 overflow-hidden group">
      <div className="relative">
        <img 
          src={event.image} 
          alt={event.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        
        {event.isLive && (
          <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-500 animate-pulse">
            LIVE
          </Badge>
        )}
        
        {event.vrEnabled && (
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
            {event.date}
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            onClick={() => onJoin(event)}
            className={`flex-1 ${event.isLive ? 'neon-glow bg-primary hover:bg-primary/90' : 'bg-primary/80 hover:bg-primary'}`}
          >
            <Video className="w-4 h-4 mr-2" />
            {event.isLive ? 'Join Now' : 'Preview'}
          </Button>
          
          {event.isLive && (
            <Button size="sm" variant="outline" className="border-border/30">
              <Mic className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
