import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { trackEvent } from "@/lib/analytics"
import { ArrowLeft, ArrowRight, Check, Loader2, MailCheck, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

type QuestionKey = "business" | "team" | "process"

const SCORE_BY_TEAM: Record<string, number> = { solo: 46, "2-5": 58, "5-20": 66, "20+": 74 }
const SCORE_BY_PROCESS: Record<string, number> = {
  support: 4, sales: 6, content: 5, marketing: 6, analytics: 4, documents: 5,
}
const HOURS_BY_PROCESS: Record<string, number> = {
  support: 9, sales: 6, content: 8, marketing: 6, analytics: 5, documents: 6,
}
const LEAD_KEY = "aibc-mini-lead"

export function MiniDiagnostic() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [step, setStep] = useState<QuestionKey>("business")
  const [business, setBusiness] = useState("")
  const [team, setTeam] = useState("")
  const [process, setProcess] = useState("")
  const [showResult, setShowResult] = useState(false)
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [captured, setCaptured] = useState(false)

  const current = step === "business" ? "business" : step === "team" ? "team" : "process"

  const questionOptions =
    current === "business"
      ? ["ecommerce", "services", "expert", "agency", "education", "manufacturing"]
      : current === "team"
        ? ["solo", "2-5", "5-20", "20+"]
        : ["support", "sales", "content", "marketing", "analytics", "documents"]

  const value = current === "business" ? business : current === "team" ? team : process
  const select = (v: string) => {
    if (current === "business") setBusiness(v)
    if (current === "team") setTeam(v)
    if (current === "process") {
      setProcess(v)
      setShowResult(true)
      trackEvent("mini_diag_completed", { business, team, process: v })
    }
  }

  const score = useMemo(() => {
    const base = SCORE_BY_TEAM[team] ?? 50
    const bonus = SCORE_BY_PROCESS[process] ?? 0
    return Math.min(100, base + bonus)
  }, [team, process])

  const hours = HOURS_BY_PROCESS[process] ?? 6

  const submitEmail = () => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!regex.test(email)) {
      setEmailError(t("miniDiag.errorEmail"))
      return
    }
    setEmailError("")
    setSubmitting(true)
    try {
      localStorage.setItem(LEAD_KEY, JSON.stringify({ email, business, team, process, at: Date.now() }))
      trackEvent("mini_lead_captured", { business, team, process })
    } finally {
      setTimeout(() => {
        setSubmitting(false)
        setCaptured(true)
      }, 600)
    }
  }

  const reset = () => {
    setBusiness("")
    setTeam("")
    setProcess("")
    setShowResult(false)
    setCaptured(false)
    setEmail("")
    setStep("business")
  }

  if (captured) {
    return (
      <div className="mx-auto w-full max-w-xl rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-400/10">
          <MailCheck className="h-7 w-7 text-emerald-400" />
        </div>
        <h3 className="text-xl text-white/90">{t("miniDiag.successTitle")}</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/50">{t("miniDiag.successText", { email })}</p>
        <Button
          className="mt-6 rounded-full bg-white px-7 text-black hover:bg-white/90"
          onClick={() => navigate("/diagnostic")}
        >
          {t("miniDiag.fullDiag")}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <button onClick={reset} className="mt-4 block w-full text-xs text-white/30 hover:text-white/60">
          {t("miniDiag.another")}
        </button>
      </div>
    )
  }

  if (showResult) {
    return (
      <div className="mx-auto w-full max-w-xl rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h3 className="text-xl text-white/90">{t("miniDiag.resultTitle")}</h3>
            <p className="mt-1 text-xs text-white/40">{t("miniDiag.scoreLabel")}</p>
          </div>
          <div className="flex items-end gap-1">
            <span className="text-5xl font-light text-white">{score}</span>
            <span className="pb-1.5 text-sm text-white/30">/ 100</span>
          </div>
        </div>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/[0.07]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400 transition-all duration-700"
            style={{ width: `${score}%` }}
          />
        </div>
        <p className="mt-3 text-sm font-medium text-emerald-300/90">
          {t("miniDiag.hoursSaved", { hours })}
        </p>

        <p className="mb-3 mt-6 text-[11px] uppercase tracking-[0.15em] text-white/30">{t("miniDiag.oppsTitle")}</p>
        <div className="space-y-2">
          {(["one", "two"] as const).map((k) => (
            <div key={k} className="flex items-center justify-between gap-3 rounded-lg border border-white/[0.05] bg-white/[0.02] px-4 py-3">
              <span className="flex items-center gap-2.5 text-sm text-white/70">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-400/10">
                  <Check className="h-3 w-3 text-indigo-300" />
                </span>
                {t(`miniDiag.results.${process}.${k}.problem`)}
              </span>
              <span className="shrink-0 rounded-full bg-emerald-400/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300">
                {t(`miniDiag.results.${process}.${k}.impact`)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t border-white/[0.06] pt-5">
          <p className="text-sm font-medium text-white/80">{t("miniDiag.emailTitle")}</p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("miniDiag.emailPlaceholder")}
              className="flex-1 rounded-full border-white/10 bg-white/[0.04] px-5 text-white placeholder:text-white/25"
            />
            <Button
              className="rounded-full bg-white px-6 text-black hover:bg-white/90"
              onClick={submitEmail}
              disabled={submitting || !email}
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : t("miniDiag.getReport")}
            </Button>
          </div>
          {emailError && <p className="mt-2 text-xs text-red-400">{emailError}</p>}
          <p className="mt-2 text-xs text-white/25">{t("miniDiag.emailHint")}</p>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <button onClick={reset} className="text-xs text-white/30 hover:text-white/60">
            {t("miniDiag.another")}
          </button>
          <button
            onClick={() => navigate("/diagnostic")}
            className="flex items-center gap-1.5 text-xs font-medium text-indigo-300 hover:text-indigo-200"
          >
            {t("miniDiag.fullDiag")}
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-xl rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8">
      <div className="mb-6 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-indigo-400" />
        <span className="text-[11px] uppercase tracking-[0.15em] text-white/40">{t("miniDiag.eyebrow")}</span>
      </div>
      <h3 className="text-xl text-white/90">{t(`miniDiag.q${current === "business" ? "1" : current === "team" ? "2" : "3"}Title`)}</h3>

      <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
        {questionOptions.map((opt) => (
          <button
            key={opt}
            onClick={() => select(opt)}
            className={cn(
              "rounded-xl border px-4 py-3.5 text-left text-sm transition-colors",
              value === opt
                ? "border-indigo-400/60 bg-indigo-400/10 text-white"
                : "border-white/[0.08] bg-white/[0.02] text-white/60 hover:border-white/20 hover:text-white/80"
            )}
          >
            {t(`miniDiag.qOptions.${opt}`)}
          </button>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        {step !== "business" ? (
          <button
            onClick={() => setStep(step === "team" ? "business" : "team")}
            className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {t("miniDiag.back")}
          </button>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-1.5">
          {["business", "team", "process"].map((s) => (
            <span
              key={s}
              className={cn("h-1.5 w-6 rounded-full transition-colors", s === step ? "bg-indigo-400" : "bg-white/10")}
            />
          ))}
        </div>
        <span className="w-16 text-right text-xs text-white/30">{t("miniDiag.next")}</span>
      </div>
    </div>
  )
}
