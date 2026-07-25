export interface DiagnosticData {
  name: string
  email: string
  telegram: string
  business_type: string
  team_size: string
  problem_processes: string[]
  tools: string[]
}

export interface Lead {
  id: number
  user_id: number
  status: string
  created_at: string
  user_name?: string
  user_email?: string
  business_type?: string
  team_size?: number
}

export interface Opportunity {
  problem: string
  solution: string
  tools: string
  time_saved: string
  priority: string
}

export interface RoadmapItem {
  stage: string
  actions: string
  duration: string
}

export interface AnalysisResult {
  summary: string
  opportunities: Opportunity[]
  roadmap: RoadmapItem[]
}

export interface Report {
  id: number
  user_id: number
  lead_id: number | null
  report_json: Record<string, unknown>
  created_at: string
}

export interface AnalyticsSummary {
  total_leads: number
  total_reports: number
  total_events: number
  business_type_distribution: { name: string; count: number }[]
  leads_by_status: { name: string; count: number }[]
  reports_by_day: { date: string; count: number }[]
}

export interface KnowledgeDocument {
  id: number
  title: string
  content: string
  doc_type: string
  created_at: string
}

export type BusinessType =
  | "ecommerce"
  | "services"
  | "expert"
  | "agency"
  | "education"
  | "manufacturing"

export type TeamSize = "solo" | "2-5" | "5-20" | "20+"

export type ProblemProcess =
  | "support"
  | "sales"
  | "content"
  | "marketing"
  | "analytics"
  | "documents"

export type Tool = "telegram" | "crm" | "sheets" | "notion" | "excel"