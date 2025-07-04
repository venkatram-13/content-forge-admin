import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ArrowRight, FileText, Image, Link, Eye, EyeOff, Sparkles, Bold, Italic, List, ListOrdered, Type, Plus, Upload, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
  const [isPublishing, setIsPublishing] = useState(false);
  const { toast } = useToast();

  // Move the placeholder content to a template literal to avoid JSX parsing issues
  const blogPlaceholder = `Write your blog content using HTML tags for formatting:

<h2>Main Section</h2>
<p>Your paragraph text here.</p>

<h3>Subsection</h3>
<ul>
  <li>Bullet point 1</li>
  <li>Bullet point 2</li>
</ul>

<p><strong>Bold text</strong> and <em>italic text</em></p>

<button style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 24px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.2); transition: all 0.3s ease; font-size: 16px;">Call to Action Button</button>`;

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

  const insertHtmlTag = (tag: string, closingTag?: string, placeholder?: string) => {
    const textarea = document.getElementById('content') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.content.substring(start, end);
    
    let newText;
    if (selectedText) {
      // If text is selected, wrap it with the tag
      newText = formData.content.substring(0, start) + 
                `<${tag}>${selectedText}</${closingTag || tag}>` + 
                formData.content.substring(end);
    } else {
      // If no text is selected, insert the tag with placeholder
      const content = placeholder || 'Your text here';
      newText = formData.content.substring(0, start) + 
                `<${tag}>${content}</${closingTag || tag}>` + 
                formData.content.substring(end);
    }
    
    handleInputChange('content', newText);
    
    // Focus back to textarea and set cursor position
    setTimeout(() => {
      textarea.focus();
      const newPosition = selectedText ? 
        start + `<${tag}>`.length + selectedText.length + `</${closingTag || tag}>`.length :
        start + `<${tag}>`.length + (placeholder || 'Your text here').length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const insertListItem = (listType: 'ul' | 'ol') => {
    const textarea = document.getElementById('content') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const listHtml = listType === 'ul' ? 
      '<ul>\n  <li>First item</li>\n  <li>Second item</li>\n  <li>Third item</li>\n</ul>' :
      '<ol>\n  <li>First item</li>\n  <li>Second item</li>\n  <li>Third item</li>\n</ol>';
    
    const newText = formData.content.substring(0, start) + listHtml + formData.content.substring(start);
    handleInputChange('content', newText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + listHtml.length, start + listHtml.length);
    }, 0);
  };

  const insertLink = () => {
    const textarea = document.getElementById('content') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.content.substring(start, end);
    
    const linkText = selectedText || 'Link text';
    const linkHtml = `<a href="https://example.com">${linkText}</a>`;
    
    const newText = formData.content.substring(0, start) + linkHtml + formData.content.substring(end);
    handleInputChange('content', newText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + linkHtml.length, start + linkHtml.length);
    }, 0);
  };

  const insertButton = () => {
    const textarea = document.getElementById('content') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const buttonHtml = '<button style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 24px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.2); transition: all 0.3s ease; font-size: 16px;">Call to Action</button>';
    
    const newText = formData.content.substring(0, start) + buttonHtml + formData.content.substring(start);
    handleInputChange('content', newText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + buttonHtml.length, start + buttonHtml.length);
    }, 0);
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
      .replace(/<a([^>]*)>/g, '<a$1 style="color: #2563eb; text-decoration: underline;">')
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

  const publishBlog = async (status: 'published' | 'draft') => {
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

    setIsPublishing(true);
    
    try {
      console.log('Publishing blog with status:', status);

      const { data, error } = await supabase.functions.invoke('blog-operations', {
        body: {
          action: 'create',
          title: formData.title.trim(),
          content: formData.content.trim(),
          excerpt: formData.excerpt.trim(),
          featuredImage: formData.featuredImage || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&h=300&fit=crop",
          author: 'Admin',
          applicationLink: formData.applyLink.trim() || undefined,
          category: undefined,
          status
        }
      });

      console.log('Blog operation response:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(`API Error: ${error.message}`);
      }
      
      if (data?.error) {
        console.error('Blog operations error:', data.error);
        throw new Error(data.error);
      }

      if (!data?.success || !data?.blog) {
        console.error('Invalid response from blog operations:', data);
        throw new Error('Invalid response from blog service');
      }

      // Call onNext with the created blog data
      onNext(data.blog);
      
      toast({
        title: status === 'published' ? "Blog Published! 🎉" : "Draft Saved! 📝",
        description: `Your blog has been ${status === 'published' ? 'published successfully' : 'saved as a draft'}.`,
      });
    } catch (error) {
      console.error('Blog publish error:', error);
      toast({
        title: "Operation Failed",
        description: error instanceof Error ? error.message : "There was an error saving your blog.",
        variant: "destructive",
      });
    }
    
    setIsPublishing(false);
  };

  const handleNext = () => {
    publishBlog('published');
  };

  const handleSaveDraft = () => {
    publishBlog('draft');
  };

  return (
    <>
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
              
              <div className="bg-violet-50/50 dark:bg-slate-700/30 p-4 rounded-xl space-y-3">
                <Label className="text-slate-700 dark:text-slate-200 font-medium text-sm">HTML Formatting Tools</Label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    onClick={() => insertHtmlTag('h1')}
                    variant="outline"
                    size="sm"
                    className="text-xs px-2 py-1 h-7"
                  >
                    <Type className="w-3 h-3 mr-1" />
                    H1
                  </Button>
                  <Button
                    type="button"
                    onClick={() => insertHtmlTag('h2')}
                    variant="outline"
                    size="sm"
                    className="text-xs px-2 py-1 h-7"
                  >
                    <Type className="w-3 h-3 mr-1" />
                    H2
                  </Button>
                  <Button
                    type="button"
                    onClick={() => insertHtmlTag('h3')}
                    variant="outline"
                    size="sm"
                    className="text-xs px-2 py-1 h-7"
                  >
                    <Type className="w-3 h-3 mr-1" />
                    H3
                  </Button>
                  
                  <Button
                    type="button"
                    onClick={() => insertHtmlTag('strong')}
                    variant="outline"
                    size="sm"
                    className="text-xs px-2 py-1 h-7"
                  >
                    <Bold className="w-3 h-3 mr-1" />
                    Bold
                  </Button>
                  <Button
                    type="button"
                    onClick={() => insertHtmlTag('em')}
                    variant="outline"
                    size="sm"
                    className="text-xs px-2 py-1 h-7"
                  >
                    <Italic className="w-3 h-3 mr-1" />
                    Italic
                  </Button>
                  
                  <Button
                    type="button"
                    onClick={() => insertListItem('ul')}
                    variant="outline"
                    size="sm"
                    className="text-xs px-2 py-1 h-7"
                  >
                    <List className="w-3 h-3 mr-1" />
                    • List
                  </Button>
                  <Button
                    type="button"
                    onClick={() => insertListItem('ol')}
                    variant="outline"
                    size="sm"
                    className="text-xs px-2 py-1 h-7"
                  >
                    <ListOrdered className="w-3 h-3 mr-1" />
                    1. List
                  </Button>
                  
                  <Button
                    type="button"
                    onClick={insertLink}
                    variant="outline"
                    size="sm"
                    className="text-xs px-2 py-1 h-7"
                  >
                    <Link className="w-3 h-3 mr-1" />
                    Link
                  </Button>
                  
                  <Button
                    type="button"
                    onClick={() => insertHtmlTag('p', 'p', 'Your paragraph text here.')}
                    variant="outline"
                    size="sm"
                    className="text-xs px-2 py-1 h-7"
                  >
                    P
                  </Button>
                  
                  <Button
                    type="button"
                    onClick={insertButton}
                    variant="outline"
                    size="sm"
                    className="text-xs px-2 py-1 h-7"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    CTA Button
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    placeholder={blogPlaceholder}
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
                  <strong>Quick HTML Tips:</strong>
                </p>
                <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  <li>• Click the formatting buttons above to insert HTML tags automatically</li>
                  <li>• Select text first, then click a button to wrap it with tags</li>
                  <li>• Use the preview to see how your content will look</li>
                  <li>• The CTA Button creates a styled button element you can customize</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Button 
                onClick={handleSaveDraft}
                disabled={isPublishing || !formData.title.trim() || !formData.excerpt.trim() || !formData.content.trim()}
                variant="outline"
                className="flex items-center gap-2 px-6 py-3 text-lg font-semibold border-2"
              >
                <Save className="w-5 h-5" />
                Save as Draft
              </Button>
              
              <Button 
                onClick={handleNext}
                disabled={isPublishing || !formData.title.trim() || !formData.excerpt.trim() || !formData.content.trim() || wordCount < minWordCount}
                className="flex items-center gap-2 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 hover:from-violet-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 px-8 py-3 text-lg font-semibold"
              >
                {isPublishing ? (
                  <>
                    <Upload className="w-5 h-5 animate-pulse" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Publish Blog
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

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
    </>
  );
};
