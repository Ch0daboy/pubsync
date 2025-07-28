import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { repurposeContent } from '@/lib/gemini'

export async function GET() {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: content, error } = await supabase
      .from('repurposed_content')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(content)
  } catch (error) {
    console.error('Error fetching repurposed content:', error)
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
    const { 
      originalContent, 
      sourcePlatform, 
      targetPlatform, 
      contentType,
      originalContentTitle 
    } = body

    // Generate repurposed content using Gemini AI
    const startTime = Date.now()
    const repurposedContent = await repurposeContent(
      originalContent,
      sourcePlatform,
      targetPlatform,
      contentType
    )
    const processingTime = Date.now() - startTime

    // Save to database
    const { data: content, error } = await supabase
      .from('repurposed_content')
      .insert({
        user_id: user.id,
        original_content_title: originalContentTitle,
        original_content: originalContent,
        repurposed_content: repurposedContent,
        content_type: contentType,
        status: 'pending'
      })
      .select()
      .single()

    if (error) throw error

    // Log AI generation
    await supabase
      .from('ai_generations')
      .insert({
        user_id: user.id,
        prompt: `Repurpose content from ${sourcePlatform} to ${targetPlatform}`,
        response: repurposedContent,
        processing_time_ms: processingTime,
        success: true
      })

    return NextResponse.json({
      content,
      repurposedContent,
      processingTime
    })
  } catch (error) {
    console.error('Error repurposing content:', error)
    
    // Log failed generation
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        await supabase
          .from('ai_generations')
          .insert({
            user_id: user.id,
            prompt: 'Content repurposing request',
            success: false,
            error_message: error instanceof Error ? error.message : 'Unknown error'
          })
      }
    } catch (logError) {
      console.error('Error logging AI generation failure:', logError)
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 