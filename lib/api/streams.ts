import { createClient } from '@/lib/supabase'
import type { Stream } from '@/types/common'

export async function getLiveStreams() {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('live_streams')
    .select(`
      *,
      host:profiles!host_id(
        id,
        username,
        display_name,
        avatar_url,
        is_streamer,
        follower_count
      ),
      stream_products(
        product:products(
          id,
          name,
          price,
          image_urls
        )
      )
    `)
    .in('status', ['live', 'scheduled'])
    .order('viewer_count', { ascending: false })

  if (error) {
    console.error('Error fetching streams:', error)
    return []
  }

  return data.map(stream => ({
    id: stream.id,
    title: stream.title,
    description: stream.description || '',
    streamerId: stream.host_id,
    streamerName: stream.host?.display_name || stream.host?.username || '',
    streamerAvatar: stream.host?.avatar_url || '',
    thumbnailUrl: stream.thumbnail_url || '',
    isLive: stream.status === 'live',
    viewerCount: stream.viewer_count || 0,
    category: stream.category || '',
    startTime: stream.actual_start || stream.scheduled_start || new Date().toISOString(),
    tags: [],
    products: stream.stream_products?.map((sp: any) => sp.product) || []
  })) as Stream[]
}

export async function getStreamById(id: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('live_streams')
    .select(`
      *,
      host:profiles!host_id(
        id,
        username,
        display_name,
        avatar_url,
        bio,
        is_streamer,
        follower_count
      ),
      stream_products(
        *,
        product:products(
          *
        )
      )
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching stream:', error)
    return null
  }

  return {
    id: data.id,
    title: data.title,
    description: data.description || '',
    streamerId: data.host_id,
    streamerName: data.host?.display_name || data.host?.username || '',
    streamerAvatar: data.host?.avatar_url || '',
    thumbnailUrl: data.thumbnail_url || '',
    isLive: data.status === 'live',
    viewerCount: data.viewer_count || 0,
    category: data.category || '',
    startTime: data.actual_start || data.scheduled_start || new Date().toISOString(),
    tags: [],
    host: data.host,
    products: data.stream_products?.map((sp: any) => ({
      ...sp.product,
      specialPrice: sp.special_price,
      soldCount: sp.sold_count
    })) || []
  }
}

export async function createStream(streamData: {
  title: string
  description?: string
  category: string
  scheduled_start?: Date
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('認証が必要です')
  }

  const { data, error } = await supabase
    .from('live_streams')
    .insert({
      host_id: user.id,
      title: streamData.title,
      description: streamData.description,
      category: streamData.category,
      scheduled_start: streamData.scheduled_start?.toISOString(),
      status: 'scheduled',
      stream_key: crypto.randomUUID()
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating stream:', error)
    throw error
  }

  return data
}

export async function updateStreamStatus(streamId: string, status: 'live' | 'ended') {
  const supabase = createClient()
  
  const updateData: any = { status }
  
  if (status === 'live') {
    updateData.actual_start = new Date().toISOString()
  } else if (status === 'ended') {
    updateData.actual_end = new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('live_streams')
    .update(updateData)
    .eq('id', streamId)
    .select()
    .single()

  if (error) {
    console.error('Error updating stream:', error)
    throw error
  }

  return data
}

export async function incrementViewerCount(streamId: string) {
  const supabase = createClient()
  
  const { data: stream } = await supabase
    .from('live_streams')
    .select('viewer_count, peak_viewers, total_viewers')
    .eq('id', streamId)
    .single()

  if (stream) {
    const newViewerCount = (stream.viewer_count || 0) + 1
    const newPeakViewers = Math.max(newViewerCount, stream.peak_viewers || 0)
    const newTotalViewers = (stream.total_viewers || 0) + 1

    await supabase
      .from('live_streams')
      .update({
        viewer_count: newViewerCount,
        peak_viewers: newPeakViewers,
        total_viewers: newTotalViewers
      })
      .eq('id', streamId)
  }
}

export async function decrementViewerCount(streamId: string) {
  const supabase = createClient()
  
  const { data: stream } = await supabase
    .from('live_streams')
    .select('viewer_count')
    .eq('id', streamId)
    .single()

  if (stream && stream.viewer_count > 0) {
    await supabase
      .from('live_streams')
      .update({
        viewer_count: stream.viewer_count - 1
      })
      .eq('id', streamId)
  }
}