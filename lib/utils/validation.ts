/**
 * Validate an email address
 * @param email Email address
 * @returns Whether the email is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate a phone number
 * @param phone Phone number
 * @returns Whether the phone number is valid
 */
export function isValidPhone(phone: string): boolean {
  // Basic validation for Bangladesh phone numbers
  // Allows formats like +8801XXXXXXXXX or 01XXXXXXXXX
  const phoneRegex = /^(?:\+?88)?01[3-9]\d{8}$/
  return phoneRegex.test(phone)
}

/**
 * Validate a password
 * @param password Password
 * @returns Whether the password is valid
 */
export function isValidPassword(password: string): boolean {
  // Password must be at least 6 characters
  return password.length >= 6
}

/**
 * Validate appointment date and time
 * @param date Date string (YYYY-MM-DD)
 * @param time Time string (HH:MM)
 * @returns Whether the date and time are valid
 */
export function isValidAppointmentDateTime(date: string, time: string): boolean {
  // Validate date format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(date)) {
    return false
  }

  // Validate time format
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/
  if (!timeRegex.test(time)) {
    return false
  }

  // Check if date is in the future
  const appointmentDate = new Date(`${date}T${time}:00`)
  const now = new Date()

  return appointmentDate > now
}

/**
 * Sanitize a string for safe storage
 * @param input Input string
 * @returns Sanitized string
 */
export function sanitizeString(input: string): string {
  // Remove HTML tags and trim
  return input.replace(/<[^>]*>/g, "").trim()
}
