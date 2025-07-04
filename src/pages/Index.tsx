import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Calendar, User, ArrowRight, Briefcase, Globe, BookOpen, Eye, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import FilterControls from '@/components/FilterControls';
import { NewsScroll } from '@/components/NewsScroll';

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
  views: number;
  category?: string;
}

const Index = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'top-airing' | 'latest'>('top-airing');

  useEffect(() => {
    fetchPublishedBlogs();
  }, []);

  useEffect(() => {
    filterAndSortBlogs();
  }, [blogs, activeFilter, searchTerm]);

  const fetchPublishedBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const typedBlogs: Blog[] = (data || []).map(blog => ({
        ...blog,
        status: blog.status as 'published' | 'draft',
        views: blog.views || 0,
        category: blog.category || undefined
      }));
      setBlogs(typedBlogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortBlogs = () => {
    let filtered = blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort based on active filter
    if (activeFilter === 'top-airing') {
      filtered = filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else {
      filtered = filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    setFilteredBlogs(filtered);
  };

  const handleBlogClick = async (blogId: string) => {
    // Increment view count
    try {
      // First get the current view count
      const { data: currentBlog, error: fetchError } = await supabase
        .from('blogs')
        .select('views')
        .eq('id', blogId)
        .single();

      if (fetchError) throw fetchError;

      // Then update with incremented value
      const { error: updateError } = await supabase
        .from('blogs')
        .update({ views: (currentBlog.views || 0) + 1 })
        .eq('id', blogId);

      if (updateError) throw updateError;

      // Update local state to reflect the change
      setBlogs(prevBlogs => 
        prevBlogs.map(blog => 
          blog.id === blogId 
            ? { ...blog, views: (blog.views || 0) + 1 }
            : blog
        )
      );
    } catch (error) {
      console.error('Error updating view count:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryBadgeColor = (category?: string) => {
    switch (category?.toLowerCase()) {
      case 'full-time':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'part-time':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'internship':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
      case 'job':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-slate-900">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 px-4 py-2 rounded-full mb-6">
            <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-blue-700 dark:text-blue-300 font-medium">AI-Powered Job Portal</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Find Your Dream 
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Career at TalentSpur</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Discover amazing job opportunities, internships, and career advancement paths with our AI-enhanced job matching platform.
          </p>
        </div>
      </div>

      {/* News Scroll Component */}
      <NewsScroll />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search */}
        <div className="relative max-w-2xl mx-auto mb-8">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search jobs, internships, or companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-14 text-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg dark:text-gray-100"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex justify-center mb-8">
          <FilterControls 
            activeFilter={activeFilter} 
            onFilterChange={setActiveFilter}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl">
            <CardContent className="p-6 text-center">
              <BookOpen className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{blogs.length}</div>
              <div className="text-blue-100">Job Opportunities</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2" />
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

        {/* Job Listings */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading amazing opportunities...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {searchTerm ? 'No jobs found' : 'No opportunities yet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm ? 'Try adjusting your search terms.' : 'New job opportunities coming soon!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog) => (
              <Card key={blog.id} className="group hover:shadow-2xl transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:-translate-y-2">
                <div className="aspect-video overflow-hidden rounded-t-lg">
                  <img
                    src={blog.featured_image || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&h=300&fit=crop"}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                        <Briefcase className="w-3 h-3 mr-1" />
                        {activeFilter === 'top-airing' ? 'Top Airing' : 'Latest'}
                      </Badge>
                      {blog.category && (
                        <Badge className={`text-xs ${getCategoryBadgeColor(blog.category)}`}>
                          {blog.category}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                      <Eye className="w-3 h-3" />
                      {blog.views || 0}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {blog.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
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
                  
                  <Link 
                    to={`/blog/${blog.slug}`} 
                    className="group/link"
                    onClick={() => handleBlogClick(blog.id)}
                  >
                    <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 group-hover/link:shadow-lg flex items-center justify-center gap-2">
                      View Details
                      <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-white/20 dark:border-gray-700/20 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  TalentSpur
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                The future of career discovery powered by artificial intelligence. 
                Connect with top employers and find your dream job or internship.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Platform</h4>
              <div className="space-y-2">
                <Link to="/about" className="block text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About Us</Link>
                <Link to="/contact" className="block text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact Us</Link>
                <Link to="/admin" className="block text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Admin Portal</Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Legal</h4>
              <div className="space-y-2">
                <Link to="/privacy" className="block text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</Link>
                <Link to="/terms" className="block text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms & Conditions</Link>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center text-gray-600 dark:text-gray-400">
            <p>&copy; 2024 TalentSpur. All rights reserved. Powered by artificial intelligence.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
