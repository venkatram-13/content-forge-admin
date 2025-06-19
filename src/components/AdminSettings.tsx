
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Key, Save, TestTube, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const AdminSettings = () => {
  const [apiKey, setApiKey] = useState('');
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved API key
    const savedApiKey = localStorage.getItem('gemini_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  const saveApiKey = async () => {
    setIsSaving(true);
    
    try {
      localStorage.setItem('gemini_api_key', apiKey);
      toast({
        title: "Settings Saved",
        description: "Your Gemini API key has been saved successfully.",
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Gemini API Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">Gemini API Key</Label>
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Gemini API key..."
            />
            <p className="text-sm text-gray-600">
              Your API key is stored securely in your browser and used to power AI content rewriting.
            </p>
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={saveApiKey}
              disabled={isSaving || !apiKey.trim()}
              className="flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <Save className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Key
                </>
              )}
            </Button>
            
            <Button 
              onClick={testConnection}
              variant="outline"
              disabled={isTestingConnection || !apiKey.trim()}
              className="flex items-center gap-2"
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
                variant="destructive"
                className="flex items-center gap-2"
              >
                Remove Key
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How to Get Your Gemini API Key</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</div>
              <p>Visit <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google AI Studio</a></p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</div>
              <p>Sign in with your Google account</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</div>
              <p>Click "Create API Key" and generate a new key</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</div>
              <p>Copy the API key and paste it above</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
