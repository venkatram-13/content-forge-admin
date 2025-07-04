
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

    const defaultSystemPrompt = systemPrompt || "You are an experienced professional blog writer specializing in job postings and career content. Rewrite the following content into a comprehensive, SEO-optimized blog post for a hiring/job platform. Requirements: 1) Target 800-900 words exactly, 2) Format content in HTML tags (not Markdown), 3) Use proper HTML structure with <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em> tags, 4) MUST include a dedicated section titled 'Candidate Requirements' with specific qualifications, experience levels, and prerequisites, 5) MUST include a detailed 'Required Skills' section listing technical and soft skills, 6) Include sections like job overview, responsibilities, company culture, benefits, and application process, 7) Professional and engaging tone for job seekers, 8) Use semantic HTML structure with clear headings and well-organized content. Ensure the content is rich in value and provides actionable insights for potential candidates.";

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
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
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

    // Extract title from the first heading or line
    const titleMatch = generatedContent.match(/<h1[^>]*>(.*?)<\/h1>|<h2[^>]*>(.*?)<\/h2>/i);
    let title = 'AI Enhanced Job Posting';
    
    if (titleMatch) {
      title = (titleMatch[1] || titleMatch[2]).replace(/<[^>]*>/g, '').trim();
    } else {
      // Fallback: try to extract from first line
      const lines = generatedContent.split('\n').filter(line => line.trim());
      for (const line of lines) {
        const cleanLine = line.replace(/<[^>]*>/g, '').trim();
        if (cleanLine && cleanLine.length > 10 && cleanLine.length < 100) {
          title = cleanLine;
          break;
        }
      }
    }

    const wordCount = generatedContent.replace(/<[^>]*>/g, '').split(/\s+/).length;
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
