import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Upload, Image as ImageIcon, Edit, Link, Bold, Italic, List, Eye, Plus, Type, ArrowLeft, Briefcase } from 'lucide-react';
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
  application_link?: string;
  category?: string;
}

export const BlogSetupPage = ({ initialContent, initialTitle, onBlogCreated, onBack }: BlogSetupPageProps) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [featuredImage, setFeaturedImage] = useState('');
  const [applicationLink, setApplicationLink] = useState('');
  const [category, setCategory] = useState('');
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
        insertAtCursor(`<img src="${imageUrl}" alt="${file.name}" />`);
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

  const insertAtCursor = (htmlToInsert: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newContent = content.substring(0, start) + htmlToInsert + content.substring(end);
    
    setContent(newContent);
    
    // Set cursor position after inserted text
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + htmlToInsert.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 100);
  };

  const wrapSelectedText = (openTag: string, closeTag: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const wrappedText = openTag + (selectedText || 'text') + closeTag;
    
    const newContent = content.substring(0, start) + wrappedText + content.substring(end);
    setContent(newContent);
    
    setTimeout(() => {
      textarea.focus();
      if (selectedText) {
        textarea.setSelectionRange(start + openTag.length, start + openTag.length + selectedText.length);
      } else {
        textarea.setSelectionRange(start + openTag.length, start + openTag.length + 4); // Select "text"
      }
    }, 100);
  };

  const insertFormatting = (format: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let htmlToInsert = '';
    
    switch (format) {
      case 'bold':
        wrapSelectedText('<strong>', '</strong>');
        return;
      case 'italic':
        wrapSelectedText('<em>', '</em>');
        return;
      case 'underline':
        wrapSelectedText('<u>', '</u>');
        return;
      case 'h1':
        htmlToInsert = `<h1>${selectedText || 'Heading 1'}</h1>`;
        break;
      case 'h2':
        htmlToInsert = `<h2>${selectedText || 'Heading 2'}</h2>`;
        break;
      case 'h3':
        htmlToInsert = `<h3>${selectedText || 'Heading 3'}</h3>`;
        break;
      case 'h4':
        htmlToInsert = `<h4>${selectedText || 'Heading 4'}</h4>`;
        break;
      case 'bullet-list':
        htmlToInsert = `<ul>
  <li>${selectedText || 'List item'}</li>
  <li>Second item</li>
  <li>Third item</li>
</ul>`;
        break;
      case 'numbered-list':
        htmlToInsert = `<ol>
  <li>${selectedText || 'First item'}</li>
  <li>Second item</li>
  <li>Third item</li>
</ol>`;
        break;
      case 'link':
        const linkText = selectedText || 'link text';
        const url = prompt('Enter the URL:') || 'https://example.com';
        htmlToInsert = `<a href="${url}" target="_blank">${linkText}</a>`;
        break;
      case 'cta-button':
        const buttonText = selectedText || 'Apply Now';
        const buttonUrl = prompt('Enter the URL for this button:') || 'https://example.com';
        htmlToInsert = `<div style="text-align: center; margin: 24px 0;">
  <a href="${buttonUrl}" target="_blank" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 32px; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4); transition: all 0.3s ease; text-decoration: none; display: inline-block; hover:transform: translateY(-2px);">${buttonText}</a>
</div>`;
        break;
      case 'paragraph':
        htmlToInsert = `<p>${selectedText || 'Your paragraph text here'}</p>`;
        break;
    }
    
    if (htmlToInsert) {
      insertAtCursor(htmlToInsert);
    }
  };

  // Function to apply styles to HTML content for preview/display
  const applyStylesToContent = (htmlContent: string): string => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    // Apply styles to elements
    const h1Elements = tempDiv.querySelectorAll('h1');
    h1Elements.forEach(h1 => {
      h1.style.fontSize = '2rem';
      h1.style.fontWeight = 'bold';
      h1.style.margin = '32px 0 16px';
      h1.style.color = '#1f2937';
    });

    const h2Elements = tempDiv.querySelectorAll('h2');
    h2Elements.forEach(h2 => {
      h2.style.fontSize = '1.75rem';
      h2.style.fontWeight = 'bold';
      h2.style.margin = '24px 0 12px';
      h2.style.color = '#1f2937';
      h2.style.borderBottom = '2px solid #e5e7eb';
      h2.style.paddingBottom = '8px';
    });

    const h3Elements = tempDiv.querySelectorAll('h3');
    h3Elements.forEach(h3 => {
      h3.style.fontSize = '1.5rem';
      h3.style.fontWeight = '600';
      h3.style.margin = '20px 0 10px';
      h3.style.color = '#374151';
    });

    const h4Elements = tempDiv.querySelectorAll('h4');
    h4Elements.forEach(h4 => {
      h4.style.fontSize = '1.25rem';
      h4.style.fontWeight = '600';
      h4.style.margin = '16px 0 8px';
      h4.style.color = '#4b5563';
    });

    const pElements = tempDiv.querySelectorAll('p');
    pElements.forEach(p => {
      p.style.margin = '16px 0';
      p.style.lineHeight = '1.7';
      p.style.color = '#374151';
    });

    const ulElements = tempDiv.querySelectorAll('ul');
    ulElements.forEach(ul => {
      ul.style.margin = '16px 0';
      ul.style.paddingLeft = '24px';
      ul.style.color = '#374151';
    });

    const olElements = tempDiv.querySelectorAll('ol');
    olElements.forEach(ol => {
      ol.style.margin = '16px 0';
      ol.style.paddingLeft = '24px';
      ol.style.color = '#374151';
    });

    const liElements = tempDiv.querySelectorAll('li');
    liElements.forEach(li => {
      li.style.margin = '8px 0';
    });

    const aElements = tempDiv.querySelectorAll('a');
    aElements.forEach(a => {
      // Don't style CTA buttons (they already have inline styles)
      if (!a.style.background) {
        a.style.color = '#2563eb';
        a.style.textDecoration = 'underline';
      }
    });

    const strongElements = tempDiv.querySelectorAll('strong');
    strongElements.forEach(strong => {
      strong.style.fontWeight = '700';
      strong.style.color = '#1f2937';
    });

    const imgElements = tempDiv.querySelectorAll('img');
    imgElements.forEach(img => {
      img.style.maxWidth = '100%';
      img.style.height = 'auto';
      img.style.borderRadius = '8px';
      img.style.margin = '16px 0';
    });

    return tempDiv.innerHTML;
  };

  const validateContent = () => {
    // Count words by stripping HTML tags and counting text content
    const textContent = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const wordCount = textContent.split(' ').filter(word => word.length > 0).length;
    
    if (!title.trim()) {
      toast({
        title: "Title Required",
        description: "Please provide a title for your blog post.",
        variant: "destructive",
      });
      return false;
    }
    
    if (wordCount < 1000) {
      toast({
        title: "Content Too Short",
        description: `Your content has ${wordCount} words. Minimum 1000 words required.`,
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
          applicationLink: applicationLink.trim() || undefined,
          category: category || undefined,
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

  // Count words by stripping HTML tags
  const textContent = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = textContent.split(' ').filter(word => word.length > 0).length;

  if (showPreview) {
    return (
      <div className="space-y-6">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl dark:bg-slate-800/90">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl md:text-2xl text-slate-900 dark:text-white">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Eye className="w-4 h-4" />
              </div>
              HTML Content Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {featuredImage && (
                <img src={featuredImage} alt={title} className="w-full h-64 object-cover rounded-lg" />
              )}
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
              <p className="text-gray-600 dark:text-gray-400">By {author} • {wordCount} words</p>
              
              <div className="p-6 bg-gray-50 dark:bg-slate-700/50 rounded-lg max-h-96 overflow-y-auto border border-gray-200 dark:border-slate-600">
                <div 
                  className="prose prose-sm max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: applyStylesToContent(content) }}
                />
              </div>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Word count: {wordCount} words
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button 
                onClick={() => setShowPreview(false)}
                variant="outline"
                className="flex items-center gap-2 bg-white/90 dark:bg-slate-700/90 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-600"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Edit
              </Button>
              
              <Button 
                onClick={() => publishBlog('draft')}
                variant="outline"
                disabled={isPublishing}
                className="flex items-center gap-2 bg-white/90 dark:bg-slate-700/90 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-600"
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
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl dark:bg-slate-800/90">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-lg md:text-xl text-slate-900 dark:text-white">
            <Edit className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
            Step 2: Blog Setup & HTML Editor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6">
          {/* Blog Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <Label htmlFor="title" className="text-sm md:text-base font-medium text-gray-700 dark:text-gray-300">Blog Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter an engaging title..."
                className="mt-2 h-10 md:h-12 bg-white/90 dark:bg-slate-700/90 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div>
              <Label htmlFor="author" className="text-sm md:text-base font-medium text-gray-700 dark:text-gray-300">Author</Label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Author name..."
                className="mt-2 h-10 md:h-12 bg-white/90 dark:bg-slate-700/90 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div>
              <Label htmlFor="category" className="text-sm md:text-base font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Briefcase className="w-3 h-3 md:w-4 md:h-4" />
                Category *
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="mt-2 h-10 md:h-12 bg-white/90 dark:bg-slate-700/90 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-gray-100">
                  <SelectValue placeholder="Select category..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-Time</SelectItem>
                  <SelectItem value="part-time">Part-Time</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="featuredImage" className="text-sm md:text-base font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <ImageIcon className="w-3 h-3 md:w-4 md:h-4" />
                Featured Image URL *
              </Label>
              <Input
                id="featuredImage"
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                placeholder="https://example.com/featured-image.jpg"
                className="mt-2 h-10 md:h-12 bg-white/90 dark:bg-slate-700/90 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <Label htmlFor="applicationLink" className="text-sm md:text-base font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Link className="w-3 h-3 md:w-4 md:h-4" />
                Application Link
              </Label>
              <Input
                id="applicationLink"
                value={applicationLink}
                onChange={(e) => setApplicationLink(e.target.value)}
                placeholder="https://example.com/apply"
                className="mt-2 h-10 md:h-12 bg-white/90 dark:bg-slate-700/90 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          {/* Featured Image Preview */}
          {featuredImage && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">Featured Image Preview:</p>
              <div className="w-full h-32 bg-gray-100 dark:bg-gray-800 rounded border flex items-center justify-center mt-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">Image URL: {featuredImage.substring(0, 50)}...</p>
              </div>
            </div>
          )}

          {/* HTML Editor */}
          <div>
            <Label htmlFor="content" className="text-sm md:text-base font-medium text-gray-700 dark:text-gray-300">
              Clean HTML Editor ({wordCount} words - Min: 1000) 
              <span className={wordCount < 1000 ? "text-red-500 ml-2" : "text-green-500 ml-2"}>
                {wordCount < 1000 ? `Need ${1000 - wordCount} more words` : "✓ Word count met"}
              </span>
            </Label>
            
            {/* HTML Formatting Toolbar */}
            <div className="flex flex-wrap gap-2 mt-2 mb-2 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg border border-gray-200 dark:border-slate-600">
              {/* Text Formatting */}
              <div className="flex gap-1 pr-2 border-r border-gray-300 dark:border-gray-600">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => insertFormatting('bold')} 
                  title="Bold"
                  type="button"
                  className="bg-white dark:bg-slate-600 border-gray-300 dark:border-slate-500 text-gray-700 dark:text-gray-200"
                >
                  <Bold className="w-3 h-3" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => insertFormatting('italic')} 
                  title="Italic"
                  type="button"
                  className="bg-white dark:bg-slate-600 border-gray-300 dark:border-slate-500 text-gray-700 dark:text-gray-200"
                >
                  <Italic className="w-3 h-3" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => insertFormatting('underline')} 
                  title="Underline"
                  type="button"
                  className="bg-white dark:bg-slate-600 border-gray-300 dark:border-slate-500 text-gray-700 dark:text-gray-200"
                >
                  <Type className="w-3 h-3" />
                </Button>
              </div>

              {/* Headings */}
              <div className="flex gap-1 pr-2 border-r border-gray-300 dark:border-gray-600">
                <Button size="sm" variant="outline" onClick={() => insertFormatting('h1')} title="Heading 1" type="button" className="bg-white dark:bg-slate-600 border-gray-300 dark:border-slate-500 text-gray-700 dark:text-gray-200">
                  H1
                </Button>
                <Button size="sm" variant="outline" onClick={() => insertFormatting('h2')} title="Heading 2" type="button" className="bg-white dark:bg-slate-600 border-gray-300 dark:border-slate-500 text-gray-700 dark:text-gray-200">
                  H2
                </Button>
                <Button size="sm" variant="outline" onClick={() => insertFormatting('h3')} title="Heading 3" type="button" className="bg-white dark:bg-slate-600 border-gray-300 dark:border-slate-500 text-gray-700 dark:text-gray-200">
                  H3
                </Button>
                <Button size="sm" variant="outline" onClick={() => insertFormatting('h4')} title="Heading 4" type="button" className="bg-white dark:bg-slate-600 border-gray-300 dark:border-slate-500 text-gray-700 dark:text-gray-200">
                  H4
                </Button>
              </div>

              {/* Structure */}
              <div className="flex gap-1 pr-2 border-r border-gray-300 dark:border-gray-600">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => insertFormatting('paragraph')} 
                  title="Paragraph"
                  type="button"
                  className="bg-white dark:bg-slate-600 border-gray-300 dark:border-slate-500 text-gray-700 dark:text-gray-200"
                >
                  P
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => insertFormatting('bullet-list')} 
                  title="Bullet List"
                  type="button"
                  className="bg-white dark:bg-slate-600 border-gray-300 dark:border-slate-500 text-gray-700 dark:text-gray-200"
                >
                  <List className="w-3 h-3" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => insertFormatting('numbered-list')} 
                  title="Numbered List"
                  type="button"
                  className="bg-white dark:bg-slate-600 border-gray-300 dark:border-slate-500 text-gray-700 dark:text-gray-200"
                >
                  1.
                </Button>
              </div>

              {/* Links & Media */}
              <div className="flex gap-1 pr-2 border-r border-gray-300 dark:border-gray-600">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => insertFormatting('link')} 
                  title="Insert Link"
                  type="button"
                  className="bg-white dark:bg-slate-600 border-gray-300 dark:border-slate-500 text-gray-700 dark:text-gray-200"
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
                  className="bg-white dark:bg-slate-600 border-gray-300 dark:border-slate-500 text-gray-700 dark:text-gray-200"
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
                  className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 border-blue-200 dark:border-blue-700 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-800/40 dark:hover:to-purple-800/40 text-blue-700 dark:text-blue-300"
                  title="Insert CTA Button (with styles)"
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
              placeholder="Write clean HTML here... The toolbar creates minimal HTML tags. Styles are applied only during preview and publishing!"
              rows={24}
              className="mt-2 font-mono text-sm resize-none bg-white/90 dark:bg-slate-700/90 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-gray-100"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              💡 <strong>Clean HTML Mode:</strong> Write minimal HTML tags without inline styles. 
              Styles are automatically applied during preview and publishing. Only CTA buttons include styles for design purposes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={onBack}
              variant="outline"
              className="flex items-center gap-2 h-10 md:h-12 px-4 md:px-6 bg-white/90 dark:bg-slate-700/90 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-600"
              type="button"
            >
              <ArrowLeft className="w-3 h-3 md:w-4 md:h-4" />
              Back to Content
            </Button>
            
            <Button 
              onClick={() => setShowPreview(true)}
              variant="outline"
              className="flex items-center gap-2 h-10 md:h-12 px-4 md:px-6 bg-white/90 dark:bg-slate-700/90 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-600"
              type="button"
            >
              <Eye className="w-3 h-3 md:w-4 md:h-4" />
              Preview (with styles)
            </Button>
            
            <Button 
              onClick={() => publishBlog('draft')}
              variant="outline"
              disabled={isPublishing}
              className="flex items-center gap-2 h-10 md:h-12 px-4 md:px-6 border-2 bg-white/90 dark:bg-slate-700/90 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-600"
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
