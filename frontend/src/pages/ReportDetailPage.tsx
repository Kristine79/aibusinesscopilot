import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { api } from "@/lib/api"
import type { Report, Opportunity, RoadmapItem } from "@/types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, AlertCircle, ArrowLeft, Lightbulb, Route, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

const priorityVariant: Record<string, "warning" | "default" | "success" | "destructive"> = {
  low: "success",
  medium: "warning",
  high: "destructive",
  critical: "destructive",
}

interface ReportAnalysis {
  summary?: string
  opportunities?: Opportunity[]
  roadmap?: RoadmapItem[]
}

export default function ReportDetailPage() {
  const { id } = useParams<{ id: string }>()
  const reportId = id
  const navigate = useNavigate()
  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!reportId) return
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await api.getReport(Number(reportId))
        if (cancelled) return
        setReport(data)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Ошибка загрузки отчета")
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [reportId])

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-2 text-destructive">
        <AlertCircle className="h-8 w-8" />
        <p className="text-sm">{error}</p>
      </div>
    )
  }

  if (!report) return null

  const analysis = report.report_json as unknown as ReportAnalysis

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/dashboard/reports")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Отчет #{report.id}</h1>
          <p className="text-sm text-muted-foreground">
            {new Date(report.created_at).toLocaleDateString("ru-RU")} &middot; User #
            {report.user_id}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-600" />
            Сводка
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {analysis?.summary || "Нет данных"}
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-600" />
              Возможности
            </CardTitle>
            <CardDescription>
              {analysis?.opportunities?.length || 0} найдено
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!analysis?.opportunities || analysis.opportunities.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Возможности не найдены
              </p>
            ) : (
              analysis.opportunities.map((opp, i) => (
                <div key={i} className="rounded-lg border p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="font-medium">{opp.problem}</h4>
                    <Badge
                      variant={priorityVariant[opp.priority] || "secondary"}
                    >
                      {opp.priority}
                    </Badge>
                  </div>
                  <p className="mb-1 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">
                      Решение:
                    </span>{" "}
                    {opp.solution}
                  </p>
                  <p className="mb-1 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">
                      Инструменты:
                    </span>{" "}
                    {opp.tools}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">
                      Экономия:
                    </span>{" "}
                    {opp.time_saved}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Route className="h-5 w-5 text-emerald-600" />
              Roadmap
            </CardTitle>
            <CardDescription>
              {analysis?.roadmap?.length || 0} этапов
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!analysis?.roadmap || analysis.roadmap.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Roadmap не построен
              </p>
            ) : (
              <div className="relative space-y-0">
                {analysis.roadmap.map((item, i, arr) => (
                  <div key={i} className="relative flex gap-4 pb-8 last:pb-0">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          "z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 text-xs font-bold",
                          "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                        )}
                      >
                        {i + 1}
                      </div>
                      {i < arr.length - 1 && (
                        <div className="w-0.5 flex-1 bg-border" />
                      )}
                    </div>
                    <div className="flex-1 pt-0.5">
                      <h4 className="font-medium">{item.stage}</h4>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {item.actions}
                      </p>
                      <Badge variant="outline" className="mt-2">
                        {item.duration}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
