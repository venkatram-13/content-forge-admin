import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Share2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TableOfContents, TOCItem } from '@/components/TableOfContents';
import { RecentBlogs } from '@/components/RecentBlogs';
import { supabase } from '@/integrations/supabase/client';
import { generateTableOfContents, renderMarkdownWithTOC } from '@/utils/markdownRenderer';

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
  application_link?: string;
}

const AdPlaceholder = ({ id, className = "", label }: { id: string; className?: string; label: string }) => (
  <div 
    id={id} 
    className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500 text-sm font-medium ${className}`}
  >
    {/* AdSense Placeholder - {label} */}
    <span className="opacity-50">Ad Space - {label}</span>
  </div>
);

const BlogPost = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toc, setToc] = useState<TOCItem[]>([]);
  const [renderedContent, setRenderedContent] = useState('');

  useEffect(() => {
    fetchBlog();
  }, [slug]);

  useEffect(() => {
    if (blog?.content) {
      const tocItems = generateTableOfContents(blog.content);
      setToc(tocItems);
      
      // Handle async markdown rendering
      renderMarkdownWithTOC(blog.content).then(htmlContent => {
        setRenderedContent(htmlContent);
      });
    }
  }, [blog?.content]);

  const fetchBlog = async () => {
    if (!slug) {
      setError('Blog slug not found');
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching blog with slug:', slug);
      
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) {
        console.error('Error fetching blog:', error);
        setError('Blog not found');
      } else {
        console.log('Blog fetched successfully:', data);
        const blogData: Blog = {
          ...data,
          status: data.status as 'published' | 'draft'
        };
        setBlog(blogData);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('Failed to load blog');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog?.title,
        text: blog?.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Blog Not Found</h2>
            <p className="text-gray-600 mb-6">{error || "The blog post you're looking for doesn't exist."}</p>
            <Link to="/">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to TalentSpur
            </Link>
            <Button variant="outline" onClick={handleShare} className="flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Article Column */}
          <article className="lg:col-span-8">
            {/* Top Ad Placeholder - Desktop & Mobile */}
            <AdPlaceholder 
              id="ads-top" 
              className="h-24 mb-8" 
              label="Top Banner"
            />

            {/* Featured Image */}
            <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
              <img
                src={blog.featured_image || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop"}
                alt={blog.title}
                className="w-full h-64 md:h-96 object-cover"
              />
            </div>

            {/* Article Header */}
            <header className="mb-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {blog.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 md:gap-6 text-gray-600">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="font-medium text-sm md:text-base">{blog.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="text-sm md:text-base">{formatDate(blog.created_at)}</span>
                </div>
              </div>
            </header>

            {/* Table of Contents */}
            <TableOfContents items={toc} />

            {/* Article Content with Rendered Markdown */}
            <div className="prose prose-sm md:prose-lg max-w-none">
              {/* In-Content Ad after TOC */}
              <AdPlaceholder 
                id="ads-middle" 
                className="h-20 md:h-24 mb-8" 
                label="In-Content Banner"
              />
              
              <div 
                className="markdown-content"
                dangerouslySetInnerHTML={{ __html: renderedContent }}
              />
            </div>

            {/* NEW: Apply Here Button */}
            {blog.application_link && (
              <div className="mt-12 mb-8 text-center">
                <a
                  href={blog.application_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  Apply Here
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
            )}

            {/* Bottom Ad Placeholder */}
            <AdPlaceholder 
              id="ads-bottom" 
              className="h-24 mt-8 mb-8" 
              label="Bottom Banner"
            />

            {/* Article Footer */}
            <footer className="mt-12 pt-8 border-t">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-500">
                  Published on {formatDate(blog.created_at)}
                </div>
                <Button variant="outline" onClick={handleShare} className="flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Share Article
                </Button>
              </div>
            </footer>
          </article>

          {/* Sidebar - Desktop Only */}
          <aside className="hidden lg:block lg:col-span-4">
            <div className="sticky top-8 space-y-6">
              {/* Sidebar Ad Placeholders */}
              <AdPlaceholder 
                id="ads-sidebar-top" 
                className="h-64" 
                label="Sidebar Rectangle"
              />
              
              <AdPlaceholder 
                id="ads-sidebar-middle" 
                className="h-48" 
                label="Sidebar Square"
              />
              
              <AdPlaceholder 
                id="ads-sidebar-bottom" 
                className="h-96" 
                label="Sidebar Skyscraper"
              />
            </div>
          </aside>
        </div>

        {/* NEW: Recent Blogs Section */}
        <div className="mt-16 pt-12 border-t border-gray-200">
          <RecentBlogs currentBlogId={blog.id} />
        </div>
      </div>

      {/* CSS for markdown content */}
      <style>{`
        .markdown-content h2 {
          font-size: 1.875rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: #1f2937;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 0.5rem;
        }
        .markdown-content h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          color: #374151;
        }
        .markdown-content h4 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
          color: #4b5563;
        }
        .markdown-content ul, .markdown-content ol {
          margin: 1rem 0;
          padding-left: 1.5rem;
        }
        .markdown-content li {
          margin: 0.5rem 0;
        }
        .markdown-content p {
          margin: 1rem 0;
          line-height: 1.7;
        }
        .markdown-content a {
          color: #2563eb;
          text-decoration: underline;
        }
        .markdown-content a:hover {
          color: #1d4ed8;
        }
        .markdown-content strong {
          font-weight: 700;
        }
        .markdown-content em {
          font-style: italic;
        }
        .markdown-content code {
          background-color: #f3f4f6;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          font-family: ui-monospace, monospace;
        }
        .markdown-content pre {
          background-color: #f3f4f6;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1rem 0;
        }
        .markdown-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1rem 0;
        }
      `}</style>
    </div>
  );
};

export default BlogPost;
