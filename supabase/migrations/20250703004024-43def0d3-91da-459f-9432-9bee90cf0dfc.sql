
-- Create newsletter_subscriptions table
CREATE TABLE public.newsletter_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Enable RLS on newsletter_subscriptions table
ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public to insert subscriptions
CREATE POLICY "Anyone can subscribe to newsletter" 
  ON public.newsletter_subscriptions 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy to allow public to select their own subscription (for checking duplicates)
CREATE POLICY "Public can view newsletter subscriptions" 
  ON public.newsletter_subscriptions 
  FOR SELECT 
  USING (true);
