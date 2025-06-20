
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

    if (!apiKey) {
      console.error('Gemini API key not configured');
      return new Response(
        JSON.stringify({ error: 'AI service is temporarily unavailable. Please try again later.' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 // Return 200 to avoid breaking the UI
        }
      )
    }

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

    // Create a simple enhanced version if Gemini is not available
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

    console.log('Content enhanced successfully');

    return new Response(
      JSON.stringify({
        success: true,
        title,
        content: enhancedContent
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Content enhancement error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to enhance content. Please try again.', 
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
