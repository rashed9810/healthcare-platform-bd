import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Calendar, Clock } from "lucide-react"
import Link from "next/link"

export default function SymptomCheckerResultsPage() {
  // In a real app, you would fetch the analysis results from your backend
  const mockResults = {
    urgencyScore: 7, // Scale of 1-10
    possibleConditions: ["Upper Respiratory Infection", "Seasonal Allergies", "Common Cold"],
    recommendedSpecialty: "General Physician",
    recommendedTimeframe: "Within 24 hours",
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Symptom Analysis Results</h1>
          <p className="text-muted-foreground mt-2">Based on the information you provided</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Urgency Assessment</CardTitle>
            <CardDescription>How quickly you should seek medical attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="relative w-full h-8 bg-muted rounded-full mb-4">
                <div
                  className="absolute top-0 left-0 h-full rounded-full bg-yellow-500"
                  style={{ width: `${mockResults.urgencyScore * 10}%` }}
                ></div>
              </div>

              <Alert variant="warning" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Moderate Urgency</AlertTitle>
                <AlertDescription>
                  Based on your symptoms, we recommend seeing a doctor {mockResults.recommendedTimeframe.toLowerCase()}.
                </AlertDescription>
              </Alert>

              <div className="w-full">
                <h3 className="font-medium mb-2">Possible Conditions</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {mockResults.possibleConditions.map((condition, index) => (
                    <li key={index}>{condition}</li>
                  ))}
                </ul>
                <p className="text-sm text-muted-foreground mt-2">
                  Note: This is not a diagnosis. Only a qualified healthcare professional can provide a proper
                  diagnosis.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-stretch gap-4">
            <Button asChild size="lg">
              <Link href="/find-doctor">Find a {mockResults.recommendedSpecialty}</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/symptom-checker">Check Different Symptoms</Link>
            </Button>
          </CardFooter>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Book Appointment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Schedule an appointment with a {mockResults.recommendedSpecialty} at your convenience.</p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/find-doctor">Find Available Doctors</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Urgent Care
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Need immediate attention? Find urgent care centers near you.</p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href="/urgent-care">Find Urgent Care</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
