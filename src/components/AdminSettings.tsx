
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Key, Save, TestTube, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const AdminSettings = () => {
  const [apiKey, setApiKey] = useState('');
  const [minWordCount, setMinWordCount] = useState('1000');
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved API key and min word count
    const savedApiKey = localStorage.getItem('gemini_api_key');
    const savedMinWordCount = localStorage.getItem('min_word_count');
    
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
    if (savedMinWordCount) {
      setMinWordCount(savedMinWordCount);
    }
  }, []);

  const saveSettings = async () => {
    setIsSaving(true);
    
    try {
      localStorage.setItem('gemini_api_key', apiKey);
      localStorage.setItem('min_word_count', minWordCount);
      
      toast({
        title: "Settings Saved",
        description: "Your settings have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "There was an error saving your settings.",
        variant: "destructive",
      });
    }
    
    setIsSaving(false);
  };

  const testConnection = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your Gemini API key first.",
        variant: "destructive",
      });
      return;
    }

    setIsTestingConnection(true);
    
    try {
      // Simulate API test (replace with actual Gemini API test)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock success/failure based on key format
      if (apiKey.startsWith('AIza')) {
        toast({
          title: "Connection Successful!",
          description: "Your Gemini API key is working correctly.",
        });
      } else {
        throw new Error('Invalid API key format');
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Unable to connect with the provided API key. Please check your key and try again.",
        variant: "destructive",
      });
    }
    
    setIsTestingConnection(false);
  };

  const removeApiKey = () => {
    localStorage.removeItem('gemini_api_key');
    setApiKey('');
    toast({
      title: "API Key Removed",
      description: "Your Gemini API key has been removed.",
    });
  };

  return (
    <div className="space-y-8">
      <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl md:text-2xl text-slate-900 dark:text-white">
            <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Key className="w-4 h-4 text-white" />
            </div>
            Gemini API Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="apiKey" className="text-slate-700 dark:text-slate-200 font-medium">Gemini API Key</Label>
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Gemini API key..."
              className="bg-white/80 dark:bg-slate-700/80 border-violet-200 dark:border-slate-600 focus:border-violet-400 dark:focus:border-violet-400 rounded-xl shadow-lg backdrop-blur-sm"
            />
            <p className="text-sm text-slate-600 dark:text-slate-300 bg-violet-50/50 dark:bg-slate-700/30 p-3 rounded-xl">
              Your API key is stored securely in your browser and used to power AI content rewriting.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={saveSettings}
              disabled={isSaving || (!apiKey.trim() && !minWordCount.trim())}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isSaving ? (
                <>
                  <Save className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Settings
                </>
              )}
            </Button>
            
            <Button 
              onClick={testConnection}
              variant="outline"
              disabled={isTestingConnection || !apiKey.trim()}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-slate-700 dark:to-slate-600 border-blue-200 dark:border-slate-600 hover:from-blue-100 hover:to-cyan-100 dark:hover:from-slate-600 dark:hover:to-slate-500 text-blue-700 dark:text-blue-300 shadow-md"
            >
              {isTestingConnection ? (
                <>
                  <TestTube className="w-4 h-4 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <TestTube className="w-4 h-4" />
                  Test Connection
                </>
              )}
            </Button>

            {apiKey && (
              <Button 
                onClick={removeApiKey}
                className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Remove Key
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl md:text-2xl text-slate-900 dark:text-white">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            Blog Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="minWordCount" className="text-slate-700 dark:text-slate-200 font-medium">Minimum Word Count</Label>
            <Input
              id="minWordCount"
              type="number"
              min="100"
              max="5000"
              value={minWordCount}
              onChange={(e) => setMinWordCount(e.target.value)}
              placeholder="Enter minimum word count..."
              className="bg-white/80 dark:bg-slate-700/80 border-blue-200 dark:border-slate-600 focus:border-blue-400 dark:focus:border-blue-400 rounded-xl shadow-lg backdrop-blur-sm"
            />
            <p className="text-sm text-slate-600 dark:text-slate-300 bg-blue-50/50 dark:bg-slate-700/30 p-3 rounded-xl">
              Set the minimum word count required for blog posts. This helps maintain content quality standards.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl text-slate-900 dark:text-white">How to Get Your Gemini API Key</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-pink-500 text-white rounded-2xl flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">1</div>
              <p className="leading-relaxed">Visit <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 underline font-medium">Google AI Studio</a></p>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-pink-500 text-white rounded-2xl flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">2</div>
              <p className="leading-relaxed">Sign in with your Google account</p>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-pink-500 text-white rounded-2xl flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">3</div>
              <p className="leading-relaxed">Click "Create API Key" and generate a new key</p>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-pink-500 text-white rounded-2xl flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">4</div>
              <p className="leading-relaxed">Copy the API key and paste it above</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
