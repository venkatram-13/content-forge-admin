
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wand2, Link2, FileText, Sparkles, ArrowRight, Eye, AlertCircle, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ContentInputPageProps {
  onContentRewritten: (rewrittenContent: string, title: string) => void;
  onSkip: () => void;
}

export const ContentInputPage = ({ onContentRewritten, onSkip }: ContentInputPageProps) => {
  const [inputType, setInputType] = useState<'url' | 'text'>('text');
  const [url, setUrl] = useState('');
  const [rawText, setRawText] = useState('');
  const [rewrittenContent, setRewrittenContent] = useState('');
  const [rewrittenTitle, setRewrittenTitle] = useState('');
  const [isRewriting, setIsRewriting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewMode, setPreviewMode] = useState<'preview' | 'html'>('preview');
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

      console.log('Starting AI rewrite with Gemini API for content:', sourceContent.substring(0, 100) + '...');

      const { data, error } = await supabase.functions.invoke('gemini-rewrite', {
        body: { 
          content: sourceContent, 
          inputType,
          systemPrompt: "You are an experienced professional blog writer specializing in job postings and career content. Rewrite the following content into a comprehensive, SEO-optimized blog post for a hiring/job platform. Requirements: 1) Target 800-900 words exactly, 2) Format content in HTML tags (not Markdown), 3) Use proper HTML structure with <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em> tags, 4) MUST include a dedicated section titled 'Candidate Requirements' with specific qualifications, experience levels, and prerequisites, 5) MUST include a detailed 'Required Skills' section listing technical and soft skills, 6) Include sections like job overview, responsibilities, company culture, benefits, and application process, 7) Professional and engaging tone for job seekers, 8) Use semantic HTML structure with clear headings and well-organized content. Ensure the content is rich in value and provides actionable insights for potential candidates."
        }
      });

      console.log('Gemini API response received:', { 
        hasData: !!data, 
        hasError: !!error, 
        success: data?.success,
        hasContent: !!data?.content,
        contentLength: data?.content?.length 
      });

      if (error) {
        console.error('Supabase function error:', error);
        
        // Check if it's a configuration error
        if (error.message?.includes('non-2xx status code')) {
          toast({
            title: "Configuration Error",
            description: "Gemini API key is not configured. Please contact the administrator to set up the GEMINI_API_KEY in Supabase Edge Function Secrets.",
            variant: "destructive",
          });
        } else {
          throw new Error(`API Error: ${error.message || 'Failed to connect to AI service'}`);
        }
        setIsRewriting(false);
        return;
      }
      
      if (!data) {
        console.error('No data received from Gemini API');
        throw new Error('No response received from AI service');
      }

      if (data.error && !data.success) {
        console.error('Gemini API error:', data.error);
        
        // Handle specific API key error
        if (data.error.includes('API key not configured')) {
          toast({
            title: "Configuration Required",
            description: "Gemini API key is not configured. Please contact the administrator to add GEMINI_API_KEY to Supabase Edge Function Secrets.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "AI Enhancement Failed",
            description: data.error || 'AI generation failed',
            variant: "destructive",
          });
        }
        setIsRewriting(false);
        return;
      }

      if (data.success && data.content) {
        const wordCount = data.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
        
        console.log(`Content generated successfully with ${wordCount} words`);
        
        if (wordCount < 800 || wordCount > 1000) {
          toast({
            title: "Content Generated",
            description: `AI generated ${wordCount} words. Target was 800-900 words.`,
            variant: "default",
          });
        } else {
          toast({
            title: "Content Enhanced! ✨",
            description: `Your content has been successfully enhanced by AI (${wordCount} words).`,
          });
        }

        setRewrittenTitle(data.title || 'AI Enhanced Job Posting');
        setRewrittenContent(data.content);
        setShowPreview(true);
      } else {
        console.error('Gemini API returned no content:', data);
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

  const proceedToNextPage = () => {
    if (rewrittenContent && rewrittenTitle) {
      onContentRewritten(rewrittenContent, rewrittenTitle);
    }
  };

  const handleSkip = () => {
    toast({
      title: "Skipped AI Enhancement",
      description: "You can manually fill in the blog content in the next step.",
    });
    onSkip();
  };

  const canProceed = inputType === 'url' ? url.trim() : rawText.trim();

  if (showPreview && rewrittenContent) {
    return (
      <div className="space-y-6">
        <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl md:text-2xl text-slate-900 dark:text-white">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
                <Eye className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              AI-Generated Content Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Label className="text-lg font-semibold text-gray-800 dark:text-gray-200">Generated Title:</Label>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">{rewrittenTitle}</h2>
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
                <div className="p-6 bg-gray-50 dark:bg-slate-700/50 rounded-lg max-h-96 overflow-y-auto border border-gray-200 dark:border-slate-600">
                  <div 
                    className="prose prose-sm max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: rewrittenContent }}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="html" className="mt-4">
                <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg max-h-96 overflow-y-auto border border-gray-200 dark:border-slate-600 font-mono text-sm">
                  <pre className="whitespace-pre-wrap text-gray-800 dark:text-gray-200">{rewrittenContent}</pre>
                </div>
              </TabsContent>
            </Tabs>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Word count: {rewrittenContent.replace(/<[^>]*>/g, '').split(/\s+/).length} words
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button 
                onClick={() => setShowPreview(false)}
                variant="outline"
                className="flex items-center gap-2 bg-white/90 dark:bg-slate-700/90 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-600"
              >
                <RotateCcw className="w-4 h-4" />
                Back to Edit
              </Button>
              
              <Button 
                onClick={proceedToNextPage}
                className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700"
              >
                Continue to Setup
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl md:text-2xl text-slate-900 dark:text-white">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            Step 1: Content Input & AI Enhancement
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Provide content to enhance with AI, or skip to manually create your blog post
          </p>
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
                <Label htmlFor="url" className="text-sm md:text-base font-medium text-gray-700 dark:text-gray-300">Article URL</Label>
                <Input
                  id="url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/job-posting"
                  className="mt-2 h-10 md:h-12 bg-white/90 dark:bg-slate-700/90 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-gray-100"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Provide a URL to a job posting or article that will be enhanced by AI
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="text" className="space-y-4">
              <div>
                <Label htmlFor="rawText" className="text-sm md:text-base font-medium text-gray-700 dark:text-gray-300">Raw Text Content</Label>
                <Textarea
                  id="rawText"
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="Paste your job posting content, bullet points, or job description here..."
                  rows={8}
                  className="mt-2 bg-white/90 dark:bg-slate-700/90 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-gray-100"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Provide job details, requirements, or any content that should be enhanced into a professional blog post
                </p>
              </div>
            </TabsContent>
          </Tabs>

          {!canProceed && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg mb-4">
              <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Provide {inputType === 'url' ? 'a URL' : 'text content'} to enhance with AI, or skip to create manually
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Button 
              onClick={rewriteWithAI} 
              disabled={isRewriting || !canProceed}
              className="flex-1 h-12 md:h-14 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-sm md:text-lg"
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

            <Button 
              onClick={handleSkip}
              variant="outline"
              className="flex-1 h-12 md:h-14 text-sm md:text-lg border-2 bg-white/90 dark:bg-slate-700/90 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-600"
            >
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              Skip & Create Manually
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
