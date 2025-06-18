
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Users, Video, User } from "lucide-react";

export const UserProfile = () => {
  const [username, setUsername] = useState("CyberUser2024");
  const [bio, setBio] = useState("Digital explorer and metaverse enthusiast");

  const userStats = {
    eventsAttended: 47,
    friendsConnected: 128,
    hoursInVR: 234
  };

  const recentEvents = [
    { id: 1, name: "Virtual Concert: Neon Beats", date: "2 days ago", category: "Music" },
    { id: 2, name: "AI Tech Talk", date: "1 week ago", category: "Tech" },
    { id: 3, name: "Digital Art Gallery", date: "2 weeks ago", category: "Art" }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="bg-card/50 border-border/30">
        <CardHeader>
          <CardTitle className="text-2xl bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            User Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar Section */}
            <div className="text-center">
              <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-primary/50 neon-glow">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="text-2xl">CU</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" className="border-border/30">
                <User className="w-4 h-4 mr-2" />
                Change Avatar
              </Button>
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-card/50 border-border/30"
                />
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Input
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="bg-card/50 border-border/30"
                />
              </div>
              <Button className="neon-glow">
                Save Changes
              </Button>
            </div>

            {/* Stats */}
            <div className="space-y-4">
              <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20">
                <div className="text-2xl font-bold text-primary">{userStats.eventsAttended}</div>
                <div className="text-sm text-muted-foreground">Events Attended</div>
              </div>
              <div className="text-center p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                <div className="text-2xl font-bold text-cyan-400">{userStats.friendsConnected}</div>
                <div className="text-sm text-muted-foreground">Friends Connected</div>
              </div>
              <div className="text-center p-4 bg-pink-500/10 rounded-lg border border-pink-500/20">
                <div className="text-2xl font-bold text-pink-400">{userStats.hoursInVR}</div>
                <div className="text-sm text-muted-foreground">Hours in VR</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="events" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-card/50 border border-border/30">
          <TabsTrigger value="events">Recent Events</TabsTrigger>
          <TabsTrigger value="friends">Friends</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>
        
        <TabsContent value="events" className="space-y-4">
          {recentEvents.map((event) => (
            <Card key={event.id} className="bg-card/30 border-border/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{event.name}</h4>
                    <p className="text-sm text-muted-foreground">{event.date}</p>
                  </div>
                  <Badge variant="outline" className="border-border/30">
                    {event.category}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="friends">
          <Card className="bg-card/30 border-border/30">
            <CardContent className="p-6 text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Friends list coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="achievements">
          <Card className="bg-card/30 border-border/30">
            <CardContent className="p-6 text-center">
              <Video className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Achievements system coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
