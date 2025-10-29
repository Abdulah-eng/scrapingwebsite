import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query) {
    return NextResponse.json({ colonies: [] })
  }

  try {
    const { data, error } = await supabase
      .from('colonies')
      .select(`
        *,
        contacts (*)
      `)
      .or(`name.ilike.%${query}%,location.ilike.%${query}%`)
      .order('name')
      .limit(50)

    if (error) {
      console.error('Search error:', error)
      return NextResponse.json({ error: 'Search failed' }, { status: 500 })
    }

    return NextResponse.json({ colonies: data || [] })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
