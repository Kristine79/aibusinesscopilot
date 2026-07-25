import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "@/lib/api"
import type { Report } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, AlertCircle, FileText, ChevronLeft, ChevronRight } from "lucide-react"

const PAGE_SIZE = 15

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await api.listReports(page * PAGE_SIZE, PAGE_SIZE)
        if (cancelled) return
        setReports(data)
        setHasMore(data.length === PAGE_SIZE)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Ошибка загрузки отчетов")
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [page])

  if (loading && reports.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error && reports.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-2 text-destructive">
        <AlertCircle className="h-8 w-8" />
        <p className="text-sm">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reports</h1>

      <Card>
        <CardHeader>
          <CardTitle>Все анализы</CardTitle>
        </CardHeader>
        <CardContent>
          {reports.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
              <FileText className="h-12 w-12" />
              <p className="text-lg font-medium">Нет отчетов</p>
              <p className="text-sm">Отчеты пока не созданы</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="whitespace-nowrap pb-3 pr-4 font-medium">ID</th>
                    <th className="whitespace-nowrap pb-3 pr-4 font-medium">User ID</th>
                    <th className="whitespace-nowrap pb-3 pr-4 font-medium">Lead ID</th>
                    <th className="whitespace-nowrap pb-3 font-medium">Дата</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr
                      key={report.id}
                      className="cursor-pointer border-b transition-colors last:border-0 hover:bg-muted/50"
                      onClick={() => navigate(`/dashboard/reports/${report.id}`)}
                    >
                      <td className="whitespace-nowrap py-3 pr-4 font-medium">
                        {report.id}
                      </td>
                      <td className="whitespace-nowrap py-3 pr-4">{report.user_id}</td>
                      <td className="whitespace-nowrap py-3 pr-4 text-muted-foreground">
                        {report.lead_id ?? "—"}
                      </td>
                      <td className="whitespace-nowrap py-3 text-muted-foreground">
                        {new Date(report.created_at).toLocaleDateString("ru-RU")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {reports.length > 0 && (
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-muted-foreground">
                Страница {page + 1}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0 || loading}
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Назад
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!hasMore || loading}
                >
                  Вперед
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
