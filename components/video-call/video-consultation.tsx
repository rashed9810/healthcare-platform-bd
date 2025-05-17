"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mic, MicOff, Video, VideoOff, Phone, MessageSquare, RefreshCw } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Peer from "peerjs"

interface VideoConsultationProps {
  appointmentId: string
  doctorId: string
  patientId: string
  isDoctor: boolean
}

export default function VideoConsultation({ appointmentId, doctorId, patientId, isDoctor }: VideoConsultationProps) {
  const [peerId, setPeerId] = useState<string>("")
  const [remotePeerId, setRemotePeerId] = useState<string>("")
  const [peer, setPeer] = useState<Peer | null>(null)
  const [connected, setConnected] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [videoEnabled, setVideoEnabled] = useState(true)
  const [lowBandwidthMode, setLowBandwidthMode] = useState(false)
  const [connectionQuality, setConnectionQuality] = useState<"good" | "medium" | "poor">("good")
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [connecting, setConnecting] = useState(false)

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const callRef = useRef<any>(null)

  // Initialize PeerJS
  useEffect(() => {
    const initPeer = async () => {
      try {
        setConnecting(true)
        // In a real app, you would use a proper TURN/STUN server configuration
        const newPeer = new Peer({
          config: {
            iceServers: [
              { urls: "stun:stun.l.google.com:19302" },
              { urls: "stun:global.stun.twilio.com:3478" },
              {
                urls: "turn:numb.viagenie.ca",
                credential: "muazkh",
                username: "webrtc@live.com",
              },
            ],
          },
          debug: 2, // Set debug level
        })

        newPeer.on("open", (id) => {
          console.log("My peer ID is:", id)
          setPeerId(id)
          setConnectionError(null)

          // In a real app, you would send this ID to your server
          // to notify the other participant

          // For demo purposes, we'll use a deterministic ID based on appointment
          const expectedRemoteId = isDoctor ? `patient-${appointmentId}` : `doctor-${appointmentId}`

          setRemotePeerId(expectedRemoteId)
          setConnecting(false)
        })

        newPeer.on("error", (err) => {
          console.error("PeerJS error:", err)
          setConnectionError(`Connection error: ${err.type}. Please try again.`)
          setConnecting(false)
        })

        newPeer.on("call", async (call) => {
          try {
            // Answer the call with our stream
            const stream = await navigator.mediaDevices.getUserMedia({
              video: videoEnabled,
              audio: audioEnabled,
            })

            localStreamRef.current = stream
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = stream
            }

            call.answer(stream)
            callRef.current = call

            // Handle incoming stream
            call.on("stream", (remoteStream) => {
              if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = remoteStream
                setConnected(true)
                setConnectionError(null)
              }
            })

            call.on("close", () => {
              setConnected(false)
              setConnectionError("Call ended by the other participant")
            })

            call.on("error", (err) => {
              console.error("Call error:", err)
              setConnectionError(`Call error: ${err}. Please try reconnecting.`)
              setConnected(false)
            })

            // Monitor connection quality
            monitorConnectionQuality()
          } catch (err) {
            console.error("Failed to get local stream", err)
            setConnectionError(`Failed to access camera/microphone: ${err}. Please check your device permissions.`)
          }
        })

        setPeer(newPeer)
      } catch (err) {
        console.error("Failed to initialize peer:", err)
        setConnectionError(`Failed to initialize video call: ${err}. Please refresh the page.`)
        setConnecting(false)
      }
    }

    initPeer()

    return () => {
      // Cleanup
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop())
      }
      if (callRef.current) {
        callRef.current.close()
      }
      if (peer) {
        peer.destroy()
      }
    }
  }, [appointmentId, isDoctor])

  // Function to initiate a call
  const startCall = async () => {
    if (!peer || !remotePeerId) {
      setConnectionError("Connection not ready. Please wait or refresh the page.")
      return
    }

    try {
      setConnecting(true)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: videoEnabled,
        audio: audioEnabled,
      })

      localStreamRef.current = stream
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }

      const call = peer.call(remotePeerId, stream)
      callRef.current = call

      call.on("stream", (remoteStream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream
          setConnected(true)
          setConnectionError(null)
          setConnecting(false)
        }
      })

      call.on("close", () => {
        setConnected(false)
        setConnectionError("Call ended by the other participant")
      })

      call.on("error", (err) => {
        console.error("Call error:", err)
        setConnectionError(`Call error: ${err}. Please try reconnecting.`)
        setConnected(false)
        setConnecting(false)
      })

      // Set a timeout for connection
      setTimeout(() => {
        if (!connected) {
          setConnecting(false)
          setConnectionError("Connection timed out. The other participant may not be available.")
        }
      }, 30000)

      // Monitor connection quality
      monitorConnectionQuality()
    } catch (err) {
      console.error("Failed to get local stream", err)
      setConnectionError(`Failed to access camera/microphone: ${err}. Please check your device permissions.`)
      setConnecting(false)
    }
  }

  // Toggle audio
  const toggleAudio = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !audioEnabled
      })
      setAudioEnabled(!audioEnabled)
    }
  }

  // Toggle video
  const toggleVideo = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = !videoEnabled
      })
      setVideoEnabled(!videoEnabled)
    }
  }

  // Toggle low bandwidth mode
  const toggleBandwidthMode = () => {
    setLowBandwidthMode(!lowBandwidthMode)

    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks()

      if (videoTracks.length > 0) {
        const videoTrack = videoTracks[0]

        // Apply constraints based on bandwidth mode
        if (!lowBandwidthMode) {
          // Switching to low bandwidth mode
          videoTrack.applyConstraints({
            width: 320,
            height: 240,
            frameRate: 15,
          })
        } else {
          // Switching to normal mode
          videoTrack.applyConstraints({
            width: 640,
            height: 480,
            frameRate: 30,
          })
        }
      }
    }
  }

  // Monitor connection quality
  const monitorConnectionQuality = () => {
    // In a real app, you would implement proper connection quality monitoring
    // This is a simplified example

    const checkQuality = () => {
      if (!peer || !connected) return

      // In a real implementation, you would check actual network stats
      // For now, we'll use a more realistic simulation based on packet loss
      const simulateQualityCheck = () => {
        // Simulate packet loss percentage (0-10%)
        const packetLoss = Math.random() * 10

        if (packetLoss < 2) {
          return "good"
        } else if (packetLoss < 5) {
          return "medium"
        } else {
          return "poor"
        }
      }

      const quality = simulateQualityCheck()
      setConnectionQuality(quality as "good" | "medium" | "poor")

      // If quality is poor, suggest low bandwidth mode
      if (quality === "poor" && !lowBandwidthMode) {
        // In a real app, you might show a notification here
        console.log("Connection quality is poor. Consider enabling low bandwidth mode.")
      }
    }

    // Check quality every 5 seconds
    const intervalId = setInterval(checkQuality, 5000)

    return () => clearInterval(intervalId)
  }

  // Retry connection
  const retryConnection = () => {
    if (peer) {
      peer.destroy()
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop())
    }

    setConnected(false)
    setConnectionError(null)
    setPeer(null)
    setPeerId("")

    // Re-initialize everything
    const initPeer = async () => {
      try {
        setConnecting(true)
        const newPeer = new Peer({
          config: {
            iceServers: [
              { urls: "stun:stun.l.google.com:19302" },
              { urls: "stun:global.stun.twilio.com:3478" },
              {
                urls: "turn:numb.viagenie.ca",
                credential: "muazkh",
                username: "webrtc@live.com",
              },
            ],
          },
        })

        newPeer.on("open", (id) => {
          console.log("My peer ID is:", id)
          setPeerId(id)
          setConnectionError(null)
          const expectedRemoteId = isDoctor ? `patient-${appointmentId}` : `doctor-${appointmentId}`
          setRemotePeerId(expectedRemoteId)
          setConnecting(false)
        })

        setPeer(newPeer)
      } catch (err) {
        console.error("Failed to initialize peer:", err)
        setConnectionError(`Failed to initialize video call: ${err}. Please refresh the page.`)
        setConnecting(false)
      }
    }

    initPeer()
  }

  // End call
  const endCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop())
    }

    if (callRef.current) {
      callRef.current.close()
    }

    setConnected(false)

    // In a real app, you would notify the server that the call has ended
  }

  return (
    <div className="flex flex-col h-full">
      {connectionError && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription className="flex justify-between items-center">
            <span>{connectionError}</span>
            <Button variant="outline" size="sm" onClick={retryConnection} className="ml-2">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex-1 relative">
        {/* Remote video (full size) */}
        <div className="w-full h-full bg-black rounded-lg overflow-hidden">
          <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />

          {!connected && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-white text-xl font-medium mb-4">
                  {connecting ? "Connecting..." : "Waiting to connect..."}
                </h3>
                <Button onClick={startCall} disabled={connecting}>
                  {connecting ? "Connecting..." : "Start Call"}
                </Button>
              </div>
            </div>
          )}

          {/* Connection quality indicator */}
          {connected && (
            <div className="absolute top-4 right-4">
              <div className="flex items-center bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                <div
                  className={`w-3 h-3 rounded-full mr-2 ${
                    connectionQuality === "good"
                      ? "bg-green-500"
                      : connectionQuality === "medium"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                />
                {connectionQuality === "good" ? "Good" : connectionQuality === "medium" ? "Medium" : "Poor"} Connection
              </div>
            </div>
          )}

          {/* Low bandwidth mode indicator */}
          {lowBandwidthMode && (
            <div className="absolute top-14 right-4">
              <div className="bg-blue-500/70 text-white px-3 py-1 rounded-full text-sm">Low Bandwidth Mode</div>
            </div>
          )}
        </div>

        {/* Local video (picture-in-picture) */}
        <div className="absolute bottom-4 right-4 w-1/4 max-w-[200px] aspect-video bg-gray-900 rounded-lg overflow-hidden border-2 border-white shadow-lg">
          <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Controls */}
      <Card className="mt-4">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button variant={audioEnabled ? "default" : "destructive"} size="icon" onClick={toggleAudio}>
                {audioEnabled ? <Mic /> : <MicOff />}
              </Button>

              <Button variant={videoEnabled ? "default" : "destructive"} size="icon" onClick={toggleVideo}>
                {videoEnabled ? <Video /> : <VideoOff />}
              </Button>

              <Button
                variant={lowBandwidthMode ? "secondary" : "outline"}
                onClick={toggleBandwidthMode}
                className="ml-2"
              >
                {lowBandwidthMode ? "Normal Mode" : "Low Bandwidth Mode"}
              </Button>
            </div>

            <div className="flex gap-2">
              <Button variant="outline">
                <MessageSquare className="mr-2 h-4 w-4" />
                Chat
              </Button>

              <Button variant="destructive" onClick={endCall}>
                <Phone className="mr-2 h-4 w-4" />
                End Call
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
