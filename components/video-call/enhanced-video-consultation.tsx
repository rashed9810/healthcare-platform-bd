"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Phone,
  MessageSquare,
  RefreshCw,
  Monitor,
  MonitorOff,
  Send,
  Settings,
  Circle,
  StopCircle,
  Users,
  Wifi,
  WifiOff,
  X,
  Clock,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import Peer from "peerjs";

interface ChatMessage {
  id: string;
  sender: "doctor" | "patient";
  message: string;
  timestamp: string;
  type: "text" | "system";
}

interface VideoConsultationProps {
  appointmentId: string;
  doctorId: string;
  patientId: string;
  isDoctor: boolean;
}

export default function EnhancedVideoConsultation({
  appointmentId,
  doctorId,
  patientId,
  isDoctor,
}: VideoConsultationProps) {
  // Video call states
  const [peerId, setPeerId] = useState<string>("");
  const [remotePeerId, setRemotePeerId] = useState<string>("");
  const [peer, setPeer] = useState<Peer | null>(null);
  const [connected, setConnected] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [connectionQuality, setConnectionQuality] = useState<
    "good" | "medium" | "poor"
  >("good");
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  // Screen sharing states
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [remoteScreenSharing, setRemoteScreenSharing] = useState(false);

  // Chat states
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [unreadMessages, setUnreadMessages] = useState(0);

  // Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);

  // Connection states
  const [callDuration, setCallDuration] = useState(0);
  const [participantCount, setParticipantCount] = useState(1);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const screenShareRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const callRef = useRef<any>(null);
  const dataConnectionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const callStartTimeRef = useRef<number | null>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Production-ready TURN/STUN servers
  const iceServers = [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:global.stun.twilio.com:3478" },
    {
      urls: "turn:openrelay.metered.ca:80",
      username: "openrelayproject",
      credential: "openrelayproject",
    },
    {
      urls: "turn:openrelay.metered.ca:443",
      username: "openrelayproject",
      credential: "openrelayproject",
    },
  ];

  // Initialize PeerJS with enhanced configuration
  useEffect(() => {
    const initPeer = async () => {
      try {
        setConnecting(true);

        const newPeer = new Peer({
          config: {
            iceServers,
            iceCandidatePoolSize: 10,
          },
          debug: process.env.NODE_ENV === "development" ? 2 : 0,
        });

        newPeer.on("open", (id) => {
          console.log("My peer ID is:", id);
          setPeerId(id);
          setConnectionError(null);

          // Create data connection for chat
          const expectedRemoteId = isDoctor
            ? `patient-${appointmentId}`
            : `doctor-${appointmentId}`;
          setRemotePeerId(expectedRemoteId);
          setConnecting(false);

          // Add system message
          addSystemMessage("Connected to video consultation");
        });

        newPeer.on("error", (err) => {
          console.error("PeerJS error:", err);
          setConnectionError(
            `Connection error: ${err.type}. Please try again.`
          );
          setConnecting(false);
        });

        // Handle incoming data connections (for chat)
        newPeer.on("connection", (conn) => {
          dataConnectionRef.current = conn;
          setupDataConnection(conn);
        });

        // Handle incoming calls
        newPeer.on("call", async (call) => {
          try {
            const stream = await getUserMedia();
            call.answer(stream);
            callRef.current = call;
            handleCallEvents(call);

            if (callStartTimeRef.current === null) {
              callStartTimeRef.current = Date.now();
              startCallTimer();
            }
          } catch (err) {
            console.error("Failed to answer call", err);
            setConnectionError(`Failed to access camera/microphone: ${err}`);
          }
        });

        setPeer(newPeer);
      } catch (err) {
        console.error("Failed to initialize peer:", err);
        setConnectionError(`Failed to initialize video call: ${err}`);
        setConnecting(false);
      }
    };

    initPeer();

    return () => {
      cleanup();
    };
  }, [appointmentId, isDoctor]);

  // Get user media with enhanced constraints
  const getUserMedia = async (screenShare = false) => {
    const constraints = screenShare
      ? { video: { mediaSource: "screen" }, audio: true }
      : {
          video: {
            width: { ideal: 1280, max: 1920 },
            height: { ideal: 720, max: 1080 },
            frameRate: { ideal: 30, max: 60 },
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        };

    const stream = screenShare
      ? await navigator.mediaDevices.getDisplayMedia(constraints)
      : await navigator.mediaDevices.getUserMedia(constraints);

    if (!screenShare) {
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } else {
      screenStreamRef.current = stream;
      if (screenShareRef.current) {
        screenShareRef.current.srcObject = stream;
      }
    }

    return stream;
  };

  // Setup data connection for chat
  const setupDataConnection = (conn: any) => {
    conn.on("open", () => {
      console.log("Data connection opened");
      addSystemMessage("Chat connection established");
    });

    conn.on("data", (data: any) => {
      if (data.type === "chat") {
        const message: ChatMessage = {
          id: Date.now().toString(),
          sender: isDoctor ? "patient" : "doctor",
          message: data.message,
          timestamp: new Date().toISOString(),
          type: "text",
        };

        setChatMessages((prev) => [...prev, message]);

        if (!showChat) {
          setUnreadMessages((prev) => prev + 1);
        }

        // Auto-scroll chat
        setTimeout(() => {
          if (chatScrollRef.current) {
            chatScrollRef.current.scrollTop =
              chatScrollRef.current.scrollHeight;
          }
        }, 100);
      } else if (data.type === "screen-share") {
        setRemoteScreenSharing(data.sharing);
      }
    });

    conn.on("error", (err: any) => {
      console.error("Data connection error:", err);
    });
  };

  // Handle call events
  const handleCallEvents = (call: any) => {
    call.on("stream", (remoteStream: MediaStream) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
        setConnected(true);
        setConnectionError(null);
        setParticipantCount(2);
      }
    });

    call.on("close", () => {
      setConnected(false);
      setParticipantCount(1);
      addSystemMessage("Call ended by the other participant");
    });

    call.on("error", (err: any) => {
      console.error("Call error:", err);
      setConnectionError(`Call error: ${err}`);
      setConnected(false);
    });
  };

  // Start call timer
  const startCallTimer = () => {
    const interval = setInterval(() => {
      if (callStartTimeRef.current) {
        const duration = Math.floor(
          (Date.now() - callStartTimeRef.current) / 1000
        );
        setCallDuration(duration);
      }
    }, 1000);

    return () => clearInterval(interval);
  };

  // Add system message
  const addSystemMessage = (message: string) => {
    const systemMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: "doctor", // Doesn't matter for system messages
      message,
      timestamp: new Date().toISOString(),
      type: "system",
    };
    setChatMessages((prev) => [...prev, systemMessage]);
  };

  // Format call duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Cleanup function
  const cleanup = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (callRef.current) {
      callRef.current.close();
    }
    if (dataConnectionRef.current) {
      dataConnectionRef.current.close();
    }
    if (peer) {
      peer.destroy();
    }
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  return (
    <div className="flex h-full bg-gray-50">
      {/* Main video area */}
      <div className="flex-1 flex flex-col">
        {/* Header with call info */}
        <div className="bg-white border-b p-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">
              Video Consultation -{" "}
              {isDoctor ? "Dr. Session" : "Patient Session"}
            </h2>
            {connected && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{formatDuration(callDuration)}</span>
                <Users className="h-4 w-4 ml-2" />
                <span>
                  {participantCount} participant
                  {participantCount > 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Connection quality indicator */}
            <div className="flex items-center gap-1">
              {connectionQuality === "good" ? (
                <Wifi className="h-4 w-4 text-green-500" />
              ) : connectionQuality === "medium" ? (
                <Wifi className="h-4 w-4 text-yellow-500" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm text-gray-600 capitalize">
                {connectionQuality}
              </span>
            </div>

            {/* Recording indicator */}
            {isRecording && (
              <Badge variant="destructive" className="animate-pulse">
                <Circle className="h-3 w-3 mr-1 fill-current" />
                Recording {formatDuration(recordingDuration)}
              </Badge>
            )}
          </div>
        </div>

        {/* Error alert */}
        {connectionError && (
          <Alert variant="destructive" className="m-4">
            <AlertTitle>Connection Error</AlertTitle>
            <AlertDescription className="flex justify-between items-center">
              <span>{connectionError}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Video container */}
        <div className="flex-1 relative bg-black">
          {/* Remote video (main) */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />

          {/* Screen share overlay */}
          {remoteScreenSharing && (
            <div className="absolute inset-0 bg-black">
              <video
                ref={screenShareRef}
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              />
              <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                Screen Sharing Active
              </div>
            </div>
          )}

          {/* Local video (PiP) */}
          <div className="absolute bottom-4 right-4 w-64 h-48 bg-gray-900 rounded-lg overflow-hidden border-2 border-white shadow-lg">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {!videoEnabled && (
              <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                <VideoOff className="h-8 w-8 text-gray-400" />
              </div>
            )}
          </div>

          {/* Waiting state */}
          {!connected && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="text-center text-white">
                <div className="mb-4">
                  {connecting ? (
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
                  ) : (
                    <Video className="h-12 w-12 mx-auto mb-4" />
                  )}
                </div>
                <h3 className="text-xl font-medium mb-2">
                  {connecting ? "Connecting..." : "Waiting for connection..."}
                </h3>
                <p className="text-gray-300 mb-4">
                  {connecting
                    ? "Please wait while we establish the connection"
                    : "The other participant will join shortly"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Control panel */}
        <div className="bg-white border-t p-4">
          <div className="flex justify-between items-center">
            {/* Left controls */}
            <div className="flex gap-2">
              <Button
                variant={audioEnabled ? "default" : "destructive"}
                size="icon"
                onClick={() => {
                  if (localStreamRef.current) {
                    localStreamRef.current.getAudioTracks().forEach((track) => {
                      track.enabled = !audioEnabled;
                    });
                    setAudioEnabled(!audioEnabled);
                  }
                }}
              >
                {audioEnabled ? (
                  <Mic className="h-4 w-4" />
                ) : (
                  <MicOff className="h-4 w-4" />
                )}
              </Button>

              <Button
                variant={videoEnabled ? "default" : "destructive"}
                size="icon"
                onClick={() => {
                  if (localStreamRef.current) {
                    localStreamRef.current.getVideoTracks().forEach((track) => {
                      track.enabled = !videoEnabled;
                    });
                    setVideoEnabled(!videoEnabled);
                  }
                }}
              >
                {videoEnabled ? (
                  <Video className="h-4 w-4" />
                ) : (
                  <VideoOff className="h-4 w-4" />
                )}
              </Button>

              <Button
                variant={isScreenSharing ? "secondary" : "outline"}
                onClick={async () => {
                  try {
                    if (!isScreenSharing) {
                      const screenStream =
                        await navigator.mediaDevices.getDisplayMedia({
                          video: true,
                          audio: true,
                        });

                      screenStreamRef.current = screenStream;
                      setIsScreenSharing(true);

                      // Notify remote peer
                      if (dataConnectionRef.current) {
                        dataConnectionRef.current.send({
                          type: "screen-share",
                          sharing: true,
                        });
                      }

                      // Handle screen share end
                      screenStream.getVideoTracks()[0].onended = () => {
                        setIsScreenSharing(false);
                        if (dataConnectionRef.current) {
                          dataConnectionRef.current.send({
                            type: "screen-share",
                            sharing: false,
                          });
                        }
                      };
                    } else {
                      if (screenStreamRef.current) {
                        screenStreamRef.current
                          .getTracks()
                          .forEach((track) => track.stop());
                        setIsScreenSharing(false);

                        if (dataConnectionRef.current) {
                          dataConnectionRef.current.send({
                            type: "screen-share",
                            sharing: false,
                          });
                        }
                      }
                    }
                  } catch (err) {
                    console.error("Screen share error:", err);
                  }
                }}
              >
                {isScreenSharing ? (
                  <MonitorOff className="h-4 w-4" />
                ) : (
                  <Monitor className="h-4 w-4" />
                )}
              </Button>

              <Button
                variant={isRecording ? "destructive" : "outline"}
                onClick={() => {
                  if (!isRecording) {
                    // Start recording
                    if (
                      remoteVideoRef.current &&
                      remoteVideoRef.current.srcObject
                    ) {
                      const stream = remoteVideoRef.current
                        .srcObject as MediaStream;
                      const mediaRecorder = new MediaRecorder(stream);

                      mediaRecorderRef.current = mediaRecorder;
                      recordedChunksRef.current = [];

                      mediaRecorder.ondataavailable = (event) => {
                        if (event.data.size > 0) {
                          recordedChunksRef.current.push(event.data);
                        }
                      };

                      mediaRecorder.onstop = () => {
                        const blob = new Blob(recordedChunksRef.current, {
                          type: "video/webm",
                        });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `consultation-${appointmentId}-${Date.now()}.webm`;
                        a.click();
                      };

                      mediaRecorder.start();
                      setIsRecording(true);

                      // Start recording timer
                      const recordingInterval = setInterval(() => {
                        setRecordingDuration((prev) => prev + 1);
                      }, 1000);

                      // Store interval for cleanup
                      (mediaRecorder as any).recordingInterval =
                        recordingInterval;
                    }
                  } else {
                    // Stop recording
                    if (mediaRecorderRef.current) {
                      mediaRecorderRef.current.stop();
                      clearInterval(
                        (mediaRecorderRef.current as any).recordingInterval
                      );
                      setIsRecording(false);
                      setRecordingDuration(0);
                    }
                  }
                }}
              >
                {isRecording ? (
                  <StopCircle className="h-4 w-4" />
                ) : (
                  <Circle className="h-4 w-4 fill-current" />
                )}
              </Button>
            </div>

            {/* Center - Start/Join call */}
            {!connected && (
              <Button
                onClick={async () => {
                  if (!peer || !remotePeerId) return;

                  try {
                    setConnecting(true);
                    const stream = await getUserMedia();

                    // Create data connection for chat
                    const dataConn = peer.connect(remotePeerId);
                    dataConnectionRef.current = dataConn;
                    setupDataConnection(dataConn);

                    // Make video call
                    const call = peer.call(remotePeerId, stream);
                    callRef.current = call;
                    handleCallEvents(call);

                    callStartTimeRef.current = Date.now();
                    startCallTimer();
                  } catch (err) {
                    console.error("Failed to start call:", err);
                    setConnectionError(`Failed to start call: ${err}`);
                    setConnecting(false);
                  }
                }}
                disabled={connecting}
                className="bg-green-600 hover:bg-green-700"
              >
                {connecting ? "Connecting..." : "Join Call"}
              </Button>
            )}

            {/* Right controls */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowChat(!showChat);
                  if (!showChat) {
                    setUnreadMessages(0);
                  }
                }}
                className="relative"
              >
                <MessageSquare className="h-4 w-4" />
                {unreadMessages > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                  >
                    {unreadMessages}
                  </Badge>
                )}
              </Button>

              <Button variant="outline">
                <Settings className="h-4 w-4" />
              </Button>

              <Button
                variant="destructive"
                onClick={() => {
                  cleanup();
                  // In a real app, redirect to appointment summary
                  window.history.back();
                }}
              >
                <Phone className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat sidebar */}
      {showChat && (
        <div className="w-80 bg-white border-l flex flex-col">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-semibold">Chat</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowChat(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="flex-1 p-4" ref={chatScrollRef}>
            <div className="space-y-3">
              {chatMessages.map((message) => (
                <div key={message.id}>
                  {message.type === "system" ? (
                    <div className="text-center text-sm text-gray-500 py-2">
                      {message.message}
                    </div>
                  ) : (
                    <div
                      className={`flex ${
                        message.sender === (isDoctor ? "doctor" : "patient")
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.sender === (isDoctor ? "doctor" : "patient")
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p className="text-sm">{message.message}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                onKeyPress={(e) => {
                  if (e.key === "Enter" && newMessage.trim()) {
                    // Send message
                    const message: ChatMessage = {
                      id: Date.now().toString(),
                      sender: isDoctor ? "doctor" : "patient",
                      message: newMessage.trim(),
                      timestamp: new Date().toISOString(),
                      type: "text",
                    };

                    setChatMessages((prev) => [...prev, message]);

                    // Send to remote peer
                    if (dataConnectionRef.current) {
                      dataConnectionRef.current.send({
                        type: "chat",
                        message: newMessage.trim(),
                      });
                    }

                    setNewMessage("");

                    // Auto-scroll
                    setTimeout(() => {
                      if (chatScrollRef.current) {
                        chatScrollRef.current.scrollTop =
                          chatScrollRef.current.scrollHeight;
                      }
                    }, 100);
                  }
                }}
              />
              <Button
                size="icon"
                onClick={() => {
                  if (newMessage.trim()) {
                    // Same logic as Enter key
                    const message: ChatMessage = {
                      id: Date.now().toString(),
                      sender: isDoctor ? "doctor" : "patient",
                      message: newMessage.trim(),
                      timestamp: new Date().toISOString(),
                      type: "text",
                    };

                    setChatMessages((prev) => [...prev, message]);

                    if (dataConnectionRef.current) {
                      dataConnectionRef.current.send({
                        type: "chat",
                        message: newMessage.trim(),
                      });
                    }

                    setNewMessage("");
                  }
                }}
                disabled={!newMessage.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
