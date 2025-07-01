
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
        body: { action: 'delete', id: blogId }
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
      <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-0 shadow-2xl">
        <CardContent className="p-8 md:p-12 text-center">
          <div className="text-slate-500 dark:text-slate-400 mb-4">
            <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-6 bg-gradient-to-r from-violet-100 to-pink-100 dark:from-slate-700 dark:to-slate-600 rounded-3xl flex items-center justify-center">
              <Edit className="w-8 h-8 md:w-10 md:h-10 text-violet-600 dark:text-slate-300" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-3 text-slate-900 dark:text-white">No blogs created yet</h3>
            <p className="text-base md:text-lg text-slate-600 dark:text-slate-300">Create your first blog to get started!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Manage Blogs</h2>
        <div className="text-sm text-slate-500 dark:text-slate-400 bg-white/80 dark:bg-slate-800/80 px-4 py-2 rounded-2xl shadow-lg backdrop-blur-sm">
          {blogs.length} blog{blogs.length !== 1 ? 's' : ''} total
        </div>
      </div>

      <div className="grid gap-6 md:gap-8">
        {blogs.map((blog) => (
          <Card key={blog.id} className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-[1.02] group">
            <CardHeader className="pb-4">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                    <CardTitle className="text-lg md:text-xl text-slate-900 dark:text-white line-clamp-2 break-words group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                      {blog.title}
                    </CardTitle>
                    <Badge 
                      variant={blog.status === 'published' ? 'default' : 'secondary'}
                      className={`w-fit text-xs px-3 py-1 rounded-full font-medium ${
                        blog.status === 'published' 
                          ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg' 
                          : 'bg-gradient-to-r from-orange-400 to-amber-400 text-white shadow-lg'
                      }`}
                    >
                      {blog.status}
                    </Badge>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-2 break-words leading-relaxed">
                    {blog.excerpt}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <span className="bg-violet-50 dark:bg-slate-700 px-2 py-1 rounded-lg">By {blog.author}</span>
                    <span className="bg-violet-50 dark:bg-slate-700 px-2 py-1 rounded-lg">{formatDate(blog.created_at)}</span>
                    <span className="flex items-center gap-1 bg-violet-50 dark:bg-slate-700 px-2 py-1 rounded-lg">
                      <Eye className="w-3 h-3" />
                      {blog.views} views
                    </span>
                  </div>
                </div>
                {blog.featured_image && (
                  <img
                    src={blog.featured_image}
                    alt={blog.title}
                    className="w-full sm:w-24 h-20 md:h-24 object-cover rounded-2xl md:ml-4 flex-shrink-0 shadow-lg"
                  />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openAnalytics(blog)}
                  className="flex items-center gap-2 text-xs bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-slate-700 dark:to-slate-600 border-blue-200 dark:border-slate-600 hover:from-blue-100 hover:to-cyan-100 dark:hover:from-slate-600 dark:hover:to-slate-500 text-blue-700 dark:text-blue-300 shadow-md"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span className="hidden sm:inline">Analytics</span>
                  <span className="sm:hidden">Stats</span>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEdit(blog)}
                  className="flex items-center gap-2 text-xs bg-gradient-to-r from-violet-50 to-purple-50 dark:from-slate-700 dark:to-slate-600 border-violet-200 dark:border-slate-600 hover:from-violet-100 hover:to-purple-100 dark:hover:from-slate-600 dark:hover:to-slate-500 text-violet-700 dark:text-violet-300 shadow-md"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
                
                {blog.status === 'published' && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="flex items-center gap-2 text-xs bg-gradient-to-r from-emerald-50 to-green-50 dark:from-slate-700 dark:to-slate-600 border-emerald-200 dark:border-slate-600 hover:from-emerald-100 hover:to-green-100 dark:hover:from-slate-600 dark:hover:to-slate-500 text-emerald-700 dark:text-emerald-300 shadow-md"
                  >
                    <a href={`/blog/${blog.slug}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                      <span className="hidden sm:inline">View</span>
                      <span className="sm:hidden">Open</span>
                    </a>
                  </Button>
                )}
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex items-center gap-2 text-xs bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                      disabled={loading === blog.id}
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Delete</span>
                      <span className="sm:hidden">Del</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="max-w-sm mx-4 md:max-w-md bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-0 shadow-2xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-slate-900 dark:text-white">Delete Blog</AlertDialogTitle>
                      <AlertDialogDescription className="text-sm text-slate-600 dark:text-slate-300">
                        Are you sure you want to delete "{blog.title}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                      <AlertDialogCancel className="w-full sm:w-auto bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white">Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(blog.id)}
                        className="w-full sm:w-auto bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg"
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
        <DialogContent className="max-w-[95vw] md:max-w-4xl max-h-[90vh] overflow-y-auto bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-slate-900 dark:text-white">Blog Analytics</DialogTitle>
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
        <DialogContent className="max-w-[95vw] md:max-w-4xl max-h-[90vh] overflow-y-auto bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-slate-900 dark:text-white">Edit Blog</DialogTitle>
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
