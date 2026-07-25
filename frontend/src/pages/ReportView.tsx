import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { api } from "@/lib/api"
import type { Report } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, ArrowLeft, Clock, Target, Map, AlertCircle, Loader2 } from "lucide-react"

const priorityColors: Record<string, "success" | "warning" | "destructive" | "default"> = {
  high: "destructive",
  medium: "warning",
  low: "success",
}

export default function ReportView() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!id) return
    api.getReport(Number(id))
      .then(setReport)
      .catch((err) => setError(err instanceof Error ? err.message : "Ошибка загрузки"))
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
            <p className="mt-4 text-muted-foreground">{error || "Отчёт не найден"}</p>
            <Button className="mt-4" variant="outline" onClick={() => navigate("/")}>
              На главную
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

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="font-bold">AI Business Copilot</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Панель
            </Button>
            <Button size="sm" onClick={() => navigate("/diagnostic")}>
              Новый анализ
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-6 px-4 py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <CardTitle>AI-анализ бизнеса</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed text-muted-foreground">
              {analysis.summary || "Анализ не содержит резюме."}
            </p>
          </CardContent>
        </Card>

        {analysis.opportunities && analysis.opportunities.length > 0 && (
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Возможности автоматизации</h2>
            </div>
            <div className="grid gap-4">
              {analysis.opportunities.map((opp, i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{opp.problem}</CardTitle>
                      <Badge variant={priorityColors[opp.priority] || "default"}>
                        {opp.priority === "high" ? "Высокий" : opp.priority === "medium" ? "Средний" : "Низкий"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Решение</p>
                      <p className="text-sm">{opp.solution}</p>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-1 text-sm">
                        <span className="text-muted-foreground">Инструменты:</span>
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

        {analysis.roadmap && analysis.roadmap.length > 0 && (
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Map className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Дорожная карта</h2>
            </div>
            <div className="space-y-4">
              {analysis.roadmap.map((item, i) => (
                <Card key={i} className="border-l-4 border-l-primary">
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

        <div className="flex justify-center gap-4 pt-4">
          <Button variant="outline" onClick={() => navigate("/")}>
            На главную
          </Button>
          <Button onClick={() => navigate("/diagnostic")}>
            <Sparkles className="mr-2 h-4 w-4" />
            Новый анализ
          </Button>
        </div>
      </main>
    </div>
  )
}