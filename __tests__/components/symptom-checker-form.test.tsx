import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import SymptomCheckerForm from "@/components/symptom-checker-form"
import { analyzeSymptoms } from "@/lib/api/symptoms"

// Mock the API client
jest.mock("@/lib/api/symptoms", () => ({
  analyzeSymptoms: jest.fn(),
}))

// Mock the router
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

describe("SymptomCheckerForm", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders the form correctly", () => {
    render(<SymptomCheckerForm />)

    expect(screen.getByLabelText(/symptoms description/i)).toBeInTheDocument()
    expect(screen.getByText(/how long have you been experiencing these symptoms/i)).toBeInTheDocument()
    expect(screen.getByText(/how severe are your symptoms/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /analyze symptoms/i })).toBeInTheDocument()
  })

  it("shows error when submitting without symptoms", async () => {
    render(<SymptomCheckerForm />)

    fireEvent.click(screen.getByRole("button", { name: /analyze symptoms/i }))

    expect(screen.getByText(/please describe your symptoms/i)).toBeInTheDocument()
    expect(analyzeSymptoms).not.toHaveBeenCalled()
  })

  it("submits the form with valid data", async () => {
    // Mock successful API response
    const mockAnalysisResult = {
      urgencyScore: 7,
      possibleConditions: ["Upper Respiratory Infection"],
      recommendedSpecialty: "General Physician",
      recommendedTimeframe: "Within 24 hours",
    }
    ;(analyzeSymptoms as jest.Mock).mockResolvedValue(mockAnalysisResult)

    render(<SymptomCheckerForm />)

    // Fill the form
    fireEvent.change(screen.getByLabelText(/symptoms description/i), {
      target: { value: "I have a headache and fever" },
    })

    fireEvent.click(screen.getByLabelText(/few days/i))
    fireEvent.click(screen.getByLabelText(/moderate/i))

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /analyze symptoms/i }))

    // Check if the API was called with correct parameters
    await waitFor(() => {
      expect(analyzeSymptoms).toHaveBeenCalledWith({
        symptoms: "I have a headache and fever",
        duration: "days",
        severity: "moderate",
      })
    })

    // Check if localStorage was updated
    expect(localStorage.getItem("symptomAnalysis")).toBe(JSON.stringify(mockAnalysisResult))
  })

  it("handles API errors", async () => {
    // Mock API error
    ;(analyzeSymptoms as jest.Mock).mockRejectedValue(new Error("API error"))

    render(<SymptomCheckerForm />)

    // Fill the form
    fireEvent.change(screen.getByLabelText(/symptoms description/i), {
      target: { value: "I have a headache and fever" },
    })

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /analyze symptoms/i }))

    // Check if error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/failed to analyze symptoms/i)).toBeInTheDocument()
    })
  })
})
