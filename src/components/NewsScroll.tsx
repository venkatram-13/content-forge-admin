
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Eye, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Blog {
  id: string;
  title: string;
  views: number;
  slug: string;
  category?: string;
  created_at: string;
}

export const NewsScroll = () => {
  const [topBlogs, setTopBlogs] = useState<Blog[]>([]);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    fetchTopBlogs();
  }, []);

  const fetchTopBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('id, title, views, slug, category, created_at')
        .eq('status', 'published')
        .order('views', { ascending: false })
        .limit(10);

      if (error) throw error;
      setTopBlogs(data || []);
    } catch (error) {
      console.error('Error fetching top blogs:', error);
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category?.toLowerCase()) {
      case 'full-time':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'part-time':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'internship':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      default:
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    }
  };

  if (topBlogs.length === 0) return null;

  return (
    <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-y border-gray-200/50 dark:border-gray-700/50 py-4 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-red-500" />
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              Top Airing Opportunities
            </span>
          </div>
          <div className="h-px bg-gradient-to-r from-red-500 to-transparent flex-1"></div>
        </div>
        
        <div 
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className={`flex gap-6 ${!isHovered ? 'animate-scroll' : ''}`}>
            {/* First set of items */}
            {topBlogs.map((blog, index) => (
              <Link
                key={`first-${blog.id}`}
                to={`/blog/${blog.slug}`}
                className="flex-shrink-0 group"
              >
                <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200/50 dark:border-gray-700/50 min-w-[320px]">
                  <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 text-white text-sm font-bold rounded-full flex-shrink-0">
                    {index + 1}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {blog.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      {blog.category && (
                        <Badge className={`text-xs px-2 py-0.5 ${getCategoryColor(blog.category)}`}>
                          {blog.category}
                        </Badge>
                      )}
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Eye className="w-3 h-3" />
                        {blog.views || 0}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            
            {/* Duplicate set for seamless scrolling */}
            {topBlogs.map((blog, index) => (
              <Link
                key={`second-${blog.id}`}
                to={`/blog/${blog.slug}`}
                className="flex-shrink-0 group"
              >
                <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200/50 dark:border-gray-700/50 min-w-[320px]">
                  <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 text-white text-sm font-bold rounded-full flex-shrink-0">
                    {index + 1}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {blog.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      {blog.category && (
                        <Badge className={`text-xs px-2 py-0.5 ${getCategoryColor(blog.category)}`}>
                          {blog.category}
                        </Badge>
                      )}
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Eye className="w-3 h-3" />
                        {blog.views || 0}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
