
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Target, Users, Lightbulb, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  About AI Blog Hub
                </h1>
                <p className="text-gray-600">Learn about our mission and vision</p>
              </div>
            </div>
            <Link to="/">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-blue-700 font-medium">Our Story</span>
          </div>
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Revolutionizing Content with 
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> AI Power</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're on a mission to transform how content is created, enhanced, and shared. 
            By combining human creativity with artificial intelligence, we're building the future of digital storytelling.
          </p>
        </div>

        {/* Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl">
            <CardContent className="p-8 text-center">
              <Target className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Our Mission</h3>
              <p className="text-blue-100">
                To democratize high-quality content creation by making AI-powered writing tools accessible to everyone.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl">
            <CardContent className="p-8 text-center">
              <Lightbulb className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Our Vision</h3>
              <p className="text-purple-100">
                A world where AI and human creativity collaborate seamlessly to produce exceptional content that inspires and informs.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-xl">
            <CardContent className="p-8 text-center">
              <Users className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Our Values</h3>
              <p className="text-green-100">
                Innovation, accessibility, quality, and ethical AI practices guide everything we do in our journey forward.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl mb-12">
          <CardContent className="p-12">
            <div className="prose prose-lg max-w-none">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">What Makes Us Different</h3>
              
              <p className="text-gray-700 mb-6">
                AI Blog Hub isn't just another blogging platform. We're pioneering a new approach to content creation 
                that harnesses the power of artificial intelligence to enhance human creativity, not replace it.
              </p>

              <h4 className="text-xl font-semibold text-gray-900 mb-4">AI-Enhanced Writing</h4>
              <p className="text-gray-700 mb-6">
                Our platform uses advanced AI models to help transform raw ideas into polished, engaging content. 
                Whether you're starting with a simple URL or raw text, our AI can rewrite, restructure, and enhance 
                your content while maintaining your unique voice and perspective.
              </p>

              <h4 className="text-xl font-semibold text-gray-900 mb-4">Seamless Workflow</h4>
              <p className="text-gray-700 mb-6">
                From content creation to publication, we've designed every aspect of our platform to be intuitive 
                and efficient. Our admin panel provides powerful tools for content management, while our public 
                interface offers readers a beautiful, fast, and engaging experience.
              </p>

              <h4 className="text-xl font-semibold text-gray-900 mb-4">Quality & Ethics</h4>
              <p className="text-gray-700 mb-6">
                We believe in responsible AI usage. Our tools are designed to augment human creativity, maintain 
                content authenticity, and provide transparent AI enhancement indicators to readers.
              </p>

              <h4 className="text-xl font-semibold text-gray-900 mb-4">The Future of Content</h4>
              <p className="text-gray-700">
                As AI technology continues to evolve, so do we. We're constantly updating our platform with the 
                latest advancements in artificial intelligence, ensuring our users always have access to 
                cutting-edge content creation tools.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 shadow-xl">
          <CardContent className="p-12 text-center">
            <h3 className="text-3xl font-bold mb-4">Ready to Experience AI-Powered Content?</h3>
            <p className="text-xl text-blue-100 mb-8">
              Join the future of content creation and discover what's possible when human creativity meets artificial intelligence.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/">
                <Button size="lg" variant="secondary" className="px-8">
                  Explore Articles
                </Button>
              </Link>
              <Link to="/admin">
                <Button size="lg" variant="outline" className="px-8 bg-white/10 border-white/30 text-white hover:bg-white/20">
                  Admin Portal
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;
