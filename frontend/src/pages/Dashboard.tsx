import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { api } from "@/lib/api"
import { tBusinessType } from "@/lib/i18n"
import { computeReadinessScore, scoreLevel } from "@/lib/report-score"
import type { AnalyticsSummary, Lead, Report } from "@/types"
import {
  Users, FileText, TrendingUp, BarChart3, ArrowRight, Loader2, Bot,
  CheckCircle2, Target, ArrowDown, CircleDashed,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function Dashboard() {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null)
  const [leads, setLeads] = useState<Lead[]>([])
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.getAnalyticsSummary(),
      api.listLeads(0, 5),
      api.listReports(0, 5),
    ])
      .then(([s, l, r]) => {
        setSummary(s)
        setLeads(l)
        setReports(r)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const statCards = summary
    ? [
        { label: t("dashboard.totalLeads"), value: summary.total_leads, icon: TrendingUp, color: "text-indigo-600 bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-900" },
        { label: t("dashboard.totalReports"), value: summary.total_reports, icon: FileText, color: "text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900" },
        { label: t("dashboard.totalEvents"), value: summary.total_events, icon: BarChart3, color: "text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900" },
        { label: t("dashboard.businessTypes"), value: summary.business_type_distribution?.length || 0, icon: Users, color: "text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900" },
      ]
    : []

  const leadToReport = summary && summary.total_leads > 0
    ? Math.round((summary.total_reports / summary.total_leads) * 100)
    : 0
  const reportToEvent = summary && summary.total_reports > 0
    ? Math.round((summary.total_events / summary.total_reports) * 100)
    : 0

  const funnel = summary
    ? [
        { label: t("dashboard.funnel.leads"), value: summary.total_leads, icon: Target },
        { label: t("dashboard.funnel.reports"), value: summary.total_reports, icon: FileText },
        { label: t("dashboard.funnel.events"), value: summary.total_events, icon: CheckCircle2 },
      ]
    : []

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("dashboard.title")}</h1>
        <p className="text-muted-foreground">{t("dashboard.subtitle")}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <div className={`rounded-lg p-2 ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Funnel */}
        <div className="rounded-xl border bg-card">
          <div className="border-b px-6 py-4">
            <h2 className="font-semibold">{t("dashboard.funnelTitle")}</h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {funnel.map((step, i) => (
                <div key={step.label} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <step.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{step.label}</p>
                    <div className="mt-1 h-1.5 rounded-full bg-muted">
                      <div
                        className={cn(
                          "h-1.5 rounded-full transition-all",
                          i === 0 ? "bg-blue-500" : i === 1 ? "bg-purple-500" : "bg-emerald-500"
                        )}
                        style={{ width: i === 0 ? "100%" : `${(step.value / Math.max(1, funnel[0].value)) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-bold">{step.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 space-y-2 border-t pt-4 text-sm text-muted-foreground">
              <p className="flex items-center justify-between">
                <span>{t("dashboard.conversionRate")} {t("dashboard.funnel.leads")} → {t("dashboard.funnel.reports")}</span>
                <span className="font-medium text-foreground">{leadToReport}%</span>
              </p>
              <p className="flex items-center justify-between">
                <span>{t("dashboard.conversionRate")} {t("dashboard.funnel.reports")} → {t("dashboard.funnel.events")}</span>
                <span className="font-medium text-foreground">{reportToEvent}%</span>
              </p>
            </div>
          </div>
        </div>

        {/* Recent reports */}
        <div className="rounded-xl border bg-card lg:col-span-2">
          <div className="flex items-center justify-between border-b px-6 py-4">
            <h2 className="font-semibold">{t("dashboard.recentReports")}</h2>
            <button
              onClick={() => navigate("/dashboard/reports")}
              className="flex items-center text-sm text-primary hover:underline"
            >
              {t("dashboard.viewAll")} <ArrowRight className="ml-1 h-3 w-3" />
            </button>
          </div>
          <div className="p-6">
            {reports.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Bot className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{t("dashboard.noReports")}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{t("dashboard.noReportsHint")}</p>
                </div>
                <Button onClick={() => navigate("/diagnostic")}>
                  <ArrowDown className="mr-2 h-4 w-4" />
                  {t("dashboard.runDiagnostic")}
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {reports.map((report) => {
                  const score = computeReadinessScore(report)
                  const level = scoreLevel(score)
                  return (
                    <button
                      key={report.id}
                      onClick={() => navigate(`/dashboard/reports/${report.id}`)}
                      className="flex w-full items-center gap-4 rounded-lg border px-4 py-3 text-left transition-colors hover:bg-muted/50"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium">
                          {t("dashboard.report", { id: report.id })}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(report.created_at).toLocaleDateString(i18n.language)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">{score}</span>
                        <span className="text-xs text-muted-foreground">/ 100</span>
                        <Badge variant={level === "high" ? "success" : level === "medium" ? "warning" : "destructive"}>
                          {t(`score.${level}`)}
                        </Badge>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card">
          <div className="flex items-center justify-between border-b px-6 py-4">
            <h2 className="font-semibold">{t("dashboard.recentLeads")}</h2>
            <button
              onClick={() => navigate("/dashboard/leads")}
              className="flex items-center text-sm text-primary hover:underline"
            >
              {t("dashboard.allLeads")} <ArrowRight className="ml-1 h-3 w-3" />
            </button>
          </div>
          <div className="p-6">
            {leads.length === 0 ? (
              <div className="py-8 text-center">
                <CircleDashed className="mx-auto mb-3 h-8 w-8 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">{t("dashboard.noLeadsHint")}</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => navigate("/diagnostic")}
                >
                  {t("dashboard.runDiagnostic")}
                </Button>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-3 font-medium">{t("dashboard.table.name")}</th>
                    <th className="pb-3 font-medium">{t("dashboard.table.email")}</th>
                    <th className="pb-3 font-medium">{t("dashboard.table.business")}</th>
                    <th className="pb-3 font-medium">{t("dashboard.table.date")}</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.slice(0, 5).map((lead) => (
                    <tr key={lead.id} className="border-b last:border-0">
                      <td className="py-3">{lead.user_name || "—"}</td>
                      <td className="py-3 text-muted-foreground">{lead.user_email || "—"}</td>
                      <td className="py-3 text-muted-foreground">
                        {lead.business_type ? tBusinessType(lead.business_type) : "—"}
                      </td>
                      <td className="py-3 text-muted-foreground">
                        {new Date(lead.created_at).toLocaleDateString(i18n.language)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="rounded-xl border bg-card">
          <div className="flex items-center justify-between border-b px-6 py-4">
            <h2 className="font-semibold">{t("dashboard.businessDistribution")}</h2>
          </div>
          <div className="p-6">
            {!summary?.business_type_distribution?.length ? (
              <p className="py-8 text-center text-sm text-muted-foreground">{t("dashboard.noData")}</p>
            ) : (
              <div className="space-y-4">
                {summary.business_type_distribution.map((item) => (
                  <div key={item.name} className="flex items-center gap-4">
                    <span className="w-24 text-sm capitalize">{tBusinessType(item.name)}</span>
                    <div className="flex-1">
                      <div className="h-2 rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-primary transition-all"
                          style={{
                            width: `${Math.min(100, (item.count / Math.max(...summary.business_type_distribution.map((d) => d.count))) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-medium">{item.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
