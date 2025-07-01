
import { useState, useEffect } from 'react';
import { Plus, Settings, LogOut, Edit, FileText, BarChart3, Users, Globe, Sparkles, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TwoPageBlogCreation } from './TwoPageBlogCreation';
import { AdminSettings } from './AdminSettings';
import { BlogManager } from './BlogManager';
import { BlogAnalytics } from './BlogAnalytics';
import { ThemeToggle } from './ThemeToggle';
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
  views: number;
}

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'create' | 'manage' | 'settings'>('overview');
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalViews, setTotalViews] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
        const blogsData = data.blogs || [];
        setBlogs(blogsData);
        
        // Calculate total views
        const total = blogsData.reduce((sum: number, blog: Blog) => sum + (blog.views || 0), 0);
        setTotalViews(total);
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
    setMobileMenuOpen(false);
  };

  const handleBlogUpdated = (updatedBlogs: Blog[]) => {
    setBlogs(updatedBlogs);
    // Recalculate total views
    const total = updatedBlogs.reduce((sum, blog) => sum + (blog.views || 0), 0);
    setTotalViews(total);
  };

  const publishedCount = blogs.filter(blog => blog.status === 'published').length;
  const draftCount = blogs.filter(blog => blog.status === 'draft').length;

  const NavButton = ({ tab, icon: Icon, label, onClick }: { 
    tab: string; 
    icon: any; 
    label: string; 
    onClick?: () => void; 
  }) => (
    <button
      onClick={() => {
        if (onClick) onClick();
        setActiveTab(tab as any);
        setMobileMenuOpen(false);
      }}
      className={`w-full px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 font-medium text-left ${
        activeTab === tab
          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
          : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/60'
      }`}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm shadow-lg border-b border-white/20 dark:border-slate-700/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI Blog Admin
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">Welcome back, {user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <ThemeToggle />
              <Button 
                variant="ghost" 
                size="sm"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
              <Button onClick={logout} variant="outline" size="sm" className="hidden md:flex items-center gap-2 hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-900/20 dark:hover:border-red-700">
                <LogOut className="w-4 h-4" />
                <span className="hidden lg:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-slate-800 shadow-xl p-4 pt-20 overflow-y-auto">
            <div className="space-y-2">
              <NavButton tab="overview" icon={BarChart3} label="Overview" />
              <NavButton tab="create" icon={Plus} label="Create Blog" />
              <NavButton tab="manage" icon={Edit} label="Manage Blogs" />
              <NavButton tab="settings" icon={Settings} label="Settings" />
              <Button onClick={logout} variant="outline" className="w-full flex items-center gap-2 mt-6 hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-900/20 dark:hover:border-red-700">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
        {/* Desktop Navigation Tabs */}
        <div className="hidden md:flex gap-2 mb-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-2 rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/20">
          <NavButton tab="overview" icon={BarChart3} label="Overview" />
          <NavButton tab="create" icon={Plus} label="Create Blog" />
          <NavButton tab="manage" icon={Edit} label="Manage Blogs" />
          <NavButton tab="settings" icon={Settings} label="Settings" />
        </div>

        {/* Mobile Tab Indicator */}
        <div className="md:hidden mb-6">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/20">
            <div className="flex items-center gap-3">
              {activeTab === 'overview' && <><BarChart3 className="w-5 h-5 text-blue-600" /><span className="font-medium text-gray-900 dark:text-white">Overview</span></>}
              {activeTab === 'create' && <><Plus className="w-5 h-5 text-blue-600" /><span className="font-medium text-gray-900 dark:text-white">Create Blog</span></>}
              {activeTab === 'manage' && <><Edit className="w-5 h-5 text-blue-600" /><span className="font-medium text-gray-900 dark:text-white">Manage Blogs</span></>}
              {activeTab === 'settings' && <><Settings className="w-5 h-5 text-blue-600" /><span className="font-medium text-gray-900 dark:text-white">Settings</span></>}
            </div>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6 md:space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl">
                <CardHeader className="pb-2 md:pb-3">
                  <CardTitle className="text-white/90 text-xs md:text-sm font-medium flex items-center gap-2">
                    <FileText className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="hidden sm:inline">Total Blogs</span>
                    <span className="sm:hidden">Blogs</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-2xl md:text-3xl font-bold">{blogs.length}</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-xl">
                <CardHeader className="pb-2 md:pb-3">
                  <CardTitle className="text-white/90 text-xs md:text-sm font-medium flex items-center gap-2">
                    <Globe className="w-3 h-3 md:w-4 md:h-4" />
                    <span>Published</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-2xl md:text-3xl font-bold">{publishedCount}</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-xl">
                <CardHeader className="pb-2 md:pb-3">
                  <CardTitle className="text-white/90 text-xs md:text-sm font-medium flex items-center gap-2">
                    <Edit className="w-3 h-3 md:w-4 md:h-4" />
                    <span>Drafts</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-2xl md:text-3xl font-bold">{draftCount}</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl">
                <CardHeader className="pb-2 md:pb-3">
                  <CardTitle className="text-white/90 text-xs md:text-sm font-medium flex items-center gap-2">
                    <BarChart3 className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="hidden sm:inline">Total Views</span>
                    <span className="sm:hidden">Views</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-xl md:text-3xl font-bold">{totalViews.toLocaleString()}</div>
                </CardContent>
              </Card>
            </div>

            {/* Analytics Section */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl text-gray-900 dark:text-white">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                  Website Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BlogAnalytics />
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl text-gray-900 dark:text-white">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    onClick={() => setActiveTab('create')} 
                    className="h-12 md:h-16 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 flex items-center gap-3 text-base md:text-lg"
                  >
                    <Plus className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="hidden sm:inline">Create New Blog</span>
                    <span className="sm:hidden">Create Blog</span>
                  </Button>
                  <Button 
                    onClick={() => setActiveTab('manage')} 
                    variant="outline" 
                    className="h-12 md:h-16 flex items-center gap-3 text-base md:text-lg border-2 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                  >
                    <Edit className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="hidden sm:inline">Manage Blogs</span>
                    <span className="sm:hidden">Manage</span>
                  </Button>
                  <Button 
                    onClick={() => setActiveTab('settings')} 
                    variant="outline" 
                    className="h-12 md:h-16 flex items-center gap-3 text-base md:text-lg border-2 hover:bg-purple-50 dark:hover:bg-purple-950/20"
                  >
                    <Settings className="w-4 h-4 md:w-5 md:h-5" />
                    <span>Settings</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'create' && (
          <TwoPageBlogCreation onBlogCreated={handleBlogCreated} />
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
