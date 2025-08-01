import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wand2, Upload, Save, Link2, FileText, Sparkles, Image as ImageIcon, Edit, Briefcase, Eye, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
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
  apply_link?: string;
  category?: string;
}

interface CreateBlogProps {
  onBlogCreated: (blog: Blog) => void;
  existingBlog?: Blog;
  isEditing?: boolean;
}

export const CreateBlog = ({ onBlogCreated, existingBlog, isEditing = false }: CreateBlogProps) => {
  const [inputType, setInputType] = useState<'url' | 'text'>('text');
  const [url, setUrl] = useState('');
  const [rawText, setRawText] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [applicationLink, setApplicationLink] = useState('');
  const [category, setCategory] = useState('');
  const [author, setAuthor] = useState('Admin');
  const [isRewriting, setIsRewriting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewMode, setPreviewMode] = useState<'preview' | 'html'>('preview');
  const { toast } = useToast();

  // Initialize form with existing blog data if editing
  useEffect(() => {
    if (isEditing && existingBlog) {
      setTitle(existingBlog.title);
      setContent(existingBlog.content);
      setFeaturedImage(existingBlog.featured_image);
      setApplicationLink(existingBlog.apply_link || '');
      setCategory(existingBlog.category || '');
      setAuthor(existingBlog.author);
    }
  }, [isEditing, existingBlog]);

  const rewriteWithAI = async () => {
    setIsRewriting(true);
    try {
      const sourceContent = inputType === 'url' ? url : rawText;
      if (!sourceContent.trim()) {
        toast({
          title: "Content Required",
          description: "Please provide either a URL or text content to rewrite.",
          variant: "destructive",
        });
        setIsRewriting(false);
        return;
      }

      console.log('Starting AI rewrite with Gemini API for content:', sourceContent.substring(0, 100) + '...');

      const { data, error } = await supabase.functions.invoke('gemini-rewrite', {
        body: { 
          content: sourceContent, 
          inputType,
          systemPrompt: "You are an experienced professional blog writer specializing in job postings and career content. Rewrite the following content into a comprehensive, SEO-optimized blog post for a hiring/job platform. Requirements: 1) Target 800-900 words exactly, 2) Format content in HTML tags (not Markdown), 3) Use proper HTML structure with <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em> tags, 4) MUST include a dedicated section titled 'Candidate Requirements' with specific qualifications, experience levels, and prerequisites, 5) MUST include a detailed 'Required Skills' section listing technical and soft skills, 6) Include sections like job overview, responsibilities, company culture, benefits, and application process, 7) Professional and engaging tone for job seekers, 8) Use semantic HTML structure with clear headings and well-organized content."
        }
      });

      console.log('Gemini API response:', { data, error, hasContent: !!data?.content });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(`API Error: ${error.message || 'Failed to connect to AI service'}`);
      }
      
      if (!data) {
        throw new Error('No response received from AI service');
      }

      if (data.error && !data.success) {
        console.error('Gemini API error:', data.error);
        throw new Error(data.error || 'AI generation failed');
      }

      if (data.success && data.content) {
        const wordCount = data.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
        
        console.log(`Content generated successfully with ${wordCount} words`);
        
        setTitle(data.title || 'AI Enhanced Job Posting');
        setContent(data.content);
        setShowPreview(true);
        
        toast({
          title: "Content Enhanced! ✨",
          description: `Your content has been successfully enhanced by AI (${wordCount} words).`,
        });
      } else {
        throw new Error('AI service returned no content');
      }
    } catch (error) {
      console.error('AI rewrite error:', error);
      toast({
        title: "AI Enhancement Failed",
        description: error instanceof Error ? error.message : "Unable to enhance content with AI. Please check your internet connection and try again.",
        variant: "destructive",
      });
    }
    setIsRewriting(false);
  };

  const publishBlog = async (status: 'published' | 'draft') => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both a title and content for your blog.",
        variant: "destructive",
      });
      return;
    }

    setIsPublishing(true);
    
    try {
      console.log('Publishing blog with status:', status);

      const { data, error } = await supabase.functions.invoke('blog-operations', {
        body: {
          action: isEditing ? 'update' : 'create',
          blogId: isEditing ? existingBlog?.id : undefined,
          title: title.trim(),
          content: content.trim(),
          featuredImage: featuredImage || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&h=300&fit=crop",
          author: author.trim(),
          applicationLink: applicationLink.trim() || undefined,
          category: category || undefined,
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

      onBlogCreated(data.blog);
      
      // Reset form only if creating new blog
      if (!isEditing) {
        setUrl('');
        setRawText('');
        setTitle('');
        setContent('');
        setFeaturedImage('');
        setApplicationLink('');
        setCategory('');
        setShowPreview(false);
      }
      
      toast({
        title: isEditing 
          ? (status === 'published' ? "Blog Updated & Published! 🎉" : "Blog Updated & Saved! 📝")
          : (status === 'published' ? "Blog Published! 🎉" : "Draft Saved! 📝"),
        description: isEditing 
          ? `Your blog has been ${status === 'published' ? 'updated and published successfully' : 'updated and saved as a draft'}.`
          : `Your blog has been ${status === 'published' ? 'published successfully' : 'saved as a draft'}.`,
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

  const renderHtmlPreview = (htmlContent: string) => {
    // Return the HTML content directly for rendering
    return htmlContent;
  };

  // Show preview if content has been generated and user wants to preview
  if (showPreview && content) {
    return (
      <div className="space-y-6">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl md:text-2xl">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
                <Eye className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              AI-Generated Content Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Label className="text-lg font-semibold">Generated Title:</Label>
              <h2 className="text-2xl font-bold text-gray-900 mt-2">{title}</h2>
            </div>
            
            {/* Preview Toggle Tabs */}
            <Tabs value={previewMode} onValueChange={(value) => setPreviewMode(value as 'preview' | 'html')}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="preview" className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Preview
                </TabsTrigger>
                <TabsTrigger value="html" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  HTML
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="preview" className="mt-4">
                <div className="p-6 bg-gray-50 rounded-lg max-h-96 overflow-y-auto border">
                  <div 
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: renderHtmlPreview(content) }}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="html" className="mt-4">
                <div className="p-4 bg-gray-50 rounded-lg max-h-96 overflow-y-auto border font-mono text-sm">
                  <pre className="whitespace-pre-wrap">{content}</pre>
                </div>
              </TabsContent>
            </Tabs>
            
            <p className="text-sm text-gray-600 mt-2">
              Word count: {content.replace(/<[^>]*>/g, '').split(/\s+/).length} words
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button 
                onClick={() => setShowPreview(false)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Back to Edit
              </Button>
              
              <Button 
                onClick={() => publishBlog('published')}
                disabled={isPublishing}
                className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700"
              >
                {isPublishing ? (
                  <>
                    <Upload className="w-4 h-4 animate-pulse" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    🚀 Publish Blog
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {!isEditing && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl md:text-2xl">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              Create AI-Powered Job Post
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={inputType} onValueChange={(value) => setInputType(value as 'url' | 'text')}>
              <TabsList className="grid w-full grid-cols-2 mb-4 md:mb-6">
                <TabsTrigger value="text" className="flex items-center gap-2 text-sm md:text-base">
                  <FileText className="w-3 h-3 md:w-4 md:h-4" />
                  Manual Text
                </TabsTrigger>
                <TabsTrigger value="url" className="flex items-center gap-2 text-sm md:text-base">
                  <Link2 className="w-3 h-3 md:w-4 md:h-4" />
                  From URL
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="url" className="space-y-4">
                <div>
                  <Label htmlFor="url" className="text-sm md:text-base font-medium">Article URL</Label>
                  <Input
                    id="url"
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/job-posting"
                    className="mt-2 h-10 md:h-12"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Provide a URL to a job posting that will be enhanced by AI
                  </p>
                </div>
                
                <Button 
                  onClick={rewriteWithAI} 
                  disabled={isRewriting || !url.trim()}
                  className="w-full h-12 md:h-14 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-sm md:text-lg"
                >
                  {isRewriting ? (
                    <>
                      <Wand2 className="w-4 h-4 md:w-5 md:h-5 mr-2 animate-spin" />
                      AI is Generating Content...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                      ✨ Generate with AI
                    </>
                  )}
                </Button>
              </TabsContent>
              
              <TabsContent value="text" className="space-y-4">
                <div>
                  <Label htmlFor="rawText" className="text-sm md:text-base font-medium">Raw Text Content</Label>
                  <Textarea
                    id="rawText"
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    placeholder="Paste your job posting content, bullet points, or job description here..."
                    rows={8}
                    className="mt-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Provide job details, requirements, or any content that should be enhanced into a professional blog post
                  </p>
                </div>
                
                <Button 
                  onClick={rewriteWithAI} 
                  disabled={isRewriting || !rawText.trim()}
                  className="w-full h-12 md:h-14 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-sm md:text-lg"
                >
                  {isRewriting ? (
                    <>
                      <Wand2 className="w-4 h-4 md:w-5 md:h-5 mr-2 animate-spin" />
                      AI is Generating Content...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                      ✨ Generate with AI
                    </>
                  )}
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Editor Section - Only show if not in preview mode */}
      {!showPreview && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-lg md:text-xl">
              <Edit className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
              {isEditing ? 'Edit Blog Post' : 'Edit & Publish'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <Label htmlFor="title" className="text-sm md:text-base font-medium">Job Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter an engaging title..."
                  className="mt-2 h-10 md:h-12"
                />
              </div>
              
              <div>
                <Label htmlFor="author" className="text-sm md:text-base font-medium">Author</Label>
                <Input
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Author name..."
                  className="mt-2 h-10 md:h-12"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <Label htmlFor="category" className="text-sm md:text-base font-medium flex items-center gap-2">
                  <Briefcase className="w-3 h-3 md:w-4 md:h-4" />
                  Select Post Type
                </Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="mt-2 h-10 md:h-12">
                    <SelectValue placeholder="Select category..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-Time</SelectItem>
                    <SelectItem value="part-time">Part-Time</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                    <SelectItem value="job">Job</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="featuredImage" className="text-sm md:text-base font-medium flex items-center gap-2">
                  <ImageIcon className="w-3 h-3 md:w-4 md:h-4" />
                  Featured Image URL
                </Label>
                <Input
                  id="featuredImage"
                  value={featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                  placeholder="https://example.com/image.jpg (optional)"
                  className="mt-2 h-10 md:h-12"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="applicationLink" className="text-sm md:text-base font-medium flex items-center gap-2">
                <Link2 className="w-3 h-3 md:w-4 md:h-4" />
                Application Link (Optional)
              </Label>
              <Input
                id="applicationLink"
                value={applicationLink}
                onChange={(e) => setApplicationLink(e.target.value)}
                placeholder="https://example.com/apply (will show as 'Apply Here' button)"
                className="mt-2 h-10 md:h-12"
              />
              <p className="text-xs text-gray-500 mt-1">
                If provided, an "Apply Here" button will appear at the bottom of the blog post
              </p>
            </div>

            <div>
              <Label htmlFor="content" className="text-sm md:text-base font-medium">Job Description</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write or edit your job posting content here..."
                rows={10}
                className="mt-2"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => publishBlog('draft')}
                variant="outline"
                disabled={isPublishing}
                className="flex items-center gap-2 h-10 md:h-12 px-4 md:px-6 border-2"
              >
                <Save className="w-3 h-3 md:w-4 md:h-4" />
                Save as Draft
              </Button>
              
              <Button 
                onClick={() => publishBlog('published')}
                disabled={isPublishing}
                className="flex items-center gap-2 h-10 md:h-12 px-4 md:px-6 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700"
              >
                {isPublishing ? (
                  <>
                    <Upload className="w-3 h-3 md:w-4 md:h-4 animate-pulse" />
                    {isEditing ? 'Updating...' : 'Publishing...'}
                  </>
                ) : (
                  <>
                    <Upload className="w-3 h-3 md:w-4 md:h-4" />
                    {isEditing ? '🚀 Update Blog' : '🚀 Publish Job'}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
