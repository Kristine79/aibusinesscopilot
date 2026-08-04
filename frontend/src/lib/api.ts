import type { AnalyticsSummary, Lead, Report } from "@/types"

const API_URL = import.meta.env.VITE_API_URL || "/api"

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_URL}${path}`
  const body = options?.body
  console.log(`[API] ${options?.method || "GET"} ${url}`, body)
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }))
    console.error(`[API ERROR] ${res.status}`, error)
    const message = Array.isArray(error.detail)
      ? error.detail.map((e: { loc?: string[]; msg?: string }) => `${e.loc?.join(".")}: ${e.msg}`).join("; ")
      : error.detail || `Request failed: ${res.status}`
    throw new Error(message)
  }
  return res.json()
}

export const api = {
  submitDiagnostic: (data: Record<string, unknown>) =>
    request<{ user_id: number; lead_id: number }>("/leads/diagnostic", { method: "POST", body: JSON.stringify(data) }),

  analyzeBusiness: (userId: number, data: Record<string, unknown>) =>
    request<{ report_id: number; user_id: number; analysis: Record<string, unknown> }>(`/analyze/${userId}`, { method: "POST", body: JSON.stringify(data) }),

  getReport: (reportId: number) =>
    request<Report>(`/reports/${reportId}`),

  listReports: (skip = 0, limit = 20) =>
    request<Report[]>(`/reports?skip=${skip}&limit=${limit}`),

  listLeads: (skip = 0, limit = 20) =>
    request<Lead[]>(`/leads?skip=${skip}&limit=${limit}`),

  updateLeadStatus: (leadId: number, status: string) =>
    request<Lead>(`/leads/${leadId}`, { method: "PATCH", body: JSON.stringify({ status }) }),

  getAnalyticsSummary: () =>
    request<AnalyticsSummary>("/analytics/summary"),

  listDocuments: () =>
    request<unknown[]>("/knowledge/documents"),

  uploadDocument: (data: Record<string, unknown>) =>
    request<unknown>("/knowledge/documents", { method: "POST", body: JSON.stringify(data) }),

  deleteDocument: (id: number) =>
    request<void>(`/knowledge/documents/${id}`, { method: "DELETE" }),

  reindexDocuments: () =>
    request<unknown>("/knowledge/reindex", { method: "POST" }),

  chatQuery: (message: string) =>
    request<{ answer: string }>("/knowledge/chat", { method: "POST", body: JSON.stringify({ message }) }),
}

export type { AnalyticsSummary, Lead, Report }