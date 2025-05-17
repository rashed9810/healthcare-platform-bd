import { NextResponse } from "next/server"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { connectToDatabase } from "@/lib/db"

// JWT secret should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 })
    }

    // Connect to database
    const db = await connectToDatabase()
    const usersCollection = db.collection("users")

    // Find user
    const user = await usersCollection.findOne({ email })
    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    // Create JWT token
    const token = jwt.sign({ id: user._id.toString(), email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    })

    // Return user data (excluding password) and token
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      user: { ...userWithoutPassword, id: user._id.toString() },
      token,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
