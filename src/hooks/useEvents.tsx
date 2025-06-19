
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
      console.log("Fetching VR events...");
      const { data, error } = await supabase
        .from('vr_events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching events:", error);
        setError(error.message);
        return;
      }

      console.log("Fetched events:", data?.length);
      setEvents(data || []);
      setError(null);
    } catch (err) {
      console.error("Exception fetching events:", err);
      setError("Failed to load events");
    } finally {
      setIsLoading(false);
    }
  };

  const createEvent = async (eventData: Omit<VREvent, 'id' | 'created_at' | 'created_by' | 'attendees'>) => {
    if (!user) {
      throw new Error("User must be logged in to create events");
    }

    try {
      console.log("Creating new event:", eventData.title);
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
        console.error("Error creating event:", error);
        throw new Error(error.message);
      }

      console.log("Event created successfully:", data?.title);
      await fetchEvents(); // Refresh the events list
      return data;
    } catch (err) {
      console.error("Exception creating event:", err);
      throw err;
    }
  };

  const joinEvent = async (eventId: string) => {
    if (!user) {
      throw new Error("User must be logged in to join events");
    }

    try {
      console.log("Joining event:", eventId);
      // Get current event data first
      const { data: currentEvent, error: fetchError } = await supabase
        .from('vr_events')
        .select('attendees')
        .eq('id', eventId)
        .single();

      if (fetchError) {
        console.error("Error fetching current event:", fetchError);
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
        console.error("Error joining event:", error);
        throw new Error(error.message);
      }

      console.log("Successfully joined event");
      await fetchEvents(); // Refresh the events list
    } catch (err) {
      console.error("Exception joining event:", err);
      throw err;
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events,
    isLoading,
    error,
    createEvent,
    joinEvent,
    refreshEvents: fetchEvents
  };
};
