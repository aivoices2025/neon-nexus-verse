
-- Add video_url column to vr_events table
ALTER TABLE public.vr_events ADD COLUMN video_url TEXT;

-- Insert a test event with 360° video
INSERT INTO public.vr_events (
  title,
  description,
  category,
  event_date,
  image_url,
  is_live,
  vr_enabled,
  has_360_video,
  video_url,
  created_by,
  attendees
) VALUES (
  '360° Virtual Concert Experience',
  'Immerse yourself in a stunning 360° concert experience. Put on your VR headset and feel like you''re right there on stage with the performers.',
  'Entertainment',
  NOW() + INTERVAL '1 hour',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&crop=center',
  true,
  true,
  true,
  'https://www.youtube.com/watch?v=BzMLA8YIgG0',
  (SELECT id FROM auth.users LIMIT 1),
  45
);
