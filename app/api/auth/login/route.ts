import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// JWT secret should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Mock user data for testing
const MOCK_USERS = [
  {
    id: "1",
    email: "test@example.com",
    password: "password123", // In a real app, this would be hashed
    name: "Test User",
    role: "admin",
    language: "en",
  },
  {
    id: "2",
    email: "doctor@example.com",
    password: "password123",
    name: "Dr. Example",
    role: "doctor",
    language: "en",
  },
  {
    id: "3",
    email: "patient@example.com",
    password: "password123",
    name: "Patient Example",
    role: "patient",
    language: "en",
  },
];

export async function POST(request: Request) {
  try {
    console.log("Login API route called");

    // Parse request body
    let body;
    try {
      body = await request.json();
      console.log("Request body parsed:", {
        email: body.email,
        hasPassword: !!body.password,
      });
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError);
      return NextResponse.json(
        { message: "Invalid request body" },
        { status: 400 }
      );
    }

    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      console.log("Missing required fields:", {
        email: !!email,
        password: !!password,
      });
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user in mock data
    console.log("Looking for user with email:", email);
    const user = MOCK_USERS.find((u) => u.email === email);

    if (!user) {
      console.log("User not found with email:", email);
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    console.log("User found:", { id: user.id, role: user.role });

    // Verify password (simple comparison for mock data)
    if (password !== user.password) {
      console.log("Invalid password for user:", email);
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create JWT token
    console.log("Creating JWT token...");
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
    console.log("JWT token created successfully");

    // Return user data (excluding password) and token
    const { password: _, ...userWithoutPassword } = user;

    console.log("Login successful, returning user data and token");
    return NextResponse.json({
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
