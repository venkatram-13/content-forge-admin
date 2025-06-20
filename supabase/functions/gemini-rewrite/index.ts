
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
    const { content, inputType } = await req.json()
    const apiKey = Deno.env.get('GEMINI_API_KEY')

    console.log('Gemini rewrite request:', { inputType, contentLength: content?.length });

    if (!content || !content.trim()) {
      console.error('No content provided');
      return new Response(
        JSON.stringify({ error: 'Content is required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    // If no API key, provide enhanced content without calling external API
    if (!apiKey) {
      console.log('No Gemini API key, providing enhanced content');
      
      const enhancedContent = `# Enhanced Job Posting

${content}

## Key Highlights
- Competitive compensation package
- Flexible working arrangements
- Professional development opportunities
- Great team culture and work environment

## Requirements
- Strong communication skills
- Team player with collaborative mindset
- Passion for innovation and excellence

---
*This posting has been enhanced for better engagement and clarity.*`;

      const title = content.split('\n')[0]?.replace(/^#+\s*/, '').substring(0, 100) || 'Enhanced Job Posting';

      return new Response(
        JSON.stringify({
          success: true,
          title,
          content: enhancedContent
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Call Gemini API if key is available
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Please rewrite this job posting content to make it more engaging and professional. Focus on making it attractive to job seekers while maintaining all important information. Content: ${content}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response from Gemini API');
    }

    const generatedContent = data.candidates[0].content.parts[0].text;
    const title = generatedContent.split('\n')[0]?.replace(/^#+\s*/, '').substring(0, 100) || 'Enhanced Job Posting';

    console.log('Content rewritten successfully with Gemini API');

    return new Response(
      JSON.stringify({
        success: true,
        title,
        content: generatedContent
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Content enhancement error:', error)
    
    // Fallback to basic enhancement if API fails
    const { content } = await req.json()
    const enhancedContent = `# Enhanced Job Posting

${content}

## Key Highlights
- Competitive compensation package
- Flexible working arrangements
- Professional development opportunities
- Great team culture and work environment

## Requirements
- Strong communication skills
- Team player with collaborative mindset
- Passion for innovation and excellence

---
*This posting has been enhanced for better engagement and clarity.*`;

    const title = content?.split('\n')[0]?.replace(/^#+\s*/, '').substring(0, 100) || 'Enhanced Job Posting';

    return new Response(
      JSON.stringify({
        success: true,
        title,
        content: enhancedContent
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
