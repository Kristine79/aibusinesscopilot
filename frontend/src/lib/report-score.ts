interface ReportAnalysisShape {
  summary?: string
  opportunities?: Array<{ priority?: string }>
  roadmap?: unknown[]
}

export type ScoreLevel = "low" | "medium" | "high"

export function computeReadinessScore(
  report: { report_json?: Record<string, unknown> } | null | undefined
): number {
  const analysis = report?.report_json as ReportAnalysisShape | undefined
  const opportunities = analysis?.opportunities ?? []
  const roadmap = analysis?.roadmap ?? []
  if (opportunities.length === 0) return 0

  let priorityPoints = 0
  for (const opp of opportunities) {
    if (opp.priority === "high") priorityPoints += 2
    else if (opp.priority === "medium") priorityPoints += 1
    else priorityPoints += 0.5
  }

  const priorityScore = Math.min(priorityPoints / opportunities.length, 2) * 25
  const countScore = Math.min(opportunities.length, 5) * 8
  const roadmapScore = Math.min(roadmap.length, 5) * 2

  return Math.min(100, Math.round(priorityScore + countScore + roadmapScore))
}

export function scoreLevel(score: number): ScoreLevel {
  if (score >= 70) return "high"
  if (score >= 40) return "medium"
  return "low"
}
