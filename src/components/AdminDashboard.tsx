
import { useState, useEffect } from 'react';
import { Plus, Settings, LogOut, Edit, FileText, BarChart3, Users, Globe, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateBlog } from './CreateBlog';
import { AdminSettings } from './AdminSettings';
import { BlogManager } from './BlogManager';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { supabase } from '@/integrations/supabase/client';

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

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'create' | 'manage' | 'settings'>('overview');
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { logout, user } = useAdminAuth();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('blog-operations', {
        body: { action: 'list' }
      });

      if (error) throw error;
      if (data.success) {
        setBlogs(data.blogs || []);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlogCreated = (newBlog: Blog) => {
    setBlogs(prev => [newBlog, ...prev]);
    setActiveTab('manage');
  };

  const handleBlogUpdated = (updatedBlogs: Blog[]) => {
    setBlogs(updatedBlogs);
  };

  const publishedCount = blogs.filter(blog => blog.status === 'published').length;
  const draftCount = blogs.filter(blog => blog.status === 'draft').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI Blog Admin
                </h1>
                <p className="text-gray-600">Welcome back, {user?.email}</p>
              </div>
            </div>
            <Button onClick={logout} variant="outline" className="flex items-center gap-2 hover:bg-red-50 hover:border-red-200">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 bg-white/80 backdrop-blur-sm p-2 rounded-2xl shadow-lg border border-white/20">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 font-medium ${
              activeTab === 'overview' 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`px-6 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 font-medium ${
              activeTab === 'create' 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
            }`}
          >
            <Plus className="w-5 h-5" />
            Create Blog
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`px-6 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 font-medium ${
              activeTab === 'manage' 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
            }`}
          >
            <Edit className="w-5 h-5" />
            Manage Blogs
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 font-medium ${
              activeTab === 'settings' 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
            }`}
          >
            <Settings className="w-5 h-5" />
            Settings
          </button>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="gri d grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white/90 text-sm font-medium flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Total Blogs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{blogs.length}</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white/90 text-sm font-medium flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Published
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{publishedCount}</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white/90 text-sm font-medium flex items-center gap-2">
                    <Edit className="w-4 h-4" />
                    Drafts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{draftCount}</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white/90 text-sm font-medium flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    AI Powered
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">✨</div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    onClick={() => setActiveTab('create')} 
                    className="h-16 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 flex items-center gap-3 text-lg"
                  >
                    <Plus className="w-5 h-5" />
                    Create New Blog
                  </Button>
                  <Button 
                    onClick={() => setActiveTab('manage')} 
                    variant="outline" 
                    className="h-16 flex items-center gap-3 text-lg border-2 hover:bg-blue-50"
                  >
                    <Edit className="w-5 h-5" />
                    Manage Blogs
                  </Button>
                  <Button 
                    onClick={() => setActiveTab('settings')} 
                    variant="outline" 
                    className="h-16 flex items-center gap-3 text-lg border-2 hover:bg-purple-50"
                  >
                    <Settings className="w-5 h-5" />
                    Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'create' && (
          <CreateBlog onBlogCreated={handleBlogCreated} />
        )}

        {activeTab === 'manage' && (
          <BlogManager blogs={blogs} onBlogsUpdated={handleBlogUpdated} />
        )}

        {activeTab === 'settings' && (
          <AdminSettings />
        )}
      </div>
    </div>
  );
};
