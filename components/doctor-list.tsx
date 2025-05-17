"use client";

import { useState } from "react";
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

// Doctor avatar images
const doctorImages = [
  "/images/doctor-avatar-1.png",
  "/images/doctor-avatar-2.png",
  "/images/doctor-avatar-3.png",
  "/images/doctor-avatar-4.png",
];

// Default doctor icon
const defaultDoctorIcon =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iMTAwIiBmaWxsPSIjRTJFOEYwIi8+CjxwYXRoIGQ9Ik0xMDAgNTVDODguOTU0MyA1NSA4MCA2My45NTQzIDgwIDc1QzgwIDg2LjA0NTcgODguOTU0MyA5NSAxMDAgOTVDMTExLjA0NiA5NSAxMjAgODYuMDQ1NyAxMjAgNzVDMTIwIDYzLjk1NDMgMTExLjA0NiA1NSAxMDAgNTVaIiBmaWxsPSIjOTRBM0IzIi8+CjxwYXRoIGQ9Ik02NSAxNTVDNjUgMTM0LjAxMyA4Mi4wMTMyIDExNyAxMDMgMTE3SDk3QzExNy45ODcgMTE3IDEzNSAxMzQuMDEzIDEzNSAxNTVWMTYwQzEzNSAxNjIuNzYxIDEzMi43NjEgMTY1IDEzMCAxNjVINzBDNjcuMjM4NiAxNjUgNjUgMTYyLjc2MSA2NSAxNjBWMTU1WiIgZmlsbD0iIzk0QTNCMyIvPgo8L3N2Zz4K";

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
}

export default function DoctorList({
  recommended,
  availableToday,
}: DoctorListProps) {
  const [doctors] = useState(mockDoctors);
  const [expandedDoctorId, setExpandedDoctorId] = useState<number | null>(null);

  // Filter doctors based on props
  const filteredDoctors = doctors.filter((doctor) => {
    if (recommended && !doctor.recommended) return false;
    if (availableToday && !doctor.availableToday) return false;
    return true;
  });

  const toggleExpand = (id: number) => {
    setExpandedDoctorId(expandedDoctorId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {filteredDoctors.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No doctors found matching your criteria.
          </p>
        </div>
      ) : (
        filteredDoctors.map((doctor) => (
          <Card
            key={doctor.id}
            className="overflow-hidden border border-border/50 hover:border-primary/30 transition-colors duration-200"
          >
            <CardContent className="p-0">
              <Collapsible open={expandedDoctorId === doctor.id}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-3 p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16 border-2 border-muted">
                        <AvatarImage src={doctor.image} alt={doctor.name} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {doctor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                          <div>
                            <h3 className="text-lg font-semibold text-[#111827] dark:text-white">
                              {doctor.name}
                            </h3>
                            <p className="text-[#4b5563] dark:text-muted-foreground">
                              {doctor.specialty}
                            </p>
                          </div>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center cursor-help">
                                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                                  <span className="font-medium">
                                    {doctor.rating}
                                  </span>
                                  <span className="text-muted-foreground ml-1">
                                    ({doctor.reviewCount} reviews)
                                  </span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className="w-80 p-4">
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

                        <div className="mt-4 space-y-2">
                          <div className="flex items-center text-sm">
                            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{doctor.location}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{doctor.nextAvailable}</span>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {doctor.languages.map((language) => (
                            <Badge
                              key={language}
                              variant="outline"
                              className="cursor-pointer hover:bg-primary/5 transition-colors"
                            >
                              {language}
                            </Badge>
                          ))}
                          {doctor.availableToday && (
                            <Badge
                              variant="secondary"
                              className="bg-green-100 text-green-800 hover:bg-green-200 transition-colors"
                            >
                              Available Today
                            </Badge>
                          )}
                          {doctor.recommended && (
                            <Badge
                              variant="secondary"
                              className="bg-amber-50 text-amber-800 border-2 border-amber-200 hover:bg-amber-100 transition-colors"
                            >
                              Recommended
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <CollapsibleContent className="mt-4 pt-4 border-t">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-[#111827] dark:text-white mb-2">
                            About
                          </h4>
                          <p className="text-sm text-[#4b5563] dark:text-muted-foreground">
                            Dr. {doctor.name.split(" ")[1]} is a highly
                            experienced{" "}
                            {doctor.specialty.split(" ")[0].toLowerCase()} with
                            over 10 years of practice.
                            {doctor.specialty.includes("AI-Powered") &&
                              " They utilize cutting-edge AI technology to assist with diagnoses and treatment plans."}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium text-[#111827] dark:text-white mb-2">
                            Education
                          </h4>
                          <ul className="text-sm text-[#4b5563] dark:text-muted-foreground space-y-1 list-disc pl-5">
                            <li>MBBS, Dhaka Medical College</li>
                            <li>
                              FCPS ({doctor.specialty.split(" ")[0]}),
                              Bangladesh College of Physicians and Surgeons
                            </li>
                          </ul>
                        </div>
                      </div>
                    </CollapsibleContent>

                    <div className="mt-4 flex justify-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpand(doctor.id)}
                        className="text-primary hover:text-primary/80 hover:bg-primary/5"
                      >
                        {expandedDoctorId === doctor.id
                          ? "Show Less"
                          : "Show More"}
                        <ChevronDown
                          className="ml-1 h-4 w-4 transition-transform duration-200"
                          style={{
                            transform:
                              expandedDoctorId === doctor.id
                                ? "rotate(180deg)"
                                : "rotate(0deg)",
                          }}
                        />
                      </Button>
                    </div>
                  </div>

                  <div className="md:col-span-1 bg-muted/50 dark:bg-muted/20 p-6 flex flex-col justify-center items-center gap-4">
                    <Button
                      asChild
                      className="w-full h-10 transition-all duration-150 hover:scale-[1.02] hover:shadow-[0_0_8px_rgba(68,138,255,0.4)]"
                    >
                      <Link href={`/book-appointment/${doctor.id}`}>
                        <Calendar className="mr-2 h-4 w-4" />
                        Book Appointment
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full h-10 transition-all duration-150 hover:scale-[1.02] hover:shadow-[0_0_8px_rgba(68,138,255,0.2)]"
                    >
                      <Video className="mr-2 h-4 w-4" />
                      Video Consultation
                    </Button>
                    <Button
                      variant="secondary"
                      className="w-full h-10 bg-primary/5 text-primary hover:bg-primary/10 border border-primary/20 transition-all duration-150 hover:scale-[1.02]"
                    >
                      View Profile
                    </Button>
                  </div>
                </div>
              </Collapsible>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
