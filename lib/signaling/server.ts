import { Server } from "socket.io"
import http from "http"
import express from "express"
import cors from "cors"
import { createAdapter } from "@socket.io/redis-adapter"
import { createClient } from "redis"
import { instrument } from "@socket.io/admin-ui"
import dotenv from "dotenv"

// Load environment variables
dotenv.config()

// Create Express app
const app = express()
app.use(cors())

// Create HTTP server
const server = http.createServer(app)

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
})

// Set up Redis adapter if Redis URL is provided
if (process.env.REDIS_URL) {
  const pubClient = createClient({ url: process.env.REDIS_URL })
  const subClient = pubClient.duplicate()

  Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
    io.adapter(createAdapter(pubClient, subClient))
    console.log("Socket.IO Redis adapter initialized")
  })
}

// Set up Socket.IO Admin UI if enabled
if (process.env.SOCKET_ADMIN_UI_ENABLED === "true") {
  instrument(io, {
    auth: {
      type: "basic",
      username: process.env.SOCKET_ADMIN_USERNAME || "admin",
      password: process.env.SOCKET_ADMIN_PASSWORD || "admin",
    },
  })
}

// Store connected users
const users = new Map()

// Store active rooms
const rooms = new Map()

// Socket.IO connection handler
io.on("connection", (socket) => {
  console.log("User connected:", socket.id)

  // User registers with their ID
  socket.on("register", (userId) => {
    console.log("User registered:", userId)
    users.set(userId, socket.id)
    socket.userId = userId

    // Notify user of successful registration
    socket.emit("registered", { userId })
  })

  // User initiates a call
  socket.on("call-user", (data) => {
    const { targetUserId, offer, callerId } = data
    const targetSocketId = users.get(targetUserId)

    if (targetSocketId) {
      // Create a room for the call
      const roomId = `${callerId}-${targetUserId}`
      rooms.set(roomId, {
        callerId,
        targetUserId,
        participants: new Set([callerId, targetUserId]),
        startTime: new Date(),
      })

      // Join the room
      socket.join(roomId)

      // Send the offer to the target user
      io.to(targetSocketId).emit("incoming-call", {
        callerId,
        offer,
        roomId,
      })

      // Log call initiation
      console.log(`Call initiated: ${callerId} -> ${targetUserId}, Room: ${roomId}`)
    } else {
      // Target user not found
      socket.emit("call-failed", { targetUserId, reason: "User not found or offline" })
      console.log(`Call failed: ${callerId} -> ${targetUserId}, Reason: User not found or offline`)
    }
  })

  // User answers a call
  socket.on("answer-call", (data) => {
    const { callerId, answer, roomId } = data
    const callerSocketId = users.get(callerId)

    if (callerSocketId) {
      // Join the room
      socket.join(roomId)

      // Send the answer to the caller
      io.to(callerSocketId).emit("call-answered", {
        answer,
        roomId,
      })

      // Log call answer
      console.log(`Call answered: Room ${roomId}, Caller: ${callerId}`)
    } else {
      // Caller not found
      socket.emit("call-failed", { callerId, reason: "Caller not found or offline" })
      console.log(`Answer failed: Room ${roomId}, Caller: ${callerId}, Reason: Caller not found or offline`)
    }
  })

  // User sends ICE candidate
  socket.on("ice-candidate", (data) => {
    const { roomId, candidate } = data

    // Broadcast the ICE candidate to all users in the room except the sender
    socket.to(roomId).emit("ice-candidate", {
      candidate,
      roomId,
    })
  })

  // User reports connection quality
  socket.on("connection-quality", (data) => {
    const { roomId, quality } = data

    // Broadcast connection quality to all users in the room except the sender
    socket.to(roomId).emit("connection-quality-update", {
      quality,
      userId: socket.userId,
    })
  })

  // User ends call
  socket.on("end-call", (data) => {
    const { roomId } = data

    // Get room data
    const room = rooms.get(roomId)

    if (room) {
      // Calculate call duration
      const duration = Math.round((new Date().getTime() - room.startTime.getTime()) / 1000)

      // Broadcast end call to all users in the room
      io.to(roomId).emit("call-ended", { roomId, duration })

      // Log call end
      console.log(`Call ended: Room ${roomId}, Duration: ${duration}s`)

      // Remove the room
      rooms.delete(roomId)
    }
  })

  // User disconnects
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id)

    // Remove user from users map
    if (socket.userId) {
      users.delete(socket.userId)
    }

    // Find and clean up any rooms the user was in
    for (const [roomId, room] of rooms.entries()) {
      if (room.participants.has(socket.userId)) {
        // Notify other participants
        socket.to(roomId).emit("participant-disconnected", { userId: socket.userId })

        // Remove user from room
        room.participants.delete(socket.userId)

        // If room is empty, remove it
        if (room.participants.size === 0) {
          rooms.delete(roomId)
          console.log(`Room ${roomId} removed (empty)`)
        }
      }
    }
  })
})

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    connections: io.engine.clientsCount,
    rooms: rooms.size,
    users: users.size,
  })
})

// Start server
const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`Signaling server running on port ${PORT}`)
})

export default server
