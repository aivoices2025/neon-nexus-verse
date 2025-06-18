
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, User, Calendar, Users, Video, Mic } from "lucide-react";
import { EventCard } from "@/components/EventCard";
import { VRPreview } from "@/components/VRPreview";
import { UserProfile } from "@/components/UserProfile";
import { ChatPanel } from "@/components/ChatPanel";
import { ThreeScene } from "@/components/ThreeScene";
import { DashboardStats } from "@/components/DashboardStats";
import { PrototypeFeatures } from "@/components/PrototypeFeatures";

const Index = () => {
  const [activeView, setActiveView] = useState<"dashboard" | "profile" | "event">("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Mock event data
  const events = [
    {
      id: 1,
      title: "Virtual Concert: Neon Beats",
      description: "Immersive electronic music experience in a cyberpunk cityscape",
      category: "Music",
      attendees: 1247,
      date: "Tonight 8PM PST",
      image: "/placeholder.svg",
      isLive: true,
      vrEnabled: true
    },
    {
      id: 2,
      title: "AI Tech Talk: Future Insights",
      description: "Leading experts discuss the future of artificial intelligence",
      category: "Tech",
      attendees: 856,
      date: "Tomorrow 2PM PST",
      image: "/placeholder.svg",
      isLive: false,
      vrEnabled: true
    },
    {
      id: 3,
      title: "Digital Art Gallery Opening",
      description: "Explore stunning 3D artworks in virtual space",
      category: "Art",
      attendees: 432,
      date: "Friday 6PM PST",
      image: "/placeholder.svg",
      isLive: false,
      vrEnabled: true
    },
    {
      id: 4,
      title: "Startup Pitch Night",
      description: "Watch innovative startups present their ideas",
      category: "Business",
      attendees: 623,
      date: "Saturday 4PM PST",
      image: "/placeholder.svg",
      isLive: false,
      vrEnabled: false
    }
  ];

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background cyber-grid">
      {/* Header */}
      <header className="border-b border-border/30 bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                MetaVerse Live
              </h1>
              <nav className="hidden md:flex space-x-6">
                <Button 
                  variant={activeView === "dashboard" ? "default" : "ghost"} 
                  onClick={() => setActiveView("dashboard")}
                  className="text-foreground hover:text-primary"
                >
                  Dashboard
                </Button>
                <Button 
                  variant="ghost" 
                  className="text-foreground hover:text-primary"
                >
                  My Events
                </Button>
                <Button 
                  variant="ghost" 
                  className="text-foreground hover:text-primary"
                >
                  Explore
                </Button>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 bg-card/50 border-border/30 focus:neon-glow"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setActiveView("profile")}
                className="border-border/30 hover:neon-glow"
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
              <Avatar className="w-8 h-8 border-2 border-primary/50">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {activeView === "dashboard" && (
          <div className="space-y-8">
            {/* Hero Section */}
            <section className="text-center py-12">
              <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Enter the Future of Live Events
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Experience concerts, talks, and meetups in immersive virtual spaces. 
                Join from VR or any device.
              </p>
              
              {/* 3D Preview */}
              <div className="max-w-4xl mx-auto mb-8">
                <ThreeScene />
                <p className="text-sm text-muted-foreground mt-2">
                  Interactive 3D preview - Click and drag to explore
                </p>
              </div>
              
              <div className="flex justify-center space-x-4">
                <Button size="lg" className="neon-glow bg-primary hover:bg-primary/90">
                  <Video className="w-5 h-5 mr-2" />
                  Browse Events
                </Button>
                <Button size="lg" variant="outline" className="border-primary/50 hover:neon-glow">
                  <Users className="w-5 h-5 mr-2" />
                  Join Community
                </Button>
              </div>
            </section>

            {/* Dashboard Stats */}
            <DashboardStats />

            {/* Live Events */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold flex items-center">
                  <span className="w-3 h-3 bg-red-500 rounded-full mr-3 animate-pulse"></span>
                  Live Now
                </h3>
                <Badge variant="outline" className="border-red-500/50 text-red-400">
                  {events.filter(e => e.isLive).length} Live Events
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {events.filter(event => event.isLive).map((event) => (
                  <EventCard key={event.id} event={event} onJoin={setSelectedEvent} />
                ))}
              </div>
            </section>

            {/* Upcoming Events */}
            <section>
              <h3 className="text-2xl font-bold mb-6">Upcoming Events</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {filteredEvents.filter(event => !event.isLive).map((event) => (
                  <EventCard key={event.id} event={event} onJoin={setSelectedEvent} />
                ))}
              </div>
            </section>

            {/* Feature Prototypes */}
            <PrototypeFeatures />

            {/* Categories */}
            <section>
              <h3 className="text-2xl font-bold mb-6">Browse by Category</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {["Music", "Tech", "Art", "Business", "Gaming", "Education", "Sports", "Social"].map((category) => (
                  <Card key={category} className="bg-card/50 border-border/30 hover:neon-glow cursor-pointer transition-all duration-300 hover:scale-105">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg mx-auto mb-4"></div>
                      <h4 className="font-semibold">{category}</h4>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeView === "profile" && <UserProfile />}
        
        {selectedEvent && (
          <VRPreview event={selectedEvent} onClose={() => setSelectedEvent(null)} />
        )}
      </main>

      {/* Chat Panel - Fixed position */}
      <ChatPanel />
    </div>
  );
};

export default Index;
