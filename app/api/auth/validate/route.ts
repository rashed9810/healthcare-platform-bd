import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectToDatabase } from "@/lib/db"
import { ObjectId } from "mongodb"

// JWT secret should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function GET(request: Request) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Extract the token
    const token = authHeader.split(" ")[1]

    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string }

    // Connect to database
    const db = await connectToDatabase()
    const usersCollection = db.collection("users")

    // Find user by ID
    const user = await usersCollection.findOne({ _id: new ObjectId(decoded.id) })
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Return user data (excluding password)
    const { password, ...userWithoutPassword } = user

    return NextResponse.json({
      user: { ...userWithoutPassword, id: user._id.toString() },
    })
  } catch (error) {
    console.error("Token validation error:", error)
    return NextResponse.json({ message: "Invalid token" }, { status: 401 })
  }
}
