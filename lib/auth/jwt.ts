import jwt from "jsonwebtoken"
import type { User } from "../db/schema"

// JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// JWT expiration time
const JWT_EXPIRES_IN = "7d"

// JWT payload interface
export interface JwtPayload {
  id: string
  email: string
  role: string
  iat: number
  exp: number
}

/**
 * Generate a JWT token for a user
 * @param user User object
 * @returns JWT token
 */
export function generateToken(user: Partial<User>): string {
  const payload = {
    id: user._id?.toString(),
    email: user.email,
    role: user.role,
  }

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

/**
 * Verify a JWT token
 * @param token JWT token
 * @returns Decoded token payload or null if invalid
 */
export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload
  } catch (error) {
    return null
  }
}

/**
 * Extract token from Authorization header
 * @param authHeader Authorization header
 * @returns JWT token or null if not found
 */
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }

  return authHeader.split(" ")[1]
}
