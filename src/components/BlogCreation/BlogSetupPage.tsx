
import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Save, Upload, Image as ImageIcon, Edit, Link, Bold, Italic, List, Eye, Plus, Type, ArrowLeft } from 'lucide-react';
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
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
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        insertAtCursor(`\n\n![${file.name}](${imageUrl})\n\n`);
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

  const insertAtCursor = (textToInsert: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newContent = content.substring(0, start) + textToInsert + content.substring(end);
    
    setContent(newContent);
    
    // Set cursor position after inserted text
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + textToInsert.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 100);
  };

  const wrapSelectedText = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const wrappedText = prefix + (selectedText || 'text') + (suffix || prefix);
    
    const newContent = content.substring(0, start) + wrappedText + content.substring(end);
    setContent(newContent);
    
    setTimeout(() => {
      textarea.focus();
      if (selectedText) {
        textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
      } else {
        textarea.setSelectionRange(start + prefix.length, start + prefix.length + 4); // Select "text"
      }
    }, 100);
  };

  const insertFormatting = (format: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let textToInsert = '';
    
    switch (format) {
      case 'bold':
        wrapSelectedText('**', '**');
        return;
      case 'italic':
        wrapSelectedText('*', '*');
        return;
      case 'underline':
        wrapSelectedText('<u>', '</u>');
        return;
      case 'h1':
        textToInsert = `\n# ${selectedText || 'Heading 1'}\n`;
        break;
      case 'h2':
        textToInsert = `\n## ${selectedText || 'Heading 2'}\n`;
        break;
      case 'h3':
        textToInsert = `\n### ${selectedText || 'Heading 3'}\n`;
        break;
      case 'h4':
        textToInsert = `\n#### ${selectedText || 'Heading 4'}\n`;
        break;
      case 'bullet-list':
        textToInsert = `\n- ${selectedText || 'List item'}\n- \n- \n`;
        break;
      case 'numbered-list':
        textToInsert = `\n1. ${selectedText || 'First item'}\n2. \n3. \n`;
        break;
      case 'link':
        const linkText = selectedText || 'link text';
        const url = prompt('Enter the URL:') || 'https://example.com';
        textToInsert = `[${linkText}](${url})`;
        break;
      case 'cta-button':
        const buttonText = selectedText || 'Apply Now';
        const buttonUrl = prompt('Enter the URL for this button:') || 'https://example.com';
        textToInsert = `\n\n<div style="text-align: center; margin: 24px 0;"><a href="${buttonUrl}" target="_blank" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 32px; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4); transition: all 0.3s ease; text-decoration: none; display: inline-block; hover:transform: translateY(-2px);">${buttonText}</a></div>\n\n`;
        break;
    }
    
    if (textToInsert) {
      insertAtCursor(textToInsert);
    }
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
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: content
                    .replace(/\n/g, '<br />')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
                    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
                    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
                    .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
                }}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button 
                onClick={() => setShowPreview(false)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Edit
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
              {featuredImage && (
                <div className="mt-2">
                  <img src={featuredImage} alt="Featured" className="w-full h-32 object-cover rounded border" />
                </div>
              )}
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
              {thumbnailImage && (
                <div className="mt-2">
                  <img src={thumbnailImage} alt="Thumbnail" className="w-full h-32 object-cover rounded border" />
                </div>
              )}
            </div>
          </div>

          {/* Rich Text Editor */}
          <div>
            <Label htmlFor="content" className="text-sm md:text-base font-medium">
              Rich Text Editor ({wordCount} words - Min: 1500) 
              <span className={wordCount < 1500 ? "text-red-500 ml-2" : "text-green-500 ml-2"}>
                {wordCount < 1500 ? `Need ${1500 - wordCount} more words` : "✓ Word count met"}
              </span>
            </Label>
            
            {/* Enhanced Formatting Toolbar */}
            <div className="flex flex-wrap gap-2 mt-2 mb-2 p-3 bg-gray-50 rounded-lg border">
              {/* Text Formatting */}
              <div className="flex gap-1 pr-2 border-r border-gray-300">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => insertFormatting('bold')} 
                  title="Bold"
                  type="button"
                >
                  <Bold className="w-3 h-3" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => insertFormatting('italic')} 
                  title="Italic"
                  type="button"
                >
                  <Italic className="w-3 h-3" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => insertFormatting('underline')} 
                  title="Underline"
                  type="button"
                >
                  <Type className="w-3 h-3" />
                </Button>
              </div>

              {/* Headings */}
              <div className="flex gap-1 pr-2 border-r border-gray-300">
                <Button size="sm" variant="outline" onClick={() => insertFormatting('h1')} title="Heading 1" type="button">
                  H1
                </Button>
                <Button size="sm" variant="outline" onClick={() => insertFormatting('h2')} title="Heading 2" type="button">
                  H2
                </Button>
                <Button size="sm" variant="outline" onClick={() => insertFormatting('h3')} title="Heading 3" type="button">
                  H3
                </Button>
                <Button size="sm" variant="outline" onClick={() => insertFormatting('h4')} title="Heading 4" type="button">
                  H4
                </Button>
              </div>

              {/* Lists */}
              <div className="flex gap-1 pr-2 border-r border-gray-300">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => insertFormatting('bullet-list')} 
                  title="Bullet List"
                  type="button"
                >
                  <List className="w-3 h-3" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => insertFormatting('numbered-list')} 
                  title="Numbered List"
                  type="button"
                >
                  1.
                </Button>
              </div>

              {/* Links & Media */}
              <div className="flex gap-1 pr-2 border-r border-gray-300">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => insertFormatting('link')} 
                  title="Insert Link"
                  type="button"
                >
                  <Link className="w-3 h-3" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()} 
                  disabled={uploadingImage}
                  title="Upload Image"
                  type="button"
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
                  type="button"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  CTA Button
                </Button>
              </div>
            </div>
            
            <Textarea
              ref={textareaRef}
              id="content-editor"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Edit your blog content here... Use the toolbar above to format your text, add images, and insert CTA buttons!"
              rows={24}
              className="mt-2 font-mono text-sm resize-none"
            />
            <p className="text-xs text-gray-500 mt-2">
              💡 <strong>Pro Tips:</strong> Select text before applying formatting (bold, italic, etc.). 
              Upload images directly using the 📷 button. Create CTA buttons with custom URLs. 
              Minimum 1500 words required for publication.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={onBack}
              variant="outline"
              className="flex items-center gap-2 h-10 md:h-12 px-4 md:px-6"
              type="button"
            >
              <ArrowLeft className="w-3 h-3 md:w-4 md:h-4" />
              Back to Content
            </Button>
            
            <Button 
              onClick={() => setShowPreview(true)}
              variant="outline"
              className="flex items-center gap-2 h-10 md:h-12 px-4 md:px-6"
              type="button"
            >
              <Eye className="w-3 h-3 md:w-4 md:h-4" />
              Preview
            </Button>
            
            <Button 
              onClick={() => publishBlog('draft')}
              variant="outline"
              disabled={isPublishing}
              className="flex items-center gap-2 h-10 md:h-12 px-4 md:px-6 border-2"
              type="button"
            >
              <Save className="w-3 h-3 md:w-4 md:h-4" />
              Save as Draft
            </Button>
            
            <Button 
              onClick={() => publishBlog('published')}
              disabled={isPublishing}
              className="flex items-center gap-2 h-10 md:h-12 px-4 md:px-6 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700"
              type="button"
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
