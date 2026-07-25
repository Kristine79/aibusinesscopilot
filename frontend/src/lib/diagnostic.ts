import type { BusinessType, ProblemProcess, TeamSize, Tool } from "@/types"

export const BUSINESS_TYPES: { value: BusinessType; label: string; icon: string }[] = [
  { value: "ecommerce", label: "E-commerce", icon: "🛒" },
  { value: "services", label: "Услуги", icon: "💼" },
  { value: "expert", label: "Эксперт", icon: "🎓" },
  { value: "agency", label: "Агентство", icon: "🏢" },
  { value: "education", label: "Образование", icon: "📚" },
  { value: "manufacturing", label: "Производство", icon: "🏭" },
]

export const TEAM_SIZES: { value: TeamSize; label: string }[] = [
  { value: "solo", label: "Сам(а)" },
  { value: "2-5", label: "2-5 человек" },
  { value: "5-20", label: "5-20 человек" },
  { value: "20+", label: "Более 20" },
]

export const PROBLEM_PROCESSES: { value: ProblemProcess; label: string }[] = [
  { value: "support", label: "Поддержка клиентов" },
  { value: "sales", label: "Продажи" },
  { value: "content", label: "Создание контента" },
  { value: "marketing", label: "Маркетинг" },
  { value: "analytics", label: "Аналитика и отчеты" },
  { value: "documents", label: "Документооборот" },
]

export const TOOLS: { value: Tool; label: string }[] = [
  { value: "telegram", label: "Telegram" },
  { value: "crm", label: "CRM" },
  { value: "sheets", label: "Google Sheets" },
  { value: "notion", label: "Notion" },
  { value: "excel", label: "Excel" },
]