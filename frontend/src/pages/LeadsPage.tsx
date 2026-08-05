import { useEffect, useState, useCallback } from "react"
import { useTranslation } from "react-i18next"
import { api } from "@/lib/api"
import { tBusinessType } from "@/lib/i18n"
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

const statusVariant: Record<string, "warning" | "default" | "success" | "secondary"> = {
  new: "warning",
  in_progress: "default",
  completed: "success",
  archived: "secondary",
}

const statuses = ["new", "in_progress", "completed", "archived"]

export default function LeadsPage() {
  const { t, i18n } = useTranslation()
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  const statusLabels: Record<string, string> = {
    new: t("leads.status.new"),
    in_progress: t("leads.status.in_progress"),
    completed: t("leads.status.completed"),
    archived: t("leads.status.archived"),
  }

  const fetchLeads = useCallback(async (skip: number) => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.listLeads(skip, PAGE_SIZE)
      setLeads(data)
      setHasMore(data.length === PAGE_SIZE)
    } catch (err) {
      setError(err instanceof Error ? err.message : t("leads.loadError"))
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
      <h1 className="text-2xl font-bold">{t("leads.title")}</h1>

      <Card>
        <CardHeader>
          <CardTitle>{t("leads.allLeads")}</CardTitle>
        </CardHeader>
        <CardContent>
          {leads.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
              <Users className="h-12 w-12" />
              <p className="text-lg font-medium">{t("leads.noLeads")}</p>
              <p className="text-sm">{t("leads.noLeadsHint")}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="whitespace-nowrap pb-3 pr-4 font-medium">{t("leads.table.id")}</th>
                    <th className="whitespace-nowrap pb-3 pr-4 font-medium">{t("leads.table.name")}</th>
                    <th className="whitespace-nowrap pb-3 pr-4 font-medium">{t("leads.table.email")}</th>
                    <th className="whitespace-nowrap pb-3 pr-4 font-medium">{t("leads.table.business")}</th>
                    <th className="whitespace-nowrap pb-3 pr-4 font-medium">{t("leads.table.team")}</th>
                    <th className="whitespace-nowrap pb-3 pr-4 font-medium">{t("leads.table.status")}</th>
                    <th className="whitespace-nowrap pb-3 font-medium">{t("leads.table.date")}</th>
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
                        {tBusinessType(lead.business_type || "—")}
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
                          <SelectTrigger className="h-7 w-32 text-xs" aria-label={t("leads.table.status")}>
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
                        {new Date(lead.created_at).toLocaleDateString(i18n.language)}
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
                {t("leads.page", { page: page + 1 })}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0 || loading}
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  {t("leads.back")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!hasMore || loading}
                >
                  {t("leads.forward")}
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
