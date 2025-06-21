
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

        setTotalViews(blog.views);
        
        // Generate mock date-wise data (since we don't have daily tracking yet)
        const mockData = generateMockViewData(blog.created_at, blog.views);
        setViewData(mockData);
      } else {
        // Fetch overall analytics
        const { data: blogs, error } = await supabase
          .from('blogs')
          .select('views, created_at')
          .eq('status', 'published');

        if (error) throw error;

        const total = blogs.reduce((sum, blog) => sum + blog.views, 0);
        setTotalViews(total);

        // Generate aggregated mock data
        const aggregatedData = generateAggregatedViewData(blogs);
        setViewData(aggregatedData);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockViewData = (createdAt: string, totalViews: number) => {
    const startDate = new Date(createdAt);
    const today = new Date();
    const data: ViewData[] = [];
    
    const daysDiff = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const viewsPerDay = Math.max(1, Math.floor(totalViews / Math.max(1, daysDiff)));
    
    for (let i = 0; i <= Math.min(daysDiff, 30); i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      const views = i === 0 ? viewsPerDay : 
                   Math.floor(Math.random() * viewsPerDay * 2);
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        views
      });
    }
    
    return data;
  };

  const generateAggregatedViewData = (blogs: any[]) => {
    const data: ViewData[] = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const dayViews = Math.floor(Math.random() * 100) + 20;
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        views: dayViews
      });
    }
    
    return data;
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
              Avg. Daily Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(viewData.reduce((sum, day) => sum + day.views, 0) / Math.max(1, viewData.length))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Peak Day
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.max(...viewData.map(d => d.views))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Controls */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Views Over Time</h3>
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
