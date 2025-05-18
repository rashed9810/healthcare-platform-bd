"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  ChevronDown,
  Clock,
  MapPin,
  Star,
  Video,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React from "react";

// Doctor avatar images
const doctorImages = [
  "/images/doctor-avatar-1.svg",
  "/images/doctor-avatar-2.svg",
  "/images/doctor-avatar-3.svg",
  "/images/doctor-avatar-4.svg",
];

// Default doctor icon - improved silhouette with stethoscope
const defaultDoctorIcon =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSIxMDAiIGZpbGw9IiNFQkYzRkYiLz4KICA8cGF0aCBkPSJNMTAwIDUwQzg2LjE5MzQgNTAgNzUgNjEuMTkzNCA3NSA3NUM3NSA4OC44MDY2IDg2LjE5MzQgMTAwIDEwMCAxMDBDMTEzLjgwNyAxMDAgMTI1IDg4LjgwNjYgMTI1IDc1QzEyNSA2MS4xOTM0IDExMy44MDcgNTAgMTAwIDUwWiIgZmlsbD0iIzNiODJmNiIgZmlsbC1vcGFjaXR5PSIwLjQiLz4KICA8cGF0aCBkPSJNMTQ1IDEzNUMxNDUgMTM1IDE0NSAxMjAgMTM1IDEyMEMxMjUgMTIwIDEyMCAxMzUgMTIwIDEzNSIgc3Ryb2tlPSIjM2I4MmY2IiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgogIDxwYXRoIGQ9Ik0xMzUgMTM1QzEzNSAxMzUgMTM1IDE0MCAxMzAgMTQwQzEyNSAxNDAgMTI1IDEzNSAxMjUgMTM1IiBzdHJva2U9IiMzYjgyZjYiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CiAgPHBhdGggZD0iTTY1IDE1NUM2NSAxMzAuMTQ3IDgyLjkwODYgMTEwIDEwNSAxMTBIOTVDMTE3LjA5MSAxMTAgMTM1IDEzMC4xNDcgMTM1IDE1NVYxNjBDMTM1IDE2Mi43NjEgMTMyLjc2MSAxNjUgMTMwIDE2NUg3MEM2Ny4yMzg2IDE2NSA2NSAxNjIuNzYxIDY1IDE2MFYxNTVaIiBmaWxsPSIjM2I4MmY2IiBmaWxsLW9wYWNpdHk9IjAuNCIvPgo8L3N2Zz4K";

// Mock data for doctors
const mockDoctors = [
  {
    id: 1,
    name: "Dr. Anika Rahman",
    specialty: "General Physician (AI-Powered)",
    location: "Dhaka Medical College Hospital",
    rating: 4.8,
    reviewCount: 124,
    reviews: [
      {
        text: "Dr. Rahman was very thorough and took the time to explain everything clearly.",
        author: "Fatima K.",
      },
      {
        text: "Excellent doctor who really listens to patients. Highly recommended!",
        author: "Ahmed S.",
      },
      {
        text: "Very knowledgeable and professional. The AI-assisted diagnosis was impressive.",
        author: "Noor J.",
      },
    ],
    languages: ["Bengali", "English"],
    availableToday: true,
    nextAvailable: "Available Now: 3:00 PM Today",
    image: doctorImages[0] || defaultDoctorIcon,
    recommended: true,
  },
  {
    id: 2,
    name: "Dr. Kamal Hossain",
    specialty: "Cardiologist",
    location: "Bangabandhu Sheikh Mujib Medical University",
    rating: 4.9,
    reviewCount: 215,
    reviews: [
      {
        text: "Dr. Hossain is an exceptional cardiologist. His expertise saved my life.",
        author: "Rahman M.",
      },
      {
        text: "Very detailed in his explanations and genuinely cares about his patients.",
        author: "Taslima A.",
      },
      {
        text: "The best cardiologist in Dhaka. Worth every taka.",
        author: "Jamal H.",
      },
    ],
    languages: ["Bengali", "English"],
    availableToday: false,
    nextAvailable: "Tomorrow, 10:00 AM",
    image: doctorImages[1] || defaultDoctorIcon,
    recommended: true,
  },
  {
    id: 3,
    name: "Dr. Nusrat Jahan",
    specialty: "Pediatrician",
    location: "Square Hospitals Ltd",
    rating: 4.7,
    reviewCount: 98,
    reviews: [
      {
        text: "Dr. Jahan is amazing with children. My son was immediately comfortable with her.",
        author: "Nasreen F.",
      },
      {
        text: "Very patient and thorough. Explains everything in detail.",
        author: "Karim S.",
      },
      {
        text: "Excellent pediatrician who takes time to address all concerns.",
        author: "Sabina R.",
      },
    ],
    languages: ["Bengali", "English"],
    availableToday: true,
    nextAvailable: "Available Now: 5:30 PM Today",
    image: doctorImages[2] || defaultDoctorIcon,
    recommended: false,
  },
  {
    id: 4,
    name: "Dr. Rafiq Islam",
    specialty: "Neurologist",
    location: "Apollo Hospitals Dhaka",
    rating: 4.6,
    reviewCount: 87,
    reviews: [
      {
        text: "Dr. Islam is extremely knowledgeable and took time to explain my condition.",
        author: "Mahmud K.",
      },
      {
        text: "Very professional and thorough in his examination.",
        author: "Aisha B.",
      },
      {
        text: "Excellent neurologist who really listens to his patients.",
        author: "Rahim T.",
      },
    ],
    languages: ["Bengali", "English"],
    availableToday: false,
    nextAvailable: "Friday, 2:00 PM",
    image: doctorImages[3] || defaultDoctorIcon,
    recommended: false,
  },
];

interface DoctorListProps {
  recommended?: boolean;
  availableToday?: boolean;
  searchQuery?: string;
  specialty?: string;
  location?: string;
  availability?: string;
  onResetFilters?: () => void;
}

// Utility to get initials from doctor name
function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default function DoctorList({
  recommended,
  availableToday,
  searchQuery = "",
  specialty = "any",
  location = "any",
  availability = "any",
  onResetFilters,
}: DoctorListProps) {
  // Function to reset filters
  const resetFilters = () => {
    if (onResetFilters) {
      onResetFilters();
    }
  };
  const [doctors] = useState(mockDoctors);
  const [expandedDoctorId, setExpandedDoctorId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 4;

  // Simulate loading state when filters change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [
    searchQuery,
    specialty,
    location,
    availability,
    recommended,
    availableToday,
  ]);

  // Filter doctors based on all criteria
  const filteredDoctors = doctors.filter((doctor) => {
    // Filter by tab selection
    if (recommended && !doctor.recommended) return false;
    if (availableToday && !doctor.availableToday) return false;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesName = doctor.name.toLowerCase().includes(query);
      const matchesSpecialty = doctor.specialty.toLowerCase().includes(query);
      const matchesLocation = doctor.location.toLowerCase().includes(query);

      if (!matchesName && !matchesSpecialty && !matchesLocation) {
        return false;
      }
    }

    // Filter by specialty
    if (
      specialty !== "any" &&
      !doctor.specialty.toLowerCase().includes(specialty.toLowerCase())
    ) {
      return false;
    }

    // Filter by location
    if (
      location !== "any" &&
      !doctor.location.toLowerCase().includes(location.toLowerCase())
    ) {
      return false;
    }

    // Filter by availability
    if (availability !== "any") {
      if (availability === "today" && !doctor.availableToday) {
        return false;
      }
      // Add more availability filtering logic as needed
    }

    return true;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(
    indexOfFirstDoctor,
    indexOfLastDoctor
  );

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    specialty,
    location,
    availability,
    recommended,
    availableToday,
  ]);

  const toggleExpand = (id: number) => {
    setExpandedDoctorId(expandedDoctorId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="text-center py-12">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
          <p className="text-muted-foreground mt-4">
            Finding doctors that match your criteria...
          </p>
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-muted rounded-lg">
          <p className="text-muted-foreground mb-2">
            No doctors found matching your criteria.
          </p>
          <Button variant="outline" onClick={resetFilters} className="mt-2">
            Reset Filters
          </Button>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-xs md:text-sm text-muted-foreground">
              <span className="hidden sm:inline">Found </span>
              {filteredDoctors.length} doctor
              {filteredDoctors.length !== 1 ? "s" : ""}
              <span className="hidden sm:inline"> matching your criteria</span>
              {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
            </p>
            {totalPages > 1 && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0"
                >
                  &lt;
                </Button>
                <span className="text-sm text-muted-foreground">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    paginate(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 p-0"
                >
                  &gt;
                </Button>
              </div>
            )}
          </div>
          <div className="space-y-6">
            {currentDoctors.map((doctor) => (
              <Card
                key={doctor.id}
                className="overflow-hidden border border-blue-100 dark:border-blue-900/30 transition-all duration-200 hover:border-[#3b82f6]/40 hover:shadow-[0_0_20px_rgba(59,130,246,0.25)] md:h-[280px] rounded-lg shadow-sm"
              >
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-3 p-5 md:p-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-14 w-14 md:h-16 md:w-16 border-2 border-[#3b82f6]/20 shadow-sm">
                          <AvatarImage src={doctor.image} alt={doctor.name} />
                          <AvatarFallback className="bg-[#3b82f6] text-white font-bold text-lg">
                            {getInitials(doctor.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-2">
                            <div>
                              <h3 className="text-base md:text-lg font-bold text-[#111827] dark:text-white tracking-tight">
                                {doctor.name}
                              </h3>
                              <p className="text-xs md:text-sm text-[#3b82f6] dark:text-[#60a5fa] font-medium">
                                {doctor.specialty}
                              </p>
                            </div>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="flex items-center cursor-help bg-amber-50 dark:bg-amber-900/20 px-2 md:px-3 py-1 rounded-md border border-amber-200 dark:border-amber-700/30 shadow-sm">
                                    <Star
                                      className="h-3.5 w-3.5 md:h-4 md:w-4 text-amber-500 mr-1 flex-shrink-0"
                                      fill="#f59e0b"
                                    />
                                    <span className="font-bold text-amber-800 dark:text-amber-400 text-xs md:text-sm">
                                      {doctor.rating}
                                    </span>
                                    <span className="text-amber-700 dark:text-amber-500 ml-0.5 md:ml-1 text-[10px] md:text-xs">
                                      ({doctor.reviewCount})
                                    </span>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent
                                  className="w-80 p-4"
                                  side="bottom"
                                  sideOffset={10}
                                >
                                  <div className="space-y-2">
                                    <h4 className="font-semibold">
                                      Patient Reviews
                                    </h4>
                                    {doctor.reviews.map((review, index) => (
                                      <div
                                        key={index}
                                        className="border-l-2 border-primary/30 pl-3 py-1"
                                      >
                                        <p className="text-sm italic">
                                          "{review.text}"
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                          — {review.author}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>

                          <div className="mt-3 md:mt-4 space-y-2 md:space-y-3">
                            <div className="flex items-center text-xs md:text-sm bg-slate-50 dark:bg-slate-800/50 px-2 py-1 rounded-md">
                              <MapPin className="h-3.5 w-3.5 md:h-4 md:w-4 mr-2 text-slate-500 dark:text-slate-400 flex-shrink-0" />
                              <span className="text-slate-700 dark:text-slate-300">
                                {doctor.location}
                              </span>
                            </div>
                            <div className="flex items-center text-xs md:text-sm">
                              <Clock className="h-3.5 w-3.5 md:h-4 md:w-4 mr-2 text-slate-500 dark:text-slate-400 flex-shrink-0" />
                              <span
                                className={
                                  doctor.availableToday
                                    ? "text-[#22c55e] dark:text-[#4ade80] font-medium"
                                    : "text-slate-700 dark:text-slate-300"
                                }
                              >
                                {doctor.availableToday ? "Available Now: " : ""}
                                {doctor.nextAvailable
                                  .replace("Available Now: ", "")
                                  .replace(", ", " • ")}
                              </span>
                              {doctor.availableToday && (
                                <Badge
                                  variant="secondary"
                                  className="ml-1 md:ml-2 bg-[#dcfce7] text-[#166534] dark:bg-[#166534]/30 dark:text-[#4ade80] hover:bg-[#bbf7d0] dark:hover:bg-[#166534]/50 transition-colors text-[10px] md:text-xs py-0.5 px-2 font-medium border border-[#22c55e]/30"
                                >
                                  Today
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="mt-2 md:mt-3 flex flex-wrap gap-1 md:gap-2">
                            {doctor.languages.map((language) => (
                              <Badge
                                key={language}
                                variant="outline"
                                className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700/30 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-[10px] md:text-xs px-2 py-0.5"
                              >
                                {language}
                              </Badge>
                            ))}
                            {doctor.recommended && (
                              <Badge
                                variant="secondary"
                                className="bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors border-2 border-[#f59e0b] dark:border-[#f59e0b]/50 font-medium text-[10px] md:text-xs px-2 py-0.5 flex items-center"
                              >
                                <Star className="h-2.5 w-2.5 text-amber-500 mr-1" />
                                Recommended
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Brief preview of doctor info - full details on profile page */}
                      <div className="mt-4 pt-4 border-t border-dashed border-blue-100 dark:border-blue-900/30">
                        <div className="text-xs flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-0">
                          <span className="text-slate-600 dark:text-slate-300 font-medium bg-slate-50 dark:bg-slate-800/50 px-2 py-0.5 rounded">
                            MBBS, FCPS ({doctor.specialty.split(" ")[0]})
                          </span>
                          <span className="text-[#3b82f6] dark:text-[#60a5fa] font-medium">
                            {doctor.specialty.includes("AI-Powered")
                              ? "AI-Assisted Diagnosis"
                              : "10+ Years Experience"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons section */}
                    <div className="md:col-span-1 bg-gradient-to-b from-blue-50 to-slate-50 dark:from-slate-900/40 dark:to-slate-800/20 p-5 md:p-6 flex flex-col justify-center items-center gap-4 rounded-r-lg">
                      {/* Primary Button - Book Appointment */}
                      <Button
                        asChild
                        size="lg"
                        className="w-full h-12 transition-all duration-150 hover:scale-[1.02] hover:shadow-[0_0_8px_rgba(59,130,246,0.4)] bg-[#3b82f6] hover:bg-[#2563eb] text-white font-medium flex items-center justify-center"
                      >
                        <Link
                          href={`/book-appointment/${doctor.id}`}
                          className="flex items-center justify-center w-full"
                        >
                          <Calendar className="h-5 w-5 mr-2" />
                          <span>Book Appointment</span>
                        </Link>
                      </Button>

                      {/* Outlined Button - Video Consultation */}
                      <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="w-full h-12 transition-all duration-150 hover:scale-[1.02] hover:shadow-[0_0_8px_rgba(59,130,246,0.2)] border-2 border-[#3b82f6] text-[#3b82f6] hover:bg-[#3b82f6]/5 flex items-center justify-center"
                      >
                        <Link
                          href={`/book-appointment/${doctor.id}?type=video`}
                          className="flex items-center justify-center w-full"
                        >
                          <Video className="h-5 w-5 mr-2" />
                          <span>Video Consultation</span>
                        </Link>
                      </Button>

                      {/* Secondary Button - View Full Profile */}
                      <Button
                        asChild
                        size="lg"
                        className="w-full h-12 transition-all duration-150 hover:scale-[1.02] bg-[#1f2937] hover:bg-[#111827] text-white font-medium flex items-center justify-center"
                      >
                        <Link
                          href={`/doctor/${doctor.id}`}
                          className="flex items-center justify-center w-full"
                        >
                          <span>View Full Profile</span>
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Bottom pagination controls */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 md:mt-8">
              <div className="flex flex-wrap justify-center items-center gap-2 md:space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => paginate(1)}
                  disabled={currentPage === 1}
                  className="hidden md:inline-flex h-8 px-2"
                >
                  First
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0"
                >
                  &lt;
                </Button>

                {/* Page numbers */}
                <div className="hidden md:flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={i}
                        variant={
                          currentPage === pageNum ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => paginate(pageNum)}
                        className={`h-8 w-8 p-0 ${
                          currentPage === pageNum
                            ? "bg-[#3b82f6] text-white"
                            : ""
                        }`}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                {/* Mobile page indicator */}
                <div className="flex md:hidden items-center px-2 py-1 bg-muted/30 rounded-md">
                  <span className="text-sm font-medium">
                    {currentPage} / {totalPages}
                  </span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    paginate(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 p-0"
                >
                  &gt;
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => paginate(totalPages)}
                  disabled={currentPage === totalPages}
                  className="hidden md:inline-flex h-8 px-2"
                >
                  Last
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
