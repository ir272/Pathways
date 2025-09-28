import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function TestDatabasePage() {
  const supabase = await createClient()

  // Test database connections and fetch sample data
  const [
    { data: profiles, error: profilesError },
    { data: surveyResponses, error: surveysError },
    { data: scholarships, error: scholarshipsError },
    { data: savedScholarships, error: savedError },
    { data: scholarshipMatches, error: matchesError },
  ] = await Promise.all([
    supabase.from("profiles").select("*").limit(5),
    supabase.from("survey_responses").select("*").limit(5),
    supabase.from("scholarships").select("*").limit(5),
    supabase.from("saved_scholarships").select("*").limit(5),
    supabase.from("scholarship_matches").select("*").limit(10),
  ])

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Database Test Page</h1>
        <p className="text-muted-foreground">
          This page tests your Supabase database connection and displays sample data
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Profiles Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Profiles Table
              <Badge variant={profilesError ? "destructive" : "default"}>
                {profilesError ? "Error" : `${profiles?.length || 0} records`}
              </Badge>
            </CardTitle>
            <CardDescription>User profile data</CardDescription>
          </CardHeader>
          <CardContent>
            {profilesError ? (
              <p className="text-red-500 text-sm">{profilesError.message}</p>
            ) : (
              <div className="space-y-2">
                {profiles?.map((profile) => (
                  <div key={profile.id} className="p-2 bg-muted rounded text-sm">
                    <p>
                      <strong>ID:</strong> {profile.id}
                    </p>
                    <p>
                      <strong>Email:</strong> {profile.email}
                    </p>
                    <p>
                      <strong>Name:</strong> {profile.display_name || "Not set"}
                    </p>
                  </div>
                )) || <p className="text-muted-foreground">No profiles found</p>}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Survey Responses Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Survey Responses Table
              <Badge variant={surveysError ? "destructive" : "default"}>
                {surveysError ? "Error" : `${surveyResponses?.length || 0} records`}
              </Badge>
            </CardTitle>
            <CardDescription>Survey responses and inclusivity scores</CardDescription>
          </CardHeader>
          <CardContent>
            {surveysError ? (
              <p className="text-red-500 text-sm">{surveysError.message}</p>
            ) : (
              <div className="space-y-2">
                {surveyResponses?.map((response) => (
                  <div key={response.id} className="p-2 bg-muted rounded text-sm">
                    <p>
                      <strong>User:</strong> {response.user_id}
                    </p>
                    <p>
                      <strong>Inclusivity Index:</strong> {response.inclusivity_index}
                    </p>
                    <p>
                      <strong>Income Level:</strong> {response.income_level}
                    </p>
                    <p>
                      <strong>Date:</strong> {new Date(response.created_at).toLocaleDateString()}
                    </p>
                  </div>
                )) || <p className="text-muted-foreground">No survey responses found</p>}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Scholarships Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Scholarships Table
              <Badge variant={scholarshipsError ? "destructive" : "default"}>
                {scholarshipsError ? "Error" : `${scholarships?.length || 0} records`}
              </Badge>
            </CardTitle>
            <CardDescription>Available scholarship opportunities</CardDescription>
          </CardHeader>
          <CardContent>
            {scholarshipsError ? (
              <p className="text-red-500 text-sm">{scholarshipsError.message}</p>
            ) : (
              <div className="space-y-2">
                {scholarships?.map((scholarship) => (
                  <div key={scholarship.id} className="p-2 bg-muted rounded text-sm">
                    <p>
                      <strong>Title:</strong> {scholarship.title}
                    </p>
                    <p>
                      <strong>Amount:</strong> {scholarship.amount}
                    </p>
                    <p>
                      <strong>Deadline:</strong> {scholarship.deadline}
                    </p>
                  </div>
                )) || <p className="text-muted-foreground">No scholarships found</p>}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Scholarship Matches Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Scholarship Matches Table
              <Badge variant={matchesError ? "destructive" : "default"}>
                {matchesError ? "Error" : `${scholarshipMatches?.length || 0} records`}
              </Badge>
            </CardTitle>
            <CardDescription>Generated scholarship matches for users</CardDescription>
          </CardHeader>
          <CardContent>
            {matchesError ? (
              <p className="text-red-500 text-sm">{matchesError.message}</p>
            ) : (
              <div className="space-y-2">
                {scholarshipMatches?.map((match) => (
                  <div key={match.id} className="p-2 bg-muted rounded text-sm">
                    <p>
                      <strong>User:</strong> {match.user_id}
                    </p>
                    <p>
                      <strong>Scholarship:</strong> {match.scholarship_id}
                    </p>
                    <p>
                      <strong>Score:</strong> {match.match_score}
                    </p>
                    <p>
                      <strong>Date:</strong> {new Date(match.calculated_at).toLocaleDateString()}
                    </p>
                  </div>
                )) || <p className="text-muted-foreground">No matches found - This is likely the problem!</p>}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Saved Scholarships Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Saved Scholarships Table
              <Badge variant={savedError ? "destructive" : "default"}>
                {savedError ? "Error" : `${savedScholarships?.length || 0} records`}
              </Badge>
            </CardTitle>
            <CardDescription>User saved scholarship relationships</CardDescription>
          </CardHeader>
          <CardContent>
            {savedError ? (
              <p className="text-red-500 text-sm">{savedError.message}</p>
            ) : (
              <div className="space-y-2">
                {savedScholarships?.map((saved) => (
                  <div key={saved.id} className="p-2 bg-muted rounded text-sm">
                    <p>
                      <strong>User:</strong> {saved.user_id}
                    </p>
                    <p>
                      <strong>Scholarship:</strong> {saved.scholarship_id}
                    </p>
                    <p>
                      <strong>Saved:</strong> {new Date(saved.created_at).toLocaleDateString()}
                    </p>
                  </div>
                )) || <p className="text-muted-foreground">No saved scholarships found</p>}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Testing Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">1. Check Database Tables</h3>
            <p className="text-sm text-muted-foreground">
              All six cards above should show "0 records" or actual data, not "Error". If you see errors, your database
              tables may not be created yet.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">2. Debug Matching System</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>
                • <strong>Scholarships Table:</strong> Should have 20+ real scholarships
              </li>
              <li>
                • <strong>Survey Responses Table:</strong> Should show your survey data after completing survey
              </li>
              <li>
                • <strong>Scholarship Matches Table:</strong> Should populate automatically after survey submission
              </li>
              <li>• If Scholarship Matches is empty, the matching algorithm isn't running</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">3. Test User Flow</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>
                • Sign up at <code>/auth/signup</code>
              </li>
              <li>
                • Complete the survey at <code>/survey</code>
              </li>
              <li>
                • Check your dashboard at <code>/dashboard</code>
              </li>
              <li>
                • Save some scholarships and view them at <code>/saved</code>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">4. Verify Data Persistence</h3>
            <p className="text-sm text-muted-foreground">
              After completing the survey, refresh this page to see if your data appears in the tables above.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
