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
      className={`group relative w-full px-4 py-3 rounded-2xl transition-all duration-300 flex items-center gap-3 font-medium text-left overflow-hidden ${
        activeTab === tab
          ? 'bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 text-white shadow-2xl transform scale-105' 
          : 'text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-gradient-to-r hover:from-violet-50 hover:to-pink-50 dark:hover:from-slate-700 dark:hover:to-slate-600 hover:shadow-xl hover:scale-102'
      }`}
    >
      <div className="relative z-10 flex items-center gap-3">
        <Icon className="w-5 h-5 flex-shrink-0" />
        <span>{label}</span>
      </div>
      {activeTab === tab && (
        <div className="absolute inset-0 bg-gradient-to-r from-violet-400/20 via-purple-400/20 to-pink-400/20 animate-pulse" />
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-pink-50/30 dark:from-slate-900 dark:via-violet-900/10 dark:to-pink-900/10">
      {/* Header */}
      <header className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-2xl border-b border-violet-100 dark:border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <Sparkles className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  AI Blog Studio
                </h1>
                <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base font-medium">Welcome back, {user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Button 
                variant="ghost" 
                size="sm"
                className="md:hidden bg-gradient-to-r from-violet-100 to-pink-100 dark:from-slate-700 dark:to-slate-600 hover:from-violet-200 hover:to-pink-200 dark:hover:from-slate-600 dark:hover:to-slate-500"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
              <Button 
                onClick={logout} 
                className="hidden md:flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                size="sm"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden lg:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div className="fixed right-0 top-0 h-full w-80 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl shadow-2xl p-6 pt-24 overflow-y-auto">
            <div className="space-y-3">
              <NavButton tab="overview" icon={BarChart3} label="Overview" />
              <NavButton tab="create" icon={Plus} label="Create Blog" />
              <NavButton tab="manage" icon={Edit} label="Manage Blogs" />
              <NavButton tab="settings" icon={Settings} label="Settings" />
              <Button 
                onClick={logout} 
                className="w-full flex items-center gap-2 mt-8 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Desktop Navigation Tabs */}
        <div className="hidden md:flex gap-3 mb-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-3 rounded-3xl shadow-2xl border border-violet-100 dark:border-slate-700/50">
          <NavButton tab="overview" icon={BarChart3} label="Overview" />
          <NavButton tab="create" icon={Plus} label="Create Blog" />
          <NavButton tab="manage" icon={Edit} label="Manage Blogs" />
          <NavButton tab="settings" icon={Settings} label="Settings" />
        </div>

        {/* Mobile Tab Indicator */}
        <div className="md:hidden mb-6">
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl p-4 rounded-3xl shadow-2xl border border-violet-100 dark:border-slate-700/50">
            <div className="flex items-center gap-3">
              {activeTab === 'overview' && <><BarChart3 className="w-5 h-5 text-violet-600" /><span className="font-semibold text-slate-900 dark:text-white">Overview</span></>}
              {activeTab === 'create' && <><Plus className="w-5 h-5 text-violet-600" /><span className="font-semibold text-slate-900 dark:text-white">Create Blog</span></>}
              {activeTab === 'manage' && <><Edit className="w-5 h-5 text-violet-600" /><span className="font-semibold text-slate-900 dark:text-white">Manage Blogs</span></>}
              {activeTab === 'settings' && <><Settings className="w-5 h-5 text-violet-600" /><span className="font-semibold text-slate-900 dark:text-white">Settings</span></>}
            </div>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <Card className="bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-600 text-white border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
                <CardHeader className="pb-2 md:pb-3">
                  <CardTitle className="text-white/90 text-xs md:text-sm font-medium flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span className="hidden sm:inline">Total Blogs</span>
                    <span className="sm:hidden">Blogs</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-3xl md:text-4xl font-bold">{blogs.length}</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-emerald-500 via-green-600 to-teal-600 text-white border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
                <CardHeader className="pb-2 md:pb-3">
                  <CardTitle className="text-white/90 text-xs md:text-sm font-medium flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <span>Published</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-3xl md:text-4xl font-bold">{publishedCount}</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 text-white border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
                <CardHeader className="pb-2 md:pb-3">
                  <CardTitle className="text-white/90 text-xs md:text-sm font-medium flex items-center gap-2">
                    <Edit className="w-4 h-4" />
                    <span>Drafts</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-3xl md:text-4xl font-bold">{draftCount}</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 text-white border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
                <CardHeader className="pb-2 md:pb-3">
                  <CardTitle className="text-white/90 text-xs md:text-sm font-medium flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    <span className="hidden sm:inline">Total Views</span>
                    <span className="sm:hidden">Views</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-2xl md:text-4xl font-bold">{totalViews.toLocaleString()}</div>
                </CardContent>
              </Card>
            </div>

            {/* Analytics Section */}
            <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl md:text-2xl text-slate-900 dark:text-white">
                  <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-white" />
                  </div>
                  Website Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BlogAnalytics />
              </CardContent>
            </Card>

            <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl md:text-2xl text-slate-900 dark:text-white">
                  <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    onClick={() => setActiveTab('create')} 
                    className="h-14 md:h-16 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 hover:from-violet-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 flex items-center gap-3 text-base md:text-lg font-semibold"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="hidden sm:inline">Create New Blog</span>
                    <span className="sm:hidden">Create Blog</span>
                  </Button>
                  <Button 
                    onClick={() => setActiveTab('manage')} 
                    className="h-14 md:h-16 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 flex items-center gap-3 text-base md:text-lg font-semibold"
                  >
                    <Edit className="w-5 h-5" />
                    <span className="hidden sm:inline">Manage Blogs</span>
                    <span className="sm:hidden">Manage</span>
                  </Button>
                  <Button 
                    onClick={() => setActiveTab('settings')} 
                    className="h-14 md:h-16 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 flex items-center gap-3 text-base md:text-lg font-semibold"
                  >
                    <Settings className="w-5 h-5" />
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
