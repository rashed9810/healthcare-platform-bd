import { io, type Socket } from "socket.io-client"

// Signaling server URL
const SIGNALING_SERVER_URL = process.env.NEXT_PUBLIC_SIGNALING_SERVER_URL || "http://localhost:3001"

// WebRTC configuration
const ICE_SERVERS = [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:global.stun.twilio.com:3478" }]

// Connection quality levels
export type ConnectionQuality = "good" | "medium" | "poor"

// Event callbacks
export interface SignalingCallbacks {
  onIncomingCall?: (callerId: string, roomId: string) => void
  onCallAnswered?: (roomId: string) => void
  onCallFailed?: (reason: string) => void
  onCallEnded?: (roomId: string, duration: number) => void
  onRemoteStream?: (stream: MediaStream) => void
  onConnectionQualityChange?: (quality: ConnectionQuality) => void
  onParticipantDisconnected?: (userId: string) => void
  onError?: (error: Error) => void
}

export class SignalingClient {
  private socket: Socket | null = null
  private peerConnection: RTCPeerConnection | null = null
  private localStream: MediaStream | null = null
  private remoteStream: MediaStream | null = null
  private userId: string | null = null
  private callbacks: SignalingCallbacks = {}
  private roomId: string | null = null
  private connectionQualityInterval: NodeJS.Timeout | null = null

  /**
   * Initialize the signaling client
   * @param userId User ID
   * @param callbacks Event callbacks
   */
  public async initialize(userId: string, callbacks: SignalingCallbacks = {}): Promise<void> {
    this.userId = userId
    this.callbacks = callbacks

    // Connect to signaling server
    this.socket = io(SIGNALING_SERVER_URL)

    // Set up socket event listeners
    this.setupSocketListeners()

    // Register with signaling server
    this.socket.emit("register", userId)
  }

  /**
   * Set up socket event listeners
   */
  private setupSocketListeners(): void {
    if (!this.socket) return

    // Registration confirmation
    this.socket.on("registered", () => {
      console.log("Registered with signaling server")
    })

    // Incoming call
    this.socket.on("incoming-call", async (data) => {
      const { callerId, offer, roomId } = data
      this.roomId = roomId

      console.log(`Incoming call from ${callerId}`)

      try {
        // Create peer connection
        await this.createPeerConnection()

        // Set remote description
        await this.peerConnection?.setRemoteDescription(new RTCSessionDescription(offer))

        // Create answer
        const answer = await this.peerConnection?.createAnswer()
        await this.peerConnection?.setLocalDescription(answer)

        // Send answer to caller
        this.socket?.emit("answer-call", {
          callerId,
          answer,
          roomId,
        })

        // Notify callback
        this.callbacks.onIncomingCall?.(callerId, roomId)
      } catch (error) {
        console.error("Error handling incoming call:", error)
        this.callbacks.onError?.(error as Error)
      }
    })

    // Call answered
    this.socket.on("call-answered", async (data) => {
      const { answer } = data

      console.log("Call answered")

      try {
        // Set remote description
        await this.peerConnection?.setRemoteDescription(new RTCSessionDescription(answer))

        // Notify callback
        this.callbacks.onCallAnswered?.(this.roomId!)
      } catch (error) {
        console.error("Error handling call answer:", error)
        this.callbacks.onError?.(error as Error)
      }
    })

    // ICE candidate
    this.socket.on("ice-candidate", async (data) => {
      const { candidate } = data

      try {
        if (candidate && this.peerConnection) {
          await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
        }
      } catch (error) {
        console.error("Error adding ICE candidate:", error)
        this.callbacks.onError?.(error as Error)
      }
    })

    // Connection quality update
    this.socket.on("connection-quality-update", (data) => {
      const { quality, userId } = data
      console.log(`Connection quality update from ${userId}: ${quality}`)

      // Notify callback
      if (userId !== this.userId) {
        this.callbacks.onConnectionQualityChange?.(quality)
      }
    })

    // Call ended
    this.socket.on("call-ended", (data) => {
      const { roomId, duration } = data
      console.log(`Call ended: Room ${roomId}, Duration: ${duration}s`)

      // Clean up
      this.cleanup()

      // Notify callback
      this.callbacks.onCallEnded?.(roomId, duration)
    })

    // Call failed
    this.socket.on("call-failed", (data) => {
      const { reason } = data
      console.log(`Call failed: ${reason}`)

      // Clean up
      this.cleanup()

      // Notify callback
      this.callbacks.onCallFailed?.(reason)
    })

    // Participant disconnected
    this.socket.on("participant-disconnected", (data) => {
      const { userId } = data
      console.log(`Participant disconnected: ${userId}`)

      // Notify callback
      this.callbacks.onParticipantDisconnected?.(userId)
    })
  }

  /**
   * Create a peer connection
   */
  private async createPeerConnection(): Promise<void> {
    try {
      // Create peer connection
      this.peerConnection = new RTCPeerConnection({
        iceServers: ICE_SERVERS,
      })

      // Get local stream
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })

      // Add tracks to peer connection
      this.localStream.getTracks().forEach((track) => {
        this.peerConnection?.addTrack(track, this.localStream!)
      })

      // Create remote stream
      this.remoteStream = new MediaStream()

      // Handle incoming tracks
      this.peerConnection.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
          this.remoteStream?.addTrack(track)
        })

        // Notify callback
        this.callbacks.onRemoteStream?.(this.remoteStream!)
      }

      // Handle ICE candidates
      this.peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          this.socket?.emit("ice-candidate", {
            roomId: this.roomId,
            candidate: event.candidate,
          })
        }
      }

      // Start monitoring connection quality
      this.startConnectionQualityMonitoring()
    } catch (error) {
      console.error("Error creating peer connection:", error)
      this.callbacks.onError?.(error as Error)
    }
  }

  /**
   * Start monitoring connection quality
   */
  private startConnectionQualityMonitoring(): void {
    if (this.connectionQualityInterval) {
      clearInterval(this.connectionQualityInterval)
    }

    this.connectionQualityInterval = setInterval(async () => {
      if (!this.peerConnection) return

      try {
        const stats = await this.peerConnection.getStats()
        let totalPacketsLost = 0
        let totalPackets = 0
        let roundTripTime = 0
        let hasRoundTripTime = false

        stats.forEach((report) => {
          if (report.type === "inbound-rtp" && report.kind === "video") {
            totalPacketsLost += report.packetsLost || 0
            totalPackets += report.packetsReceived || 0
          }

          if (report.type === "remote-inbound-rtp" && report.kind === "video") {
            roundTripTime = report.roundTripTime || 0
            hasRoundTripTime = true
          }
        })

        // Calculate packet loss percentage
        const packetLossPercentage = totalPackets > 0 ? (totalPacketsLost / totalPackets) * 100 : 0

        // Determine connection quality
        let quality: ConnectionQuality = "good"

        if (packetLossPercentage > 10 || (hasRoundTripTime && roundTripTime > 0.5)) {
          quality = "poor"
        } else if (packetLossPercentage > 3 || (hasRoundTripTime && roundTripTime > 0.2)) {
          quality = "medium"
        }

        // Send connection quality to signaling server
        this.socket?.emit("connection-quality", {
          roomId: this.roomId,
          quality,
        })
      } catch (error) {
        console.error("Error monitoring connection quality:", error)
      }
    }, 5000)
  }

  /**
   * Call a user
   * @param targetUserId Target user ID
   * @returns Promise that resolves when the call is initiated
   */
  public async callUser(targetUserId: string): Promise<void> {
    if (!this.socket || !this.userId) {
      throw new Error("Not connected to signaling server")
    }

    try {
      // Create room ID
      this.roomId = `${this.userId}-${targetUserId}`

      // Create peer connection
      await this.createPeerConnection()

      // Create offer
      const offer = await this.peerConnection?.createOffer()
      await this.peerConnection?.setLocalDescription(offer)

      // Send offer to target user
      this.socket.emit("call-user", {
        targetUserId,
        offer,
        callerId: this.userId,
      })
    } catch (error) {
      console.error("Error calling user:", error)
      this.callbacks.onError?.(error as Error)
    }
  }

  /**
   * End the current call
   */
  public endCall(): void {
    if (!this.socket || !this.roomId) return

    // Send end call to signaling server
    this.socket.emit("end-call", {
      roomId: this.roomId,
    })

    // Clean up
    this.cleanup()
  }

  /**
   * Toggle audio
   * @param enabled Whether audio should be enabled
   */
  public toggleAudio(enabled: boolean): void {
    if (!this.localStream) return

    this.localStream.getAudioTracks().forEach((track) => {
      track.enabled = enabled
    })
  }

  /**
   * Toggle video
   * @param enabled Whether video should be enabled
   */
  public toggleVideo(enabled: boolean): void {
    if (!this.localStream) return

    this.localStream.getVideoTracks().forEach((track) => {
      track.enabled = enabled
    })
  }

  /**
   * Set video constraints for bandwidth optimization
   * @param lowBandwidth Whether to use low bandwidth mode
   */
  public setVideoConstraints(lowBandwidth: boolean): void {
    if (!this.localStream) return

    const videoTracks = this.localStream.getVideoTracks()
    if (videoTracks.length === 0) return

    const videoTrack = videoTracks[0]

    if (lowBandwidth) {
      // Low bandwidth mode
      videoTrack.applyConstraints({
        width: 320,
        height: 240,
        frameRate: 15,
      })
    } else {
      // Normal mode
      videoTrack.applyConstraints({
        width: 640,
        height: 480,
        frameRate: 30,
      })
    }
  }

  /**
   * Clean up resources
   */
  private cleanup(): void {
    // Stop connection quality monitoring
    if (this.connectionQualityInterval) {
      clearInterval(this.connectionQualityInterval)
      this.connectionQualityInterval = null
    }

    // Stop local stream
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop())
      this.localStream = null
    }

    // Close peer connection
    if (this.peerConnection) {
      this.peerConnection.close()
      this.peerConnection = null
    }

    // Reset room ID
    this.roomId = null
  }

  /**
   * Disconnect from signaling server
   */
  public disconnect(): void {
    // Clean up
    this.cleanup()

    // Disconnect socket
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }
}

// Export singleton instance
export const signalingClient = new SignalingClient()
