import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { api } from "@/lib/api"
import { useAuth } from "@/lib/context/AuthContext"
import { computeReadinessScore, scoreLevel } from "@/lib/report-score"
import type { Report } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, ArrowLeft, Clock, Target, Map, AlertCircle, Loader2, Printer, RefreshCw, LayoutDashboard } from "lucide-react"

const priorityColors: Record<string, "success" | "warning" | "destructive" | "default"> = {
  high: "destructive",
  medium: "warning",
  low: "success",
}

const levelBadgeVariant: Record<string, "success" | "warning" | "destructive"> = {
  high: "success",
  medium: "warning",
  low: "destructive",
}

export default function ReportView() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const { user } = useAuth()
  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!id) return
    api.getReport(Number(id))
      .then(setReport)
      .catch((err) => setError(err instanceof Error ? err.message : t("reportView.loadError")))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
            <p className="mt-4 text-muted-foreground">{error || t("reportView.notFound")}</p>
            <Button className="mt-4" variant="outline" onClick={() => navigate("/")}>
              {t("reportView.toHome")}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const analysis = report.report_json as {
    summary?: string
    opportunities?: Array<{
      problem: string
      solution: string
      tools: string
      time_saved: string
      priority: string
    }>
    roadmap?: Array<{
      stage: string
      actions: string
      duration: string
    }>
  }

  const score = computeReadinessScore(report)
  const level = scoreLevel(score)
  const opportunities = analysis.opportunities ?? []
  const roadmap = analysis.roadmap ?? []
  const highPriority = opportunities.filter((o) => o.priority === "high").length

  return (
    <div className="min-h-screen bg-muted/30 print:bg-white">
      <header className="border-b bg-background print:hidden">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="font-bold">{t("brand")}</span>
          </div>
          <div className="flex items-center gap-3">
            {user && (
              <Button variant="outline" size="sm" onClick={() => navigate("/dashboard")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("reportView.panel")}
              </Button>
            )}
            <Button size="sm" onClick={() => navigate("/diagnostic")}>
              {t("reportView.newAnalysis")}
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Printer className="mr-2 h-4 w-4" />
              {t("reportView.export")}
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-6 px-4 py-8">
        {/* Score header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold">{t("reportView.title")}</h1>
                  <Badge variant={levelBadgeVariant[level]}>{t(`score.${level}`)}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("reportView.generatedAt", {
                    date: new Date(report.created_at).toLocaleDateString(i18n.language),
                  })}
                </p>
              </div>
              <div className="w-full sm:w-56">
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t("score.label")}</span>
                  <span className="font-semibold">{score} / 100</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full transition-all ${
                      level === "high"
                        ? "bg-emerald-500"
                        : level === "medium"
                          ? "bg-amber-500"
                          : "bg-red-500"
                    }`}
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <CardTitle>{t("reportView.title")}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed text-muted-foreground">
              {analysis.summary || t("reportView.noSummary")}
            </p>
          </CardContent>
        </Card>

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold">{opportunities.length}</p>
              <p className="text-xs text-muted-foreground">{t("reportView.statOpportunities")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold">{highPriority}</p>
              <p className="text-xs text-muted-foreground">{t("reportView.statHighPriority")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold">{roadmap.length}</p>
              <p className="text-xs text-muted-foreground">{t("reportView.statRoadmap")}</p>
            </CardContent>
          </Card>
        </div>

        {opportunities.length > 0 && (
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">{t("reportView.opportunities")}</h2>
            </div>
            <div className="grid gap-4">
              {opportunities.map((opp, i) => (
                <Card key={i} className="break-inside-avoid">
                  <CardHeader>
                    <div className="flex items-center justify-between gap-3">
                      <CardTitle className="text-base">{opp.problem}</CardTitle>
                      <Badge variant={priorityColors[opp.priority] || "default"}>
                        {opp.priority === "high"
                          ? t("reportView.high")
                          : opp.priority === "medium"
                            ? t("reportView.medium")
                            : t("reportView.low")}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">{t("reportView.solution")}</p>
                      <p className="text-sm">{opp.solution}</p>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-1 text-sm">
                        <span className="text-muted-foreground">{t("reportView.tools")}</span>
                        <span className="font-medium">{opp.tools}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-green-700">{opp.time_saved}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {roadmap.length > 0 && (
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Map className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">{t("reportView.roadmap")}</h2>
            </div>
            <div className="space-y-4">
              {roadmap.map((item, i) => (
                <Card key={i} className="border-l-4 border-l-primary break-inside-avoid">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                          {i + 1}
                        </div>
                        <CardTitle className="text-base">{item.stage}</CardTitle>
                      </div>
                      <Badge variant="secondary">{item.duration}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{item.actions}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <Card className="print:hidden">
          <CardContent className="flex flex-col items-center gap-4 pt-6 text-center">
            <h2 className="text-xl font-semibold">{t("reportView.readyTitle")}</h2>
            <p className="max-w-lg text-sm text-muted-foreground">{t("reportView.readyText")}</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button onClick={() => window.print()}>
                <Printer className="mr-2 h-4 w-4" />
                {t("reportView.export")}
              </Button>
              <Button variant="outline" onClick={() => navigate("/diagnostic")}>
                <RefreshCw className="mr-2 h-4 w-4" />
                {t("reportView.retake")}
              </Button>
              {user && (
                <Button variant="outline" onClick={() => navigate("/dashboard")}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  {t("reportView.openDashboard")}
                </Button>
              )}
            </div>
            {!user && (
              <p className="text-xs text-muted-foreground">
                {t("reportView.saveHint")}{" "}
                <button className="text-primary underline underline-offset-2" onClick={() => navigate("/register")}>
                  {t("auth.signUp")}
                </button>
              </p>
            )}
            <p className="text-xs text-muted-foreground">{t("reportView.disclaimer")}</p>
          </CardContent>
        </Card>

        <div className="flex justify-center gap-4 pt-2 print:hidden">
          <Button variant="ghost" onClick={() => navigate("/")}>
            {t("reportView.toHome")}
          </Button>
        </div>
      </main>
    </div>
  )
}
