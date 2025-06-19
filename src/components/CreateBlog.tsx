
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
        throw new Error(`API Error: ${error.message}`);
      }
      
      if (data?.error) {
        console.error('Gemini API error:', data.error);
        throw new Error(data.error);
      }

      if (!data?.success || !data?.content) {
        console.error('Invalid response from Gemini:', data);
        throw new Error('Invalid response from AI service');
      }

      setTitle(data.title);
      setContent(data.content);
      
      toast({
        title: "Content Rewritten! ✨",
        description: "Your content has been successfully enhanced by AI.",
      });
    } catch (error) {
      console.error('AI rewrite error:', error);
      toast({
        title: "Rewriting Failed",
        description: error instanceof Error ? error.message : "There was an error rewriting your content.",
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
          action: 'create',
          title: title.trim(),
          content: content.trim(),
          featuredImage: featuredImage || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&h=300&fit=crop",
          author: author.trim(),
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
    <div className="space-y-8">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            Create AI-Powered Blog Post
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={inputType} onValueChange={(value) => setInputType(value as 'url' | 'text')}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="text" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Manual Text
              </TabsTrigger>
              <TabsTrigger value="url" className="flex items-center gap-2">
                <Link2 className="w-4 h-4" />
                From URL
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="url" className="space-y-4">
              <div>
                <Label htmlFor="url" className="text-base font-medium">Article URL</Label>
                <Input
                  id="url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/article"
                  className="mt-2 h-12"
                />
              </div>
              
              <Button 
                onClick={rewriteWithAI} 
                disabled={isRewriting || !url.trim()}
                className="w-full h-14 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-lg"
              >
                {isRewriting ? (
                  <>
                    <Wand2 className="w-5 h-5 mr-2 animate-spin" />
                    AI is Rewriting...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5 mr-2" />
                    ✨ Rewrite with AI Magic
                  </>
                )}
              </Button>
            </TabsContent>
            
            <TabsContent value="text" className="space-y-4">
              <div>
                <Label htmlFor="rawText" className="text-base font-medium">Raw Text Content</Label>
                <Textarea
                  id="rawText"
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="Paste your article content here..."
                  rows={6}
                  className="mt-2"
                />
              </div>
              
              <Button 
                onClick={rewriteWithAI} 
                disabled={isRewriting || !rawText.trim()}
                className="w-full h-14 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-lg"
              >
                {isRewriting ? (
                  <>
                    <Wand2 className="w-5 h-5 mr-2 animate-spin" />
                    AI is Rewriting...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5 mr-2" />
                    ✨ Rewrite with AI Magic
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
          <CardTitle className="flex items-center gap-3 text-xl">
            <Edit className="w-5 h-5 text-blue-600" />
            Edit & Publish
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="title" className="text-base font-medium">Blog Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter an engaging title..."
                className="mt-2 h-12"
              />
            </div>
            
            <div>
              <Label htmlFor="author" className="text-base font-medium">Author</Label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Author name..."
                className="mt-2 h-12"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="featuredImage" className="text-base font-medium flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Featured Image URL
            </Label>
            <Input
              id="featuredImage"
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
              placeholder="https://example.com/image.jpg (optional)"
              className="mt-2 h-12"
            />
          </div>

          <div>
            <Label htmlFor="content" className="text-base font-medium">Blog Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write or edit your blog content here..."
              rows={12}
              className="mt-2"
            />
          </div>

          <div className="flex gap-4">
            <Button 
              onClick={() => publishBlog('draft')}
              variant="outline"
              disabled={isPublishing}
              className="flex items-center gap-2 h-12 px-6 border-2"
            >
              <Save className="w-4 h-4" />
              Save as Draft
            </Button>
            
            <Button 
              onClick={() => publishBlog('published')}
              disabled={isPublishing}
              className="flex items-center gap-2 h-12 px-6 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700"
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
};
