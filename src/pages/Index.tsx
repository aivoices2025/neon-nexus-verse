import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useEvents } from "@/hooks/useEvents";
import { LoginForm } from "@/components/LoginForm";
import { VRNavigation } from "@/components/VRNavigation";
import { Video360Viewer } from "@/components/Video360Viewer";
import { VRAvatarSystem } from "@/components/VRAvatarSystem";
import { EventCard } from "@/components/EventCard";
import { DashboardStats } from "@/components/DashboardStats";
import { ChatPanel } from "@/components/ChatPanel";
import { Classroom } from "@/components/Classroom";
import { AddEventForm } from "@/components/AddEventForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Video, Users, Headphones } from "lucide-react";

const Index = () => {
  const { user, logout, isLoading } = useAuth();
  const { events, isLoading: eventsLoading, error: eventsError, refreshEvents } = useEvents();
  const [activeView, setActiveView] = useState<"dashboard" | "events" | "profile" | "classroom">("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isVRMode, setIsVRMode] = useState(false);

  console.log("🌟 INDEX COMPONENT RENDER START 🌟");
  console.log("👤 Auth User:", user ? `${user.email} (ID: ${user.id})` : "No user");
  console.log("⏳ Auth Loading State:", isLoading);
  console.log("📄 Current Active View:", activeView);
  console.log("🎬 Events Data:", {
    count: events?.length || 0,
    events: events,
    loading: eventsLoading,
    error: eventsError
  });

  const filteredEvents = (events || []).filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  console.log("🔍 Filtering Results:", {
    searchQuery,
    totalEvents: (events || []).length,
    filteredCount: filteredEvents.length
  });

  // Show loading state while checking authentication
  if (isLoading) {
    console.log("🔄 INDEX: Displaying auth loading screen");
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
    console.log("🚫 INDEX: User not authenticated, showing login form");
    return <LoginForm />;
  }

  console.log("✅ INDEX: User authenticated, rendering main application");

  const handleJoinEvent = (event: any) => {
    console.log("🎯 JOINING EVENT:", event.title);
    console.log("🎬 Event has 360 video:", event.has_360_video);
    console.log("📹 Video URL:", event.video_url);
    setSelectedEvent(event);
  };

  const toggleVRMode = () => {
    console.log("🥽 TOGGLING VR MODE from", isVRMode, "to", !isVRMode);
    setIsVRMode(!isVRMode);
    if (!isVRMode) {
      if ('xr' in navigator) {
        console.log("🚀 Entering VR mode...");
      }
    }
  };

  const handleViewChange = (view: "dashboard" | "events" | "profile" | "classroom") => {
    console.log("📄 CHANGING VIEW from", activeView, "to", view);
    setActiveView(view);
  };

  console.log("🎨 INDEX: About to render main UI");

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
        {activeView === "dashboard" && (
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
                <VRAvatarSystem 
                  currentUser={user} 
                  eventId="preview" 
                  isVRMode={isVRMode}
                />
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

            <DashboardStats />
          </div>
        )}

        {activeView === "events" && (
          <div className="space-y-8">
            {/* Add Event Form */}
            <div className="flex justify-center">
              <AddEventForm onEventCreated={refreshEvents} />
            </div>

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

            {/* Debug Information Panel */}
            <div className="text-center text-sm bg-gray-800 p-6 rounded-lg mx-auto max-w-4xl">
              <h3 className="text-yellow-400 font-bold mb-4 text-lg">🔍 DEBUG DASHBOARD</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-left">
                <div>
                  <p className="text-cyan-400 font-semibold">Database Status:</p>
                  <p>Total events: {(events || []).length}</p>
                  <p>Filtered events: {filteredEvents.length}</p>
                  <p>Loading: {eventsLoading ? "Yes" : "No"}</p>
                </div>
                <div>
                  <p className="text-green-400 font-semibold">User Status:</p>
                  <p>Email: {user.email}</p>
                  <p>ID: {user.id}</p>
                  <p>Username: {user.username}</p>
                </div>
                <div>
                  <p className="text-red-400 font-semibold">Error Status:</p>
                  <p>Error: {eventsError || "None"}</p>
                  <p>Search: "{searchQuery}"</p>
                  <p>View: {activeView}</p>
                </div>
              </div>
            </div>

            {/* Show error if there's one */}
            {eventsError && (
              <div className="text-center py-8">
                <div className="text-red-400 mb-4 text-lg font-semibold">❌ Error loading events: {eventsError}</div>
                <Button onClick={refreshEvents} variant="outline" size="lg">
                  🔄 Try Again
                </Button>
              </div>
            )}

            {eventsLoading ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                <p className="text-muted-foreground text-lg">⏳ Loading VR events...</p>
              </div>
            ) : (
              <>
                {(events || []).length === 0 && !eventsError && (
                  <div className="text-center py-12 bg-gray-800 rounded-lg">
                    <div className="text-6xl mb-4">📭</div>
                    <p className="text-muted-foreground mb-4 text-lg">No events found in the database.</p>
                    <p className="text-sm text-muted-foreground mb-6">Try adding a new event using the form above!</p>
                    <Button onClick={refreshEvents} variant="outline" size="lg">
                      🔄 Refresh Events
                    </Button>
                  </div>
                )}

                {(events || []).length > 0 && (
                  <>
                    {/* Live Events */}
                    <section>
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-3xl font-bold flex items-center">
                          <span className="w-4 h-4 bg-red-500 rounded-full mr-3 animate-pulse"></span>
                          🔴 Live VR Events
                        </h3>
                        <Badge variant="outline" className="border-red-500/50 text-red-400 text-lg px-4 py-2">
                          {filteredEvents.filter(e => e.is_live).length} Live Now
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEvents.filter(event => event.is_live).map((event) => {
                          console.log("🎬 Rendering live event:", event.id, event.title);
                          return <EventCard key={event.id} event={event} onJoin={handleJoinEvent} />;
                        })}
                      </div>
                      {filteredEvents.filter(e => e.is_live).length === 0 && (
                        <p className="text-center text-muted-foreground py-12 text-lg">🚫 No live events at the moment</p>
                      )}
                    </section>

                    {/* Upcoming Events */}
                    <section>
                      <h3 className="text-3xl font-bold mb-6">📅 Upcoming VR Events</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredEvents.filter(event => !event.is_live).map((event) => {
                          console.log("📅 Rendering upcoming event:", event.id, event.title);
                          return <EventCard key={event.id} event={event} onJoin={handleJoinEvent} />;
                        })}
                      </div>
                      {filteredEvents.filter(e => !e.is_live).length === 0 && (
                        <p className="text-center text-muted-foreground py-12 text-lg">📭 No upcoming events</p>
                      )}
                    </section>
                  </>
                )}
              </>
            )}
          </div>
        )}

        {activeView === "profile" && (
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
                    <div className="text-2xl font-bold text-primary">{(events || []).filter(e => e.created_by === user.id).length}</div>
                    <div className="text-sm text-muted-foreground">Events Created</div>
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
        )}

        {activeView === "classroom" && (
          <Classroom />
        )}
      </main>

      {/* 360° Video Viewer Modal */}
      {selectedEvent && (
        <Video360Viewer
          event={selectedEvent}
          onClose={() => {
            console.log("❌ INDEX: Closing video viewer");
            setSelectedEvent(null);
          }}
          isVRMode={isVRMode}
        />
      )}

      {/* Chat Panel */}
      <ChatPanel />
    </div>
  );
};

export default Index;
