"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, ExternalLink, Search, Filter, Calendar, DollarSign, Star } from "lucide-react"
import type { ScholarshipMatch } from "@/lib/types/database"
import { ScholarshipService } from "@/lib/services/scholarship"

interface ScholarshipMatchesProps {
  matches?: ScholarshipMatch[]
  onSave: (scholarshipId: string) => void
}

export function ScholarshipMatches({ matches = [], onSave }: ScholarshipMatchesProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [savedScholarships, setSavedScholarships] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [savingScholarships, setSavingScholarships] = useState<Set<string>>(new Set())
  const scholarshipService = new ScholarshipService()

  useEffect(() => {
    // Load saved scholarships to show heart state
    const loadSavedScholarships = async () => {
      try {
        const saved = await scholarshipService.getSavedScholarships()
        const savedIds = new Set(saved?.map((s) => s.scholarship_id) || [])
        setSavedScholarships(savedIds)
      } catch (error) {
        console.error("Error loading saved scholarships:", error)
      }
    }
    loadSavedScholarships()
  }, [])

  const filteredMatches = matches.filter((match) => {
    if (!match.scholarship) return false

    const scholarship = match.scholarship
    const matchesSearch =
      scholarship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scholarship.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scholarship.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterType === "all" || scholarship.scholarship_type === filterType
    return matchesSearch && matchesFilter
  })

  const handleSave = async (scholarshipId: string) => {
    if (savingScholarships.has(scholarshipId)) {
      console.log("[v0] ScholarshipMatches: Save already in progress for:", scholarshipId)
      return
    }

    setLoading(true)
    setSavingScholarships((prev) => new Set(prev).add(scholarshipId))

    try {
      console.log("[v0] ScholarshipMatches: Handling save for:", scholarshipId)
      const isSaved = savedScholarships.has(scholarshipId)
      console.log("[v0] ScholarshipMatches: Currently saved?", isSaved)

      if (isSaved) {
        await scholarshipService.unsaveScholarship(scholarshipId)
        setSavedScholarships((prev) => {
          const newSet = new Set(prev)
          newSet.delete(scholarshipId)
          console.log("[v0] ScholarshipMatches: Removed from local state")
          return newSet
        })
      } else {
        await scholarshipService.saveScholarship(scholarshipId)
        setSavedScholarships((prev) => {
          const newSet = new Set(prev).add(scholarshipId)
          console.log("[v0] ScholarshipMatches: Added to local state")
          return newSet
        })
      }

      onSave(scholarshipId)
    } catch (error) {
      console.error("[v0] Error saving scholarship:", error)
      const isSaved = savedScholarships.has(scholarshipId)
      if (isSaved) {
        setSavedScholarships((prev) => new Set(prev).add(scholarshipId))
      } else {
        setSavedScholarships((prev) => {
          const newSet = new Set(prev)
          newSet.delete(scholarshipId)
          return newSet
        })
      }
    } finally {
      setLoading(false)
      setSavingScholarships((prev) => {
        const newSet = new Set(prev)
        newSet.delete(scholarshipId)
        return newSet
      })
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "need-based":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "merit-based":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "first-gen":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "stem":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "international":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200"
      case "community-service":
        return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200"
      case "arts":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
      case "athletics":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 dark:text-green-400"
    if (score >= 80) return "text-blue-600 dark:text-blue-400"
    if (score >= 70) return "text-orange-600 dark:text-orange-400"
    return "text-gray-600 dark:text-gray-400"
  }

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline)
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Your Scholarship Matches</h2>
          <p className="text-muted-foreground">Ranked by relevance to your profile</p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {filteredMatches.length} opportunities found
        </Badge>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search scholarships..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="need-based">Need-Based</SelectItem>
            <SelectItem value="merit-based">Merit-Based</SelectItem>
            <SelectItem value="first-gen">First-Generation</SelectItem>
            <SelectItem value="stem">STEM</SelectItem>
            <SelectItem value="international">International</SelectItem>
            <SelectItem value="community-service">Community Service</SelectItem>
            <SelectItem value="arts">Arts</SelectItem>
            <SelectItem value="athletics">Athletics</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Scholarship Cards */}
      <div className="grid gap-6">
        {filteredMatches.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-muted-foreground mb-4">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No scholarships found</p>
                <p className="text-sm">Try adjusting your search or filters</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredMatches.map((match) => {
            const scholarship = match.scholarship!
            return (
              <Card key={match.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          variant="outline"
                          className={`text-xs font-semibold ${getMatchScoreColor(match.match_score)}`}
                        >
                          {match.match_score >= 90 && <Star className="h-3 w-3 mr-1" />}
                          {match.match_score}% match
                        </Badge>
                        <Badge className={`text-xs ${getTypeColor(scholarship.scholarship_type)}`}>
                          {scholarship.scholarship_type.replace("-", " ")}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl text-balance leading-tight">{scholarship.title}</CardTitle>
                      <CardDescription className="text-base">{scholarship.organization}</CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSave(scholarship.id)}
                      className="shrink-0"
                      disabled={loading || savingScholarships.has(scholarship.id)}
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          savedScholarships.has(scholarship.id) ? "fill-red-500 text-red-500" : "text-muted-foreground"
                        }`}
                      />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">{scholarship.description}</p>

                  {/* Match Reasons */}
                  {match.match_reasons && match.match_reasons.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">Why this matches you:</p>
                      <div className="flex flex-wrap gap-1">
                        {match.match_reasons.map((reason, index) => (
                          <Badge key={index} variant="outline" className="text-xs bg-primary/5">
                            {reason}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Eligibility Criteria */}
                  <div className="flex flex-wrap gap-2">
                    {scholarship.eligibility_criteria.map((criteria, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {criteria}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-medium">{scholarship.amount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Due {formatDeadline(scholarship.deadline)}</span>
                      </div>
                    </div>
                    <Button size="sm" className="gap-2" asChild>
                      <a href={scholarship.application_url || "#"} target="_blank" rel="noopener noreferrer">
                        Apply Now
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
