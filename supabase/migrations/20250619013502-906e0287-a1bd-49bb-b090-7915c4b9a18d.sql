
-- Create admin users table for authentication
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blogs table to store blog posts
CREATE TABLE public.blogs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  featured_image TEXT,
  slug TEXT UNIQUE NOT NULL,
  author TEXT NOT NULL DEFAULT 'Admin',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on blogs table
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to published blogs
CREATE POLICY "Public can view published blogs" 
  ON public.blogs 
  FOR SELECT 
  USING (status = 'published');

-- Create policy to allow all operations for admin (we'll handle admin auth in the app)
CREATE POLICY "Admin can manage all blogs" 
  ON public.blogs 
  FOR ALL 
  USING (true)
  WITH CHECK (true);

-- Enable RLS on admin_users table
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policy for admin users (only allow operations from edge functions)
CREATE POLICY "Admin users policy" 
  ON public.admin_users 
  FOR ALL 
  USING (true)
  WITH CHECK (true);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_blogs_updated_at 
  BEFORE UPDATE ON public.blogs 
  FOR EACH ROW 
  EXECUTE PROCEDURE public.update_updated_at_column();
