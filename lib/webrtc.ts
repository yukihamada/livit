// WebRTC 超低遅延配信クラス
export class UltraLowLatencyStream {
  private peerConnection: RTCPeerConnection | null = null
  private localStream: MediaStream | null = null
  private channel: any = null
  private isStreamer: boolean = false
  private viewers: Set<string> = new Set()
  private connectionState: RTCPeerConnectionState = 'new'

  constructor(private supabase: any, private streamId: string) {}

  // 配信者側: 配信開始
  async startStreaming(constraints: MediaStreamConstraints = { 
    video: { width: 1280, height: 720, frameRate: 30 }, 
    audio: true 
  }) {
    try {
      this.isStreamer = true
      
      // メディアストリーム取得
      this.localStream = await navigator.mediaDevices.getUserMedia(constraints)
      
      // Supabase Realtimeチャンネル作成
      this.channel = this.supabase.channel(`stream:${this.streamId}`, {
        config: { presence: { key: 'streaming' } }
      })

      // WebRTC設定（低遅延優先）
      this.peerConnection = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ],
        bundlePolicy: 'max-bundle',
        rtcpMuxPolicy: 'require'
      })

      // ローカルストリームを追加
      this.localStream.getTracks().forEach(track => {
        this.peerConnection?.addTrack(track, this.localStream!)
      })

      // ICE候補の処理
      this.peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          this.channel.send({
            type: 'broadcast',
            event: 'ice-candidate',
            payload: { candidate: event.candidate }
          })
        }
      }

      // 視聴者からのオファー受信
      this.channel.on('broadcast', { event: 'viewer-offer' }, async ({ payload }: { payload: any }) => {
        await this.handleViewerOffer(payload)
      })

      // ICE候補受信
      this.channel.on('broadcast', { event: 'viewer-ice' }, async ({ payload }: { payload: any }) => {
        if (this.peerConnection) {
          await this.peerConnection.addIceCandidate(payload.candidate)
        }
      })

      // 接続状態監視
      this.peerConnection.onconnectionstatechange = () => {
        this.connectionState = this.peerConnection?.connectionState || 'new'
        console.log('Connection state:', this.connectionState)
      }

      await this.channel.subscribe()

      // プレゼンス開始（配信者として）
      await this.channel.track({ 
        user_id: 'streamer',
        role: 'broadcaster',
        stream_id: this.streamId,
        started_at: new Date().toISOString()
      })

      console.log('✅ 配信開始完了')
      return this.localStream

    } catch (error) {
      console.error('❌ 配信開始エラー:', error)
      await this.cleanup()
      throw error
    }
  }

  // 配信停止
  async stopStreaming() {
    try {
      console.log('🛑 配信停止中...')

      // チャンネル終了
      if (this.channel) {
        await this.channel.untrack()
        await this.channel.unsubscribe()
      }

      await this.cleanup()

      console.log('✅ 配信停止完了')
    } catch (error) {
      console.error('❌ 配信停止エラー:', error)
      throw error
    }
  }

  // リソースクリーンアップ
  private async cleanup() {
    // ローカルストリーム停止
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        track.stop()
      })
      this.localStream = null
    }

    // WebRTC接続終了
    if (this.peerConnection) {
      this.peerConnection.close()
      this.peerConnection = null
    }

    this.viewers.clear()
    this.connectionState = 'new'
  }

  // 視聴者数取得
  getViewerCount(): number {
    return this.viewers.size
  }

  // 接続状態取得
  getConnectionState(): RTCPeerConnectionState {
    return this.connectionState
  }

  // 視聴者側: 視聴開始
  async startViewing() {
    try {
      this.isStreamer = false

      // チャンネル接続
      this.channel = this.supabase.channel(`stream:${this.streamId}`)

      // WebRTC設定
      this.peerConnection = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      })

      // ストリーム受信設定
      let remoteStream: MediaStream | null = null

      this.peerConnection.ontrack = (event) => {
        remoteStream = event.streams[0]
        this.onRemoteStream?.(remoteStream)
      }

      // ICE候補処理
      this.peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          this.channel.send({
            type: 'broadcast',
            event: 'viewer-ice',
            payload: { candidate: event.candidate }
          })
        }
      }

      // 配信者からのアンサー受信
      this.channel.on('broadcast', { event: 'streamer-answer' }, async ({ payload }: { payload: any }) => {
        await this.peerConnection?.setRemoteDescription(payload.answer)
      })

      // ICE候補受信
      this.channel.on('broadcast', { event: 'ice-candidate' }, async ({ payload }: { payload: any }) => {
        if (this.peerConnection) {
          await this.peerConnection.addIceCandidate(payload.candidate)
        }
      })

      await this.channel.subscribe()

      // オファー作成・送信
      const offer = await this.peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      })
      
      await this.peerConnection.setLocalDescription(offer)

      this.channel.send({
        type: 'broadcast',
        event: 'viewer-offer',
        payload: { offer }
      })

      // 視聴者数更新
      await this.updateViewerCount(1)

      return new Promise<MediaStream>((resolve) => {
        this.onRemoteStream = resolve
      })
    } catch (error) {
      console.error('Failed to start viewing:', error)
      throw error
    }
  }

  // 配信者: 視聴者オファー処理
  private async handleViewerOffer(payload: { offer: RTCSessionDescriptionInit }) {
    if (!this.peerConnection || !this.isStreamer) return

    try {
      await this.peerConnection.setRemoteDescription(payload.offer)
      
      const answer = await this.peerConnection.createAnswer()
      await this.peerConnection.setLocalDescription(answer)

      this.channel.send({
        type: 'broadcast',
        event: 'streamer-answer',
        payload: { answer }
      })
    } catch (error) {
      console.error('Failed to handle viewer offer:', error)
    }
  }

  // 視聴者数更新
  private async updateViewerCount(delta: number) {
    const { data } = await this.supabase
      .from('streams')
      .select('viewer_count')
      .eq('id', this.streamId)
      .single()

    if (data) {
      await this.supabase
        .from('streams')
        .update({ 
          viewer_count: Math.max(0, (data.viewer_count || 0) + delta) 
        })
        .eq('id', this.streamId)
    }
  }

  // ストリーム停止
  async stopStream() {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop())
      this.localStream = null
    }

    if (this.peerConnection) {
      this.peerConnection.close()
      this.peerConnection = null
    }

    if (this.channel) {
      await this.channel.unsubscribe()
      this.channel = null
    }

    if (this.isStreamer) {
      await this.supabase
        .from('streams')
        .update({ 
          is_live: false,
          ended_at: new Date().toISOString()
        })
        .eq('id', this.streamId)
    } else {
      await this.updateViewerCount(-1)
    }
  }

  // コールバック
  onRemoteStream?: (stream: MediaStream) => void
  onConnectionStateChange?: (state: RTCPeerConnectionState) => void
}