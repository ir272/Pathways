"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface InclusivityIndexProps {
  score: number
  breakdown: {
    access: number
    financial: number
    language: number
    academic: number
  }
}

export function InclusivityIndexCard({ score, breakdown }: InclusivityIndexProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-red-600"
    if (score >= 60) return "text-orange-600"
    if (score >= 40) return "text-yellow-600"
    return "text-green-600"
  }

  const getScoreDescription = (score: number) => {
    if (score >= 80) return "High barriers - You qualify for maximum support programs"
    if (score >= 60) return "Moderate barriers - Many targeted opportunities available"
    if (score >= 40) return "Some barriers - Several support programs match your profile"
    return "Lower barriers - Focus on merit-based and general opportunities"
  }

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Your Inclusivity Index</CardTitle>
        <CardDescription>
          This score helps us find opportunities designed for students with similar experiences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Score */}
        <div className="text-center">
          <div className={`text-6xl font-black ${getScoreColor(score)} mb-2`}>{score}</div>
          <div className="text-lg font-medium text-muted-foreground mb-4">out of 100</div>
          <Badge variant="secondary" className="text-sm px-4 py-2">
            {getScoreDescription(score)}
          </Badge>
        </div>

        {/* Category Breakdown */}
        <div className="space-y-4">
          <h4 className="font-semibold text-center mb-4">Category Breakdown</h4>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Access & Technology</span>
                <span className="text-sm text-muted-foreground">{breakdown.access}/25</span>
              </div>
              <Progress value={(breakdown.access / 25) * 100} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Financial Need</span>
                <span className="text-sm text-muted-foreground">{breakdown.financial}/25</span>
              </div>
              <Progress value={(breakdown.financial / 25) * 100} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Language Support</span>
                <span className="text-sm text-muted-foreground">{breakdown.language}/25</span>
              </div>
              <Progress value={(breakdown.language / 25) * 100} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Learning Differences</span>
                <span className="text-sm text-muted-foreground">{breakdown.academic}/25</span>
              </div>
              <Progress value={(breakdown.academic / 25) * 100} className="h-2" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
