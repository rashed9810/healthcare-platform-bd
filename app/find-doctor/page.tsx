"use client";

import { useState } from "react";
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, Filter } from "lucide-react";
import DoctorList from "@/components/doctor-list";

export default function FindDoctorPage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-[#111827] dark:text-white">
          Find a Doctor
        </h1>
        <p className="text-[#4b5563] dark:text-muted-foreground mt-2">
          Search for healthcare professionals based on specialty, location, and
          availability
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Mobile filter button - only visible on small screens */}
        <div className="lg:hidden w-full mb-4">
          <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="w-full"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                className="w-full flex items-center justify-between"
              >
                <span className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </span>
                <ChevronDown
                  className="h-4 w-4 transition-transform duration-200"
                  style={{
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <Label htmlFor="search-mobile">Search</Label>
                      <Input
                        id="search-mobile"
                        placeholder="Search by name, specialty, or location"
                        className="focus-visible:ring-primary/50"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="specialty-mobile">Specialty</Label>
                      <Select defaultValue="general">
                        <SelectTrigger id="specialty-mobile">
                          <SelectValue placeholder="Select specialty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">
                            General Physician (AI-Powered)
                          </SelectItem>
                          <SelectItem value="cardiology">Cardiology</SelectItem>
                          <SelectItem value="dermatology">
                            Dermatology
                          </SelectItem>
                          <SelectItem value="neurology">Neurology</SelectItem>
                          <SelectItem value="pediatrics">Pediatrics</SelectItem>
                          <SelectItem value="orthopedics">
                            Orthopedics
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="location-mobile">Location</Label>
                      <Select defaultValue="dhaka">
                        <SelectTrigger id="location-mobile">
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dhaka">Dhaka</SelectItem>
                          <SelectItem value="chittagong">Chittagong</SelectItem>
                          <SelectItem value="khulna">Khulna</SelectItem>
                          <SelectItem value="rajshahi">Rajshahi</SelectItem>
                          <SelectItem value="sylhet">Sylhet</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="availability-mobile">Availability</Label>
                      <Select defaultValue="today">
                        <SelectTrigger id="availability-mobile">
                          <SelectValue placeholder="Select availability" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="today">Today</SelectItem>
                          <SelectItem value="tomorrow">Tomorrow</SelectItem>
                          <SelectItem value="this-week">This Week</SelectItem>
                          <SelectItem value="next-week">Next Week</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="language-mobile">Language</Label>
                      <Select defaultValue="both">
                        <SelectTrigger id="language-mobile">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any</SelectItem>
                          <SelectItem value="bengali">Bengali</SelectItem>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="both">
                            Bengali & English
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button className="w-full transition-all duration-150 hover:scale-[1.02] hover:shadow-[0_0_8px_rgba(68,138,255,0.4)]">
                      Apply Filters
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Desktop filters - hidden on mobile */}
        <Card className="lg:col-span-1 hidden lg:block">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="space-y-8">
              <div className="space-y-3">
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  placeholder="Search by name, specialty, or location"
                  className="focus-visible:ring-primary/50"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="specialty">Specialty</Label>
                <Select defaultValue="general">
                  <SelectTrigger id="specialty">
                    <SelectValue placeholder="Select specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">
                      General Physician (AI-Powered)
                    </SelectItem>
                    <SelectItem value="cardiology">Cardiology</SelectItem>
                    <SelectItem value="dermatology">Dermatology</SelectItem>
                    <SelectItem value="neurology">Neurology</SelectItem>
                    <SelectItem value="pediatrics">Pediatrics</SelectItem>
                    <SelectItem value="orthopedics">Orthopedics</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="location">Location</Label>
                <Select defaultValue="dhaka">
                  <SelectTrigger id="location">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dhaka">Dhaka</SelectItem>
                    <SelectItem value="chittagong">Chittagong</SelectItem>
                    <SelectItem value="khulna">Khulna</SelectItem>
                    <SelectItem value="rajshahi">Rajshahi</SelectItem>
                    <SelectItem value="sylhet">Sylhet</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="availability">Availability</Label>
                <Select defaultValue="today">
                  <SelectTrigger id="availability">
                    <SelectValue placeholder="Select availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="tomorrow">Tomorrow</SelectItem>
                    <SelectItem value="this-week">This Week</SelectItem>
                    <SelectItem value="next-week">Next Week</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="language">Language</Label>
                <Select defaultValue="both">
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="bengali">Bengali</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="both">Bengali & English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full transition-all duration-150 hover:scale-[1.02] hover:shadow-[0_0_8px_rgba(68,138,255,0.4)]">
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-3">
          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger
                value="all"
                className="text-[#4b5563] data-[state=active]:text-white data-[state=active]:bg-primary"
              >
                All Doctors
              </TabsTrigger>
              <TabsTrigger
                value="recommended"
                className="text-[#4b5563] data-[state=active]:text-white data-[state=active]:bg-primary"
              >
                Recommended
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <DoctorList />
            </TabsContent>

            <TabsContent value="recommended" className="mt-0">
              <DoctorList recommended={true} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
