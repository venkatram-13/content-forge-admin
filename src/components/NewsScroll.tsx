
import { useState, useEffect, useRef } from 'react';
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
  featured_image?: string;
}

export const NewsScroll = () => {
  const [topBlogs, setTopBlogs] = useState<Blog[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const positionRef = useRef(0);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    fetchTopBlogs();
  }, []);

  useEffect(() => {
    if (!isHovered && topBlogs.length > 0) {
      startScrolling();
    } else {
      stopScrolling();
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isHovered, topBlogs.length]);

  const startScrolling = () => {
    const scroll = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const deltaTime = timestamp - lastTimeRef.current;
      
      // Speed: move 60 pixels per second (3x faster than before)
      const speed = 60;
      positionRef.current += (deltaTime / 1000) * speed;
      
      if (scrollRef.current) {
        const maxScroll = scrollRef.current.scrollWidth / 2; // Half because we duplicate content
        if (positionRef.current >= maxScroll) {
          positionRef.current = 0;
        }
        scrollRef.current.style.transform = `translateX(-${positionRef.current}px)`;
      }
      
      lastTimeRef.current = timestamp;
      animationRef.current = requestAnimationFrame(scroll);
    };
    
    animationRef.current = requestAnimationFrame(scroll);
  };

  const stopScrolling = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    lastTimeRef.current = 0;
  };

  const fetchTopBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('id, title, views, slug, category, created_at, featured_image')
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
    <div className="bg-gradient-to-r from-white/60 via-blue-50/40 to-purple-50/40 dark:from-gray-900/60 dark:via-gray-800/40 dark:to-slate-900/40 backdrop-blur-sm border-y border-gradient-to-r from-blue-200/30 via-purple-200/30 to-pink-200/30 dark:border-gray-700/50 py-6 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="relative">
              <TrendingUp className="w-6 h-6 text-red-500 animate-pulse" />
              <div className="absolute -inset-1 bg-red-500/20 rounded-full animate-ping"></div>
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
              🔥 Top Airing Opportunities
            </span>
          </div>
          <div className="h-px bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400 flex-1 shadow-lg"></div>
        </div>
        
        <div 
          className="relative overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div 
            ref={scrollRef}
            className="flex gap-6 w-max"
          >
            {/* First set of items */}
            {topBlogs.map((blog, index) => (
              <Link
                key={`first-${blog.id}`}
                to={`/blog/${blog.slug}`}
                className="flex-shrink-0 group"
              >
                <div className="flex items-center gap-4 bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-800/80 rounded-xl px-5 py-4 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 min-w-[380px] hover:scale-105 hover:border-blue-300/50 dark:hover:border-blue-600/50">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 text-white text-sm font-bold rounded-full flex-shrink-0 shadow-lg animate-pulse">
                    {index + 1}
                  </div>
                  
                  <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden shadow-md">
                    <img
                      src={blog.featured_image || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=200&h=200&fit=crop"}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-base">
                      {blog.title}
                    </h4>
                    <div className="flex items-center gap-3 mt-2">
                      {blog.category && (
                        <Badge className={`text-xs px-2 py-1 ${getCategoryColor(blog.category)} shadow-sm`}>
                          {blog.category}
                        </Badge>
                      )}
                      <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                        <Eye className="w-4 h-4" />
                        <span className="font-medium">{blog.views || 0}</span>
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
                <div className="flex items-center gap-4 bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-800/80 rounded-xl px-5 py-4 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 min-w-[380px] hover:scale-105 hover:border-blue-300/50 dark:hover:border-blue-600/50">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 text-white text-sm font-bold rounded-full flex-shrink-0 shadow-lg animate-pulse">
                    {index + 1}
                  </div>
                  
                  <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden shadow-md">
                    <img
                      src={blog.featured_image || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=200&h=200&fit=crop"}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-base">
                      {blog.title}
                    </h4>
                    <div className="flex items-center gap-3 mt-2">
                      {blog.category && (
                        <Badge className={`text-xs px-2 py-1 ${getCategoryColor(blog.category)} shadow-sm`}>
                          {blog.category}
                        </Badge>
                      )}
                      <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                        <Eye className="w-4 h-4" />
                        <span className="font-medium">{blog.views || 0}</span>
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
