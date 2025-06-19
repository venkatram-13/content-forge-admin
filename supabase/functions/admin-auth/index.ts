
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Simple hash function for demo purposes - in production, use proper bcrypt
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'salt_string');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const hashedInput = await hashPassword(password);
  return hashedInput === hash;
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

    console.log('Admin auth request:', { action, email });

    if (action === 'login') {
      // Get admin user by email
      const { data: adminUser, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email)
        .single()

      if (error || !adminUser) {
        console.log('Admin user not found:', error);
        return new Response(
          JSON.stringify({ error: 'Invalid credentials' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 401 
          }
        )
      }

      // Verify password
      const isValid = await verifyPassword(password, adminUser.password_hash)

      if (!isValid) {
        console.log('Invalid password for user:', email);
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

      console.log('Login successful for:', email);

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
        console.log('Admin already exists:', email);
        return new Response(
          JSON.stringify({ error: 'Admin user already exists' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400 
          }
        )
      }

      // Hash password
      const passwordHash = await hashPassword(password)

      console.log('Creating admin user:', email);

      // Create admin user
      const { data, error } = await supabase
        .from('admin_users')
        .insert([
          { email, password_hash: passwordHash }
        ])
        .select()
        .single()

      if (error) {
        console.error('Failed to create admin user:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to create admin user: ' + error.message }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500 
          }
        )
      }

      console.log('Admin user created successfully:', email);

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
      JSON.stringify({ error: 'Internal server error: ' + error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
