"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";
import {
  Filter,
  Search as SearchIcon,
  MapPin,
  Navigation,
  Loader2,
  AlertCircle,
  Star,
  Clock,
  Users,
  Heart,
  Brain,
  Eye,
  Bone,
  Baby,
  Stethoscope,
  CheckCircle,
  ArrowRight,
  SlidersHorizontal,
  Calendar,
  Video,
  Globe,
} from "lucide-react";
import DoctorList from "@/components/doctor-list";
import { getDoctors } from "@/lib/api/doctors";
import { Loading, LoadingGrid } from "@/components/ui/loading";
import LocationFinder from "@/components/geolocation/location-finder";
import type { Doctor } from "@/lib/api/types";

// Specialty icons mapping
const specialtyIcons = {
  "General Physician": <Stethoscope className="h-5 w-5" />,
  Cardiologist: <Heart className="h-5 w-5" />,
  Neurologist: <Brain className="h-5 w-5" />,
  "Orthopedic Surgeon": <Bone className="h-5 w-5" />,
  Pediatrician: <Baby className="h-5 w-5" />,
  Gynecologist: <Users className="h-5 w-5" />,
  Ophthalmologist: <Eye className="h-5 w-5" />,
};

export default function FindDoctorPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    specialty: "all",
    location: "all",
    language: "all",
    availability: "any",
    rating: "any",
  });
  const [isFiltering, setIsFiltering] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState("rating"); // rating, distance, availability, name

  // Fetch doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        setError(null);
        const doctorData = await getDoctors(filters);
        setDoctors(doctorData);
      } catch (err: any) {
        console.error("Error fetching doctors:", err);

        // Provide fallback mock data if API fails
        const fallbackDoctors = [
          {
            id: "1",
            name: "Dr. Anika Rahman",
            specialty: "General Physician",
            location: "Dhaka Medical College Hospital",
            rating: 4.8,
            reviewCount: 124,
            languages: ["Bengali", "English"],
            availableToday: true,
            nextAvailable: "Today, 3:00 PM",
            image: "/images/doctor-avatar-1.svg",
            consultationFee: 800,
            experience: "10+ years",
            reviews: [
              {
                text: "Dr. Rahman is very caring and professional. Highly recommended!",
                author: "Sarah Ahmed",
              },
              {
                text: "Excellent diagnosis and treatment. Very satisfied with the care.",
                author: "Mohammad Khan",
              },
            ],
          },
          {
            id: "2",
            name: "Dr. Mohammad Hasan",
            specialty: "Cardiologist",
            location: "Square Hospital",
            rating: 4.9,
            reviewCount: 89,
            languages: ["Bengali", "English"],
            availableToday: true,
            nextAvailable: "Today, 4:00 PM",
            image: "/images/doctor-avatar-2.svg",
            consultationFee: 1200,
            experience: "15+ years",
            reviews: [
              {
                text: "Outstanding cardiologist. Saved my life with his expertise.",
                author: "Fatima Begum",
              },
              {
                text: "Very knowledgeable and explains everything clearly.",
                author: "Abdul Rahman",
              },
            ],
          },
        ];

        setDoctors(fallbackDoctors);
        setError("Using offline data. Some features may be limited.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [filters]);

  // Filter and sort doctors based on search, active tab, and sort preference
  const filteredDoctors = doctors
    .filter((doctor) => {
      const matchesSearch =
        searchQuery === "" ||
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTab =
        activeTab === "all" ||
        (activeTab === "available" && doctor.availableToday) ||
        (activeTab === "recommended" && doctor.rating >= 4.5);

      return matchesSearch && matchesTab;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "distance":
          // Extract numeric value from distance string (e.g., "2.3 km" -> 2.3)
          const distanceA = parseFloat(
            a.distance?.replace(/[^\d.]/g, "") || "999"
          );
          const distanceB = parseFloat(
            b.distance?.replace(/[^\d.]/g, "") || "999"
          );
          return distanceA - distanceB;
        case "availability":
          // Available today first, then by rating
          if (a.availableToday && !b.availableToday) return -1;
          if (!a.availableToday && b.availableToday) return 1;
          return b.rating - a.rating;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return b.rating - a.rating;
      }
    });

  const applyFilters = () => {
    setIsFiltering(
      (filters.specialty !== "" && filters.specialty !== "all") ||
        (filters.location !== "" && filters.location !== "all") ||
        (filters.language !== "" && filters.language !== "all") ||
        (filters.availability !== "" && filters.availability !== "any") ||
        (filters.rating !== "" && filters.rating !== "any")
    );
  };

  const resetFilters = () => {
    setFilters({
      specialty: "all",
      location: "all",
      language: "all",
      availability: "any",
      rating: "any",
    });
    setSearchQuery("");
    setIsFiltering(false);
  };

  useEffect(() => {
    applyFilters();
  }, [filters]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-teal-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Perfect Doctor
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Search for healthcare professionals based on specialty, location,
              and availability
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by doctor name, specialty, or hospital..."
                  className="pl-12 pr-4 py-4 text-lg bg-white/95 backdrop-blur border-0 shadow-lg focus:shadow-xl transition-all duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Total Doctors</h3>
              <p className="text-2xl font-bold text-blue-600">
                {doctors.length}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Available Today</h3>
              <p className="text-2xl font-bold text-green-600">
                {doctors.filter((d) => d.availableToday).length}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Top Rated</h3>
              <p className="text-2xl font-bold text-yellow-600">
                {doctors.filter((d) => d.rating >= 4.5).length}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Video className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Video Consult</h3>
              <p className="text-2xl font-bold text-purple-600">
                {doctors.length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filter Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur border-0 shadow-lg">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              All Doctors
            </TabsTrigger>
            <TabsTrigger
              value="location"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              📍 Near Me
            </TabsTrigger>
            <TabsTrigger
              value="recommended"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Recommended
            </TabsTrigger>
            <TabsTrigger
              value="available"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Available Today
            </TabsTrigger>
          </TabsList>

          {/* Location Tab Content */}
          {activeTab === "location" && (
            <div className="mt-8">
              <LocationFinder
                language="en"
                onLocationFound={(location) => {
                  console.log("Location found:", location);
                }}
                onDoctorsFound={(doctors) => {
                  console.log("Nearby doctors:", doctors);
                }}
              />
            </div>
          )}
        </Tabs>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Mobile Filter Button */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full bg-white/80 backdrop-blur border-0 shadow-lg"
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                  {isFiltering && (
                    <Badge
                      variant="secondary"
                      className="ml-2 bg-blue-100 text-blue-700"
                    >
                      Active
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[80vh]">
                <SheetHeader>
                  <SheetTitle>Filter Doctors</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  {/* Mobile filter content - same as desktop */}
                  <div className="space-y-3">
                    <Label>Specialty</Label>
                    <Select
                      value={filters.specialty}
                      onValueChange={(value) =>
                        setFilters({ ...filters, specialty: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Specialty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Specialties</SelectItem>
                        <SelectItem value="General Physician">
                          General Physician
                        </SelectItem>
                        <SelectItem value="Cardiologist">
                          Cardiologist
                        </SelectItem>
                        <SelectItem value="Neurologist">Neurologist</SelectItem>
                        <SelectItem value="Orthopedic Surgeon">
                          Orthopedic Surgeon
                        </SelectItem>
                        <SelectItem value="Pediatrician">
                          Pediatrician
                        </SelectItem>
                        <SelectItem value="Gynecologist">
                          Gynecologist
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label>Location</Label>
                    <Select
                      value={filters.location}
                      onValueChange={(value) =>
                        setFilters({ ...filters, location: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        <SelectItem value="Dhaka">Dhaka</SelectItem>
                        <SelectItem value="Chittagong">Chittagong</SelectItem>
                        <SelectItem value="Khulna">Khulna</SelectItem>
                        <SelectItem value="Rajshahi">Rajshahi</SelectItem>
                        <SelectItem value="Sylhet">Sylhet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label>Availability</Label>
                    <Select
                      value={filters.availability}
                      onValueChange={(value) =>
                        setFilters({ ...filters, availability: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Availability" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any Time</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="tomorrow">Tomorrow</SelectItem>
                        <SelectItem value="this-week">This Week</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label>Minimum Rating</Label>
                    <Select
                      value={filters.rating}
                      onValueChange={(value) =>
                        setFilters({ ...filters, rating: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any Rating</SelectItem>
                        <SelectItem value="4.5">4.5+ Stars</SelectItem>
                        <SelectItem value="4.0">4.0+ Stars</SelectItem>
                        <SelectItem value="3.5">3.5+ Stars</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {isFiltering && (
                    <Button
                      variant="outline"
                      onClick={resetFilters}
                      className="w-full"
                    >
                      Clear All Filters
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Filters Sidebar */}
          <div className="lg:col-span-1 hidden lg:block">
            <Card className="bg-white/80 backdrop-blur border-0 shadow-lg sticky top-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <SlidersHorizontal className="h-5 w-5" />
                    Filters
                  </CardTitle>
                  {isFiltering && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetFilters}
                      className="text-xs"
                    >
                      Clear All
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Specialty Filter */}
                <div className="space-y-3">
                  <Label>Specialty</Label>
                  <Select
                    value={filters.specialty}
                    onValueChange={(value) =>
                      setFilters({ ...filters, specialty: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Specialties</SelectItem>
                      <SelectItem value="General Physician">
                        General Physician
                      </SelectItem>
                      <SelectItem value="Cardiologist">Cardiologist</SelectItem>
                      <SelectItem value="Neurologist">Neurologist</SelectItem>
                      <SelectItem value="Orthopedic Surgeon">
                        Orthopedic Surgeon
                      </SelectItem>
                      <SelectItem value="Pediatrician">Pediatrician</SelectItem>
                      <SelectItem value="Gynecologist">Gynecologist</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Location Filter */}
                <div className="space-y-3">
                  <Label>Location</Label>
                  <Select
                    value={filters.location}
                    onValueChange={(value) =>
                      setFilters({ ...filters, location: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="Dhaka">Dhaka</SelectItem>
                      <SelectItem value="Chittagong">Chittagong</SelectItem>
                      <SelectItem value="Khulna">Khulna</SelectItem>
                      <SelectItem value="Rajshahi">Rajshahi</SelectItem>
                      <SelectItem value="Sylhet">Sylhet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Availability Filter */}
                <div className="space-y-3">
                  <Label>Availability</Label>
                  <Select
                    value={filters.availability}
                    onValueChange={(value) =>
                      setFilters({ ...filters, availability: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="tomorrow">Tomorrow</SelectItem>
                      <SelectItem value="this-week">This Week</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Rating Filter */}
                <div className="space-y-3">
                  <Label>Minimum Rating</Label>
                  <Select
                    value={filters.rating}
                    onValueChange={(value) =>
                      setFilters({ ...filters, rating: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Rating</SelectItem>
                      <SelectItem value="4.5">4.5+ Stars</SelectItem>
                      <SelectItem value="4.0">4.0+ Stars</SelectItem>
                      <SelectItem value="3.5">3.5+ Stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Doctor List */}
          <div className="lg:col-span-3">
            {loading ? (
              <Loading
                variant="healthcare"
                size="lg"
                text="Finding the best doctors for you..."
                className="py-16"
              />
            ) : error ? (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Unable to Load Doctors
                  </h3>
                  <p className="text-gray-600 mb-6">{error}</p>
                  <Button
                    onClick={() => window.location.reload()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {filteredDoctors.length} Doctor
                    {filteredDoctors.length !== 1 ? "s" : ""} Found
                  </h2>

                  <div className="flex items-center gap-3">
                    {/* Sort Dropdown */}
                    <div className="flex items-center gap-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Sort by:
                      </Label>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rating">⭐ Rating</SelectItem>
                          <SelectItem value="distance">📍 Distance</SelectItem>
                          <SelectItem value="availability">
                            🕐 Availability
                          </SelectItem>
                          <SelectItem value="name">📝 Name</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200"
                    >
                      {activeTab === "all"
                        ? "All"
                        : activeTab === "recommended"
                        ? "Recommended"
                        : "Available Today"}
                    </Badge>
                  </div>
                </div>

                <DoctorList doctors={filteredDoctors} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
