
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

function generateExcerpt(content: string): string {
  const plainText = content.replace(/<[^>]*>/g, '').replace(/[#*]/g, '')
  return plainText.substring(0, 150) + (plainText.length > 150 ? '...' : '')
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { action, ...data } = await req.json()

    if (action === 'create') {
      const { title, content, featuredImage, author, status } = data
      
      const slug = generateSlug(title)
      const excerpt = generateExcerpt(content)

      const { data: blog, error } = await supabase
        .from('blogs')
        .insert([{
          title,
          content,
          excerpt,
          featured_image: featuredImage || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&h=300&fit=crop",
          slug,
          author: author || 'Admin',
          status: status || 'draft'
        }])
        .select()
        .single()

      if (error) {
        throw error
      }

      return new Response(
        JSON.stringify({ success: true, blog }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )

    } else if (action === 'update') {
      const { id, title, content, featuredImage, author, status } = data
      
      const updates: any = {}
      if (title) {
        updates.title = title
        updates.slug = generateSlug(title)
      }
      if (content) {
        updates.content = content
        updates.excerpt = generateExcerpt(content)
      }
      if (featuredImage) updates.featured_image = featuredImage
      if (author) updates.author = author
      if (status) updates.status = status

      const { data: blog, error } = await supabase
        .from('blogs')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw error
      }

      return new Response(
        JSON.stringify({ success: true, blog }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )

    } else if (action === 'delete') {
      const { id } = data

      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )

    } else if (action === 'list') {
      const { data: blogs, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      return new Response(
        JSON.stringify({ success: true, blogs }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )

  } catch (error) {
    console.error('Blog operations error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
