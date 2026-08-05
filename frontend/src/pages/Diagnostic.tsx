import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/lib/api"
import { trackEvent } from "@/lib/analytics"
import { BUSINESS_TYPES, TEAM_SIZES, PROBLEM_PROCESSES, TOOLS } from "@/lib/diagnostic"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Building2,
  Users,
  Wrench,
  Bot,
  Mail,
  Sparkles,
  Loader2,
  AlertCircle,
  Zap,
} from "lucide-react"

interface FormData {
  name: string
  email: string
  telegram: string
  businessType: string
  teamSize: string
  problemProcesses: string[]
  tools: string[]
}

const DRAFT_KEY = "aibc-diagnostic-draft"
const TOTAL_STEPS = 5
const PROCESSING_STAGE_COUNT = 5

const defaultForm: FormData = {
  name: "",
  email: "",
  telegram: "",
  businessType: "",
  teamSize: "",
  problemProcesses: [],
  tools: [],
}

function loadDraft(): FormData {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY)
    if (!raw) return defaultForm
    const parsed = JSON.parse(raw) as Partial<FormData>
    return {
      ...defaultForm,
      ...parsed,
      problemProcesses: Array.isArray(parsed.problemProcesses) ? parsed.problemProcesses : [],
      tools: Array.isArray(parsed.tools) ? parsed.tools : [],
    }
  } catch {
    return defaultForm
  }
}

const stepKeys = ["business", "team", "processes", "tools", "contacts"] as const
const stepIcons = [Building2, Users, Wrench, Bot, Mail]

export default function Diagnostic() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [reportId, setReportId] = useState<number | null>(null)
  const [processingStage, setProcessingStage] = useState(0)
  const [form, setForm] = useState<FormData>(loadDraft)

  useEffect(() => {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(form))
  }, [form])

  const processingStages = [
    t("diagnostic.processing.stages.one"),
    t("diagnostic.processing.stages.two"),
    t("diagnostic.processing.stages.three"),
    t("diagnostic.processing.stages.four"),
    t("diagnostic.processing.stages.five"),
  ]

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const toggleArray = (key: "problemProcesses" | "tools", value: string) =>
    setForm((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }))

  const validateStep = () => {
    setError("")
    if (step === 1 && !form.businessType) {
      setError(t("diagnostic.requiredBusiness"))
      return false
    }
    if (step === 2 && !form.teamSize) {
      setError(t("diagnostic.requiredTeam"))
      return false
    }
    if (step === 3 && form.problemProcesses.length === 0) {
      setError(t("diagnostic.requiredProcess"))
      return false
    }
    if (step === 4 && form.tools.length === 0) {
      setError(t("diagnostic.requiredTools"))
      return false
    }
    if (step === 5) {
      if (!form.name || !form.email) {
        setError(t("diagnostic.requiredNameEmail"))
        return false
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(form.email)) {
        setError(t("diagnostic.invalidEmail"))
        return false
      }
    }
    return true
  }

  const next = () => {
    if (!validateStep()) return
    if (step < TOTAL_STEPS) setStep(step + 1)
    trackEvent("diag_step_completed", { step })
  }

  const prev = () => {
    if (step > 1) setStep(step - 1)
    setError("")
  }

  const submit = async () => {
    if (!validateStep()) return
    setLoading(true)
    setError("")
    setProcessingStage(0)
    trackEvent("diag_started", { business_type: form.businessType, team_size: form.teamSize })

    const stageTimer = setInterval(() => {
      setProcessingStage((s) => Math.min(s + 1, PROCESSING_STAGE_COUNT - 1))
    }, 2200)

    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

    try {
      const diagResult = await api.submitDiagnostic({
        name: form.name,
        email: form.email,
        telegram: form.telegram || undefined,
        business_type: form.businessType,
        team_size: form.teamSize,
        problem_processes: form.problemProcesses,
        tools: form.tools,
      })

      setProcessingStage((s) => Math.max(s, 2))

      const analysisResult = await api.analyzeBusiness(diagResult.user_id, {
        name: form.name,
        email: form.email,
        business_type: form.businessType,
        team_size: form.teamSize,
        problem_processes: form.problemProcesses,
        tools: form.tools,
      })

      clearInterval(stageTimer)
      setProcessingStage(PROCESSING_STAGE_COUNT)
      await delay(700)
      sessionStorage.removeItem(DRAFT_KEY)
      setReportId(analysisResult.id)
      trackEvent("diag_completed", { report_id: analysisResult.id })
    } catch (err) {
      clearInterval(stageTimer)
      setLoading(false)
      setError(err instanceof Error ? err.message : t("diagnostic.submitError"))
    }
  }

  if (reportId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-background p-4">
        <Card className="w-full max-w-lg text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <Sparkles className="h-8 w-8 text-emerald-600" />
            </div>
            <CardTitle className="text-2xl">{t("diagnostic.successTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              {t("diagnostic.successText")}
            </p>
            <div className="flex flex-col gap-3">
              <Button size="lg" onClick={() => navigate(`/report/${reportId}`)}>
                <Sparkles className="mr-2 h-5 w-5" />
                {t("diagnostic.openReport")}
              </Button>
              <Button variant="outline" onClick={() => navigate("/")}>
                {t("diagnostic.home")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-background p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-8 text-center">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="h-7 w-7 animate-pulse text-primary" />
            </div>
            <h2 className="text-xl font-semibold">{t("diagnostic.processing.title")}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t("diagnostic.processing.subtitle")}</p>
            <div className="mt-8 space-y-3 text-left">
              {processingStages.map((stage, i) => {
                const done = i < processingStage
                const active = i === processingStage
                return (
                  <div key={stage} className="flex items-center gap-3">
                    <div
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors ${
                        done
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : active
                            ? "border-primary bg-primary/10"
                            : "border-border bg-muted/40"
                      }`}
                    >
                      {done ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : active ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                      ) : null}
                    </div>
                    <span
                      className={`text-sm transition-colors ${
                        done || active ? "text-foreground" : "text-muted-foreground/60"
                      }`}
                    >
                      {stage}
                    </span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-background">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between gap-4">
            <span className="text-sm font-semibold">
              {t("diagnostic.stepOf", { step, total: TOTAL_STEPS })}
            </span>
            <span className="text-xs text-muted-foreground">{t("diagnostic.timeHint")}</span>
          </div>
          <div className="flex items-center justify-between">
            {stepKeys.map((key, i) => {
              const id = i + 1
              const Icon = stepIcons[i]
              return (
                <div key={key} className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors
                      ${id === step ? "bg-primary text-primary-foreground shadow-lg" : ""}
                      ${id < step ? "bg-primary/20 text-primary" : ""}
                      ${id > step ? "bg-muted text-muted-foreground" : ""}
                    `}
                  >
                    {id < step ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                  </div>
                  <span
                    className={`mt-1.5 hidden text-xs sm:block ${
                      id === step ? "font-medium text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {t(`diagnostic.steps.${key}`)}
                  </span>
                </div>
              )
            })}
          </div>
          <div className="relative mt-4 h-1.5 rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${((step - 1) / (TOTAL_STEPS - 1)) * 100}%` }}
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              {(() => {
                const Icon = stepIcons[step - 1]
                return <Icon className="h-5 w-5 text-primary" />
              })()}
              <CardTitle>
                {step === 1 && t("diagnostic.businessTitle")}
                {step === 2 && t("diagnostic.teamTitle")}
                {step === 3 && t("diagnostic.processesTitle")}
                {step === 4 && t("diagnostic.toolsTitle")}
                {step === 5 && t("diagnostic.contactTitle")}
              </CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">
              {t(`diagnostic.stepHints.${stepKeys[step - 1]}`)}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {step === 1 && (
              <div className="grid grid-cols-2 gap-3">
                {BUSINESS_TYPES.map((bt) => (
                  <button
                    key={bt.value}
                    onClick={() => update("businessType", bt.value)}
                    className={`flex items-center gap-3 rounded-lg border p-4 text-left transition-all hover:border-primary hover:bg-primary/5
                      ${form.businessType === bt.value ? "border-primary bg-primary/10 ring-1 ring-primary" : "bg-card"}
                    `}
                  >
                    <span className="text-2xl">{bt.icon}</span>
                    <div>
                      <p className="font-medium">{t(`diagnostic.businessTypes.${bt.value}`)}</p>
                    </div>
                    {form.businessType === bt.value && (
                      <Check className="ml-auto h-4 w-4 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="grid grid-cols-2 gap-3">
                {TEAM_SIZES.map((ts) => (
                  <button
                    key={ts.value}
                    onClick={() => update("teamSize", ts.value)}
                    className={`flex flex-col items-center justify-center rounded-lg border p-6 text-center transition-all hover:border-primary hover:bg-primary/5
                      ${form.teamSize === ts.value ? "border-primary bg-primary/10 ring-1 ring-primary" : "bg-card"}
                    `}
                  >
                    <Users className="mb-2 h-6 w-6 text-primary" />
                    <span className="font-medium">{t(`diagnostic.teamSizes.${ts.value}`)}</span>
                  </button>
                ))}
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-wrap gap-3">
                {PROBLEM_PROCESSES.map((pp) => {
                  const selected = form.problemProcesses.includes(pp.value)
                  return (
                    <button
                      key={pp.value}
                      onClick={() => toggleArray("problemProcesses", pp.value)}
                      className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm transition-all hover:border-primary
                        ${selected ? "border-primary bg-primary text-primary-foreground" : "bg-card"}
                      `}
                    >
                      {selected && <Check className="h-4 w-4" />}
                      {t(`diagnostic.processes.${pp.value}`)}
                    </button>
                  )
                })}
              </div>
            )}

            {step === 4 && (
              <div className="flex flex-wrap gap-3">
                {TOOLS.map((tool) => {
                  const selected = form.tools.includes(tool.value)
                  return (
                    <button
                      key={tool.value}
                      onClick={() => toggleArray("tools", tool.value)}
                      className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm transition-all hover:border-primary
                        ${selected ? "border-primary bg-primary text-primary-foreground" : "bg-card"}
                      `}
                    >
                      {selected && <Check className="h-4 w-4" />}
                      {t(`diagnostic.tools.${tool.value}`)}
                    </button>
                  )
                })}
              </div>
            )}

            {step === 5 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("diagnostic.name")}</label>
                  <Input
                    placeholder={t("diagnostic.namePlaceholder")}
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("diagnostic.email")}</label>
                  <Input
                    type="email"
                    placeholder={t("diagnostic.emailPlaceholder")}
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("diagnostic.telegram")}</label>
                  <Input
                    placeholder={t("diagnostic.telegramPlaceholder")}
                    value={form.telegram}
                    onChange={(e) => update("telegram", e.target.value)}
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <div className="flex items-center justify-between pt-4">
              <Button variant="ghost" onClick={step === 1 ? () => navigate("/") : prev}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {step === 1 ? t("diagnostic.home") : t("diagnostic.back")}
              </Button>

              {step < TOTAL_STEPS ? (
                <Button onClick={next}>
                  {t("diagnostic.next")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={submit}>
                  <Zap className="mr-2 h-4 w-4" />
                  {t("diagnostic.getAnalysis")}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
