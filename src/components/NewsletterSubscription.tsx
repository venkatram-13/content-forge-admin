
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const NewsletterSubscription = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .insert([{ email }]);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Already Subscribed",
            description: "This email is already subscribed to our newsletter.",
            variant: "default",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Successfully Subscribed!",
          description: "Thank you for subscribing to our newsletter.",
        });
        setEmail('');
      }
    } catch (error) {
      toast({
        title: "Subscription Failed",
        description: "There was an error subscribing to the newsletter. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
          <Mail className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-white font-semibold text-lg">Stay Updated</h3>
          <p className="text-blue-100 text-sm">Get the latest job opportunities delivered to your inbox</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-blue-100"
          required
        />
        <Button 
          type="submit" 
          disabled={isLoading}
          className="bg-white text-blue-600 hover:bg-blue-50"
        >
          {isLoading ? 'Subscribing...' : 'Subscribe'}
        </Button>
      </form>
    </div>
  );
};
