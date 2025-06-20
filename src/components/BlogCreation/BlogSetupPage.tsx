
import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Save, Upload, Image as ImageIcon, Edit, Link, Bold, Italic, List, Eye, Plus, Type, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface BlogSetupPageProps {
  initialContent: string;
  initialTitle: string;
  onBlogCreated: (blog: any) => void;
  onBack: () => void;
}

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

export const BlogSetupPage = ({ initialContent, initialTitle, onBlogCreated, onBack }: BlogSetupPageProps) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [featuredImage, setFeaturedImage] = useState('');
  const [thumbnailImage, setThumbnailImage] = useState('');
  const [author, setAuthor] = useState('Admin');
  const [isPublishing, setIsPublishing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setUploadingImage(true);
    
    try {
      // Create a data URL for immediate preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        insertImageIntoContent(imageUrl, file.name);
      };
      reader.readAsDataURL(file);
      
      toast({
        title: "Image Added",
        description: "Image has been inserted into your content.",
      });
    } catch (error) {
      console.error('Image upload error:', error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your image.",
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const insertImageIntoContent = (imageUrl: string, altText: string) => {
    const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const imageMarkdown = `\n\n![${altText}](${imageUrl})\n\n`;
    
    const newContent = content.substring(0, start) + imageMarkdown + content.substring(start);
    setContent(newContent);
  };

  const insertFormatting = (format: string) => {
    const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let formattedText = '';
    
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText || 'bold text'}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText || 'italic text'}*`;
        break;
      case 'underline':
        formattedText = `<u>${selectedText || 'underlined text'}</u>`;
        break;
      case 'h1':
        formattedText = `# ${selectedText || 'Heading 1'}`;
        break;
      case 'h2':
        formattedText = `## ${selectedText || 'Heading 2'}`;
        break;
      case 'h3':
        formattedText = `### ${selectedText || 'Heading 3'}`;
        break;
      case 'h4':
        formattedText = `#### ${selectedText || 'Heading 4'}`;
        break;
      case 'bullet-list':
        formattedText = `- ${selectedText || 'List item'}`;
        break;
      case 'numbered-list':
        formattedText = `1. ${selectedText || 'Numbered list item'}`;
        break;
      case 'link':
        formattedText = `[${selectedText || 'link text'}](https://example.com)`;
        break;
      case 'cta-button':
        const buttonText = selectedText || 'Apply Now';
        const buttonUrl = prompt('Enter the URL for this button:') || 'https://example.com';
        formattedText = `\n\n<div style="text-align: center; margin: 24px 0;"><button onclick="window.open('${buttonUrl}', '_blank')" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 32px; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4); transition: all 0.3s ease; text-decoration: none; display: inline-block;">${buttonText}</button></div>\n\n`;
        break;
      case 'image-placeholder':
        formattedText = `![${selectedText || 'Image description'}](https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&h=300&fit=crop)`;
        break;
    }
    
    const newContent = content.substring(0, start) + formattedText + content.substring(end);
    setContent(newContent);
    
    // Focus back to textarea and set cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + formattedText.length, start + formattedText.length);
    }, 100);
  };

  const validateContent = () => {
    const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
    
    if (!title.trim()) {
      toast({
        title: "Title Required",
        description: "Please provide a title for your blog post.",
        variant: "destructive",
      });
      return false;
    }
    
    if (wordCount < 1500) {
      toast({
        title: "Content Too Short",
        description: `Your content has ${wordCount} words. Minimum 1500 words required.`,
        variant: "destructive",
      });
      return false;
    }
    
    if (!featuredImage.trim()) {
      toast({
        title: "Featured Image Required",
        description: "Please provide a featured image URL.",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const publishBlog = async (status: 'published' | 'draft') => {
    if (!validateContent() && status === 'published') {
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

  const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;

  if (showPreview) {
    return (
      <div className="space-y-6">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl md:text-2xl">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Eye className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              Final Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {featuredImage && (
                <img src={featuredImage} alt={title} className="w-full h-64 object-cover rounded-lg" />
              )}
              <h1 className="text-3xl font-bold">{title}</h1>
              <p className="text-gray-600">By {author} • {wordCount} words</p>
              <div className="prose prose-lg max-w-none">
                <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }} />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button 
                onClick={() => setShowPreview(false)}
                variant="outline"
                className="flex items-center gap-2"
              >
                ← Back to Edit
              </Button>
              
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
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-lg md:text-xl">
            <Edit className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
            Step 2: Blog Setup & Rich Text Editor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6">
          {/* Blog Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <Label htmlFor="title" className="text-sm md:text-base font-medium">Blog Title *</Label>
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
              <Label htmlFor="featuredImage" className="text-sm md:text-base font-medium flex items-center gap-2">
                <ImageIcon className="w-3 h-3 md:w-4 md:h-4" />
                Featured Image URL *
              </Label>
              <Input
                id="featuredImage"
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                placeholder="https://example.com/featured-image.jpg"
                className="mt-2 h-10 md:h-12"
              />
            </div>

            <div>
              <Label htmlFor="thumbnailImage" className="text-sm md:text-base font-medium flex items-center gap-2">
                <ImageIcon className="w-3 h-3 md:w-4 md:h-4" />
                Thumbnail Image URL
              </Label>
              <Input
                id="thumbnailImage"
                value={thumbnailImage}
                onChange={(e) => setThumbnailImage(e.target.value)}
                placeholder="https://example.com/thumbnail.jpg (optional)"
                className="mt-2 h-10 md:h-12"
              />
            </div>
          </div>

          {/* Rich Text Editor */}
          <div>
            <Label htmlFor="content" className="text-sm md:text-base font-medium">
              Rich Text Editor ({wordCount} words - Min: 1500) 
              <span className={wordCount < 1500 ? "text-red-500" : "text-green-500 ml-2"}>
                {wordCount < 1500 ? `Need ${1500 - wordCount} more words` : "✓ Word count met"}
              </span>
            </Label>
            
            {/* Enhanced Formatting Toolbar */}
            <div className="flex flex-wrap gap-2 mt-2 mb-2 p-3 bg-gray-50 rounded-lg border">
              {/* Text Formatting */}
              <div className="flex gap-1 pr-2 border-r border-gray-300">
                <Button size="sm" variant="outline" onClick={() => insertFormatting('bold')} title="Bold">
                  <Bold className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => insertFormatting('italic')} title="Italic">
                  <Italic className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => insertFormatting('underline')} title="Underline">
                  <Type className="w-3 h-3" />
                </Button>
              </div>

              {/* Headings */}
              <div className="flex gap-1 pr-2 border-r border-gray-300">
                <Button size="sm" variant="outline" onClick={() => insertFormatting('h1')} title="Heading 1">
                  H1
                </Button>
                <Button size="sm" variant="outline" onClick={() => insertFormatting('h2')} title="Heading 2">
                  H2
                </Button>
                <Button size="sm" variant="outline" onClick={() => insertFormatting('h3')} title="Heading 3">
                  H3
                </Button>
                <Button size="sm" variant="outline" onClick={() => insertFormatting('h4')} title="Heading 4">
                  H4
                </Button>
              </div>

              {/* Lists */}
              <div className="flex gap-1 pr-2 border-r border-gray-300">
                <Button size="sm" variant="outline" onClick={() => insertFormatting('bullet-list')} title="Bullet List">
                  <List className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => insertFormatting('numbered-list')} title="Numbered List">
                  1.
                </Button>
              </div>

              {/* Links & Media */}
              <div className="flex gap-1 pr-2 border-r border-gray-300">
                <Button size="sm" variant="outline" onClick={() => insertFormatting('link')} title="Insert Link">
                  <Link className="w-3 h-3" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()} 
                  disabled={uploadingImage}
                  title="Upload Image"
                >
                  {uploadingImage ? (
                    <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <ImageIcon className="w-3 h-3" />
                  )}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* CTA Button */}
              <div className="flex gap-1">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => insertFormatting('cta-button')} 
                  className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 hover:from-blue-100 hover:to-purple-100"
                  title="Insert CTA Button"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  CTA Button
                </Button>
              </div>
            </div>
            
            <Textarea
              id="content-editor"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Edit your blog content here..."
              rows={24}
              className="mt-2 font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-2">
              💡 <strong>Pro Tips:</strong> Upload images directly using the 📷 button, create CTA buttons with custom URLs, 
              and use all formatting options to create engaging content. Minimum 1500 words required for publication.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={onBack}
              variant="outline"
              className="flex items-center gap-2 h-10 md:h-12 px-4 md:px-6"
            >
              ← Back to Content
            </Button>
            
            <Button 
              onClick={() => setShowPreview(true)}
              variant="outline"
              className="flex items-center gap-2 h-10 md:h-12 px-4 md:px-6"
            >
              <Eye className="w-3 h-3 md:w-4 md:h-4" />
              Preview
            </Button>
            
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
