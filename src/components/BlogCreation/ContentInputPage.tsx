
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wand2, Link2, FileText, Sparkles, ArrowRight, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ContentInputPageProps {
  onContentRewritten: (rewrittenContent: string, title: string) => void;
}

export const ContentInputPage = ({ onContentRewritten }: ContentInputPageProps) => {
  const [inputType, setInputType] = useState<'url' | 'text'>('text');
  const [url, setUrl] = useState('');
  const [rawText, setRawText] = useState('');
  const [rewrittenContent, setRewrittenContent] = useState('');
  const [rewrittenTitle, setRewrittenTitle] = useState('');
  const [isRewriting, setIsRewriting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
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
        body: { 
          content: sourceContent, 
          inputType,
          systemPrompt: "You are an experienced professional blog writer. Rewrite the following content into a high-quality, SEO-optimized blog post for a hiring/job platform. Ensure the post has at least 1000 words, is rich in value, includes subheadings, lists, and can incorporate visual elements like buttons and images. The tone should be clear, professional, and helpful to job seekers."
        }
      });

      console.log('Gemini rewrite response:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
      }
      
      if (data?.error && !data?.success) {
        console.error('Gemini API error:', data.error);
        throw new Error(data.error);
      }

      if (data?.success && data?.content) {
        const wordCount = data.content.split(/\s+/).length;
        
        if (wordCount < 1000) {
          toast({
            title: "Content Too Short",
            description: `Generated content has ${wordCount} words. Minimum 1000 words required. Please try with more detailed source content.`,
            variant: "destructive",
          });
          setIsRewriting(false);
          return;
        }

        setRewrittenTitle(data.title || 'Enhanced Content');
        setRewrittenContent(data.content);
        setShowPreview(true);
        
        toast({
          title: "Content Enhanced! ✨",
          description: `Your content has been successfully enhanced by AI (${wordCount} words).`,
        });
      } else {
        throw new Error('Failed to enhance content');
      }
    } catch (error) {
      console.error('AI rewrite error:', error);
      toast({
        title: "Enhancement Failed",
        description: "Unable to enhance content. Please try again or contact support.",
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

  if (showPreview && rewrittenContent) {
    return (
      <div className="space-y-6">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl md:text-2xl">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
                <Eye className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              Content Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Label className="text-lg font-semibold">Generated Title:</Label>
              <h2 className="text-2xl font-bold text-gray-900 mt-2">{rewrittenTitle}</h2>
            </div>
            
            <div className="mb-6">
              <Label className="text-lg font-semibold">Content Preview:</Label>
              <div className="mt-2 p-4 bg-gray-50 rounded-lg max-h-96 overflow-y-auto">
                <div className="prose prose-sm max-w-none">
                  <div dangerouslySetInnerHTML={{ 
                    __html: rewrittenContent.split('\n').map(line => 
                      line.trim() ? `<p>${line}</p>` : ''
                    ).join('') 
                  }} />
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Word count: {rewrittenContent.split(/\s+/).length} words
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => setShowPreview(false)}
                variant="outline"
                className="flex items-center gap-2"
              >
                ← Back to Edit
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
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl md:text-2xl">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            Step 1: Content Input & AI Enhancement
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
            </TabsContent>
            
            <TabsContent value="text" className="space-y-4">
              <div>
                <Label htmlFor="rawText" className="text-sm md:text-base font-medium">Raw Text Content</Label>
                <Textarea
                  id="rawText"
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="Paste your job posting or article content here..."
                  rows={8}
                  className="mt-2"
                />
              </div>
            </TabsContent>
          </Tabs>

          <Button 
            onClick={rewriteWithAI} 
            disabled={isRewriting || !(inputType === 'url' ? url.trim() : rawText.trim())}
            className="w-full h-12 md:h-14 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-sm md:text-lg mt-6"
          >
            {isRewriting ? (
              <>
                <Wand2 className="w-4 h-4 md:w-5 md:h-5 mr-2 animate-spin" />
                AI is Enhancing (Min 1000 words)...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                ✨ Enhance with AI (1000+ words)
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
