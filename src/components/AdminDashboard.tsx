
import { useState, useEffect } from 'react';
import { Plus, Settings, LogOut, Edit, Trash2, Eye, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateBlog } from './CreateBlog';
import { AdminSettings } from './AdminSettings';
import { BlogManager } from './BlogManager';

interface AdminDashboardProps {
  onLogout: () => void;
}

interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  publishedAt: string;
  author: string;
  slug: string;
  status: 'published' | 'draft';
}

export const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'create' | 'manage' | 'settings'>('overview');
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const savedBlogs = localStorage.getItem('blogs');
    if (savedBlogs) {
      setBlogs(JSON.parse(savedBlogs));
    }
  }, []);

  const handleBlogCreated = (newBlog: Blog) => {
    const updatedBlogs = [...blogs, newBlog];
    setBlogs(updatedBlogs);
    localStorage.setItem('blogs', JSON.stringify(updatedBlogs));
    setActiveTab('manage');
  };

  const handleBlogUpdated = (updatedBlogs: Blog[]) => {
    setBlogs(updatedBlogs);
    localStorage.setItem('blogs', JSON.stringify(updatedBlogs));
  };

  const publishedCount = blogs.filter(blog => blog.status === 'published').length;
  const draftCount = blogs.filter(blog => blog.status === 'draft').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your AI-powered blog</p>
            </div>
            <Button onClick={onLogout} variant="outline" className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 bg-white p-1 rounded-lg shadow-sm">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${
              activeTab === 'overview' 
                ? 'bg-blue-100 text-blue-700 font-medium' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${
              activeTab === 'create' 
                ? 'bg-blue-100 text-blue-700 font-medium' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Plus className="w-4 h-4" />
            Create Blog
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${
              activeTab === 'manage' 
                ? 'bg-blue-100 text-blue-700 font-medium' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Edit className="w-4 h-4" />
            Manage Blogs
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${
              activeTab === 'settings' 
                ? 'bg-blue-100 text-blue-700 font-medium' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Total Blogs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{blogs.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Published</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{publishedCount}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Drafts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">{draftCount}</div>
              </CardContent>
            </Card>

            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Button onClick={() => setActiveTab('create')} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Create New Blog
                  </Button>
                  <Button onClick={() => setActiveTab('manage')} variant="outline" className="flex items-center gap-2">
                    <Edit className="w-4 h-4" />
                    Manage Blogs
                  </Button>
                  <Button onClick={() => setActiveTab('settings')} variant="outline" className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
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
