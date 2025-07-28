import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { status } = body

    const { data: content, error } = await supabase
      .from('repurposed_content')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(content)
  } catch (error) {
    console.error('Error updating content status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 