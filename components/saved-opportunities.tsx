"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Heart,
  ExternalLink,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Share2,
  Trash2,
  Edit3,
} from "lucide-react"
import type { SavedScholarship } from "@/lib/types/database"
import { ScholarshipService } from "@/lib/services/scholarship"
import { createClient } from "@/lib/supabase/client"
import { AuthGuard } from "@/components/auth-guard"

export function SavedOpportunities() {
  const [savedItems, setSavedItems] = useState<SavedScholarship[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [loading, setLoading] = useState(true)
  const [editingNotes, setEditingNotes] = useState<string | null>(null)
  const [notesText, setNotesText] = useState("")
  const supabase = createClient()
  const scholarshipService = new ScholarshipService()

  useEffect(() => {
    const loadSavedItems = async () => {
      try {
        const items = await scholarshipService.getSavedScholarships()
        setSavedItems(items || [])
      } catch (error) {
        console.error("Error loading saved items:", error)
      } finally {
        setLoading(false)
      }
    }
    loadSavedItems()
  }, [])

  const updateItemStatus = async (scholarshipId: string, newStatus: string) => {
    try {
      await scholarshipService.updateApplicationStatus(scholarshipId, newStatus)
      setSavedItems((items) =>
        items.map((item) =>
          item.scholarship_id === scholarshipId ? { ...item, application_status: newStatus } : item,
        ),
      )
    } catch (error) {
      console.error("Error updating status:", error)
    }
  }

  const removeItem = async (scholarshipId: string) => {
    try {
      await scholarshipService.unsaveScholarship(scholarshipId)
      setSavedItems((items) => items.filter((item) => item.scholarship_id !== scholarshipId))
    } catch (error) {
      console.error("Error removing item:", error)
    }
  }

  const updateNotes = async (scholarshipId: string, notes: string) => {
    try {
      await scholarshipService.updateApplicationStatus(scholarshipId, null, notes)
      setSavedItems((items) => items.map((item) => (item.scholarship_id === scholarshipId ? { ...item, notes } : item)))
      setEditingNotes(null)
      setNotesText("")
    } catch (error) {
      console.error("Error updating notes:", error)
    }
  }

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "applied":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "accepted":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case "applied":
        return <Clock className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "accepted":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Heart className="h-4 w-4" />
    }
  }

  const getUrgencyColor = (deadline: string) => {
    const deadlineDate = new Date(deadline)
    const today = new Date()
    const daysUntil = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    if (daysUntil <= 7) return "text-red-600 dark:text-red-400"
    if (daysUntil <= 30) return "text-orange-600 dark:text-orange-400"
    return "text-muted-foreground"
  }

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline)
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  const filteredItems = savedItems.filter((item) => {
    if (!item.scholarship) return false
    if (activeTab === "all") return true
    if (activeTab === "scholarships") return item.scholarship.scholarship_type !== "program"
    if (activeTab === "programs") return item.scholarship.scholarship_type === "program"
    return true
  })

  const stats = {
    total: savedItems.length,
    applied: savedItems.filter((item) => item.application_status === "applied").length,
    completed: savedItems.filter((item) => item.application_status === "completed").length,
    accepted: savedItems.filter((item) => item.application_status === "accepted").length,
    totalValue: savedItems
      .filter((item) => item.scholarship && item.scholarship.amount !== "Free")
      .reduce((sum, item) => {
        const amount = Number.parseInt(item.scholarship!.amount.replace(/[^0-9]/g, ""))
        return sum + (isNaN(amount) ? 0 : amount)
      }, 0),
  }

  if (loading) {
    return (
      <AuthGuard>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="space-y-6">
        {/* Header with Stats */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Saved Opportunities</h1>
              <p className="text-muted-foreground">Track your applications and manage your opportunities</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Download className="h-4 w-4" />
                Export PDF
              </Button>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary mb-1">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Total Saved</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">{stats.applied}</div>
                <div className="text-sm text-muted-foreground">Applied</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">{stats.completed}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-emerald-600 mb-1">{stats.accepted}</div>
                <div className="text-sm text-muted-foreground">Accepted</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-accent mb-1">${stats.totalValue.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Value</div>
              </CardContent>
            </Card>
          </div>

          {/* Progress Overview */}
          {stats.total > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Application Progress</CardTitle>
                <CardDescription>
                  You've applied to {stats.applied} scholarships worth ${stats.totalValue.toLocaleString()} total!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>
                      {stats.applied} of {stats.total} applications started
                    </span>
                  </div>
                  <Progress value={(stats.applied / Math.max(stats.total, 1)) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All ({savedItems.length})</TabsTrigger>
            <TabsTrigger value="scholarships">
              Scholarships ({savedItems.filter((item) => item.scholarship?.scholarship_type !== "program").length})
            </TabsTrigger>
            <TabsTrigger value="programs">
              Programs ({savedItems.filter((item) => item.scholarship?.scholarship_type === "program").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredItems.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No saved opportunities yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start exploring scholarships and programs to build your collection
                  </p>
                  <Button asChild>
                    <a href="/dashboard">Explore Opportunities</a>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {filteredItems.map((item) => {
                  if (!item.scholarship) return null
                  const scholarship = item.scholarship

                  return (
                    <Card key={item.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={`text-xs ${getStatusColor(item.application_status)}`}>
                                <span className="flex items-center gap-1">
                                  {getStatusIcon(item.application_status)}
                                  {item.application_status || "saved"}
                                </span>
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {scholarship.scholarship_type.replace("-", " ")}
                              </Badge>
                              {scholarship.deadline && (
                                <div
                                  className={`text-xs flex items-center gap-1 ${getUrgencyColor(scholarship.deadline)}`}
                                >
                                  <AlertCircle className="h-3 w-3" />
                                  Due {formatDeadline(scholarship.deadline)}
                                </div>
                              )}
                            </div>
                            <CardTitle className="text-xl text-balance leading-tight">{scholarship.title}</CardTitle>
                            <CardDescription className="text-base">{scholarship.organization}</CardDescription>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(scholarship.id)}
                            className="shrink-0 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground leading-relaxed">{scholarship.description}</p>

                        {item.notes && (
                          <div className="bg-muted/50 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="text-sm font-medium">Notes</h4>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingNotes(scholarship.id)
                                  setNotesText(item.notes || "")
                                }}
                              >
                                <Edit3 className="h-3 w-3" />
                              </Button>
                            </div>
                            <p className="text-sm text-muted-foreground">{item.notes}</p>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              <span className="font-medium">{scholarship.amount}</span>
                            </div>
                            {scholarship.deadline && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>Due {formatDeadline(scholarship.deadline)}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            {!item.application_status && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateItemStatus(scholarship.id, "applied")}
                              >
                                Mark as Applied
                              </Button>
                            )}
                            {item.application_status === "applied" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateItemStatus(scholarship.id, "completed")}
                              >
                                Mark as Completed
                              </Button>
                            )}
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline">
                                  <Edit3 className="h-3 w-3 mr-1" />
                                  Add Notes
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Add Notes</DialogTitle>
                                  <DialogDescription>
                                    Add personal notes about this scholarship application
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <Textarea
                                    placeholder="Add your notes here..."
                                    value={notesText}
                                    onChange={(e) => setNotesText(e.target.value)}
                                    className="min-h-24"
                                  />
                                  <div className="flex justify-end gap-2">
                                    <Button variant="outline" onClick={() => setNotesText("")}>
                                      Cancel
                                    </Button>
                                    <Button onClick={() => updateNotes(scholarship.id, notesText)}>Save Notes</Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button size="sm" className="gap-2" asChild>
                              <a href={scholarship.application_url || "#"} target="_blank" rel="noopener noreferrer">
                                View Details
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AuthGuard>
  )
}
