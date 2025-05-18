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
import {
  ChevronDown,
  Filter,
  Search as SearchIcon,
  X as XIcon,
  HelpCircle,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import DoctorList from "@/components/doctor-list";

export default function FindDoctorPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    specialty: "any",
    location: "any",
    availability: "any",
  });
  const [activeFilters, setActiveFilters] = useState({
    specialty: "any",
    location: "any",
    availability: "any",
  });
  const [isFiltering, setIsFiltering] = useState(false);

  // Function to apply filters
  const applyFilters = () => {
    setActiveFilters({ ...filters });
    setIsFiltering(
      filters.specialty !== "any" ||
        filters.location !== "any" ||
        filters.availability !== "any" ||
        searchQuery.trim() !== ""
    );
  };

  // Function to reset filters
  const resetFilters = () => {
    setFilters({
      specialty: "any",
      location: "any",
      availability: "any",
    });
    setActiveFilters({
      specialty: "any",
      location: "any",
      availability: "any",
    });
    setSearchQuery("");
    setIsFiltering(false);
  };

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
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary/80" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, specialty, or hospital..."
                className="pl-10 pr-9 focus-visible:ring-primary/50 border-primary/20 focus-visible:border-primary/50"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
                  onClick={() => setSearchQuery("")}
                >
                  <XIcon className="h-3 w-3" />
                  <span className="sr-only">Clear search</span>
                </Button>
              )}
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 flex-shrink-0"
                  >
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>
                    Search across doctor names, specialties, and hospitals.
                    Results update as you type.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

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
                  Filters{" "}
                  {isFiltering && (
                    <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
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
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="specialty-mobile">Specialty</Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                              >
                                <HelpCircle className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p>Filter doctors by their medical specialty</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Select
                        value={filters.specialty}
                        onValueChange={(value) =>
                          setFilters({ ...filters, specialty: value })
                        }
                      >
                        <SelectTrigger id="specialty-mobile">
                          <SelectValue placeholder="Select Specialty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Select Specialty</SelectItem>
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
                      <div className="flex items-center justify-between">
                        <Label htmlFor="location-mobile">Location</Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                              >
                                <HelpCircle className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p>Filter doctors by their hospital location</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Select
                        value={filters.location}
                        onValueChange={(value) =>
                          setFilters({ ...filters, location: value })
                        }
                      >
                        <SelectTrigger id="location-mobile">
                          <SelectValue placeholder="Select Location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Select Location</SelectItem>
                          <SelectItem value="dhaka">Dhaka</SelectItem>
                          <SelectItem value="chittagong">Chittagong</SelectItem>
                          <SelectItem value="khulna">Khulna</SelectItem>
                          <SelectItem value="rajshahi">Rajshahi</SelectItem>
                          <SelectItem value="sylhet">Sylhet</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="availability-mobile">
                          Availability
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                              >
                                <HelpCircle className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p>
                                Filter doctors by when they're available for
                                appointments
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Select
                        value={filters.availability}
                        onValueChange={(value) =>
                          setFilters({ ...filters, availability: value })
                        }
                      >
                        <SelectTrigger id="availability-mobile">
                          <SelectValue placeholder="Select Availability Time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any Time</SelectItem>
                          <SelectItem value="today">Today</SelectItem>
                          <SelectItem value="tomorrow">Tomorrow</SelectItem>
                          <SelectItem value="this-week">This Week</SelectItem>
                          <SelectItem value="next-week">Next Week</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        className="flex-1 transition-all duration-150 hover:scale-[1.02] hover:shadow-[0_0_8px_rgba(68,138,255,0.4)] bg-[#3b82f6] hover:bg-[#2563eb] text-white font-medium h-11"
                        onClick={() => {
                          applyFilters();
                          setIsOpen(false);
                        }}
                      >
                        Apply Filters
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-shrink-0"
                        onClick={resetFilters}
                        disabled={!isFiltering}
                      >
                        Reset
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Desktop filters - hidden on mobile */}
        <Card className="lg:col-span-1 hidden lg:block h-fit sticky top-4">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Filters</CardTitle>
              {isFiltering && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="h-8 px-2 text-xs"
                >
                  <XIcon className="h-3 w-3 mr-1" />
                  Clear All
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="search">Search</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                        >
                          <HelpCircle className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p>
                          Search across doctor names, specialties, and hospitals
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary/80" />
                  <Input
                    id="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, specialty, or hospital..."
                    className="pl-10 pr-9 focus-visible:ring-primary/50 border-primary/20 focus-visible:border-primary/50"
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
                      onClick={() => setSearchQuery("")}
                    >
                      <XIcon className="h-3 w-3" />
                      <span className="sr-only">Clear search</span>
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="specialty">Specialty</Label>
                  {filters.specialty !== "any" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setFilters({ ...filters, specialty: "any" })
                      }
                      className="h-6 px-2 text-xs"
                    >
                      <XIcon className="h-3 w-3 mr-1" />
                      Clear
                    </Button>
                  )}
                </div>
                <Select
                  value={filters.specialty}
                  onValueChange={(value) =>
                    setFilters({ ...filters, specialty: value })
                  }
                >
                  <SelectTrigger id="specialty">
                    <SelectValue placeholder="Select Specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Select Specialty</SelectItem>
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="location">Location</Label>
                  {filters.location !== "any" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setFilters({ ...filters, location: "any" })
                      }
                      className="h-6 px-2 text-xs"
                    >
                      <XIcon className="h-3 w-3 mr-1" />
                      Clear
                    </Button>
                  )}
                </div>
                <Select
                  value={filters.location}
                  onValueChange={(value) =>
                    setFilters({ ...filters, location: value })
                  }
                >
                  <SelectTrigger id="location">
                    <SelectValue placeholder="Select Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Select Location</SelectItem>
                    <SelectItem value="dhaka">Dhaka</SelectItem>
                    <SelectItem value="chittagong">Chittagong</SelectItem>
                    <SelectItem value="khulna">Khulna</SelectItem>
                    <SelectItem value="rajshahi">Rajshahi</SelectItem>
                    <SelectItem value="sylhet">Sylhet</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="availability">Availability</Label>
                  {filters.availability !== "any" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setFilters({ ...filters, availability: "any" })
                      }
                      className="h-6 px-2 text-xs"
                    >
                      <XIcon className="h-3 w-3 mr-1" />
                      Clear
                    </Button>
                  )}
                </div>
                <Select
                  value={filters.availability}
                  onValueChange={(value) =>
                    setFilters({ ...filters, availability: value })
                  }
                >
                  <SelectTrigger id="availability">
                    <SelectValue placeholder="Select Availability Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="tomorrow">Tomorrow</SelectItem>
                    <SelectItem value="this-week">This Week</SelectItem>
                    <SelectItem value="next-week">Next Week</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                className="w-full transition-all duration-150 hover:scale-[1.02] hover:shadow-[0_0_8px_rgba(68,138,255,0.4)] bg-[#3b82f6] hover:bg-[#2563eb] text-white font-medium h-11"
                onClick={applyFilters}
              >
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div className="w-full md:w-auto">
              <Tabs defaultValue="all" className="w-full">
                <div className="flex items-center justify-between">
                  <TabsList className="w-full md:w-auto bg-[#1f2937]/80 p-1">
                    <TabsTrigger
                      value="all"
                      className="flex-1 md:flex-initial text-[#9ca3af] data-[state=active]:text-white data-[state=active]:bg-[#3b82f6] rounded-md transition-all hover:text-white"
                    >
                      All Doctors
                    </TabsTrigger>
                    <TabsTrigger
                      value="recommended"
                      className="flex-1 md:flex-initial text-[#9ca3af] data-[state=active]:text-white data-[state=active]:bg-[#3b82f6] rounded-md transition-all hover:text-white"
                    >
                      Recommended
                    </TabsTrigger>
                    <TabsTrigger
                      value="available-today"
                      className="flex-1 md:flex-initial text-[#9ca3af] data-[state=active]:text-white data-[state=active]:bg-[#3b82f6] rounded-md transition-all hover:text-white"
                    >
                      Available Today
                    </TabsTrigger>
                  </TabsList>

                  {isFiltering && (
                    <div className="hidden md:flex items-center ml-4">
                      <span className="text-sm text-muted-foreground mr-2">
                        Filters applied
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={resetFilters}
                        className="h-8 text-xs"
                      >
                        <XIcon className="h-3 w-3 mr-1" />
                        Clear All
                      </Button>
                    </div>
                  )}
                </div>

                {isFiltering && (
                  <div className="flex md:hidden items-center mt-4">
                    <span className="text-sm text-muted-foreground mr-2">
                      Filters applied
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetFilters}
                      className="h-8 text-xs"
                    >
                      <XIcon className="h-3 w-3 mr-1" />
                      Clear All
                    </Button>
                  </div>
                )}

                <TabsContent value="all" className="mt-4">
                  <DoctorList
                    searchQuery={searchQuery}
                    specialty={activeFilters.specialty}
                    location={activeFilters.location}
                    availability={activeFilters.availability}
                    onResetFilters={resetFilters}
                  />
                </TabsContent>

                <TabsContent value="recommended" className="mt-4">
                  <DoctorList
                    recommended={true}
                    searchQuery={searchQuery}
                    specialty={activeFilters.specialty}
                    location={activeFilters.location}
                    availability={activeFilters.availability}
                    onResetFilters={resetFilters}
                  />
                </TabsContent>

                <TabsContent value="available-today" className="mt-4">
                  <DoctorList
                    availableToday={true}
                    searchQuery={searchQuery}
                    specialty={activeFilters.specialty}
                    location={activeFilters.location}
                    availability={activeFilters.availability}
                    onResetFilters={resetFilters}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
