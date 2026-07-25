import { useState, useEffect } from "react"
import { ArrowRight, Search, Check, Zap, Database, FileText } from "lucide-react"

const MESSAGES = [
  { role: "user", text: "Show me a breakdown of active workflows and their success rates this week." },
  { role: "assistant", text: "This week, 47 active workflows completed 1,284 tasks with a 97.3% success rate. Three workflows require review." },
  { role: "user", text: "Which ones need attention?" },
  { role: "assistant", text: "Invoice processing (72%), customer onboarding (81%), report generation (88%)." },
]

const AGENT_STEPS = [
  { label: "Parse", state: "done" },
  { label: "Reason", state: "active" },
  { label: "Act", state: "pending" },
  { label: "Verify", state: "pending" },
]

const RAG_STEPS = [
  { icon: FileText, label: "Documents", detail: "Q3 reports, policies" },
  { icon: Search, label: "Vector Search", detail: "Semantic retrieval" },
  { icon: Database, label: "Context", detail: "Top-k results" },
]

const TOOLS = [
  { name: "Slack", type: "messaging" },
  { name: "Email", type: "communication" },
  { name: "CRM", type: "data" },
  { name: "Database", type: "storage" },
]

export default function AIAgents() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  return (
    <section className="relative z-10 px-6 md:px-8 py-24 md:py-32 overflow-hidden" id="capabilities">
      <div className="max-w-6xl mx-auto">
        <div className="text-left mb-16">
          <p
            className="text-xs tracking-[0.15em] uppercase text-foreground/30 mb-4"
            style={{ animation: mounted ? `fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s forwards` : "none", opacity: 0 }}
          >
            AI Capabilities
          </p>
          <h2
            className="font-heading text-3xl md:text-5xl font-normal tracking-tight max-w-2xl"
            style={{ animation: mounted ? `scaleIn 0.6s cubic-bezier(0.16,1,0.3,1) 0.15s forwards` : "none", opacity: 0 }}
          >
            AI capability <span className="text-foreground/50">ecosystem.</span>
          </h2>
        </div>

        <div className="space-y-10">
          <div
            className="glass-premium rounded-2xl overflow-hidden"
            style={{ animation: mounted ? `fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s forwards` : "none", opacity: 0 }}
          >
            <div className="flex items-center gap-2 px-5 py-2.5 border-b border-white/[0.04] bg-white/[0.02]">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-white/8" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/8" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/8" />
              </div>
              <span className="text-[10px] text-foreground/15 font-mono ml-3">AI Assistant — Conversational Interface</span>
              <span className="ml-auto flex items-center gap-1.5 text-[10px] text-foreground/15">
                <span className="w-1 h-1 rounded-full bg-indigo-400/50" />
                LLM: GPT-4
              </span>
            </div>
            <div className="p-5 md:p-6 space-y-3">
              {MESSAGES.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "items-start gap-3"}`}>
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Zap className="w-3.5 h-3.5 text-indigo-400/60" />
                    </div>
                  )}
                  <div className={`rounded-xl px-4 py-3 max-w-[80%] md:max-w-[70%] ${
                    msg.role === "user"
                      ? "bg-indigo-500/15 border border-indigo-500/20"
                      : "bg-white/[0.04] border border-white/[0.06]"
                  }`}>
                    <p className="text-sm text-foreground/65 leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-2 pt-2 border-t border-white/[0.04]">
                <div className="flex-1 rounded-lg bg-white/[0.03] border border-white/[0.06] px-4 py-2.5">
                  <p className="text-sm text-foreground/20">Ask about your workflows, data, or business operations...</p>
                </div>
                <button className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors" aria-label="Send message">
                  <ArrowRight className="w-4 h-4 text-foreground/30" />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              className="glass-premium rounded-2xl p-6"
              style={{ animation: mounted ? `fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.25s forwards` : "none", opacity: 0 }}
            >
              <div className="flex items-center gap-2 mb-5">
                <div className="w-2 h-2 rounded-full bg-indigo-400/40" />
                <span className="text-xs font-medium text-foreground/60">AI Agents</span>
                <span className="ml-auto text-[10px] text-foreground/15 font-mono">Task Execution Pipeline</span>
              </div>
              <div className="flex items-center justify-between gap-2 mb-5">
                {AGENT_STEPS.map((step, i) => (
                  <div key={step.label} className="flex-1">
                    <div className={`text-center rounded-md px-2 py-2 text-xs font-mono transition-colors ${
                      step.state === "done" ? "bg-indigo-500/20 text-indigo-300/80 border border-indigo-500/20" :
                      step.state === "active" ? "bg-indigo-500/30 text-indigo-200 border border-indigo-400/30" :
                      "bg-white/[0.03] text-foreground/25 border border-white/[0.05]"
                    }`}>
                      <div className="flex items-center justify-center gap-1">
                        {step.state === "done" && <Check className="w-3 h-3" />}
                        <span>{step.label}</span>
                      </div>
                    </div>
                    {i < AGENT_STEPS.length - 1 && (
                      <div className="flex justify-center mt-1">
                        <ArrowRight className={`w-3 h-3 ${step.state === "done" ? "text-indigo-400/40" : "text-foreground/10"}`} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="h-px bg-white/[0.04] mb-4" />
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-foreground/35">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400/30" />
                  Plans multi-step tasks with tool calling
                </div>
                <div className="flex items-center gap-2 text-xs text-foreground/35">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400/30" />
                  Reasons through complex business logic
                </div>
                <div className="flex items-center gap-2 text-xs text-foreground/35">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400/30" />
                  Executes actions across integrated tools
                </div>
              </div>
            </div>

            <div
              className="glass-premium rounded-2xl p-6"
              style={{ animation: mounted ? `fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.3s forwards` : "none", opacity: 0 }}
            >
              <div className="flex items-center gap-2 mb-5">
                <div className="w-2 h-2 rounded-full bg-purple-400/40" />
                <span className="text-xs font-medium text-foreground/60">RAG Knowledge Base</span>
                <span className="ml-auto text-[10px] text-foreground/15 font-mono">Doc → Retrieval → Answer</span>
              </div>
              <div className="flex items-center justify-between gap-3 mb-5">
                {RAG_STEPS.map((step, i) => {
                  const Icon = step.icon
                  return (
                    <div key={step.label} className="flex-1 text-center">
                      <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] px-3 py-3 mb-1.5">
                        <Icon className="w-4 h-4 mx-auto text-foreground/30" />
                      </div>
                      <p className="text-[10px] text-foreground/40 font-medium">{step.label}</p>
                      <p className="text-[9px] text-foreground/20 mt-0.5 font-mono">{step.detail}</p>
                      {i < RAG_STEPS.length - 1 && (
                        <div className="flex justify-center mt-1">
                          <ArrowRight className="w-3 h-3 text-foreground/10" />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
              <div className="h-px bg-white/[0.04] mb-4" />
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 rounded-lg bg-white/[0.03] border border-white/[0.04] px-3 py-2">
                  <FileText className="w-3 h-3 text-foreground/20 shrink-0" />
                  <span className="text-[11px] text-foreground/45 truncate">Q3_report_2026_final.pdf</span>
                  <span className="ml-auto text-[10px] text-foreground/15">92% match</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-indigo-500/5 border border-indigo-500/10 px-3 py-2">
                  <FileText className="w-3 h-3 text-indigo-400/40 shrink-0" />
                  <span className="text-[11px] text-indigo-300/60 truncate">revenue_breakdown_q3.md</span>
                  <span className="ml-auto text-[10px] text-indigo-400/30">87% match</span>
                </div>
              </div>
            </div>
          </div>

          <div
            className="glass-premium rounded-2xl p-6"
            style={{ animation: mounted ? `fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.35s forwards` : "none", opacity: 0 }}
          >
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2 h-2 rounded-full bg-emerald-400/40" />
              <span className="text-xs font-medium text-foreground/60">Workflow Automation</span>
              <span className="ml-auto text-[10px] text-foreground/15 font-mono">Tool Orchestration Pipeline</span>
            </div>
            <div className="flex items-center justify-center gap-2 md:gap-4">
              {TOOLS.map((tool, i) => (
                <div key={tool.name} className="flex items-center gap-2 md:gap-4">
                  <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] px-4 py-3 text-center">
                    <p className="text-xs text-foreground/50 font-medium">{tool.name}</p>
                    <p className="text-[9px] text-foreground/20 mt-0.5 font-mono">{tool.type}</p>
                  </div>
                  {i < TOOLS.length - 1 && (
                    <div className="flex items-center gap-1">
                      <div className="w-6 h-px bg-white/[0.08] hidden md:block" />
                      <ArrowRight className="w-3 h-3 text-foreground/15 shrink-0" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}