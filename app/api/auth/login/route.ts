import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/db";

// JWT secret should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

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

    // Connect to database
    console.log("Connecting to database...");
    let db;
    try {
      db = await connectToDatabase();
      console.log("Connected to database successfully");
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      return NextResponse.json(
        { message: "Database connection failed" },
        { status: 500 }
      );
    }

    const usersCollection = db.collection("users");

    // Find user
    console.log("Looking for user with email:", email);
    const user = await usersCollection.findOne({ email });

    if (!user) {
      console.log("User not found with email:", email);
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    console.log("User found:", { id: user._id.toString(), role: user.role });

    // Verify password
    console.log("Verifying password...");
    let isPasswordValid;
    try {
      isPasswordValid = await bcrypt.compare(password, user.password);
      console.log("Password verification result:", isPasswordValid);
    } catch (bcryptError) {
      console.error("Password verification error:", bcryptError);
      return NextResponse.json(
        { message: "Authentication error" },
        { status: 500 }
      );
    }

    if (!isPasswordValid) {
      console.log("Invalid password for user:", email);
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create JWT token
    console.log("Creating JWT token...");
    let token;
    try {
      token = jwt.sign(
        { id: user._id.toString(), email: user.email, role: user.role },
        JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );
      console.log("JWT token created successfully");
    } catch (jwtError) {
      console.error("JWT creation error:", jwtError);
      return NextResponse.json(
        { message: "Authentication error" },
        { status: 500 }
      );
    }

    // Return user data (excluding password) and token
    const { password: _, ...userWithoutPassword } = user;

    console.log("Login successful, returning user data and token");
    return NextResponse.json({
      user: { ...userWithoutPassword, id: user._id.toString() },
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
