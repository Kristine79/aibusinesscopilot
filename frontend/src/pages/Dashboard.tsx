import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "@/lib/api"
import type { AnalyticsSummary, Lead } from "@/types"
import { Users, FileText, TrendingUp, BarChart3, ArrowRight, Loader2 } from "lucide-react"

export default function Dashboard() {
  const navigate = useNavigate()
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null)
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.getAnalyticsSummary(),
      api.listLeads(0, 5),
    ])
      .then(([s, l]) => {
        setSummary(s)
        setLeads(l)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const statCards = summary
    ? [
        { label: "Всего лидов", value: summary.total_leads, icon: TrendingUp, color: "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900" },
        { label: "Анализов", value: summary.total_reports, icon: FileText, color: "text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900" },
        { label: "Событий", value: summary.total_events, icon: BarChart3, color: "text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900" },
        { label: "Типов бизнеса", value: summary.business_type_distribution?.length || 0, icon: Users, color: "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900" },
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
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Общая статистика платформы</p>
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

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card">
          <div className="flex items-center justify-between border-b px-6 py-4">
            <h2 className="font-semibold">Последние лиды</h2>
            <button
              onClick={() => navigate("/dashboard/leads")}
              className="flex items-center text-sm text-primary hover:underline"
            >
              Все лиды <ArrowRight className="ml-1 h-3 w-3" />
            </button>
          </div>
          <div className="p-6">
            {leads.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">Нет данных</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-3 font-medium">Имя</th>
                    <th className="pb-3 font-medium">Email</th>
                    <th className="pb-3 font-medium">Бизнес</th>
                    <th className="pb-3 font-medium">Дата</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.slice(0, 5).map((lead) => (
                    <tr key={lead.id} className="border-b last:border-0">
                      <td className="py-3">{lead.user_name || "—"}</td>
                      <td className="py-3 text-muted-foreground">{lead.user_email || "—"}</td>
                      <td className="py-3 text-muted-foreground">{lead.business_type || "—"}</td>
                      <td className="py-3 text-muted-foreground">
                        {new Date(lead.created_at).toLocaleDateString("ru-RU")}
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
            <h2 className="font-semibold">Распределение по типам бизнеса</h2>
          </div>
          <div className="p-6">
            {!summary?.business_type_distribution?.length ? (
              <p className="py-8 text-center text-sm text-muted-foreground">Нет данных</p>
            ) : (
              <div className="space-y-4">
                {summary.business_type_distribution.map((item) => (
                  <div key={item.name} className="flex items-center gap-4">
                    <span className="w-24 text-sm capitalize">{item.name}</span>
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