import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/lib/api"
import { BUSINESS_TYPES, TEAM_SIZES, PROBLEM_PROCESSES, TOOLS } from "@/lib/diagnostic"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Building2,
  Users,
  Wrench,
  Bot,
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

const steps = [
  { id: 1, title: "Контакты", icon: "1" },
  { id: 2, title: "Бизнес", icon: "2" },
  { id: 3, title: "Команда", icon: "3" },
  { id: 4, title: "Процессы", icon: "4" },
  { id: 5, title: "Инструменты", icon: "5" },
]

export default function Diagnostic() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [reportId, setReportId] = useState<number | null>(null)
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    telegram: "",
    businessType: "",
    teamSize: "",
    problemProcesses: [],
    tools: [],
  })

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
    if (step === 1) {
      if (!form.name || !form.email) {
        setError("Заполните имя и email")
        return false
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(form.email)) {
        setError("Введите корректный email")
        return false
      }
    }
    if (step === 2 && !form.businessType) {
      setError("Выберите тип бизнеса")
      return false
    }
    if (step === 3 && !form.teamSize) {
      setError("Выберите размер команды")
      return false
    }
    if (step === 4 && form.problemProcesses.length === 0) {
      setError("Выберите хотя бы один процесс")
      return false
    }
    if (step === 5 && form.tools.length === 0) {
      setError("Выберите хотя бы один инструмент")
      return false
    }
    return true
  }

  const next = () => {
    if (!validateStep()) return
    if (step < 5) setStep(step + 1)
  }

  const prev = () => {
    if (step > 1) setStep(step - 1)
    setError("")
  }

  const submit = async () => {
    if (!validateStep()) return
    setLoading(true)
    setError("")

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

      const analysisResult = await api.analyzeBusiness(diagResult.user_id, {
        name: form.name,
        email: form.email,
        business_type: form.businessType,
        team_size: form.teamSize,
        problem_processes: form.problemProcesses,
        tools: form.tools,
      })

      setReportId(analysisResult.report_id)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка при отправке")
    } finally {
      setLoading(false)
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
            <CardTitle className="text-2xl">AI-анализ готов!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Ваш персональный AI-отчёт по автоматизации бизнеса готов к просмотру.
            </p>
            <div className="flex flex-col gap-3">
              <Button size="lg" onClick={() => navigate(`/report/${reportId}`)}>
                <Sparkles className="mr-2 h-5 w-5" />
                Открыть отчёт
              </Button>
              <Button variant="outline" onClick={() => navigate("/")}>
                На главную
              </Button>
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
          <div className="flex items-center justify-between">
            {steps.map((s) => (
              <div key={s.id} className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-colors
                    ${s.id === step ? "bg-primary text-primary-foreground shadow-lg" : ""}
                    ${s.id < step ? "bg-primary/20 text-primary" : ""}
                    ${s.id > step ? "bg-muted text-muted-foreground" : ""}
                  `}
                >
                  {s.id < step ? <Check className="h-5 w-5" /> : s.icon}
                </div>
                <span className="mt-1.5 hidden text-xs text-muted-foreground sm:block">
                  {s.title}
                </span>
              </div>
            ))}
          </div>
          <div className="relative mt-4 h-1.5 rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${((step - 1) / 4) * 100}%` }}
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              {step === 1 && <Building2 className="h-5 w-5 text-primary" />}
              {step === 2 && <Building2 className="h-5 w-5 text-primary" />}
              {step === 3 && <Users className="h-5 w-5 text-primary" />}
              {step === 4 && <Wrench className="h-5 w-5 text-primary" />}
              {step === 5 && <Bot className="h-5 w-5 text-primary" />}
              <CardTitle>
                {step === 1 && "Ваши контакты"}
                {step === 2 && "Тип бизнеса"}
                {step === 3 && "Размер команды"}
                {step === 4 && "Проблемные процессы"}
                {step === 5 && "Используемые инструменты"}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ваше имя</label>
                  <Input
                    placeholder="Иван Иванов"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    placeholder="ivan@example.com"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Telegram (необязательно)</label>
                  <Input
                    placeholder="@ivanov"
                    value={form.telegram}
                    onChange={(e) => update("telegram", e.target.value)}
                  />
                </div>
              </div>
            )}

            {step === 2 && (
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
                      <p className="font-medium">{bt.label}</p>
                    </div>
                    {form.businessType === bt.value && (
                      <Check className="ml-auto h-4 w-4 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {step === 3 && (
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
                    <span className="font-medium">{ts.label}</span>
                  </button>
                ))}
              </div>
            )}

            {step === 4 && (
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
                      {pp.label}
                    </button>
                  )
                })}
              </div>
            )}

            {step === 5 && (
              <div className="flex flex-wrap gap-3">
                {TOOLS.map((t) => {
                  const selected = form.tools.includes(t.value)
                  return (
                    <button
                      key={t.value}
                      onClick={() => toggleArray("tools", t.value)}
                      className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm transition-all hover:border-primary
                        ${selected ? "border-primary bg-primary text-primary-foreground" : "bg-card"}
                      `}
                    >
                      {selected && <Check className="h-4 w-4" />}
                      {t.label}
                    </button>
                  )
                })}
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
                {step === 1 ? "На главную" : "Назад"}
              </Button>

              {step < 5 ? (
                <Button onClick={next}>
                  Далее
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={submit} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Анализируем...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      Получить AI-анализ
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}