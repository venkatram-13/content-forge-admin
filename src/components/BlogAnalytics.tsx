
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Calendar, TrendingUp, Eye, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface BlogAnalyticsProps {
  blogId?: string;
  blogTitle?: string;
  onClose?: () => void;
}

interface ViewData {
  date: string;
  views: number;
}

export const BlogAnalytics = ({ blogId, blogTitle, onClose }: BlogAnalyticsProps) => {
  const [viewData, setViewData] = useState<ViewData[]>([]);
  const [totalViews, setTotalViews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');

  useEffect(() => {
    fetchAnalytics();
  }, [blogId]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      if (blogId) {
        // Fetch specific blog analytics with date-wise breakdown
        const { data: analyticsData, error: analyticsError } = await supabase
          .from('blog_view_analytics')
          .select('view_date, daily_views')
          .eq('blog_id', blogId)
          .order('view_date', { ascending: true });

        if (analyticsError) throw analyticsError;

        // Get total views from blogs table
        const { data: blog, error: blogError } = await supabase
          .from('blogs')
          .select('views, title')
          .eq('id', blogId)
          .single();

        if (blogError) throw blogError;

        setTotalViews(blog.views || 0);
        
        // Format data for charts
        const formattedData = (analyticsData || []).map(item => ({
          date: new Date(item.view_date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          }),
          views: item.daily_views
        }));

        setViewData(formattedData);
      } else {
        // Fetch overall analytics - aggregate all blogs by date
        const { data: analyticsData, error: analyticsError } = await supabase
          .from('blog_view_analytics')
          .select('view_date, daily_views')
          .order('view_date', { ascending: true });

        if (analyticsError) throw analyticsError;

        // Get total views from all blogs
        const { data: blogs, error: blogsError } = await supabase
          .from('blogs')
          .select('views')
          .eq('status', 'published');

        if (blogsError) throw blogsError;

        const total = blogs.reduce((sum, blog) => sum + (blog.views || 0), 0);
        setTotalViews(total);

        // Aggregate data by date
        const dateAggregation: { [key: string]: number } = {};
        (analyticsData || []).forEach(item => {
          const dateKey = item.view_date;
          dateAggregation[dateKey] = (dateAggregation[dateKey] || 0) + item.daily_views;
        });

        // Format data for charts
        const formattedData = Object.entries(dateAggregation).map(([date, views]) => ({
          date: new Date(date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          }),
          views
        }));

        setViewData(formattedData);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Fallback to simple data if analytics table is empty
      setViewData([]);
    } finally {
      setLoading(false);
    }
  };

  const chartConfig = {
    views: {
      label: "Views",
      color: "hsl(var(--primary))",
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {onClose && (
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {blogTitle ? `Analytics - ${blogTitle}` : 'Website Analytics'}
          </h2>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Total Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Tracking Days
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {viewData.length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {blogId ? 'Individual' : 'All Blogs'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Controls */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Daily Views</h3>
        <div className="flex gap-2">
          <Button
            variant={chartType === 'line' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartType('line')}
          >
            Line Chart
          </Button>
          <Button
            variant={chartType === 'bar' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartType('bar')}
          >
            Bar Chart
          </Button>
        </div>
      </div>

      {/* Analytics Chart */}
      <Card>
        <CardContent className="p-6">
          {viewData.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'line' ? (
                  <LineChart data={viewData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="views" 
                      stroke="var(--color-views)" 
                      strokeWidth={2}
                      dot={{ fill: "var(--color-views)" }}
                    />
                  </LineChart>
                ) : (
                  <BarChart data={viewData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar 
                      dataKey="views" 
                      fill="var(--color-views)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="flex items-center justify-center h-80 text-gray-500 dark:text-gray-400">
              No view data available yet. Views will appear as users interact with blogs.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
