"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { FileText, Upload, Check, AlertCircle, Loader2 } from "lucide-react"
import { uploadPrescriptionImage } from "@/lib/api/prescriptions"

export default function UploadPrescriptionPage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [extractedText, setExtractedText] = useState<string>("")
  const [isUploading, setIsUploading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]

    if (selectedFile) {
      // Reset states
      setFile(selectedFile)
      setExtractedText("")
      setIsSuccess(false)
      setError(null)

      // Create preview
      const reader = new FileReader()
      reader.onload = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setError(null)

    try {
      const result = await uploadPrescriptionImage(file)
      setExtractedText(result.text)
      setIsSuccess(true)
    } catch (err) {
      console.error("Error uploading prescription:", err)
      setError("Failed to process prescription. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Upload Prescription</h1>
          <p className="text-muted-foreground mt-2">Upload a prescription image to digitize it using OCR technology</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Image</CardTitle>
              <CardDescription>Take a clear photo of your prescription or upload an existing image</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="prescription">Prescription Image</Label>
                <Input id="prescription" type="file" accept="image/*" onChange={handleFileChange} />
              </div>

              {preview && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Preview:</p>
                  <div className="border rounded-md overflow-hidden">
                    <img
                      src={preview || "/placeholder.svg"}
                      alt="Prescription preview"
                      className="w-full h-auto max-h-[300px] object-contain"
                    />
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={handleUpload} disabled={!file || isUploading} className="w-full">
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Process Prescription
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Extracted Information</CardTitle>
              <CardDescription>Text extracted from your prescription using OCR</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {isSuccess && (
                <Alert className="bg-green-50 text-green-800 border-green-200">
                  <Check className="h-4 w-4" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>
                    Prescription processed successfully. Please review the extracted text.
                  </AlertDescription>
                </Alert>
              )}

              <div>
                <Label htmlFor="extracted-text">Extracted Text</Label>
                <Textarea
                  id="extracted-text"
                  value={extractedText}
                  onChange={(e) => setExtractedText(e.target.value)}
                  placeholder="Extracted prescription text will appear here..."
                  className="min-h-[200px] mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">You can edit the text if the OCR missed anything</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" disabled={!extractedText}>
                <FileText className="mr-2 h-4 w-4" />
                Save as PDF
              </Button>
              <Button disabled={!extractedText}>Save to Records</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
