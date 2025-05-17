import { NextResponse } from "next/server"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { connectToDatabase } from "@/lib/db"

// JWT secret should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(request: Request) {
  try {
    const { name, email, password, phone, language } = await request.json()

    // Validate input
    if (!name || !email || !password || !phone) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Connect to database
    const db = await connectToDatabase()
    const usersCollection = db.collection("users")

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 409 })
    }

    // Hash password
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create user
    const newUser = {
      name,
      email,
      password: hashedPassword,
      phone,
      language: language || "en",
      role: "patient",
      createdAt: new Date().toISOString(),
    }

    const result = await usersCollection.insertOne(newUser)
    const userId = result.insertedId.toString()

    // Create JWT token
    const token = jwt.sign({ id: userId, email, role: "patient" }, JWT_SECRET, { expiresIn: "7d" })

    // Return user data (excluding password) and token
    const { password: _, ...userWithoutPassword } = newUser

    return NextResponse.json({
      user: { ...userWithoutPassword, id: userId },
      token,
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
