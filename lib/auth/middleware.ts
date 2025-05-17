import { type NextRequest, NextResponse } from "next/server"
import { verifyToken, extractTokenFromHeader } from "./jwt"
import { getUsersCollection } from "../db/mongodb"
import { ObjectId } from "mongodb"

/**
 * Authentication middleware result
 */
export interface AuthResult {
  isAuthenticated: boolean
  user?: {
    id: string
    email: string
    role: string
  }
  error?: string
}

/**
 * Verify authentication from request
 * @param request Next.js request
 * @returns Authentication result
 */
export async function verifyAuth(request: Request | NextRequest): Promise<AuthResult> {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get("Authorization")
    const token = extractTokenFromHeader(authHeader)

    if (!token) {
      return { isAuthenticated: false, error: "No token provided" }
    }

    // Verify token
    const decoded = verifyToken(token)
    if (!decoded) {
      return { isAuthenticated: false, error: "Invalid token" }
    }

    // Get user from database
    const usersCollection = await getUsersCollection()
    const user = await usersCollection.findOne({ _id: new ObjectId(decoded.id) })

    if (!user) {
      return { isAuthenticated: false, error: "User not found" }
    }

    return {
      isAuthenticated: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      },
    }
  } catch (error) {
    console.error("Auth verification error:", error)
    return { isAuthenticated: false, error: "Authentication error" }
  }
}

/**
 * Check if user has required role
 * @param authResult Authentication result
 * @param roles Allowed roles
 * @returns Whether user has required role
 */
export function hasRole(authResult: AuthResult, roles: string[]): boolean {
  if (!authResult.isAuthenticated || !authResult.user) {
    return false
  }

  return roles.includes(authResult.user.role)
}

/**
 * Create a response for unauthorized access
 * @param message Error message
 * @returns Next.js response
 */
export function unauthorizedResponse(message = "Unauthorized"): NextResponse {
  return NextResponse.json({ success: false, error: message }, { status: 401 })
}

/**
 * Create a response for forbidden access
 * @param message Error message
 * @returns Next.js response
 */
export function forbiddenResponse(message = "Forbidden"): NextResponse {
  return NextResponse.json({ success: false, error: message }, { status: 403 })
}
