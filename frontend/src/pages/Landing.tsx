import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/ui/language-switcher"
import { ReportMockup } from "@/components/landing/ReportMockup"
import { MiniDiagnostic } from "@/components/landing/MiniDiagnostic"
import { trackEvent } from "@/lib/analytics"
import {
  ArrowRight,
  MessageCircle,
  Bot,
  BookOpen,
  Workflow,
  Check,
  ShieldCheck,
  Menu,
  X,
  ChevronDown,
  Zap,
  Lock,
  FileDown,
  HelpCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

const capabilities = [
  { icon: MessageCircle, key: "assistant" },
  { icon: Bot, key: "agents" },
  { icon: BookOpen, key: "rag" },
  { icon: Workflow, key: "automation" },
]

const steps = [
  { step: "01", key: "one" },
  { step: "02", key: "two" },
  { step: "03", key: "three" },
]

const scenarios = ["one", "two", "three", "four"]

const testimonials = ["one", "two", "three"]

const faqItems = ["one", "two", "three", "four", "five", "six", "seven"]

const securityItems = ["one", "two", "three"]

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
}

export default function Landing() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [showSticky, setShowSticky] = useState(false)
  const [stickyDismissed, setStickyDismissed] = useState(false)
  const [openFaq, setOpenFaq] = useState<string | null>("one")

  useEffect(() => {
    const onScroll = () => {
      setShowSticky(window.scrollY > 700)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const goDiagnostic = () => {
    trackEvent("cta_clicked", { placement: "landing" })
    navigate("/diagnostic")
  }

  const navItems = [
    { label: t("nav.howItWorks"), id: "how" },
    { label: t("nav.scenarios"), id: "scenarios" },
    { label: t("nav.capabilities"), id: "capabilities" },
    { label: t("nav.pricing"), id: "pricing" },
    { label: t("nav.faq"), id: "faq" },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#f5f5f7]">
      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <Zap className="h-5 w-5 text-indigo-400" />
            <span className="text-sm font-medium tracking-tight">{t("brand")}</span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  scrollToId(item.id)
                }}
                className="text-sm text-white/50 hover:text-white/80 transition-colors"
              >
                {item.label}
              </a>
            ))}
            <Link to="/blog" className="text-sm text-white/50 hover:text-white/80 transition-colors">
              {t("nav.blog")}
            </Link>
            <Button
              variant="default"
              className="rounded-full bg-white px-5 h-9 text-sm font-medium text-black hover:bg-white/90"
              onClick={goDiagnostic}
            >
              {t("nav.tryDemo")}
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <LanguageSwitcher variant="dark" />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white/70 lg:hidden"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={t("layout.openMenu")}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-white/[0.06] bg-[#0a0a0f]/95 px-6 py-4 backdrop-blur-xl lg:hidden">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    setMenuOpen(false)
                    scrollToId(item.id)
                  }}
                  className="rounded-lg px-3 py-2.5 text-sm text-white/60 hover:bg-white/[0.04] hover:text-white"
                >
                  {item.label}
                </a>
              ))}
              <Link
                to="/blog"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-white/60 hover:bg-white/[0.04] hover:text-white"
              >
                {t("nav.blog")}
              </Link>
              <div className="mt-2 flex items-center justify-between border-t border-white/[0.06] pt-3">
                <LanguageSwitcher variant="dark" />
                <Button className="rounded-full bg-white px-5 h-9 text-sm font-medium text-black" onClick={goDiagnostic}>
                  {t("nav.tryDemo")}
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden pt-36 pb-24">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/20 via-[#0a0a0f] to-[#0a0a0f]" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="mx-auto max-w-7xl px-6 relative">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <div className="text-center lg:text-left">
              <div className="animate-fade-in inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-4 py-1.5 text-xs text-white/40 tracking-wide">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {t("hero.badge")}
              </div>

              <h1 className="animate-slide-up mt-7 text-4xl font-semibold tracking-tight leading-[1.08] sm:text-5xl md:text-6xl">
                {t("hero.titleA")}{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(to left, #6366f1, #a855f7, #fcd34d)" }}
                >
                  {t("hero.titleB")}
                </span>
              </h1>

              <p className="animate-fade-in mx-auto mt-6 max-w-lg text-base leading-relaxed text-white/50 sm:text-lg lg:mx-0">
                {t("hero.subtitle")}
              </p>

              <p className="mt-3 text-sm text-white/30">{t("hero.audience")}</p>

              <ul className="mx-auto mt-6 flex max-w-lg flex-col gap-2.5 text-sm text-white/60 lg:mx-0">
                {(["one", "two", "three"] as const).map((k) => (
                  <li key={k} className="flex items-center gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/10">
                      <Check className="h-3 w-3 text-emerald-400" />
                    </span>
                    {t(`hero.benefits.${k}`)}
                  </li>
                ))}
              </ul>

              <div className="animate-slide-up mt-9 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
                <Button
                  className="rounded-full bg-white px-8 h-12 text-sm font-medium text-black shadow-xl shadow-white/5 hover:bg-white/90"
                  onClick={goDiagnostic}
                >
                  {t("hero.ctaPrimary")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full px-8 h-12 border-white/10 text-white/50 hover:bg-white/[0.04] hover:border-white/20 text-sm"
                  onClick={() => scrollToId("preview")}
                >
                  {t("hero.ctaSecondary")}
                </Button>
              </div>

              <p className="mt-4 text-xs text-white/30">{t("hero.microcopy")}</p>

              <div className="mt-10 grid grid-cols-3 gap-4 border-t border-white/[0.06] pt-6 text-left">
                <div>
                  <p className="text-xl font-semibold text-white">{t("hero.trust.reports")}</p>
                  <p className="mt-0.5 text-[11px] text-white/30">{t("miniDiag.eyebrow")}</p>
                </div>
                <div>
                  <p className="text-xl font-semibold text-white">{t("hero.trust.hours")}</p>
                  <p className="mt-0.5 text-[11px] text-white/30">{t("miniDiag.oppsTitle")}</p>
                </div>
                <div>
                  <p className="text-xl font-semibold text-white">{t("hero.trust.rate")}</p>
                  <p className="mt-0.5 text-[11px] text-white/30">{t("preview.opportunitiesLabel")}</p>
                </div>
              </div>
            </div>

            <div className="animate-fade-in relative">
              <ReportMockup />
              <a
                href="#try"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToId("try")
                }}
                className="absolute -bottom-10 left-1/2 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-white/[0.08] bg-[#12121a] px-5 py-2.5 text-xs text-white/50 hover:text-white/80 transition-colors sm:flex"
              >
                <ChevronDown className="h-3.5 w-3.5 animate-bounce" />
                {t("hero.scrollHint")}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Mini diagnostic */}
      <section id="try" className="border-t border-white/[0.04] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.15em] uppercase text-white/30 mb-4">{t("miniDiag.eyebrow")}</p>
            <h2 className="text-3xl md:text-4xl font-normal tracking-tight">
              {t("miniDiag.title")}
            </h2>
            <p className="mt-3 text-sm text-white/40">{t("miniDiag.subtitle")}</p>
          </div>
          <MiniDiagnostic />
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-t border-white/[0.04] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.15em] uppercase text-white/30 mb-4">{t("process.eyebrow")}</p>
            <h2 className="text-3xl md:text-5xl font-normal tracking-tight">
              {t("process.titleA")} <span className="text-white/50">{t("process.titleB")}</span>
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <div key={step.key} className="relative rounded-xl border border-white/[0.06] bg-white/[0.015] p-8 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.04] text-sm font-mono text-white/30">
                  {step.step}
                </div>
                <h3 className="mb-2 text-lg font-medium text-white/80">{t(`process.steps.${step.key}.title`)}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{t(`process.steps.${step.key}.description`)}</p>
                {i < steps.length - 1 && (
                  <div className="absolute -right-4 top-1/2 hidden -translate-y-1/2 text-white/10 md:block">
                    <ArrowRight className="h-6 w-6" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scenarios */}
      <section id="scenarios" className="border-t border-white/[0.04] py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-4">
            <p className="text-xs tracking-[0.15em] uppercase text-white/30 mb-4">{t("scenarios.eyebrow")}</p>
            <h2 className="text-3xl md:text-5xl font-normal tracking-tight">
              {t("scenarios.titleA")} <span className="text-white/50">{t("scenarios.titleB")}</span>
            </h2>
            <p className="mt-4 text-xs text-white/25">{t("scenarios.outcomeNote")}</p>
          </div>
          <div className="space-y-1">
            {scenarios.map((key, i) => (
              <div key={key} className="group rounded-xl hover:bg-white/[0.015] transition-colors -mx-4 px-4 py-5">
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-0">
                  <div className="md:w-48 shrink-0">
                    <span className="text-sm font-medium text-white/80">{t(`scenarios.items.${key}.title`)}</span>
                  </div>
                  <div className="hidden md:flex items-center px-3">
                    <ArrowRight className="w-3 h-3 text-white/10" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white/30 leading-relaxed line-through decoration-white/5">
                      {t(`scenarios.items.${key}.before`)}
                    </p>
                  </div>
                  <div className="hidden md:flex items-center px-3">
                    <ArrowRight className="w-3 h-3 text-indigo-400/20" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-indigo-300/40 leading-relaxed">{t(`scenarios.items.${key}.after`)}</p>
                  </div>
                  <div className="hidden md:flex items-center px-3">
                    <ArrowRight className="w-3 h-3 text-emerald-400/20" />
                  </div>
                  <div className="md:w-48 shrink-0">
                    <p className="text-xs text-emerald-300/40 font-medium">{t(`scenarios.items.${key}.outcome`)}</p>
                  </div>
                </div>
                {i < scenarios.length - 1 && <div className="mt-5 h-px bg-white/[0.03]" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Preview */}
      <section id="preview" className="border-t border-white/[0.04] py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.15em] uppercase text-white/30 mb-4">{t("preview.eyebrow")}</p>
            <h2 className="text-3xl md:text-5xl font-normal tracking-tight">
              {t("preview.titleA")} <span className="text-white/50">{t("preview.titleB")}</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-white/40 leading-relaxed">
              {t("preview.description")}
            </p>
          </div>
          <ReportMockup />
        </div>
      </section>

      {/* Capabilities */}
      <section id="capabilities" className="border-t border-white/[0.04] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.15em] uppercase text-white/30 mb-4">{t("capabilities.eyebrow")}</p>
            <h2 className="text-3xl md:text-5xl font-normal tracking-tight">
              {t("capabilities.titleA")} <span className="text-white/50">{t("capabilities.titleB")}</span>
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {capabilities.map((cap) => {
              const Icon = cap.icon
              return (
                <div
                  key={cap.key}
                  className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 hover:bg-white/[0.04] transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-white/[0.04] flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-white/40" />
                  </div>
                  <h3 className="text-base font-medium text-white/80 mb-2">{t(`capabilities.${cap.key}.title`)}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{t(`capabilities.${cap.key}.description`)}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-white/[0.04] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.15em] uppercase text-white/30 mb-4">{t("testimonials.eyebrow")}</p>
            <h2 className="text-3xl md:text-5xl font-normal tracking-tight">
              {t("testimonials.titleA")} <span className="text-white/50">{t("testimonials.titleB")}</span>
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((key) => (
              <div
                key={key}
                className="flex flex-col rounded-xl border border-white/[0.06] bg-white/[0.02] p-7"
              >
                <p className="text-3xl leading-none text-indigo-400/40">"</p>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-white/60">
                  {t(`testimonials.items.${key}.quote`)}
                </p>
                <div className="mt-6 border-t border-white/[0.06] pt-4">
                  <p className="text-sm font-medium text-white/80">{t(`testimonials.items.${key}.name`)}</p>
                  <p className="mt-0.5 text-xs text-white/30">{t(`testimonials.items.${key}.role`)}</p>
                  <p className="mt-2.5 inline-block rounded-full bg-emerald-400/10 px-3 py-1 text-[11px] font-medium text-emerald-300">
                    {t(`testimonials.items.${key}.metric`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-white/[0.04] py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-6">
            <p className="text-xs tracking-[0.15em] uppercase text-white/30 mb-4">{t("pricing.eyebrow")}</p>
            <h2 className="text-3xl md:text-5xl font-normal tracking-tight">
              {t("pricing.titleA")} <span className="text-white/50">{t("pricing.titleB")}</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-white/40">{t("pricing.subtitle")}</p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {(["free", "pro", "business"] as const).map((plan) => {
              const highlighted = plan === "pro"
              return (
                <div
                  key={plan}
                  className={cn(
                    "relative flex flex-col rounded-2xl border p-8",
                    highlighted
                      ? "border-indigo-400/40 bg-indigo-500/[0.06] shadow-2xl shadow-indigo-500/10"
                      : "border-white/[0.06] bg-white/[0.02]"
                  )}
                >
                  {highlighted && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-1 text-[11px] font-medium text-white">
                      {t("pricing.popular")}
                    </span>
                  )}
                  <h3 className="text-lg font-medium text-white/90">{t(`pricing.plans.${plan}.name`)}</h3>
                  <p className="mt-1 text-sm text-white/40">{t(`pricing.plans.${plan}.description`)}</p>
                  <p className="mt-5 text-4xl font-light text-white">
                    {t(`pricing.plans.${plan}.price`)}
                    <span className="ml-1 text-sm text-white/30">{t("pricing.perMonth")}</span>
                  </p>
                  <ul className="mt-7 flex-1 space-y-3">
                    {["0", "1", "2", "3", "4"].map((f) => {
                      const feature = t(`pricing.plans.${plan}.features.${f}`)
                      if (!feature || feature.startsWith("pricing.plans")) return null
                      return (
                        <li key={f} className="flex items-start gap-2.5 text-sm text-white/60">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                          {feature}
                        </li>
                      )
                    })}
                  </ul>
                  <Button
                    className={cn(
                      "mt-8 rounded-full h-11",
                      highlighted ? "bg-white text-black hover:bg-white/90" : "border-white/10 bg-white/[0.04] text-white/70 hover:bg-white/[0.08]"
                    )}
                    variant={highlighted ? "default" : "outline"}
                    onClick={goDiagnostic}
                  >
                    {t(`pricing.plans.${plan}.cta`)}
                  </Button>
                </div>
              )
            })}
          </div>
          <p className="mt-6 text-center text-xs text-white/25">{t("pricing.note")}</p>
        </div>
      </section>

      {/* Security */}
      <section className="border-t border-white/[0.04] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="text-xs tracking-[0.15em] uppercase text-white/30 mb-4">
                <ShieldCheck className="mr-1 inline h-4 w-4 text-emerald-400" />
                {t("security.eyebrow")}
              </p>
              <h2 className="text-3xl md:text-4xl font-normal tracking-tight">{t("security.title")}</h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-white/40">{t("security.description")}</p>
            </div>
            <div className="space-y-4">
              {securityItems.map((key) => {
                const icons = [Lock, FileDown, ShieldCheck]
                const Icon = icons[Number(key) - 1]
                return (
                  <div key={key} className="flex gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-400/10">
                      <Icon className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-white/80">{t(`security.items.${key}.title`)}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-white/40">{t(`security.items.${key}.text`)}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-white/[0.04] py-24">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.15em] uppercase text-white/30 mb-4">
              <HelpCircle className="mr-1 inline h-4 w-4" />
              {t("faq.eyebrow")}
            </p>
            <h2 className="text-3xl md:text-4xl font-normal tracking-tight">{t("faq.title")}</h2>
            <p className="mt-3 text-sm text-white/40">{t("faq.subtitle")}</p>
          </div>
          <div className="space-y-3">
            {faqItems.map((key) => {
              const open = openFaq === key
              return (
                <div key={key} className="rounded-xl border border-white/[0.06] bg-white/[0.02]">
                  <button
                    onClick={() => setOpenFaq(open ? null : key)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
                    aria-expanded={open}
                  >
                    <span className="text-sm font-medium text-white/80">{t(`faq.items.${key}.q`)}</span>
                    <ChevronDown className={cn("h-4 w-4 shrink-0 text-white/30 transition-transform", open && "rotate-180")} />
                  </button>
                  {open && (
                    <p className="px-6 pb-5 text-sm leading-relaxed text-white/45">{t(`faq.items.${key}.a`)}</p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-white/[0.04] py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-normal tracking-tight mb-6">
            {t("cta.titleA")} <span className="text-white/50">{t("cta.titleB")}</span>
          </h2>
          <p className="text-white/40 text-sm md:text-base max-w-md mx-auto mb-10 leading-relaxed">
            {t("cta.description")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              className="rounded-full bg-white px-8 h-12 text-sm font-medium text-black shadow-xl shadow-white/5 hover:bg-white/90"
              onClick={goDiagnostic}
            >
              {t("cta.viewProject")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="rounded-full px-8 h-12 border-white/10 text-white/50 hover:bg-white/[0.04] hover:border-white/20 text-sm"
              onClick={() => window.open("https://github.com/Kristine79/aibusinesscopilot", "_blank")}
            >
              GitHub
            </Button>
          </div>
          <p className="mt-4 text-xs text-white/25">{t("cta.microcopy")}</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] py-10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2.5">
              <Zap className="h-4 w-4 text-indigo-400" />
              <span className="text-sm text-white/40">{t("brand")}</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <Link to="/blog" className="text-xs text-white/25 hover:text-white/50 transition-colors">{t("footer.blog")}</Link>
              <a
                href="#pricing"
                onClick={(e) => { e.preventDefault(); scrollToId("pricing") }}
                className="text-xs text-white/25 hover:text-white/50 transition-colors"
              >
                {t("footer.pricing")}
              </a>
              <Link to="/privacy" className="text-xs text-white/25 hover:text-white/50 transition-colors">{t("footer.privacy")}</Link>
              <Link to="/terms" className="text-xs text-white/25 hover:text-white/50 transition-colors">{t("footer.terms")}</Link>
              <a
                href="https://github.com/Kristine79/aibusinesscopilot"
                className="text-xs text-white/25 hover:text-white/50 transition-colors"
              >
                GitHub
              </a>
              <LanguageSwitcher variant="dark" />
            </div>
          </div>
          <div className="mt-8 border-t border-white/[0.04] pt-6 text-center">
            <p className="text-xs text-white/20">{t("footer.text")}</p>
            <p className="mt-1.5 text-xs text-white/15">{t("footer.rights", { year: new Date().getFullYear() })}</p>
          </div>
        </div>
      </footer>

      {/* Sticky CTA */}
      {showSticky && !stickyDismissed && (
        <div className="fixed bottom-4 left-1/2 z-40 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 animate-slide-in-right">
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/[0.1] bg-[#12121a]/95 p-3 pl-5 shadow-2xl shadow-black/50 backdrop-blur">
            <p className="hidden text-sm text-white/70 sm:block">{t("hero.badge")}</p>
            <p className="text-sm text-white/70 sm:hidden">{t("miniDiag.title")}</p>
            <div className="flex items-center gap-2">
              <Button
                className="h-10 shrink-0 rounded-full bg-white px-5 text-sm font-medium text-black hover:bg-white/90"
                onClick={goDiagnostic}
              >
                {t("hero.ctaPrimary")}
              </Button>
              <button
                onClick={() => setStickyDismissed(true)}
                aria-label="Close"
                className="flex h-8 w-8 items-center justify-center rounded-full text-white/30 hover:text-white/70"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
