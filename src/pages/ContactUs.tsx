
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin, Send, Clock, Briefcase } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting TalentSpur. We'll get back to you soon.",
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 px-4 py-2 rounded-full mb-6">
            <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-blue-700 dark:text-blue-300 font-medium">Get In Touch</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Contact <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">TalentSpur</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Have questions about our platform? Need support? We're here to help you succeed in your career journey.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Email</h4>
                    <p className="text-gray-600 dark:text-gray-300">support@talentspur.com</p>
                    <p className="text-gray-600 dark:text-gray-300">careers@talentspur.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Phone</h4>
                    <p className="text-gray-600 dark:text-gray-300">+1 (555) 123-4567</p>
                    <p className="text-gray-600 dark:text-gray-300">+1 (555) 987-6543</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Address</h4>
                    <p className="text-gray-600 dark:text-gray-300">123 TalentSpur Street</p>
                    <p className="text-gray-600 dark:text-gray-300">Silicon Valley, CA 94105</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Business Hours</h4>
                    <p className="text-gray-600 dark:text-gray-300">Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p className="text-gray-600 dark:text-gray-300">Saturday: 10:00 AM - 4:00 PM</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white border-0 shadow-xl">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-3">Quick Support</h3>
                <p className="text-blue-100 mb-4">
                  Need immediate assistance? Our support team is available to help you with common questions.
                </p>
                <Button variant="secondary" className="w-full bg-white text-blue-600 hover:bg-blue-50">
                  Get Help Now
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 dark:text-white">Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name" className="text-base font-medium text-gray-900 dark:text-gray-200">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        className="mt-2 h-12 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-base font-medium text-gray-900 dark:text-gray-200">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your.email@example.com"
                        className="mt-2 h-12 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject" className="text-base font-medium text-gray-900 dark:text-gray-200">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="What's this about?"
                      className="mt-2 h-12 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-base font-medium text-gray-900 dark:text-gray-200">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us more about your inquiry..."
                      rows={6}
                      className="mt-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                      required
                    />
                  </div>

                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>

                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    We typically respond within 24 hours during business days.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ContactUs;
