
-- First, let's check if we can make created_by nullable temporarily for test data, 
-- or create a test event that will be associated with the current user when they're logged in.
-- Let's make created_by nullable for now to allow test data
ALTER TABLE public.vr_events ALTER COLUMN created_by DROP NOT NULL;

-- Now create the test VR event with 360° video support
INSERT INTO public.vr_events (
  title,
  description,
  category,
  event_date,
  has_360_video,
  video_url,
  vr_enabled,
  is_live,
  image_url
) VALUES (
  'Test 360° VR Event',
  'Sample immersive video experience showcasing 360° video technology in VR. Click to experience 360° video with head tracking support!',
  'Technology',
  NOW() + INTERVAL '1 hour',
  true,
  'https://cdn.aframe.io/360-video/tracking-shot.mp4',
  true,
  true,
  'https://images.unsplash.com/photo-1592478411213-6153e4ebc696?w=800&h=600&fit=crop'
);
