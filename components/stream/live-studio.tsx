'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Settings, 
  Users, 
  Eye,
  Square,
  Circle,
  Monitor,
  Smartphone
} from 'lucide-react'
import { UltraLowLatencyStream } from '@/lib/webrtc'
import { createClient } from '@/lib/supabase'
import { useAuthStore } from '@/store/auth'

interface StreamStats {
  viewers: number
  duration: string
  quality: string
  status: 'idle' | 'connecting' | 'live' | 'error'
}

interface LiveStudioProps {
  streamId?: string
  onStreamStart?: (streamData: any) => void
  onStreamEnd?: () => void
}

export function LiveStudio({ streamId, onStreamStart, onStreamEnd }: LiveStudioProps) {
  const [isStreaming, setIsStreaming] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [videoEnabled, setVideoEnabled] = useState(true)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [streamTitle, setStreamTitle] = useState('')
  const [streamCategory, setStreamCategory] = useState('general')
  const [stats, setStats] = useState<StreamStats>({
    viewers: 0,
    duration: '00:00',
    quality: 'HD',
    status: 'idle'
  })

  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<UltraLowLatencyStream | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const startTimeRef = useRef<Date | null>(null)

  const { user } = useAuthStore()
  const supabase = createClient()

  useEffect(() => {
    initializeCamera()
    return () => {
      cleanup()
    }
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isStreaming && startTimeRef.current) {
      interval = setInterval(() => {
        const now = new Date()
        const diff = now.getTime() - startTimeRef.current!.getTime()
        const minutes = Math.floor(diff / 60000)
        const seconds = Math.floor((diff % 60000) / 1000)
        setStats(prev => ({
          ...prev,
          duration: `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        }))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isStreaming])

  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1280 }, 
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      })
      
      localStreamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error('カメラアクセスエラー:', error)
      setStats(prev => ({ ...prev, status: 'error' }))
    }
  }

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks()
      videoTracks.forEach(track => {
        track.enabled = !videoEnabled
      })
      setVideoEnabled(!videoEnabled)
    }
  }

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks()
      audioTracks.forEach(track => {
        track.enabled = !audioEnabled
      })
      setAudioEnabled(!audioEnabled)
    }
  }

  const startStream = async () => {
    if (!streamTitle.trim() || !user) {
      alert('配信タイトルとログインが必要です')
      return
    }

    setIsConnecting(true)
    setStats(prev => ({ ...prev, status: 'connecting' }))

    try {
      // Supabaseに配信データを作成
      const { data: streamData, error } = await supabase
        .from('live_streams')
        .insert({
          title: streamTitle,
          host_id: user.id,
          category: streamCategory,
          status: 'live',
          actual_start: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      // WebRTC配信開始
      streamRef.current = new UltraLowLatencyStream(supabase, streamData.id)
      await streamRef.current.startStreaming()

      // 配信状態更新
      setIsStreaming(true)
      setIsConnecting(false)
      startTimeRef.current = new Date()
      setStats(prev => ({ ...prev, status: 'live' }))

      // リアルタイム視聴者数監視
      const channel = supabase.channel(`stream:${streamData.id}`)
      channel.on('presence', { event: 'sync' }, () => {
        const presenceState = channel.presenceState()
        const viewers = Object.keys(presenceState).length
        setStats(prev => ({ ...prev, viewers }))
      })
      channel.subscribe()

      onStreamStart?.(streamData)

    } catch (error) {
      console.error('配信開始エラー:', error)
      setIsConnecting(false)
      setStats(prev => ({ ...prev, status: 'error' }))
      alert('配信開始に失敗しました')
    }
  }

  const endStream = async () => {
    try {
      if (streamRef.current) {
        await streamRef.current.stopStreaming()
      }

      // 配信終了をSupabaseに記録
      if (streamId) {
        await supabase
          .from('live_streams')
          .update({
            status: 'ended',
            actual_end: new Date().toISOString()
          })
          .eq('id', streamId)
      }

      setIsStreaming(false)
      startTimeRef.current = null
      setStats(prev => ({ 
        ...prev, 
        status: 'idle',
        viewers: 0,
        duration: '00:00'
      }))

      onStreamEnd?.()

    } catch (error) {
      console.error('配信終了エラー:', error)
    }
  }

  const cleanup = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop())
    }
    if (streamRef.current) {
      streamRef.current.stopStreaming()
    }
  }

  const getStatusColor = () => {
    switch (stats.status) {
      case 'live': return 'bg-red-500'
      case 'connecting': return 'bg-yellow-500'
      case 'error': return 'bg-red-600'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = () => {
    switch (stats.status) {
      case 'live': return 'ライブ配信中'
      case 'connecting': return '接続中...'
      case 'error': return 'エラー'
      default: return '配信停止中'
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* 配信状態バー */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getStatusColor()} ${stats.status === 'live' ? 'animate-pulse' : ''}`} />
                <span className="font-medium">{getStatusText()}</span>
              </div>
              {stats.status === 'live' && (
                <>
                  <Badge variant="secondary" className="flex items-center space-x-1">
                    <Eye className="w-3 h-3" />
                    <span>{stats.viewers} 視聴者</span>
                  </Badge>
                  <Badge variant="outline">
                    {stats.duration}
                  </Badge>
                  <Badge variant="outline">
                    {stats.quality}
                  </Badge>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* メインプレビュー */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>配信プレビュー</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="w-full h-full object-cover"
                />
                {!videoEnabled && (
                  <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                    <VideoOff className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                
                {/* 配信中オーバーレイ */}
                {stats.status === 'live' && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-red-500 text-white">
                      <Circle className="w-2 h-2 mr-1 fill-current" />
                      LIVE
                    </Badge>
                  </div>
                )}
              </div>

              {/* コントロールボタン */}
              <div className="flex items-center justify-center space-x-4 mt-4">
                <Button
                  variant={videoEnabled ? "default" : "destructive"}
                  size="sm"
                  onClick={toggleVideo}
                  disabled={isConnecting}
                >
                  {videoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                </Button>
                
                <Button
                  variant={audioEnabled ? "default" : "destructive"}
                  size="sm"
                  onClick={toggleAudio}
                  disabled={isConnecting}
                >
                  {audioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </Button>

                <Button variant="outline" size="sm" disabled={isConnecting}>
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 配信設定 */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>配信設定</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="streamTitle">配信タイトル</Label>
                <Input
                  id="streamTitle"
                  value={streamTitle}
                  onChange={(e) => setStreamTitle(e.target.value)}
                  placeholder="今日の配信タイトル"
                  disabled={isStreaming}
                />
              </div>

              <div>
                <Label htmlFor="category">カテゴリー</Label>
                <select
                  id="category"
                  value={streamCategory}
                  onChange={(e) => setStreamCategory(e.target.value)}
                  disabled={isStreaming}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="general">一般</option>
                  <option value="fashion">ファッション</option>
                  <option value="beauty">ビューティー</option>
                  <option value="lifestyle">ライフスタイル</option>
                  <option value="tech">テック</option>
                </select>
              </div>

              {!isStreaming ? (
                <Button 
                  onClick={startStream}
                  disabled={isConnecting || !streamTitle.trim()}
                  className="w-full"
                  size="lg"
                >
                  {isConnecting ? '接続中...' : '配信開始'}
                </Button>
              ) : (
                <Button 
                  onClick={endStream}
                  variant="destructive"
                  className="w-full"
                  size="lg"
                >
                  <Square className="w-4 h-4 mr-2" />
                  配信終了
                </Button>
              )}
            </CardContent>
          </Card>

          {/* 配信統計 */}
          {stats.status === 'live' && (
            <Card>
              <CardHeader>
                <CardTitle>配信統計</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">視聴者数</span>
                  <span className="font-medium">{stats.viewers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">配信時間</span>
                  <span className="font-medium">{stats.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">画質</span>
                  <span className="font-medium">{stats.quality}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}