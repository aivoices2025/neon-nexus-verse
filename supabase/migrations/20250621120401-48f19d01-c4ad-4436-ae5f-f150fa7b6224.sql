
-- Add video_url column to vr_events table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vr_events' AND column_name = 'video_url') THEN
        ALTER TABLE public.vr_events ADD COLUMN video_url TEXT;
    END IF;
END $$;

-- Insert a test event with 360° video using a working equirectangular video URL
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
  'Immerse yourself in a stunning 360° concert experience. Put on your VR headset and feel like you''re right there on stage with the performers. This demo uses an equirectangular 360° video that works perfectly with VR headsets.',
  'Entertainment',
  NOW() + INTERVAL '1 hour',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&crop=center',
  true,
  true,
  true,
  'https://ucarecdn.com/fadab25d-0b3a-45f7-8ef5-85318393d0ee/',
  (SELECT id FROM auth.users LIMIT 1),
  45
) ON CONFLICT DO NOTHING;

-- Insert another test event with different 360° content
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
  '360° Nature Documentary',
  'Experience the beauty of nature in full 360° immersion. Walk through forests, explore underwater scenes, and witness wildlife up close in this breathtaking VR experience.',
  'Education',
  NOW() + INTERVAL '2 hours',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop&crop=center',
  true,
  true,
  true,
  'https://ucarecdn.com/bcece0a8-86ce-4f12-b5c3-ff8b0e0b6f1e/',
  (SELECT id FROM auth.users LIMIT 1),
  78
) ON CONFLICT DO NOTHING;
