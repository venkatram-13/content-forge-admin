
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wand2, Upload, Save, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  publishedAt: string;
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

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const generateExcerpt = (content: string) => {
    const plainText = content.replace(/<[^>]*>/g, '');
    return plainText.substring(0, 150) + (plainText.length > 150 ? '...' : '');
  };

  const rewriteWithAI = async () => {
    const apiKey = localStorage.getItem('gemini_api_key');
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please set up your Gemini API key in Settings first.",
        variant: "destructive",
      });
      return;
    }

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

      // Simulate AI rewriting (replace with actual Gemini API call)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock rewritten content
      const rewrittenTitle = inputType === 'url' 
        ? "AI-Powered Insights: " + url.split('/').pop()?.replace(/-/g, ' ') || "New Article"
        : "AI-Enhanced Article: " + rawText.substring(0, 50) + "...";
      
      const rewrittenContent = `<h2>Introduction</h2>
      
<p>This article has been enhanced and rewritten using advanced AI technology to provide you with the most engaging and informative content possible.</p>

<h2>Key Insights</h2>

<p>${inputType === 'url' 
  ? `Based on the content from ${url}, we've extracted the most valuable insights and presented them in a more accessible format.`
  : rawText.substring(0, 200) + '...'
}</p>

<h2>Enhanced Analysis</h2>

<p>Our AI has analyzed the original content and provided additional context, insights, and practical applications that make this information more valuable for readers.</p>

<h2>Conclusion</h2>

<p>This AI-enhanced version provides a comprehensive overview while maintaining the core message and adding valuable insights for better understanding.</p>`;

      setTitle(rewrittenTitle);
      setContent(rewrittenContent);
      
      toast({
        title: "Content Rewritten!",
        description: "Your content has been successfully rewritten by AI. You can now edit it further.",
      });
    } catch (error) {
      toast({
        title: "Rewriting Failed",
        description: "There was an error rewriting your content. Please try again.",
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
    
    const newBlog: Blog = {
      id: Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      excerpt: generateExcerpt(content),
      featuredImage: featuredImage || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&h=300&fit=crop",
      publishedAt: new Date().toISOString(),
      author: author.trim(),
      slug: generateSlug(title),
      status,
    };

    // Simulate saving
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onBlogCreated(newBlog);
    
    // Reset form
    setUrl('');
    setRawText('');
    setTitle('');
    setContent('');
    setFeaturedImage('');
    
    toast({
      title: status === 'published' ? "Blog Published!" : "Draft Saved!",
      description: `Your blog has been ${status === 'published' ? 'published successfully' : 'saved as a draft'}.`,
    });
    
    setIsPublishing(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="w-5 h-5" />
            Create New Blog Post
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={inputType} onValueChange={(value) => setInputType(value as 'url' | 'text')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="text">Manual Text</TabsTrigger>
              <TabsTrigger value="url">From URL</TabsTrigger>
            </TabsList>
            
            <TabsContent value="url" className="space-y-4">
              <div>
                <Label htmlFor="url">Article URL</Label>
                <Input
                  id="url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/article"
                />
              </div>
              
              <Button 
                onClick={rewriteWithAI} 
                disabled={isRewriting || !url.trim()}
                className="w-full"
              >
                {isRewriting ? (
                  <>
                    <Wand2 className="w-4 h-4 mr-2 animate-spin" />
                    Rewriting with AI...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Rewrite with AI
                  </>
                )}
              </Button>
            </TabsContent>
            
            <TabsContent value="text" className="space-y-4">
              <div>
                <Label htmlFor="rawText">Raw Text</Label>
                <Textarea
                  id="rawText"
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="Paste your article content here..."
                  rows={6}
                />
              </div>
              
              <Button 
                onClick={rewriteWithAI} 
                disabled={isRewriting || !rawText.trim()}
                className="w-full"
              >
                {isRewriting ? (
                  <>
                    <Wand2 className="w-4 h-4 mr-2 animate-spin" />
                    Rewriting with AI...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Rewrite with AI
                  </>
                )}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Editor Section */}
      <Card>
        <CardHeader>
          <CardTitle>Edit & Publish</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter blog title..."
              />
            </div>
            
            <div>
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Author name..."
              />
            </div>
          </div>

          <div>
            <Label htmlFor="featuredImage">Featured Image URL</Label>
            <Input
              id="featuredImage"
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
              placeholder="https://example.com/image.jpg (optional)"
            />
          </div>

          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write or edit your blog content here..."
              rows={12}
            />
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={() => publishBlog('draft')}
              variant="outline"
              disabled={isPublishing}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save as Draft
            </Button>
            
            <Button 
              onClick={() => publishBlog('published')}
              disabled={isPublishing}
              className="flex items-center gap-2"
            >
              {isPublishing ? (
                <>
                  <Upload className="w-4 h-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Publish Blog
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
