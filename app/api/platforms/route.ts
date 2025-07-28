import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
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
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, url, platform_type } = body

    // Validate required fields
    if (!name || !platform_type) {
      return NextResponse.json({ error: 'Name and platform type are required' }, { status: 400 })
    }

    const { data: platform, error } = await supabase
      .from('platforms')
      .insert({
        user_id: user.id,
        name,
        url: url || null,
        platform_type,
        status: 'pending',
        content_count: 0,
        gap_count: 0
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    return NextResponse.json(platform)
  } catch (error) {
    console.error('Error creating platform:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 