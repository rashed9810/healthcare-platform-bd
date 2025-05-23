import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/db";

// JWT secret should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

interface DecodedToken {
  id: string;
  email: string;
  role: string;
  exp: number;
}

export async function verifyAuth(request: Request | NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return {
        isAuthenticated: false,
        error: "Missing or invalid authorization header",
      };
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    if (!token) {
      return { isAuthenticated: false, error: "Missing token" };
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;

    // Check if token is expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < currentTime) {
      return { isAuthenticated: false, error: "Token expired" };
    }

    // Connect to database
    const db = await connectToDatabase();
    const usersCollection = db.collection("users");

    // Find user
    const user = await usersCollection.findOne({
      _id: new ObjectId(decoded.id),
    });

    if (!user) {
      return { isAuthenticated: false, error: "User not found" };
    }

    // Return authenticated user
    return {
      isAuthenticated: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        name: user.name,
      },
    };
  } catch (error) {
    console.error("Authentication error:", error);

    // Check for specific JWT errors
    if (error instanceof jwt.JsonWebTokenError) {
      return { isAuthenticated: false, error: "Invalid token" };
    } else if (error instanceof jwt.TokenExpiredError) {
      return { isAuthenticated: false, error: "Token expired" };
    }

    return { isAuthenticated: false, error: "Authentication failed" };
  }
}
