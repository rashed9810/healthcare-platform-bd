import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// JWT secret should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function GET(request: Request) {
  try {
    console.log("Token validation API route called");

    // Get the authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("No valid authorization header found");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Extract the token
    const token = authHeader.split(" ")[1];
    console.log("Token extracted from header");

    try {
      // Verify the token
      const decoded = jwt.verify(token, JWT_SECRET) as {
        id: string;
        email: string;
        role: string;
      };
      console.log("Token verified successfully:", decoded);

      // For testing purposes, return a mock user based on the token payload
      // This avoids the need for a database connection
      return NextResponse.json({
        user: {
          id: decoded.id,
          email: decoded.email,
          name: "Test User",
          role: decoded.role || "patient",
          language: "en",
        },
      });
    } catch (jwtError) {
      console.error("JWT verification failed:", jwtError);
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
  } catch (error) {
    console.error("Token validation error:", error);
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}
