import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { api } from "@/lib/api"
import { tBusinessType } from "@/lib/i18n"
import type { AnalyticsSummary } from "@/types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2, AlertCircle, BarChart3 } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts"

const COLORS = ["#6366f1", "#8b5cf6", "#a855f7", "#d946ef", "#ec4899", "#f43f5e"]

const statusKeys: Record<string, string> = {
  new: "analytics.status.new",
  in_progress: "analytics.status.in_progress",
  completed: "analytics.status.completed",
  archived: "analytics.status.archived",
}

export default function AnalyticsPage() {
  const { t } = useTranslation()
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const data = await api.getAnalyticsSummary()
        if (cancelled) return
        setSummary(data)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : t("analytics.loadError"))
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

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

  if (!summary) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-6 w-6 text-indigo-600" />
        <h1 className="text-2xl font-bold">{t("analytics.title")}</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("analytics.businessTypes")}</CardTitle>
            <CardDescription>
              {t("analytics.businessTypesDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {summary.business_type_distribution.length === 0 ? (
              <div className="flex h-64 items-center justify-center text-muted-foreground">
                <p className="text-sm">{t("analytics.noData")}</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={summary.business_type_distribution.map((d) => ({ ...d, name: tBusinessType(d.name) }))}>
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="count"
                    fill="#6366f1"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("analytics.leadStatuses")}</CardTitle>
            <CardDescription>
              {t("analytics.leadStatusesDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {summary.leads_by_status.length === 0 ? (
              <div className="flex h-64 items-center justify-center text-muted-foreground">
                <p className="text-sm">{t("analytics.noData")}</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={summary.leads_by_status.map((s) => ({
                      ...s,
                      name: t(statusKeys[s.name] || s.name),
                    }))}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) =>
                      `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                  >
                    {summary.leads_by_status.map((_, i) => (
                      <Cell
                        key={i}
                        fill={COLORS[i % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t("analytics.reportsByDay")}</CardTitle>
            <CardDescription>
              {t("analytics.reportsByDayDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {summary.reports_by_day.length === 0 ? (
              <div className="flex h-64 items-center justify-center text-muted-foreground">
                <p className="text-sm">{t("analytics.noData")}</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={summary.reports_by_day}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-border"
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
