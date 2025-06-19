
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, Calendar, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

interface BlogManagerProps {
  blogs: Blog[];
  onBlogsUpdated: (blogs: Blog[]) => void;
}

export const BlogManager = ({ blogs, onBlogsUpdated }: BlogManagerProps) => {
  const [selectedBlogs, setSelectedBlogs] = useState<string[]>([]);
  const { toast } = useToast();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const deleteBlog = (blogId: string) => {
    const updatedBlogs = blogs.filter(blog => blog.id !== blogId);
    onBlogsUpdated(updatedBlogs);
    toast({
      title: "Blog Deleted",
      description: "The blog post has been successfully deleted.",
    });
  };

  const toggleStatus = (blogId: string) => {
    const updatedBlogs = blogs.map(blog => 
      blog.id === blogId 
        ? { ...blog, status: blog.status === 'published' ? 'draft' as const : 'published' as const }
        : blog
    );
    onBlogsUpdated(updatedBlogs);
    
    const blog = blogs.find(b => b.id === blogId);
    const newStatus = blog?.status === 'published' ? 'draft' : 'published';
    
    toast({
      title: `Blog ${newStatus === 'published' ? 'Published' : 'Unpublished'}`,
      description: `The blog post is now ${newStatus}.`,
    });
  };

  if (blogs.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Edit className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No blogs yet</h3>
          <p className="text-gray-600 mb-4">Create your first blog post to get started.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Manage Blog Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {blogs.map((blog) => (
              <div key={blog.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-shrink-0">
                  <img
                    src={blog.featured_image || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=100&h=60&fit=crop"}
                    alt={blog.title}
                    className="w-16 h-10 object-cover rounded"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate mb-1">
                    {blog.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {blog.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(blog.created_at)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant={blog.status === 'published' ? 'default' : 'secondary'}>
                    {blog.status}
                  </Badge>
                  
                  <div className="flex items-center gap-1">
                    {blog.status === 'published' && (
                      <Link to={`/blog/${blog.slug}`} target="_blank">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleStatus(blog.id)}
                    >
                      {blog.status === 'published' ? 'Unpublish' : 'Publish'}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteBlog(blog.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
