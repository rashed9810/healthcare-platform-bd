import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Video, MapPin } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function AppointmentsPage() {
  // Mock data for appointments
  const upcomingAppointments = [
    {
      id: 1,
      doctor: {
        name: "Dr. Anika Rahman",
        specialty: "General Physician",
        image: "/placeholder.svg?height=100&width=100",
      },
      date: "May 18, 2025",
      time: "3:00 PM",
      type: "Video Consultation",
      status: "confirmed",
    },
    {
      id: 2,
      doctor: {
        name: "Dr. Kamal Hossain",
        specialty: "Cardiologist",
        image: "/placeholder.svg?height=100&width=100",
      },
      date: "May 25, 2025",
      time: "10:00 AM",
      type: "In-Person Visit",
      status: "confirmed",
    },
  ]

  const pastAppointments = [
    {
      id: 3,
      doctor: {
        name: "Dr. Nusrat Jahan",
        specialty: "Pediatrician",
        image: "/placeholder.svg?height=100&width=100",
      },
      date: "April 10, 2025",
      time: "2:30 PM",
      type: "Video Consultation",
      status: "completed",
    },
    {
      id: 4,
      doctor: {
        name: "Dr. Rafiq Islam",
        specialty: "Neurologist",
        image: "/placeholder.svg?height=100&width=100",
      },
      date: "March 22, 2025",
      time: "11:00 AM",
      type: "In-Person Visit",
      status: "completed",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Appointments</h1>
            <p className="text-muted-foreground mt-1">Manage your upcoming and past appointments</p>
          </div>
          <Button asChild>
            <Link href="/find-doctor">Book New Appointment</Link>
          </Button>
        </div>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-0">
            {upcomingAppointments.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Upcoming Appointments</h3>
                  <p className="text-muted-foreground text-center max-w-md mb-6">
                    You don't have any upcoming appointments scheduled. Book a consultation with a doctor.
                  </p>
                  <Button asChild>
                    <Link href="/find-doctor">Find a Doctor</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {upcomingAppointments.map((appointment) => (
                  <Card key={appointment.id}>
                    <CardContent className="p-0">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-3 p-6">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage
                                src={appointment.doctor.image || "/placeholder.svg"}
                                alt={appointment.doctor.name}
                              />
                              <AvatarFallback>
                                {appointment.doctor.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                <div>
                                  <h3 className="font-semibold">{appointment.doctor.name}</h3>
                                  <p className="text-muted-foreground">{appointment.doctor.specialty}</p>
                                </div>
                                <Badge variant="outline" className="w-fit">
                                  {appointment.type}
                                </Badge>
                              </div>

                              <div className="mt-4 flex flex-col sm:flex-row gap-4">
                                <div className="flex items-center text-sm">
                                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <span>{appointment.date}</span>
                                </div>
                                <div className="flex items-center text-sm">
                                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <span>{appointment.time}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="md:col-span-1 bg-muted p-6 flex flex-col justify-center items-center gap-3">
                          {appointment.type === "Video Consultation" ? (
                            <Button asChild className="w-full">
                              <Link href={`/appointments/join/${appointment.id}`}>
                                <Video className="mr-2 h-4 w-4" />
                                Join Call
                              </Link>
                            </Button>
                          ) : (
                            <Button asChild className="w-full">
                              <Link href={`/appointments/directions/${appointment.id}`}>
                                <MapPin className="mr-2 h-4 w-4" />
                                Get Directions
                              </Link>
                            </Button>
                          )}
                          <Button variant="outline" asChild className="w-full">
                            <Link href={`/appointments/reschedule/${appointment.id}`}>Reschedule</Link>
                          </Button>
                          <Button variant="link" asChild className="w-full">
                            <Link href={`/appointments/details/${appointment.id}`}>View Details</Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="mt-0">
            {pastAppointments.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Past Appointments</h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    You don't have any past appointments. Once you complete a consultation, it will appear here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {pastAppointments.map((appointment) => (
                  <Card key={appointment.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={appointment.doctor.image || "/placeholder.svg"}
                            alt={appointment.doctor.name}
                          />
                          <AvatarFallback>
                            {appointment.doctor.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <div>
                              <h3 className="font-semibold">{appointment.doctor.name}</h3>
                              <p className="text-muted-foreground">{appointment.doctor.specialty}</p>
                            </div>
                            <Badge variant="outline" className="w-fit">
                              {appointment.type}
                            </Badge>
                          </div>

                          <div className="mt-4 flex flex-col sm:flex-row gap-4">
                            <div className="flex items-center text-sm">
                              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{appointment.date}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{appointment.time}</span>
                            </div>
                          </div>

                          <div className="mt-4 flex flex-wrap gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/appointments/details/${appointment.id}`}>View Details</Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/prescriptions/${appointment.id}`}>View Prescription</Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/book-appointment/${appointment.doctor.id}`}>Book Again</Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
