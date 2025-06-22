
-- Create a table to track daily blog view analytics
CREATE TABLE public.blog_view_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  blog_id UUID REFERENCES public.blogs(id) ON DELETE CASCADE,
  view_date DATE NOT NULL DEFAULT CURRENT_DATE,
  daily_views INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(blog_id, view_date)
);

-- Create an index for better query performance
CREATE INDEX idx_blog_view_analytics_blog_date ON public.blog_view_analytics(blog_id, view_date);
CREATE INDEX idx_blog_view_analytics_date ON public.blog_view_analytics(view_date);

-- Create a trigger to update the updated_at column
CREATE TRIGGER update_blog_view_analytics_updated_at
  BEFORE UPDATE ON public.blog_view_analytics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create a function to increment daily view count
CREATE OR REPLACE FUNCTION public.increment_blog_view(blog_uuid UUID)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Insert or update the daily view count
  INSERT INTO public.blog_view_analytics (blog_id, view_date, daily_views)
  VALUES (blog_uuid, CURRENT_DATE, 1)
  ON CONFLICT (blog_id, view_date)
  DO UPDATE SET 
    daily_views = blog_view_analytics.daily_views + 1,
    updated_at = now();
    
  -- Also update the main blogs table view count
  UPDATE public.blogs 
  SET views = views + 1, updated_at = now()
  WHERE id = blog_uuid;
END;
$$;
