
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, inputType, systemPrompt } = await req.json()
    const apiKey = Deno.env.get('GEMINI_API_KEY')

    console.log('Gemini rewrite request:', { 
      inputType, 
      contentLength: content?.length, 
      hasSystemPrompt: !!systemPrompt,
      hasApiKey: !!apiKey 
    });

    if (!content || !content.trim()) {
      console.error('No content provided');
      return new Response(
        JSON.stringify({ error: 'Content is required', success: false }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    const defaultSystemPrompt = systemPrompt || "Please rewrite this job posting content to make it more engaging and professional. Focus on making it attractive to job seekers while maintaining all important information. Write at least 1000 words with proper formatting.";

    // If no API key, return error instead of fallback content
    if (!apiKey) {
      console.error('No Gemini API key configured');
      return new Response(
        JSON.stringify({ 
          error: 'Gemini API key not configured. Please contact administrator.', 
          success: false 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      )
    }

    console.log('Calling Gemini API with content length:', content.length);

    // Call Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${defaultSystemPrompt}

Content to rewrite: ${content}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 4096,
        }
      })
    });

    console.log('Gemini API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Gemini API response structure:', { 
      hasCandidates: !!data.candidates, 
      candidatesLength: data.candidates?.length 
    });
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.error('Invalid Gemini API response structure:', data);
      throw new Error('Invalid response from Gemini API - no content generated');
    }

    const generatedContent = data.candidates[0].content.parts[0].text;
    
    if (!generatedContent || generatedContent.trim().length < 100) {
      console.error('Generated content too short:', generatedContent?.length);
      throw new Error('Generated content is too short or empty');
    }

    // Extract title from the first line or heading
    const lines = generatedContent.split('\n').filter(line => line.trim());
    let title = 'AI Enhanced Job Posting';
    
    for (const line of lines) {
      const cleanLine = line.replace(/^#+\s*/, '').trim();
      if (cleanLine && cleanLine.length > 10 && cleanLine.length < 100) {
        title = cleanLine;
        break;
      }
    }

    const wordCount = generatedContent.split(/\s+/).length;
    console.log('Content generated successfully:', { titleLength: title.length, wordCount });

    return new Response(
      JSON.stringify({
        success: true,
        title,
        content: generatedContent,
        wordCount
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Content enhancement error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Content enhancement failed',
        success: false 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
