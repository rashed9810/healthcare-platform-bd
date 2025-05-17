// This file is for reference only - it shows how to implement a WebRTC signaling server

import { Server } from "socket.io"
import http from "http"
import express from "express"
import cors from "cors"

const app = express()
app.use(cors())

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
})

// Store connected users
const users = new Map()

// Store active rooms
const rooms = new Map()

io.on("connection", (socket) => {
  console.log("User connected:", socket.id)

  // User registers with their ID
  socket.on("register", (userId) => {
    console.log("User registered:", userId)
    users.set(userId, socket.id)
    socket.userId = userId
  })

  // User initiates a call
  socket.on("call-user", (data) => {
    const { targetUserId, offer, callerId } = data
    const targetSocketId = users.get(targetUserId)

    if (targetSocketId) {
      // Create a room for the call
      const roomId = `${callerId}-${targetUserId}`
      rooms.set(roomId, { callerId, targetUserId, participants: new Set([callerId, targetUserId]) })

      // Join the room
      socket.join(roomId)

      // Send the offer to the target user
      io.to(targetSocketId).emit("incoming-call", {
        callerId,
        offer,
        roomId,
      })
    } else {
      // Target user not found
      socket.emit("call-failed", { targetUserId, reason: "User not found or offline" })
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

  // User ends call
  socket.on("end-call", (data) => {
    const { roomId } = data

    // Broadcast end call to all users in the room
    io.to(roomId).emit("call-ended", { roomId })

    // Remove the room
    rooms.delete(roomId)
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
        }
      }
    }
  })
})

const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`Signaling server running on port ${PORT}`)
})

export default server
