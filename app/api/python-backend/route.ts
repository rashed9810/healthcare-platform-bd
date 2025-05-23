import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth-middleware";

const PYTHON_BACKEND_URL = "http://localhost:8001";

export async function POST(request: Request) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request);
    if (!authResult.isAuthenticated) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const { endpoint, data, method = "POST" } = await request.json();

    if (!endpoint) {
      return NextResponse.json(
        { message: "Endpoint is required" },
        { status: 400 }
      );
    }

    // Make request to Python backend
    const response = await fetch(`${PYTHON_BACKEND_URL}${endpoint}`, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    const result = await response.json();

    return NextResponse.json({
      success: response.ok,
      data: result,
      status: response.status,
    });

  } catch (error: any) {
    console.error("Error calling Python backend:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request);
    if (!authResult.isAuthenticated) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const endpoint = url.searchParams.get('endpoint') || '/health';

    // Make request to Python backend
    const response = await fetch(`${PYTHON_BACKEND_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    return NextResponse.json({
      success: response.ok,
      data: result,
      status: response.status,
    });

  } catch (error: any) {
    console.error("Error calling Python backend:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
