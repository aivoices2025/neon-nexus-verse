
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { LoginForm } from "@/components/LoginForm";
import { VRNavigation } from "@/components/VRNavigation";
import { Video360Viewer } from "@/components/Video360Viewer";
import { VRAvatarSystem } from "@/components/VRAvatarSystem";
import { EventCard } from "@/components/EventCard";
import { DashboardStats } from "@/components/DashboardStats";
import { ChatPanel } from "@/components/ChatPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Video, Users, Headphones } from "lucide-react";

const Index = () => {
  const { user, logout, isLoading } = useAuth();
  const [activeView, setActiveView] = useState<"dashboard" | "events" | "profile">("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isVRMode, setIsVRMode] = useState(false);

  console.log("Index component render - user:", user, "isLoading:", isLoading, "activeView:", activeView);

  // Enhanced mock event data with 360° video support
  const events = [
    {
      id: 1,
      title: "Virtual Concert: Neon Beats 360°",
      description: "Immersive electronic music experience in 360° video with spatial audio",
      category: "Music",
      attendees: 1247,
      date: "Tonight 8PM PST",
      image: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=800&h=600&fit=crop",
      isLive: true,
      vrEnabled: true,
      has360Video: true
    },
    {
      id: 2,
      title: "AI Tech Talk: VR Future",
      description: "Leading experts discuss AI and VR convergence in virtual space",
      category: "Tech",
      attendees: 856,
      date: "Tomorrow 2PM PST",
      image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=800&h=600&fit=crop",
      isLive: false,
      vrEnabled: true,
      has360Video: false
    },
    {
      id: 3,
      title: "360° Digital Art Gallery",
      description: "Explore stunning 3D artworks in immersive 360° virtual gallery",
      category: "Art",
      attendees: 432,
      date: "Friday 6PM PST",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=600&fit=crop",
      isLive: false,
      vrEnabled: true,
      has360Video: true
    },
    {
      id: 4,
      title: "VR Startup Pitch Night",
      description: "Watch innovative VR startups present in virtual auditorium",
      category: "Business",
      attendees: 623,
      date: "Saturday 4PM PST",
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=800&h=600&fit=crop",
      isLive: false,
      vrEnabled: true,
      has360Video: false
    }
  ];

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Show loading state while checking authentication
  if (isLoading) {
    console.log("Index: Showing loading state");
    return (
      <div className="min-h-screen bg-background cyber-grid flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading VR Experience...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show login form
  if (!user) {
    console.log("Index: User not authenticated, showing login form");
    return <LoginForm />;
  }

  console.log("Index: User authenticated, rendering main app for user:", user.username);

  const handleJoinEvent = (event: any) => {
    console.log("Index: Joining event:", event.title);
    setSelectedEvent(event);
  };

  const toggleVRMode = () => {
    console.log("Index: Toggling VR mode from", isVRMode, "to", !isVRMode);
    setIsVRMode(!isVRMode);
    if (!isVRMode) {
      // Initialize WebXR when entering VR mode
      if ('xr' in navigator) {
        console.log("Entering VR mode...");
      }
    }
  };

  const handleViewChange = (view: "dashboard" | "events" | "profile") => {
    console.log("Index: Changing view from", activeView, "to", view);
    setActiveView(view);
  };

  // Add error boundary fallback
  try {
    // Log main content rendering
    console.log("Index: Rendering main content, activeView:", activeView);
    
    return (
      <div className={`min-h-screen bg-background cyber-grid ${isVRMode ? 'vr-mode' : ''}`}>
        {/* VR Navigation */}
        <VRNavigation
          currentView={activeView}
          onViewChange={handleViewChange}
          isVRMode={isVRMode}
          onToggleVR={toggleVRMode}
          user={user}
          onLogout={logout}
        />

        <main className="container mx-auto px-4 py-8 pt-20">
          {activeView === "dashboard" && (() => {
            console.log("Index: Rendering dashboard view");
            return (
              <div className="space-y-8">
                {/* Hero Section with VR Integration */}
                <section className="text-center py-12">
                  <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                    Welcome to VR Events, {user.username}!
                  </h2>
                  <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                    Experience live events in immersive 360° video and virtual spaces. 
                    Compatible with VR headsets and desktop browsers.
                  </p>
                  
                  {/* VR Avatar System Preview */}
                  <div className="max-w-4xl mx-auto mb-8">
                    {(() => {
                      console.log("Index: Rendering VRAvatarSystem");
                      return (
                        <VRAvatarSystem 
                          currentUser={user} 
                          eventId="preview" 
                          isVRMode={isVRMode}
                        />
                      );
                    })()}
                    <p className="text-sm text-muted-foreground mt-2">
                      {isVRMode ? "VR Mode Active - Move your head to look around" : "3D virtual space preview - Click and drag to explore"}
                    </p>
                  </div>
                  
                  <div className="flex justify-center space-x-4">
                    <Button 
                      size="lg" 
                      className="neon-glow bg-primary hover:bg-primary/90"
                      onClick={() => handleViewChange("events")}
                    >
                      <Video className="w-5 h-5 mr-2" />
                      Browse VR Events
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="border-primary/50 hover:neon-glow"
                      onClick={toggleVRMode}
                    >
                      <Headphones className="w-5 h-5 mr-2" />
                      {isVRMode ? "Exit VR Mode" : "Enter VR Mode"}
                    </Button>
                  </div>
                </section>

                {(() => {
                  console.log("Index: Rendering DashboardStats");
                  return <DashboardStats />;
                })()}
              </div>
            );
          })()}

          {activeView === "events" && (() => {
            console.log("Index: Rendering events view");
            return (
              <div className="space-y-8">
                {/* Search Bar */}
                <div className="flex items-center space-x-4 max-w-2xl mx-auto">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search VR events..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-card/50 border-border/30 focus:neon-glow"
                    />
                  </div>
                  <Badge variant="outline" className="border-cyan-400/50 text-cyan-400">
                    {filteredEvents.length} VR Events
                  </Badge>
                </div>

                {/* Live Events */}
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold flex items-center">
                      <span className="w-3 h-3 bg-red-500 rounded-full mr-3 animate-pulse"></span>
                      Live VR Events
                    </h3>
                    <Badge variant="outline" className="border-red-500/50 text-red-400">
                      {events.filter(e => e.isLive).length} Live Now
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.filter(event => event.isLive).map((event) => (
                      <EventCard key={event.id} event={event} onJoin={handleJoinEvent} />
                    ))}
                  </div>
                </section>

                {/* Upcoming Events */}
                <section>
                  <h3 className="text-2xl font-bold mb-6">Upcoming VR Events</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredEvents.filter(event => !event.isLive).map((event) => (
                      <EventCard key={event.id} event={event} onJoin={handleJoinEvent} />
                    ))}
                  </div>
                </section>
              </div>
            );
          })()}

          {activeView === "profile" && (() => {
            console.log("Index: Rendering profile view");
            return (
              <div className="max-w-2xl mx-auto">
                <Card className="bg-card/50 border-border/30">
                  <CardHeader>
                    <CardTitle className="text-2xl bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                      VR Profile: {user.username}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full mx-auto mb-4"></div>
                      <h3 className="text-xl font-semibold">{user.username}</h3>
                      <p className="text-muted-foreground">{user.email}</p>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-4 bg-primary/10 rounded-lg">
                        <div className="text-2xl font-bold text-primary">12</div>
                        <div className="text-sm text-muted-foreground">VR Events Joined</div>
                      </div>
                      <div className="p-4 bg-cyan-500/10 rounded-lg">
                        <div className="text-2xl font-bold text-cyan-400">48h</div>
                        <div className="text-sm text-muted-foreground">Time in VR</div>
                      </div>
                      <div className="p-4 bg-pink-500/10 rounded-lg">
                        <div className="text-2xl font-bold text-pink-400">156</div>
                        <div className="text-sm text-muted-foreground">Friends Met</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })()}
        </main>

        {/* 360° Video Viewer Modal */}
        {selectedEvent && (
          <Video360Viewer
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
            isVRMode={isVRMode}
          />
        )}

        {/* Chat Panel */}
        <ChatPanel />
      </div>
    );
  } catch (error) {
    console.error("Index: Render error:", error);
    return (
      <div className="min-h-screen bg-background cyber-grid flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-400">Something went wrong</h2>
          <p className="text-muted-foreground mb-4">There was an error loading the application.</p>
          <Button onClick={() => window.location.reload()}>Reload Page</Button>
        </div>
      </div>
    );
  }
};

export default Index;
