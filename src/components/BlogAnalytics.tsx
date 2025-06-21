
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
        // Fetch specific blog analytics
        const { data: blog, error } = await supabase
          .from('blogs')
          .select('views, created_at, title')
          .eq('id', blogId)
          .single();

        if (error) throw error;

        setTotalViews(blog.views || 0);
        
        // Since we don't have daily tracking yet, show simple data
        setViewData([
          { date: 'Total', views: blog.views || 0 }
        ]);
      } else {
        // Fetch overall analytics
        const { data: blogs, error } = await supabase
          .from('blogs')
          .select('views, created_at')
          .eq('status', 'published');

        if (error) throw error;

        const total = blogs.reduce((sum, blog) => sum + (blog.views || 0), 0);
        setTotalViews(total);

        // Simple aggregated data
        setViewData([
          { date: 'All Blogs', views: total }
        ]);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
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
              Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {blogId ? 'Individual' : 'All Blogs'}
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
              Real Data
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Controls */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Views Data</h3>
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
        </CardContent>
      </Card>
    </div>
  );
};
