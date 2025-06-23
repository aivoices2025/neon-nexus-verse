
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
      console.log("🚀 FETCH EVENTS STARTED");
      console.log("📊 Supabase client check:", !!supabase);
      console.log("👤 User check:", user ? user.email : "No user logged in");
      
      console.log("📡 Making database query...");
      const { data, error } = await supabase
        .from('vr_events')
        .select('*')
        .order('created_at', { ascending: false });

      console.log("✅ DATABASE QUERY COMPLETED");
      console.log("📋 Query data result:", data);
      console.log("❌ Query error result:", error);
      console.log("🔢 Number of events returned:", data?.length || 0);
      
      if (error) {
        console.error("💥 DATABASE ERROR DETAILS:", {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        setError(error.message);
        setEvents([]);
        console.log("🚫 Setting error state and empty events");
        return;
      }

      if (data && data.length > 0) {
        console.log("✨ PROCESSING EVENTS DATA:");
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
        console.log("📭 NO EVENTS FOUND - Empty result set");
      }

      console.log("🔄 Setting events state...");
      setEvents(data || []);
      setError(null);
      console.log("✅ Events state updated successfully");
      
    } catch (err) {
      console.error("🚨 EXCEPTION IN FETCH:", err);
      console.error("🚨 Exception details:", {
        name: err?.name,
        message: err?.message,
        stack: err?.stack
      });
      setError("Failed to load events - Exception occurred");
      setEvents([]);
    } finally {
      console.log("🏁 Setting loading to false");
      setIsLoading(false);
      console.log("🏁 Fetch events process completed");
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
    console.log("🎯 useEvents EFFECT TRIGGERED");
    console.log("👤 User in effect:", user ? `${user.email} (ID: ${user.id})` : "No user");
    fetchEvents();
  }, []);

  console.log("🔄 useEvents HOOK RENDER STATE:", {
    eventsCount: events.length,
    isLoading,
    error,
    hasUser: !!user,
    userEmail: user?.email || "none"
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
