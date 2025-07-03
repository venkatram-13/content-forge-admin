
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ArrowRight, FileText, Image, Link, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BlogSetupData {
  title: string;
  excerpt: string;
  featuredImage: string;
  applyLink: string;
  content: string;
}

interface BlogSetupPageProps {
  onNext: (data: BlogSetupData) => void;
  initialData?: Partial<BlogSetupData>;
}

export const BlogSetupPage = ({ onNext, initialData }: BlogSetupPageProps) => {
  const [formData, setFormData] = useState<BlogSetupData>({
    title: initialData?.title || '',
    excerpt: initialData?.excerpt || '',
    featuredImage: initialData?.featuredImage || '',
    applyLink: initialData?.applyLink || '',
    content: initialData?.content || '',
  });
  
  const [showPreview, setShowPreview] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [minWordCount, setMinWordCount] = useState(1000);
  const [isRewriting, setIsRewriting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load minimum word count from settings
    const savedMinWordCount = localStorage.getItem('min_word_count');
    if (savedMinWordCount) {
      setMinWordCount(parseInt(savedMinWordCount));
    }
  }, []);

  useEffect(() => {
    // Count words in content
    const text = formData.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const words = text ? text.split(' ').length : 0;
    setWordCount(words);
  }, [formData.content]);

  const handleInputChange = (field: keyof BlogSetupData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const applyStylesToHTML = (html: string): string => {
    return html
      .replace(/<h1([^>]*)>/g, '<h1$1 style="font-size: 2.5rem; font-weight: bold; margin: 2rem 0 1rem 0; color: #1f2937; line-height: 1.2;">')
      .replace(/<h2([^>]*)>/g, '<h2$1 style="font-size: 2rem; font-weight: bold; margin: 1.5rem 0 1rem 0; color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 0.5rem;">')
      .replace(/<h3([^>]*)>/g, '<h3$1 style="font-size: 1.5rem; font-weight: 600; margin: 1.25rem 0 0.75rem 0; color: #4b5563;">')
      .replace(/<h4([^>]*)>/g, '<h4$1 style="font-size: 1.25rem; font-weight: 600; margin: 1rem 0 0.5rem 0; color: #6b7280;">')
      .replace(/<p([^>]*)>/g, '<p$1 style="margin: 1rem 0; line-height: 1.6; color: #374151;">')
      .replace(/<ul([^>]*)>/g, '<ul$1 style="margin: 1rem 0; padding-left: 1.5rem; color: #374151;">')
      .replace(/<ol([^>]*)>/g, '<ol$1 style="margin: 1rem 0; padding-left: 1.5rem; color: #374151;">')
      .replace(/<li([^>]*)>/g, '<li$1 style="margin: 0.25rem 0; line-height: 1.5;">')
      .replace(/<strong([^>]*)>/g, '<strong$1 style="font-weight: 600; color: #1f2937;">')
      .replace(/<em([^>]*)>/g, '<em$1 style="font-style: italic;">')
      .replace(/<blockquote([^>]*)>/g, '<blockquote$1 style="border-left: 4px solid #e5e7eb; padding-left: 1rem; margin: 1.5rem 0; font-style: italic; color: #6b7280;">')
      .replace(/<a([^>]*)>/g, '<a$1 style="color: #2563eb; text-decoration: underline; hover:color: #1d4ed8;">')
      .replace(/<code([^>]*)>/g, '<code$1 style="background-color: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem; font-family: monospace; font-size: 0.875rem;">');
  };

  const rewriteWithAI = async () => {
    const apiKey = localStorage.getItem('gemini_api_key');
    
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please configure your Gemini API key in settings first.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.content.trim()) {
      toast({
        title: "Content Required",
        description: "Please enter some content to rewrite.",
        variant: "destructive",
      });
      return;
    }

    setIsRewriting(true);
    
    try {
      const response = await fetch('/api/gemini-rewrite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: formData.content,
          apiKey: apiKey
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to rewrite content');
      }

      const data = await response.json();
      
      if (data.success) {
        handleInputChange('content', data.rewrittenContent);
        toast({
          title: "Content Rewritten",
          description: "Your content has been enhanced with AI.",
        });
      } else {
        throw new Error(data.error || 'Failed to rewrite content');
      }
    } catch (error) {
      console.error('Error rewriting content:', error);
      toast({
        title: "Rewrite Failed",
        description: "There was an error rewriting your content. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsRewriting(false);
  };

  const handleNext = () => {
    if (!formData.title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a blog title.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.excerpt.trim()) {
      toast({
        title: "Excerpt Required", 
        description: "Please enter a blog excerpt.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.content.trim()) {
      toast({
        title: "Content Required",
        description: "Please enter blog content.",
        variant: "destructive",
      });
      return;
    }

    if (wordCount < minWordCount) {
      toast({
        title: "Word Count Too Low",
        description: `Blog content must be at least ${minWordCount} words. Current count: ${wordCount} words.`,
        variant: "destructive",
      });
      return;
    }

    onNext(formData);
  };

  return (
    <div className="space-y-8">
      <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl md:text-2xl text-slate-900 dark:text-white">
            <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-pink-500 rounded-xl flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            Step 2: Blog Setup & HTML Editor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="title" className="text-slate-700 dark:text-slate-200 font-medium">Blog Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter an engaging blog title..."
                className="bg-white/80 dark:bg-slate-700/80 border-violet-200 dark:border-slate-600 focus:border-violet-400 dark:focus:border-violet-400 rounded-xl shadow-lg backdrop-blur-sm"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="featuredImage" className="text-slate-700 dark:text-slate-200 font-medium flex items-center gap-2">
                <Image className="w-4 h-4" />
                Featured Image URL
              </Label>
              <Input
                id="featuredImage"
                value={formData.featuredImage}
                onChange={(e) => handleInputChange('featuredImage', e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="bg-white/80 dark:bg-slate-700/80 border-violet-200 dark:border-slate-600 focus:border-violet-400 dark:focus:border-violet-400 rounded-xl shadow-lg backdrop-blur-sm"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="excerpt" className="text-slate-700 dark:text-slate-200 font-medium">Blog Excerpt *</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => handleInputChange('excerpt', e.target.value)}
              placeholder="Write a compelling excerpt that summarizes your blog..."
              className="bg-white/80 dark:bg-slate-700/80 border-violet-200 dark:border-slate-600 focus:border-violet-400 dark:focus:border-violet-400 rounded-xl shadow-lg backdrop-blur-sm min-h-[100px]"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="applyLink" className="text-slate-700 dark:text-slate-200 font-medium flex items-center gap-2">
              <Link className="w-4 h-4" />
              Apply Link (Optional)
            </Label>
            <Input
              id="applyLink"
              value={formData.applyLink}
              onChange={(e) => handleInputChange('applyLink', e.target.value)}
              placeholder="https://company.com/apply"
              className="bg-white/80 dark:bg-slate-700/80 border-violet-200 dark:border-slate-600 focus:border-violet-400 dark:focus:border-violet-400 rounded-xl shadow-lg backdrop-blur-sm"
            />
            <p className="text-sm text-slate-600 dark:text-slate-300">
              If provided, a prominent "Apply Here" button will be displayed in the blog post.
            </p>
          </div>

          {/* Featured Image Preview */}
          {formData.featuredImage && (
            <div className="space-y-3">
              <Label className="text-slate-700 dark:text-slate-200 font-medium">Image Preview</Label>
              <div className="w-full h-48 md:h-64 rounded-xl overflow-hidden shadow-lg">
                <img
                  src={formData.featuredImage}
                  alt="Featured"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop";
                  }}
                />
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="content" className="text-slate-700 dark:text-slate-200 font-medium">
                Blog Content * 
                <span className={`ml-2 text-sm ${wordCount < minWordCount ? 'text-red-500' : 'text-green-500'}`}>
                  ({wordCount}/{minWordCount} words minimum)
                </span>
              </Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={rewriteWithAI}
                  disabled={isRewriting || !formData.content.trim()}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-sm px-3 py-1.5 h-auto"
                >
                  {isRewriting ? (
                    <>
                      <Sparkles className="w-3 h-3 animate-spin" />
                      Rewriting...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3 h-3" />
                      AI Rewrite
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  variant="outline"
                  className="flex items-center gap-2 text-sm px-3 py-1.5 h-auto"
                >
                  {showPreview ? (
                    <>
                      <EyeOff className="w-3 h-3" />
                      Hide Preview
                    </>
                  ) : (
                    <>
                      <Eye className="w-3 h-3" />
                      Show Preview
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  placeholder="Write your blog content using HTML tags for formatting:

<h2>Main Section</h2>
<p>Your paragraph text here.</p>

<h3>Subsection</h3>
<ul>
  <li>Bullet point 1</li>
  <li>Bullet point 2</li>
</ul>

<p><strong>Bold text</strong> and <em>italic text</em></p>

<button style='background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 24px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.2); transition: all 0.3s ease; font-size: 16px;' onmouseover='this.style.transform=\"translateY(-2px)\"; this.style.boxShadow=\"0 6px 20px rgba(0,0,0,0.3)\";' onmouseout='this.style.transform=\"translateY(0)\"; this.style.boxShadow=\"0 4px 15px rgba(0,0,0,0.2)\";'>Call to Action Button</button>"
                  className="bg-white/80 dark:bg-slate-700/80 border-violet-200 dark:border-slate-600 focus:border-violet-400 dark:focus:border-violet-400 rounded-xl shadow-lg backdrop-blur-sm min-h-[400px] font-mono text-sm"
                />
              </div>

              {showPreview && (
                <div className="space-y-2">
                  <Label className="text-slate-700 dark:text-slate-200 font-medium">Preview</Label>
                  <div className="bg-white/80 dark:bg-slate-700/80 border border-violet-200 dark:border-slate-600 rounded-xl shadow-lg backdrop-blur-sm p-6 min-h-[400px] overflow-auto prose prose-sm md:prose-lg max-w-none dark:prose-invert">
                    <div 
                      className="html-content"
                      dangerouslySetInnerHTML={{ __html: applyStylesToHTML(formData.content) }}
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-violet-50/50 dark:bg-slate-700/30 p-4 rounded-xl">
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                <strong>HTML Formatting Tips:</strong>
              </p>
              <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                <li>• Use &lt;h2&gt;, &lt;h3&gt;, &lt;h4&gt; for headings</li>
                <li>• Use &lt;p&gt; for paragraphs</li>
                <li>• Use &lt;ul&gt;&lt;li&gt; for bullet points, &lt;ol&gt;&lt;li&gt; for numbered lists</li>
                <li>• Use &lt;strong&gt; for bold, &lt;em&gt; for italic</li>
                <li>• Use &lt;a href="url"&gt; for links</li>
                <li>• Copy the CTA button code above and customize the text as needed</li>
              </ul>
            </div>
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={handleNext}
              disabled={!formData.title.trim() || !formData.excerpt.trim() || !formData.content.trim() || wordCount < minWordCount}
              className="flex items-center gap-2 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 hover:from-violet-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 px-8 py-3 text-lg font-semibold"
            >
              Continue to Review
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

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
