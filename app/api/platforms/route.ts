import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { Database } from '@/types/database'

export async function GET() {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: platforms, error } = await supabase
      .from('platforms')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(platforms)
  } catch (error) {
    console.error('Error fetching platforms:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, url, platform_type, primary_color } = body

    const { data: platform, error } = await supabase
      .from('platforms')
      .insert({
        user_id: user.id,
        name,
        url,
        platform_type,
        primary_color,
        status: 'pending'
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(platform)
  } catch (error) {
    console.error('Error creating platform:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 