import { useEffect, useState, useCallback } from "react"
import { api } from "@/lib/api"
import type { Lead } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, AlertCircle, ChevronLeft, ChevronRight, Users } from "lucide-react"

const PAGE_SIZE = 10

const statusLabels: Record<string, string> = {
  new: "Новый",
  in_progress: "В работе",
  completed: "Завершен",
  archived: "В архиве",
}

const statusVariant: Record<string, "warning" | "default" | "success" | "secondary"> = {
  new: "warning",
  in_progress: "default",
  completed: "success",
  archived: "secondary",
}

const statuses = Object.keys(statusLabels)

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  const fetchLeads = useCallback(async (skip: number) => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.listLeads(skip, PAGE_SIZE)
      setLeads(data)
      setHasMore(data.length === PAGE_SIZE)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка загрузки заявок")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLeads(page * PAGE_SIZE)
  }, [page, fetchLeads])

  const handleStatusChange = async (leadId: number, newStatus: string) => {
    setUpdatingId(leadId)
    try {
      await api.updateLeadStatus(leadId, newStatus)
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
      )
    } catch {
      /* silently revert — select won't visually change */
    } finally {
      setUpdatingId(null)
    }
  }

  if (loading && leads.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error && leads.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-2 text-destructive">
        <AlertCircle className="h-8 w-8" />
        <p className="text-sm">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Leads</h1>

      <Card>
        <CardHeader>
          <CardTitle>Все заявки</CardTitle>
        </CardHeader>
        <CardContent>
          {leads.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
              <Users className="h-12 w-12" />
              <p className="text-lg font-medium">Нет заявок</p>
              <p className="text-sm">Заявки пока не поступали</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="whitespace-nowrap pb-3 pr-4 font-medium">ID</th>
                    <th className="whitespace-nowrap pb-3 pr-4 font-medium">Имя</th>
                    <th className="whitespace-nowrap pb-3 pr-4 font-medium">Email</th>
                    <th className="whitespace-nowrap pb-3 pr-4 font-medium">Бизнес</th>
                    <th className="whitespace-nowrap pb-3 pr-4 font-medium">Команда</th>
                    <th className="whitespace-nowrap pb-3 pr-4 font-medium">Статус</th>
                    <th className="whitespace-nowrap pb-3 font-medium">Дата</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="border-b transition-colors last:border-0 hover:bg-muted/50"
                    >
                      <td className="whitespace-nowrap py-3 pr-4">{lead.id}</td>
                      <td className="whitespace-nowrap py-3 pr-4 font-medium">
                        {lead.user_name || "—"}
                      </td>
                      <td className="whitespace-nowrap py-3 pr-4 text-muted-foreground">
                        {lead.user_email || "—"}
                      </td>
                      <td className="whitespace-nowrap py-3 pr-4">
                        {lead.business_type || "—"}
                      </td>
                      <td className="whitespace-nowrap py-3 pr-4">
                        {lead.team_size ? `${lead.team_size} чел.` : "—"}
                      </td>
                      <td className="whitespace-nowrap py-3 pr-4">
                        <Select
                          value={lead.status}
                          onValueChange={(value) => handleStatusChange(lead.id, value)}
                          disabled={updatingId === lead.id}
                        >
                          <SelectTrigger className="h-7 w-32 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {statuses.map((s) => (
                              <SelectItem key={s} value={s}>
                                <span className="flex items-center gap-2">
                                  <Badge
                                    variant={statusVariant[s] || "secondary"}
                                    className="px-1.5 py-0 text-[10px]"
                                  >
                                    {statusLabels[s]}
                                  </Badge>
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="whitespace-nowrap py-3 text-muted-foreground">
                        {new Date(lead.created_at).toLocaleDateString("ru-RU")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {leads.length > 0 && (
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
