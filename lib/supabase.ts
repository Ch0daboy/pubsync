import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Singleton pattern to prevent multiple client instances
let supabaseClient: ReturnType<typeof createClient<Database>> | null = null
let supabaseAdminClient: ReturnType<typeof createClient<Database>> | null = null

// Client-side singleton (for browser)
export const supabase = (() => {
  // Only create client if we're in the browser and have the required env vars
  if (typeof window !== 'undefined' && supabaseUrl && supabaseAnonKey) {
    if (!supabaseClient) {
      supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      })
    }
    return supabaseClient
  }
  
  // Return a dummy client for SSR if env vars are missing
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables not found, using dummy client')
    return createClient<Database>('https://dummy.supabase.co', 'dummy-key', {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    })
  }
  
  return supabaseClient!
})()

// Server-side client with service role key (singleton)
export const supabaseAdmin = (() => {
  // Only create admin client on server side
  if (typeof window === 'undefined' && supabaseUrl && supabaseServiceRoleKey) {
    if (!supabaseAdminClient) {
      supabaseAdminClient = createClient<Database>(
        supabaseUrl,
        supabaseServiceRoleKey,
        {
          auth: {
            persistSession: false,
            autoRefreshToken: false
          }
        }
      )
    }
    return supabaseAdminClient
  }
  
  // Return dummy client for client-side or missing env vars
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.warn('Supabase admin environment variables not found, using dummy client')
    return createClient<Database>('https://dummy.supabase.co', 'dummy-key', {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    })
  }
  
  return supabaseAdminClient!
})() 