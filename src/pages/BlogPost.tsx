import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Share2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TableOfContents, TOCItem } from '@/components/TableOfContents';
import { RecentBlogs } from '@/components/RecentBlogs';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ScrollToTop } from '@/components/ScrollToTop';
import { supabase } from '@/integrations/supabase/client';
import { generateTableOfContentsFromHTML, addIdsToHeadings, applyStylesToHTML } from '@/utils/htmlRenderer';

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
  apply_link?: string;
}

const AdPlaceholder = ({ id, className = "", label }: { id: string; className?: string; label: string }) => (
  <div 
    id={id} 
    className={`bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm font-medium ${className}`}
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
  const [processedContent, setProcessedContent] = useState('');
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    fetchBlog();
  }, [slug]);

  useEffect(() => {
    if (blog?.content) {
      // Generate TOC from HTML content
      const tocItems = generateTableOfContentsFromHTML(blog.content);
      setToc(tocItems);
      
      // Process HTML content: add IDs to headings and apply styles
      const contentWithIds = addIdsToHeadings(blog.content);
      const styledContent = applyStylesToHTML(contentWithIds);
      
      // Add ad banners after each section (after h2 headings)
      const contentWithAds = addAdBannersAfterSections(styledContent);
      setProcessedContent(contentWithAds);
    }
  }, [blog?.content]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setReadingProgress(Math.min(scrollPercent, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const addAdBannersAfterSections = (content: string): string => {
    // Split content by h2 headings and add ad banners after each section
    const h2Regex = /(<h2[^>]*>.*?<\/h2>)/gi;
    const sections = content.split(h2Regex);
    
    let result = '';
    let adCounter = 1;
    
    for (let i = 0; i < sections.length; i++) {
      result += sections[i];
      
      // If this is an h2 heading and not the last section, add content and then an ad
      if (sections[i].match(h2Regex) && i < sections.length - 1) {
        // Add the content after the heading
        if (i + 1 < sections.length) {
          result += sections[i + 1];
          i++; // Skip the next section since we just added it
        }
        
        // Add ad banner after the section content (but not after the last section)
        if (i < sections.length - 1) {
          result += `<div class="my-8"><div class="bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm font-medium h-20 md:h-24"><span class="opacity-50">Ad Space - Section ${adCounter}</span></div></div>`;
          adCounter++;
        }
      }
    }
    
    return result;
  };

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
          status: data.status as 'published' | 'draft',
          apply_link: data.apply_link
        };
        setBlog(blogData);
        
        // Increment view count using the new database function
        try {
          const { error: viewError } = await supabase.rpc('increment_blog_view', {
            blog_uuid: data.id
          });
          if (viewError) {
            console.error('Error incrementing view count:', viewError);
          }
        } catch (viewErr) {
          console.error('Error incrementing view count:', viewErr);
        }
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
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="animate-pulse text-lg text-gray-900 dark:text-gray-100">Loading...</div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Blog Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error || "The blog post you're looking for doesn't exist."}</p>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header - Same as home page but without admin login */}
      <header className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TalentSpur
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                  Home
                </Link>
                <Link to="/about" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                  About
                </Link>
                <Link to="/contact" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                  Contact
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Button variant="outline" onClick={handleShare} className="flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>
        </div>
        
        {/* Reading Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700">
          <Progress 
            value={readingProgress} 
            className="h-1 rounded-none bg-transparent"
          />
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
                className="w-full h-48 md:h-64 lg:h-80 object-cover"
              />
            </div>

            {/* Article Header */}
            <header className="mb-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6 leading-tight">
                {blog.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 md:gap-6 text-gray-600 dark:text-gray-400">
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

            {/* Article Content with HTML and Ad Banners */}
            <div className="prose prose-sm md:prose-lg max-w-none dark:prose-invert">
              {/* In-Content Ad after TOC */}
              <AdPlaceholder 
                id="ads-middle" 
                className="h-20 md:h-24 mb-8" 
                label="In-Content Banner"
              />
              
              <div 
                className="html-content"
                dangerouslySetInnerHTML={{ __html: processedContent }}
              />
            </div>

            {/* Apply Here Button - ENSURE IT RENDERS */}
            {blog.apply_link && blog.apply_link.trim() !== '' && (
              <div className="mt-12 mb-8 text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 p-8 rounded-2xl border border-blue-200 dark:border-blue-800">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Ready to Apply?</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Don't miss this opportunity - apply now!</p>
                <a
                  href={blog.apply_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-12 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-lg"
                >
                  🚀 Apply Here Now
                  <ExternalLink className="w-6 h-6" />
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
            <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-500 dark:text-gray-400">
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

        {/* Recent Blogs Section */}
        <div className="mt-16 pt-12 border-t border-gray-200 dark:border-gray-700">
          <RecentBlogs currentBlogId={blog.id} />
        </div>
      </div>

      {/* Scroll to Top Button */}
      <ScrollToTop />

      {/* Footer - Same as home page */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                TalentSpur
              </h3>
              <p className="text-gray-400">
                Connecting talent with opportunities through AI-powered job matching and career guidance.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">About</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="text-gray-400">
                <p>Email: hello@talentspur.com</p>
                <p>Phone: (555) 123-4567</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TalentSpur. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Enhanced dark mode compatible CSS for HTML content styling */}
      <style>{`
        .html-content {
          line-height: 1.7;
        }
        .dark .html-content h1,
        .dark .html-content h2,
        .dark .html-content h3,
        .dark .html-content h4,
        .dark .html-content p,
        .dark .html-content li,
        .dark .html-content strong {
          color: #f9fafb !important;
        }
        .dark .html-content h2 {
          border-bottom-color: #374151 !important;
        }
        .dark .html-content h3 {
          color: #e5e7eb !important;
        }
        .dark .html-content h4 {
          color: #d1d5db !important;
        }
        .dark .html-content ul, .dark .html-content ol {
          color: #d1d5db !important;
        }
        .dark .html-content a {
          color: #60a5fa !important;
        }
        .dark .html-content a:hover {
          color: #93c5fd !important;
        }
      `}</style>
    </div>
  );
};

export default BlogPost;
