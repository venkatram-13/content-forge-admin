
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Target, Users, Lightbulb } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { Footer } from '@/components/Footer';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-blue-700 dark:text-blue-300 font-medium">Our Story</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Revolutionizing Careers with 
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> TalentSpur</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            We're on a mission to transform how talent meets opportunity. 
            By connecting skilled professionals with the right employers, we're building the future of career success.
          </p>
        </div>

        {/* Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl">
            <CardContent className="p-8 text-center">
              <Target className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Our Mission</h3>
              <p className="text-blue-100">
                To democratize career opportunities by making quality job matches accessible to everyone, everywhere.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl">
            <CardContent className="p-8 text-center">
              <Lightbulb className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Our Vision</h3>
              <p className="text-purple-100">
                A world where every professional finds their perfect career match and every company discovers exceptional talent.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-xl">
            <CardContent className="p-8 text-center">
              <Users className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Our Values</h3>
              <p className="text-green-100">
                Innovation, accessibility, quality, and ethical practices guide everything we do in our journey forward.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl mb-12">
          <CardContent className="p-12">
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">What Makes Us Different</h2>
              
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                TalentSpur isn't just another job board. We're pioneering a new approach to career matching 
                that puts both candidates and employers at the center of success.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Smart Matching</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Our platform uses intelligent algorithms to match candidates with roles that truly fit 
                their skills, experience, and career aspirations, creating better outcomes for everyone.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Comprehensive Support</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                From internships to executive positions, we provide resources and guidance throughout 
                your entire career journey, ensuring you're always moving forward.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quality & Trust</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                We verify opportunities and maintain high standards for both job postings and candidate 
                profiles, creating a trusted environment for professional connections.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">The Future of Careers</h3>
              <p className="text-gray-700 dark:text-gray-300">
                As the job market continues to evolve, so do we. We're constantly updating our platform 
                with new features and insights to help you stay ahead in your career journey.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default About;
