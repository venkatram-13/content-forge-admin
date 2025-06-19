
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Calendar, User, ArrowRight, Sparkles, Globe, BookOpen, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  featured_image: string;
  created_at: string;
  author: string;
  slug: string;
  status: 'published' | 'draft';
}

const Index = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPublishedBlogs();
  }, []);

  const fetchPublishedBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) throw error;
      // Cast the data to ensure proper typing
      const typedBlogs: Blog[] = (data || []).map(blog => ({
        ...blog,
        status: blog.status as 'published' | 'draft'
      }));
      setBlogs(typedBlogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI Blog Hub
                </h1>
                <p className="text-gray-600">Powered by Artificial Intelligence</p>
              </div>
            </div>
            <Link to="/admin">
              <Button variant="outline" className="flex items-center gap-2 hover:bg-blue-50">
                <Settings className="w-4 h-4" />
                Admin Portal
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full mb-6">
            <Globe className="w-4 h-4 text-blue-600" />
            <span className="text-blue-700 font-medium">AI-Powered Content</span>
          </div>
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Discover Amazing 
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> AI Stories</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Explore our collection of AI-enhanced blog posts, crafted with cutting-edge technology to bring you the most engaging content.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-2xl mx-auto mb-12">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search articles by title or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-14 text-lg bg-white/80 backdrop-blur-sm border-0 shadow-lg"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl">
            <CardContent className="p-6 text-center">
              <BookOpen className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{blogs.length}</div>
              <div className="text-blue-100">Published Articles</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl">
            <CardContent className="p-6 text-center">
              <Sparkles className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">100%</div>
              <div className="text-purple-100">AI Enhanced</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-xl">
            <CardContent className="p-6 text-center">
              <Globe className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-green-100">Always Updated</div>
            </CardContent>
          </Card>
        </div>

        {/* Blog Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading amazing content...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm ? 'No articles found' : 'No articles yet'}
            </h3>
            <p className="text-gray-600">
              {searchTerm ? 'Try adjusting your search terms.' : 'New AI-powered content coming soon!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog) => (
              <Card key={blog.id} className="group hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:-translate-y-2">
                <div className="aspect-video overflow-hidden rounded-t-lg">
                  <img
                    src={blog.featured_image}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      <Sparkles className="w-3 h-3 mr-1" />
                      AI Enhanced
                    </Badge>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {blog.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {blog.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(blog.created_at)}
                      </div>
                    </div>
                  </div>
                  
                  <Link to={`/blog/${blog.slug}`} className="group/link">
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 group-hover/link:shadow-lg transition-all duration-200">
                      Read Full Article
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Footer with links to additional pages */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-white/20 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI Blog Hub
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                The future of content creation powered by artificial intelligence. 
                Discover, learn, and be inspired by AI-enhanced stories.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Platform</h4>
              <div className="space-y-2">
                <Link to="/about" className="block text-gray-600 hover:text-blue-600 transition-colors">About Us</Link>
                <Link to="/admin" className="block text-gray-600 hover:text-blue-600 transition-colors">Admin Portal</Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
              <div className="space-y-2">
                <Link to="/privacy" className="block text-gray-600 hover:text-blue-600 transition-colors">Privacy Policy</Link>
                <Link to="/terms" className="block text-gray-600 hover:text-blue-600 transition-colors">Terms & Conditions</Link>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
            <p>&copy; 2024 AI Blog Hub. All rights reserved. Powered by artificial intelligence.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
