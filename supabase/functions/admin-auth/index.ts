
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts"

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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { action, email, password } = await req.json()

    if (action === 'login') {
      // Get admin user by email
      const { data: adminUser, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email)
        .single()

      if (error || !adminUser) {
        return new Response(
          JSON.stringify({ error: 'Invalid credentials' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 401 
          }
        )
      }

      // Verify password
      const isValid = await bcrypt.compare(password, adminUser.password_hash)

      if (!isValid) {
        return new Response(
          JSON.stringify({ error: 'Invalid credentials' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 401 
          }
        )
      }

      // Generate a simple JWT-like token (in production, use proper JWT)
      const token = btoa(JSON.stringify({ 
        id: adminUser.id, 
        email: adminUser.email, 
        exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
      }))

      return new Response(
        JSON.stringify({ 
          success: true, 
          token,
          user: { id: adminUser.id, email: adminUser.email }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )

    } else if (action === 'register') {
      // Check if admin already exists
      const { data: existingAdmin } = await supabase
        .from('admin_users')
        .select('id')
        .eq('email', email)
        .single()

      if (existingAdmin) {
        return new Response(
          JSON.stringify({ error: 'Admin user already exists' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400 
          }
        )
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password)

      // Create admin user
      const { data, error } = await supabase
        .from('admin_users')
        .insert([
          { email, password_hash: passwordHash }
        ])
        .select()
        .single()

      if (error) {
        return new Response(
          JSON.stringify({ error: 'Failed to create admin user' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500 
          }
        )
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Admin user created successfully',
          user: { id: data.id, email: data.email }
        }),
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
    console.error('Admin auth error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
