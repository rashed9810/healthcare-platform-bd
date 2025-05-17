"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Star, Video } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock data for doctors
const mockDoctors = [
  {
    id: 1,
    name: "Dr. Anika Rahman",
    specialty: "General Physician",
    location: "Dhaka Medical College Hospital",
    rating: 4.8,
    reviewCount: 124,
    languages: ["Bengali", "English"],
    availableToday: true,
    nextAvailable: "Today, 3:00 PM",
    image: "/placeholder.svg?height=100&width=100",
    recommended: true,
  },
  {
    id: 2,
    name: "Dr. Kamal Hossain",
    specialty: "Cardiologist",
    location: "Bangabandhu Sheikh Mujib Medical University",
    rating: 4.9,
    reviewCount: 215,
    languages: ["Bengali", "English"],
    availableToday: false,
    nextAvailable: "Tomorrow, 10:00 AM",
    image: "/placeholder.svg?height=100&width=100",
    recommended: true,
  },
  {
    id: 3,
    name: "Dr. Nusrat Jahan",
    specialty: "Pediatrician",
    location: "Square Hospitals Ltd",
    rating: 4.7,
    reviewCount: 98,
    languages: ["Bengali", "English"],
    availableToday: true,
    nextAvailable: "Today, 5:30 PM",
    image: "/placeholder.svg?height=100&width=100",
    recommended: false,
  },
  {
    id: 4,
    name: "Dr. Rafiq Islam",
    specialty: "Neurologist",
    location: "Apollo Hospitals Dhaka",
    rating: 4.6,
    reviewCount: 87,
    languages: ["Bengali", "English"],
    availableToday: false,
    nextAvailable: "Friday, 2:00 PM",
    image: "/placeholder.svg?height=100&width=100",
    recommended: false,
  },
]

interface DoctorListProps {
  recommended?: boolean
  availableToday?: boolean
}

export default function DoctorList({ recommended, availableToday }: DoctorListProps) {
  const [doctors, setDoctors] = useState(mockDoctors)

  // Filter doctors based on props
  const filteredDoctors = doctors.filter((doctor) => {
    if (recommended && !doctor.recommended) return false
    if (availableToday && !doctor.availableToday) return false
    return true
  })

  return (
    <div className="space-y-6">
      {filteredDoctors.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No doctors found matching your criteria.</p>
        </div>
      ) : (
        filteredDoctors.map((doctor) => (
          <Card key={doctor.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-3 p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={doctor.image || "/placeholder.svg"} alt={doctor.name} />
                      <AvatarFallback>
                        {doctor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div>
                          <h3 className="text-lg font-semibold">{doctor.name}</h3>
                          <p className="text-muted-foreground">{doctor.specialty}</p>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="font-medium">{doctor.rating}</span>
                          <span className="text-muted-foreground ml-1">({doctor.reviewCount} reviews)</span>
                        </div>
                      </div>

                      <div className="mt-4 space-y-2">
                        <div className="flex items-center text-sm">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{doctor.location}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Next available: {doctor.nextAvailable}</span>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {doctor.languages.map((language) => (
                          <Badge key={language} variant="outline">
                            {language}
                          </Badge>
                        ))}
                        {doctor.availableToday && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
                            Available Today
                          </Badge>
                        )}
                        {doctor.recommended && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                            Recommended
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-1 bg-muted p-6 flex flex-col justify-center items-center gap-3">
                  <Button asChild className="w-full">
                    <Link href={`/book-appointment/${doctor.id}`}>
                      <Calendar className="mr-2 h-4 w-4" />
                      Book Appointment
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Video className="mr-2 h-4 w-4" />
                    Video Consultation
                  </Button>
                  <Button variant="link" className="w-full">
                    View Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
