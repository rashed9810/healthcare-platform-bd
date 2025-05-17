import { NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth-middleware"
import { createWorker } from "tesseract.js"

export async function POST(request: Request) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request)
    if (!authResult.isAuthenticated) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Parse form data
    const formData = await request.formData()
    const prescriptionFile = formData.get("prescription") as File

    if (!prescriptionFile) {
      return NextResponse.json({ message: "No prescription image provided" }, { status: 400 })
    }

    // Process image with Tesseract.js
    const worker = await createWorker()

    // Convert File to buffer for Tesseract
    const buffer = Buffer.from(await prescriptionFile.arrayBuffer())

    // Recognize text in the image
    await worker.loadLanguage("eng")
    await worker.initialize("eng")
    const { data } = await worker.recognize(buffer)
    await worker.terminate()

    // In a real app, you would:
    // 1. Upload the image to cloud storage
    // 2. Save the OCR result and image URL to database
    // 3. Associate with the user/appointment

    // Mock URL for demo purposes
    const imageUrl = `https://storage.example.com/prescriptions/${Date.now()}-${prescriptionFile.name}`

    return NextResponse.json({
      text: data.text,
      url: imageUrl,
    })
  } catch (error) {
    console.error("Prescription upload error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
