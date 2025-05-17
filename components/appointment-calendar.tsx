"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

interface AppointmentCalendarProps {
  onDateSelect: (date: string) => void
  onTimeSelect: (time: string) => void
  selectedDate: string | null
  selectedTime: string | null
}

export default function AppointmentCalendar({
  onDateSelect,
  onTimeSelect,
  selectedDate,
  selectedTime,
}: AppointmentCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(undefined)

  // Generate available time slots
  const generateTimeSlots = () => {
    // In a real app, these would come from the backend based on doctor availability
    const morningSlots = ["09:00 AM", "10:00 AM", "11:00 AM"]
    const afternoonSlots = ["01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"]
    const eveningSlots = ["05:00 PM", "06:00 PM", "07:00 PM"]

    return {
      morning: morningSlots,
      afternoon: afternoonSlots,
      evening: eveningSlots,
    }
  }

  const timeSlots = generateTimeSlots()

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate)

    if (newDate) {
      const formattedDate = newDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })

      onDateSelect(formattedDate)
    }
  }

  const handleTimeSelect = (time: string) => {
    onTimeSelect(time)
  }

  const formatDateForDisplay = (date: Date | undefined) => {
    if (!date) return "Select a date"

    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Select Date</h3>
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateChange}
          disabled={(date) => {
            // Disable past dates and weekends (for demo)
            const today = new Date()
            today.setHours(0, 0, 0, 0)

            return (
              date < today || date.getDay() === 0 // Sunday
            )
          }}
          className="rounded-md border"
        />
      </div>

      {date && (
        <div>
          <h3 className="text-lg font-medium mb-2">Select Time - {formatDateForDisplay(date)}</h3>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Morning</h4>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.morning.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    className={cn("text-sm", selectedTime === time && "bg-primary text-primary-foreground")}
                    onClick={() => handleTimeSelect(time)}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Afternoon</h4>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.afternoon.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    className={cn("text-sm", selectedTime === time && "bg-primary text-primary-foreground")}
                    onClick={() => handleTimeSelect(time)}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Evening</h4>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.evening.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    className={cn("text-sm", selectedTime === time && "bg-primary text-primary-foreground")}
                    onClick={() => handleTimeSelect(time)}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
