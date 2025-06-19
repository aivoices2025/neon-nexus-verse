
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useEvents } from "@/hooks/useEvents";
import { Plus, Calendar } from "lucide-react";

interface AddEventFormProps {
  onEventCreated?: () => void;
}

export const AddEventForm = ({ onEventCreated }: AddEventFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    event_date: "",
    image_url: "",
    is_live: false,
    vr_enabled: true,
    has_360_video: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { createEvent } = useEvents();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.category || !formData.event_date) {
      setError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await createEvent({
        ...formData,
        image_url: formData.image_url || "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=800&h=600&fit=crop"
      });

      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        event_date: "",
        image_url: "",
        is_live: false,
        vr_enabled: true,
        has_360_video: false
      });
      
      setIsOpen(false);
      onEventCreated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create event");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="neon-glow bg-primary hover:bg-primary/90"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add VR Event
      </Button>
    );
  }

  return (
    <Card className="bg-card/50 border-border/30 neon-glow">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Create New VR Event
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter event title"
                className="bg-card/50 border-border/30"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="bg-card/50 border-border/30">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Music">Music</SelectItem>
                  <SelectItem value="Tech">Tech</SelectItem>
                  <SelectItem value="Art">Art</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                  <SelectItem value="Gaming">Gaming</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your VR event"
              className="bg-card/50 border-border/30"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="event_date">Event Date *</Label>
              <Input
                id="event_date"
                type="datetime-local"
                value={formData.event_date}
                onChange={(e) => setFormData(prev => ({ ...prev, event_date: e.target.value }))}
                className="bg-card/50 border-border/30"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image_url">Image URL (optional)</Label>
              <Input
                id="image_url"
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                placeholder="https://example.com/image.jpg"
                className="bg-card/50 border-border/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="is_live"
                checked={formData.is_live}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_live: checked }))}
              />
              <Label htmlFor="is_live">Start Live Now</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="vr_enabled"
                checked={formData.vr_enabled}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, vr_enabled: checked }))}
              />
              <Label htmlFor="vr_enabled">VR Enabled</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="has_360_video"
                checked={formData.has_360_video}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, has_360_video: checked }))}
              />
              <Label htmlFor="has_360_video">360° Video</Label>
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <div className="flex space-x-2">
            <Button
              type="submit"
              className="flex-1 neon-glow bg-primary hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Event"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="border-border/30"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
