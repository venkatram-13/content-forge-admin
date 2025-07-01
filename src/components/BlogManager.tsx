
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Edit, Trash2, Eye, BarChart3, ExternalLink } from 'lucide-react';
import { BlogAnalytics } from './BlogAnalytics';
import { CreateBlog } from './CreateBlog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
}

interface BlogManagerProps {
  blogs: Blog[];
  onBlogsUpdated: (blogs: Blog[]) => void;
}

export const BlogManager = ({ blogs, onBlogsUpdated }: BlogManagerProps) => {
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  const handleDelete = async (blogId: string) => {
    setLoading(blogId);
    try {
      const { data, error } = await supabase.functions.invoke('blog-operations', {
        body: { action: 'delete', blogId }
      });

      if (error) throw error;

      if (data.success) {
        const updatedBlogs = blogs.filter(blog => blog.id !== blogId);
        onBlogsUpdated(updatedBlogs);
        toast.success('Blog deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast.error('Failed to delete blog');
    } finally {
      setLoading(null);
    }
  };

  const handlePublish = async (blogId: string) => {
    setLoading(blogId);
    try {
      const { data, error } = await supabase.functions.invoke('blog-operations', {
        body: { 
          action: 'update', 
          blogId,
          updates: { status: 'published' }
        }
      });

      if (error) throw error;

      if (data.success) {
        const updatedBlogs = blogs.map(blog => 
          blog.id === blogId ? { ...blog, status: 'published' as const } : blog
        );
        onBlogsUpdated(updatedBlogs);
        toast.success('Blog published successfully!');
      }
    } catch (error) {
      console.error('Error publishing blog:', error);
      toast.error('Failed to publish blog');
    } finally {
      setLoading(null);
    }
  };

  const handleEditComplete = (updatedBlog: Blog) => {
    const updatedBlogs = blogs.map(blog => 
      blog.id === updatedBlog.id ? updatedBlog : blog
    );
    onBlogsUpdated(updatedBlogs);
    setEditOpen(false);
    setSelectedBlog(null);
  };

  const openAnalytics = (blog: Blog) => {
    setSelectedBlog(blog);
    setAnalyticsOpen(true);
  };

  const openEdit = (blog: Blog) => {
    setSelectedBlog(blog);
    setEditOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (blogs.length === 0) {
    return (
      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
        <CardContent className="p-12 text-center">
          <div className="text-gray-500 dark:text-gray-400 mb-4">
            <Edit className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No blogs created yet</h3>
            <p>Create your first blog to get started!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Blogs</h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {blogs.length} blog{blogs.length !== 1 ? 's' : ''} total
        </div>
      </div>

      <div className="grid gap-6">
        {blogs.map((blog) => (
          <Card key={blog.id} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-lg text-gray-900 dark:text-white">{blog.title}</CardTitle>
                    <Badge variant={blog.status === 'published' ? 'default' : 'secondary'}>
                      {blog.status}
                    </Badge>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">{blog.excerpt}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span>By {blog.author}</span>
                    <span>{formatDate(blog.created_at)}</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {blog.views} views
                    </span>
                  </div>
                </div>
                {blog.featured_image && (
                  <img
                    src={blog.featured_image}
                    alt={blog.title}
                    className="w-20 h-20 object-cover rounded-lg ml-4"
                  />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openAnalytics(blog)}
                  className="flex items-center gap-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  Analytics
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEdit(blog)}
                  className="flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
                
                {blog.status === 'published' && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="flex items-center gap-2"
                  >
                    <a href={`/blog/${blog.slug}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                      View
                    </a>
                  </Button>
                )}
                
                {blog.status === 'draft' && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handlePublish(blog.id)}
                    disabled={loading === blog.id}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Publish
                  </Button>
                )}
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex items-center gap-2"
                      disabled={loading === blog.id}
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Blog</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{blog.title}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(blog.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analytics Modal */}
      <Dialog open={analyticsOpen} onOpenChange={setAnalyticsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Blog Analytics</DialogTitle>
          </DialogHeader>
          {selectedBlog && (
            <BlogAnalytics
              blogId={selectedBlog.id}
              blogTitle={selectedBlog.title}
              onClose={() => setAnalyticsOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Blog</DialogTitle>
          </DialogHeader>
          {selectedBlog && (
            <CreateBlog
              existingBlog={selectedBlog}
              onBlogCreated={handleEditComplete}
              isEditing={true}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
