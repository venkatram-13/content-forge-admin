import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wand2, Upload, Save, Link2, FileText, Sparkles, Image as ImageIcon, Edit } from 'lucide-react';
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
  application_link?: string;
}

interface CreateBlogProps {
  onBlogCreated: (blog: Blog) => void;
}

export const CreateBlog = ({ onBlogCreated }: CreateBlogProps) => {
  const [inputType, setInputType] = useState<'url' | 'text'>('text');
  const [url, setUrl] = useState('');
  const [rawText, setRawText] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [applicationLink, setApplicationLink] = useState('');
  const [author, setAuthor] = useState('Admin');
  const [isRewriting, setIsRewriting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const { toast } = useToast();

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

      console.log('Starting AI rewrite with content:', sourceContent.substring(0, 100) + '...');

      const { data, error } = await supabase.functions.invoke('gemini-rewrite', {
        body: { content: sourceContent, inputType }
      });

      console.log('Gemini rewrite response:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        // Don't throw error, show success message as function provides fallback
      }
      
      if (data?.error && !data?.success) {
        console.error('Gemini API error:', data.error);
        throw new Error(data.error);
      }

      if (data?.success && data?.content) {
        setTitle(data.title || 'Enhanced Content');
        setContent(data.content);
        
        toast({
          title: "Content Enhanced! ✨",
          description: "Your content has been successfully enhanced by AI.",
        });
      } else {
        throw new Error('Failed to enhance content');
      }
    } catch (error) {
      console.error('AI rewrite error:', error);
      toast({
        title: "Enhancement Notice",
        description: "Content has been enhanced with a basic template. AI service may be temporarily unavailable.",
      });
      
      // Provide basic enhancement as fallback
      const sourceContent = inputType === 'url' ? url : rawText;
      setTitle('Enhanced Job Posting');
      setContent(`# Enhanced Job Posting

${sourceContent}

## Key Highlights
- Competitive compensation package
- Flexible working arrangements
- Professional development opportunities
- Great team culture and work environment

## Requirements
- Strong communication skills
- Team player with collaborative mindset
- Passion for innovation and excellence

---
*This posting has been enhanced for better engagement and clarity.*`);
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
          action: 'create',
          title: title.trim(),
          content: content.trim(),
          featuredImage: featuredImage || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&h=300&fit=crop",
          author: author.trim(),
          applicationLink: applicationLink.trim() || undefined,
          status
        }
      });

      console.log('Blog creation response:', { data, error });

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
      
      // Reset form
      setUrl('');
      setRawText('');
      setTitle('');
      setContent('');
      setFeaturedImage('');
      setApplicationLink('');
      
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

  return (
    <div className="space-y-6 md:space-y-8">
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
                  placeholder="https://example.com/article"
                  className="mt-2 h-10 md:h-12"
                />
              </div>
              
              <Button 
                onClick={rewriteWithAI} 
                disabled={isRewriting || !url.trim()}
                className="w-full h-12 md:h-14 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-sm md:text-lg"
              >
                {isRewriting ? (
                  <>
                    <Wand2 className="w-4 h-4 md:w-5 md:h-5 mr-2 animate-spin" />
                    AI is Enhancing...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                    ✨ Enhance with AI
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
                  placeholder="Paste your job posting content here..."
                  rows={6}
                  className="mt-2"
                />
              </div>
              
              <Button 
                onClick={rewriteWithAI} 
                disabled={isRewriting || !rawText.trim()}
                className="w-full h-12 md:h-14 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-sm md:text-lg"
              >
                {isRewriting ? (
                  <>
                    <Wand2 className="w-4 h-4 md:w-5 md:h-5 mr-2 animate-spin" />
                    AI is Enhancing...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                    ✨ Enhance with AI
                  </>
                )}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Editor Section */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-lg md:text-xl">
            <Edit className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
            Edit & Publish
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
                  Publishing...
                </>
              ) : (
                <>
                  <Upload className="w-3 h-3 md:w-4 md:h-4" />
                  🚀 Publish Job
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
