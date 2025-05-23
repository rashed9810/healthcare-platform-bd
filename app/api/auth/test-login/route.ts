import { NextResponse } from "next/server";

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

export async function GET() {
  return NextResponse.json({
    message: "Test login endpoint is working",
    users: MOCK_USERS.map(user => ({
      email: user.email,
      password: user.password,
      role: user.role
    }))
  });
}

export async function POST(request: Request) {
  try {
    console.log("Test Login API route called");

    // Parse request body
    let body;
    try {
      body = await request.json();
      console.log("Request body parsed:", {
        email: body.email,
        password: body.password,
        hasPassword: !!body.password,
      });
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError);
      return NextResponse.json(
        { message: "Invalid request body", error: parseError },
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
        { 
          message: "Invalid credentials", 
          error: "User not found",
          providedEmail: email
        },
        { status: 401 }
      );
    }

    console.log("User found:", { id: user.id, role: user.role });

    // Verify password (simple comparison for mock data)
    console.log("Password comparison:", {
      providedPassword: password,
      expectedPassword: user.password,
      isMatch: password === user.password,
      passwordLength: password.length,
      expectedPasswordLength: user.password.length,
    });

    if (password !== user.password) {
      console.log("Invalid password for user:", email);
      return NextResponse.json(
        { 
          message: "Invalid credentials", 
          error: "Password mismatch",
          providedPassword: password,
          expectedPassword: user.password
        },
        { status: 401 }
      );
    }

    // Return success
    return NextResponse.json({
      message: "Test login successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Test login error:", error);
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}
