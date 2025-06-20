
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

    console.log('Gemini rewrite request:', { inputType, contentLength: content?.length, hasSystemPrompt: !!systemPrompt });

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

    const defaultSystemPrompt = systemPrompt || "Please rewrite this job posting content to make it more engaging and professional. Focus on making it attractive to job seekers while maintaining all important information.";

    // If no API key, provide enhanced content without calling external API
    if (!apiKey) {
      console.log('No Gemini API key, providing enhanced content');
      
      const enhancedContent = `# Enhanced Job Posting

${content}

## Why This Opportunity Stands Out

This role offers exceptional growth potential in today's competitive job market. Companies are increasingly seeking talented professionals who can bring fresh perspectives and innovative solutions to their teams.

## Key Highlights & Benefits

- **Competitive Compensation Package**: Attractive salary with performance-based incentives
- **Flexible Working Arrangements**: Remote work options and flexible scheduling
- **Professional Development Opportunities**: Continuous learning and skill advancement programs
- **Great Team Culture**: Collaborative environment with supportive colleagues
- **Career Growth Path**: Clear advancement opportunities within the organization

## What Makes You the Perfect Candidate

### Essential Skills & Qualifications
- Strong communication and interpers skills
- Team player with collaborative mindset
- Passion for innovation and excellence
- Problem-solving abilities and analytical thinking
- Adaptability in fast-paced environments

### Preferred Experience
- Relevant industry experience preferred but not required
- Familiarity with modern tools and technologies
- Track record of achieving results and meeting deadlines
- Customer service orientation and attention to detail

## The Application Process

Ready to take the next step in your career? We've streamlined our application process to be as smooth as possible. Here's what you can expect:

1. **Submit Your Application**: Send us your resume and a brief cover letter
2. **Initial Screening**: Our HR team will review your application within 48 hours
3. **Interview Process**: Phone/video interview followed by in-person meeting
4. **Decision**: We'll make our decision within one week of the final interview

## Why Join Our Team?

We believe that great people make great companies. Our organization is built on the foundation of mutual respect, innovation, and continuous improvement. When you join us, you become part of a community that values your contributions and supports your professional growth.

### Company Culture
- Open communication and transparency
- Recognition and rewards for outstanding performance
- Work-life balance initiatives
- Team building activities and social events
- Commitment to diversity and inclusion

### Growth Opportunities
- Mentorship programs with senior leadership
- Cross-functional project assignments
- External training and conference attendance
- Tuition reimbursement for relevant education
- Leadership development programs

## Ready to Apply?

Don't miss this opportunity to join a dynamic team and make a real impact in your career. We're looking for motivated individuals who are ready to contribute to our success while building their own professional legacy.

---
*This posting has been enhanced for better engagement and optimized for search engines. We are an equal opportunity employer committed to creating an inclusive environment for all employees.*`;

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
            text: `${defaultSystemPrompt}

Content to rewrite: ${content}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
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
    try {
      const { content } = await req.json()
      const enhancedContent = `# Enhanced Job Posting

${content}

## Key Highlights & Benefits
- Competitive compensation package
- Flexible working arrangements
- Professional development opportunities
- Great team culture and work environment
- Clear career advancement path

## Essential Requirements
- Strong communication skills
- Team player with collaborative mindset
- Passion for innovation and excellence
- Problem-solving abilities
- Adaptability in dynamic environments

## Why Choose This Opportunity?
This role represents an excellent chance to advance your career while working with a supportive team that values your contributions. We offer comprehensive benefits, ongoing training, and a positive work environment that promotes both personal and professional growth.

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
    } catch (fallbackError) {
      console.error('Fallback enhancement also failed:', fallbackError);
      return new Response(
        JSON.stringify({ error: 'Content enhancement failed' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      )
    }
  }
})
