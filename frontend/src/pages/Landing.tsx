import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  MessageCircle,
  Bot,
  BookOpen,
  Workflow,
  Zap,
} from "lucide-react"

const capabilities = [
  {
    icon: MessageCircle,
    title: "AI Assistant",
    description: "LLM-based conversational AI that helps users complete business tasks faster — from answering questions to generating reports.",
  },
  {
    icon: Bot,
    title: "AI Agents",
    description: "Agentic workflows that reason, plan, and execute multi-step tasks using tool calling and orchestration patterns.",
  },
  {
    icon: BookOpen,
    title: "RAG Knowledge Base",
    description: "Vector search and context retrieval that lets AI understand company information and provide accurate, sourced answers.",
  },
  {
    icon: Workflow,
    title: "Workflow Automation",
    description: "Connect business tools and automate repetitive processes through configurable AI-powered workflow pipelines.",
  },
]

const steps = [
  {
    step: "01",
    title: "Business Assessment",
    description: "Multi-step diagnostic collects information about your business processes, team, and tools.",
  },
  {
    step: "02",
    title: "AI Analysis",
    description: "Multi-LLM orchestration analyzes your data and identifies automation opportunities.",
  },
  {
    step: "03",
    title: "Actionable Report",
    description: "Detailed automation roadmap with specific recommendations and expected impact.",
  },
]

const scenarios = [
  {
    title: "Research Assistant",
    before: "Manual research and information gathering",
    after: "AI analysis processes and summarizes documents automatically",
    outcome: "Insights delivered in minutes instead of hours",
  },
  {
    title: "Operations Assistant",
    before: "Manual operational tasks across disconnected systems",
    after: "AI workflows connect tools and execute processes autonomously",
    outcome: "Operational overhead reduced by 70%",
  },
  {
    title: "Content Assistant",
    before: "Manual content creation and formatting",
    after: "AI generates on-brand materials from templates",
    outcome: "Production time cut by 80%",
  },
  {
    title: "Knowledge Assistant",
    before: "Searching documents and wikis manually",
    after: "RAG retrieves exact answers with source attribution",
    outcome: "Instant access to company knowledge",
  },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#f5f5f7]">
      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <Zap className="h-5 w-5 text-indigo-400" />
            <span className="text-sm font-medium tracking-tight">AI Business Copilot</span>
          </div>
          <nav className="hidden items-center gap-8 sm:flex">
            <a href="#capabilities" className="text-sm text-white/50 hover:text-white/80 transition-colors">Capabilities</a>
            <a href="#how" className="text-sm text-white/50 hover:text-white/80 transition-colors">How It Works</a>
            <a href="#scenarios" className="text-sm text-white/50 hover:text-white/80 transition-colors">Scenarios</a>
            <Button
              variant="default"
              className="bg-white text-black hover:bg-white/90 rounded-full px-5 h-9 text-sm font-medium"
              onClick={() => navigate("/diagnostic")}
            >
              Try Live Demo
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden pt-36 pb-24">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/20 via-[#0a0a0f] to-[#0a0a0f]" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="mx-auto max-w-5xl px-6 text-center relative">
          <div className="animate-fade-in mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-4 py-1.5 text-xs text-white/40 tracking-[0.12em] uppercase">
            Portfolio Project &bull; AI Automation Platform
          </div>

          <h1 className="animate-slide-up font-heading text-5xl font-normal tracking-tight sm:text-6xl md:text-7xl lg:text-8xl leading-[0.92]">
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(to left, #6366f1, #a855f7, #fcd34d)" }}
            >
              AI
            </span>{" "}
            <span className="text-[#f5f5f7]">Business Copilot</span>
          </h1>

          <p className="animate-fade-in mx-auto mt-6 max-w-xl text-base text-white/50 leading-relaxed sm:text-lg">
            An intelligent AI assistant that helps automate workflows, analyze information, and turn business data into actionable insights.
          </p>

          <div className="animate-slide-up mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              className="bg-white text-black hover:bg-white/90 rounded-full px-8 h-12 text-sm font-medium shadow-xl shadow-white/5"
              onClick={() => document.getElementById("capabilities")?.scrollIntoView({ behavior: "smooth" })}
            >
              Explore Capabilities
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="rounded-full px-8 h-12 border-white/10 text-white/50 hover:bg-white/[0.04] hover:border-white/20 text-sm"
              onClick={() => navigate("/diagnostic")}
            >
              Try Live Demo
            </Button>
          </div>

          <div className="animate-fade-in mt-8 flex items-center justify-center gap-4 text-xs text-white/25">
            <span>AI Agents</span>
            <span className="w-1 h-1 rounded-full bg-white/10" />
            <span>RAG Knowledge Base</span>
            <span className="w-1 h-1 rounded-full bg-white/10" />
            <span>Workflow Automation</span>
            <span className="w-1 h-1 rounded-full bg-white/10" />
            <span>Business Intelligence</span>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section id="capabilities" className="border-t border-white/[0.04] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.15em] uppercase text-white/30 mb-4">AI Capabilities</p>
            <h2 className="text-3xl md:text-5xl font-normal tracking-tight">
              AI capability <span className="text-white/50">ecosystem.</span>
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {capabilities.map((cap) => {
              const Icon = cap.icon
              return (
                <div
                  key={cap.title}
                  className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 hover:bg-white/[0.04] transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-white/[0.04] flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-white/40" />
                  </div>
                  <h3 className="text-base font-medium text-white/80 mb-2">{cap.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{cap.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-t border-white/[0.04] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.15em] uppercase text-white/30 mb-4">Process</p>
            <h2 className="text-3xl md:text-5xl font-normal tracking-tight">
              From assessment to <span className="text-white/50">action.</span>
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <div key={step.step} className="relative rounded-xl border border-white/[0.06] bg-white/[0.015] p-8 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.04] text-sm font-mono text-white/30">
                  {step.step}
                </div>
                <h3 className="mb-2 text-lg font-medium text-white/80">{step.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{step.description}</p>
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
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.15em] uppercase text-white/30 mb-4">Business Scenarios</p>
            <h2 className="text-3xl md:text-5xl font-normal tracking-tight">
              From manual to <span className="text-white/50">automated.</span>
            </h2>
          </div>
          <div className="space-y-1">
            {scenarios.map((item, i) => (
              <div key={item.title} className="group rounded-xl hover:bg-white/[0.015] transition-colors -mx-4 px-4 py-5">
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-0">
                  <div className="md:w-48 shrink-0">
                    <span className="text-sm font-medium text-white/80">{item.title}</span>
                  </div>
                  <div className="hidden md:flex items-center px-3">
                    <ArrowRight className="w-3 h-3 text-white/10" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white/30 leading-relaxed line-through decoration-white/5">
                      {item.before}
                    </p>
                  </div>
                  <div className="hidden md:flex items-center px-3">
                    <ArrowRight className="w-3 h-3 text-indigo-400/20" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-indigo-300/40 leading-relaxed">{item.after}</p>
                  </div>
                  <div className="hidden md:flex items-center px-3">
                    <ArrowRight className="w-3 h-3 text-emerald-400/20" />
                  </div>
                  <div className="md:w-48 shrink-0">
                    <p className="text-xs text-emerald-300/40 font-medium">{item.outcome}</p>
                  </div>
                </div>
                {i < scenarios.length - 1 && <div className="mt-5 h-px bg-white/[0.03]" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/[0.04] py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-normal tracking-tight mb-6">
            Building practical AI solutions{" "}
            <span className="text-white/50">for modern businesses.</span>
          </h2>
          <p className="text-white/40 text-sm md:text-base max-w-md mx-auto mb-10 leading-relaxed">
            A full-stack AI automation platform with multi-LLM orchestration, RAG knowledge retrieval, and agentic workflow execution.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              className="bg-white text-black hover:bg-white/90 rounded-full px-8 h-12 text-sm font-medium shadow-xl shadow-white/5"
              onClick={() => navigate("/diagnostic")}
            >
              View Project
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="rounded-full px-8 h-12 border-white/10 text-white/50 hover:bg-white/[0.04] hover:border-white/20 text-sm"
              onClick={() => window.open("https://github.com", "_blank")}
            >
              GitHub
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] py-8 text-center">
        <div className="flex items-center justify-center gap-6 mb-4">
          <a href="#" className="text-xs text-white/15 hover:text-white/30 transition-colors">GitHub</a>
          <a href="#" className="text-xs text-white/15 hover:text-white/30 transition-colors">Portfolio</a>
          <a href="#" className="text-xs text-white/15 hover:text-white/30 transition-colors">Contact</a>
        </div>
        <p className="text-xs text-white/8">AI Business Copilot — AI Product Engineering Case Study</p>
      </footer>
    </div>
  )
}