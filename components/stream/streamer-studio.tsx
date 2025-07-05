'use client'

import { useState, useRef, useEffect } from 'react'
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
  Play, 
  Square,
  Users,
  Eye,
  Settings,
  ShoppingBag
} from 'lucide-react'
import { UltraLowLatencyStream } from '@/lib/webrtc'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface StreamerStudioProps {
  streamId: string
  userId: string
}

export function StreamerStudio({ streamId, userId }: StreamerStudioProps) {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<UltraLowLatencyStream | null>(null)
  const supabase = createClient()

  const [isLive, setIsLive] = useState(false)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [viewerCount, setViewerCount] = useState(0)
  const [streamTitle, setStreamTitle] = useState('')
  const [streamCategory, setStreamCategory] = useState('コスメ')
  const [isLoading, setIsLoading] = useState(false)
  const [connectionState, setConnectionState] = useState<string>('new')

  useEffect(() => {
    // リアルタイム視聴者数更新
    const channel = supabase
      .channel(`stream-stats:${streamId}`)
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'streams', filter: `id=eq.${streamId}` },
        (payload) => {
          setViewerCount(payload.new.viewer_count || 0)
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [streamId, supabase])

  const startStream = async () => {
    if (!streamTitle.trim()) {
      alert('配信タイトルを入力してください')
      return
    }

    setIsLoading(true)
    try {
      // ストリーム情報をDBに保存
      await supabase
        .from('streams')
        .upsert({
          id: streamId,
          streamer_id: userId,
          title: streamTitle,
          category: streamCategory,
          is_live: false // 準備段階
        })

      // WebRTC配信開始
      streamRef.current = new UltraLowLatencyStream(supabase, streamId)
      
      const mediaStream = await streamRef.current.startStreaming({
        video: { 
          width: 1280, 
          height: 720, 
          frameRate: 30,
          facingMode: 'user'
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      })

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }

      setIsLive(true)
      
      // 配信ページに移動
      router.push(`/live/${streamId}`)
    } catch (error) {
      console.error('配信開始エラー:', error)
      alert('配信を開始できませんでした')
    } finally {
      setIsLoading(false)
    }
  }

  const stopStream = async () => {
    setIsLoading(true)
    try {
      if (streamRef.current) {
        await streamRef.current.stopStream()
        streamRef.current = null
      }
      
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }

      setIsLive(false)
      setViewerCount(0)
    } catch (error) {
      console.error('配信停止エラー:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleVideo = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      const videoTrack = stream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setIsVideoEnabled(videoTrack.enabled)
      }
    }
  }

  const toggleAudio = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      const audioTrack = stream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setIsAudioEnabled(audioTrack.enabled)
      }
    }
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* メインビデオ */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>配信プレビュー</span>
                <div className="flex items-center space-x-2">
                  {isLive && (
                    <Badge className="bg-red-500">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-1" />
                      LIVE
                    </Badge>
                  )}
                  <div className="flex items-center space-x-1 text-sm">
                    <Eye className="w-4 h-4" />
                    <span>{viewerCount}</span>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                
                {!isLive && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="text-center text-white">
                      <Video className="w-12 h-12 mx-auto mb-2" />
                      <p>配信を開始するとプレビューが表示されます</p>
                    </div>
                  </div>
                )}

                {/* コントロール */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant={isVideoEnabled ? "default" : "destructive"}
                      onClick={toggleVideo}
                      disabled={!isLive}
                    >
                      {isVideoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant={isAudioEnabled ? "default" : "destructive"}
                      onClick={toggleAudio}
                      disabled={!isLive}
                    >
                      {isAudioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                    </Button>
                  </div>
                  
                  <div className="text-white text-sm bg-black/50 px-2 py-1 rounded">
                    接続状態: {connectionState}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 配信コントロール */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-center space-x-4">
                {!isLive ? (
                  <Button
                    size="lg"
                    onClick={startStream}
                    disabled={isLoading}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                        開始中...
                      </div>
                    ) : (
                      <>
                        <Play className="w-5 h-5 mr-2" />
                        配信開始
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    onClick={stopStream}
                    disabled={isLoading}
                    variant="destructive"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                        停止中...
                      </div>
                    ) : (
                      <>
                        <Square className="w-5 h-5 mr-2" />
                        配信停止
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* サイドパネル */}
        <div className="space-y-4">
          {/* 配信設定 */}
          <Card>
            <CardHeader>
              <CardTitle>配信設定</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">配信タイトル</Label>
                <Input
                  id="title"
                  value={streamTitle}
                  onChange={(e) => setStreamTitle(e.target.value)}
                  placeholder="今日の配信タイトル"
                  disabled={isLive}
                />
              </div>
              
              <div>
                <Label htmlFor="category">カテゴリ</Label>
                <select
                  id="category"
                  value={streamCategory}
                  onChange={(e) => setStreamCategory(e.target.value)}
                  disabled={isLive}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="コスメ">コスメ</option>
                  <option value="ファッション">ファッション</option>
                  <option value="グルメ">グルメ</option>
                  <option value="雑貨">雑貨</option>
                  <option value="テック">テック</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* 統計情報 */}
          <Card>
            <CardHeader>
              <CardTitle>配信統計</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">視聴者数</span>
                  </div>
                  <span className="font-bold">{viewerCount}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ShoppingBag className="w-4 h-4" />
                    <span className="text-sm">売上</span>
                  </div>
                  <span className="font-bold">¥0</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 技術情報 */}
          <Card>
            <CardHeader>
              <CardTitle>配信品質</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>解像度:</span>
                  <span>1280x720</span>
                </div>
                <div className="flex justify-between">
                  <span>フレームレート:</span>
                  <span>30fps</span>
                </div>
                <div className="flex justify-between">
                  <span>遅延:</span>
                  <span className="text-green-500">&lt;200ms</span>
                </div>
                <div className="flex justify-between">
                  <span>プロトコル:</span>
                  <span>WebRTC</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}