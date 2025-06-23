
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface VREvent {
  id: string;
  title: string;
  description: string;
  category: string;
  attendees: number;
  event_date: string;
  image_url: string;
  is_live: boolean;
  vr_enabled: boolean;
  has_360_video: boolean;
  video_url?: string; // New field for 360° video URL
  created_by: string;
  created_at: string;
}

export const useEvents = () => {
  const [events, setEvents] = useState<VREvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchEvents = async () => {
    try {
      console.log("useEvents: Starting to fetch VR events...");
      console.log("useEvents: Supabase client ready:", !!supabase);
      
      const { data, error } = await supabase
        .from('vr_events')
        .select('*')
        .order('created_at', { ascending: false });

      console.log("useEvents: Query completed");
      console.log("useEvents: Data received:", data);
      console.log("useEvents: Error received:", error);
      console.log("useEvents: Data length:", data?.length || 0);

      if (error) {
        console.error("useEvents: Database error:", error);
        console.error("useEvents: Error details:", JSON.stringify(error, null, 2));
        setError(error.message);
        return;
      }

      console.log("useEvents: Setting events data:", data?.length || 0, "events");
      setEvents(data || []);
      setError(null);
    } catch (err) {
      console.error("useEvents: Exception during fetch:", err);
      setError("Failed to load events");
    } finally {
      console.log("useEvents: Setting loading to false");
      setIsLoading(false);
    }
  };

  const createEvent = async (eventData: Omit<VREvent, 'id' | 'created_at' | 'created_by' | 'attendees'>) => {
    if (!user) {
      throw new Error("User must be logged in to create events");
    }

    try {
      console.log("useEvents: Creating new event:", eventData.title);
      const { data, error } = await supabase
        .from('vr_events')
        .insert([{
          ...eventData,
          created_by: user.id,
          attendees: 0
        }])
        .select()
        .single();

      if (error) {
        console.error("useEvents: Error creating event:", error);
        throw new Error(error.message);
      }

      console.log("useEvents: Event created successfully:", data?.title);
      await fetchEvents(); // Refresh the events list
      return data;
    } catch (err) {
      console.error("useEvents: Exception creating event:", err);
      throw err;
    }
  };

  const joinEvent = async (eventId: string) => {
    if (!user) {
      throw new Error("User must be logged in to join events");
    }

    try {
      console.log("useEvents: Joining event:", eventId);
      // Get current event data first
      const { data: currentEvent, error: fetchError } = await supabase
        .from('vr_events')
        .select('attendees')
        .eq('id', eventId)
        .single();

      if (fetchError) {
        console.error("useEvents: Error fetching current event:", fetchError);
        throw new Error(fetchError.message);
      }

      // Update with incremented attendees count
      const { error } = await supabase
        .from('vr_events')
        .update({ 
          attendees: (currentEvent?.attendees || 0) + 1
        })
        .eq('id', eventId);

      if (error) {
        console.error("useEvents: Error joining event:", error);
        throw new Error(error.message);
      }

      console.log("useEvents: Successfully joined event");
      await fetchEvents(); // Refresh the events list
    } catch (err) {
      console.error("useEvents: Exception joining event:", err);
      throw err;
    }
  };

  useEffect(() => {
    console.log("useEvents: useEffect triggered");
    fetchEvents();
  }, []);

  console.log("useEvents: Returning state - events:", events.length, "isLoading:", isLoading, "error:", error);

  return {
    events,
    isLoading,
    error,
    createEvent,
    joinEvent,
    refreshEvents: fetchEvents
  };
};
