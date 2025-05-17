/**
 * Format a date string to a human-readable format
 * @param dateString Date string
 * @returns Formatted date string
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

/**
 * Format a time string to a human-readable format
 * @param timeString Time string (HH:MM)
 * @returns Formatted time string
 */
export function formatTime(timeString: string): string {
  // Parse time string (assuming format like "14:30")
  const [hours, minutes] = timeString.split(":").map(Number)

  // Create a date object with the time
  const date = new Date()
  date.setHours(hours, minutes, 0, 0)

  // Format the time
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

/**
 * Check if a date is in the past
 * @param dateString Date string
 * @returns Whether the date is in the past
 */
export function isDateInPast(dateString: string): boolean {
  const date = new Date(dateString)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date < today
}

/**
 * Get available time slots for a given date
 * @param date Date string
 * @param bookedSlots Array of booked time slots
 * @returns Array of available time slots
 */
export function getAvailableTimeSlots(date: string, bookedSlots: string[] = []): string[] {
  // Define all possible time slots (9 AM to 5 PM)
  const allTimeSlots = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
  ]

  // Filter out booked slots
  return allTimeSlots.filter((slot) => !bookedSlots.includes(slot))
}

/**
 * Group dates by month
 * @param dates Array of date strings
 * @returns Object with dates grouped by month
 */
export function groupDatesByMonth(dates: string[]): Record<string, string[]> {
  return dates.reduce(
    (groups, date) => {
      const monthYear = new Date(date).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })

      if (!groups[monthYear]) {
        groups[monthYear] = []
      }

      groups[monthYear].push(date)
      return groups
    },
    {} as Record<string, string[]>,
  )
}
