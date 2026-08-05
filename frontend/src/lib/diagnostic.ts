import type { BusinessType, ProblemProcess, TeamSize, Tool } from "@/types"

export const BUSINESS_TYPES: { value: BusinessType; icon: string }[] = [
  { value: "ecommerce", icon: "🛒" },
  { value: "services", icon: "💼" },
  { value: "expert", icon: "🎓" },
  { value: "agency", icon: "🏢" },
  { value: "education", icon: "📚" },
  { value: "manufacturing", icon: "🏭" },
]

export const TEAM_SIZES: { value: TeamSize }[] = [
  { value: "solo" },
  { value: "2-5" },
  { value: "5-20" },
  { value: "20+" },
]

export const PROBLEM_PROCESSES: { value: ProblemProcess }[] = [
  { value: "support" },
  { value: "sales" },
  { value: "content" },
  { value: "marketing" },
  { value: "analytics" },
  { value: "documents" },
]

export const TOOLS: { value: Tool }[] = [
  { value: "telegram" },
  { value: "crm" },
  { value: "sheets" },
  { value: "notion" },
  { value: "excel" },
]
