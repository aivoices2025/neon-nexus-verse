
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
      console.log("🔥 STARTING EVENT FETCH 🔥");
      console.log("📊 Supabase client available:", !!supabase);
      console.log("👤 Current user:", user ? user.email : "No user");
      
      const { data, error } = await supabase
        .from('vr_events')
        .select('*')
        .order('created_at', { ascending: false });

      console.log("✅ QUERY COMPLETE ✅");
      console.log("📋 Raw data from database:", data);
      console.log("❌ Error from database:", error);
      console.log("🔢 Number of events found:", data?.length || 0);
      
      if (data && data.length > 0) {
        console.log("🎬 EVENT DETAILS:");
        data.forEach((event, index) => {
          console.log(`Event ${index + 1}:`, {
            id: event.id,
            title: event.title,
            category: event.category,
            is_live: event.is_live,
            has_360_video: event.has_360_video,
            video_url: event.video_url
          });
        });
      } else {
        console.log("⚠️ NO EVENTS FOUND IN DATABASE");
      }

      if (error) {
        console.error("💥 DATABASE ERROR:", error);
        console.error("💥 Error message:", error.message);
        console.error("💥 Error code:", error.code);
        setError(error.message);
        setEvents([]);
        return;
      }

      console.log("✨ SETTING EVENTS STATE WITH", data?.length || 0, "EVENTS");
      setEvents(data || []);
      setError(null);
    } catch (err) {
      console.error("🚨 EXCEPTION DURING FETCH:", err);
      setError("Failed to load events");
      setEvents([]);
    } finally {
      console.log("🏁 SETTING LOADING TO FALSE");
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
    console.log("🚀 useEvents EFFECT TRIGGERED");
    console.log("👤 User in effect:", user ? user.email : "No user");
    fetchEvents();
  }, []);

  console.log("🔄 useEvents HOOK RENDER:", {
    eventsCount: events.length,
    isLoading,
    error,
    hasUser: !!user
  });

  return {
    events,
    isLoading,
    error,
    createEvent,
    joinEvent,
    refreshEvents: fetchEvents
  };
};
