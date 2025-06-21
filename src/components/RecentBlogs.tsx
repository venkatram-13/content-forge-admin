
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, User, Eye, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Blog {
  id: string;
  title: string;
  excerpt: string;
  featured_image: string;
  created_at: string;
  author: string;
  slug: string;
  views: number;
}

interface RecentBlogsProps {
  currentBlogId?: string;
}

export const RecentBlogs = ({ currentBlogId }: RecentBlogsProps) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const pageSize = 6;

  useEffect(() => {
    fetchBlogs();
  }, [currentBlogId]);

  const fetchBlogs = async (loadMore = false) => {
    if (loadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const currentPage = loadMore ? page + 1 : 0;
      const from = currentPage * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from('blogs')
        .select('id, title, excerpt, featured_image, created_at, author, slug, views')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .range(from, to);

      // Exclude current blog if viewing a specific blog
      if (currentBlogId) {
        query = query.neq('id', currentBlogId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching recent blogs:', error);
        return;
      }

      if (loadMore) {
        setBlogs(prev => [...prev, ...(data || [])]);
        setPage(currentPage);
      } else {
        setBlogs(data || []);
        setPage(0);
      }

      // Check if there are more blogs to load
      setHasMore((data || []).length === pageSize);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    fetchBlogs(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Job Posts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <div className="w-full h-48 bg-gray-200 rounded-t-lg"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="flex justify-between items-center">
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (blogs.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Job Posts</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <Card key={blog.id} className="group hover:shadow-lg transition-shadow duration-200 overflow-hidden">
            <Link to={`/blog/${blog.slug}`}>
              <div className="relative">
                <img
                  src={blog.featured_image || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=200&fit=crop"}
                  alt={blog.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {blog.views}
                </div>
              </div>
              <CardContent className="p-4">
                <h4 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {blog.title}
                </h4>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {blog.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{blog.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(blog.created_at)}</span>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>

      {hasMore && (
        <div className="text-center">
          <Button
            onClick={loadMore}
            disabled={loadingMore}
            variant="outline"
            className="flex items-center gap-2"
          >
            {loadingMore ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Load More Posts
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
