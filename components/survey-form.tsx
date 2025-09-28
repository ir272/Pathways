"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { SurveyService } from "@/lib/services/survey"

interface SurveyData {
  incomeLevel: string
  deviceAccess: string
  internetAccess: string
  languageSupport: string
  learningNeeds: string
  gpaRange: string
  location: string
  educationLevel: string
  barriers: string
  goals: string
}

const questions = [
  {
    id: "incomeLevel",
    title: "What best describes your family's income level?",
    type: "radio",
    options: [
      { value: "low", label: "Low income (qualify for free/reduced lunch)" },
      { value: "moderate", label: "Moderate income" },
      { value: "middle", label: "High income" },
      { value: "prefer-not-to-say", label: "Prefer not to say" },
    ],
  },
  {
    id: "deviceAccess",
    title: "What devices do you have reliable access to?",
    type: "radio",
    options: [
      { value: "smartphone-only", label: "Smartphone only" },
      { value: "smartphone-tablet", label: "Smartphone and tablet" },
      { value: "smartphone-computer", label: "Smartphone and computer/laptop" },
      { value: "all-devices", label: "All devices (smartphone, tablet, computer)" },
    ],
  },
  {
    id: "internetAccess",
    title: "How would you describe your internet access?",
    type: "radio",
    options: [
      { value: "limited", label: "Limited or unreliable" },
      { value: "mobile-only", label: "Mobile data only" },
      { value: "home-wifi", label: "Reliable home WiFi" },
      { value: "multiple-locations", label: "Access at home, school, and other locations" },
    ],
  },
  {
    id: "languageSupport",
    title: "What is your primary language situation?",
    type: "radio",
    options: [
      { value: "english-first", label: "English is my first language" },
      { value: "english-second", label: "English is my second language" },
      { value: "multilingual", label: "I'm multilingual" },
      { value: "need-translation", label: "I often need translation support" },
    ],
  },
  {
    id: "learningNeeds",
    title: "Do you have any learning differences or accessibility needs?",
    type: "radio",
    options: [
      { value: "none", label: "No specific needs" },
      { value: "adhd", label: "ADHD or attention differences" },
      { value: "dyslexia", label: "Dyslexia or reading differences" },
      { value: "other", label: "Other learning differences" },
      { value: "prefer-not-to-say", label: "Prefer not to say" },
    ],
  },
  {
    id: "gpaRange",
    title: "What is your current GPA range?",
    type: "radio",
    options: [
      { value: "3.5-4.0", label: "3.5 - 4.0" },
      { value: "3.0-3.4", label: "3.0 - 3.4" },
      { value: "2.5-2.9", label: "2.5 - 2.9" },
      { value: "below-2.5", label: "Below 2.5" },
      { value: "not-applicable", label: "Not applicable" },
    ],
  },
  {
    id: "location",
    title: "Where are you located?",
    type: "input",
    placeholder: "City, State or Country",
  },
  {
    id: "educationLevel",
    title: "What is your current education level?",
    type: "radio",
    options: [
      { value: "high-school", label: "High school student" },
      { value: "community-college", label: "Community college student" },
      { value: "undergraduate", label: "Undergraduate student" },
      { value: "graduate", label: "Graduate student" },
      { value: "other", label: "Other" },
    ],
  },
  {
    id: "barriers",
    title: "What barriers have you faced in accessing educational opportunities?",
    type: "textarea",
    placeholder: "Share any challenges you've experienced (optional)",
  },
  {
    id: "goals",
    title: "What are your educational or career goals?",
    type: "textarea",
    placeholder: "Tell us about your aspirations (optional)",
  },
]

export function SurveyForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const [surveyData, setSurveyData] = useState<Partial<SurveyData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const supabase = createClient()
  const surveyService = new SurveyService()

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }
      setUser(user)

      const existingResponse = await surveyService.getSurveyResponse()
      if (existingResponse) {
        router.push("/dashboard")
      }
    }
    checkAuth()
  }, [])

  const progress = ((currentStep + 1) / questions.length) * 100

  const handleAnswer = (questionId: string, value: string) => {
    setSurveyData((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleSubmit()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    if (!user) {
      setError("Please sign in to save your survey results")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await surveyService.submitSurvey({
        incomeLevel: surveyData.incomeLevel!,
        deviceAccess: surveyData.deviceAccess!,
        internetAccess: surveyData.internetAccess!,
        languageSupport: surveyData.languageSupport!,
        learningNeeds: surveyData.learningNeeds!,
        gpaRange: surveyData.gpaRange!,
        location: surveyData.location,
        educationLevel: surveyData.educationLevel!,
        barriers: surveyData.barriers,
        goals: surveyData.goals,
      })

      router.push("/dashboard")
    } catch (error) {
      console.error("Error submitting survey:", error)
      setError(error instanceof Error ? error.message : "Failed to save survey results")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const currentQuestion = questions[currentStep]
  const isLastStep = currentStep === questions.length - 1
  const canProceed = surveyData[currentQuestion.id as keyof SurveyData]

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Question {currentStep + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-muted-foreground">{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-balance leading-relaxed">{currentQuestion.title}</CardTitle>
            {currentStep === 0 && (
              <CardDescription>
                This helps us understand your unique situation and find the best opportunities for you.
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {currentQuestion.type === "radio" && currentQuestion.options && (
              <RadioGroup
                value={surveyData[currentQuestion.id as keyof SurveyData] || ""}
                onValueChange={(value) => handleAnswer(currentQuestion.id, value)}
              >
                {currentQuestion.options.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value} className="text-sm leading-relaxed cursor-pointer flex-1">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {currentQuestion.type === "input" && (
              <Input
                placeholder={currentQuestion.placeholder}
                value={surveyData[currentQuestion.id as keyof SurveyData] || ""}
                onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                className="text-base"
              />
            )}

            {currentQuestion.type === "textarea" && (
              <Textarea
                placeholder={currentQuestion.placeholder}
                value={surveyData[currentQuestion.id as keyof SurveyData] || ""}
                onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                className="min-h-24 text-base leading-relaxed"
              />
            )}

            {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center gap-2 bg-transparent"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>

          <Button
            onClick={handleNext}
            disabled={(!canProceed && currentQuestion.type !== "textarea") || isSubmitting}
            className="flex items-center gap-2"
          >
            {isLastStep ? (
              isSubmitting ? (
                "Saving Results..."
              ) : (
                "Get My Results"
              )
            ) : (
              <>
                Next
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
