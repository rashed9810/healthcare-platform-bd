"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Activity, DollarSign, Search, Plus, Edit, Trash2, CheckCircle, XCircle } from "lucide-react"

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")

  // Mock data for doctors
  const doctors = [
    {
      id: "doc-1",
      name: "Dr. Anika Rahman",
      specialty: "General Physician",
      appointments: 124,
      rating: 4.8,
      status: "active",
    },
    {
      id: "doc-2",
      name: "Dr. Kamal Hossain",
      specialty: "Cardiologist",
      appointments: 98,
      rating: 4.9,
      status: "active",
    },
    {
      id: "doc-3",
      name: "Dr. Nusrat Jahan",
      specialty: "Pediatrician",
      appointments: 76,
      rating: 4.7,
      status: "inactive",
    },
  ]

  // Mock data for appointments
  const appointments = [
    {
      id: "apt-1",
      patient: "Rahima Begum",
      doctor: "Dr. Anika Rahman",
      date: "May 18, 2025",
      time: "10:00 AM",
      type: "Video",
      status: "confirmed",
    },
    {
      id: "apt-2",
      patient: "Abdul Karim",
      doctor: "Dr. Kamal Hossain",
      date: "May 18, 2025",
      time: "11:30 AM",
      type: "In-Person",
      status: "confirmed",
    },
    {
      id: "apt-3",
      patient: "Fatima Khan",
      doctor: "Dr. Nusrat Jahan",
      date: "May 18, 2025",
      time: "2:00 PM",
      type: "Video",
      status: "cancelled",
    },
  ]

  // Filter doctors based on search term
  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Filter appointments based on search term
  const filteredAppointments = appointments.filter(
    (appointment) =>
      appointment.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage doctors, appointments, and system settings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="flex flex-row items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Appointments</p>
              <p className="text-3xl font-bold">248</p>
            </div>
            <Calendar className="h-8 w-8 text-primary" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-row items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Doctors</p>
              <p className="text-3xl font-bold">12</p>
            </div>
            <Users className="h-8 w-8 text-primary" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-row items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Patient Satisfaction</p>
              <p className="text-3xl font-bold">92%</p>
            </div>
            <Activity className="h-8 w-8 text-primary" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-row items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Revenue</p>
              <p className="text-3xl font-bold">৳45,280</p>
            </div>
            <DollarSign className="h-8 w-8 text-primary" />
          </CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search doctors, patients..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="doctors" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="doctors">Doctors</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="doctors" className="mt-0">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Doctors</CardTitle>
                <CardDescription>Manage healthcare professionals</CardDescription>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Doctor
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Specialty</TableHead>
                    <TableHead>Appointments</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDoctors.map((doctor) => (
                    <TableRow key={doctor.id}>
                      <TableCell className="font-medium">{doctor.name}</TableCell>
                      <TableCell>{doctor.specialty}</TableCell>
                      <TableCell>{doctor.appointments}</TableCell>
                      <TableCell>{doctor.rating}</TableCell>
                      <TableCell>
                        <Badge variant={doctor.status === "active" ? "default" : "secondary"}>
                          {doctor.status === "active" ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="ghost">
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button size="sm" variant="ghost" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments" className="mt-0">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Appointments</CardTitle>
                <CardDescription>View and manage patient appointments</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell className="font-medium">{appointment.patient}</TableCell>
                      <TableCell>{appointment.doctor}</TableCell>
                      <TableCell>{`${appointment.date}, ${appointment.time}`}</TableCell>
                      <TableCell>{appointment.type}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            appointment.status === "confirmed"
                              ? "default"
                              : appointment.status === "cancelled"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="ghost">
                            <CheckCircle className="h-4 w-4" />
                            <span className="sr-only">Confirm</span>
                          </Button>
                          <Button size="sm" variant="ghost" className="text-destructive">
                            <XCircle className="h-4 w-4" />
                            <span className="sr-only">Cancel</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>Configure application settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input id="siteName" defaultValue="HealthConnect Bangladesh" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input id="contactEmail" defaultValue="support@healthconnect.bd" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="appointmentBuffer">Appointment Buffer (minutes)</Label>
                <Input id="appointmentBuffer" type="number" defaultValue="15" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxDailyAppointments">Maximum Daily Appointments per Doctor</Label>
                <Input id="maxDailyAppointments" type="number" defaultValue="20" />
              </div>

              <Button>Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
