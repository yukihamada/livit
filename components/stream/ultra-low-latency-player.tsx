'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Volume2, 
  VolumeX, 
  Maximize, 
  Play,
  Pause,
  Settings,
  Wifi,
  WifiOff
} from 'lucide-react'
import { UltraLowLatencyStream } from '@/lib/webrtc'
import { createClient } from '@/lib/supabase'

interface UltraLowLatencyPlayerProps {
  streamId: string
  className?: string
}

export function UltraLowLatencyPlayer({ streamId, className = "" }: UltraLowLatencyPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<UltraLowLatencyStream | null>(null)
  const supabase = createClient()

  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionState, setConnectionState] = useState<'connecting' | 'connected' | 'disconnected' | 'failed'>('disconnected')
  const [latency, setLatency] = useState<number>(0)
  const [quality, setQuality] = useState<'auto' | '720p' | '480p' | '360p'>('auto')
  const [streamInfo, setStreamInfo] = useState<any>(null)

  useEffect(() => {
    // ストリーム情報取得
    const getStreamInfo = async () => {
      const { data } = await supabase
        .from('streams')
        .select('*')
        .eq('id', streamId)
        .single()
      
      setStreamInfo(data)
      
      if (data?.is_live) {
        await connectToStream()
      }
    }

    getStreamInfo()

    // ストリーム状態のリアルタイム監視
    const channel = supabase
      .channel(`stream-status:${streamId}`)
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'streams', filter: `id=eq.${streamId}` },
        (payload) => {
          setStreamInfo(payload.new)
          if (payload.new.is_live && !isPlaying) {
            connectToStream()
          } else if (!payload.new.is_live && isPlaying) {
            disconnectFromStream()
          }
        }
      )
      .subscribe()

    return () => {
      disconnectFromStream()
      channel.unsubscribe()
    }
  }, [streamId])

  const connectToStream = async () => {
    if (streamRef.current || isConnecting) return

    setIsConnecting(true)
    setConnectionState('connecting')

    try {
      streamRef.current = new UltraLowLatencyStream(supabase, streamId)
      
      // 遅延測定開始
      const startTime = Date.now()
      
      streamRef.current.onRemoteStream = (stream: MediaStream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play()
          setIsPlaying(true)
          setConnectionState('connected')
          
          // 遅延計算（簡易版）
          const endTime = Date.now()
          setLatency(endTime - startTime)
        }
      }

      streamRef.current.onConnectionStateChange = (state: RTCPeerConnectionState) => {
        switch (state) {
          case 'connected':
            setConnectionState('connected')
            break
          case 'disconnected':
            setConnectionState('disconnected')
            break
          case 'failed':
            setConnectionState('failed')
            break
        }
      }

      await streamRef.current.startViewing()
    } catch (error) {
      console.error('配信接続エラー:', error)
      setConnectionState('failed')
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectFromStream = async () => {
    if (streamRef.current) {
      await streamRef.current.stopStream()
      streamRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }

    setIsPlaying(false)
    setConnectionState('disconnected')
  }

  const togglePlay = async () => {
    if (!videoRef.current) return

    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
    } else {
      if (!streamRef.current) {
        await connectToStream()
      } else {
        await videoRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setIsMuted(videoRef.current.muted)
    }
  }

  const toggleFullscreen = () => {
    if (!videoRef.current) return

    if (!isFullscreen) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }

  // フルスクリーン状態の監視
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  const getConnectionStatusIcon = () => {
    switch (connectionState) {
      case 'connected':
        return <Wifi className="w-4 h-4 text-green-500" />
      case 'connecting':
        return <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      default:
        return <WifiOff className="w-4 h-4 text-red-500" />
    }
  }

  const getConnectionStatusText = () => {
    switch (connectionState) {
      case 'connected':
        return `遅延: ${latency}ms`
      case 'connecting':
        return '接続中...'
      case 'failed':
        return '接続失敗'
      default:
        return '未接続'
    }
  }

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-0">
        <div className="relative aspect-video bg-black">
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            playsInline
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />

          {/* オーバーレイ */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

          {/* ライブインジケーター */}
          {streamInfo?.is_live && (
            <div className="absolute top-4 left-4 flex items-center space-x-2">
              <Badge className="bg-red-500">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-1" />
                LIVE
              </Badge>
              <div className="flex items-center space-x-1 bg-black/50 text-white px-2 py-1 rounded text-xs">
                {getConnectionStatusIcon()}
                <span>{getConnectionStatusText()}</span>
              </div>
            </div>
          )}

          {/* 品質インジケーター */}
          <div className="absolute top-4 right-4">
            <div className="bg-black/50 text-white px-2 py-1 rounded text-xs">
              WebRTC • {quality}
            </div>
          </div>

          {/* 中央の再生ボタン */}
          {(!isPlaying || connectionState === 'disconnected') && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                size="lg"
                onClick={togglePlay}
                disabled={isConnecting}
                className="w-20 h-20 rounded-full bg-white/20 backdrop-blur hover:bg-white/30"
              >
                {isConnecting ? (
                  <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Play className="w-8 h-8 text-white fill-white" />
                )}
              </Button>
            </div>
          )}

          {/* コントロールバー */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={togglePlay}
                  className="text-white hover:bg-white/20"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={toggleMute}
                  className="text-white hover:bg-white/20"
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </Button>

                {connectionState === 'connected' && (
                  <div className="text-white text-xs">
                    超低遅延配信
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                >
                  <Settings className="w-4 h-4" />
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={toggleFullscreen}
                  className="text-white hover:bg-white/20"
                >
                  <Maximize className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* 接続失敗時の表示 */}
          {connectionState === 'failed' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="text-center text-white">
                <WifiOff className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">接続に失敗しました</h3>
                <p className="text-sm mb-4">配信が終了したか、接続に問題があります</p>
                <Button onClick={connectToStream}>
                  再接続
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}